/**
 * 
 * @param {*} longitude - longitude of the given city (e.g. 52.66)
 * @param {*} latitude - latitude of the given city (e.g. 22.3)
 * @param {*} startTime - observation start date (e.g. 2020-06-08T09:20:00.000Z)
 * @param {*} endTime - observation end date (e.g. 2020-06-07T09:20:00.000Z)
 * @param {*} units - si/us to retrieve data in celsius or fahrenheit
 * @return - URL to access the API json data
 */
const weather = (longitude, latitude, startTime, endTime, units) => {
    const apiKey = 'g7pYjMY0G8IuD3tJUWnF1KqzOa6ac3w3';
    const url = 'https://api.climacell.co/v3/weather/historical/station' +
    `?lat=${latitude}` +
    `&lon=${longitude}` +
    `&unit_system=${units}` +
    `&start_time=${startTime}` + 
    `&end_time=${endTime}` +
    `&fields=temp%2Cfeels_like%2Cwind_speed%2Ccloud_cover&&apikey=${apiKey}`;
    return url;
}

module.exports = weather;