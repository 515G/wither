const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

const bgGradients = {
    Clear: "linear-gradient(-45deg, #f7b733, #fc4a1a, #f7b733, #fc4a1a)",
    Clouds: "linear-gradient(-45deg, #606c88, #3f4c6b, #606c88, #3f4c6b)",
    Rain: "linear-gradient(-45deg, #203a43, #2c5364, #0f2027, #2c5364)",
    Snow: "linear-gradient(-45deg, #83a4d4, #b6fbff, #83a4d4, #ffffff)",
    Default: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
};

function showPage(pageId, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    btn.classList.add('active');
}

document.getElementById("search-btn").addEventListener("click", () => {
    const city = document.getElementById("city").value;
    if(city) getWeather(city);
});

document.getElementById("location-btn").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(p => {
        getWeather(null, p.coords.latitude, p.coords.longitude);
    });
});

async function getWeather(city, lat = null, lon = null) {
    const error = document.getElementById("error");
    const card = document.getElementById("card");
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=ar`;
    
    if(city) url += `&q=${encodeURIComponent(city)}`;
    else url += `&lat=${lat}&lon=${lon}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.cod !== 200) {
            error.textContent = "المدينة غير موجودة!";
            card.style.display = "none";
            return;
        }

        error.textContent = "";
        document.getElementById("cityName").textContent = data.name;
        const temp = Math.round(data.main.temp);
        document.getElementById("temp").textContent = temp + "°";
        document.getElementById("desc").textContent = data.weather[0].description;
        document.getElementById("humidity").textContent = data.main.humidity + "%";
        document.getElementById("wind").textContent = data.wind.speed + " م/ث";
        document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        
        // اقتراح الملابس
        const sug = document.getElementById("suggestion");
        if(temp < 15) sug.textContent = "🧥 الجو بارد، المعطف ضروري!";
        else if(temp < 25) sug.textContent = "👕 الجو لطيف، ملابس خفيفة تكفي.";
        else sug.textContent = "☀️ الجو حار، ارتدِ ملابس صيفية.";

        // الخلفية
        document.body.style.background = bgGradients[data.weather[0].main] || bgGradients.Default;
        
        getForecast(data.coord.lat, data.coord.lon);
        card.style.display = "block";
    } catch (e) {
        error.textContent = "حدث خطأ في الاتصال!";
    }
}

async function getForecast(lat, lon) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        const forecastDiv = document.getElementById("forecast");
        forecastDiv.innerHTML = "";

        for (let i = 0; i < data.list.length; i += 8) {
            const day = data.list[i];
            const date = new Date(day.dt_txt).toLocaleDateString('ar-EG', {weekday: 'short'});
            forecastDiv.innerHTML += `
                <div class="forecast-item">
                    <div>${date}</div>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                    <div>${Math.round(day.main.temp)}°</div>
                </div>`;
        }
    } catch (e) { console.error("Forecast error"); }
}
