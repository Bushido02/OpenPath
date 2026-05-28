// === КОНФИГУРАЦИЯ ===
const MAPTILER_KEY = '8Wl8NVdgQf24Ak9zxDl7';
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFjYjgxNzIyY2I0ZDRiZmY5NDE3MWRiZGQ4N2QxMjZlIiwiaCI6Im11cm11cjY0In0=';
const BACKEND_URL = window.location.origin;

// Локальный Fallback (срабатывает сразу, пока Vercel спит)
let placesDB = [
    { id: 1, name: "MEGA Alma-Ata", lat: 43.2018, lng: 76.8923, category: "shop", accessLevel: "full", deafFriendly: true, desc: "ТЦ с лифтами." },
    { id: 2, name: "Magnum", lat: 43.2375, lng: 76.8875, category: "shop", accessLevel: "full", deafFriendly: true, desc: "Супермаркет." },
    { id: 3, name: "Аптека Садыхан", lat: 43.2380, lng: 76.8890, category: "pharmacy", accessLevel: "full", deafFriendly: false, desc: "Круглосуточная аптека." },
    { id: 4, name: "Ресторан Navat", lat: 43.2420, lng: 76.9010, category: "food", accessLevel: "partial", deafFriendly: false, desc: "Есть кнопка." }
];

// === СОСТОЯНИЕ ПРИЛОЖЕНИЯ ===
let state = {
    isMobile: window.innerWidth <= 768,
    voice: false,
    gpsActive: false,
    mode: 'driving-car',
    picking: null, // 'start' | 'end' | null
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
    map.addSource('route', { 'type': 'geojson', 'data': { "type": "FeatureCollection", "features": [] } });
    map.addLayer({ 'id': 'route-layer', 'type': 'line', 'source': 'route', 'layout': { 'line-join': 'round', 'line-cap': 'round' }, 'paint': { 'line-color': '#007aff', 'line-width': 6 } });

    loadSettings();
    fetchPlacesFromVercel();
    renderPlaces();
});

// === СЕТЬ И ДАННЫЕ ===
async function fetchPlacesFromVercel() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/places`);
        const data = await res.json();
        if (data && data.length > 0) {
            placesDB = data.map(p => ({
                ...p, lat: p.lat || p.latitude, lng: p.lng || p.longitude, category: p.category || 'shop',
                accessLevel: p.accessLevel || 'full', deafFriendly: p.deafFriendly !== undefined ? p.deafFriendly : true
            }));
            renderPlaces();
        }
    } catch (e) { console.warn("Используется локальная база мест."); }
}

// === ЛОГИКА UI & ШТОРКИ ===
function setSheetState(s) {
    if (!state.isMobile) return;
    const sheet = document.getElementById('sidebarContent');
    sheet.className = `sidebar-content state-${s}`;
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

document.getElementById('searchInput').addEventListener('focus', () => setSheetState('full'));
document.getElementById('searchInput').addEventListener('input', renderPlaces);

// Логика свайпа шторки
let startY = 0;
document.getElementById('dragHandle').addEventListener('touchstart', e => startY = e.touches[0].clientY, {passive: true});
document.getElementById('dragHandle').addEventListener('touchend', e => {
    let diff = startY - e.changedTouches[0].clientY;
    const sheet = document.getElementById('sidebarContent');
    if (diff > 40) setSheetState(sheet.classList.contains('state-collapsed') ? 'half' : 'full');
    else if (diff < -40) setSheetState(sheet.classList.contains('state-full') ? 'half' : 'collapsed');
    else setSheetState(sheet.classList.contains('state-collapsed') ? 'half' : 'collapsed');
});

// === ОТОБРАЖЕНИЕ МЕСТ (ФИЛЬТРЫ) ===
function renderPlaces() {
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    const isW = document.getElementById('cb-wheelchair').checked;
    const isDeaf = document.getElementById('cb-deaf').checked;
    const list = document.getElementById('searchResultsList');

    list.innerHTML = '';
    state.markers.places.forEach(m => m.remove());
    state.markers.places = [];

    let filtered = placesDB.filter(p => {
        let matchText = q === '' ? true : (p.name.toLowerCase().includes(q) || p.category.includes(q));
        if(isW && p.accessLevel === 'none') return false;
        if(isDeaf && !p.deafFriendly) return false;
        return matchText;
    });

    if (filtered.length === 0 && q !== '') {
        list.innerHTML = '<p style="text-align:center; color:gray; padding:10px;">Ничего не найдено</p>';
        return;
    }

    filtered.forEach(p => {
        let el = document.createElement('div'); el.className = 'result-item';
        el.innerHTML = `<div class="result-title">${p.name}</div><div class="result-desc">${p.desc}</div>`;
        el.onclick = () => { map.flyTo({center: [p.lng, p.lat], zoom: 17}); showPlaceCard(p); };
        list.appendChild(el);

        let mEl = document.createElement('div'); mEl.className = 'custom-icon-wrapper';
        mEl.style.background = p.accessLevel === 'none' ? '#ff3b30' : (p.accessLevel === 'partial' ? '#ff9500' : '#34c759');
        mEl.innerHTML = p.category === 'pharmacy' ? '💊' : (p.category === 'food' ? '🍽️' : '📍');
        mEl.onclick = (e) => { e.stopPropagation(); showPlaceCard(p); };
        state.markers.places.push(new maplibregl.Marker(mEl).setLngLat([p.lng, p.lat]).addTo(map));
    });
}

function showPlaceCard(p) {
    const list = document.getElementById('searchResultsList');
    list.innerHTML = ''; setSheetState('half');
    speak(p.name + ". " + p.desc);

    let card = document.createElement('div'); card.className = 'place-detail-card';
    card.innerHTML = `
        <button class="close-card" onclick="renderPlaces(); setSheetState('collapsed');">✕</button>
        <h3 style="margin:0 0 5px 0;">${p.name}</h3>
        <p style="margin:0 0 10px 0; font-size:13px; color:gray;">${p.desc}</p>
        <button class="start-nav-btn" style="width:100%;" onclick="buildRouteTo(${p.lat}, ${p.lng}, '${p.name}')">Сюда</button>
    `;
    list.appendChild(card);
}

document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.onclick = () => { document.getElementById('searchInput').value = btn.getAttribute('data-query'); renderPlaces(); setSheetState('full'); };
});

// === ПОМОЩНИКИ (ГОЛОС, GPS) ===
function toast(msg) {
    const c = document.getElementById('toast-container'); const t = document.createElement('div');
    t.className = 'toast'; t.innerText = msg; c.appendChild(t); setTimeout(() => t.remove(), 3000);
}

function speak(text) {
    window.speechSynthesis.cancel(); // ЖЕСТКИЙ СБРОС СТАРОГО ТЕКСТА
    if (state.voice || document.getElementById('cb-vision').checked) {
        let u = new SpeechSynthesisUtterance(text); u.lang = 'ru-RU'; window.speechSynthesis.speak(u);
    }
}

document.getElementById('voiceBtn').onclick = () => {
    state.voice = !state.voice;
    document.getElementById('voiceBtn').style.color = state.voice ? "var(--primary)" : "var(--text-main)";
    toast(state.voice ? "Голос: ВКЛ" : "Голос: ВЫКЛ");
};

// ПРАВИЛЬНАЯ ЛОГИКА GPS (Не выключает, а кидает к себе)
let watchId = null;
document.getElementById('gpsBtn').onclick = () => {
    if (state.gpsActive && state.markers.gps) {
        map.flyTo({center: state.markers.gps.getLngLat(), zoom: 18, pitch: 45});
        toast("Карта отцентрована");
        return;
    }
    if ("geolocation" in navigator) {
        document.getElementById('gpsBtn').style.color = "var(--primary)"; state.gpsActive = true; toast("Ищу GPS...");
        watchId = navigator.geolocation.watchPosition(pos => {
            const coords = [pos.coords.longitude, pos.coords.latitude];
            if (!state.markers.gps) {
                let el = document.createElement('div'); el.className = 'gps-pulse';
                state.markers.gps = new maplibregl.Marker({element: el}).setLngLat(coords).addTo(map);
                map.flyTo({center: coords, zoom: 18, pitch: 45});
            } else { state.markers.gps.setLngLat(coords); }
        }, null, { enableHighAccuracy: true });
    }
};

// === НАСТРОЙКИ (PERSISTENCE) ===
function loadSettings() {
    ['theme', 'wheelchair', 'vision', 'deaf'].forEach(k => {
        let v = localStorage.getItem(k);
        if(v && k === 'theme') { document.getElementById('settingTheme').value = v; applySettings(); }
        else if (v === 'true') document.getElementById('cb-'+k).checked = true;
    });
}
window.saveUserSettings = function() {
    ['wheelchair', 'vision', 'deaf'].forEach(k => localStorage.setItem(k, document.getElementById('cb-'+k).checked));
    renderPlaces();
}
function applySettings() {
    const t = document.getElementById('settingTheme').value;
    localStorage.setItem('theme', t); document.documentElement.setAttribute('data-theme', t);
    map.setStyle(`https://api.maptiler.com/maps/${t === 'dark' ? 'basic-v2-dark' : 'streets-v2'}/style.json?key=${MAPTILER_KEY}`);
    map.once('styledata', addCustomMapLayers);
}
document.getElementById('settingTheme').onchange = applySettings;

// === МАРШРУТЫ И КЛИКИ ===
window.buildRouteTo = function(lat, lng, name) {
    state.routeLatLangs.end = [lng, lat]; document.getElementById('routeEnd').value = name;
    document.querySelector(`.nav-tab[data-target="panel-routes"]`).click();
    if(state.markers.gps && !state.routeLatLangs.start) {
        state.routeLatLangs.start = [state.markers.gps.getLngLat().lng, state.markers.gps.getLngLat().lat];
        document.getElementById('routeStart').value = "Мое местоположение";
    }
    calcRoute();
};

document.getElementById('startPointBtn').onclick = () => enablePicking('start');
document.getElementById('endPointBtn').onclick = () => enablePicking('end');

function enablePicking(type) {
    state.picking = type; setSheetState('collapsed');
    document.getElementById('map-picking-overlay').style.display = 'block';
}

map.on('click', e => {
    if (!state.picking) return;
    const coords = [e.lngLat.lng, e.lngLat.lat];
    let el = document.createElement('div'); el.innerHTML = `<div class="point-icon ${state.picking === 'start' ? 'a' : 'b'}">${state.picking === 'start' ? 'A' : 'B'}</div>`;

    if (state.picking === 'start') {
        state.routeLatLangs.start = coords; document.getElementById('routeStart').value = "Точка";
        if(state.markers.start) state.markers.start.remove();
        state.markers.start = new maplibregl.Marker(el).setLngLat(coords).addTo(map);
    } else {
        state.routeLatLangs.end = coords; document.getElementById('routeEnd').value = "Точка";
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
    } catch(e) { toast("Ошибка маршрута"); }
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

// === УПРАВЛЕНИЕ КАРТОЙ (ЗУМ И 3D) ===
document.getElementById('zoomInBtn').onclick = () => map.zoomIn();
document.getElementById('zoomOutBtn').onclick = () => map.zoomOut();

document.getElementById('btn3D').onclick = () => {
    const btn = document.getElementById('btn3D');
    if (state.is3D) {
        map.easeTo({ pitch: 0, bearing: 0 });
        btn.style.color = "var(--text-main)";
    } else {
        map.easeTo({ pitch: 60, bearing: -20 });
        btn.style.color = "var(--primary)";
    }
    state.is3D = !state.is3D; // Не забудь добавить is3D: false в объект state в начале файла, если его там нет
};