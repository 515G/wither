const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

// ===== التنقل =====
function showPage(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    element.classList.add('active');
    if (pageId === 'sky') startSkyCanvas();
}

// ===== الطقس =====
function formatTime12(time) {
    if (!time) return "--:--";
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    const ampm = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

async function getWeather() {
    const city = document.getElementById("city-input").value.trim();
    if (!city) return;
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        if (data.cod !== 200) { alert("المدينة غير موجودة!"); return; }
        document.getElementById("out-city").innerText = "📍 " + data.name;
        document.getElementById("out-temp").innerText = Math.round(data.main.temp) + "°";
        document.getElementById("out-desc").innerText = data.weather[0].description;
        document.getElementById("out-humidity").innerText = data.main.humidity + "%";
        document.getElementById("out-wind").innerText = Math.round(data.wind.speed * 3.6) + " كم/س";
        document.getElementById("out-feels").innerText = Math.round(data.main.feels_like) + "°";
        document.getElementById("out-details").style.display = "flex";
        localStorage.setItem('lastCity', city);
        startWeatherAnimation(data.weather[0].id, data.sys.sunrise, data.sys.sunset);
        getFiveDayForecast(city);
        getPrayers(city);
        showSuhailCard();
    } catch (e) {
        alert("حدث خطأ، تحقق من اتصالك بالإنترنت!");
        console.error(e);
    }
}

async function getFiveDayForecast(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        const forecastDiv = document.getElementById("out-forecast");
        forecastDiv.innerHTML = "";
        for (let i = 0; i < data.list.length; i += 8) {
            const day = data.list[i];
            const dayName = new Date(day.dt * 1000).toLocaleDateString('ar-JO', { weekday: 'short' });
            forecastDiv.innerHTML += `
                <div class="forecast-item">
                    <div>${dayName}</div>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                    <b>${Math.round(day.main.temp)}°</b>
                </div>`;
        }
        document.getElementById("forecast-section").style.display = "block";
    } catch (e) { console.error(e); }
}

// ===== الصلاة =====
let countdownInterval = null;

async function getPrayers(city) {
    try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=4`);
        const d = await res.json();
        const t = d.data.timings;
        const times = ['Fajr', 'D
