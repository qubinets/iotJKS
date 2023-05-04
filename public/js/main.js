import { displayDevices, displaySensorData, displayChannelSwitch, displayStatusIndicator, setChannelBtnActive } from './display.js';

const switchId = '10017b7136'; // Замените на ID вашего устройства
const lampId = '100123e422';
const tempHumiditySensorId = 'a480056d1b'; // Замените на ID вашего датчика температуры/влажности
const dimmerIp = 'http://192.168.1.8:8081/zeroconf/dimmable';
const getDevicesButton = document.getElementById("getDevicesButton");
const channelButtons = document.querySelectorAll('#channelButtons button');
const colorPicker = document.getElementById('colorPicker');

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
            displayStatusIndicator(device)
        })
        .catch(error => console.log(error))
}

function setChannel(channel, state) {
    setChannelBtnActive(false);
    fetch(`/setChannel?deviceid=${switchId}&channel=${channel}&state=${state}`)
        .then(response => response.json)
        .catch(error => console.log(error))
        .finally(() => {
            setChannelBtnActive(true);
        });
}

function setColor(deviceId, r, g, b) {
    var params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId, r, g, b }),
    }

    fetch('/setColor', params)
        .then(response => response.json())
        .then(
            (result) => {
                if (result.success) {
                    console.log('Color updated successfully');
                } else if (result.error) {
                    console.log('Failed to update color');
                }
            }
        )
        .catch(
            (error) => {
                console.log(error)
                console.log('Failed to update color');
            }
        );
}

function getDeviceParameters() {
    fetch(`/getDevice?deviceid=` + lampId)
        .then((response) => {
            var deviceParameters = response.json();
            console.log(deviceParameters);
        })
        .catch(error => console.log(error))
}

function setBrightness() {
    var body = {
        "deviceid": "10016705ce",
        "data": {
            "switch": "on",
            "brightness": 0,
            "mode": 0,
            "brightmin": 1,
            "brightmax": 255
        }
    }

    var params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }

    fetch(dimmerIp, params)
        .then((response) => response.json())
        .catch(console.error);
}


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

colorPicker.addEventListener('change', async (event) => {
    const newColor = event.target.value;
    const deviceId = '100123e422'; // замените этот идентификатор на нужный
    const r = parseInt(newColor.slice(1, 3), 16);
    const g = parseInt(newColor.slice(3, 5), 16);
    const b = parseInt(newColor.slice(5, 7), 16);
    await setColor(deviceId, r, g, b);
});


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

getDeviceParameters();
