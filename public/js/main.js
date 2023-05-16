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
        let fetchResult = await axios.get(`/getTempSensorData?deviceid=${tempHumiditySensorId}`)
        console.log(fetchResult)
        /*
        if (response && response.humidity && response.temperature) {
            console.log(response.humidity, response.temperature);
            localStorage.setItem('humidity', response.humidity / 100);
            localStorage.setItem('temperature', response.temperature / 100);
            displayFunctions.displaySensorData(response.humidity, response.temperature);
        }
        */
    } catch(error){
        console.log(error)
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
setInterval(getTempSensorData, 10000);

