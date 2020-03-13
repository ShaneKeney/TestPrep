const examsEl = $('#formControlSelect1');
const sectionsEl = $('#formControlSelect2');
var userId;
var userName;
var authToken;

// get a cookie by it's name
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
var user = getCookie('user');
// this if block may not be needed if the entire page 
// becomes only valid when user is logged in
if (user) {
    // get id and user name from the cookie object
    authToken = JSON.parse(user).token;
    user = JSON.parse(user).user;
    userId = user.id;
    userName = user.first_name + ' ' + user.last_name;
    $('#prevExamSection').show();
    
} else {
    $('#prevExamSection').hide();
}

// go and get the list of exams this user has already taken
var urlPreviousExam = '/api/prevexams';
//console.log(urlPreviousExam)
$.ajax({
    method: 'GET',
    url: urlPreviousExam,
    headers: {
        'Authorization': `Bearer ${authToken}`
    }
}).then(tests => {
    //console.log('resolve')
    // update selections based on returned list of exams
    if (tests.length === 0) {
        examsEl.children('option').text('None Taken Yet');
    }
    tests.forEach(e => {
        examsEl.append($('<option>').attr("data-testid", e.testID).text(e.exam));
    });
});

// put the user's name on the page
$('#formControlInput1').text(userName);
// once user selects a previously completed test
$('#formControlSelect1').on('input', function (event) {
    event.preventDefault();
    if ($(this).children('option:selected').attr('data-testid')) {
        // show or hide the test section area based on having selected a valid test
        $('#formSections').removeClass('d-none');

        // get the test id of the selection 
        var testId = $(this).children('option:selected').attr('data-testid');
        // query the database for the list of sections in that test
        var urlPreviousSections = `/api/sections/${userId}/${testId}`;
        $.ajax({
            method: 'GET',
            url: urlPreviousSections,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }).then(sections => {
            // populate each section name
            sections.forEach(e => {
                sectionsEl.append($('<option>').text(e));
            });
        });
    } else {
        $('#formSections').addClass('d-none');
    }
});


// upon user selection of a test section (or all)
// redirect to the report page
$('#formControlSelect2').on('input', function (event) {
    event.preventDefault();
    var testId = $('#formControlSelect1 > option:selected').attr("data-testid");
    var section = $(this).children('option:selected').text();
    location.replace(`/reports/${userId}/${testId}/${section}`);
});


///////////////////////////////////////////////////
// FOR REPORT PAGE Partial

// allows user to go back to previous
// tests with all of their original answers filled in
$('#allSections, #thisSection').on('click', function (event) {
    event.preventDefault();
    // get user id and test id from the current address
    var endAddr = location.href.split('reports/');
    var userId = endAddr[1].split('/')[0];
    var testId = endAddr[1].split('/')[1];
    var section = $(this).attr('data-section');
    if (!section) section = 'all';
    // if user chooses math, display a modal to ask if they want
    // calc or no calc math.
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
    // get all of the user's previous answers for that test
    function getPrevSections() {
        $.ajax({
            method: 'GET',
            url: `/api/prevSections/${userId}/${testId}`,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }).then(response => {
            // save the answers to local storage so it can be retrieved after page load
            localStorage.setItem('prevAnswers', JSON.stringify(response));
            // redirect to the bubblesheet page
            location.replace(`/bubblesheet/exams/${testId}/questions/${section}`);
        });
    }

});