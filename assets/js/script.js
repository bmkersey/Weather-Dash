var cityLat = "";
var cityLon = "";
var cityName = "";



var $currentConditions = $("#currentCond");
var $fiveDayContainer = $("#five-day-cont");
var $searchedCities = $("#searched-cities");



var longLat = async function(url) {
    var gotLatLon = await getGeocode(url)
    cityLat = gotLatLon[0].lat;
    cityLon = gotLatLon[0].lon;
    var weatherCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,alerts&appid=d2a11f66066e53ea2af8c7518fbdcb18";
    console.log(weatherCall)
    return weatherCall;
}







$("#search-btn").click( async function(event){
    debugger;
    event.preventDefault();
    var weatherURl = ""
    $(".del").remove();

    cityName = $("#city-input").val();

    var coordCall = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=d2a11f66066e53ea2af8c7518fbdcb18"
       
    var weatherURl = await longLat(coordCall);
 
    currentCreate(weatherURl);
})