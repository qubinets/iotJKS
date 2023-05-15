import * as displayFunctions from './display.js';

const tempHumiditySensorId = 'a480056d1b';
const switchId = '10017b7136';
var switchStates = [false, false, false, false];

// HTML
const channelButtons = document.querySelectorAll(".channelBtn");

// Set switch channel API call
function setChannel(channel, state) {
    axios.get(`/setChannel?deviceid=${switchId}&channel=${channel}&state=${state}`, {timeout: 9000})
        .then(response => {
            console.log(response);
            if (response.data && response.data.error) {
                throw new Error(response.data.msg || 'Server error');
            }
        })
        .catch(error => {
            console.error(error);
            setChannel(channel, state);
        })
        .finally(() => {

        });
}

// Call temperature/humidity sensor API and get data
function getTempSensorData() {
    fetch(`/getTempSensorData?deviceid=${tempHumiditySensorId}`)
        .then((response) => {
            response.json()
        })
        .then(function (sensorData) {
            console.log(sensorData.humidity, sensorData.temperature)
            displayFunctions.displaySensorData(sensorData.humidity, sensorData.temperature);
        })
        .catch(error => console.log(error));
}

// Event Listeners

// Monitor switch channel buttons
channelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const channel = button.getAttribute('data-channel');
        const newState = !switchStates[channel - 1];
        switchStates[channel-1] = newState;
        console.log(switchStates, button.getAttribute('data-channel'), newState);
        //displayChannelSwitch(button, newState);

        setChannel(channel, newState);
    });
});


// Call functions periodically
getTempSensorData();
setInterval(getTempSensorData, 10000);


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

