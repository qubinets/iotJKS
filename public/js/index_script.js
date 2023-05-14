import * as displayFunctions from './display.js';

function getWeatherData() {
    fetch('/getWeatherData')
    .then((result) => result.json())
    .then((json) => displayFunctions.displayWeatherData(json.location.localtime, json.current.temp_c, json.current.condition.icon))
}


getWeatherData();
setInterval(getWeatherData, 300000);
