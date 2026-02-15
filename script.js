const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

// دالة التنقل - السر في إخفاء وإظهار الواجهات
function navigate(tabId, element) {
    // إخفاء كل الواجهات
    const pages = document.querySelectorAll('.page-view');
    pages.forEach(p => p.classList.remove('active'));

    // إزالة اللون الأزرق من كل الأزرار
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => n.classList.remove('active'));

    // إظهار الواجهة المختارة وتفعيل زرها
    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');
}

// نظام الأذكار
const azkar = ["سُبْحَانَ اللَّهِ", "الْحَمْدُ لِلَّهِ", "لا إِلَهَ إِلا اللَّهُ", "اللَّهُ أَكْبَرُ"];
function nextZekr() {
    const text = document.getElementById("azkar-text");
    text.innerText = azkar[Math.floor(Math.random() * azkar.length)];
}

// الطقس والصلاة
document.getElementById("search-btn").onclick = async function() {
    const city = document.getElementById("city-input").value;
    if(!city) return;

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        
        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp-display").innerText = Math.round(data.main.temp) + "°";
        document.getElementById("weather-desc").innerText = data.weather[0].description;
        
        document.getElementById("weather-result").style.display = "block";
        document.getElementById("initial-msg").style.display = "none";
        
        getPrayers(city);
    } catch (e) {
        alert("تأكد من اسم المدينة!");
    }
};

async function getPrayers(city) {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=4`);
    const d = await res.json();
    const t = d.data.timings;
    document.getElementById("prayer-times").innerHTML = `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid rgba(255,255,255,0.05)">الفجر <b>${t.Fajr}</b></div>
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid rgba(255,255,255,0.05)">الظهر <b>${t.Dhuhr}</b></div>
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid rgba(255,255,255,0.05)">العصر <b>${t.Asr}</b></div>
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid rgba(255,255,255,0.05)">المغرب <b>${t.Maghrib}</b></div>
        <div style="display:flex; justify-content:space-between; padding:10px;">العشاء <b>${t.Isha}</b></div>
    `;
}
