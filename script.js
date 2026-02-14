const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

// دالة التبديل بين التبويبات (Tabs)
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// ربط الأزرار عند تحميل الصفحة
window.onload = function() {
    const searchBtn = document.getElementById("search-btn");
    const geoBtn = document.getElementById("geo-btn");
    const cityInput = document.getElementById("city-input");

    // زر البحث
    searchBtn.onclick = function() {
        if(cityInput.value !== "") {
            getWeatherData(cityInput.value);
        }
    };

    // البحث عند ضغط Enter
    cityInput.onkeydown = function(e) {
        if(e.key === "Enter") {
            getWeatherData(cityInput.value);
        }
    };

    // زر الموقع الحالي
    geoBtn.onclick = function() {
        navigator.geolocation.getCurrentPosition(pos => {
            getWeatherData(null, pos.coords.latitude, pos.coords.longitude);
        });
    };
};

async function getWeatherData(city, lat = null, lon = null) {
    const msg = document.getElementById("msg-box");
    const weatherInfo = document.getElementById("weather-info");
    
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=ar`;
    if(city) url += `&q=${encodeURIComponent(city)}`;
    else url += `&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if(data.cod !== 200) {
            msg.innerText = "لم نجد المدينة، جرب مرة أخرى!";
            weatherInfo.style.display = "none";
            return;
        }

        // تحديث الواجهة بالبيانات
        msg.innerText = "";
        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp-display").innerText = Math.round(data.main.temp) + "°م";
        document.getElementById("weather-desc").innerText = data.weather[0].description;
        document.getElementById("main-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        
        // نصيحة الملابس
        const temp = data.main.temp;
        const outfit = document.getElementById("outfit-msg");
        if(temp < 15) outfit.innerText = "🧥 الجو بارد، يفضل ارتداء ملابس ثقيلة.";
        else if(temp < 25) outfit.innerText = "👕 الجو معتدل، ملابس خفيفة مناسبة.";
        else outfit.innerText = "☀️ الجو حار، ارتدِ ملابس صيفية مريحة.";

        // جلب التوقعات
        getForecast(data.coord.lat, data.coord.lon);
        weatherInfo.style.display = "block";

    } catch (error) {
        msg.innerText = "فشل الاتصال بالإنترنت!";
    }
}

async function getForecast(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ar`);
    const data = await res.json();
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";

    // عرض 4 أيام قادمة
    for(let i = 8; i < data.list.length; i += 8) {
        const item = data.list[i];
        const date = new Date(item.dt_txt).toLocaleDateString('ar-EG', {weekday: 'short'});
        container.innerHTML += `
            <div class="forecast-day">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                <p>${Math.round(item.main.temp)}°</p>
            </div>
        `;
    }
}
