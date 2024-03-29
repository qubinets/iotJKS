export function displayDevices(devices) {
    const devicesList = document.getElementById('devicesList');
    devicesList.innerHTML = '';
    for (const device of devices) {
        console.log(device)
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
export function displaySensorData(devices) {
    const temperature = sensorData.temperature / 100; // Деление на 100
    const humidity = sensorData.humidity / 100; // Деление на 100

    document.getElementById('temperature').textContent = `${temperature.toFixed(2)}`; // Округление до 2 знаков после запятой
    document.getElementById('humidity').textContent = `${humidity.toFixed(2)}`; // Округление до 2 знаков после запятой
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