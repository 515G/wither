const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

const azkar = [
    "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    "لا حَوْلَ وَلا قُوَّةَ إِلاَّ بِاللَّه",
    "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد",
    "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلا إِلَهَ إِلا اللَّهُ"
];
let zekrIndex = 0;

function nextZekr() {
    zekrIndex = (zekrIndex + 1) % azkar.length;
    document.getElementById("azkar-text").innerText = azkar[zekrIndex];
}

function openTab(evt, tabName) {
    document.querySelectorAll(".tab-content").forEach(c => c.style.display = "none");
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("city-input");
    const searchBtn = document.getElementById("search-btn");

    // إجبار المتصفح على التركيز على صندوق النص
    setTimeout(() => cityInput.focus(), 600);

    searchBtn.onclick = () => getWeatherData(cityInput.value);
    cityInput.onkeydown = (e) => {
        if(e.key === "Enter") getWeatherData(cityInput.value);
    };

    document.getElementById("geo-btn").onclick = () => {
        navigator.geolocation.getCurrentPosition(p => 
            getWeatherData(null, p.coords.latitude, p.coords.longitude)
        );
    };
});

async function getWeatherData(city, lat = null, lon = null) {
    if(!city && lat === null) return;
    const msg = document.getElementById("msg-box");
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
        
        const t = data.main.temp;
        document.getElementById("outfit-msg").innerText = t < 15 ? "🧥 البس ثقيل" : t < 25 ? "👕 ملابس خفيفة" : "☀️ ملابس صيفية";

        document.getElementById("weather-info").style.display = "block";
        getForecast(data.coord.lat, data.coord.lon);
        getPrayerTimes(data.name);
    } catch {
        msg.innerText = "تعذر العثور على البيانات!";
    }
}

async function getPrayerTimes(city) {
    try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=4`);
        const data = await res.json();
        const t = data.data.timings;
        document.getElementById("prayer-times").innerHTML = `
            <div class="prayer-item"><span>الفجر</span> <span>${t.Fajr}</span></div>
            <div class="prayer-item"><span>الظهر</span> <span>${t.Dhuhr}</span></div>
            <div class="prayer-item"><span>العصر</span> <span>${t.Asr}</span></div>
            <div class="prayer-item"><span>المغرب</span> <span>${t.Maghrib}</span></div>
            <div class="prayer-item"><span>العشاء</span> <span>${t.Isha}</span></div>`;
    } catch {
        document.getElementById("prayer-times").innerHTML = "<p>فشل جلب مواقيت الصلاة</p>";
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
