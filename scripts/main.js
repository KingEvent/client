const BASE_URL="http://localhost:3000";

$( document ).ready(function() {
    console.log('ready')
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
}