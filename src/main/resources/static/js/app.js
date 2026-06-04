// === КОНФИГУРАЦИЯ И КЛЮЧИ ===
const MAPTILER_KEY = '8Wl8NVdgQf24Ak9zxDl7';
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFjYjgxNzIyY2I0ZDRiZmY5NDE3MWRiZGQ4N2QxMjZlIiwiaCI6Im11cm11cjY0In0=';
const BACKEND_URL = window.location.origin;

const translations = {
    ru: {
        searchPlaceholder: "Поиск мест...", optionsTitle: "Опции", routeTitle: "Построить маршрут",
        tabSearch: "Поиск", tabRoutes: "Маршрут", tabOptions: "Опции",
        lblLanguage: "Язык интерфейса", lblTheme: "Тема и стиль", lblAccessibility: "Специальные возможности",
        lblNotifications: "Уведомления", txtToasts: "Всплывающие подсказки", // Новые строки
        needsWheelchair: "Для маломобильных", needsVision: "Для слабовидящих", needsDeaf: "Для слабослышащих",
        pointA: "Точка А", pointB: "Точка Б", кудаНажать: "Куда (Нажмите на карту)",
        btnRouteHere: "Маршрут сюда", btnDrive: "В путь", btnReset: "Сброс",
        toastGPS: "Ищу GPS...", toastGPSFound: "Спутники найдены!", toastVoiceOn: "Голос включен", toastVoiceOff: "Голос выключен",
        trafficWait: "Наведите камеру на дорогу...", trafficFound: "СВЕТОФОР!", trafficScan: "Радар включен", trafficClose: "Закрыть",
        fullAccess: "✅ Доступно", partialAccess: "🤝 Кнопка вызова", noAccess: "❌ Ступени",
        routeError: "Ошибка маршрута", noPlaces: "Ничего не найдено"
    },
    en: {
        searchPlaceholder: "Search places...", optionsTitle: "Options", routeTitle: "Route",
        tabSearch: "Search", tabRoutes: "Route", tabOptions: "Options",
        lblLanguage: "Language", lblTheme: "Theme", lblAccessibility: "Accessibility features",
        lblNotifications: "Notifications", txtToasts: "Popup hints", // Новые строки
        needsWheelchair: "Wheelchair access", needsVision: "Vision assistant", needsDeaf: "Hearing assistant",
        pointA: "Point A", pointB: "Point B", кудаНажать: "Where to (Tap map)",
        btnRouteHere: "Route here", btnDrive: "Start", btnReset: "Reset",
        toastGPS: "Searching GPS...", toastGPSFound: "GPS found!", toastVoiceOn: "Voice ON", toastVoiceOff: "Voice OFF",
        trafficWait: "Point camera at road...", trafficFound: "TRAFFIC LIGHT!", trafficScan: "Radar ON", trafficClose: "Close",
        fullAccess: "✅ Accessible", partialAccess: "🤝 Call button", noAccess: "❌ Stairs",
        routeError: "Route error", noPlaces: "Nothing found"
    },
    kz: {
        searchPlaceholder: "Орындарды іздеу...", optionsTitle: "Баптаулар", routeTitle: "Маршрут салу",
        tabSearch: "Іздеу", tabRoutes: "Маршрут", tabOptions: "Баптаулар",
        lblLanguage: "Интерфейс тілі", lblTheme: "Тақырып", lblAccessibility: "Арнайы мүмкіндіктер",
        lblNotifications: "Хабарландырулар", txtToasts: "Қалқымалы кеңестер", // Новые строки
        needsWheelchair: "Қозғалысы шектеулі жандарға", needsVision: "Нашар көретіндерге", needsDeaf: "Нашар еститіндерге",
        pointA: "A нүктесі", pointB: "Б нүктесі", кудаНажать: "Қайда (Картаға басыңыз)",
        btnRouteHere: "Маршрут осында", btnDrive: "Кеттік", btnReset: "Тастау",
        toastGPS: "GPS іздеу...", toastGPSFound: "Спутниктер табылды!", toastVoiceOn: "Дауыс қосылды", toastVoiceOff: "Дауыс өшірілді",
        trafficWait: "Камераны жолға бағыттаңыз...", trafficFound: "БАҒДАРШАМ!", trafficScan: "Радар қосылды", trafficClose: "Жабу",
        fullAccess: "✅ Қолжетімді", partialAccess: "🤝 Шақыру батырмасы", noAccess: "❌ Баспалдақ",
        routeError: "Маршрут қатесі", noPlaces: "Ештеңе табылмады"
    }
};

// === БАЗА ДАННЫХ ===
let placesDB = [
    { id: 1, name: "MEGA Alma-Ata", lat: 43.2018, lng: 76.8923, category: "shop", accessLevel: "full", deafFriendly: true, desc: "Крупный торговый центр." },
    { id: 2, name: "Magnum Cash & Carry", lat: 43.2375, lng: 76.8875, category: "shop", accessLevel: "full", deafFriendly: true, desc: "Продуктовый супермаркет." },
    { id: 3, name: "Аптека Садыхан", lat: 43.2380, lng: 76.8890, category: "pharmacy", accessLevel: "full", deafFriendly: false, desc: "Круглосуточная аптека." },
    { id: 4, name: "Ресторан Navat", lat: 43.2420, lng: 76.9010, category: "food", accessLevel: "partial", deafFriendly: true, desc: "Восточная кухня." }
];

// === СОСТОЯНИЕ ===
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
    window.loadUserSettings();
    fetchBackendPlaces();
    window.applyLanguage();
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
        const lblNotif = document.getElementById('lblNotifications'); if(lblNotif) lblNotif.innerText = t.lblNotifications;
        const txtT = document.getElementById('txtToasts'); if(txtT) txtT.innerText = t.txtToasts;
        if (target === 'panel-search' && labelEl) labelEl.innerText = t.tabSearch;
        if (target === 'panel-routes' && labelEl) labelEl.innerText = t.tabRoutes;
        if (target === 'panel-profile' && labelEl) labelEl.innerText = t.tabOptions;

    });

    const txtOptionsTitle = document.getElementById('txtOptionsTitle'); if(txtOptionsTitle) txtOptionsTitle.innerText = t.optionsTitle;
    const lblLang = document.getElementById('lblLanguage'); if(lblLang) lblLang.innerText = t.lblLanguage;
    const lblTheme = document.getElementById('lblTheme'); if(lblTheme) lblTheme.innerText = t.lblTheme;
    const lblAcc = document.getElementById('lblAccessibility'); if(lblAcc) lblAcc.innerText = t.lblAccessibility;

    const tw = document.getElementById('txtWheelchair'); if(tw) tw.innerText = t.needsWheelchair;
    const tv = document.getElementById('txtVision'); if(tv) tv.innerText = t.needsVision;
    const td = document.getElementById('txtDeaf'); if(td) td.innerText = t.needsDeaf;

    const routeTitle = document.getElementById('txtRouteTitle'); if(routeTitle) routeTitle.innerText = t.routeTitle;
    const routeStart = document.getElementById('routeStart'); if(routeStart) routeStart.placeholder = t.pointA;

    const routeEnd = document.getElementById('routeEnd');
    if(routeEnd) {
        if (!state.routeLatLangs.end) routeEnd.placeholder = t.кудаНажать;
        else routeEnd.placeholder = t.pointB;
    }

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
        if (diff > 40) window.setSheetState(sheet.classList.contains('state-collapsed') ? 'half' : 'full');
        else if (diff < -40) window.setSheetState(sheet.classList.contains('state-full') ? 'half' : 'collapsed');
    });
}

document.querySelectorAll('.nav-tab').forEach(el => {
    el.addEventListener('click', () => {
        const target = el.getAttribute('data-target');
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        document.getElementById(target).classList.add('active');
        window.setSheetState(target === 'panel-search' ? 'collapsed' : 'half');
    });
});

document.getElementById('searchInput').addEventListener('input', () => window.renderPlaces());

window.openMobileMenu = function(targetId, el) {
    document.querySelectorAll('.mob-nav-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    document.getElementById(targetId).classList.add('active');
    window.setSheetState(targetId === 'panel-search' ? 'collapsed' : 'half');
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
    window.setSheetState('half');
};

// === ТОЧЕЧНАЯ ИНВЕРТИРОВАННАЯ ФИЛЬТРАЦИЯ ===
window.renderPlaces = function() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();

    // Читаем ТОЛЬКО под-опции, отвечающие за поиск
    const cbWheelchairSearch = document.getElementById('cb-wheelchair-search');
    const cbDeafSearch = document.getElementById('cb-deaf-search');
    const filterWheelchair = cbWheelchairSearch ? cbWheelchairSearch.checked : false;
    const filterDeaf = cbDeafSearch ? cbDeafSearch.checked : false;
    const t = translations[currentLang];

    const list = document.getElementById('searchResultsList');
    list.innerHTML = '';
    state.markers.places.forEach(m => m.remove());
    state.markers.places = [];

    // Применяем фильтры
    let filtered = placesDB.filter(p => {
        let textMatch = query === '' ? true : (p.name.toLowerCase().includes(query) || p.category.includes(query) || (p.desc && p.desc.toLowerCase().includes(query)));

        // Жесткая отбраковка
        if(filterWheelchair && p.accessLevel === 'none') return false;
        if(filterDeaf && !p.deafFriendly) return false;

        return textMatch;
    });

    if (filtered.length === 0 && query !== '') {
        list.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:15px;">${t.noPlaces}</p>`;
        return;
    }

    // Рендеринг
    filtered.forEach(p => {
        if (!p.lat || !p.lng || isNaN(p.lat) || isNaN(p.lng)) return;

        let item = document.createElement('div');
        item.className = 'result-item';
        let accessText = p.accessLevel === 'full' ? t.fullAccess : (p.accessLevel === 'partial' ? t.partialAccess : t.noAccess);

        item.innerHTML = `
            <div class="result-title">${p.name}</div>
            <div class="result-desc">${p.desc || ''}</div>
            <div style="font-size:11px; color:var(--primary); font-weight:700; margin-top:4px;">${accessText} ${p.deafFriendly ? '| 🧏 Адаптировано' : ''}</div>
        `;
        item.onclick = () => window.showPlaceDetails(p);
        list.appendChild(item);

        let mEl = document.createElement('div'); mEl.className = 'custom-icon-wrapper';
        mEl.style.background = p.accessLevel === 'none' ? '#ff3b30' : (p.accessLevel === 'partial' ? '#ff9500' : '#34c759');
        mEl.innerHTML = p.category === 'pharmacy' ? '💊' : (p.category === 'food' ? '🍽️' : '📍');
        mEl.onclick = (e) => { e.stopPropagation(); window.showPlaceDetails(p); };

        state.markers.places.push(new maplibregl.Marker(mEl).setLngLat([p.lng, p.lat]).addTo(map));
    });
};

window.showPlaceDetails = function(p) {
    map.flyTo({center: [p.lng, p.lat], zoom: 17});
    window.setSheetState('half');
    const t = translations[currentLang];
    window.speak(p.name + ". " + p.desc);

    document.getElementById('searchResultsList').innerHTML = `
        <div class="place-detail-card">
            <button class="close-card" onclick="window.renderPlaces(); window.setSheetState('collapsed');">✕</button>
            <h3>${p.name}</h3>
            <p style="color:var(--text-muted); font-size:14px; margin-bottom:15px;">${p.desc}</p>
            <button class="start-nav-btn" style="width:100%;" onclick="window.buildRouteTo(${p.lat}, ${p.lng}, '${p.name.replace(/'/g, "\\'")}')">${t.btnRouteHere}</button>
        </div>
    `;
};

// === МАРШРУТЫ ===
window.startPickingMode = function(type) {
    state.picking = type; window.setSheetState('collapsed');
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
    if(state.isMobile) window.openMobileMenu('panel-routes', document.querySelectorAll('.mob-nav-item')[1]);
    else document.querySelector(`.nav-tab[data-target="panel-routes"]`).click();
    window.calculateRoute();
});

window.swapRoutePoints = function() {
    if(!state.routeLatLangs.start || !state.routeLatLangs.end) return;
    let temp = state.routeLatLangs.start; state.routeLatLangs.start = state.routeLatLangs.end; state.routeLatLangs.end = temp;
    let tVal = document.getElementById('routeStart').value; document.getElementById('routeStart').value = document.getElementById('routeEnd').value; document.getElementById('routeEnd').value = tVal;
    if(state.markers.start) state.markers.start.setLngLat(state.routeLatLangs.start);
    if(state.markers.end) state.markers.end.setLngLat(state.routeLatLangs.end);
    window.calculateRoute();
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
    if(state.isMobile) window.openMobileMenu('panel-routes', document.querySelectorAll('.mob-nav-item')[1]);
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
    window.calculateRoute();
};

window.setMode = function(mode, el) {
    state.mode = mode;
    document.querySelectorAll('.r-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    window.calculateRoute();
};

window.calculateRoute = async function() {
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
    } catch(e) { window.toast('routeError'); }
};

window.toast = function(msgKey, isRaw = false) {
    // Если галочка "Всплывающие подсказки" снята — глушим все тосты
    const cbToasts = document.getElementById('cb-toasts');
    if (cbToasts && !cbToasts.checked) return;

    const msg = isRaw ? msgKey : translations[currentLang][msgKey];
    if(!msg) return;
    const c = document.getElementById('toast-container'); const t = document.createElement('div'); t.className = 'toast'; t.innerText = msg; c.appendChild(t); setTimeout(() => t.remove(), 3000);
};

window.speak = function(text) {
    window.speechSynthesis.cancel();
    const voiceCb = document.getElementById('cb-vision-voice');
    const isVoiceEnabled = voiceCb ? voiceCb.checked : false;

    if (state.voice || isVoiceEnabled) {
        let u = new SpeechSynthesisUtterance(text);
        u.lang = currentLang === 'ru' ? 'ru-RU' : (currentLang === 'en' ? 'en-US' : 'kk-KZ');
        window.speechSynthesis.speak(u);
    }
};

window.toggleVoice = function() {
    state.voice = !state.voice;
    document.getElementById('voiceBtn').style.color = state.voice ? "var(--primary)" : "var(--text-main)";
    window.toast(state.voice ? 'toastVoiceOn' : 'toastVoiceOff');
};

window.toggleGPS = function() {
    if (state.gpsActive && state.markers.gps) {
        map.flyTo({center: state.markers.gps.getLngLat(), zoom: 18, pitch: 45});
        return;
    }
    if ("geolocation" in navigator) {
        document.getElementById('gpsBtn').style.color = "var(--primary)"; state.gpsActive = true; window.toast('toastGPS');
        navigator.geolocation.watchPosition(pos => {
            const coords = [pos.coords.longitude, pos.coords.latitude];
            if (!state.markers.gps) {
                let el = document.createElement('div'); el.className = 'gps-pulse';
                state.markers.gps = new maplibregl.Marker({element: el}).setLngLat(coords).addTo(map);
                map.flyTo({center: coords, zoom: 18, pitch: 45});
                window.toast('toastGPSFound');
            } else { state.markers.gps.setLngLat(coords); }
        }, null, { enableHighAccuracy: true });
    }
};

window.toggleMap3D = function() {
    state.is3D = !state.is3D;
    map.easeTo({ pitch: state.is3D ? 60 : 0, bearing: state.is3D ? -20 : 0 });
    document.getElementById('btn3D').style.color = state.is3D ? "var(--primary)" : "var(--text-main)";
};

// === НАСТРОЙКИ ===
window.toggleNeed = function(type) {
    const mainCb = document.getElementById(`cb-${type}-main`);
    if(!mainCb) return;
    const isMainChecked = mainCb.checked;
    const wrapper = document.getElementById(`wrap-${type}`);

    if (isMainChecked) {
        if(wrapper) wrapper.classList.add('expanded');
        document.querySelectorAll(`#wrap-${type} .need-sub-options input`).forEach(cb => cb.checked = true);
    } else {
        if(wrapper) wrapper.classList.remove('expanded');
        document.querySelectorAll(`#wrap-${type} .need-sub-options input`).forEach(cb => cb.checked = false);
    }
    window.saveUserSettings();
};

window.saveUserSettings = function() {
    const keys = [
        'wheelchair-main', 'wheelchair-search', 'wheelchair-route',
        'vision-main', 'vision-voice',
        'deaf-main', 'deaf-search'
    ];

    keys.forEach(k => {
        const el = document.getElementById('cb-'+k);
        if(el) localStorage.setItem(k, el.checked);
    });

    // Сохраняем состояние подсказок
    const cbToasts = document.getElementById('cb-toasts');
    if (cbToasts) localStorage.setItem('toasts', cbToasts.checked);

    // Скрываем/Показываем вкладку инвалидной коляски
    const tabW = document.getElementById('tabWheelchair');
    const routeCb = document.getElementById('cb-wheelchair-route');
    if (tabW && routeCb) tabW.style.display = routeCb.checked ? 'block' : 'none';

    // Скрываем/Показываем Робота и Голос на карте
    const isVision = document.getElementById('cb-vision-main') ? document.getElementById('cb-vision-main').checked : false;
    const aiBtn = document.getElementById('aiBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    if (aiBtn) aiBtn.style.display = isVision ? 'flex' : 'none';
    if (voiceBtn) voiceBtn.style.display = isVision ? 'flex' : 'none';

    window.renderPlaces();
};

window.loadUserSettings = function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.getElementById('settingTheme').value = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Загружаем тосты (включены по умолчанию)
    const savedToasts = localStorage.getItem('toasts');
    const cbToasts = document.getElementById('cb-toasts');
    if (cbToasts) cbToasts.checked = savedToasts !== 'false';

    const keys = [
        'wheelchair-main', 'wheelchair-search', 'wheelchair-route',
        'vision-main', 'vision-voice',
        'deaf-main', 'deaf-search'
    ];

    keys.forEach(k => {
        const savedVal = localStorage.getItem(k);
        const cb = document.getElementById('cb-'+k);
        if(!cb) return;

        cb.checked = (savedVal === 'true');

        if (k.endsWith('-main') && cb.checked) {
            const wrapper = document.getElementById(`wrap-${k.split('-')[0]}`);
            if(wrapper) wrapper.classList.add('expanded');
        }
    });

    const tabW = document.getElementById('tabWheelchair');
    if (tabW) tabW.style.display = localStorage.getItem('wheelchair-route') === 'true' ? 'block' : 'none';

    // Скрываем/Показываем кнопки на старте
    const isVision = localStorage.getItem('vision-main') === 'true';
    const aiBtn = document.getElementById('aiBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    if (aiBtn) aiBtn.style.display = isVision ? 'flex' : 'none';
    if (voiceBtn) voiceBtn.style.display = isVision ? 'flex' : 'none';
};

window.applySettings = function() {
    const t = document.getElementById('settingTheme').value;
    localStorage.setItem('theme', t); document.documentElement.setAttribute('data-theme', t);
    const mapStyle = t === 'contrast' ? 'basic-v2-dark' : (t === 'dark' ? 'basic-v2-dark' : 'streets-v2');
    map.setStyle(`https://api.maptiler.com/maps/${mapStyle}/style.json?key=${MAPTILER_KEY}`);
    map.once('styledata', () => addCustomMapLayers());
};

// === ГОЛОСОВОЙ ПОИСК ===
window.startVoiceSearch = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return window.toast("Голосовой поиск не поддерживается", true);
    const recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'ru' ? 'ru-RU' : (currentLang === 'en' ? 'en-US' : 'kk-KZ');
    recognition.start();
    document.getElementById('micBtn').style.color = "#ff3b30";
    recognition.onresult = function(event) {
        document.getElementById('searchInput').value = event.results[0][0].transcript;
        window.renderPlaces();
        document.getElementById('micBtn').style.color = "var(--primary)";
    };
    recognition.onerror = () => document.getElementById('micBtn').style.color = "var(--primary)";
};

// === ИИ КАМЕРА ===
let cvInterval = null; let videoStream = null; let aiModel = null;
window.startTrafficLightAssist = async function() {
    window.toast('trafficScan');
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

// === НАВИГАТОР ===
window.startNavigatorMode = function() {
    document.getElementById('stopNavBtn').style.display = 'block';
    window.setSheetState('collapsed');
    window.toast("Навигация запущена", true);
};

window.stopNavigatorMode = function() {
    document.getElementById('stopNavBtn').style.display = 'none';
    window.toast("Навигация завершена", true);
};