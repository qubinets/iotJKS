import * as displayFunctions from './display.js';
const lampId = '10016705ce';
const switchId = '10017b7136';

const sliderLampBrightness = document.getElementById("lampBrightnessSlider");
const sliderAuto = document.getElementById("myRange")

var output = document.getElementById('value-holder');
var output_manual = document.getElementById('value-holder-manual');


document.addEventListener("DOMContentLoaded", (loaded) => {
    const saved_auto = localStorage.getItem('autoValue');
    const saved_brightness = localStorage.getItem('newBrightness');
    const autoModeDisabled = localStorage.getItem('autoModeDisabled');

    output.innerHTML = saved_auto || sliderAuto.getAttribute('min');
    sliderAuto.value = saved_auto || sliderAuto.getAttribute('min');
    output_manual.innerHTML = saved_brightness || sliderLampBrightness.getAttribute('min');
    sliderLampBrightness.value = saved_brightness || sliderLampBrightness.getAttribute('min');
})

sliderAuto.onchange = function () {
    localStorage.setItem('autoValue', this.value);
    output.innerHTML = this.value;

    var tempData = localStorage.getItem('temperature');
    var humidityData = localStorage.getItem('humidity');
    console.log("Temp, humidity: ", tempData, humidityData)

    var temperature_diff = tempData - this.value;

    console.log("Actual and desired temp difference: ", temperature_diff)
    // If needs to be colder
    if (temperature_diff > 0) {
        console.log("Fan - on, Heating - off")
        setChannel(1, "ON");
        setChannel(3, "OFF")
    } 
    // If needs to be warmer
    else{
        console.log("Fan - off, Heating - on")
        setChannel(1, "OFF");
        setChannel(3, "ON");
        setTimeout(setBrightness(100), 5000);
    }
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


socketSlider.addEventListener('change', (event) => {
    localStorage.setItem('autoModeDisabled', event.currentTarget.checked);
    if (event.currentTarget.checked) {
        document.getElementById('controlCards').style.display = "flex";
        document.getElementById('autoMode').style.display = "none";
    } else {
        document.getElementById('controlCards').style.display = "none";
        document.getElementById('autoMode').style.display = "flex";
    }
});

sliderLampBrightness.addEventListener('change', async (event) => {
    const newBrightness = event.target.value;
    localStorage.setItem('newBrightness', newBrightness);
    output_manual.innerHTML = newBrightness;

    await setBrightness(newBrightness);
});


async function setBrightness(newBrightness) {
    try {
        const response = await fetch('/setBrightness', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deviceId: lampId, brightness: newBrightness }),
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
}