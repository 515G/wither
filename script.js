const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

// 1. نظام تبديل الواجهات
function switchView(evt, viewId) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.getElementById(viewId).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// 2. نظام الأذكار (قائمة كبيرة)
const azkar = ["سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", "لا حَوْلَ وَلا قُوَّةَ إِلاَّ بِاللَّه", "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد", "لا إله إلا أنت سبحانك إني كنت من الظالمين"];
function nextZekr() {
    const text = azkar[Math.floor(Math.random() * azkar.length)];
    document.getElementById("azkar-text").innerText = text;
}

// 3. نظام المهام (Todo List)
function addTodo() {
    const input = document.getElementById("todo-input");
    if (!input.value) return;
    const li = document.createElement("li");
    li.innerHTML = `${input.value} <i class="fas fa-trash" onclick="this.parentElement.remove()"></i>`;
    document.getElementById("todo-list").appendChild(li);
    input.value = "";
}

// 4. نظام الطقس والصلاة (الدمج)
document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("city-input");
    document.getElementById("search-btn").onclick = () => getWeatherData(cityInput.value);
    cityInput.onkeydown = (e) => e.key === "Enter" && getWeatherData(cityInput.value);
    cityInput.focus();
});

async function getWeatherData(city) {
    if (!city) return;
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        if(data.cod !== 200) return;

        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp-display").innerText = Math.round(data.main.temp) + "°";
        document.getElementById("weather-desc").innerText = data.weather[0].description;
        document.getElementById("weather-info").style.display = "block";
        
        getPrayerTimes(data.name);
    } catch { alert("خطأ في البيانات"); }
}

async function getPrayerTimes(city) {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=4`);
    const data = await res.json();
    const t = data.data.timings;
    document.getElementById("prayer-city").innerText = `مواقيت الصلاة في ${city}`;
    document.getElementById("prayer-times").innerHTML = `
        <div class="prayer-item"><span>الفجر</span> <span>${t.Fajr}</span></div>
        <div class="prayer-item"><span>الظهر</span> <span>${t.Dhuhr}</span></div>
        <div class="prayer-item"><span>العصر</span> <span>${t.Asr}</span></div>
        <div class="prayer-item"><span>المغرب</span> <span>${t.Maghrib}</span></div>
        <div class="prayer-item"><span>العشاء</span> <span>${t.Isha}</span></div>`;
}
