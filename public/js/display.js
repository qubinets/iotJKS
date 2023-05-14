export function displayDevices(devices) {
    const devicesList = document.getElementById('devicesList');
    devicesList.innerHTML = '';
    for (const device of devices) {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        const deviceName = document.createElement('span');
        deviceName.textContent = `${device.name} (${device.deviceid})`;
        li.appendChild(deviceName);

        const statusIndicator = document.createElement('span');
        statusIndicator.classList.add('status-indicator');
        statusIndicator.setAttribute('data-deviceid', device.deviceid);
        li.appendChild(statusIndicator);
        devicesList.appendChild(li);
        /* updateDeviceStatus(device.deviceid); */
    }
}

// temperature/humidity information
export function displaySensorData(humidity,temperature) {
    const converted_temperature = temperature / 100; // Деление на 100
    const converted_humidity = humidity / 100; // Деление на 100

    document.getElementById('temperature').textContent = `${converted_temperature.toFixed(2)}`; // Округление до 2 знаков после запятой
    document.getElementById('humidity').textContent = `${converted_humidity.toFixed(2)}`; // Округление до 2 знаков после запятой
}

// change button color (Manual channels control)
export function displayChannelSwitch(button, newState) {
    button.textContent = newState === 'on' ? 'ON' : 'OFF';
    button.classList.toggle('btn-success', newState === 'on');
    button.classList.toggle('btn-failed', newState === 'off');
}

export function displayStatusIndicator(device) {
    const status = device.params.switches[0].switch;
    const statusIndicator = document.querySelector(`.status-indicator[data-deviceid="${deviceId}"]`);
    if (statusIndicator) {
        statusIndicator.textContent = status === 'on' ? 'ON' : 'OFF';
        statusIndicator.classList.toggle('text-success', status === 'on');
        statusIndicator.classList.toggle('text-danger', status !== 'on');
    }
}

export function setChannelBtnActive(state) {
    document.querySelectorAll('#channelButtons button').forEach(button => {
        if (state) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }
    )
}

export function displayWeatherData(localtime, temp, icon){
    const tempText = document.getElementsByClassName("temperature");
    const weatherIcon = document.getElementsByClassName("weatherIcon");
    const timeText = document.getElementsByClassName("timeRow");
    const dateText = document.getElementsByClassName("dateRow");

    tempText[0].innerText = temp;
    timeText[0].innerText = localtime.substring(10);
    dateText[0].innerText = localtime.substring(0, 10);
    weatherIcon[0].src = icon;
}
