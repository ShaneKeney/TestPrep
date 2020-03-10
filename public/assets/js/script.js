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

        $('#password-mismatch').addClass('d-none');
        $('#invalid-email').addClass('d-none');
        $('#invalid-phone').addClass('d-none');

        const registerPassword = $('#register-password').val().trim();
        const confirmPassword = $('#confirm-password').val().trim();
        const registerEmail = $('#register-email').val().trim();

        let registerPhone = '';

        const validateEmail = () => {
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(registerEmail);
        }

        const validatePhone = () => {
            registerPhone = '';
            const phoneInput = $('#register-phone').val().trim().split('');
            phoneInput.forEach(char => {
                if (phoneArr.includes(char)) {
                    registerPhone.concat(char);
                }
            });

            registerPhone.length !== 9 ? true : false;
            
        }

        if (registerPassword === confirmPassword && validateEmail() && validatePhone()) {
            const userData = {
                email: registerEmail,
                phone: registerPhone,
                password: registerPassword
            }
            // $.post('/api/register', userData)
            // .then();
        } else {
            if (registerPassword !== confirmPassword) 
                $('#password-mismatch').removeClass('d-none');
            if (!validateEmail())
                $('#invalid-email').removeClass('d-none');
            if (!validatePhone())
                $('#invalid-phone').removeClass('d-none');
        }
    });

});