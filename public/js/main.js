import * as displayFunctions from './display.js';

const switchId = '10017b7136'; // Замените на ID вашего устройства
const lampId = '100123e422';
const tempHumiditySensorId = 'a480056d1b'; // Замените на ID вашего датчика температуры/влажности
const doorSensorId = '100187b85f';
const smartSocketId = '100188b7b6';
var tasmotaIp = "192.168.1.2";


// HTML
const getDevicesButton = document.getElementById("getDevicesButton");
const channelButtons = document.querySelectorAll('#channelButtons button');
const colorPicker = document.getElementById('colorPicker');
const sliderLampBrightness = document.getElementById("lampBrightnessSlider");

// led tasmota
const sliderLedBrightness = document.getElementById("ledBrightnessSlider");
const ledSchemeSelect = document.getElementById("ledSchemeSelect");
const ledSpeedSlider = document.getElementById("ledSpeedSlider");
let isDoorOpen = "";

// socket
let socketState = "";
const socketStateBtn = document.getElementById("socketStateBtn");


// API requests
function getTempSensorData() {
    fetch(`/getTempSensorData?deviceid=${tempHumiditySensorId}`)
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
        .catch(console.error);
}

function getSocketStatus() {
    fetch(`/getDevice?deviceid=${smartSocketId}`)
        .then((response) => response.json())
        .then(function (sensorData) {
            socketState = sensorData.switch;
            console.log("Socket:" + socketState);
        })
        .catch(console.error);
}

function setDeviceState() {
    fetch(`/setDevicePowerState?deviceid=${smartSocketId}`)
        .then((response) => response.json())
        .then(function (sensorData) {
            displayFunctions.displaySensorData(sensorData.humidity, sensorData.temperature);
        })
        .catch(console.error);
}


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

function setChannel(channel, state) {
    setChannelBtnActive(false);
    fetch(`/setChannel?deviceid=${switchId}&channel=${channel}&state=${state}`)
        .then(response => response.json)
        .catch(error => console.log(error))
        .finally(() => {
            displayFunctions.setChannelBtnActive(true);
        });
}

function getDeviceParameters() {
    fetch(`/getDevice?deviceid=` + lampId)
        .then((response) => {
            var deviceParameters = response.json();
            console.log(deviceParameters);
        })
        .catch(error => console.log(error))
}

// LED tasmota
function setLedBrightness(brightness) {
    var url = `http://${tasmotaIp}/cm?cmnd=Dimmer%20${brightness}`;

    var params = {
        method: 'GET',
        mode: 'no-cors',
    };

    fetch(url, params)
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
}


function setLedColor(color) {
    var rgb = color.substring(1);

    var url = `http://${tasmotaIp}/cm?cmnd=Color%20${rgb}`;

    var params = {
        method: 'GET',
        mode: 'no-cors',
    };

    fetch(url, params)
        .then(() => console.log('Color changed successfully'))
        .catch((error) => console.error(error));
}


function setLedScheme(scheme) {
    var url = `http://${tasmotaIp}/cm?cmnd=Scheme%20${scheme}`;

    var params = {
        method: 'GET',
        mode: 'no-cors',
    };

    fetch(url, params)
        .then(() => console.log('Mode is changed'))
        .catch((error) => console.error(error));
}



function setLedSpeed(speed) {
    var url = `http://${tasmotaIp}/cm?cmnd=Speed%20${speed}`

    var params = {
        method: 'GET',
        mode: 'no-cors',
    };

    fetch(url, params)
        .then(() => console.log('Speed is changed'))
        .catch((error) => console.error(error))
}

function getWeatherData() {
    fetch('/getWeatherData').then((result) => result.json()
    ).then((json) => {
        displayFunctions.displayWeatherData(json.location.localtime, json.current.temp_c, json.current.condition.icon);
    })
}

/*
// Event Listeners
colorPicker.addEventListener('input', async (event) => {
    var color = colorPicker.value;
    setLedColor(color);
});

sliderLedBrightness.addEventListener("input", function () {
    var brightness = this.value;
    setLedBrightness(brightness);
});

ledSchemeSelect.addEventListener("change", function () {
    var selectedScheme = ledSchemeSelect.value;
    setLedScheme(selectedScheme);
});

ledSpeedSlider.addEventListener("input", function () {
    var value = this.value;
    setLedSpeed(value);
});

getDevicesButton.addEventListener('click', function () {
    getDevices();
});

channelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const channel = button.getAttribute('data-channel');
        const newState = button.textContent === 'ON' ? 'off' : 'on';
        displayChannelSwitch(button, newState);
        setChannel(channel, newState, button);
    });
});

// lamp brightness slider
sliderLampBrightness.addEventListener('input', async (event) => {
    const newBrightness = event.target.value;
    const deviceId = '10016705ce';

    try {
        const response = await fetch('/setBrightness', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deviceId: deviceId, brightness: newBrightness }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonResponse = await response.json();

        if (!jsonResponse.success) {
            throw new Error('Failed to update brightness');
        }

        console.log('Brightness updated successfully');
    } catch (error) {
        console.error('Error sending brightness change:', error);
    }
});

*/

// async function setSwitchState(deviceId, newState) {
//     const response = await fetch('/setSwitchState', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ deviceid: deviceId, state: newState }),
//     });
//     const result = await response.json();
//     if (result.success) {
//         console.log('Switch state updated successfully');
//     } else {
//         console.log('Failed to update switch state');
//     }
// }

// function checkDoorStatus() {
//     if (isDoorOpen === "on") {
//         // Выполните необходимые действия, когда дверь открыта
//         fetch(`/setChannel?deviceid=${switchId}&channel=1&state=off`)
//             .then((response) => {
//                 if (response.ok) {
//                     console.log("Дверь была открыта.");
//                 } else {
//                     console.error("Произошла ошибка при выполнении действия.");
//                 }
//             })
//             .catch((error) => {
//                 console.error("Произошла ошибка при выполнении запроса:", error);
//             });
//     } else {
//         fetch(`/setChannel?deviceid=${switchId}&channel=1&state=on`)
//         .then((response) => {
//             if (response.ok) {
//                 console.log("Дверь была закрыта.");
//             } else {
//                 console.error("Произошла ошибка при выполнении действия.");
//             }
//         })
//         .catch((error) => {
//             console.error("Произошла ошибка при выполнении запроса:", error);
//         });
//     }
// }


// Periodic queries
getWeatherData();
setInterval(getWeatherData, 300000);


//getDeviceParameters();
//setInterval(getTempSensorData, 5000);
//setInterval(getDoorSensorData, 2000);


// setInterval(getSocketStatus, 2000);

// setInterval(checkDoorStatus, 2000);