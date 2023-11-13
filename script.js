document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const cityInput = document.getElementById('cityInput').value;
    getWeather(cityInput);
});

function getWeather(city) {
    
    const apiKey = 'ac7cfdad3180ba5a0c973ed1afcfe1f5';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
      console.log(data);
      });
}

function currentForecast() {
    
}