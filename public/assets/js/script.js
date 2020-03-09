const numArr = ['', '.', '/', 1, 2, 3, 4, 5, 6, 7, 8, 9];

$(() => {
    const numChoices = $('.number-choices');

    for (let i = 0; i < 4; i++) {
        const colEl = $('<div class="col-auto">');
        const selEl = $('<select class="form-control">');
        
        numArr.forEach(item => {
            const optionEl = $('<option>');
            $(optionEl).text(item);
            $(selEl).append(optionEl);
        });

        $(colEl).append(selEl);
        $(numChoices).append(colEl);
    }

    $('#signin-form').on('submit', e => {
        e.preventDefault();

        const userData = {
            email: $('#signin-email').val(),
            password: $('#signin-password').val()
        };

        // console.log(userData);

        // $.post('/api/signin', userData)
        // .then();

        // console.log('Sign in form submitted');
    });

    $('#register-form').on('submit', e => {
        e.preventDefault();

        // make sure new password matches confirm password
        if ($('#register-password').val() === $('#confirm-password').val()) {
            const userData = {
                email: $('#register-email').val().trim(),
                phone: $('#register-phone').val().trim(),
                password: $('#register-password').val().trim(),
                confirmPassword: $('#confirm-password').val().trim()
            };
    
            $.post('/api/register', userData)
            // .then();
    
            // console.log(userData);
    
            // console.log('Register form submitted');

            $('#password-mismatch').addClass('d-none');
        } else {
            $('#password-mismatch').removeClass('d-none');
        }
    });
});