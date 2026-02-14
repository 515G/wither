const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

// تدرجات الخلفية بناءً على حالة الطقس الرئيسية
const bgGradients = {
    Clear: "linear-gradient(-45deg, #f7b733, #fc4a1a, #f7b733, #fc4a1a)",
    Clouds: "linear-gradient(-45deg, #606c88, #3f4c6b, #606c88, #3f4c6b)",
    Rain: "linear-gradient(-45deg, #203a43, #2c5364, #0f2027, #2c5364)",
    Snow: "linear-gradient(-45deg, #83a4d4, #b6fbff, #83a4d4, #ffffff)",
    Default: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
};

// وظيفة التنقل بين الصفحات
function showPage(pageId, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    btn.classList.add('active');
}

// تشغيل البحث عند النقر أو ضغط Enter
document.getElementById("search-btn").addEventListener("click", () => getWeather(document.getElementById("city").value));
document.getElementById("city").addEventListener("keypress", (e) => { if(e.key === "Enter") getWeather(e.target.value); });

// جلب الموقع الحالي
document.getElementById("location-btn").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(p => getWeather(null, p.coords.latitude, p.coords.longitude));
    }
});

async function getWeather(city, lat = null, lon = null) {
    const error = document.getElementById("error");
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=ar`;
    url += city ? `&q=${encodeURIComponent(city)}` : `&lat=${lat}&lon=${lon}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.cod !== 200) throw new Error();

        // تحديث البيانات الأساسية
        document.getElementById("cityName").textContent = data.name;
        const temp = Math.round(data.main.temp);
        document.getElementById("temp").textContent = temp + "°";
        document.getElementById("desc").textContent = data.weather[0].description;
        document.getElementById("humidity").textContent = data.main.humidity + "%";
        document.getElementById("wind").textContent = data.wind.speed + " م/ث";
        document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        document.getElementById("date").textContent = new Date().toLocaleDateString('ar-EG', {weekday:'long', day:'numeric', month:'long'});

        // منطق اقتراح الملابس
        const sug = document.getElementById("suggestion");
        if(temp < 15) sug.textContent = "🧥 الجو بارد، المعطف ضروري جداً!";
        else if(temp < 25) sug.textContent = "👕 الجو لطيف، ملابس خفيفة تكفي.";
        else sug.textContent = "☀️ الجو حار، ارتدِ ملابس صيفية واشرب الماء.";

        // تغيير الخلفية المتحركة
        const status = data.weather[0].main;
        document.body.style.background = bgGradients[status] || bgGradients.Default;
        
        // جلب توقعات الأيام القادمة
        getForecast(data.coord.lat, data.coord.lon);
        
        document.getElementById("card").style.display = "block";
        error.textContent = "";
        
        // حفظ المدينة في الذاكرة المحلية
        localStorage.setItem("lastCity", data.name);

    } catch {
        error.textContent = "لم نجد المدينة المطلوبة!";
    }
}

async function getForecast(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ar`);
    const data = await res.json();
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";
    
    // فلترة البيانات لعرض يوم واحد فقط من كل 8 قراءات (لأن الـ API يعطي قراءة كل 3 ساعات)
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        const dateName = new Date(day.dt_txt).toLocaleDateString('ar-EG', {weekday:'short'});
        forecastDiv.innerHTML += `
            <div class="forecast-item">
                <div>${dateName}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <div>${Math.round(day.main.temp)}°</div>
            </div>`;
    }
}

// تحميل آخر مدينة تم البحث عنها عند فتح التطبيق
window.onload = () => {
    const last = localStorage.getItem("lastCity");
    if(last) getWeather(last);
};
