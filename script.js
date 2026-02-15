const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

function openTab(evt, tabName) {
    const contents = document.querySelectorAll(".tab-content");
    contents.forEach(c => c.style.display = "none");
    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach(b => b.classList.remove("active"));
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const cityInput = document.getElementById("city-input");
    const geoBtn = document.getElementById("geo-btn");

    searchBtn.onclick = () => getWeatherData(cityInput.value);
    cityInput.onkeydown = (e) => { if(e.key === "Enter") getWeatherData(cityInput.value); };
    geoBtn.onclick = () => navigator.geolocation.getCurrentPosition(p => 
        getWeatherData(null, p.coords.latitude, p.coords.longitude));
});

async function getWeatherData(city, lat = null, lon = null) {
    if (!city && lat === null) return;
    const msg = document.getElementById("msg-box");
    const info = document.getElementById("weather-info");
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=ar`;
    url += city ? `&q=${encodeURIComponent(city)}` : `&lat=${lat}&lon=${lon}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if(data.cod !== 200) throw new Error();

        msg.innerText = "";
        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp-display").innerText = Math.round(data.main.temp) + "°";
        document.getElementById("weather-desc").innerText = data.weather[0].description;
        document.getElementById("main-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        
        const outfit = document.getElementById("outfit-msg");
        const t = data.main.temp;
        outfit.innerText = t < 15 ? "🧥 البس ثقيل" : t < 25 ? "👕 ملابس خفيفة" : "☀️ ملابس صيفية";

        getForecast(data.coord.lat, data.coord.lon);
        info.style.display = "block";
    } catch {
        msg.innerText = "تعذر العثور على المدينة!";
        info.style.display = "none";
    }
}

async function getForecast(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ar`);
    const data = await res.json();
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";
    const seen = new Set();
    data.list.forEach(item => {
        const d = new Date(item.dt_txt);
        const day = d.toLocaleDateString('ar-EG', {weekday: 'short'});
        if (!seen.has(day) && d.getHours() >= 12 && seen.size < 4) {
            seen.add(day);
            container.innerHTML += `<div class="forecast-day"><p>${day}</p><img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png"><p>${Math.round(item.main.temp)}°</p></div>`;
        }
    });
}
