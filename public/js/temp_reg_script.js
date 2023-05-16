import * as displayFunctions from './display.js';
const lampId = '10016705ce';

const sliderLampBrightness = document.getElementById("lampBrightnessSlider");

var output = document.getElementById('value-holder');
var output_manual = document.getElementById('value-holder-manual');
var slider = document.getElementById("myRange").oninput = function(){
    var value = (this.value - this.min) / (this.max-this.min) * 100;
    output.innerHTML = this.value;
}

socketSlider.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        document.getElementById('controlCards').style.display = "flex";
        document.getElementById('autoMode').style.display = "none";
    }else{
        document.getElementById('controlCards').style.display = "none";
        document.getElementById('autoMode').style.display = "flex";
    }
});

sliderLampBrightness.addEventListener('change', async (event) => {
    const newBrightness = event.target.value;
    output_manual.innerHTML = newBrightness;

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
});