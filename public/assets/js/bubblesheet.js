$(() => {

    console.log('test');

    $.ajax({
        method: 'GET',
        url: '/api/exams/'
    }).then(results => {

    })

});