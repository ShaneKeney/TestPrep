const numArr = ['', '.', '/', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const phoneArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

$(() => {
    let userCookie = getCookie('user');
    if(userCookie) {
        $('#register-button').addClass('d-none');
        $('#signin-button').addClass('d-none');
        $('.logout-button').removeClass('d-none');
        $('#editUserButton').removeClass('d-none');
    } else {
        $('.logout-button').addClass('d-none');
        $('#register-button').removeClass('d-none'); //show
        $('#signin-button').removeClass('d-none'); //show
        $('#editUserButton').addClass('d-none');
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
                //console.log('Logout success!')
                setCookie('user', '', 1);
                $('#register-button').removeClass('d-none');
                $('#signin-button').removeClass('d-none');
                $('.logout-button').addClass('d-none');
                $('#editUserButton').addClass('d-none');
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
            //console.log(getCookie('user'));
            resetSignInFields();
            location.replace('/bubblesheet');
        })
        .catch(function(err) {
            //console.log(err)
        })
    });

    $('#editUserButton').on('click', e => {
        e.preventDefault();

        let user = JSON.parse(getCookie('user'));
        let authToken = user.token;

        $.ajax({
            type: 'GET',
            url: '/api/users/me',
            dataType: 'json',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            success: function(res) {
                populateUserInfo(res);
            }
        })
    })

    $('#register-form').on('submit', e => {
        e.preventDefault();

        hideInvalidMessages('register');
        const userData = getUserData('register');

        if (userData.firstName !== ''
                && userData.lastName !== ''
                && userData.password !== ''
                && userData.password === userData.confirmPassword
                && validateEmail(userData.email)
                && validatePhone(userData.phone).isValid) {
            $.post('/api/register', userData)
            .then(function(res) {
                let user = { ...res };
                delete user.user.createdAt;
                delete user.user.updatedAt;

                let userCookie = JSON.stringify(user);
                setCookie('user', userCookie, 1);
                //console.log(getCookie('user'));
                resetRegisterFields();
                location.reload();
            })
            .catch(function(err) {
                if(err.responseJSON.errors[0].message === "students.email must be unique") {
                    $('#regErrorText').text('Email already registered'); 
                }
            });
        } else {
            if (userData.password === '')
                $('#password-register-blank').removeClass('d-none');
            if (userData.firstName === '')
                $('#invalid-register-firstName').removeClass('d-none');
            if (userData.lastName === '')
                $('#invalid-register-lastName').removeClass('d-none');
            if (userData.password !== userData.confirmPassword)
                $('#password-register-mismatch').removeClass('d-none');
            if (!validateEmail(userData.email))
                $('#invalid-register-email').removeClass('d-none');
            if (!validatePhone(userData.phone).isValid)
                $('#invalid-register-phone').removeClass('d-none');
        }
    });

    $('#edit-user-form').on('submit', function(e) {
        e.preventDefault();

        hideInvalidMessages('edit');
        // $('#password-edit-new-blank').addClass('d-none');

        let user = JSON.parse(getCookie('user'));
        let authToken = user.token;

        let patchUser = { 
            first_name: $('#edit-firstName').val().trim(),
            last_name: $('#edit-lastName').val().trim(),
            email: $('#edit-email').val().trim(),
            phone: $('#edit-phone').val().trim(),
            password: $('#edit-password').val().trim(),
            newPassword: $('#edit-new-password').val().trim(),
            confirmPassword: $('#confirm-edit-password').val().trim()
        }

        // if(!patchUser.password && !patchUser.confirmPassword) {
        //     delete patchUser.password;
        //     delete patchUser.confirmPassword;
        // }
        
        if (patchUser.first_name !== ''
                && patchUser.last_name !== ''
                && patchUser.password !== ''
                && patchUser.newPassword === patchUser.confirmPassword
                && validateEmail(patchUser.email)
                && validatePhone(patchUser.phone).isValid) {
            $.ajax({
                type: 'PATCH',
                url: '/api/users/me',
                dataType: 'json',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                data: patchUser,  
                success: function(res) {
                    console.log('Successful edit!')
                }
            })
            location.reload();
        } else {
            if (patchUser.password === '')
                $('#password-edit-blank').removeClass('d-none');
            if (patchUser.first_name === '')
                $('#invalid-edit-firstName').removeClass('d-none');
            if (patchUser.last_name === '')
                $('#invalid-edit-lastName').removeClass('d-none');
            if (patchUser.newPassword !== patchUser.confirmPassword)
                $('#password-edit-mismatch').removeClass('d-none');
            if (!validateEmail(patchUser.email))
                $('#invalid-edit-email').removeClass('d-none');
            if (!validatePhone(patchUser.phone).isValid)
                $('#invalid-edit-phone').removeClass('d-none');
        }
        
    })

    $('#regClose').on('click', function() {
        $('#regErrorText').text('');
        resetRegisterFields();
    })

    $('#signClose').on('click', function() {
        resetSignInFields();
    })
});

const getUserData = formType => {
    const userData = {
        firstName: $(`#${formType}-firstName`).val().trim(),
        lastName: $(`#${formType}-lastName`).val().trim(),
        email: $(`#${formType}-email`).val().trim(),
        phone: validatePhone($(`#${formType}-phone`).val().trim()).phoneNum,
        password: $(`#${formType}-password`).val().trim(),
        confirmPassword: $(`#confirm-${formType}-password`).val().trim()
    }

    return userData;
}

const validateEmail = emailAddress => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(emailAddress);
}

const validatePhone = inputNum => {
    let phoneNum = '';
    inputNum.split('').forEach(num => {
        if (phoneArr.includes(num)) {
            phoneNum += num;
        }
    });
    const isValid = phoneNum.length === 10 || phoneNum.length === 0;
    return { isValid, phoneNum }
}

const hideInvalidMessages = formType => {
    $(`#invalid-${formType}-firstName`).addClass('d-none');
    $(`#invalid-${formType}-lastName`).addClass('d-none');
    $(`#invalid-${formType}-email`).addClass('d-none');
    $(`#invalid-${formType}-phone`).addClass('d-none');
    $(`#password-${formType}-blank`).addClass('d-none');
    $(`#password-${formType}-mismatch`).addClass('d-none');
}

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

function populateUserInfo(userInfo) {
    $('#edit-firstName').val(userInfo.first_name)
    $('#edit-lastName').val(userInfo.last_name)
    $('#edit-email').val(userInfo.email)
    $('#edit-phone').val(userInfo.phone)
}
