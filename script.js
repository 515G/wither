// تكملة دالة جلب التوقعات وتحديث الواجهة
async function fetchForecast(lat, lon) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        
        const container = document.getElementById("forecast");
        container.innerHTML = ""; // مسح التوقعات القديمة

        // فلترة البيانات لعرض قراءة واحدة لكل يوم (كل 24 ساعة تقريباً)
        for(let i = 0; i < data.list.length; i += 8) {
            const dayData = data.list[i];
            const date = new Date(dayData.dt_txt);
            const dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' });
            const icon = dayData.weather[0].icon;
            const temp = Math.round(dayData.main.temp);

            container.innerHTML += `
                <div class="forecast-item">
                    <div style="font-weight: bold; margin-bottom: 5px;">${dayName}</div>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
                    <div style="font-size: 14px;">${temp}°</div>
                </div>
            `;
        }
    } catch (error) {
        console.error("خطأ في جلب التوقعات:", error);
    }
}

// دالة تغيير الأقسام (Tabs) لضمان عمل الصفحات الداخلية
function changeTab(tabId, btn) {
    // إخفاء جميع الأقسام
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    // إلغاء تفعيل جميع الأزرار
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.remove('active');
    });
    // إظهار القسم المطلوب وتفعيل زره
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

// دالة لتحميل آخر بحث تلقائياً عند فتح الصفحة (اختياري)
window.onload = () => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
        fetchWeather(savedCity);
    }
};
