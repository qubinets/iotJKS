import * as displayFunctions from './display.js';

const doorSensorId = '100187b85f';

let isDoorOpen = "";
let dbSensorData = {};

function setDeviceState() {
    fetch(`/setDevicePowerState?deviceid=${smartSocketId}`)
        .then((response) => response.json())
        .then(function (sensorData) {
            displayFunctions.displaySensorData(sensorData.humidity, sensorData.temperature);
        })
        .catch(console.error);
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

function getDbSensorsData() {
    fetch(`/getSensorsDataFromDb`)
        .then((response) => response.json())
        .then((sensorData) => {
            console.log(sensorData);
            dbSensorData = sensorData;
            displayFunctions.displayDbSensorData(dbSensorData);
        })
        .catch ();
}

getDoorSensorData();
getDbSensorsData();

setInterval(getDbSensorsData, 1000);
setInterval(getDoorSensorData, 5000);
