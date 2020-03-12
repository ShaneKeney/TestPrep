const examsEl = $('#formControlSelect1');
const sectionsEl = $('#formControlSelect2');
var userId = 2;
var urlPreviousExam = '/api/prevexams/' + userId;

$.ajax({
    method: 'GET',
    url: urlPreviousExam
}).then(tests => {
    tests.forEach(e => {
        examsEl.append($('<option>').attr("data-testid", e.testID).text(e.exam));
    });
});

$('#formControlSelect1').on('input', function (event) {
    event.preventDefault();
    if ($(this).children('option:selected').attr('data-testid')) {
        $('#formSections').removeClass('d-none');
    } else {
        $('#formSections').addClass('d-none');
    }
    var testId = $(this).children('option:selected').attr('data-testid');
    var urlPreviousSections = `/api/sections/${userId}/${testId}`;
    $.ajax({
        method: 'GET',
        url: urlPreviousSections
    }).then(sections => {
        sections.forEach(e => {
            console.log(e);
            sectionsEl.append($('<option>').text(e));
        });
    });
});

$('#formControlSelect2').on('input',function(event) {
    event.preventDefault();
    var testId = $('#formControlSelect1 > option:selected').attr("data-testid");
    var section = $(this).children('option:selected').text();
    location.replace(`/reports/${userId}/${testId}/${section}`);
});

$('#allSections, #thisSection').on('click',function(event){
    // need to make the user and test parameters dynamic after it works
    var endAddr = location.href.split('reports/');
    var userId = endAddr[1].split('/')[0];
    var testId = endAddr[1].split('/')[1];
    var section = $(this).attr('data-section');
    if (!section) section = 'all';
    event.preventDefault();
    $.ajax({
        method: 'GET',
        url: `/api/prevSections/${userId}/${testId}`
    }).then(response=>{
         localStorage.setItem('prevAnswers',JSON.stringify(response));
        console.log(response);
        location.replace(`/api/exams/${testId}/questions/${section}`);
    });
});