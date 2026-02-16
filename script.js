const API_KEY = "6b7edc82798b727dce5282c19e9298a6";
// دالة تحويل الوقت لنظام 12 ساعة
function formatTime12(time) {
    if (!time) return "--:--";
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    const ampm = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12 || 12; // تحويل الساعة 0 لـ 12
    return `${hours}:${minutes} ${ampm}`;
}
// 1. التبديل بين الواجهات (Tabs)
function showPage(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    element.classList.add('active');
}

// 2. الدالة الرئيسية لجلب البيانات
async function getWeatherData() {
    const city = document.getElementById("city-input").value;
    if(!city) return;

    try {
        // طلب طقس اليوم الحالي
        const resToday = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const dataToday = await resToday.json();
        
        // تحديث واجهة اليوم الحالي
        document.getElementById("out-city").innerText = dataToday.name;
        document.getElementById("out-temp").innerText = Math.round(dataToday.main.temp) + "°";
        document.getElementById("out-desc").innerText = dataToday.weather[0].description;

        // طلب توقعات الـ 5 أيام (Forecast)
        const resForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const dataForecast = await resForecast.json();
        
        // استدعاء دالة رسم الخمس أيام
        renderFiveDays(dataForecast);
        
        // جلب مواقيت الصلاة للمدينة
        getPrayers(city);

        // إظهار قسم التوقعات (كان مخفي)
        document.getElementById("forecast-section").classList.remove("hidden");
        document.getElementById("forecast-section").style.display = "block";

    } catch (error) {
        console.error("Error:", error);
        alert("تأكد من اسم المدينة بشكل صحيح!");
    }
}

// 3. دالة معالجة وعرض الـ 5 أيام
function renderFiveDays(data) {
    const grid = document.getElementById("out-forecast");
    grid.innerHTML = ""; // تنظيف المحتوى القديم

    // الفلترة: API يعطي توقعات كل 3 ساعات، نأخذ توقع واحد لكل يوم (عند الساعة 12 ظهراً مثلاً)
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('ar-JO', { weekday: 'short' });
        const icon = day.weather[0].icon;
        const temp = Math.round(day.main.temp);

        grid.innerHTML += `
            <div class="forecast-item" style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 10px; text-align: center;">
                <div style="font-size: 12px; margin-bottom: 5px;">${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${icon}.png" style="width: 30px;">
                <b style="display: block; color: #38bdf8; font-size: 14px;">${temp}°</b>
            </div>
        `;
    });
}

// 4. مواقيت الصلاة
async function getPrayers(city) {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=4`);
    const d = await res.json();
    const t = d.data.timings;
    const names = {'Fajr':'الفجر', 'Dhuhr':'الظهر', 'Asr':'العصر', 'Maghrib':'المغرب', 'Isha':'العشاء'};
    let html = '';
    for(let key in names) {
        html += `<div class="prayer-row" style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid rgba(255,255,255,0.05)">
                    <span>${names[key]}</span><b>${t[key]}</b>
                 </div>`;
    }
    document.getElementById("prayer-output").innerHTML = html;
}

// 5. الأذكار
const azkar = ["سُبْحَانَ اللَّهِ", "الْحَمْدُ لِلَّهِ", "اللَّهُ أَكْبَرُ", "أستغفر الله"];
function nextZekr() {
    document.getElementById("zekr-text").innerText = azkar[Math.floor(Math.random()*azkar.length)];
}

