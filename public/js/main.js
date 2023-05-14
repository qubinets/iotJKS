import * as displayFunctions from './display.js';

const switchId = '10017b7136'; // Замените на ID вашего устройства


// HTML
const getDevicesButton = document.getElementById("getDevicesButton");
const channelButtons = document.querySelectorAll('#channelButtons button');



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

function setChannel(channel, state) {
    setChannelBtnActive(false);
    fetch(`/setChannel?deviceid=${switchId}&channel=${channel}&state=${state}`)
        .then(response => response.json)
        .catch(error => console.log(error))
        .finally(() => {
            displayFunctions.setChannelBtnActive(true);
        });
}






/*
// Event Listeners



channelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const channel = button.getAttribute('data-channel');
        const newState = button.textContent === 'ON' ? 'off' : 'on';
        displayChannelSwitch(button, newState);
        setChannel(channel, newState, button);
    });
});

// lamp brightness slider


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




// setInterval(checkDoorStatus, 2000);