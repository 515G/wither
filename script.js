const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

// الدالة المسؤولة عن جعل الأزرار تنضغط وتبدل الواجهات
function showTab(event, tabId) {
    // 1. إخفاء كل الواجهات
    const tabs = document.querySelectorAll('.tab-view');
    tabs.forEach(tab => tab.classList.remove('active'));

    // 2. إلغاء تفعيل كل الأزرار
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // 3. إظهار الواجهة المطلوبة فقط
    document.getElementById(tabId).classList.add('active');

    // 4. تفعيل الزر الذي تم الضغط عليه
    event.currentTarget.classList.add('active');
}

// باقي العمليات (طقس وأذكار)
function nextZekr() {
    const azkar = ["سُبْحَانَ اللَّهِ", "الْحَمْدُ لِلَّهِ", "اللَّهُ أَكْبَرُ"];
    document.getElementById("azkar-text").innerText = azkar[Math.floor(Math.random()*azkar.length)];
}

document.getElementById("search-btn").onclick = async () => {
    const city = document.getElementById("city-input").value;
    if(!city) return;
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp-display").innerText = Math.round(data.main.temp) + "°";
        document.getElementById("weather-result").style.display = "block";
        document.querySelector(".hint-text").style.display = "none";
    } catch { alert("خطأ في المدينة"); }
};
