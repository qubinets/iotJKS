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
function setChannel(channel, state) {
    axios.get(`/setChannel?channel=${channel}&state=${state}`, { timeout: 10000 })
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

