const BASE_URL = "http://localhost:3000";

$(document).ready(function () {
    console.log('ready')
    getUserIP()
    e = $('#auth-button');

    let options = {
        'client_id': '9acLp9_J7iFllX9GG3wy9lAgQNAxcYpRUxAikABoAiiFUiHm',
        'scope': 'google_calendar'
    };

    Kloudless.auth.authenticator(e, options, function (result) {
        if (result.error) {
            console.error('An error occurred:', result.error);
        } else {
            sendUserToken(result.access_token);
        }
    });


    //register and login
    // getRegister()
    $('#register_form').submit(function (e) {

        e.preventDefault();

        $.ajax({
            method: "post",
            url: `http://localhost:3000/user/register`,
            data: {
                username: $('#register_username').val(),
                email: $('#register_email').val(),
                password: $('#register_password').val()
            }
        })
            .done((data) => {
                console.log(data);
                askLogin(data.username)
            })
            .fail((data) => {
                console.log(data);
                Swal.fire(data.responseJSON.message)
            })
    });


    // getLogin()
    $('#login_form').submit(function (e) {

        e.preventDefault();

        $.ajax({
            method: "post",
            url: `http://localhost:3000/user/login`,
            data: {
                username: $('#login_username').val(),
                password: $('#login_password').val()
            },
            success: function (data) {
                console.log('Submission was successful.');
                // console.log(data);
                localStorage.setItem('token', data.token)
                $(`#for_form`).hide()
            },
            error: function (data) {
                console.log('An error occurred.');
                console.log(data);
                // console.log(data.responseJSON.message);
                Swal.fire(data.responseJSON.message)
            },
        })
    });


});

function askLogin(name) {
    Swal.fire(`Hi ${name},
    Please login for access our home page`)
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'post',
        url: 'http://localhost:3000/google-signin',
        data: {
            id_token: id_token
        }
    })
    .done(userCredentials=> {
        localStorage.setItem('accessToken', userCredentials)
        /* Get user token from server then save to localStorage.accessToken */
        $('#logout').show()
        $('#loginModal').modal('hide')
        $('#sign-in').hide()
    })
    .fail(err=> {
        console.log(err)
    })
    .always()
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'post',
        url: 'http://localhost:3000/google-signin',
        data: {
            id_token: id_token
        }
    })
        .done(userCredentials => {
            console.log(userCredentials)
            $('#loginModal').modal('hide')
            $('#sign-in').hide()
        });
}

// get user ip using ip-api.com and saved to localStorage
function getUserIP() {
    $.ajax({
        method: 'get',
        url: 'http://ip-api.com/json'
    })
        .done(ipData => {
            let { regionName, city, lat, lon, country } = ipData;
            localStorage.setItem('city', city)
            localStorage.setItem('country', country)
            localStorage.setItem('region', regionName)
            localStorage.setItem('lat', lat)
            localStorage.setItem('lon', lon)
        })
        .fail(err => {
            console.log(err)
        })
        .always()
}


function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        $('#logout').hide()
        $('#sign-in').show()
        localStorage.removeItem('accessToken')
    });
}

function loginFunction(e) {
    const data = $('input').serialize()
}

function sendUserToken(token) {
    $.ajax({
        type: 'POST',
        url: `${BASE_URL}/calendar`,
        data: { token },
        headers: {
            authorization: localStorage.getItem('jwt_token')
        }
    })   
    .done(data => {
        console.log(data)
    }) 
    .fail(err => {
        console.log(err)
    })
}