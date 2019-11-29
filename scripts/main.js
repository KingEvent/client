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

    $('#search-form').submit(function(e) {
      e.preventDefault();
      let value = $('#search-bar').val();
      $.ajax({
        url:`http://localhost:5000/events/search/${value}`,
        type:"get"
      })
      .done(data => {
        console.log(data)
        viewAll(data)
      })
      // .fail((data) => {
      //   console.log(data);
      //   alert('gabisa')
      // }) 
    })
    showAll()
});

function showAll() {
  $.ajax({
    url:"http://localhost:5000/events",
    type:"get"
  })
  .done(data => {
    viewAll(data);
  })
}

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
        url: 'http://localhost:3000/user-ip'
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

function showOne(id) {
  $.ajax({
    url:`http://localhost:5000/events/${id}`,
    type:"get"
  })
  .done(result => {
    $('.modal-content').empty()
    const data = result[0]
    let venue = (data.entities[0].name) ? data.entities[0].name : "No venue info";
    let address = (data.entities[0].formatted_address) ? data.entities[0].formatted_address : "No address info";
    let description = (data.description) ? data.description : "No description";
    $('.modal-content').append(` 
    <div class="modal-header">
      <h1 class="modal-title">${data.title}</h1>
      <button type="button" class="close" data-dismiss="modal">×</button>
    </div>
    <div class="modal-body">
      <h3>${new Date(data.start).toDateString()}</h3>
      <h3>${venue}</h3>
      <h3>${address}</h3>  
      <p>${description}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
    </div>
    `)
  })
}

function viewAll(result) {
  $('.row').empty()
  result.forEach(data => {
    let venue = (data.entities[0].name) ? data.entities[0].name : "No venue info";
    let address = (data.entities[0].formatted_address) ? data.entities[0].formatted_address : "No address info";
    $('.row').append(`
  <div class="col-md-4 col-sm-6 post" id="${data.category}">
    <div class="card card-block">
      <h4 class="card-title text-right"><i class="material-icons">${data.category}</i></h4>
      <h4 class="card-title text-right">
        <button type="button" onclick="showOne('${data.id}')" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
          Details
        </button>
      </h4>
      <h3 class="card-title mt-3 mb-3"><b>${data.title}</b></h3>
      <h4 class="card-text">${new Date(data.start).toDateString()}</h4> 
      <h5 class="card-title mt-3 mb-3">${venue}</h5>
      <h5 class="card-title mt-3 mb-3">${address}</h5>
    </div>
  </div>`)
  })
}

$('.post').show();
  $(".filtering button").on("click", function(){
    // console.log(this)
    if (!$(".filtering button").hasClass("active")) {
      $(".filtering button").addClass("active")
    }
    let filtertag = $(this).attr('id');
    if (filtertag !== 'all') {
      $('.post').hide().filter('#' + filtertag).show();
    } else {
      $('.post').show()
    }
  })

  // let rangeSlider = function(){
  //   let slider = $('.range-slider'),
  //       range = $('.range-slider__range'),
  //       value = $('.range-slider__value');
      
  //   slider.each(function(){
  
  //     value.each(function(){
  //       let value = $(this).prev().attr('value');
  //       $(this).html(value);
  //     });
  
  //     range.on('input', function(){
  //       $(this).next(value).html(this.value);
  //     });
  //   });
  // };
  // rangeSlider();

  // (function( $ ){
  //   $( document ).ready( function() {
  //     $( '.input-range').each(function(){
  //       var value = $(this).attr('data-slider-value');
  //       var separator = value.indexOf(',');
  //       if( separator !== -1 ){
  //         value = value.split(',');
  //         value.forEach(function(item, i, arr) {
  //           arr[ i ] = parseFloat( item );
  //         });
  //       } else {
  //         value = parseFloat( value );
  //       }
  //       $( this ).slider({
  //         formatter: function(value) {
  //           console.log(value);
  //           return '$' + value;
  //         },
  //         min: parseFloat( $( this ).attr('data-slider-min') ),
  //         max: parseFloat( $( this ).attr('data-slider-max') ), 
  //         range: $( this ).attr('data-slider-range'),
  //         value: value,
  //         tooltip_split: $( this ).attr('data-slider-tooltip_split'),
  //         tooltip: $( this ).attr('data-slider-tooltip')
  //       });
  //     });
      
  //    } );
  //   } )( jQuery );
