const BASE_URL="http://localhost:3000";

$( document ).ready(function() {
    console.log('ready')
    getUserIP()
    e = $('#auth-button');

    let options = {
        'client_id': '9acLp9_J7iFllX9GG3wy9lAgQNAxcYpRUxAikABoAiiFUiHm',
        'scope': 'google_calendar'
    };

    Kloudless.auth.authenticator(e, options, function(result) {
        if (result.error) {
            console.error('An error occurred:', result.error);
        } else {
            sendUserToken(result.access_token);
        }
    });
});

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
});

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
            console.log(userCredentials)
            $('#loginModal').modal('hide')
            $('#sign-in').hide()
});

// get user ip using ip-api.com and saved to localStorage
function getUserIP() {
    $.ajax({
        method: 'get',
        url: 'http://ip-api.com/json'
    })
        .done(ipData=> {
            let { regionName, city, lat, lon, country } = ipData;
            localStorage.setItem('city', city)
            localStorage.setItem('country', country)
            localStorage.setItem('region', regionName)
            localStorage.setItem('lat', lat)
            localStorage.setItem('lon', lon)
        })
        .fail(err=> {
            console.log(err)
        })
        .always()
}


function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    $('#sign-in').show()
}

function loginFunction(e){
    const data = $('input').serialize()
}