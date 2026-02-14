const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

// دالة التبديل بين التبويبات
function openTab(evt, tabName) {
    const contents = document.querySelectorAll(".tab-content");
    contents.forEach(content => {
        content.classList.remove("active");
    });
    
    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach(btn => {
        btn.classList.remove("active");
    });
    
    const targetTab = document.getElementById(tabName);
    targetTab.classList.add("active");
    evt.currentTarget.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const cityInput = document.getElementById("city-input");
    const geoBtn = document.getElementById("geo-btn");

    // محاولة تفعيل صندوق الكتابة تلقائياً
    setTimeout(() => cityInput.focus(), 500);

    searchBtn.onclick = () => {
        if(cityInput.value) getWeatherData(cityInput.value);
    };

    cityInput.onkeydown = (e) => {
        if(e.key === "Enter") {
            getWeatherData(cityInput.value);
            cityInput.blur(); // إغلاق لوحة المفاتيح في الجوال بعد البحث
        }
    };

    geoBtn.onclick = () => {
        navigator.geolocation.getCurrentPosition(
            p => getWeatherData(null, p.coords.latitude, p.coords.longitude),
            () => alert("يرجى تفعيل الوصول للموقع")
        );
    };
});

async function getWeatherData(city, lat = null, lon = null) {
    const msg = document.getElementById("msg-box");
    const info = document.getElementById("weather-info");
    
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=ar`;
    if (city) url += `&q=${encodeURIComponent(city)}`;
    else url += `&lat=${lat}&lon=${lon}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if(data.cod !== 200) {
            msg.innerText = "المدينة غير موجودة!";
            info.style.display = "none";
            return;
        }

        msg.innerText = "";
        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp-display").innerText = Math.round(data.main.temp) + "°";
        document.getElementById("weather-desc").innerText = data.weather[0].description;
        document.getElementById("main-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        
        const temp = data.main.temp;
        const outfit = document.getElementById("outfit-msg");
        outfit.innerText = temp < 15 ? "🧥 الجو بارد، البس ثقيل" : temp < 25 ? "👕 الجو لطيف، ملابس خفيفة" : "☀️ الجو حار، ملابس صيفية";

        getForecast(data.coord.lat, data.coord.lon);
        info.style.display = "block";
    } catch (err) {
        msg.innerText = "خطأ في الاتصال بالإنترنت!";
    }
}

async function getForecast(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ar`);
    const data = await res.json();
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";

    const seenDays = new Set();
    data.list.forEach(item => {
        const d = new Date(item.dt_txt);
        const day = d.toLocaleDateString('ar-EG', {weekday: 'short'});
        // نختار قراءة واحدة لكل يوم وتكون في وقت النهار
        if (!seenDays.has(day) && d.getHours() >= 12 && seenDays.size < 4) {
            seenDays.add(day);
            container.innerHTML += `
                <div class="forecast-day">
                    <p style="font-weight:bold">${day}</p>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                    <p>${Math.round(item.main.temp)}°</p>
                </div>`;
        }
    });
}
