import * as displayFunctions from './display.js';

const tempHumiditySensorId = 'a480056d1b'; // Замените на ID вашего датчика температуры/влажности
const doorSensorId = '100187b85f';

let isDoorOpen = "";


function setDeviceState() {
    fetch(`/setDevicePowerState?deviceid=${smartSocketId}`)
        .then((response) => response.json())
        .then(function (sensorData) {
            displayFunctions.displaySensorData(sensorData.humidity, sensorData.temperature);
        })
        .catch(console.error);
}



function getTempSensorData() {
    fetch(`/getTempSensorData?deviceid=${tempHumiditySensorId}`)
        .then((response) => response.json())
        .then(function (sensorData) {
            displayFunctions.displaySensorData(sensorData.humidity, sensorData.temperature);
        })
        .catch();
}

function getDoorSensorData() {
    fetch(`/getDoorSensorData?deviceid=${doorSensorId}`)
        .then((response) => response.json())
        .then(function (sensorData) {
            isDoorOpen = sensorData.switch;
            console.log(isDoorOpen);
        })
        .catch();
}

/*
getDevicesButton.addEventListener('click', function () {
    getDevices();
});
*/

getTempSensorData();
getDoorSensorData();
setInterval(getTempSensorData, 5000);
setInterval(getDoorSensorData, 5000);