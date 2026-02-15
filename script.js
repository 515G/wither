const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

const azkar = [
    "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", "أَسْتَغْفِرُ اللَّهَ وَأَتوبُ إِلَيْهِ", 
    "لا حَوْلَ وَلا قُوَّةَ إِلاَّ بِاللَّه", "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد",
    "لا إله إلا الله وحده لا شريك له", "سبحان الله العظيم", "الحمد لله حمداً كثيراً",
    "يا حي يا قيوم برحمتك أستغيث", "حسبنا الله ونعم الوكيل", "اللهم إنك عفو تحب العفو فاعف عني"
];

function nextZekr() {
    document.getElementById("azkar-text").innerText = azkar[Math.floor(Math.random() * azkar.length)];
}

function openTab(evt, tabId) {
    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
    evt.currentTarget.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("city-input");
    document.getElementById("search-btn").onclick = () => getData(cityInput.value);
    cityInput.onkeydown = (e) => e.key === "Enter" && getData(cityInput.value);
    setTimeout(() => cityInput.focus(), 500);
});

async function getData(city) {
    if(!city) return;
    const msg = document.getElementById("msg-box");
    try {
        const wRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const wData = await wRes.json();
        if(wData.cod !== 200) throw new Error();

        msg.innerText = "";
        document.getElementById("city-name").innerText = wData.name;
        document.getElementById("temp-display").innerText = Math.round(wData.main.temp) + "°";
        document.getElementById("weather-desc").innerText = wData.weather[0].description;
        document.getElementById("weather-info").style.display = "block";
        document.getElementById("weather-placeholder").style.display = "none";
        
        getForecast(wData.coord.lat, wData.coord.lon);
        getPrayers(city);
    } catch { msg.innerText = "المدينة غير صحيحة!"; }
}

async function getPrayers(city) {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=4`);
    const d = await res.json();
    const t = d.data.timings;
    document.getElementById("prayer-times").innerHTML = `
        <div class="prayer-item">الفجر <span>${t.Fajr}</span></div>
        <div class="prayer-item">الظهر <span>${t.Dhuhr}</span></div>
        <div class="prayer-item">العصر <span>${t.Asr}</span></div>
        <div class="prayer-item">المغرب <span>${t.Maghrib}</span></div>
        <div class="prayer-item">العشاء <span>${t.Isha}</span></div>`;
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
