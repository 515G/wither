const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

// دالة تبديل الواجهات
function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < contents.length; i++) {
        contents[i].classList.remove("active");
        contents[i].style.display = "none";
    }
    const buttons = document.getElementsByClassName("nav-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// نظام الأذكار
const azkar = [
    "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", 
    "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", 
    "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّه", 
    "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد",
    "سُبْحَانَ اللَّهِ الْعَظِيمِ",
    "لَا إِلَهَ إِلَّا اللَّهُ"
];
function nextZekr() {
    const text = document.getElementById("azkar-text");
    text.innerText = azkar[Math.floor(Math.random() * azkar.length)];
}

// جلب الطقس والصلاة
document.getElementById("search-btn").onclick = () => {
    const city = document.getElementById("city-input").value;
    if(city) getData(city);
};

async function getData(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        
        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp-display").innerText = Math.round(data.main.temp) + "°";
        document.getElementById("weather-desc").innerText = data.weather[0].description;
        document.getElementById("weather-info").style.display = "block";
        document.querySelector(".placeholder-msg").style.display = "none";
        
        getPrayers(city);
    } catch {
        document.getElementById("msg-box").innerText = "خطأ في البحث!";
    }
}

async function getPrayers(city) {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=4`);
    const data = await res.json();
    const t = data.data.timings;
    document.getElementById("prayer-times").innerHTML = `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1)">الفجر <b>${t.Fajr}</b></div>
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1)">الظهر <b>${t.Dhuhr}</b></div>
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1)">العصر <b>${t.Asr}</b></div>
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1)">المغرب <b>${t.Maghrib}</b></div>
        <div style="display:flex; justify-content:space-between; padding:10px;">العشاء <b>${t.Isha}</b></div>
    `;
}
