const apiKey = "1b18ce13c84e21faafb19c931bb29331";

var currentWeatherSection = function(city) {
    // turn response data into objects
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        // get the latitude and longitude
        .then(function(response) {
            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;
            
            // turn response data into objects
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                .then(function(response) {
                    return response.json();
                })

                // add name, date, and icon
                .then(function(response){
                    var currentTitle = $("#current-title");
                    var currentDay = moment().format("M/D/YYYY");
                    currentTitle.text(`${city} (${currentDay})`);
                    var currentIcon = $("#current-weather-icon");
                    var currentIconFin = response.current.weather[0].icon;
                    currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconFin}@2x.png`);

                    // add current weather conditions to the page
                    var currentTemp = $("#current-temp");
                    currentTemp.text("Temperature: " + response.current.temp + " \u00B0F");
                    var currentWindSpeed = $("#current-wind-speed");
                    currentWindSpeed.text("Wind Speed: " + response.current.wind_speed + " MPH");
                    var currentHumidity = $("#current-humidity");
                    currentHumidity.text("Humidity: " + response.current.humidity + "%");
                    var currentUvIndex = $("#current-uv-index");
                    currentUvIndex.text("UV Index: ");
                    var currentNumber = $("#current-number");
                    currentNumber.text(response.current.uvi);

                    // set color for uv index
                    if (response.current.uvi <= 2) {
                        currentNumber.addClass("favorable");
                    } else if (response.current.uvi >= 3 && response.current.uvi <= 7) {
                        currentNumber.addClass("moderate");
                    } else {
                        currentNumber.addClass("severe");
                    }
                })
        })
        .catch(function(err) {
            // reset search input
            $("#search-input").val("");

            // tell them that they can't spell, politely
            alert("Sorry, we couldn't find any results for that search.");
        });
};


var fiveDayForecastSection = function(city) {
    // turn response data into objects
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // get city's longitude and latitude
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                // turn response data into objects
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    var futureForecastTitle = $("#future-forecast-title");
                    futureForecastTitle.text("5-Day Forecast:")

                    // loop over the data from the response
                    for (var i = 1; i <= 5; i++) {

                        // add dates and icons
                        var futureDate = $("#future-date-" + i);
                        date = moment().add(i, "d").format("M/D/YYYY");
                        futureDate.text(date);
                        var futureIcon = $("#future-icon-" + i);
                        var futureIconCode = response.daily[i].weather[0].icon;
                        futureIcon.attr("src", `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);

                        // add the future weather conditions to the page
                        var futureTemp = $("#future-temp-" + i);
                        futureTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");
                        var futureWind = $("#future-wind-speed-" + i);
                        futureWind.text("Wind Speed: " + response.daily[i].wind_speed + " MPH");
                        var futureHumidity = $("#future-humidity-" + i);
                        futureHumidity.text("Humidity: " + response.daily[i].humidity + "%");                        
                    }
                    
                })
        })
};

// call when the user submits a search
$("#search-form").on("submit", function() {
    event.preventDefault();
    var city = $("#search-input").val();

        //show an alert if empty string / null value is submitted
    if (city === "" || city == null) {
        alert("Nothing was entered. Please enter the name of your city.");
        event.preventDefault();

    // or else if the city is legit, call the forecast functions with it
    } else {
        currentWeatherSection(city);
        fiveDayForecastSection(city);
    }
});

