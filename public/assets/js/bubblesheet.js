$(() => {
let $examSelect = $('#exam-select');
let $sectionSelect = $('#section-select');
let $makeBubbleBtn = $('#makeBubbleBtn');
let $bubbleCont = $('#bubbleContainer');

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
$makeBubbleBtn.on('click', function(event) {
    event.preventDefault();
    let testID = $examSelect.find(':selected').data('test-id');
    let section = $sectionSelect.find(':selected').data('section');
    
    console.log(testID, section);

    let queryURL = `/api/exams/${testID}/questions/mc/${section}`;

    $.ajax({
        method: 'GET',
        url: queryURL
    });

})


});