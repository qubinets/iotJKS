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
client.connect()

var connection;
var auth;

app.get('/getWeatherData', async (req, res) => {
    const weatherdata = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${WEATHER_LAT},${WEATHER_LON}`);
    const weatherJSON = await weatherdata.json();
    res.json(weatherJSON)
});


app.get('/getDevice', async (req, res) => {
    try {
        const deviceId = req.query.deviceid;

        const keyCon = new ewelink({
            at: auth.at,
            apiKey: auth.apiKey,
            region: auth.region,
        });

        const device = await keyCon.getDevice(deviceId);
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
        const keyCon = new ewelink({
            at: auth.at,
            apiKey: auth.apiKey,
            region: auth.region,
        });

        const devices = await keyCon.getDevices();
        console.log("/getDevices query")
        res.json(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
        res.status(500).json({ error: 'Error fetching devices' });
    }
});

app.get('/setChannel', async (req, res) => {
    const state = req.query.state;
    const channel = parseInt(req.query.channel);

    // Запрос на ваше устройство
    const apiUrl = `http://192.168.1.5/cm?cmnd=POWER${channel}%20${state}}`;
    console.log(apiUrl);
    // Send the HTTP request to toggle the relay
    axios({
        url: apiUrl,
    })
        .then(response => {
            console.log('Request sent successfully.');
            console.log('Response:', response.data);
            res.send('Toggle request sent successfully');
        })
        .catch(error => {
            console.error('Error sending request:', error);
            res.status(500).send('Error sending toggle request');
        });

});

app.get('/getTempSensorData', async (req, res) => {
    try {
        auth = await connection.getCredentials();

        const keyCon = new ewelink({
            at: auth.at,
            apiKey: auth.apiKey,
            region: auth.region,
        });

        const deviceId = req.query.deviceid;
        const sensorData = await keyCon.getDevice(deviceId);
        //console.log(`/getTempSensorData query ${Date.now()}`);
        res.send(sensorData.params);
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

app.get('/getDoorSensorData', async (req, res) => {
    const keyCon = new ewelink({
        at: auth.at,
        apiKey: auth.apiKey,
        region: auth.region,
    });

    try {
        const deviceId = req.query.deviceid;
        const sensorData = await keyCon.getDevice(deviceId);
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
        const state = req.query.state; // Добавьте это

        const keyCon = new ewelink({
            at: auth.at,
            apiKey: auth.apiKey,
            region: auth.region,
        });

        const device = await keyCon.setDevicePowerState(deviceId, state);
        if (device) {
            console.log("/setDevicePowerState query")
            res.json(device.params);
        } else {
            res.status(500).json({ error: 'Failed to change device state' }); // Измените сообщение об ошибке
        }
    } catch (error) {
        console.error('Error changing device state:', error); // Измените сообщение об ошибке
        res.status(500).json({ error: 'Error changing device state' }); // Измените сообщение об ошибке
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


const configureApplication = async () => {
    connection = new ewelink({
        email: login,
        password: pass,
        region: region,
    });
    auth = await connection.getCredentials();
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

configureApplication();