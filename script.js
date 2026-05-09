const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

function showPage(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    element.classList.add('active');
}

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
        getFiveDayForecast(city);
        getPrayers(city);
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

async function getPrayers(city) {
    try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=4`);
        const d = await res.json();
        const t = d.data.timings;
        const times = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const names = ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
        const now = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes();
        const prayerMins = times.map(p => {
            const [h, m] = t[p].split(':').map(Number);
            return h * 60 + m;
        });
        let nextIndex = prayerMins.findIndex(m => m > currentMins);
        let html = '';
        times.forEach((time, i) => {
            const isNext = i === nextIndex;
            html += `<div class="prayer-row${isNext ? ' next-prayer' : ''}">
                <span>${names[i]}${isNext ? ' 🔔' : ''}</span>
                <b>${formatTime12(t[time])}</b>
            </div>`;
        });
        document.getElementById("prayer-output").innerHTML = html;
    } catch (e) { console.error(e); }
}

let count = 0;
const azkar = [
    "سُبْحَانَ اللَّهِ",
    "الْحَمْدُ لِلَّهِ",
    "لَا إِلَهَ إِلَّا اللَّهُ",
    "اللَّهُ أَكْبَرُ",
    "أستغفر الله العظيم",
    "سبحان الله وبحمده",
    "لا حول ولا قوة إلا بالله"
];

function incrementCount() {
    count++;
    document.getElementById("zekr-count").innerText = count;
    if (navigator.vibrate) navigator.vibrate(40);
}

function nextZekr() {
    document.getElementById("zekr-text").innerText = azkar[Math.floor(Math.random() * azkar.length)];
    resetZekr();
}

function resetZekr() {
    count = 0;
    document.getElementById("zekr-count").innerText = count;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('city-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') getWeather();
    });
    const saved = localStorage.getItem('lastCity');
    if (saved) {
        document.getElementById('city-input').value = saved;
        getWeather();
    }
});
