const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

const themes = {
    Clear: "linear-gradient(-45deg, #f7b733, #fc4a1a)",
    Clouds: "linear-gradient(-45deg, #606c88, #3f4c6b)",
    Rain: "linear-gradient(-45deg, #203a43, #2c5364)",
    Default: "linear-gradient(-45deg, #1e3c72, #2a5298, #2c3e50, #4ca1af)"
};

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) tabcontent[i].style.display = "none";
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active");
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

window.onload = function() {
    const searchBtn = document.getElementById("search-btn");
    const geoBtn = document.getElementById("geo-btn");
    const cityInput = document.getElementById("city-input");

    searchBtn.onclick = () => cityInput.value && getWeatherData(cityInput.value);
    cityInput.onkeydown = (e) => e.key === "Enter" && getWeatherData(cityInput.value);
    geoBtn.onclick = () => navigator.geolocation.getCurrentPosition(p => 
        getWeatherData(null, p.coords.latitude, p.coords.longitude));
};

async function getWeatherData(city, lat = null, lon = null) {
    const msg = document.getElementById("msg-box");
    const weatherInfo = document.getElementById("weather-info");
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=ar`;
    url += city ? `&q=${encodeURIComponent(city)}` : `&lat=${lat}&lon=${lon}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if(data.cod !== 200) throw new Error();

        msg.innerText = "";
        document.getElementById("city-name").innerText = data.name;
        const temp = Math.round(data.main.temp);
        document.getElementById("temp-display").innerText = temp + "°";
        document.getElementById("weather-desc").innerText = data.weather[0].description;
        document.getElementById("main-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        
        const outfit = document.getElementById("outfit-msg");
        if(temp < 15) outfit.innerText = "🧥 الجو بارد، يفضل ارتداء ملابس ثقيلة.";
        else if(temp < 25) outfit.innerText = "👕 الجو معتدل، ملابس خفيفة مناسبة.";
        else outfit.innerText = "☀️ الجو حار، ارتدِ ملابس صيفية مريحة.";

        document.body.style.background = themes[data.weather[0].main] || themes.Default;
        getForecast(data.coord.lat, data.coord.lon);
        weatherInfo.style.display = "block";
    } catch {
        msg.innerText = "المدينة غير موجودة!";
        weatherInfo.style.display = "none";
    }
}

async function getForecast(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ar`);
    const data = await res.json();
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";

    const uniqueDays = new Set();
    data.list.forEach(item => {
        const date = new Date(item.dt_txt);
        const dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' });
        const hour = date.getHours();

        if (!uniqueDays.has(dayName) && hour >= 12 && uniqueDays.size < 4) {
            uniqueDays.add(dayName);
            container.innerHTML += `
                <div class="forecast-day">
                    <p>${dayName}</p>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                    <p>${Math.round(item.main.temp)}°</p>
                </div>`;
        }
    });
}
