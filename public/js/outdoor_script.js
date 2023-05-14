import * as displayFunctions from './display.js';
const lampId = '100123e422';


function getDeviceParameters() {
    fetch(`/getDevice?deviceid=` + lampId)
        .then((response) => {
            var deviceParameters = response.json();
            console.log(deviceParameters);
        })
        .catch(error => console.log(error))
}



getDeviceParameters();