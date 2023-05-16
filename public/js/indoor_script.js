import * as displayFunctions from './display.js';

const smartSocketId = '100188b7b6';

// led tasmota
var tasmotaIp = "192.168.1.2";
const sliderLedBrightness = document.getElementById("ledBrightnessSlider");
const ledSchemeSelect = document.getElementById("ledSchemeSelect");
const ledSpeedSlider = document.getElementById("ledSpeedSlider");
// const colorPicker = document.getElementById('colorPicker');
const toggleLed = document.getElementById('toggleLed');


const socketSlider = document.getElementById('socketSlider');
let socketState = "";

function toggleTasmota(state) {
    var url = `http://${tasmotaIp}/cm?cmnd=Power1%20${state}`;

    var params = {
        method: 'GET',
        mode: 'no-cors',
    };

    fetch(url, params)
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
}

function setLedBrightness(brightness) {
    var url = `http://${tasmotaIp}/cm?cmnd=Dimmer%20${brightness}`;

    var params = {
        method: 'GET',
        mode: 'no-cors',
    };

    fetch(url, params)
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
}

function setLedScheme(scheme) {
    var url = `http://${tasmotaIp}/cm?cmnd=Scheme%20${scheme}`;

    var params = {
        method: 'GET',
        mode: 'no-cors',
    };

    fetch(url, params)
        .then(() => console.log('Mode is changed'))
        .catch((error) => console.error(error));
}

function setLedSpeed(speed) {
    var url = `http://${tasmotaIp}/cm?cmnd=Speed%20${speed}`

    var params = {
        method: 'GET',
        mode: 'no-cors',
    };

    fetch(url, params)
        .then(() => console.log('Speed is changed'))
        .catch((error) => console.error(error))
}

function getSocketStatus() {
    fetch(`/getDevice?deviceid=${smartSocketId}`)
        .then((response) => response.json())
        .then(function (sensorData) {
            socketState = sensorData.switch;
            console.log("Socket:" + socketState);
        })
        .catch(console.error);
}

// Event listeners
toggleLed.addEventListener("click", function () {
    toggleTasmota('toggle');
});

toggleLed.addEventListener("click", function() {
  this.classList.toggle("active");
});

sliderLedBrightness.addEventListener("input", function () {
    var brightness = this.value;
    console.log(this.value);
    setLedBrightness(brightness);
});

// ledSchemeSelect.addEventListener("change", function () {
//     var selectedScheme = ledSchemeSelect.value;
//     console.log(this.value);
//     setLedScheme(selectedScheme);
// });

ledSpeedSlider.addEventListener("input", function () {
    var value = this.value;
    value = 11 - value;
    console.log(this.value);
    setLedSpeed(value);
});

// colorPicker.addEventListener('input', async (event) => {
//     var color = colorPicker.value;
//     console.log(colorPicker.value);
//     setLedColor(color);
// });

ledSchemeSelect.addEventListener("change", function() {
    if (this.checked) {
        ledSchemeLabel.textContent = "Animated";
        setLedScheme(2); // Вызываете функцию с нужным значением для Animated
    } else {
        ledSchemeLabel.textContent = "Default";
        setLedScheme(1); // Вызываете функцию с нужным значением для Default
    }
});

socketSlider.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        console.log("socket on")

    }else{
        console.log("socket off")
    }
});

getSocketStatus();
setInterval(getSocketStatus, 2000);