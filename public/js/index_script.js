import * as displayFunctions from './display.js';

const smartSocketId = '100188b7b6';
const socketStateBtn = document.getElementById("socketStateBtn");

function setSwitchStateSocket() {
    fetch(`/setDevicePowerState?deviceid=${smartSocketId}&state=toggle`)
    .then(response => response.json())
    .catch(error => console.error(error));
}

socketStateBtn.addEventListener('click', function () {
    setSwitchStateSocket();
});

function getWeatherData() {
    fetch('/getWeatherData')
    .then((result) => result.json())
    .then((json) => displayFunctions.displayWeatherData(json.location.localtime, json.current.temp_c, json.current.condition.icon))
}

getWeatherData();
setInterval(getWeatherData, 300000);

