const canvas = document.getElementById('weather-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId = null;
let currentWeather = 'default';

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

class Particle {
    constructor(type) {
        this.type = type;
        this.reset();
    }

    reset() {
        const w = canvas.width;
        const h = canvas.height;
        switch(this.type) {
            case 'rain':
                this.x = Math.random() * w;
                this.y = Math.random() * -h;
                this.speed = 8 + Math.random() * 8;
                this.length = 15 + Math.random() * 20;
                this.opacity = 0.4 + Math.random() * 0.4;
                this.width = 1 + Math.random();
                break;
            case 'snow':
                this.x = Math.random() * w;
                this.y = Math.random() * -h;
                this.speed = 1 + Math.random() * 2;
                this.size = 3 + Math.random() * 5;
                this.opacity = 0.6 + Math.random() * 0.4;
                this.drift = (Math.random() - 0.5) * 0.5;
                break;
            case 'star':
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = 0.5 + Math.random() * 2.5;
                this.opacity = 0.3 + Math.random() * 0.7;
                this.twinkleSpeed = 0.02 + Math.random() * 0.03;
                this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
                break;
            case 'cloud':
                this.x = Math.random() * w + w;
                this.y = 30 + Math.random() * 120;
                this.speed = 0.3 + Math.random() * 0.4;
                this.size = 60 + Math.random() * 80;
                this.opacity = 0.08 + Math.random() * 0.1;
                break;
            case 'sun-ray':
                this.angle = Math.random() * Math.PI * 2;
                this.speed = 0.002 + Math.random() * 0.002;
                this.length = 80 + Math.random() * 60;
                this.opacity = 0.04 + Math.random() * 0.06;
                this.width = 8 + Math.random() * 12;
                break;
            case 'lightning':
                this.active = false;
                this.timer = Math.random() * 200;
                this.x = Math.random() * canvas.width;
                break;
            case 'dust':
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = 1 + Math.random() * 3;
                this.opacity = 0.1 + Math.random() * 0.2;
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = (Math.random() - 0.5) * 0.5;
                break;
        }
    }

    update() {
        const w = canvas.width;
        const h = canvas.height;
        switch(this.type) {
            case 'rain':
                this.y += this.speed;
                this.x -= 2;
                if (this.y > h) this.reset();
                break;
            case 'snow':
                this.y += this.speed;
                this.x += this.drift;
                if (this.y > h) this.reset();
                break;
            case 'star':
                this.opacity += this.twinkleSpeed * this.twinkleDir;
                if (this.opacity > 1 || this.opacity < 0.1) this.twinkleDir *= -1;
                break;
            case 'cloud':
                this.x -= this.speed;
                if (this.x < -this.size * 2) this.reset();
                break;
            case 'sun-ray':
                this.angle += this.speed;
                break;
            case 'lightning':
                this.timer--;
                if (this.timer <= 0) {
                    this.active = true;
                    this.timer = 150 + Math.random() * 200;
                    this.x = Math.random() * canvas.width;
                    setTimeout(() => { this.active = false; }, 150);
                }
                break;
            case 'dust':
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
                break;
        }
    }

    draw() {
        ctx.save();
        switch(this.type) {
            case 'rain':
                ctx.strokeStyle = `rgba(180, 220, 255, ${this.opacity})`;
                ctx.lineWidth = this.width;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + 4, this.y + this.length);
                ctx.stroke();
                break;
            case 'snow':
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.4})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'star':
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                if (this.size > 1.5) {
                    ctx.fillStyle = `rgba(180, 220, 255, ${this.opacity * 0.3})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            case 'cloud':
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
                ctx.arc(this.x + this.size * 0.4, this.y - this.size * 0.2, this.size * 0.4, 0, Math.PI * 2);
                ctx.arc(this.x + this.size * 0.8, this.y, this.size * 0.45, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'sun-ray':
                const cx = canvas.width * 0.75;
                const cy = 80;
                ctx.strokeStyle = `rgba(255, 220, 80, ${this.opacity})`;
                ctx.lineWidth = this.width;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(this.angle) * 40, cy + Math.sin(this.angle) * 40);
                ctx.lineTo(cx + Math.cos(this.angle) * (40 + this.length), cy + Math.sin(this.angle) * (40 + this.length));
                ctx.stroke();
                break;
            case 'lightning':
                if (this.active) {
                    ctx.strokeStyle = `rgba(255, 255, 150, 0.9)`;
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = 'rgba(255, 255, 100, 0.8)';
                    ctx.beginPath();
                    let lx = this.x, ly = 0;
                    ctx.moveTo(lx, ly);
                    while (ly < canvas.height * 0.6) {
                        lx += (Math.random() - 0.5) * 40;
                        ly += 30 + Math.random() * 30;
                        ctx.lineTo(lx, ly);
                    }
                    ctx.stroke();
                }
                break;
            case 'dust':
                ctx.fillStyle = `rgba(210, 180, 120, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        ctx.restore();
    }
}

function setupParticles(weatherType) {
    particles = [];
    currentWeather = weatherType;
    const configs = {
        'clear-day':    [{ type: 'sun-ray', count: 12 }, { type: 'dust', count: 8 }],
        'clear-night':  [{ type: 'star', count: 80 }],
        'clouds':       [{ type: 'cloud', count: 6 }, { type: 'star', count: 20 }],
        'rain':         [{ type: 'rain', count: 80 }, { type: 'cloud', count: 4 }],
        'snow':         [{ type: 'snow', count: 60 }, { type: 'star', count: 15 }],
        'thunderstorm': [{ type: 'rain', count: 100 }, { type: 'lightning', count: 3 }, { type: 'cloud', count: 5 }],
        'mist':         [{ type: 'cloud', count: 12 }, { type: 'dust', count: 15 }],
        'default':      [{ type: 'star', count: 40 }],
    };
    const config = configs[weatherType] || configs['default'];
    config.forEach(({ type, count }) => {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(type));
        }
    });
}

function drawSun() {
    const cx = canvas.width * 0.78;
    const cy = 75;
    const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, 55);
    gradient.addColorStop(0, 'rgba(255, 230, 80, 0.9)');
    gradient.addColorStop(0.4, 'rgba(255, 180, 40, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 150, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 240, 120, 0.95)';
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentWeather === 'clear-day') drawSun();
    particles.forEach(p => { p.update(); p.draw(); });
    animationId = requestAnimationFrame(animate);
}

function getWeatherType(weatherId, isNight) {
    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId >= 700 && weatherId < 800) return 'mist';
    if (weatherId === 800) return isNight ? 'clear-night' : 'clear-day';
    if (weatherId > 800) return 'clouds';
    return 'default';
}

function startWeatherAnimation(weatherId, sunrise, sunset) {
    if (animationId) cancelAnimationFrame(animationId);
    resizeCanvas();
    const now = Date.now() / 1000;
    const isNight = now < sunrise || now > sunset;
    const type = getWeatherType(weatherId, isNight);
    setupParticles(type);
    animate();
}

function startDefaultAnimation() {
    if (animationId) cancelAnimationFrame(animationId);
    resizeCanvas();
    setupParticles('default');
    animate();
}

window.addEventListener('resize', resizeCanvas);
