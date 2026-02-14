const API_KEY = "6b7edc82798b727dce5282c19e9298a6";
const btn = document.getElementById("btn");
const cityInput = document.getElementById("city");
const locBtn = document.getElementById("location-btn");

// قاموس التدرجات اللونية المتحركة حسب حالة الطقس
const bgGradients = {
    Clear: "linear-gradient(-45deg, #f7b733, #fc4a1a, #f7b733, #fc4a1a)", // مشمس
    Clouds: "linear-gradient(-45deg, #606c88, #3f4c6b, #606c88, #3f4c6b)", // غيوم
    Rain: "linear-gradient(-45deg, #203a43, #2c5364, #0f2027, #2c5364)", // مطر
    Thunderstorm: "linear-gradient(-45deg, #1f1c2c, #928dab, #1f1c2c, #4b0082)", // عواصف
    Snow: "linear-gradient(-45deg, #83a4d4, #b6fbff, #83a4d4, #ffffff)", // ثلج
    Mist: "linear-gradient(-45deg, #bdc3c7, #2c3e50, #bdc3c7, #2c3e50)", // ضباب
    Default: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)" // افتراضي ملوّن
};

// وظائف البحث
btn.addEventListener("click", () => getWeather(cityInput.value));
cityInput.addEventListener("keypress", (e) => { if (e.key === "Enter") getWeather(cityInput.value); });

// جلب الطقس حسب موقع المستخدم
locBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            getWeather(null, pos.coords.latitude, pos.coords.longitude);
        }, () => {
            document.getElementById("error").textContent = "يرجى تفعيل صلاحية الموقع";
        });
    }
});

async function getWeather(city, lat = null, lon = null) {
    const error = document.getElementById("error");
    const card = document.getElementById("card");
    
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=ar`;
    url += city ? `&q=${encodeURIComponent(city)}` : `&lat=${lat}&lon=${lon}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod !== 200) {
            error.textContent = "المدينة غير موجودة!";
            card.style.display = "none";
            return;
        }

        error.textContent = "";
        
        // تحديث البيانات
        document.getElementById("cityName").textContent = data.name;
        document.getElementById("temp").textContent = Math.round(data.main.temp) + "°";
        document.getElementById("desc").textContent = data.weather[0].description;
        document.getElementById("humidity").textContent = data.main.humidity + "%";
        document.getElementById("wind").textContent = data.wind.speed + " م/ث";
        document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        
        // عرض التاريخ الحالي
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        document.getElementById("date").textContent = new Date().toLocaleDateString('ar-EG', options);

        // تغيير التدرج اللوني المتحرك بناءً على الحالة
        const status = data.weather[0].main;
        document.body.style.background = bgGradients[status] || bgGradients.Default;

        card.style.display = "block";
    } catch {
        error.textContent = "خطأ في الاتصال بالشبكة!";
    }
}

