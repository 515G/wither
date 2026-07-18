const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

function showPage(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    element.classList.add('active');
    if (pageId === 'sky') startSkyCanvas();
}

function formatTime12(time) {
    if (!time) return "--:--";
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    const ampm = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

async function getWeather() {
    const city = document.getElementById("city-input").value.trim();
    if (!city) return;
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        if (data.cod !== 200) { alert("المدينة غير موجودة!"); return; }
        document.getElementById("out-city").innerText = "📍 " + data.name;
        document.getElementById("out-temp").innerText = Math.round(data.main.temp) + "°";
        document.getElementById("out-desc").innerText = data.weather[0].description;
        document.getElementById("out-humidity").innerText = data.main.humidity + "%";
        document.getElementById("out-wind").innerText = Math.round(data.wind.speed * 3.6) + " كم/س";
        document.getElementById("out-feels").innerText = Math.round(data.main.feels_like) + "°";
        document.getElementById("out-details").style.display = "flex";
        localStorage.setItem('lastCity', city);
        startWeatherAnimation(data.weather[0].id, data.sys.sunrise, data.sys.sunset);
        getFiveDayForecast(city);
        getPrayers(city);
        showSuhailCard();
    } catch (e) {
        alert("حدث خطأ، تحقق من اتصالك بالإنترنت!");
        console.error(e);
    }
}

async function getFiveDayForecast(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        const data = await res.json();
        const forecastDiv = document.getElementById("out-forecast");
        forecastDiv.innerHTML = "";
        for (let i = 0; i < data.list.length; i += 8) {
            const day = data.list[i];
            const dayName = new Date(day.dt * 1000).toLocaleDateString('ar-JO', { weekday: 'short' });
            forecastDiv.innerHTML += `
                <div class="forecast-item">
                    <div>${dayName}</div>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                    <b>${Math.round(day.main.temp)}°</b>
                </div>`;
        }
        document.getElementById("forecast-section").style.display = "block";
    } catch (e) { console.error(e); }
}

let countdownInterval = null;

async function getPrayers(city) {
    try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=4`);
        const d = await res.json();
        const t = d.data.timings;
        const times = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const names = ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
        const now = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes();
        const prayerMins = times.map(p => {
            const [h, m] = t[p].split(':').map(Number);
            return h * 60 + m;
        });
        let nextIndex = prayerMins.findIndex(m => m > currentMins);
        if (nextIndex === -1) nextIndex = 0;
        let html = '';
        times.forEach((time, i) => {
            const isNext = i === nextIndex;
            html += `<div class="prayer-row${isNext ? ' next-prayer' : ''}">
                <span>${names[i]}${isNext ? ' 🔔' : ''}</span>
                <b>${formatTime12(t[time])}</b>
            </div>`;
        });
        document.getElementById("prayer-output").innerHTML = html;
        startCountdown(names, prayerMins);
    } catch (e) { console.error(e); }
}

function startCountdown(names, prayerMins) {
    if (countdownInterval) clearInterval(countdownInterval);
    document.getElementById("prayer-countdown").style.display = "block";
    function update() {
        const now = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes();
        const currentSecs = now.getSeconds();
        let idx = prayerMins.findIndex(m => m > currentMins);
        let diffSecs;
        if (idx === -1) {
            idx = 0;
            diffSecs = (1440 - currentMins + prayerMins[0]) * 60 - currentSecs;
        } else {
            diffSecs = (prayerMins[idx] - currentMins) * 60 - currentSecs;
        }
        const h = Math.floor(diffSecs / 3600);
        const m = Math.floor((diffSecs % 3600) / 60);
        const s = diffSecs % 60;
        const pad = n => String(Math.abs(n)).padStart(2, '0');
        document.getElementById("countdown-timer").innerText = `${pad(h)}:${pad(m)}:${pad(s)}`;
        document.getElementById("countdown-next").innerText = `الصلاة القادمة: ${names[idx]}`;
    }
    update();
    countdownInterval = setInterval(update, 1000);
}

const azkarData = {
    sabah: [
        { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ", count: 1 },
        { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", count: 1 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
        { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", count: 10 },
        { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", count: 10 },
    ],
    masa: [
        { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ", count: 1 },
        { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ", count: 1 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
        { text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3 },
        { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", count: 10 },
    ],
    nawm: [
        { text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", count: 1 },
        { text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", count: 3 },
        { text: "سُبْحَانَ اللَّهِ", count: 33 },
        { text: "الْحَمْدُ لِلَّهِ", count: 33 },
        { text: "اللَّهُ أَكْبَرُ", count: 34 },
    ],
    istiqaz: [
        { text: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", count: 1 },
        { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", count: 10 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 10 },
        { text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ", count: 3 },
    ],
};

let currentCategory = 'sabah';
let currentZekrIndex = 0;
let count = 0;

function switchCategory(cat, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = cat;
    currentZekrIndex = 0;
    count = 0;
    loadZekr();
}

function loadZekr() {
    const zekr = azkarData[currentCategory][currentZekrIndex];
    document.getElementById("zekr-text").innerText = zekr.text;
    document.getElementById("zekr-count").innerText = 0;
    count = 0;
    updateProgress(0, zekr.count);
}

function updateProgress(current, target) {
    const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    document.getElementById("progress-fill").style.width = pct + "%";
    document.getElementById("progress-label").innerText = `${current} / ${target}`;
}

function incrementCount() {
    const zekr = azkarData[currentCategory][currentZekrIndex];
    if (count >= zekr.count) return;
    count++;
    document.getElementById("zekr-count").innerText = count;
    updateProgress(count, zekr.count);
    if (navigator.vibrate) navigator.vibrate(40);
    if (count >= zekr.count) {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        setTimeout(() => {
            const list = azkarData[currentCategory];
            if (currentZekrIndex < list.length - 1) {
                currentZekrIndex++;
                loadZekr();
            } else {
                document.getElementById("zekr-text").innerText = "✅ أتممت أذكار هذا القسم";
            }
        }, 600);
    }
}

function nextZekr() {
    const list = azkarData[currentCategory];
    currentZekrIndex = (currentZekrIndex + 1) % list.length;
    loadZekr();
}

function resetZekr() {
    count = 0;
    const zekr = azkarData[currentCategory][currentZekrIndex];
    document.getElementById("zekr-count").innerText = 0;
    updateProgress(0, zekr.count);
}

const ayahHadithList = [
    { type: "آية كريمة", text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ" },
    { type: "آية كريمة", text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ" },
    { type: "آية كريمة", text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا" },
    { type: "آية كريمة", text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا" },
    { type: "آية كريمة", text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ" },
    { type: "آية كريمة", text: "وَاللَّهُ مَعَ الصَّابِرِينَ" },
    { type: "حديث شريف", text: "الدُّعَاءُ هُوَ الْعِبَادَةُ" },
    { type: "حديث شريف", text: "الكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ" },
    { type: "حديث شريف", text: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ" },
    { type: "حديث شريف", text: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ" },
    { type: "حديث شريف", text: "مَنْ لَمْ يَرْحَمْ لَا يُرْحَمْ" },
    { type: "حديث شريف", text: "إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلاً أَنْ يُتْقِنَهُ" },
];

function loadDailyAyah() {
    const item = ayahHadithList[Math.floor(Math.random() * ayahHadithList.length)];
    document.getElementById('daily-ayah-label').innerText = item.type;
    document.getElementById('daily-ayah-text').innerText = item.text;
}

function getSuhailDate(lat) {
    const year = new Date().getFullYear();
    let dayOfYear;
    if (lat >= 30)      dayOfYear = 236;
    else if (lat >= 24) dayOfYear = 231;
    else if (lat >= 20) dayOfYear = 228;
    else                dayOfYear = 225;
    const date = new Date(year, 0);
    date.setDate(dayOfYear);
    date.setHours(3, 0, 0, 0);
    if (date < new Date()) date.setFullYear(year + 1);
    return date;
}

function showSuhailCard() {
    navigator.geolocation.getCurrentPosition(pos => {
        updateSuhail(pos.coords.latitude);
    }, () => {
        updateSuhail(31);
    });
}

function updateSuhail(lat) {
    const suhailDate = getSuhailDate(lat);
    const now = new Date();
    const diff = suhailDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const dateStr = suhailDate.toLocaleDateString('ar-JO', { day: 'numeric', month: 'long' });
    let countdownText = days > 0 ? `باقي ${days} يوم و ${hours} ساعة` :
                        hours > 0 ? `باقي ${hours} ساعة فقط!` : '🌟 سهيل يطلع الليلة!';
    document.getElementById('suhail-countdown-text').innerText = countdownText;
    document.getElementById('suhail-info').innerText =
        `ثاني أضيأ نجم • يظهر ${dateStr} • عند ظهوره ينكسر الصيف 🍂`;
    document.getElementById('suhail-card').style.display = 'flex';
    document.getElementById('suhail-big-countdown').innerText =
        days > 0 ? `${days} يوم و ${hours} ساعة` :
        hours > 0 ? `${hours} ساعة فقط!` : '🌟 الليلة!';
    document.getElementById('suhail-big-date').innerText = `موعد الظهور: ${dateStr}`;
}

let skyAnimId = null;

function startSkyCanvas() {
    const canvas = document.getElementById('sky-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    if (skyAnimId) cancelAnimationFrame(skyAnimId);

    const stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
        speed: 0.01 + Math.random() * 0.02,
        dir: Math.random() > 0.5 ? 1 : -1,
    }));

    const suhail = { x: canvas.width * 0.3, y: canvas.height * 0.65, size: 4, pulse: 0 };

    function drawSky() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.opacity += s.speed * s.dir;
            if (s.opacity > 1 || s.opacity < 0.1) s.dir *= -1;
            ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        });
        suhail.pulse += 0.05;
        const glow = Math.sin(suhail.pulse) * 0.3 + 0.7;
        const grad = ctx.createRadialGradient(suhail.x, suhail.y, 0, suhail.x, suhail.y, 20);
        grad.addColorStop(0, `rgba(255,220,80,${glow})`);
        grad.addColorStop(0.4, `rgba(255,180,40,${glow * 0.5})`);
        grad.addColorStop(1, 'rgba(255,150,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(suhail.x, suhail.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,240,150,${glow})`;
        ctx.beginPath();
        ctx.arc(suhail.x, suhail.y, suhail.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,220,80,${glow * 0.8})`;
        ctx.font = '11px serif';
        ctx.textAlign = 'center';
        ctx.fillText('سهيل', suhail.x, suhail.y + 28);
        skyAnimId = requestAnimationFrame(drawSky);
    }

    drawSky();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('city-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') getWeather();
    });
    const saved = localStorage.getItem('lastCity');
    if (saved) {
        document.getElementById('city-input').value = saved;
        getWeather();
    }
    loadZekr();
    loadDailyAyah();
    showSuhailCard();
    startDefaultAnimation();
});