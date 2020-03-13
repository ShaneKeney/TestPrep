$(() => {
    let $document = $(document);
    let $examSelect = $('#exam-select');
    let $sectionSelect = $('#section-select');
    let $makeBubbleBtn = $('#makeBubbleBtn');
    //bubblehseets
    let $qRow = $('.q-row');
    let $mcButton = $('.mc-letter-btn');
    let $mcTable = $('.mc-bubblesheet');
    let $gridSelect = $('.gi-select');
    let $collectButton = $('.collect');
    let routeURL;
    let i = 0;

    // get a cookie by it's name
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    let user, userParsed, authToken;
    try {
        user = getCookie('user');
        userParsed = JSON.parse(user);
        // get id and user name from the cookie object
        authToken = JSON.parse(user).token;
    } catch (err) {
        //console.log('cookie no exist!')
    }

    //populate exam list
    $.ajax({
        method: 'GET',
        url: '/api/exams',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }).then(results => {
        results.forEach(test => {
            let $option = $('<option>')
                .attr({
                    'id': test.type + test.id,
                    'data-test-id': test.id,
                    'data-test-type': test.type,
                })
                .text(test.exam);

            $examSelect.append($option);
        });

    });

    //populate section list
    $examSelect.on('change', function (event) {
        event.preventDefault();
        ////console.log(authToken);

        var testID = $(this).find(':selected').data('test-id');
        let sectionAPIquery = `/api/exams/sections/${testID}`
        ////console.log(sectionAPIquery);

        $.ajax({
            method: 'GET',
            url: sectionAPIquery,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }).then(sections => {
            $sectionSelect.removeClass('d-none');
            routeURL = `/bubblesheet/exams/${testID}/questions/all`;
            $makeBubbleBtn.removeAttr('href').attr({
                'href': routeURL
            });
            $makeBubbleBtn.removeClass('d-none');
            $sectionSelect.empty();
            $sectionSelect.append($('<option>').text('All Sections'));

            sections.forEach(section => {
                let sectionName = section.section.substr(0, 1).toUpperCase() + section.section.substr(1)

                if (sectionName === 'MathNC') {
                    sectionName = 'Math No Calculator'
                } else if (sectionName === 'MathC') {
                    sectionName = 'Math Calculator'
                }

                let $option = $('<option>').attr({
                    'data-section': section.section
                })
                    .text(sectionName);

                $sectionSelect.append($option);
            })
        })
    })

    //populate bubble sheet
    ///api/exams/1/questions/ma
    $sectionSelect.on('change', function (e) {
        e.preventDefault();
        let testID = $examSelect.find(':selected').data('test-id');
        let section = $sectionSelect.find(':selected').data('section');
        const sections = ['reading', 'writing', 'mathNC', 'mathC'];
        if (!sections.includes(section)) section = 'all';
        routeURL = `/bubblesheet/exams/${testID}/questions/${section}`;
        $makeBubbleBtn.removeAttr('href').attr({
            'href': routeURL
        });
    });


    $mcButton.on('click', function (e) {
        e.preventDefault();
        $(this).focus();
        i = parseInt($(this).parent().siblings('.mc-bs-qnum').text()) - 1;
        $qRow = $(this).parentsUntil('.mc-column').find('.q-row');
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $(this).parent().siblings('.mc-answer').text(' ');
        } else {
            $(this).parent().children().removeClass('selected');
            $(this).addClass('selected');
            $(this).parent().siblings('.mc-answer').text($(this).text());
            i++
        }
    });

    $document.keydown(function (e) {
        let key = event.which || event.keyCode;
        switch (key) {
            case 65:
            case 49:
                $qRow.eq(i).find('.mc-letter-btn').eq(0).trigger('click');
                break;
            case 66:
            case 50:
                $qRow.eq(i).find('.mc-letter-btn').eq(1).trigger('click');
                break;
            case 67:
            case 51:
                $qRow.eq(i).find('.mc-letter-btn').eq(2).trigger('click');
                break;
            case 68:
            case 52:
                $qRow.eq(i).find('.mc-letter-btn').eq(3).trigger('click');
                break;
            case 8:
            case 46:
                i--;
                if (i < 0) { i = 0; }
                $qRow.eq(i).find('.mc-letter-btn').parent().children().removeClass('selected');
                $qRow.eq(i).find('.mc-letter-btn').parent().siblings('.mc-answer').text(' ');
                break;
        }
    })

    $gridSelect.on('change', function (e) {
        e.preventDefault();
        let $ansTd = $(this).parentsUntil('.q-row').siblings('.gi-answer');
        $ansTd.empty();
        let ansStr = $(this).parentsUntil('.gi-bs-choices').find('.gi-select').find(':selected').text();
        $ansTd.text(ansStr);
    })

    $collectButton.on('click', async function (e) {
        e.preventDefault();
        let section = $(this).data('test-section');
        let results = await collectAns(section);
        $.ajax('/api/results', {
            method: 'POST',
            data: JSON.stringify(results),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function () {
                alert("Error");
            },
            success: function () {
                alert("OK");
            },
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }).then(function () {
            //console.log("Entered Results");
            // location.reload();
        });
    });

    async function collectAns(section) {
        let id = $mcTable.data('test-id');
        let $mcTable = $(`.mc-bubblesheet[data-test-section="${section}"]`);
        let ansStr = $mcTable.find('.mc-answer').text();
        let ansArr = ansStr.split('');
        let giRows = $mcTable.find('.gi-answer');
        let giArrFractions = [];
        let giArrDecimals = [];
        giArrFractions = await collectGridInAnswers(giRows);
        giArrDecimals = await fractionToDecimal(giArrFractions);
        let allAnswersArr = ansArr.concat(giArrDecimals);
        let data = [];
        allAnswersArr.forEach((value, index) => {
            let obj = {
                'StudentId': userParsed.user.id,
                'TestId': id,
                'section': section,
                'question_number': index + 1,
                'answer_response': value,
            };
            data.push(obj);
        });
        return data;
    };

    async function collectGridInAnswers(rows) {
        let outputArr = []
        for (i = 0; i < rows.length; i++) {
            outputArr.push(rows[i].textContent)
        }
        return outputArr;
    }

    async function fractionToDecimal(array) {
        let outputArr = [];
        array.forEach(num => {
            if (num.includes('/')) {
                let numDenomArr = num.split('/');
                let numerator = parseInt(numDenomArr[0]);
                let denominator = parseInt(numDenomArr[1]);
                let ans = numerator / denominator;
                outputArr.push(Math.round(1000 * ans) / 1000);
            } else if (num.indexOf('/') === -1) {
                outputArr.push(num);
            } else {
                outputArr.push(" ");
            }
        });
        return outputArr;
    };


    $(document).ready(() => {
        if (localStorage.getItem('prevAnswers') !== null) {
            var prevAnswers = JSON.parse(localStorage.getItem('prevAnswers'));
            prevAnswers.forEach(v => {
                var section = v.section;
                var qNum = v.question_number;
                var answ = v.answer_response;
                if (answ === 'A' || answ === 'B' || answ === 'C' || answ === 'D') {
                    $(`#${section}-${qNum} > td > .ltr-btn-${answ}`).addClass('selected');
                    $(`#${section}-${qNum} > td.mc-answer`).text(answ);
                } else {

                }

            })
            // this is to clean up, but then page reload won't populate
            // possibly should be a more permanent object, it would have the user and test ids...
            localStorage.removeItem('prevAnswers');
        }
    });
});