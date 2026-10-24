/* ===== أدوات ===== */
const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
const pad = n => String(n).padStart(2, '0'), R = Math.round;
const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
addEventListener('error', e => { const c = document.getElementById('cond'); if (c) c.textContent = 'خطأ: ' + e.message; });
const getJSON = async u => { const c = new AbortController(), t = setTimeout(() => c.abort(), 12000); try { return await (await fetch(u, { signal: c.signal })).json(); } finally { clearTimeout(t); } };
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ===== البيانات ===== */
const CITIES = {
  amman: { n: 'عمّان', lat: 31.9539, lon: 35.9106 }, irbid: { n: 'إربد', lat: 32.5556, lon: 35.85 },
  zarqa: { n: 'الزرقاء', lat: 32.0728, lon: 36.0876 }, salt: { n: 'السلط', lat: 32.0392, lon: 35.7272 },
  madaba: { n: 'مأدبا', lat: 31.7197, lon: 35.7936 }, jerash: { n: 'جرش', lat: 32.2747, lon: 35.8961 },
  karak: { n: 'الكرك', lat: 31.1853, lon: 35.7048 }, aqaba: { n: 'العقبة', lat: 29.532, lon: 35.0063 }
};
const BANNER = [
  ['﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾', 'سورة الرعد · ٢٨'],
  ['﴿ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾', 'سورة الشرح · ٥'],
  ['﴿ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ﴾', 'سورة الطلاق · ٣'],
  ['﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾', 'سورة طه · ١١٤'],
  ['إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ', 'حديث شريف · متفق عليه'],
  ['الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ', 'حديث شريف · متفق عليه'],
  ['الدِّينُ النَّصِيحَةُ', 'حديث شريف · رواه مسلم']
];
const COMMON = [
  ['قُلْ هُوَ اللَّهُ أَحَدٌ', 3], ['قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', 3], ['قُلْ أَعُوذُ بِرَبِّ النَّاسِ', 3],
  ['سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', 100], ['أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', 100],
  ['اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', 10]
];
const AZKAR = {
  morning: [['أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ', 1], ['حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', 7], ...COMMON],
  evening: [['أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ', 1], ['أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', 3], ...COMMON]
};

/* ===== الأيقونات ===== */
const CL = '<path d="M7 18h10.5a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 7.3 8.6 4.7 4.7 0 0 0 7 18z"/>';
const IC = {
  clear: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
  night: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  partly: '<circle cx="8" cy="8" r="3"/><path d="M8 2v1.3M2 8h1.3M3.8 3.8l.9.9M12.2 3.8l-.9.9"/><path transform="translate(2 2)" d="M7 18h10.5a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 7.3 8.6 4.7 4.7 0 0 0 7 18z"/>',
  cloud: CL, fog: '<path d="M4 9h16M3 13h18M6 17h12"/>',
  rain: CL + '<path d="M8 20l1-2M12 20l1-2M16 20l1-2"/>', snow: CL + '<path d="M8 19.5h.01M12 20.5h.01M16 19.5h.01"/>',
  storm: CL + '<path d="M12.5 15l-2 3h3l-2 3"/>'
};
const icon = k => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;
const ring = (f, s = 46, w = 3) => {
  const r = (s - w) / 2, c = 2 * Math.PI * r, m = s / 2;
  return `<svg class="rg" viewBox="0 0 ${s} ${s}"><circle cx="${m}" cy="${m}" r="${r}" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="${w}"/><circle cx="${m}" cy="${m}" r="${r}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(0, Math.min(1, f)))}" transform="rotate(-90 ${m} ${m})"/></svg>`;
};

/* ===== رموز الطقس ===== */
const kind = c => c === 0 ? 'clear' : c <= 2 ? 'partly' : c === 3 ? 'cloud' : c <= 48 ? 'fog' : (c <= 67 || (c >= 80 && c <= 82)) ? 'rain' : (c <= 77 || c === 85 || c === 86) ? 'snow' : 'storm';
const LABEL = { clear: 'سماء صافية', partly: 'غائم جزئياً', cloud: 'غائم', fog: 'ضباب', rain: 'أمطار', snow: 'ثلوج', storm: 'عاصفة رعدية' };
const icoKind = (c, d) => (!d && (kind(c) === 'clear' || kind(c) === 'partly')) ? 'night' : kind(c);
const skyOf = (c, d) => { const k = kind(c); if (['rain', 'snow', 'storm'].includes(k)) return k; if (!d) return 'night'; return (k === 'clear' || k === 'partly') ? 'clear' : 'cloud'; };

/* ===== خلفية متحركة ===== */
const cv = $('#fx'), cx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
let W, H, P = [], mode = 'clear', flash = 0;
function seed() {
  const n = { rain: 140, storm: 190, snow: 90, night: 90 }[mode] || 0;
  P = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, v: Math.random(), r: Math.random() }));
  if (mode === 'clear' || mode === 'cloud') P = Array.from({ length: 6 }, (_, i) => ({ x: Math.random() * W, y: H * (.08 + .15 * i), v: .15 + Math.random() * .35, r: 130 + Math.random() * 120 }));
}
function size() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); seed(); }
function draw(t) {
  cx.clearRect(0, 0, W, H);
  if (mode === 'rain' || mode === 'storm') {
    cx.strokeStyle = 'rgba(255,255,255,.35)'; cx.lineWidth = 1.2; cx.beginPath();
    for (const p of P) { cx.moveTo(p.x, p.y); cx.lineTo(p.x - 2, p.y + 12 + p.v * 10); p.y += 9 + p.v * 9; p.x -= 1; if (p.y > H) { p.y = -20; p.x = Math.random() * W; } }
    cx.stroke();
    if (mode === 'storm' && Math.random() < .006) flash = 1;
    if (flash > 0) { cx.fillStyle = `rgba(255,255,255,${flash * .5})`; cx.fillRect(0, 0, W, H); flash -= .06; }
  } else if (mode === 'snow') {
    cx.fillStyle = 'rgba(255,255,255,.85)';
    for (const p of P) { cx.beginPath(); cx.arc(p.x, p.y, 1.5 + p.r * 2.5, 0, 7); cx.fill(); p.y += .6 + p.v * 1.2; p.x += Math.sin(p.y / 40 + p.r * 6) * .4; if (p.y > H) { p.y = -5; p.x = Math.random() * W; } }
  } else if (mode === 'night') {
    for (const p of P) { cx.fillStyle = `rgba(255,255,255,${.3 + .7 * Math.abs(Math.sin(t / 900 + p.r * 9))})`; cx.beginPath(); cx.arc(p.x, p.y * .8, .6 + p.r * 1.3, 0, 7); cx.fill(); }
  } else {
    if (mode === 'clear') { const g = cx.createRadialGradient(W * .8, H * .1, 0, W * .8, H * .1, 300); g.addColorStop(0, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); cx.fillStyle = g; cx.fillRect(0, 0, W, H); }
    for (const p of P) { const g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r); g.addColorStop(0, `rgba(255,255,255,${mode === 'cloud' ? .2 : .11})`); g.addColorStop(1, 'rgba(255,255,255,0)'); cx.fillStyle = g; cx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2); p.x += p.v; if (p.x - p.r > W) p.x = -p.r; }
  }
}
function loop(t) { draw(t); requestAnimationFrame(loop); }
function setFx(m) { mode = m; seed(); if (reduce) draw(0); }
addEventListener('resize', size); size();
reduce ? draw(0) : requestAnimationFrame(loop);

/* ===== الحالة ===== */
const state = { city: store.get('naseem-city') || 'amman', set: new Date().getHours() >= 15 ? 'evening' : 'morning' };

/* ===== الطقس ===== */
function countTo(el, v) {
  if (reduce) { el.textContent = v; return; }
  const t0 = performance.now();
  (function s(t) { const k = Math.min(1, (t - t0) / 900); el.textContent = R(v * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(s); })(t0);
}
async function loadWeather() {
  const c = CITIES[state.city];
  $('#miniCity').textContent = c.n;
  const u = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day&hourly=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=7`;
  try { renderWeather(await getJSON(u)); }
  catch (e) { $('#cond').textContent = 'تعذّر تحميل الطقس، تحقق من الاتصال'; }
}
function renderWeather(w) {
  const c = w.current, d = w.daily, day = !!c.is_day, sky = skyOf(c.weather_code, day);
  document.body.dataset.sky = sky; setFx(sky);
  countTo($('#temp'), R(c.temperature_2m));
  $('#cond').textContent = $('#miniCond').textContent = LABEL[kind(c.weather_code)];
  $('#miniTemp').textContent = R(c.temperature_2m) + '°';
  $('#hl').textContent = `الكبرى ${R(d.temperature_2m_max[0])}°   الصغرى ${R(d.temperature_2m_min[0])}°`;

  const f = Math.max(0, w.hourly.time.findIndex(t => t.slice(0, 13) >= c.time.slice(0, 13))), hs = [];
  for (let i = f; i < f + 24 && i < w.hourly.time.length; i++)
    hs.push({ h: +w.hourly.time[i].slice(11, 13), k: icoKind(w.hourly.weather_code[i], w.hourly.is_day[i]), t: w.hourly.temperature_2m[i] });
  const ts = hs.map(x => x.t), mn = Math.min(...ts), sp = (Math.max(...ts) - mn) || 1, Wd = hs.length * 62;
  const pts = hs.map((x, i) => [i * 62 + 31, 8 + (1 - (x.t - mn) / sp) * 28]);
  $('#hours').innerHTML = `<div style="width:${Wd}px"><div class="row">${hs.map((x, i) => `<div><span>${i ? `${x.h % 12 || 12} ${x.h < 12 ? 'ص' : 'م'}` : 'الآن'}</span>${icon(x.k)}</div>`).join('')}</div>
    <svg class="spark" width="${Wd}" height="44"><path d="M${pts.map(p => p.join(',')).join('L')}"/>${pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3"/>`).join('')}</svg>
    <div class="row">${hs.map(x => `<div><b>${R(x.t)}°</b></div>`).join('')}</div></div>`;

  const lo = Math.min(...d.temperature_2m_min), hi = Math.max(...d.temperature_2m_max), s = hi - lo || 1;
  $('#days').innerHTML = d.time.map((t, i) => {
    const a = d.temperature_2m_min[i], b = d.temperature_2m_max[i];
    return `<li><span class="nm">${i ? new Date(t + 'T12:00').toLocaleDateString('ar-JO', { weekday: 'long' }) : 'اليوم'}</span>${icon(icoKind(d.weather_code[i], true))}
      <div class="rg2"><span class="lo">${R(a)}°</span><div class="trk"><i style="left:${(a - lo) / s * 100}%;width:${Math.max((b - a) / s * 100, 6)}%"></i></div><span>${R(b)}°</span></div></li>`;
  }).join('');

  const sr = new Date(d.sunrise[0]), ss = new Date(d.sunset[0]), fr = (new Date(c.time) - sr) / (ss - sr), k = Math.max(0, Math.min(1, fr)), an = Math.PI * (1 - k);
  $('#sun').innerHTML = `<svg class="arc" viewBox="0 0 300 112"><path class="a0" d="M20 100A130 130 0 0 1 280 100"/><path class="a1" pathLength="1" stroke-dasharray="${k} 1" d="M20 100A130 130 0 0 1 280 100"/>${fr >= 0 && fr <= 1 ? `<circle class="dot" cx="${150 + 130 * Math.cos(an)}" cy="${100 - 130 * Math.sin(an)}" r="9"/>` : ''}</svg>
    <div class="sunt"><span>الشروق ${d.sunrise[0].slice(11, 16)}</span><span>الغروب ${d.sunset[0].slice(11, 16)}</span></div>`;

  $('#tiles').innerHTML = [['تبدو كأنها', R(c.apparent_temperature) + '°'], ['الرطوبة', R(c.relative_humidity_2m) + '%'], ['الرياح', R(c.wind_speed_10m) + ' كم/س'], ['الأشعة فوق البنفسجية', R(d.uv_index_max[0])]]
    .map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('');
}

/* ===== مواقيت الصلاة ===== */
const PR = [['Fajr', 'الفجر'], ['Sunrise', 'الشروق'], ['Dhuhr', 'الظهر'], ['Asr', 'العصر'], ['Maghrib', 'المغرب'], ['Isha', 'العشاء']];
let pr = { t: null, m: null, nx: null, pv: null }, tm;
const toDate = (b, s) => { const [h, m] = s.slice(0, 5).split(':').map(Number), d = new Date(b); d.setHours(h, m, 0, 0); return d; };
async function timings(date, c) {
  return (await getJSON(`https://api.aladhan.com/v1/timings/${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}?latitude=${c.lat}&longitude=${c.lon}&method=23`)).data.timings;
}
async function loadPrayer() {
  const c = CITIES[state.city], n = new Date();
  try { [pr.t, pr.m] = await Promise.all([timings(n, c), timings(new Date(n.getTime() + 864e5), c)]); renderPrayer(); }
  catch (e) { $('#nextName').textContent = 'تعذّر تحميل المواقيت'; }
}
function renderPrayer() {
  if (!pr.t) return;
  const now = new Date(), ev = PR.filter(p => p[0] !== 'Sunrise').map(([k, n]) => ({ k, n, t: toDate(now, pr.t[k]) }));
  ev.push({ k: 'Fajr', n: 'الفجر', t: toDate(new Date(now.getTime() + 864e5), pr.m.Fajr) });
  const i = ev.findIndex(e => e.t > now), nx = ev[i];
  pr.nx = nx; pr.pv = i > 0 ? ev[i - 1].t : new Date(ev[4].t.getTime() - 864e5);
  $('#nextName').textContent = `${nx.n} بعد`;
  $('#times').innerHTML = PR.map(([k, n]) => `<li class="${k === 'Sunrise' ? 's' : ''} ${k === nx.k ? 'n' : ''}"><span>${n}</span><b>${pr.t[k].slice(0, 5)}</b></li>`).join('');
  tick(); clearInterval(tm); tm = setInterval(tick, 1000);
}
function tick() {
  if (!pr.nx) return;
  const diff = pr.nx.t - new Date();
  if (diff <= 0) return renderPrayer();
  const s = Math.floor(diff / 1000);
  $('#countdown').textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`;
  $('#prRing').innerHTML = ring((new Date() - pr.pv) / (pr.nx.t - pr.pv), 190, 5);
}

/* ===== الأذكار ===== */
const azKey = () => { const d = new Date(); return `naseem-azkar-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const azLoad = () => { try { return JSON.parse(store.get(azKey())) || {}; } catch (e) { return {}; } };
function renderAzkar() {
  const L = AZKAR[state.set], sv = azLoad()[state.set] || [];
  $('#zikr').innerHTML = L.map(([t, c], i) => {
    const dn = Math.min(c, sv[i] || 0), left = c - dn;
    return `<li class="${left ? '' : 'd'}"><button data-i="${i}"><span class="t">${t}</span><span class="n">${ring(dn / c)}${left ? left : '✓'}</span></button></li>`;
  }).join('');
  const tot = L.reduce((a, z) => a + z[1], 0), dn = L.reduce((a, z, i) => a + Math.min(z[1], sv[i] || 0), 0);
  $('#barFill').style.width = dn / tot * 100 + '%';
  $('#barLabel').textContent = `${L.filter((z, i) => (sv[i] || 0) >= z[1]).length} من ${L.length} أذكار مكتملة`;
}
$('#zikr').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const i = +b.dataset.i, all = azLoad(), a = all[state.set] || [];
  if ((a[i] || 0) < AZKAR[state.set][i][1]) a[i] = (a[i] || 0) + 1;
  all[state.set] = a;
  store.set(azKey(), JSON.stringify(all));
  if (navigator.vibrate) navigator.vibrate(8);
  renderAzkar();
});
const segSync = () => $$('.seg button').forEach(x => x.setAttribute('aria-selected', x.dataset.set === state.set));
$$('.seg button').forEach(b => b.addEventListener('click', () => { state.set = b.dataset.set; segSync(); renderAzkar(); }));

/* ===== البنر ===== */
let bi = Math.floor(Math.random() * BANNER.length);
const showBanner = () => { $('#bt').textContent = BANNER[bi][0]; $('#bs').textContent = BANNER[bi][1]; };
setInterval(() => { $('#banner').classList.add('f'); setTimeout(() => { bi = (bi + 1) % BANNER.length; showBanner(); $('#banner').classList.remove('f'); }, 600); }, 9000);

/* ===== واجهة ===== */
new IntersectionObserver(([e]) => $('#mini').classList.toggle('show', !e.isIntersecting), { threshold: .12 }).observe($('#hero'));
const dk = $$('.dock a');
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && dk.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id))), { rootMargin: '-45% 0px -45% 0px' });
$$('main>section').forEach(s => io.observe(s));

const sel = $('#city');
sel.innerHTML = Object.entries(CITIES).map(([k, c]) => `<option value="${k}">${c.n}</option>`).join('');
sel.value = state.city;
sel.addEventListener('change', () => {
  state.city = sel.value; store.set('naseem-city', state.city);
  pr = { t: null, m: null, nx: null, pv: null }; loadWeather(); loadPrayer();
});

segSync(); showBanner(); renderAzkar(); loadWeather(); loadPrayer();
setInterval(loadWeather, 15 * 60 * 1000);
