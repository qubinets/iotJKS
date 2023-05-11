const express = require('express');
const ewelink = require('ewelink-api');
const axios = require('axios');
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

app.get('/getTempSensorData', async (req, res) => {
    const connection = new ewelink({
        email: login,
        password: pass,
        region: region,
    });

    try {
        const deviceId = req.query.deviceid;
        const sensorData = await connection.getDevice(deviceId);
        res.json(sensorData.params);
        console.log(sensorData);
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        res.status(500).json({ error: 'Error fetching sensor data' });
    }
});

app.post('/setBrightness', async (req, res) => {
    const { deviceId, brightness } = req.body;

    if (!deviceId || !brightness) {
        return res.status(400).json({ success: false, message: 'Missing device ID or brightness' });
    }

    const data = {
        deviceid: deviceId,
        data: {
            switch: 'on',
            brightness: parseInt(brightness),
            mode: 0,
            brightmin: 1,
            brightmax: 255,
        },
    };

    try {
        // Запрос на ваше устройство
        const response = await axios({
            method: 'post',
            url: 'http://192.168.1.12:8081/zeroconf/dimmable',
            headers: {
                'Content-Length': JSON.stringify(data).length.toString(),
                'Content-Type': 'application/json'
            },
            data: data
        });

        if (response.status !== 200) {
            throw new Error('Device did not respond with status 200');
        }

        console.log('Request sent:', data);
        res.json({ success: true, message: 'Brightness updated successfully' });
    } catch (error) {
        console.error('Error updating brightness:', error);
        res.status(500).json({ success: false, message: 'Failed to update brightness' });
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

app.get('/getDoorSensorData', async (req, res) => {
    const connection = new ewelink({
        email: login,
        password: pass,
        region: region,
    });

    try {
        const deviceId = req.query.deviceid;
        const sensorData = await connection.getDevice(deviceId);
        res.json(sensorData.params);
        console.log(sensorData);
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        res.status(500).json({ error: 'Error fetching sensor data' });
    }
});

app.get('/setDevicePowerState', async (req, res) => {
    try {
        const deviceId = req.query.deviceid;

        const connection = new ewelink({
            email: login,
            password: pass,
            region: region,
        });

        const device = await connection.setDevicePowerState(deviceId);
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

