var cityLat = "";
var cityLon = "";
var cityName = "";



var $currentConditions = $("#currentCond");
var $fiveDayContainer = $("#five-day-cont");
var $searchedCities = $("#searched-cities");


// takes the city name and turns it into Lat/Long
var getGeocode = async function(url) {
    try {
        var gotGeocode = await fetch(url);
        return await gotGeocode.json();
    } catch (error) {
        console.log(error)
    }
    
}



var longLat = async function(url) {
    var gotLatLon = await getGeocode(url)
    cityLat = gotLatLon[0].lat;
    cityLon = gotLatLon[0].lon;
    var weatherCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,alerts&appid=d2a11f66066e53ea2af8c7518fbdcb18";
    console.log(weatherCall)
    return weatherCall;


    
}

// converts from K to F
var kelToFar = function(kelvin) {
    var farenheit = Math.round((kelvin-273.15)*(9/5)+32)
    return farenheit;
}

// fectches weather json
var getWeather = async function(url) {
    var gotWeather = await fetch(url);
    return await gotWeather.json();
}

//function that makes all the dynamic stuff appear on page
var createWeather = async function(url) {
    var currentWeather = await getWeather(url);

    // capitalize city names if input is lowercase
    var parseCityName = function(string) {
        var lower = string.toLowerCase();
        var words = lower.split(" ")
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].slice(1);
        }

        return words.join(" ");
    }
    
    // local variables for current weather
    var cityText = parseCityName(cityName)
    var altText = currentWeather.current.weather[0].description;
    var tempKelvin = currentWeather.current.temp;
    var temp = kelToFar(tempKelvin)
    var wind = currentWeather.current.wind_speed + " MPH";
    var cityClass = cityText.replace(/ /g,"-")
    var unixTime = currentWeather.current.dt
    var humidity = currentWeather.current.humidity + " %"
    var uvIndex = currentWeather.current.uvi;
    var date = new Date(unixTime * 1000)
    var dateText = date.toLocaleDateString("en-US")
    var icon = currentWeather.current.weather[0].icon + ".png";




    //create the current conditions div
    var $cityDateIcon = $('<div>').addClass("del d-flex").appendTo($currentConditions);


    
    $('<div>')
        .text(cityText + " " + dateText)
        .addClass('del big-bold')
        .appendTo($cityDateIcon)
    $('<img src="./assets/images/' + icon + '" alt="' + altText + '" width="36" height="36">')
        .addClass('del')
        .appendTo($cityDateIcon)    
    $('<div>')
        .text("Temp: " + temp + "\u00B0 F")
        .addClass('del my-2')
        .appendTo($currentConditions)    
    $('<div>')
        .text("Wind: " + wind)
        .addClass('del mb-2')
        .appendTo($currentConditions)    
    $('<div>')
        .text("Humidity: " + humidity)
        .addClass('del mb-2')
        .appendTo($currentConditions)    
    $('<div>')
        .text("UV Index: ")
        .attr('id', 'UV')
        .addClass('del')
        .appendTo($currentConditions)
    $('<span>')
        .text(" " + uvIndex + " ")
        .addClass('del')
        .appendTo($('#UV'))

    
    if (uvIndex <= 2) {
        $('span').addClass('low')
    }
    else if (uvIndex <= 5) {
        $('span').addClass('moderate')
    }
    else {
        $('span').addClass('severe')
    }

    // simple 5 day loop
    for (i = 1; i < 6; i++) {
        // 5 day forecase creation
        var $dailyContainer = $('<div>').attr('id', [i]).addClass("day del col").appendTo($fiveDayContainer)
        
        // local variables for 5day forecast
        var unixTime = currentWeather.daily[i].dt
        var date = new Date(unixTime * 1000);
        var dateText = (date.toLocaleDateString("en-US"))
        var icon = currentWeather.daily[i].weather[0].icon + ".png"
        var altText = currentWeather.daily[i].weather.description;
        var tempKelvin = currentWeather.daily[i].temp.max
        var temp = kelToFar(tempKelvin)
        var wind = currentWeather.daily[i].wind_speed
        var humidity = currentWeather.daily[i].humidity

        
        $('<div>')
            .text(dateText)
            .addClass('del')
            .appendTo($dailyContainer)
        
        $('<img src="./assets/images/' + icon + '" alt="' + altText + '" width="32" height="32">')
            .addClass('del')
            .appendTo($dailyContainer)        
        $('<div>') 
            .text('Temp: ' + temp + "\u00B0 F")
            .addClass('del')
            .appendTo($dailyContainer)        
        $('<div>') 
            .text('Wind: ' + wind + " MPH")
            .addClass('del')
            .appendTo($dailyContainer)        
        $('<div>') 
            .text('Humidity: ' + humidity + " %")
            .addClass('del')
            .appendTo($dailyContainer)
    }

    // create buttons for previously searched cities
    if (!$('button.' + cityClass).length) {
        $('<button type="button">')
        .addClass("btn btn-secondary split mb-3 " + cityClass)
        .attr('id', "city-button")
        .text(cityText)
        .appendTo($searchedCities)
    }    
}





//listener for click on search button to get weather
$("#search-btn").click( async function(event){
    debugger;
    event.preventDefault();
    var weatherURl = ""
    $(".del").remove();

    cityName = $("#city-input").val();

    var coordCall = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=d2a11f66066e53ea2af8c7518fbdcb18"
       
    var weatherURl = await longLat(coordCall);
 
    createWeather(weatherURl);
})


// listener for clicks on saved cities
$(document).on('click', '#city-button', async function() {
    cityName = $(this).text()
    $('.del').remove();
    var coordinateCall = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=1649c9000c0edd6212787cb652a2a6bb";
    var weatherCallUrl = await getLatLon(coordinateCall);
    createCurrent(weatherCallUrl);
})