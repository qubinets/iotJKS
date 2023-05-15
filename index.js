const express = require('express');
const ewelink = require('ewelink-api');
const axios = require('axios');
const app = express();
const port = 3000;

const login = 'dreamteam.iot@mail.com';
const pass = 'edtr61iot';
const region = 'eu';
const WEATHER_API_KEY = "bf423b16349848f6ae085715231405";
const WEATHER_LAT = '59.23';
const WEATHER_LON = '27.16';

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { Client } = require('pg')
const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'sensors_data',
    user: 'raspberry',
    password: 'raspberry',
})
client.connect();


app.get('/getWeatherData', async (req, res) => {
    const weatherdata = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${WEATHER_LAT},${WEATHER_LON}`);
    const weatherJSON = await weatherdata.json();
    res.json(weatherJSON)
});


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
            console.log("/getDevice query");
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
        console.log("/getDevices query")
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
        if (device && device.params.switches != null) {
            var currentChannelState = device.params.switches[channel - 1].switch;
            // Проверить, необходимо ли переключать состояние
            if (state !== currentChannelState) {
                const result = await connection.toggleDevice(deviceId, channel);
                console.log("/setChannel query");
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
    })
    const auth = await connection.getCredentials();
    console.log(auth)

    try {
        const deviceId = req.query.deviceid;
        const sensorData = await connection.getDevice(deviceId);
        console.log("/getTempSensorData query");
        res.json(sensorData.params);
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

        console.log('/setBrightness Request sent:', data);
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
        console.log("/setSwitchState query");
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
        console.log("/getDoorSensorData query");
        res.json(sensorData.params);
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
            console.log("/setDevicePowerState query")
            res.json(device.params);
        } else {
            res.status(500).json({ error: 'Failed to fetch device data' });
        }
    } catch (error) {
        console.error('Error fetching device data:', error);
        res.status(500).json({ error: 'Error fetching device data' });
    }
});

app.get('/getSensorsDataFromDb', async (req, res) => {
        client.query('select distinct on (sensor_name) * FROM sensors_data ORDER BY sensor_name, timestamp DESC', (error, results) => {
            if (error) {
                throw error
            }
            console.log("/getSensorDataFromDb query")
            res.status(200).json(results.rows)
        })
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

