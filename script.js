const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

// دالة التبديل بين الواجهات
function switchTab(pageId, btnElement) {
    // 1. إخفاء كل الصفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 2. إزالة تفعيل كل الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. إظهار الصفحة المطلوبة وتفعيل زرها
    document.getElementById(pageId).classList.add('active');
    btnElement.classList.add('active');
}

// الأذكار
const azkar = ["سُبْحَانَ اللَّهِ", "الْحَمْدُ لِلَّهِ", "لَا إِلَهَ إِلَّا اللَّهُ", "اللَّهُ أَكْبَرُ"];
function nextZekr() {
    document.getElementById("azkar-text").innerText = azkar[Math.floor(Math.random()*azkar.length)];
}

// الطقس
document.getElementById("search-btn").onclick = async () => {
    const city = document.getElementById("city-input").value;
    if(!city) return;
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp-display").innerText = Math.round(data.main.temp) + "°";
        document.getElementById("weather-desc").innerText = data.weather[0].description;
        document.getElementById("weather-info").style.display = "block";
        document.getElementById("start-msg").style.display = "none";
    } catch { alert("خطأ في اسم المدينة"); }
};
