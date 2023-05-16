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

sliderAuto.onchange = async function () {
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
        await setChannel(1, "ON");
        await setChannel(3, "OFF")
    } 
    // If needs to be warmer
    else{
        console.log("Fan - off, Heating - on")
        await setChannel(1, "OFF");
        await setChannel(3, "ON");
        await setTimeout(setBrightness(100), 5000);
    }
}

// Set switch channel API call
async function setChannel(channel, state) {
    await fetch(`/setChannel?channel=${channel}&state=${state}`);
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