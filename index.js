$(document).ready(function () {
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
        // .done(() => {
        //     Swal.fire(`login`)
        // })
        // .fail()
        // .always()
    });

})


function askLogin(name) {
    Swal.fire(`Hi ${name},
    Please login for access our home page`)
}