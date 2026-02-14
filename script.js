const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

const themes = {
    Clear: "linear-gradient(-45deg, #f7b733, #fc4a1a)",
    Clouds: "linear-gradient(-45deg, #606c88, #3f4c6b)",
    Rain: "linear-gradient(-45deg, #203a43, #2c5364)",
    Default: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
};

// انتظر حتى يتم تحميل الـ HTML بالكامل قبل تفعيل الأزرار
document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const locBtn = document.getElementById("loc-btn");
    const cityInput = document.getElementById("city-input");

    // تفعيل زر البحث
    if (searchBtn) {
        searchBtn.onclick = () => {
            const city = cityInput.value;
            if (city) fetchWeather(city);
        };
    }

    // تفعيل البحث عند ضغط Enter
    if (cityInput) {
        cityInput.onkeypress = (e) => {
            if (e.key === "Enter") fetchWeather(cityInput.value);
        };
    }

    // تفعيل زر الموقع
    if (locBtn) {
        locBtn.onclick = () => {
            navigator.geolocation.getCurrentPosition(
                p => fetchWeather(null, p.coords.latitude, p.coords.longitude),
                err => alert("يرجى تفعيل الوصول للموقع")
            );
        };
    }
});

// وظيفة التبديل بين الأقسام (Tabs)
function changeTab(tabId, btn) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

async function fetchWeather(city, lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=ar`;
    if (city) url += `&q=${encodeURIComponent(city)}`;
    else url += `&lat=${lat}&lon=${lon}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.cod !== 200) {
            document.getElementById("error-msg").textContent = "المدينة غير موجودة!";
            document.getElementById("weather-display").style.display = "none";
            return;
        }

        // تحديث الواجهة
        document.getElementById("cityName").textContent = data.name;
        const temp = Math.round(data.main.temp);
        document.getElementById("temp-val").textContent = temp + "°";
        document.getElementById("weather-desc").textContent = data.weather[0].description;
        document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        
        // اقتراح الملابس
        const sug = document.getElementById("suggestion-msg");
        if (temp < 15) sug.textContent = "🧥 الجو بارد، البس ثقيل!";
        else if (temp < 25) sug.textContent = "👕 الجو لطيف، ملابس خفيفة.";
        else sug.textContent = "☀️ الجو حار، البس صيفي.";

        document.body.style.background = themes[data.weather[0].main] || themes.Default;
        
        // جلب التوقعات
        fetchForecast(data.coord.lat, data.coord.lon);

        document.getElementById("weather-display").style.display = "block";
        document.getElementById("error-msg").textContent = "";
    } catch (e) {
        document.getElementById("error-msg").textContent = "خطأ في الاتصال بالإنترنت!";
    }
}

async function fetchForecast(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ar`);
    const data = await res.json();
    const container = document.getElementById("forecast-box");
    container.innerHTML = "";

    for (let i = 0; i < data.list.length; i += 8) {
        const d = data.list[i];
        const day = new Date(d.dt_txt).toLocaleDateString('ar-EG', { weekday: 'short' });
        container.innerHTML += `
            <div class="forecast-item">
                <div>${day}</div>
                <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}.png">
                <div>${Math.round(d.main.temp)}°</div>
            </div>`;
    }
}
