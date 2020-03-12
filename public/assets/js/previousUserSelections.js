const examsEl = $('#formControlSelect1');
const sectionsEl = $('#formControlSelect2');

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
var user = JSON.parse(getCookie('user')).user;
var userId = user.id;
var userName = user.first_name + ' ' + user.last_name;


var urlPreviousExam = '/api/prevexams/' + userId;

$.ajax({
    method: 'GET',
    url: urlPreviousExam
}).then(tests => {
    if (tests.length === 0) {
        examsEl.children('option').text('None Taken Yet');
    }
    tests.forEach(e => {
        examsEl.append($('<option>').attr("data-testid", e.testID).text(e.exam));
    });
});

$('#formControlInput1').val(userName);

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
            sectionsEl.append($('<option>').text(e));
        });
    });
});



$('#formControlSelect2').on('input', function (event) {
    event.preventDefault();
    var testId = $('#formControlSelect1 > option:selected').attr("data-testid");
    var section = $(this).children('option:selected').text();
    location.replace(`/reports/${userId}/${testId}/${section}`);
});

$('#allSections, #thisSection').on('click', function (event) {
    event.preventDefault();
    var endAddr = location.href.split('reports/');
    var userId = endAddr[1].split('/')[0];
    var testId = endAddr[1].split('/')[1];
    var section = $(this).attr('data-section');
    if (!section) section = 'all';
    if (section === 'math') {
        $('#mathModal').modal();
        $('.mathChoice').on('click', function (event) {
            event.preventDefault();
            section = $(this).attr('data-section');
            getPrevSections();
        })
    } else {
        getPrevSections();
    }

    function getPrevSections() {
        $.ajax({
            method: 'GET',
            url: `/api/prevSections/${userId}/${testId}`
        }).then(response => {
            localStorage.setItem('prevAnswers', JSON.stringify(response));
            console.log(response);
            location.replace(`/api/exams/${testId}/questions/${section}`);
        });
    }

});