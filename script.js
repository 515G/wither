const API_KEY = "6b7edc82798b727dce5282c19e9298a6";
const btn = document.getElementById("btn");
const cityInput = document.getElementById("city");
const locBtn = document.getElementById("location-btn");

// قاموس لصور الخلفيات بناءً على حالة الطقس
const bgImages = {
    Clear: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1600&q=80",
    Clouds: "https://images.unsplash.com/photo-1534088568595-a066f7104218?auto=format&fit=crop&w=1600&q=80",
    Rain: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1600&q=80",
    Snow: "https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&w=1600&q=80",
    Default: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=1600&q=80"
};

btn.addEventListener("click", () => getWeather(cityInput.value));
cityInput.addEventListener("keypress", (e) => { if (e.key === "Enter") getWeather(cityInput.value); });

// جلب الطقس حسب الموقع الجغرافي
locBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        getWeather(null, latitude, longitude);
    });
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
            return;
        }

        error.textContent = "";
        
        // تحديث الواجهة
        document.getElementById("cityName").textContent = data.name;
        document.getElementById("temp").textContent = Math.round(data.main.temp) + "°";
        document.getElementById("desc").textContent = data.weather[0].description;
        document.getElementById("humidity").textContent = data.main.humidity + "%";
        document.getElementById("wind").textContent = data.wind.speed + " م/ث";
        document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        
        // تحديث التاريخ
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        document.getElementById("date").textContent = new Date().toLocaleDateString('ar-EG', options);

        // تغيير الخلفية ديناميكياً
        const status = data.weather[0].main;
        document.body.style.backgroundImage = `url('${bgImages[status] || bgImages.Default}')`;

        card.style.display = "block";
    } catch {
        error.textContent = "خطأ في الاتصال!";
    }
}
