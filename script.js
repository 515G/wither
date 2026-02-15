const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

// تبديل الواجهات (المنفصلة)
function switchView(viewId, element) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(viewId).classList.add('active');
    element.classList.add('active');
}

// الأذكار
const azkarList = ["سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّه", "اللَّهُمَّ صَلِّ عَلَى مُحَمَّد"];
function changeZekr() {
    document.getElementById("zekr-text").innerText = azkarList[Math.floor(Math.random() * azkarList.length)];
}

// البحث عن الطقس
document.getElementById("search-btn").onclick = () => {
    const city = document.getElementById("city-input").value;
    if(city) getWeatherData(city);
};

async function getWeatherData(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        
        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp-val").innerText = Math.round(data.main.temp) + "°";
        document.getElementById("condition").innerText = data.weather[0].description;
        document.getElementById("weather-data").style.display = "block";
        document.querySelector(".empty-state").style.display = "none";
        
        getPrayerTimes(city);
    } catch { alert("تأكد من اسم المدينة!"); }
}

async function getPrayerTimes(city) {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=4`);
    const json = await res.json();
    const t = json.data.timings;
    document.getElementById("prayer-list").innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.1)">الفجر <b>${t.Fajr}</b></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.1)">الظهر <b>${t.Dhuhr}</b></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.1)">العصر <b>${t.Asr}</b></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.1)">المغرب <b>${t.Maghrib}</b></div>
        <div style="display:flex; justify-content:space-between;">العشاء <b>${t.Isha}</b></div>
    `;
}
