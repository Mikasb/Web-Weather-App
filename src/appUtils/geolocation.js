const request = require('request')

/**
 * geolocation method is used to convert city name into 
 * longitude and latitude of the location with the use of mapbox API.
 * This would allow the application to expand by displaying temperatures
 * of other cities as well.
 * @param {*} city - name of the city.
 * @param {*} callback - called after retrieved data.
 */
const geolocation = (city, callback) => {
    const apiKey = 'pk.eyJ1IjoibWlrYXNiIiwiYSI6ImNrYjNnbWZ2ZzA1cGwyeW82OHI4Ymowb3YifQ.Yk42AIWbPe81S66hxH-2uA';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/` + 
    `${encodeURIComponent(city)}.json?access_token=${apiKey}&limit=1`;

    request({url : url, json: true}, (error, {body}) => {
        if (error) //checking low level error like no internet connection
            callback('Cannot connect to location data services.');
        else if(body.features.length < 1 ) //checking specific API errors
            callback('Cannot find the given location.', undefined);
        else
            callback(undefined, {
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1],
                locationName: body.features[0].place_name
            });
        
    })
}

module.exports = geolocation;