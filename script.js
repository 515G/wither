const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

// 1. وظيفة التنقل بين الواجهات
function go(viewId, el) {
    // إخفاء كل الواجهات
    document.querySelectorAll('.page-container').forEach(p => p.classList.remove('active'));
    // إلغاء تفعيل كل الأزرار
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    
    // إظهار الواجهة المطلوبة
    document.getElementById(viewId).classList.add('active');
    // تفعيل الزر
    el.classList.add('active');
}

// 2. نظام الأذكار
const azkar = ["سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّه", "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد"];
function newZekr() {
    document.getElementById("text-zekr").innerText = azkar[Math.floor(Math.random() * azkar.length)];
}

// 3. جلب بيانات الطقس والصلاة
document.getElementById("search-btn").onclick = async () => {
    const city = document.getElementById("city-input").value;
    if(!city) return;

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        
        // عرض الطقس
        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp-val").innerText = Math.round(data.main.temp) + "°";
        document.getElementById("weather-desc").innerText = data.weather[0].description;
        
        document.getElementById("weather-box").classList.remove("hidden");
        document.getElementById("welcome-msg").classList.add("hidden");
        
        getPrayerData(city);
    } catch {
        alert("خطأ: لم نجد هذه المدينة!");
    }
};

async function getPrayerData(city) {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=4`);
    const d = await res.json();
    const t = d.data.timings;
    document.getElementById("prayer-output").innerHTML = `
        <div style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid rgba(255,255,255,0.05)">الفجر <b>${t.Fajr}</b></div>
        <div style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid rgba(255,255,255,0.05)">الظهر <b>${t.Dhuhr}</b></div>
        <div style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid rgba(255,255,255,0.05)">العصر <b>${t.Asr}</b></div>
        <div style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid rgba(255,255,255,0.05)">المغرب <b>${t.Maghrib}</b></div>
        <div style="display:flex; justify-content:space-between; padding:12px;">العشاء <b>${t.Isha}</b></div>
    `;
}
