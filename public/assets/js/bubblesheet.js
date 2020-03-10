$(() => {
let $examSelect = $('#exam-select');
let $sectionSelect = $('#section-select');
let $makeBubbleBtn = $('#makeBubbleBtn');
let $bubbleCont = $('#bubbleContainer');
const $bubbleForm = $('#answer-sheet');
let routeURL;

$bubbleForm.on('submit', e => {
    e.preventDefault;

    // submit the answers to the appropriate route
});

//populate exam list
$.ajax({
    method: 'GET',
    url: '/api/exams'
}).then(results => {
    results.forEach(test => {
        let $option = $('<option>')
            .attr({
                'id': test.type+test.id,
                'data-test-id': test.id,
                'data-test-type': test.type,
            })
            .text(test.exam);

        $examSelect.append($option);
    });

});

//populate section list
$examSelect.on('change', function(event) {
    event.preventDefault();
    console.log($examSelect.val());

    var testID = $(this).find(':selected').data('test-id');
    let sectionAPIquery = `/api/exams/sections/${testID}`
    console.log(sectionAPIquery);

    $.ajax({
        method: 'GET',
        url: sectionAPIquery
    }).then(sections => {
        $sectionSelect.removeClass('d-none');
        routeURL = `/api/exams/${testID}/questions/all`;
        $makeBubbleBtn.removeAttr('href').attr({
            'href': routeURL
        });
        $makeBubbleBtn.removeClass('d-none');
        $sectionSelect.empty();
        $sectionSelect.append($('<option>').text('All Sections'));

        sections.forEach(section => {
            let sectionName = section.section.substr(0,1).toUpperCase()+section.section.substr(1)
            
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
$sectionSelect.on('change', function(e) {
    e.preventDefault();
    let testID = $examSelect.find(':selected').data('test-id');
    let section = $sectionSelect.find(':selected').data('section');
    routeURL = `/api/exams/${testID}/questions/${section}`;
    $makeBubbleBtn.removeAttr('href').attr({
        'href': routeURL
    });
});

//Custom Bubblesheet Selection
let i = 0;
    let $document = $(document);
    let $mcButton = $('.mc-letter-btn');
    let $collectButton = $('.collect');
    let $qRow = $('.q-row');
    
    $mcButton.on('click', function(e) {
        e.preventDefault();
        i = parseInt($(this).parent().siblings('.mc-bs-qnum').text()) - 1;
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            $(this).parent().siblings('.mc-answer').text(' ');
        } else {
            $(this).parent().children().removeClass('selected');
            $(this).addClass('selected');
            $(this).parent().siblings('.mc-answer').text($(this).text());
            i++
        }
    });
    
    $document.keydown(function(e) {
        let key = event.which || event.keyCode;
        switch (key) {
            case 65:
                $qRow.eq(i).find('.mc-letter-btn').eq(0).trigger('click');
                break;
            case 66:
                $qRow.eq(i).find('.mc-letter-btn').eq(1).trigger('click');
                break;
            case 67:
                $qRow.eq(i).find('.mc-letter-btn').eq(2).trigger('click');
                break;
            case 68:
                $qRow.eq(i).find('.mc-letter-btn').eq(3).trigger('click');
                break;
            case 8:
                i--;
                if( i < 0 ){ i = 0; }
                $qRow.eq(i).find('.mc-letter-btn').parent().children().removeClass('selected');
                $qRow.eq(i).find('.mc-letter-btn').parent().siblings('.mc-answer').text(' ');
                break;
        }
    })
    
    $collectButton.on('click', function(e) {
        e.preventDefault();
        let ansStr = $('.mc-body').find('.mc-answer').text();
        let ansArr = ansStr.split('');
        console.log(ansArr);
    });



});