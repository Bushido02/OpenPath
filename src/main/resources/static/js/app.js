// === КОНФИГУРАЦИЯ ===
const MAPTILER_KEY = '8Wl8NVdgQf24Ak9zxDl7';
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFjYjgxNzIyY2I0ZDRiZmY5NDE3MWRiZGQ4N2QxMjZlIiwiaCI6Im11cm11cjY0In0=';
const BACKEND_URL = window.location.origin;

// Локальный Fallback с полным набором данных для теста
let placesDB = [
    { id: 1, name: "ТРЦ MEGA Alma-Ata", lat: 43.2018, lng: 76.8923, category: "shop", accessLevel: "full", deafFriendly: true, desc: "Большой торгово-развлекательный центр. Доступны автоматические двери, просторные лифты и пологие рампы на всех входах.", hours: "10:00 - 22:00", image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80" },
    { id: 2, name: "Magnum Cash & Carry", lat: 43.2375, lng: 76.8875, category: "shop", accessLevel: "full", deafFriendly: true, desc: "Продуктовый супермаркет. Широкие проходы между стеллажами, отсутствие порогов, кассы заниженного типа.", hours: "Круглосуточно", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80" },
    { id: 3, name: "Центральная Аптека Садыхан", lat: 43.2380, lng: 76.8890, category: "pharmacy", accessLevel: "full", deafFriendly: false, desc: "Круглосуточный аптечный пункт. Пандус оборудован поручнями с двух сторон, кнопка вызова персонала работает.", hours: "Круглосуточно", image: "https://images.unsplash.com/photo-1631549916768-411d643a54ef?w=600&q=80" },
    { id: 4, name: "Ресторан Navat", lat: 43.2420, lng: 76.9010, category: "food", accessLevel: "partial", deafFriendly: true, desc: "Ресторан национальной кухни. На входе есть три ступени, но установлена кнопка вызова официанта и складной пандус.", hours: "11:00 - 00:00", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80" }
];

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
    center: [76.8897, 43.2389], zoom: 13.5, pitch: 0, doubleClickZoom: false
});

map.on('load', () => {
    addCustomMapLayers();
    loadSettings();
    fetchPlacesFromVercel();
    window.renderPlaces();
});

function addCustomMapLayers() {
    if(!map.getSource('route')) map.addSource('route', { 'type': 'geojson', 'data': { "type": "FeatureCollection", "features": [] } });
    if(!map.getLayer('route-layer')) map.addLayer({ 'id': 'route-layer', 'type': 'line', 'source': 'route', 'layout': { 'line-join': 'round', 'line-cap': 'round' }, 'paint': { 'line-color': '#007aff', 'line-width': 6 } });
}

async function fetchPlacesFromVercel() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/places`);
        const data = await res.json();
        if (data && data.length > 0) {
            placesDB = data.map(p => ({
                id: p.id,
                name: p.name || "Без названия",
                lat: parseFloat(p.lat || p.latitude),
                lng: parseFloat(p.lng || p.longitude),
                category: p.category || 'shop',
                accessLevel: p.accessLevel || 'full',
                deafFriendly: p.deafFriendly !== undefined ? p.deafFriendly : false,
                desc: p.desc || p.description || "Описание отсутствует.",
                hours: p.hours || "09:00 - 21:00",
                image: p.image || null
            }));
            window.renderPlaces();
        }
    } catch (e) { console.warn("Синхронизация с Vercel недоступна, запущен локальный пакет мест."); }
}

// === УПРАВЛЕНИЕ ШТОРКОЙ ===
function setSheetState(s) {
    if (!state.isMobile) return;
    document.getElementById('sidebarContent').className = `sidebar-content state-${s}`;
}

document.querySelectorAll('.nav-tab, .mob-nav-item').forEach(el => {
    el.addEventListener('click', () => {
        const target = el.getAttribute('data-target');
        document.querySelectorAll('.nav-tab, .mob-nav-item').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

        document.querySelector(`.nav-tab[data-target="${target}"]`)?.classList.add('active');
        document.querySelector(`.mob-nav-item[data-target="${target}"]`)?.classList.add('active');
        document.getElementById(target).classList.add('active');

        setSheetState(target === 'panel-search' ? 'collapsed' : 'half');
    });
});

let startY = 0;
document.getElementById('dragHandle').addEventListener('touchstart', e => startY = e.touches[0].clientY, {passive: true});
document.getElementById('dragHandle').addEventListener('touchend', e => {
    let diff = startY - e.changedTouches[0].clientY;
    const sheet = document.getElementById('sidebarContent');
    if (diff > 40) setSheetState(sheet.classList.contains('state-collapsed') ? 'half' : 'full');
    else if (diff < -40) setSheetState(sheet.classList.contains('state-full') ? 'half' : 'collapsed');
});

// === ПОИСК И ФИЛЬТРАЦИЯ ===
document.getElementById('searchInput').addEventListener('input', () => window.renderPlaces());
document.getElementById('searchInput').addEventListener('focus', () => setSheetState('full'));

document.querySelectorAll('.quick-filters .chip-btn').forEach(btn => {
    btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const query = btn.getAttribute('data-query');
        document.getElementById('searchInput').value = query;
        window.renderPlaces();
        setSheetState('half'); // Оставляем карту видимой!
    };
});

window.renderPlaces = function() {
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    const isW = document.getElementById('cb-wheelchair').checked;
    const isDeaf = document.getElementById('cb-deaf').checked;
    const list = document.getElementById('searchResultsList');

    list.innerHTML = '';
    state.markers.places.forEach(m => m.remove());
    state.markers.places = [];

    let filtered = placesDB.filter(p => {
        let matchText = q === '' ? true : (p.name.toLowerCase().includes(q) || p.category.includes(q) || p.desc.toLowerCase().includes(q));
        // Фильтрация применяется ТОЛЬКО если чекбоксы активны
        if(isW && p.accessLevel === 'none') return false;
        if(isDeaf && !p.deafFriendly) return false;
        return matchText;
    });

    if (filtered.length === 0 && q !== '') {
        list.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:15px;">Ничего не найдено</p>';
        return;
    }

    filtered.forEach(p => {
        // КРИТИЧЕСКАЯ ЗАЩИТА ОТ КРАША ТРЕГА: Проверка валидности координат перед добавлением маркера
        if (!p.lat || !p.lng || isNaN(p.lat) || isNaN(p.lng)) {
            console.error("Пропущена запись с битыми координатами:", p);
            return;
        }

        let el = document.createElement('div'); el.className = 'result-item';
        let aIcon = p.accessLevel === 'full' ? '✅ Доступная среда' : (p.accessLevel === 'partial' ? '🤝 Частично доступно' : '❌ Есть ступени');

        el.innerHTML = `
            <div class="result-title">${p.name}</div>
            <div class="result-desc">${p.desc}</div>
            <div style="font-size:11px; font-weight:700; color:var(--primary); margin-top:4px;">${aIcon} ${p.deafFriendly ? '| 🧏 Адаптировано' : ''}</div>
        `;
        el.onclick = () => { map.flyTo({center: [p.lng, p.lat], zoom: 17}); showPlaceCard(p); };
        list.appendChild(el);

        let mEl = document.createElement('div'); mEl.className = 'custom-icon-wrapper';
        mEl.style.background = p.accessLevel === 'none' ? '#ff3b30' : (p.accessLevel === 'partial' ? '#ff9500' : '#34c759');
        mEl.innerHTML = p.category === 'pharmacy' ? '💊' : (p.category === 'food' ? '🍽️' : '🛒');
        mEl.onclick = (e) => { e.stopPropagation(); map.flyTo({center: [p.lng, p.lat], zoom: 17}); showPlaceCard(p); };

        state.markers.places.push(new maplibregl.Marker(mEl).setLngLat([p.lng, p.lat]).addTo(map));
    });
};

function showPlaceCard(p) {
    const list = document.getElementById('searchResultsList');
    list.innerHTML = '';
    setSheetState('half');

    let accessText = p.accessLevel === 'full' ? '♿ Безбарьерная среда (Вход плоский / Пандус)' : (p.accessLevel === 'partial' ? '🤝 Ограниченный доступ (Кнопка вызова / Съемный пандус)' : '❌ Вход не оборудован (Имеются ступени)');
    let deafText = p.deafFriendly ? '🧏 Доступно текстовое меню или табло информации' : '💬 Стандартное обслуживание';
    let imageSrc = p.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80';

    let card = document.createElement('div');
    card.className = 'place-detail-card';
    card.innerHTML = `
        <button class="close-card" onclick="window.renderPlaces(); setSheetState('collapsed');">✕</button>
        <img src="${imageSrc}" alt="${p.name}">
        <h3 style="margin: 0 0 6px 0; font-size: 18px; font-weight:800;">${p.name}</h3>
        <div style="margin-bottom: 10px; font-size: 13px; font-weight: 700; color: #34c759;">🕒 График работы: ${p.hours}</div>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: var(--text-muted); line-height:1.4;">${p.desc}</p>
        
        <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:15px;">
            <span class="accessibility-badge ${p.accessLevel}">${accessText}</span>
            <span class="accessibility-badge info" style="background:#ac34c7;">${deafText}</span>
        </div>
        <button class="start-nav-btn" style="width:100%;" onclick="window.buildRouteTo(${p.lat}, ${p.lng}, '${p.name.replace(/'/g, "\\'")}')">Построить маршрут сюда</button>
    `;
    list.appendChild(card);
    speak(p.name + ". " + p.desc);
}

// === ОБРАБОТКА ИНТЕРФЕЙСА КАРТЫ ===
document.getElementById('zoomInBtn').onclick = () => map.zoomIn();
document.getElementById('zoomOutBtn').onclick = () => map.zoomOut();

document.getElementById('btn3D').onclick = () => {
    state.is3D = !state.is3D;
    map.easeTo({ pitch: state.is3D ? 60 : 0, bearing: state.is3D ? -20 : 0 });
    document.getElementById('btn3D').style.color = state.is3D ? "var(--primary)" : "var(--text-main)";
};

// === СИСТЕМА ГЕОЛОКАЦИИ И ПОМОЩНИКОВ ===
function toast(msg) {
    const c = document.getElementById('toast-container'); const t = document.createElement('div');
    t.className = 'toast'; t.innerText = msg; c.appendChild(t); setTimeout(() => t.remove(), 3000);
}

function speak(text) {
    window.speechSynthesis.cancel(); // МОМЕНТАЛЬНО ПРЕРЫВАЕТ СТАРУЮ ДИКТОВКУ
    if (state.voice || document.getElementById('cb-vision').checked) {
        let u = new SpeechSynthesisUtterance(text); u.lang = 'ru-RU'; window.speechSynthesis.speak(u);
    }
}

document.getElementById('voiceBtn').onclick = () => {
    state.voice = !state.voice;
    document.getElementById('voiceBtn').style.color = state.voice ? "var(--primary)" : "var(--text-main)";
    toast(state.voice ? "Аудио-гид: ВКЛ" : "Аудио-гид: ВЫКЛ");
};

document.getElementById('gpsBtn').onclick = () => {
    if (state.gpsActive && state.markers.gps) {
        map.flyTo({center: state.markers.gps.getLngLat(), zoom: 18, pitch: 45});
        toast("Карта центрирована на вас");
        return;
    }
    if ("geolocation" in navigator) {
        document.getElementById('gpsBtn').style.color = "var(--primary)"; state.gpsActive = true; toast("Синхронизация со спутниками...");
        navigator.geolocation.watchPosition(pos => {
            const coords = [pos.coords.longitude, pos.coords.latitude];
            if (!state.markers.gps) {
                let el = document.createElement('div'); el.className = 'gps-pulse';
                state.markers.gps = new maplibregl.Marker({element: el}).setLngLat(coords).addTo(map);
                map.flyTo({center: coords, zoom: 18, pitch: 45});
            } else { state.markers.gps.setLngLat(coords); }
        }, null, { enableHighAccuracy: true });
    }
};

// === НАВИГАЦИЯ И МАРШРУТЫ ===
window.enablePicking = function(type) {
    state.picking = type; setSheetState('collapsed');
    document.getElementById('map-picking-overlay').style.display = 'block';
};

window.clearPoint = function(type) {
    if (type === 'start') {
        state.routeLatLangs.start = null;
        document.getElementById('routeStart').value = '';
        if (state.markers.start) state.markers.start.remove();
    } else {
        state.routeLatLangs.end = null;
        document.getElementById('routeEnd').value = '';
        if (state.markers.end) state.markers.end.remove();
    }
    document.getElementById('routeResult').style.display = 'none';
    map.getSource('route').setData({ "type": "FeatureCollection", "features": [] });
};

window.swapRoutePoints = function() {
    if(!state.routeLatLangs.start || !state.routeLatLangs.end) return;
    let temp = state.routeLatLangs.start; state.routeLatLangs.start = state.routeLatLangs.end; state.routeLatLangs.end = temp;
    let tVal = document.getElementById('routeStart').value; document.getElementById('routeStart').value = document.getElementById('routeEnd').value; document.getElementById('routeEnd').value = tVal;
    if(state.markers.start) state.markers.start.setLngLat(state.routeLatLangs.start);
    if(state.markers.end) state.markers.end.setLngLat(state.routeLatLangs.end);
    calcRoute();
};

window.buildRouteTo = function(lat, lng, name) {
    state.routeLatLangs.end = [lng, lat]; document.getElementById('routeEnd').value = name;
    document.querySelector(`.nav-tab[data-target="panel-routes"]`).click();
    if(state.markers.gps && !state.routeLatLangs.start) {
        state.routeLatLangs.start = [state.markers.gps.getLngLat().lng, state.markers.gps.getLngLat().lat];
        document.getElementById('routeStart').value = "Мое местоположение";
    }
    calcRoute();
};

map.on('click', e => {
    if (!state.picking) return;
    const coords = [e.lngLat.lng, e.lngLat.lat];
    let el = document.createElement('div'); el.innerHTML = `<div class="point-icon ${state.picking === 'start' ? 'a' : 'b'}">${state.picking === 'start' ? 'A' : 'B'}</div>`;

    if (state.picking === 'start') {
        state.routeLatLangs.start = coords; document.getElementById('routeStart').value = "Выбранная точка А";
        if(state.markers.start) state.markers.start.remove();
        state.markers.start = new maplibregl.Marker(el).setLngLat(coords).addTo(map);
    } else {
        state.routeLatLangs.end = coords; document.getElementById('routeEnd').value = "Выбранная точка Б";
        if(state.markers.end) state.markers.end.remove();
        state.markers.end = new maplibregl.Marker(el).setLngLat(coords).addTo(map);
    }

    state.picking = null; document.getElementById('map-picking-overlay').style.display = 'none';
    document.querySelector(`.nav-tab[data-target="panel-routes"]`).click();
    calcRoute();
});

async function calcRoute() {
    if(!state.routeLatLangs.start || !state.routeLatLangs.end) return;
    document.getElementById('routeResult').style.display = 'block';
    try {
        const res = await fetch(`https://api.openrouteservice.org/v2/directions/${state.mode}?api_key=${ORS_API_KEY}&start=${state.routeLatLangs.start.join(',')}&end=${state.routeLatLangs.end.join(',')}`);
        const data = await res.json();
        map.getSource('route').setData({ "type": "Feature", "geometry": { "type": "LineString", "coordinates": data.features[0].geometry.coordinates } });
        document.getElementById('routeTime').innerText = Math.round(data.features[0].properties.summary.duration / 60) + ' мин';
        document.getElementById('routeDist').innerText = (data.features[0].properties.summary.distance / 1000).toFixed(2) + ' км';

        const bounds = new maplibregl.LngLatBounds(); data.features[0].geometry.coordinates.forEach(c => bounds.extend(c));
        map.fitBounds(bounds, { padding: 40 });
    } catch(e) { toast("Маршрут временно недоступен"); }
}

document.querySelectorAll('.r-tab').forEach(t => t.onclick = () => {
    document.querySelectorAll('.r-tab').forEach(el => el.classList.remove('active'));
    t.classList.add('active'); state.mode = t.getAttribute('data-mode'); calcRoute();
});

document.getElementById('resetRouteBtn').onclick = () => {
    map.getSource('route').setData({ "type": "FeatureCollection", "features": [] });
    if(state.markers.start) state.markers.start.remove(); if(state.markers.end) state.markers.end.remove();
    state.routeLatLangs = {start:null, end:null};
    document.getElementById('routeStart').value = ''; document.getElementById('routeEnd').value = '';
    document.getElementById('routeResult').style.display = 'none';
};

// === НАСТРОЙКИ ===
function loadSettings() {
    ['theme', 'wheelchair', 'vision', 'deaf'].forEach(k => {
        let v = localStorage.getItem(k);
        if(v && k === 'theme') { document.getElementById('settingTheme').value = v; applySettings(); }
        else if (v === 'true') {
            const cb = document.getElementById('cb-'+k);
            if(cb) cb.checked = true;
        }
    });
}

document.querySelectorAll('#cb-wheelchair, #cb-vision, #cb-deaf').forEach(cb => {
    cb.addEventListener('change', () => {
        ['wheelchair', 'vision', 'deaf'].forEach(k => {
            const el = document.getElementById('cb-'+k);
            if(el) localStorage.setItem(k, el.checked);
        });
        window.renderPlaces();
    });
});

function applySettings() {
    const t = document.getElementById('settingTheme').value;
    localStorage.setItem('theme', t); document.documentElement.setAttribute('data-theme', t);
    map.setStyle(`https://api.maptiler.com/maps/${t === 'dark' ? 'basic-v2-dark' : 'streets-v2'}/style.json?key=${MAPTILER_KEY}`);
    map.once('styledata', () => addCustomMapLayers());
}
document.getElementById('settingTheme').onchange = applySettings;

// === ИИ СКАНЕР (РАДАР) ===
let cvInterval = null; let videoStream = null; let aiModel = null;
window.startTrafficLightAssist = async function() {
    if(!aiModel) { toast("Загрузка нейросети..."); aiModel = await cocoSsd.load(); }
    document.getElementById('traffic-light-overlay').style.display = 'flex';
    const video = document.getElementById('camera-feed'); const canvas = document.getElementById('cv-canvas'); const ctx = canvas.getContext('2d');
    videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); video.srcObject = videoStream;
    video.onloadedmetadata = () => {
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        cvInterval = setInterval(async () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height); const predictions = await aiModel.detect(canvas);
            let tl = predictions.find(p => p.class === 'traffic light' && p.score > 0.5);
            if(tl) { document.getElementById('trafficIcon').innerText = "🚦"; document.getElementById('trafficText').innerText = "СВЕТОФОР ИДЕНТИФИЦИРОВАН!"; }
            else { document.getElementById('trafficIcon').innerText = "👀"; document.getElementById('trafficText').innerText = "Сканирование перекрестка..."; }
        }, 1000);
    };
};
window.stopTrafficLightAssist = function() { if(cvInterval) clearInterval(cvInterval); if(videoStream) videoStream.getTracks().forEach(t=>t.stop()); document.getElementById('traffic-light-overlay').style.display = 'none'; };