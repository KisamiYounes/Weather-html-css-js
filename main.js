
const locationInput = document.getElementById("location");
const searchBtn = document.getElementById("searchBtn");
const forecastContainer = document.getElementById("forecast-cards");

async function fetchCityCoordinates(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
        alert("City not found!");
        return null;
    }
    // Pick first (most relevant match)
    return data.results[0];
}

async function fetchWeather(lat, lon, cityName) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();

    forecastContainer.innerHTML = `<h3 style="grid-column: 1/-1; margin-bottom:1rem;">7-Day Forecast for ${cityName}</h3>`;

    data.daily.time.forEach((date, index) => {
        const day = new Date(date);
        const options = { weekday: "short", month: "short", day: "numeric" };
        const formattedDate = day.toLocaleDateString(undefined, options);

        const maxTemp = data.daily.temperature_2m_max[index];
        const minTemp = data.daily.temperature_2m_min[index];
        const weatherCode = data.daily.weathercode[index];

        const weatherMap = {
            0: "☀️ Clear",
            1: "🌤️ Mainly Clear",
            2: "⛅ Partly Cloudy",
            3: "☁️ Cloudy",
            45: "🌫️ Fog",
            48: "🌫️ Rime Fog",
            51: "🌦️ Light Drizzle",
            61: "🌧️ Rain",
            71: "❄️ Snow",
            95: "⛈️ Thunderstorm"
        };

        const weather = weatherMap[weatherCode] || "🌍 Weather";

        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h3>${formattedDate}</h3>
            <p>${weather}</p>
            <p>🌡️ Max: ${maxTemp}°C</p>
            <p>🌙 Min: ${minTemp}°C</p>
        `;
        forecastContainer.appendChild(card);
    });
}

// Handle search
searchBtn.addEventListener("click", async () => {
    const city = locationInput.value.trim();
    if (!city) return alert("Please enter a city name!");
    const cityData = await fetchCityCoordinates(city);
    if (cityData) {
        fetchWeather(cityData.latitude, cityData.longitude, cityData.name);
    }
});