const twelveHourBtn = document.querySelector('.twelveHourBtn');
const oneDayBtn = document.querySelector('.oneDayBtn');
const threeDayBtn = document.querySelector('.threeDayBtn');
const refreshBtn = document.querySelector('.refreshBtn');
let lineChart;
const cityName = 'Vilnius';

getData();

twelveHourBtn.addEventListener('click', (event) => {
    event.preventDefault();
    fetch(`http://localhost:3000/weather?cityName=${cityName}`).then(response => {
    response.json().then(parsedData => {
        lineChart.destroy();
        drawChart(parsedData, 24);
        })
    });
})

threeDayBtn.addEventListener('click', (event) => {
    event.preventDefault();
    fetch(`http://localhost:3000/weather?cityName=${cityName}`).then(response => {
    response.json().then(parsedData => {
        lineChart.destroy();
        drawChart(parsedData, 144);
        })
    });
})

oneDayBtn.addEventListener('click', (event) => {
    event.preventDefault();
    fetch(`http://localhost:3000/weather?cityName=${cityName}`).then(response => {
    response.json().then(parsedData => {
        lineChart.destroy();
        drawChart(parsedData, 48);
        })
    });
})

function sendRequest(data, method){
    const options = {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    }
    fetch('/update', options);
}

refreshBtn.addEventListener('click', (event) => {
    event.preventDefault();
    sendRequest({refresh: 'refreshDB'}, 'POST')

})


async function getData(period = 24){
    fetch(`http://localhost:3000/weather?cityName=${cityName}`).then(response => {
    response.json().then(parsedData => {
        drawChart(parsedData, period);
        })
    });
}


/**
 * Chart logic
 */

function drawChart(data, period){
    let dateLabels = []
    let tempData = []

    for(let i = 0; i < data.length; i+=period){
        tempData.push(data[i].temp.value)
        dateLabels.push(data[i].observation_time.value.substring(2, 10) + ' ' +data[i].observation_time.value.substring(11, 16))
    }

    console.log(dateLabels)
    console.log(tempData)

    let weatherChart = document.getElementById('weatherChart').getContext('2d');
    Chart.defaults.global.defaultFontFamily = 'Arial';
    Chart.defaults.global.defaultFontSize = 15; 
    Chart.defaults.global.defaultFontColor = "black";
    Chart.defaults.global.defaultFontStyle = 'Bold';
    lineChart = new Chart(weatherChart, {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: [{
                label: 'Temperature',
                data: tempData,
                backgroundColor: '#29A7BB',
                borderWidth:2,
                hoverBorderWidth:4,
                borderColor: 'black',
                hoverBorderColor: 'black'
            }]
        },
        options: {
            title:{
                display: true,
                text: 'Temperatures in Vilnius',
                fontSize: 22
            },
            legend:{
                position: 'right',
                backgroundColor: '#29A7BB'
            }
        }
            })
    }



