import * as displayFunctions from './display.js';

const channelButtons = document.querySelectorAll(".channelBtn");
const switchId = '10017b7136'; // Замените на ID вашего устройства

function setChannel(channel, state) {
    displayFunctions.setChannelBtnActive(false);
    fetch(`/setChannel?deviceid=${switchId}&channel=${channel}&state=${state}`)
        .then(response => response.json)
        .catch(error => console.log(error))
        .finally(() => {
            displayFunctions.setChannelBtnActive(true);
        });
}

channelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const channel = button.getAttribute('data-channel');
        const newState = button.textContent === 'ON' ? 'off' : 'on';
        console.log(button.getAttribute('data-channel'));
        //displayChannelSwitch(button, newState);
        setChannel(channel, newState);
    });
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