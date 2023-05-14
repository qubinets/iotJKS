import * as displayFunctions from './display.js';
const lampId = '100123e422';

const sliderLampBrightness = document.getElementById("lampBrightnessSlider");

function getDeviceParameters() {
    fetch(`/getDevice?deviceid=` + lampId)
        .then((response) => {
            var deviceParameters = response.json();
            console.log(deviceParameters);
        })
        .catch(error => console.log(error))
}

sliderLampBrightness.addEventListener('input', async (event) => {
    const newBrightness = event.target.value;
    const deviceId = '10016705ce';

    try {
        const response = await fetch('/setBrightness', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deviceId: deviceId, brightness: newBrightness }),
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

getDeviceParameters();