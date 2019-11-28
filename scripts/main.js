$( document ).ready(function() {
    console.log( "ready!" );
    getUserIP()
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