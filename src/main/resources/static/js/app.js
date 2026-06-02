// === КОНФИГУРАЦИЯ И КЛЮЧИ ===
const MAPTILER_KEY = '8Wl8NVdgQf24Ak9zxDl7';
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFjYjgxNzIyY2I0ZDRiZmY5NDE3MWRiZGQ4N2QxMjZlIiwiaCI6Im11cm11cjY0In0=';
const BACKEND_URL = window.location.origin;

// === СЛОВАРЬ ПЕРЕВОДОВ (ru, uk, kz) ===
const translations = {
    ru: {
        searchPlaceholder: "Поиск мест...", optionsTitle: "Опции", routeTitle: "Построить маршрут",
        tabSearch: "Поиск", tabRoutes: "Маршрут", tabOptions: "Опции",
        lblLanguage: "Язык интерфейса", lblTheme: "Тема и визуальный стиль", lblAccessibility: "Потребности и Доступность",
        needsWheelchair: "Без ступеней", needsVision: "Голосовой гид", needsDeaf: "Текстовое меню",
        pointA: "Точка А", pointB: "Точка Б", кудаНажать: "Куда (Нажмите на карту)",
        btnRouteHere: "Маршрут сюда", btnDrive: "В путь", btnReset: "Сброс",
        toastGPS: "Ищу GPS...", toastGPSFound: "Спутники найдены!", toastVoiceOn: "Голос включен", toastVoiceOff: "Голос выключен",
        trafficWait: "Наведите камеру на дорогу...", trafficFound: "СВЕТОФОР!", trafficScan: "Радар включен", trafficClose: "Закрыть",
        fullAccess: "✅ Доступно для колясок", partialAccess: "🤝 Кнопка вызова", noAccess: "❌ Ступени (Нужна помощь)",
        routeError: "Ошибка построения маршрута", noPlaces: "Ничего не найдено"
    },
    uk: {
        searchPlaceholder: "Пошук місць...", optionsTitle: "Опції", routeTitle: "Побудувати маршрут",
        tabSearch: "Пошук", tabRoutes: "Маршрут", tabOptions: "Опції",
        lblLanguage: "Мова інтерфейсу", lblTheme: "Тема та візуальний стиль", lblAccessibility: "Потреби та Доступність",
        needsWheelchair: "Без сходинок", needsVision: "Голосовий гід", needsDeaf: "Текстове меню",
        pointA: "Точка А", pointB: "Точка Б", кудаНажать: "Куди (Натисніть на карту)",
        btnRouteHere: "Маршрут сюди", btnDrive: "Поїхали", btnReset: "Скидання",
        toastGPS: "Шукаю GPS...", toastGPSFound: "Супутники знайдені!", toastVoiceOn: "Голос увімкнено", toastVoiceOff: "Голос вимкнено",
        trafficWait: "Наведіть камеру на дорогу...", trafficFound: "СВІТЛОФОР!", trafficScan: "Радар увімкнено", trafficClose: "Закрити",
        fullAccess: "✅ Доступно для візків", partialAccess: "🤝 Кнопка виклику", noAccess: "❌ Сходинки (Потрібна допомога)",
        routeError: "Помилка побудови маршруту", noPlaces: "Нічого не знайдено"
    },
    kz: {
        searchPlaceholder: "Орындарды іздеу...", optionsTitle: "Баптаулар", routeTitle: "Маршрут салу",
        tabSearch: "Іздеу", tabRoutes: "Маршрут", tabOptions: "Баптаулар",
        lblLanguage: "Интерфейс тілі", lblTheme: "Тақырып және стиль", lblAccessibility: "Қажеттіліктер мен Қолжетімділік",
        needsWheelchair: "Баспалдақсыз", needsVision: "Дауыстық нұсқау", needsDeaf: "Мәтіндік мәзір",
        pointA: "A нүктесі", pointB: "Б нүктесі", кудаНажать: "Қайда (Картаға басыңыз)",
        btnRouteHere: "Маршрут осында", btnDrive: "Кеттік", btnReset: "Тастау",
        toastGPS: "GPS іздеу...", toastGPSFound: "Спутниктер табылды!", toastVoiceOn: "Дауыс қосылды", toastVoiceOff: "Дауыс өшірілді",
        trafficWait: "Камераны жолға бағыттаңыз...", trafficFound: "БАҒДАРШАМ!", trafficScan: "Радар қосылды", trafficClose: "Жабу",
        fullAccess: "✅ Арбаларға қолжетімді", partialAccess: "🤝 Шақыру батырмасы", noAccess: "❌ Баспалдақ (Көмек керек)",
        routeError: "Маршрут құру қатесі", noPlaces: "Ештеңе табылмады"
    }
};

// === БАЗА ДАННЫХ ===
let placesDB = [
    { id: 1, name: "MEGA Alma-Ata", lat: 43.2018, lng: 76.8923, category: "shop", accessLevel: "full", deafFriendly: true, desc: "Крупный торговый центр." },
    { id: 2, name: "Magnum Cash & Carry", lat: 43.2375, lng: 76.8875, category: "shop", accessLevel: "full", deafFriendly: true, desc: "Продуктовый супермаркет." },
    { id: 3, name: "Аптека Садыхан", lat: 43.2380, lng: 76.8890, category: "pharmacy", accessLevel: "full", deafFriendly: false, desc: "Круглосуточная аптека." },
    { id: 4, name: "Ресторан Navat", lat: 43.2420, lng: 76.9010, category: "food", accessLevel: "partial", deafFriendly: true, desc: "Восточная кухня." }
];

// === СОСТОЯНИЕ (STATE) ===
let currentLang = 'ru';
let state = {
    isMobile: window.innerWidth <= 768,
    voice: false,
    gpsActive: false,
    is3D: false,
    mode: 'driving-car',
    picking: null,
    routeLatLangs: { start: null, end: null },
    markers: { gps: null, start: null, end: null, places: [] }
};

// === ИНИЦИАЛИЗАЦИЯ КАРТЫ ===
const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    center: [76.8897, 43.2389], zoom: 13.5, doubleClickZoom: false
});

map.on('load', () => {
    addCustomMapLayers();
    loadUserSettings();
    fetchBackendPlaces();
    applyLanguage();
});

function addCustomMapLayers() {
    if(!map.getSource('route')) map.addSource('route', { 'type': 'geojson', 'data': { "type": "FeatureCollection", "features": [] } });
    if(!map.getLayer('route-layer')) map.addLayer({ 'id': 'route-layer', 'type': 'line', 'source': 'route', 'layout': { 'line-join': 'round', 'line-cap': 'round' }, 'paint': { 'line-color': '#007aff', 'line-width': 6 } });
}

// === ЛОГИКА МУЛЬТИЯЗЫЧНОСТИ ===
window.applyLanguage = function() {
    const selector = document.getElementById('settingLanguage');
    if (selector) currentLang = selector.value;
    localStorage.setItem('language', currentLang);
    const t = translations[currentLang];

    document.getElementById('searchInput').placeholder = t.searchPlaceholder;

    document.querySelectorAll('.nav-tab, .mob-nav-item').forEach(item => {
        const target = item.getAttribute('data-target');
        const labelEl = item.querySelector('.label');
        if (target === 'panel-search' && labelEl) labelEl.innerText = t.tabSearch;
        if (target === 'panel-routes' && labelEl) labelEl.innerText = t.tabRoutes;
        if (target === 'panel-profile' && labelEl) labelEl.innerText = t.tabOptions;
    });

    document.getElementById('txtOptionsTitle').innerText = t.optionsTitle;
    document.getElementById('lblLanguage').innerText = t.lblLanguage;
    document.getElementById('lblTheme').innerText = t.lblTheme;
    document.getElementById('lblAccessibility').innerText = t.lblAccessibility;
    document.getElementById('cb-wheelchair').parentNode.querySelector('.cb-txt').nextSibling.nodeValue = " " + t.needsWheelchair;
    document.getElementById('cb-vision').parentNode.querySelector('.cb-txt').nextSibling.nodeValue = " " + t.needsVision;
    document.getElementById('cb-deaf').parentNode.querySelector('.cb-txt').nextSibling.nodeValue = " " + t.needsDeaf;

    document.getElementById('txtRouteTitle').innerText = t.routeTitle;
    document.getElementById('routeStart').placeholder = t.pointA;
    if (!state.routeLatLangs.end) document.getElementById('routeEnd').placeholder = t.кудаНажать;
    else document.getElementById('routeEnd').placeholder = t.pointB;

    const resetBtn = document.querySelector('.reset-btn');
    const startNavBtn = document.querySelector('.start-nav-btn');
    if (resetBtn) resetBtn.innerText = t.btnReset;
    if (startNavBtn) startNavBtn.innerText = t.btnDrive;

    window.renderPlaces();
};

// === УПРАВЛЕНИЕ UI И ШТОРКОЙ ===
window.setSheetState = function(s) {
    if (!state.isMobile) return;
    document.getElementById('sidebarContent').className = `sidebar-content state-${s}`;
};

const dragHandle = document.getElementById('dragHandle');
if (dragHandle) {
    let startY = 0;
    dragHandle.addEventListener('touchstart', e => startY = e.touches[0].clientY, {passive: true});
    dragHandle.addEventListener('touchend', e => {
        let diff = startY - e.changedTouches[0].clientY;
        const sheet = document.getElementById('sidebarContent');
        if (diff > 40) setSheetState(sheet.classList.contains('state-collapsed') ? 'half' : 'full');
        else if (diff < -40) setSheetState(sheet.classList.contains('state-full') ? 'half' : 'collapsed');
    });
}

document.querySelectorAll('.nav-tab').forEach(el => {
    el.addEventListener('click', () => {
        const target = el.getAttribute('data-target');
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        document.getElementById(target).classList.add('active');
        setSheetState(target === 'panel-search' ? 'collapsed' : 'half');
    });
});

window.openMobileMenu = function(targetId, el) {
    document.querySelectorAll('.mob-nav-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    document.getElementById(targetId).classList.add('active');
    setSheetState(targetId === 'panel-search' ? 'collapsed' : 'half');
};

// === БЭКЕНД И МЕСТА ===
async function fetchBackendPlaces() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/places`);
        const data = await res.json();
        if (data && data.length > 0) {
            placesDB = data.map(p => ({
                id: p.id, name: p.name, lat: parseFloat(p.lat || p.latitude), lng: parseFloat(p.lng || p.longitude),
                category: p.category || 'shop', accessLevel: p.accessLevel || 'full', deafFriendly: p.deafFriendly !== undefined ? p.deafFriendly : true,
                desc: p.desc || p.description || ''
            }));
            window.renderPlaces();
        }
    } catch (e) { console.warn("Используется локальная БД."); }
}

window.quickSearch = function(query) {
    document.getElementById('searchInput').value = query;
    window.renderPlaces();
    setSheetState('half');
};

window.renderPlaces = function() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const isW = document.getElementById('cb-wheelchair').checked;
    const isDeaf = document.getElementById('cb-deaf').checked;
    const t = translations[currentLang];
    const list = document.getElementById('searchResultsList');

    list.innerHTML = '';
    state.markers.places.forEach(m => m.remove());
    state.markers.places = [];

    let filtered = placesDB.filter(p => {
        let textMatch = query === '' ? true : (p.name.toLowerCase().includes(query) || p.category.includes(query) || p.desc.toLowerCase().includes(query));
        if(isW && p.accessLevel === 'none') return false;
        if(isDeaf && !p.deafFriendly) return false;
        return textMatch;
    });

    if (filtered.length === 0 && query !== '') {
        list.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:15px;">${t.noPlaces}</p>`;
        return;
    }

    filtered.forEach(p => {
        if (!p.lat || !p.lng || isNaN(p.lat) || isNaN(p.lng)) return;

        let item = document.createElement('div');
        item.className = 'result-item';
        let accessText = p.accessLevel === 'full' ? t.fullAccess : (p.accessLevel === 'partial' ? t.partialAccess : t.noAccess);

        item.innerHTML = `
            <div class="result-title">${p.name}</div>
            <div class="result-desc">${p.desc}</div>
            <div style="font-size:11px; color:var(--primary); font-weight:700; margin-top:4px;">${accessText}</div>
        `;
        item.onclick = () => showPlaceDetails(p);
        list.appendChild(item);

        let mEl = document.createElement('div'); mEl.className = 'custom-icon-wrapper';
        mEl.style.background = p.accessLevel === 'none' ? '#ff3b30' : (p.accessLevel === 'partial' ? '#ff9500' : '#34c759');
        mEl.innerHTML = p.category === 'pharmacy' ? '💊' : (p.category === 'food' ? '🍽️' : '📍');
        mEl.onclick = (e) => { e.stopPropagation(); showPlaceDetails(p); };

        state.markers.places.push(new maplibregl.Marker(mEl).setLngLat([p.lng, p.lat]).addTo(map));
    });
};

window.showPlaceDetails = function(p) {
    map.flyTo({center: [p.lng, p.lat], zoom: 17});
    setSheetState('half');
    const t = translations[currentLang];
    speak(p.name + ". " + p.desc);

    document.getElementById('searchResultsList').innerHTML = `
        <div class="place-detail-card">
            <button class="close-card" onclick="window.renderPlaces(); setSheetState('collapsed');">✕</button>
            <h3>${p.name}</h3>
            <p style="color:var(--text-muted); font-size:14px; margin-bottom:15px;">${p.desc}</p>
            <button class="start-nav-btn" style="width:100%;" onclick="buildRouteTo(${p.lat}, ${p.lng}, '${p.name.replace(/'/g, "\\'")}')">${t.btnRouteHere}</button>
        </div>
    `;
};

// === МАРШРУТЫ ===
window.startPickingMode = function(type) {
    state.picking = type; setSheetState('collapsed');
    document.getElementById('map-picking-overlay').style.display = 'block';
};

map.on('click', e => {
    if (!state.picking) return;
    const coords = [e.lngLat.lng, e.lngLat.lat];
    const t = translations[currentLang];
    let el = document.createElement('div'); el.innerHTML = `<div class="point-icon ${state.picking === 'start' ? 'a' : 'b'}">${state.picking === 'start' ? 'A' : 'B'}</div>`;

    if (state.picking === 'start') {
        state.routeLatLangs.start = coords; document.getElementById('routeStart').value = t.pointA;
        if(state.markers.start) state.markers.start.remove();
        state.markers.start = new maplibregl.Marker(el).setLngLat(coords).addTo(map);
    } else {
        state.routeLatLangs.end = coords; document.getElementById('routeEnd').value = t.pointB;
        if(state.markers.end) state.markers.end.remove();
        state.markers.end = new maplibregl.Marker(el).setLngLat(coords).addTo(map);
    }

    state.picking = null; document.getElementById('map-picking-overlay').style.display = 'none';
    if(state.isMobile) openMobileMenu('panel-routes', document.querySelectorAll('.mob-nav-item')[1]);
    else document.querySelector(`.nav-tab[data-target="panel-routes"]`).click();
    calculateRoute();
});

window.swapRoutePoints = function() {
    if(!state.routeLatLangs.start || !state.routeLatLangs.end) return;
    let temp = state.routeLatLangs.start; state.routeLatLangs.start = state.routeLatLangs.end; state.routeLatLangs.end = temp;
    let tVal = document.getElementById('routeStart').value; document.getElementById('routeStart').value = document.getElementById('routeEnd').value; document.getElementById('routeEnd').value = tVal;
    if(state.markers.start) state.markers.start.setLngLat(state.routeLatLangs.start);
    if(state.markers.end) state.markers.end.setLngLat(state.routeLatLangs.end);
    calculateRoute();
};

window.clearRoutePoint = function(type) {
    const t = translations[currentLang];
    if (type === 'start') {
        state.routeLatLangs.start = null;
        document.getElementById('routeStart').value = '';
        if(state.markers.start) state.markers.start.remove();
    } else {
        state.routeLatLangs.end = null;
        document.getElementById('routeEnd').value = '';
        document.getElementById('routeEnd').placeholder = t.кудаНажать;
        if(state.markers.end) state.markers.end.remove();
    }
    document.getElementById('routeResult').style.display = 'none';
    map.getSource('route').setData({ "type": "FeatureCollection", "features": [] });
};

window.clearRoute = function() {
    window.clearRoutePoint('start');
    window.clearRoutePoint('end');
};

window.buildRouteTo = function(lat, lng, name) {
    state.routeLatLangs.end = [lng, lat]; document.getElementById('routeEnd').value = name;
    if(state.isMobile) openMobileMenu('panel-routes', document.querySelectorAll('.mob-nav-item')[1]);
    else document.querySelector(`.nav-tab[data-target="panel-routes"]`).click();

    if(state.markers.gps && !state.routeLatLangs.start) {
        state.routeLatLangs.start = [state.markers.gps.getLngLat().lng, state.markers.gps.getLngLat().lat];
        document.getElementById('routeStart').value = translations[currentLang].pointA;
        let el = document.createElement('div'); el.innerHTML = '<div class="point-icon a">A</div>';
        if(state.markers.start) state.markers.start.remove();
        state.markers.start = new maplibregl.Marker(el).setLngLat(state.routeLatLangs.start).addTo(map);
    }

    if(!state.markers.end) {
        let el = document.createElement('div'); el.innerHTML = '<div class="point-icon b">B</div>';
        state.markers.end = new maplibregl.Marker(el).setLngLat(state.routeLatLangs.end).addTo(map);
    } else {
        state.markers.end.setLngLat(state.routeLatLangs.end);
    }
    calculateRoute();
};

window.setMode = function(mode, el) {
    state.mode = mode;
    document.querySelectorAll('.r-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    calculateRoute();
};

async function calculateRoute() {
    if(!state.routeLatLangs.start || !state.routeLatLangs.end) return;
    document.getElementById('routeResult').style.display = 'block';
    try {
        const res = await fetch(`https://api.openrouteservice.org/v2/directions/${state.mode}?api_key=${ORS_API_KEY}&start=${state.routeLatLangs.start.join(',')}&end=${state.routeLatLangs.end.join(',')}`);
        const data = await res.json();
        map.getSource('route').setData({ "type": "Feature", "geometry": { "type": "LineString", "coordinates": data.features[0].geometry.coordinates } });
        document.getElementById('routeTime').innerText = Math.round(data.features[0].properties.summary.duration / 60) + ' мин';
        document.getElementById('routeDist').innerText = (data.features[0].properties.summary.distance / 1000).toFixed(2) + ' км';
        const bounds = new maplibregl.LngLatBounds(); data.features[0].geometry.coordinates.forEach(c => bounds.extend(c));
        map.fitBounds(bounds, { padding: 50 });
    } catch(e) { toast('routeError'); }
}

// === УТИЛИТЫ (GPS, Голос, 3D) ===
window.toast = function(msgKey, isRaw = false) {
    const msg = isRaw ? msgKey : translations[currentLang][msgKey];
    if(!msg) return;
    const c = document.getElementById('toast-container'); const t = document.createElement('div'); t.className = 'toast'; t.innerText = msg; c.appendChild(t); setTimeout(() => t.remove(), 3000);
};

window.speak = function(text) {
    window.speechSynthesis.cancel();
    if (state.voice || document.getElementById('cb-vision').checked) {
        let u = new SpeechSynthesisUtterance(text);
        u.lang = currentLang === 'ru' ? 'ru-RU' : (currentLang === 'uk' ? 'uk-UA' : 'kk-KZ');
        window.speechSynthesis.speak(u);
    }
};

window.toggleVoice = function() {
    state.voice = !state.voice;
    document.getElementById('voiceBtn').style.color = state.voice ? "var(--primary)" : "var(--text-main)";
    toast(state.voice ? 'toastVoiceOn' : 'toastVoiceOff');
};

window.toggleGPS = function() {
    if (state.gpsActive && state.markers.gps) {
        map.flyTo({center: state.markers.gps.getLngLat(), zoom: 18, pitch: 45});
        return;
    }
    if ("geolocation" in navigator) {
        document.getElementById('gpsBtn').style.color = "var(--primary)"; state.gpsActive = true; toast('toastGPS');
        navigator.geolocation.watchPosition(pos => {
            const coords = [pos.coords.longitude, pos.coords.latitude];
            if (!state.markers.gps) {
                let el = document.createElement('div'); el.className = 'gps-pulse';
                state.markers.gps = new maplibregl.Marker({element: el}).setLngLat(coords).addTo(map);
                map.flyTo({center: coords, zoom: 18, pitch: 45});
                toast('toastGPSFound');
            } else { state.markers.gps.setLngLat(coords); }
        }, null, { enableHighAccuracy: true });
    }
};

window.toggleMap3D = function() {
    state.is3D = !state.is3D;
    map.easeTo({ pitch: state.is3D ? 60 : 0, bearing: state.is3D ? -20 : 0 });
    document.getElementById('btn3D').style.color = state.is3D ? "var(--primary)" : "var(--text-main)";
};

// === НАСТРОЙКИ (PERSISTENCE) ===
function loadUserSettings() {
    const savedLang = localStorage.getItem('language') || 'ru';
    document.getElementById('settingLanguage').value = savedLang;
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.getElementById('settingTheme').value = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);

    if(localStorage.getItem('wheelchair') === 'true') { document.getElementById('cb-wheelchair').checked = true; document.getElementById('tabWheelchair').style.display = 'block'; }
    if(localStorage.getItem('vision') === 'true') document.getElementById('cb-vision').checked = true;
    if(localStorage.getItem('deaf') === 'true') document.getElementById('cb-deaf').checked = true;
}

window.saveUserSettings = function() {
    ['wheelchair', 'vision', 'deaf'].forEach(k => localStorage.setItem(k, document.getElementById('cb-'+k).checked));
    document.getElementById('tabWheelchair').style.display = document.getElementById('cb-wheelchair').checked ? 'block' : 'none';
    window.renderPlaces();
};

window.applySettings = function() {
    const t = document.getElementById('settingTheme').value;
    localStorage.setItem('theme', t); document.documentElement.setAttribute('data-theme', t);

    // Для контрастной темы используем темную карту Maptiler
    const mapStyle = t === 'contrast' ? 'basic-v2-dark' : (t === 'dark' ? 'basic-v2-dark' : 'streets-v2');
    map.setStyle(`https://api.maptiler.com/maps/${mapStyle}/style.json?key=${MAPTILER_KEY}`);
    map.once('styledata', () => addCustomMapLayers());
};

// === ГОЛОСОВОЙ ПОИСК ===
window.startVoiceSearch = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast("Голосовой поиск не поддерживается браузером", true);
    const recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'ru' ? 'ru-RU' : (currentLang === 'uk' ? 'uk-UA' : 'kk-KZ');
    recognition.start();
    document.getElementById('micBtn').style.color = "#ff3b30";
    recognition.onresult = function(event) {
        document.getElementById('searchInput').value = event.results[0][0].transcript;
        window.renderPlaces();
        document.getElementById('micBtn').style.color = "var(--primary)";
    };
    recognition.onerror = () => document.getElementById('micBtn').style.color = "var(--primary)";
};

// === ИИ КАМЕРА (РОБОТ) ===
let cvInterval = null; let videoStream = null; let aiModel = null;
window.startTrafficLightAssist = async function() {
    toast('trafficScan');
    if(!aiModel) aiModel = await cocoSsd.load();
    document.getElementById('traffic-light-overlay').style.display = 'flex';
    const video = document.getElementById('camera-feed'); const canvas = document.getElementById('cv-canvas'); const ctx = canvas.getContext('2d');
    videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); video.srcObject = videoStream;
    video.onloadedmetadata = () => {
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        cvInterval = setInterval(async () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height); const predictions = await aiModel.detect(canvas);
            let tl = predictions.find(p => p.class === 'traffic light' && p.score > 0.5);
            if(tl) {
                document.getElementById('trafficIcon').innerText = "🚦";
                document.getElementById('trafficText').innerText = translations[currentLang].trafficFound;
            } else {
                document.getElementById('trafficIcon').innerText = "👀";
                document.getElementById('trafficText').innerText = translations[currentLang].trafficWait;
            }
        }, 1000);
    };
};
window.stopTrafficLightAssist = function() {
    if(cvInterval) clearInterval(cvInterval);
    if(videoStream) videoStream.getTracks().forEach(t=>t.stop());
    document.getElementById('traffic-light-overlay').style.display = 'none';
};

// === РЕЖИМ НАВИГАТОРА (ЗАГЛУШКА) ===
window.startNavigatorMode = function() {
    document.getElementById('stopNavBtn').style.display = 'block';
    setSheetState('collapsed');
    toast("Навигация запущена", true);
};
window.stopNavigatorMode = function() {
    document.getElementById('stopNavBtn').style.display = 'none';
    toast("Навигация завершена", true);
};