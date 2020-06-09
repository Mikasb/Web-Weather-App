var rp = require('request-promise');
const express = require('express')
const path = require('path')
const app = express()
const geolocation = require('./appUtils/geolocation')
const weather = require('./appUtils/weather')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const connectionURL = 'mongodb+srv://Mikasb:Mikasb123@cluster0-tmjix.mongodb.net/weatherDB?retryWrites=true&w=majority'
const databaseName = 'weatherDB'
const port = process.env.PORT || 3000


/**
 * HTML file path for express to use the public folder
 */
const publicFolderPath = path.join(__dirname, '../public')
app.use(express.static(publicFolderPath))

/**
 * Gets a GET request from the client whenever
 * the user clicks on either of time-span buttons
 * and sends the data using retrieveData method.
 */
app.get('/weather', (req, res) => {
    if (!req.query.cityName) {
        return res.send(databaseData)
    }
    retrieveData((databaseData) => {
        res.send(databaseData)
    })
})

/**
 * Updates the database whenever the user clicks refresh button
 * in the application. It contains geolocation utility to potentially
 * query other cities using mapbox api. Vilnius is hard-coded for now.
 * All API URL's are retrieved by given/hard-coded parameters and passed
 * further to insert data into the database.
 */
app.post('/update', (req, res) => {
    let weatherApiUrls = [];
    geolocation('Vilnius', (locationApiError, locationData) => {
        //Date parameters to get 4 week long observations
        let longestQueryPeriod = 28; // 4 weeks
        let startDate = new Date();
        let endDate = new Date();
        startDate.setDate(startDate.getDate() - longestQueryPeriod);
        endDate.setDate(endDate.getDate() - (longestQueryPeriod - 1));

        if (locationApiError)
            return res.send({ error: locationApiError })
        else
            while (longestQueryPeriod >= 1) {
                weatherApiUrls.push(weather(locationData.longitude, locationData.latitude, startDate.toISOString(), endDate.toISOString(), 'si'));
                startDate.setDate(startDate.getDate() + 1);
                endDate.setDate(endDate.getDate() + 1);
                longestQueryPeriod--;
            }
        insertData(weatherApiUrls);
    })
})

/**
 * insertData method gets all the neccessary API URL's
 * to get 4 week long weather data. The data is then stored using update
 * function to override an existing document if it exists and
 * if it does not - insert it.
 * @param {*} weatherApiUrls - array of URL's of weather API 
 */
const insertData = (weatherApiUrls) => {
    MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
        if (error) {
            console.log('Failed to connect to the database.');
        } else {
            const db = client.db(databaseName);
            var allPromises = [];
            weatherApiUrls.forEach((url) => {
                allPromises.push(rp({ url: url, json: true }));
            })
            Promise.all(allPromises).then((results) => {
                results.forEach(result => {
                    result.forEach(document => {
                        db.collection('weather').update({ 'observation_time.value': document.observation_time.value }, document, { upsert: true })
                    })
                })
            })
        }
    })
}

/**
 * retrieveData method retrieves all data from the database
 * sorted by observation time (e.g. 2020-06-08T09:20:00.000Z)
 * @param {*} callback 
 */
const retrieveData = (callback) => {
    MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
        if (error) {
            console.log('Failed to connect to the database.');
        } else {
            const db = client.db(databaseName);
            db.collection('weather').find({}).sort({ 'observation_time.value': +1 }).toArray((error, retrievedData) => {
                callback(retrievedData);
            })
        }
    })
}

app.listen(port, () => {
    console.log('Server connection was established.', port)
})