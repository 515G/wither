const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) tabcontent[i].style.display = "none";
    
    const tablinks = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active");
    
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const geoBtn = document.getElementById("geo-btn");
    const cityInput = document.getElementById("city-input");

    searchBtn.onclick = () => getWeatherData(cityInput.value);
    cityInput.onkeypress = (e) => e.key === "Enter" && getWeatherData(cityInput.value);
    geoBtn.onclick = () => navigator.geolocation.getCurrentPosition(p => 
        getWeatherData(null, p.coords.latitude, p.coords.longitude));
});

async function getWeatherData(city, lat = null, lon = null) {
    const msg = document.getElementById("msg-box");
    const weatherInfo = document.getElementById("weather-info");
    if (!city && lat === null) return;

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
        const temp = data.main.temp;
        if(temp < 15) outfit.innerText = "🧥 الجو بارد، البس ثقيل.";
        else if(temp < 25) outfit.innerText = "👕 الجو معتدل، ملابس خفيفة.";
        else outfit.innerText = "☀️ الجو حار، البس صيفي.";

        getForecast(data.coord.lat, data.coord.lon);
        weatherInfo.style.display = "block";
    } catch {
        msg.innerText = "تعذر العثور على المدينة!";
        weatherInfo.style.display = "none";
    }
}

async function getForecast(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ar`);
    const data = await res.json();
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";

    const days = {};
    data.list.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString('ar-EG', {weekday: 'short'});
        if (!days[date] && Object.keys(days).length < 4) {
            days[date] = item;
            container.innerHTML += `
                <div class="forecast-day">
                    <p>${date}</p>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                    <p>${Math.round(item.main.temp)}°</p>
                </div>`;
        }
    });
}
