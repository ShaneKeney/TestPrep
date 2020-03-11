const numArr = ['', '.', '/', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const phoneArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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

        $('#password-mismatch').addClass('d-none');
        $('#invalid-email').addClass('d-none');
        $('#invalid-phone').addClass('d-none');

        const userData = {
            firstName: $('#register-firstName').val().trim(),
            lastName: $('#register-lastName').val().trim(),
            email: $('#register-email').val().trim(),
            phone: $('#register-phone').val().trim(),
            password: $('#register-password').val().trim(),
            confirmPassword: $('#confirm-password').val().trim()
        }

        const validateEmail = () => {
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(userData.email);
        }

        const validatePhone = () => {
            let registerPhone = '';
            userData.phone.split('').forEach(char => {
                if (phoneArr.includes(char)) {
                    registerPhone += char;
                    console.log(registerPhone);
                    console.log(registerPhone.length);
                }
            });

            userData.phone = registerPhone;

            return registerPhone.length === 10 ? true : false;
        }

        if (userData.password === userData.confirmPassword && validateEmail() && validatePhone()) {
            $.post('/api/register', userData)
            .then(function(res) {
                console.log(res); //log the response to see what is happening
                resetRegisterFields();
            })
            .catch(function(err) {
                if(err.responseJSON.errors[0].message === "students.email must be unique") {
                    $('#regErrorText').text('Email already registered'); 
                }
            });
            location.reload();
        } else {
            if (userData.password !== userData.confirmPassword) 
                $('#password-mismatch').removeClass('d-none');
            if (!validateEmail())
                $('#invalid-email').removeClass('d-none');
            if (!validatePhone())
                $('#invalid-phone').removeClass('d-none');
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
