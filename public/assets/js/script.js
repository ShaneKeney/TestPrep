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
    let userCookie = getCookie('user');
    if(userCookie) {
        $('#register-button').addClass('d-none');
        $('#signin-button').addClass('d-none');
        $('.logout-button').removeClass('d-none');
    } else {
        $('.logout-button').addClass('d-none');
        $('#register-button').removeClass('d-none'); //show
        $('#signin-button').removeClass('d-none'); //show
    }

    $('.logout-button').on('click', e => {
        e.preventDefault();
        // get token to log out
        let user = JSON.parse(getCookie('user'));
        let authToken = user.token;

        $.ajax({
            type: 'POST',
            url: '/api/users/logout',
            dataType: 'json',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            success: function(res) {
                console.log('Logout success!')
                setCookie('user', '', 1);
                $('#register-button').removeClass('d-none');
                $('#signin-button').removeClass('d-none');
                $('.logout-button').addClass('d-none');
                location = '/'
            }
        })
    })

    $('#signin-form').on('submit', e => {
        e.preventDefault();

        const userData = {
            email: $('#signin-email').val().trim(),
            password: $('#signin-password').val().trim()
        };

        $.post('/api/users/login', userData)
        .then(function(res) {
            //set cookie with user information to use for user functions
            let user = { ...res };
            delete user.user.createdAt;
            delete user.user.updatedAt;

            let userCookie = JSON.stringify(user);
            setCookie('user', userCookie, 1);
            console.log(getCookie('user'));
            resetSignInFields();
            location.reload();
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

            return (registerPhone.length === 10 || registerPhone.length == 0) ? true : false;
        }

        if (userData.password === userData.confirmPassword && validateEmail()) {
            $.post('/api/register', userData)
            .then(function(res) {
                let user = { ...res };
                delete user.user.createdAt;
                delete user.user.updatedAt;

                let userCookie = JSON.stringify(user);
                setCookie('user', userCookie, 1);
                console.log(getCookie('user'));
                resetRegisterFields();
                location.reload();
            })
            .catch(function(err) {
                if(err.responseJSON.errors[0].message === "students.email must be unique") {
                    $('#regErrorText').text('Email already registered'); 
                }
            });
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

    $('#signClose').on('click', function() {
        resetSignInFields();
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

function resetSignInFields() {
    $('#signin-password').val('');
    $('#signin-email').val('');
    $('#signin-modal').modal('hide');
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
