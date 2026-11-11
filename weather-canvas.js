let weatherCanvasId = null;

window.startWeatherAnimation = function(weatherId, sunrise, sunset) {
    const canvas = document.getElementById('weather-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement || document.body;
    
    canvas.width = container.clientWidth || window.innerWidth;
    canvas.height = container.clientHeight || window.innerHeight;

    if (weatherCanvasId) {
        cancelAnimationFrame(weatherCanvasId);
        weatherCanvasId = null;
    }

    // توليد نجوم الخلفية
    const bgStars = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005
    }));

    function drawWeatherBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // رسم النجوم المتلألئة
        bgStars.forEach(star => {
            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0.1) star.speed = -star.speed;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
            ctx.fill();
        });

        weatherCanvasId = requestAnimationFrame(drawWeatherBackground);
    }

    drawWeatherBackground();
};

// تشغيل خلفية النجوم افتراضياً عند الإقلاع
document.addEventListener("DOMContentLoaded", () => {
    if (typeof window.startWeatherAnimation === "function") {
        window.startWeatherAnimation(800, 0, Math.floor(Date.now() / 1000) + 3600);
    }
});