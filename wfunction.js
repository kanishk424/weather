function getweather() {
    const apikey = '931f131dde3f4ae2fcbc3289fc646471';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentweatherurl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`;
    const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;

    fetch(currentweatherurl)
    .then(response => {
        console.log("Current weather response:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Weather data:", data);
        displayWeather(data);
    })
    .catch(error => {
        console.error('Current Weather Fetch Error:', error);
        alert('Error fetching current weather data. Please try again.');
    });


    fetch(forecasturl)
    .then(response => {
        console.log("Forecast response:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Forecast data:", data);
        if (data.list) {
            displayhourlyforecast(data.list);
        } else {
            alert("No forecast data found.");
        }
    })
    .catch(error => {
        console.error('Forecast Fetch Error:', error);
        alert('Error fetching forecast data. Please try again.');
    });

}

function displayWeather(data) {
    const tempdivinfo = document.getElementById('temp-div');
    const weatherinfodiv = document.getElementById('weather-div');
    const hourlyforecastdiv = document.getElementById('hourly-forecast');

    tempdivinfo.innerHTML = '';
    weatherinfodiv.innerHTML = '';
    hourlyforecastdiv.innerHTML = '';

    if (data.cod === '404') {
        weatherinfodiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityname = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconcode = data.weather[0].icon;
        const iconurl = `https://openweathermap.org/img/wn/${iconcode}@2x.png`;

        const temperaturehtml = `<p>${temperature}°C</p>`;
        const weatherhtml = `
            <p>${cityname}</p>
            <p>${description}</p>
            <img src="${iconurl}" alt="${description}">
        `;

        tempdivinfo.innerHTML = temperaturehtml;
        weatherinfodiv.innerHTML = weatherhtml;
    }
}

function displayhourlyforecast(hourlydata) {
    const hourlyforecastdiv = document.getElementById('hourly-forecast');
    const next24hours = hourlydata.slice(0, 8); // 3-hour interval x 8 = 24 hours

    next24hours.forEach(item => {
        const datetime = new Date(item.dt * 1000);
        const hour = datetime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconcode = item.weather[0].icon;
        const iconurl = `https://openweathermap.org/img/wn/${iconcode}@2x.png`;

        const hourlyitemhtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconurl}" alt="hourly weather icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyforecastdiv.innerHTML += hourlyitemhtml;
    });
}
