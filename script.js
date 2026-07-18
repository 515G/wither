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
        { text: "أَصبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْد لِلَّهِ", count: 1 },
        { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَينَا وَبِكَ نَحْيَا وبِكَ نَمُوتُ وَإِلَيْكَ النشُورُ", count: 1 },
        { text: "سُبْحَانَ اللَّهِ وبِحَمْدِهِ", count: 100 },
        { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", count: 10 },
        { text: "اللَّهُمَّ صلِّ وَسَلِّمْ عَلَى نَبِيِّنَا محَمَّدٍ", count: 10 },
    ],
    masa: [
        { text: "أَمسَيْنَا وَأَمْسَى الْمُلْكُ للَّهِ وَالْحَمْدُ لِلَّهِ", count: 1 },
        { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ", count: 1 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
        { text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ ما خَلَقَ", count: 3 },
        { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ علَى نَبِيِّنَا مُحَمَّدٍ", count: 10 },
    ],
    nawm: [
        { text: "باسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", count: 1 },
        { text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", count: 3 },
        { text: "سُبْحَانَ اللَّهِ", count: 33 },
        { text: "الحَمْدُ لِلَّهِ", count: 33 },
        { text: "اللَّهُ أَكْبَرُ", count: 34 },
    ],
    istiqaz: [
        { text: "الحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", count: 1 },
        { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", count: 10 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 10 },
        { text: "أَسْتَغْفِرُ اللَّهَ الْعظِيمَ وَأَتُوبُ إِلَيْهِ", count: 3 },
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
    document.getElementById("progress-label").innerText = `${current}