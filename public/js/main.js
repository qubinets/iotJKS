import * as displayFunctions from './display.js';

const tempHumiditySensorId = 'a480056d1b'; // Замените на ID вашего датчика температуры/влажности
const switchId = '10017b7136'; // Замените на ID вашего устройства

// HTML
const getDevicesButton = document.getElementById("getDevicesButton");
const channelButtons = document.querySelectorAll(".channelBtn");

function setChannel(channel, state) {
    displayFunctions.setChannelBtnActive(false);
    fetch(`/setChannel?deviceid=${switchId}&channel=${channel}&state=${state}`)
        .then(response => response.json)
        .catch(error => console.log(error))
        .finally(() => {
            displayFunctions.setChannelBtnActive(true);
        });
}

// API requests
function getDevices() {
    getDevicesButton.disabled = true;
    fetch('/getDevices')
        .then((response) => response.json())
        .then((devices) => {
            displayFunctions.displayDevices(devices);
        })
        .catch(function () {
            console.error();
        })
        .finally(() => getDevicesButton.disabled = false);
}

function updateDeviceStatus(deviceId) {
    fetch(`/getDevice?deviceid=${deviceId}`)
        .then(response => response.json())
        .then(function (device) {
            displayFunctions.displayStatusIndicator(device)
        })
        .catch(error => console.log(error))
}

function getTempSensorData() {
    fetch(`/getTempSensorData?deviceid=${tempHumiditySensorId}`)
        .then((response) => response.json())
        .then(function (sensorData) {
            console.log(sensorData.humidity, sensorData.temperature)
            displayFunctions.displaySensorData(sensorData.humidity, sensorData.temperature);
        })
        .catch(error => console.log(error));
}

// Event Listeners
channelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const channel = button.getAttribute('data-channel');
        const newState = button.textContent === 'ON' ? 'off' : 'on';
        console.log(button.getAttribute('data-channel'));
        //displayChannelSwitch(button, newState);
        setChannel(channel, newState);
    });
});

getTempSensorData();
setInterval(getTempSensorData, 5000);


