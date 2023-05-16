import * as displayFunctions from './display.js';

const tempHumiditySensorId = 'a480056d1b';
const switchId = '10017b7136';
var switchStates = [false, false, false, false];

// HTML
const channelButtons = document.querySelectorAll(".channelBtn");

// Set switch channel API call
function setChannel(channel, state) {
    axios.get(`/setChannel?deviceid=${switchId}&channel=${channel}&state=${state}`, { timeout: 5000 })
        .then(response => {
            console.log(response);
            if (response.data && response.data.error) {
                throw new Error(response.data.msg || 'Server error');
            }
        })
        .catch(error => {
            console.error(error);
        })
}

// Call temperature/humidity sensor API and get data
async function getTempSensorData() {
    try {
        let fetchResult = await fetch(`/getTempSensorData?deviceid=${tempHumiditySensorId}`)
        let response = await fetchResult.json();
        if (response && response.humidity && response.temperature) {
            console.log(response.humidity, response.temperature);
            localStorage.setItem('humidity', response.humidity / 100);
            localStorage.setItem('temperature', response.temperature / 100);
            displayFunctions.displaySensorData(response.humidity, response.temperature);
        }
    } catch(error){
        console.log(error)
        setTimeout(getTempSensorData(), 1500); 
        
    };
}

// Event Listeners

// Monitor switch channel buttons
channelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const channel = button.getAttribute('data-channel');
        const newState = !switchStates[channel - 1];
        switchStates[channel - 1] = newState;
        console.log(switchStates, button.getAttribute('data-channel'), newState);
        //displayChannelSwitch(button, newState);

        setChannel(channel, newState);
    });
});


// Call functions periodically
getTempSensorData();
setInterval(getTempSensorData, 15000);


/*// API requests
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

// Not Used
function updateDeviceStatus(deviceId) {
    fetch(`/getDevice?deviceid=${deviceId}`)
        .then(response => response.json())
        .then(function (device) {
            displayFunctions.displayStatusIndicator(device)
        })
        .catch(error => console.log(error))
}
*/

