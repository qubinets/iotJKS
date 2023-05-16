import * as displayFunctions from './display.js';

const tempHumiditySensorId = 'a480056d1b';
// HTML
const channelButtons = document.querySelectorAll(".channelBtn");

// Call temperature/humidity sensor API and get data
async function getTempSensorData() {
    try {
        let fetchResult = await axios.get(`/getTempSensorData?deviceid=${tempHumiditySensorId}`)
        let response = fetchResult.data;
        if (response && response.humidity && response.temperature) {
            console.log("Humidity, temp: ", response.humidity / 100, response.temperature / 100);
            localStorage.setItem('humidity', response.humidity / 100);
            localStorage.setItem('temperature', response.temperature / 100);
            displayFunctions.displaySensorData(response.humidity, response.temperature);
        }
        
    } catch(error){
        console.log(error)
    };
}

// Set switch channel API call
async function setChannel(channel, state) {
    await fetch(`/setChannel?channel=${channel}&state=${state}`)
}

// Event Listeners

// Monitor switch channel buttons
channelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const channel = button.getAttribute('data-channel');
        console.log(button.getAttribute('data-channel'));
        setChannel(channel, "TOGGLE");
    });
});


// Call functions periodically
getTempSensorData();
setInterval(getTempSensorData, 30000);

