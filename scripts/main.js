$( document ).ready(function() {
    console.log( "ready!" );
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
            $('#sign-in').hide()
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