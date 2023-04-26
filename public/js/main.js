import { displayDevices, displaySensorData, displayChannelSwtich, displayStatusIndicator } from './display.js';

const switchId = '10017b7136'; // Замените на ID вашего устройства
const lampId = '100123e422';
const tempHumiditySensorId = 'a480056d1b'; // Замените на ID вашего датчика температуры/влажности
const getDevicesButton = document.getElementById("getDevicesButton");
const channelButtons = document.querySelectorAll('#channelButtons button');

function getSensorData() {
    fetch(`/getSensorData?deviceid=${tempHumiditySensorId}`)
        .then((response) => response.json())
        .then(function (sensorData) {
            displaySensorData(sensorData);
        })
        .catch(console.error);
}

function getDevices() {
    getDevicesButton.disabled = true;
    fetch('/getDevices')
        .then((response) => response.json())
        .then((devices) => {
            displayDevices(devices);
            getDevicesButton.disabled = false;
        })
        .catch(function () {
            console.error();
            getDevicesButton.disabled = false;
        })
        .finally(() => getDevicesButton.disabled = false);
}

function updateDeviceStatus(deviceId) {
    fetch(`/getDevice?deviceid=${deviceId}`)
        .then(response => response.json)
        .then(function (device) {
            displayStatusIndicator(device)
        })
        .catch(error => console.log(error))
}

function setChannel(channel, state, button) {
    button.disabled = true;
    fetch(`/setChannel?deviceid=${switchId}&channel=${channel}&state=${state}`)
        .then(response => response.json)
        .catch(error => console.log(error))
        .finally(() => button.disabled = false)
}

channelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const channel = button.getAttribute('data-channel');
        const newState = button.textContent === 'ON' ? 'off' : 'on';
        displayChannelSwtich(button, newState);
        setChannel(channel, newState, button);
    });
});

getDevicesButton.addEventListener('click', function () {
    getDevices();
});

/*
async function getDeviceParameters() {
const response = await fetch(`/getDevice?deviceid=100123e422`); // Замените на ID вашей лампы
const deviceParameters = await response.json();
console.log(deviceParameters);
}
async function setSwitchState(deviceId, newState) {
const response = await fetch('/setSwitchState', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ deviceid: deviceId, state: newState }),
});
const result = await response.json();
if (result.success) {
console.log('Switch state updated successfully');
} else {
console.log('Failed to update switch state');
}
}
async function setColor(deviceId, r, g, b) {
const response = await fetch('/setColor', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ deviceId, r, g, b }),
});

const result = await response.json();
if (result.success) {
console.log('Color updated successfully');
} else {
console.log('Failed to update color');
}
}
document.getElementById('colorPicker').addEventListener('change', async (event) => {
const newColor = event.target.value;
const deviceId = '100123e422'; // замените этот идентификатор на нужный
const r = parseInt(newColor.slice(1, 3), 16);
const g = parseInt(newColor.slice(3, 5), 16);
const b = parseInt(newColor.slice(5, 7), 16);
await setColor(deviceId, r, g, b);
});
/* 
getDeviceParameters();

*/