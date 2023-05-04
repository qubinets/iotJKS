const express = require('express');
const ewelink = require('ewelink-api');
const app = express();
const port = 3000;

const login = 'dreamteam.iot@mail.com'
const pass = 'edtr61iot'
const region = 'eu'
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getDevice', async (req, res) => {
    try {
        const deviceId = req.query.deviceid;

        const connection = new ewelink({
            email: login,
            password: pass,
            region: region,
        });

        const device = await connection.getDevice(deviceId);
        if (device) {
            res.json(device.params);
        } else {
            res.status(500).json({ error: 'Failed to fetch device data' });
        }
    } catch (error) {
        console.error('Error fetching device data:', error);
        res.status(500).json({ error: 'Error fetching device data' });
    }
});

app.get('/getDevices', async (req, res) => {
    try {
        const connection = new ewelink({
            email: login,
            password: pass,
            region: region,
        });

        const devices = await connection.getDevices();
        console.log(devices);
        res.json(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
        res.status(500).json({ error: 'Error fetching devices' });
    }
});

app.get('/setChannel', async (req, res) => {
    const deviceId = req.query.deviceid;
    const channel = parseInt(req.query.channel);
    const state = req.query.state;

    const connection = new ewelink({
        email: login,
        password: pass,
        region: region,
    });

    try {
        // Получить текущий статус 
        const device = await connection.getDevice(deviceId);

        if (device && device.params.switches) {
            var currentChannelState = device.params.switches[channel - 1].switch;
            // Проверить, необходимо ли переключать состояние
            if (state !== currentChannelState) {
                const result = await connection.toggleDevice(deviceId, channel);
                res.json(result);
            } else {
                res.json({ status: 'ok', state: currentChannelState });
            }
        }

    } catch (error) {
        console.error('Error setting channel state:', error);
        res.status(500).json({ error: 'Error setting channel state' });
    }
});

app.get('/getSensorData', async (req, res) => {
    try {
        const deviceId = req.query.deviceid;
        const sensorData = await connection.getDevice(deviceId);
        res.json(sensorData.params);
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        res.status(500).json({ error: 'Error fetching sensor data' });
    }
});

app.get('/setBrightness', async (req, res) => {
    try {
        const deviceId = req.query.deviceid;
        const brightness = parseInt(req.query.brightness);

        const result = await connection.setDevicePowerState(deviceId, 'on', { outlet: 0, inching: 0, zyx_clear_timers: 0, level: brightness });
        res.json(result);
    } catch (error) {
        console.error('Error setting brightness:', error);
        res.status(500).json({ error: 'Failed to set brightness' });
    }
});

app.get('/setColor', async (req, res) => {
    try {
        const deviceId = req.query.deviceid;
        const r = parseInt(req.query.r);
        const g = parseInt(req.query.g);
        const b = parseInt(req.query.b);

        // Замените 1 на номер канала, отвечающего за цвет
        const channel = 1;
        const color = [r, g, b].join(',');

        const connection = new ewelink({
            email: login,
            password: pass,
            region: region,
        });

        const result = await connection.setDevicePowerState(deviceId, 'on', { outlet: channel, zyx_mode: 2, zyx_data: color });
        res.json(result);
    } catch (error) {
        console.error('Error setting color:', error);
        res.status(500).json({ error: 'Failed to set color' });
    }
});

app.post('/setSwitchState', async (req, res) => {
    const deviceId = req.body.deviceid;
    const newState = req.body.state;
    const result = await connection.setDevicePowerState(deviceId, newState);
    if (result && result.error === 0) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Failed to set switch state' });
    }
});

app.post('/setColor', jsonParser, async (req, res) => {
    const { deviceId, r, g, b } = req.body;
    console.log(`Setting color to R: ${r}, G: ${g}, B: ${b}`);

    const connection = new ewelink({
        email: login,
        password: pass,
        region: region,
    });

    try {
        const device = await connection.getDevice(deviceId);
        const currentParams = device.params;

        const updatedParams = {
            ...currentParams,
            colorR: r,
            colorG: g,
            colorB: b,
        };

        const result = await connection.setDevicePowerState(deviceId, 'on', updatedParams);
        console.log(result);

        res.json({ success: true });
    } catch (err) {
        console.error(`Error setting color: ${err}`);
        res.json({ success: false });
    }
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});