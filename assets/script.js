const search = document.getElementById('search');
const city = document.getElementById('city');
const srchHistory = document.querySelector('.history');
const currentWeather = document.querySelector('.crtWeather');
const historyStorage = JSON.parse(localStorage.getItem('srchHistory')) || [];

function displayCurrentWeather(data) {
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("date").textContent = `Date: ${dayjs.unix(data.dt).format("ddd MM/DD/YYYY")}`;
    document.getElementById("temp").textContent = `Temperature: ${data.main.temp} F`;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity} %`;
    document.getElementById("windspeed").textContent = `Wind Speed: ${data.wind.speed} MPH`;
    document.getElementById("icon").src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
}

function showFiveDayData(data) {
    const fiveday = document.querySelector(".fiveday");
    fiveday.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) {
        const day = document.createElement("div");
        day.className = "singleFiveDay"
        const date = document.createElement("h4");
        date.textContent = dayjs.unix(data.list[i].dt).format("ddd MM/DD/YYYY");
        const temp = document.createElement("p");
        const humidity = document.createElement("p");
        const windspeed = document.createElement("p");
        const icon = document.createElement("img");

        day.append(icon, date, temp, humidity, windspeed);
        fiveday.append(day);

        temp.textContent = `Temp: ${data.list[i].main.temp} F`;
        humidity.textContent = `Humidity: ${data.list[i].main.humidity} %`;
        windspeed.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
        icon.src = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
    }
}

function updateSearchHistory(cityName) {
    historyStorage.push(cityName);
    localStorage.setItem('srchHistory', JSON.stringify(historyStorage));
}

function showHistory() {
    srchHistory.innerHTML = '';

    historyStorage.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        srchHistory.appendChild(listItem);
        listItem.addEventListener("click", () => {
            historyClick(item);
        });
    });
}

function historyClick(cityName) {
    const apiKey = 'ac7cfdad3180ba5a0c973ed1afcfe1f5';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${apiKey}&units=imperial`;

    fetchDataAndUpdate(apiUrl);
}

function fetchDataAndUpdate(apiUrl) {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            fetchForecastData(data.name); 
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

search.addEventListener('submit', event => {
    event.preventDefault();
    const cityName = city.value;
    updateSearchHistory(cityName);
    showHistory();
    city.value = '';

    const apiKey = 'ac7cfdad3180ba5a0c973ed1afcfe1f5';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${apiKey}&units=imperial`;

    fetchDataAndUpdate(apiUrl);
});

function fetchForecastData(cityName) {
    const apiKey = 'ac7cfdad3180ba5a0c973ed1afcfe1f5';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            showFiveDayData(data);
        });
}

showHistory();
