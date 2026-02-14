const API_KEY = "6b7edc82798b727dce5282c19e9298a6";
const bgGradients = {
    Clear: "linear-gradient(-45deg, #f7b733, #fc4a1a, #f7b733, #fc4a1a)",
    Clouds: "linear-gradient(-45deg, #606c88, #3f4c6b, #606c88, #3f4c6b)",
    Rain: "linear-gradient(-45deg, #203a43, #2c5364, #0f2027, #2c5364)",
    Snow: "linear-gradient(-45deg, #83a4d4, #b6fbff, #83a4d4, #ffffff)",
    Default: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
};

// التنقل بين الصفحات
function showPage(pageId, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    btn.classList.add('active');
}

// عند التحميل: استرجاع آخر مدينة
window.onload = () => {
    const last = localStorage.getItem("lastCity");
    if (last) getWeather(last);
};

document.getElementById("btn").addEventListener("click", () => getWeather(document.getElementById("city").value));
document.getElementById("location-btn").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(p => getWeather(null, p.coords.latitude, p.coords.longitude));
});

async function getWeather(city, lat = null, lon = null) {
    const error = document.getElementById("error");
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=ar`;
    url += city ? `&q=${encodeURIComponent(city)}` : `&lat=${lat}&lon=${lon}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.cod !== 200) throw new Error();

        updateMainUI(data);
        getForecast(data.coord.lat, data.coord.lon);
        localStorage.setItem("lastCity", data.name);
        error.textContent = "";
    } catch {
        error.textContent = "المدينة غير موجودة!";
    }
}

function updateMainUI(data) {
    document.getElementById("cityName").textContent = data.name;
    const temp = Math.round(data.main.temp);
    document.getElementById("temp").textContent = temp + "°";
    document.getElementById("desc").textContent = data.weather[0].description;
    document.getElementById("humidity").textContent = data.main.humidity + "%";
    document.getElementById("wind").textContent = data.wind.speed + " م/ث";
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    // اقتراح الملابس
    const suggestion = document.getElementById("outfit-suggestion");
    if (temp < 15) suggestion.textContent = "🧥 الجو بارد، ارتدِ ملابس ثقيلة!";
    else if (temp < 25) suggestion.textContent = "👕 الجو معتدل، ملابس ربيعية مناسبة.";
    else suggestion.textContent = "☀️ الجو حار، ارتدِ ملابس خفيفة واشرب الماء.";

    // تغيير الخلفية
    document.body.style.background = bgGradients[data.weather[0].main] || bgGradients.Default;
    document.getElementById("card").style.display = "block";
}

async function getForecast(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ar`);
    const data = await res.json();
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";

    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        forecastDiv.innerHTML += `
            <div class="forecast-item">
                <div>${new Date(day.dt_txt).toLocaleDateString('ar-EG', {weekday:'short'})}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <div>${Math.round(day.main.temp)}°</div>
            </div>`;
    }
}
