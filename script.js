const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

const azkar = ["سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", "لا حَوْلَ وَلا قُوَّةَ إِلاَّ بِاللَّه", "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد", "سبحان الله العظيم", "الحمد لله كثيراً"];

function nextZekr() {
    document.getElementById("azkar-text").innerText = azkar[Math.floor(Math.random() * azkar.length)];
}

document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("city-input");
    document.getElementById("search-btn").onclick = () => getAll(cityInput.value);
    cityInput.onkeydown = (e) => e.key === "Enter" && getAll(cityInput.value);
    cityInput.focus();
});

async function getAll(city) {
    if(!city) return;
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        
        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp-display").innerText = Math.round(data.main.temp) + "°";
        document.getElementById("weather-desc").innerText = data.weather[0].description;
        
        getForecast(data.coord.lat, data.coord.lon);
        getPrayers(city);
    } catch { document.getElementById("msg-box").innerText = "خطأ في الاسم!"; }
}

async function getPrayers(city) {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=4`);
    const d = await res.json();
    const t = d.data.timings;
    document.getElementById("prayer-times").innerHTML = `
        <div class="prayer-item">الفجر<b>${t.Fajr}</b></div>
        <div class="prayer-item">الظهر<b>${t.Dhuhr}</b></div>
        <div class="prayer-item">العصر<b>${t.Asr}</b></div>
        <div class="prayer-item">المغرب<b>${t.Maghrib}</b></div>
        <div class="prayer-item">العشاء<b>${t.Isha}</b></div>`;
}

async function getForecast(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ar`);
    const data = await res.json();
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";
    const seen = new Set();
    data.list.forEach(item => {
        const day = new Date(item.dt_txt).toLocaleDateString('ar-EG', {weekday: 'short'});
        if (!seen.has(day) && seen.size < 4) {
            seen.add(day);
            container.innerHTML += `<div class="forecast-day"><p>${day}</p><img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png"><p>${Math.round(item.main.temp)}°</p></div>`;
        }
    });
}
