const numArr = ['', '.', '/', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

$(() => {
    // const numChoices = $('.number-choices');

    // for (let i = 0; i < 4; i++) {
    //     const colEl = $('<div class="col-auto">');
    //     const selEl = $('<select class="form-control">');
        
    //     numArr.forEach(item => {
    //         const optionEl = $('<option>');
    //         $(optionEl).text(item);
    //         $(selEl).append(optionEl);
    //     });

    //     $(colEl).append(selEl);
    //     $(numChoices).append(colEl);
    // }

    $('#signin-form').on('submit', e => {
        e.preventDefault();

        const userData = {
            email: $('#signin-email').val().trim(),
            password: $('#signin-password').val().trim()
        };

        $.post('/api/users/login', userData)
        .then(function(res) {
            console.log(res)
        })
        .catch(function(err) {
            console.log(err)
        })
    });

    $('#register-form').on('submit', e => {
        e.preventDefault();

        // make sure new password matches confirm password
        if ($('#register-password').val() === $('#confirm-password').val()) {
            const userData = {
                firstName: $('#register-firstName').val().trim(),
                lastName: $('#register-lastName').val().trim(),
                email: $('#register-email').val().trim(),
                phone: $('#register-phone').val().trim(),
                password: $('#register-password').val().trim(),
                confirmPassword: $('#confirm-password').val().trim()
            };
    
            $.post('/api/register', userData)
            .then(function(res) {
                console.log(res); //log the response to see what is happening
                resetRegisterFields();
            })
            .catch(function(err) {
                if(err.responseJSON.errors[0].message === "students.email must be unique") {
                    $('#regErrorText').text('Email already registered'); 
                }
            })

            $('#password-mismatch').addClass('d-none');
        } else {
            $('#password-mismatch').removeClass('d-none');
        }
    });

    $('#regClose').on('click', function() {
        $('#regErrorText').text(''); 
        resetRegisterFields();
    })
});

function resetRegisterFields() {
    $('#register-firstName').val('');
    $('#register-lastName').val('');
    $('#register-email').val('');
    $('#register-phone').val('');
    $('#register-password').val('');
    $('#confirm-password').val('');

    $('#register-modal').modal('hide');
    $('#regErrorText').val('');
}
