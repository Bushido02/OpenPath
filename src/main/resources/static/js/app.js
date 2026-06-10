// === КОНФИГУРАЦИЯ И КЛЮЧИ ===
const MAPTILER_KEY = '8Wl8NVdgQf24Ak9zxDl7';
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFjYjgxNzIyY2I0ZDRiZmY5NDE3MWRiZGQ4N2QxMjZlIiwiaCI6Im11cm11cjY0In0=';

// Подключение Supabase
const SUPABASE_URL = 'https://idsyqzgtmtgdgcejbhhu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkc3lxemd0bXRnZGdjZWpiaGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzU0ODUsImV4cCI6MjA5NjY1MTQ4NX0.aEUb88NSfuRV8PoHjb7zXmFwdlmfRvq3uZ5FBKdBEFo';
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

let placesDB = [];

// === БЭКЕНД И МЕСТА (SUPABASE) ===
async function fetchBackendPlaces() {
    if (!supabase) {
        console.warn("Supabase не инициализирован. Используем кэш.");
        useOfflineCache();
        return;
    }
    try {
        const { data, error } = await supabase.from('places').select('*');
        if (error) throw error;

        if (data && data.length > 0) {
            placesDB = data.map(p => ({
                id: p.id, name: p.name, lat: p.lat, lng: p.lng,
                category: p.category, accessLevel: p.access_level, deafFriendly: p.deaf_friendly,
                image: p.image, hours: p.hours, desc: p.description
            }));
        } else {
            useOfflineCache();
        }
    } catch (e) {
        console.error("Ошибка загрузки БД, используем локальный кэш:", e);
        useOfflineCache();
        window.toast("Связь с сервером потеряна. Включен офлайн-режим.", true);
    } finally {
        window.renderPlaces();
    }
}

function useOfflineCache() {
    placesDB = [
        { id: 1, name: "MEGA Alma-Ata", lat: 43.2018, lng: 76.8923, category: "shop", accessLevel: "full", deafFriendly: true, image: "https://images.unsplash.com/photo-1519567241046-7f4f6b643a60?w=600&q=80", hours: "10:00 - 22:00", desc: "Крупнейший ТРЦ. Оборудован просторными лифтами и пандусами." },
        { id: 2, name: "Magnum Cash & Carry", lat: 43.2375, lng: 76.8875, category: "shop", accessLevel: "full", deafFriendly: true, image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80", hours: "Круглосуточно", desc: "Гипермаркет с широкими проходами. Вход на уровне земли." },
        { id: 3, name: "Аптека Садыхан", lat: 43.2380, lng: 76.8890, category: "pharmacy", accessLevel: "full", deafFriendly: false, image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80", hours: "Круглосуточно", desc: "Круглосуточная аптека с пандусом по ГОСТу." },
        { id: 4, name: "Ресторан Navat", lat: 43.2420, lng: 76.9010, category: "food", accessLevel: "partial", deafFriendly: true, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", hours: "11:00 - 00:00", desc: "Традиционная кухня. Есть кнопка вызова персонала и меню с картинками." }
    ];
}

// === СЛОВАРЬ ПЕРЕВОДОВ ===
const translations = {
    ru: {
        searchPlaceholder: "Поиск мест...", optionsTitle: "Опции", routeTitle: "Построить маршрут",
        tabSearch: "Поиск", tabRoutes: "Маршрут", tabOptions: "Опции",
        lblLanguage: "Язык интерфейса", lblTheme: "Тема и стиль", lblAccessibility: "Специальные возможности",
        lblNotifications: "Уведомления", txtToasts: "Всплывающие подсказки",
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
        lblNotifications: "Notifications", txtToasts: "Popup hints",
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
        lblNotifications: "Хабарландырулар", txtToasts: "Қалқымалы кеңестер",
        needsWheelchair: "Қозғалысы шектеулі жандарға", needsVision: "Нашар көретіндерге", needsDeaf: "Нашар еститіндерге",
        pointA: "A нүктесі", pointB: "Б нүктесі", кудаНажать: "Қайда (Картаға басыңыз)",
        btnRouteHere: "Маршрут осында", btnDrive: "Кеттік", btnReset: "Тастау",
        toastGPS: "GPS іздеу...", toastGPSFound: "Спутниктер табылды!", toastVoiceOn: "Дауыс қосылды", toastVoiceOff: "Дауыс өшірілді",
        trafficWait: "Камераны жолға бағыттаңыз...", trafficFound: "БАҒДАРШАМ!", trafficScan: "Радар қосылды", trafficClose: "Жабу",
        fullAccess: "✅ Қолжетімді", partialAccess: "🤝 Шақыру батырмасы", noAccess: "❌ Баспалдақ",
        routeError: "Маршрут қатесі", noPlaces: "Ештеңе табылмады"
    }
};

// === СОСТОЯНИЕ ===
let currentLang = 'ru';
let state = {
    isMobile: window.innerWidth <= 768,
    voice: false,
    gpsActive: false,
    is3D: false,
    isNavigating: false,
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
    fetchBackendPlaces(); // Вызываем загрузку данных
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
        if (target === 'panel-search' && labelEl) labelEl.innerText = t.tabSearch;
        if (target === 'panel-routes' && labelEl) labelEl.innerText = t.tabRoutes;
        if (target === 'panel-profile' && labelEl) labelEl.innerText = t.tabOptions;
    });

    const lblNotif = document.getElementById('lblNotifications'); if(lblNotif) lblNotif.innerText = t.lblNotifications;
    const txtT = document.getElementById('txtToasts'); if(txtT) txtT.innerText = t.txtToasts;
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

window.quickSearch = function(query) {
    document.getElementById('searchInput').value = query;
    window.renderPlaces();
    window.setSheetState('half');
};

// === ТОЧЕЧНАЯ ИНВЕРТИРОВАННАЯ ФИЛЬТРАЦИЯ ===
window.renderPlaces = function() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const cbWheelchairSearch = document.getElementById('cb-wheelchair-search');
    const cbDeafSearch = document.getElementById('cb-deaf-search');
    const filterWheelchair = cbWheelchairSearch ? cbWheelchairSearch.checked : false;
    const filterDeaf = cbDeafSearch ? cbDeafSearch.checked : false;
    const t = translations[currentLang];

    const list = document.getElementById('searchResultsList');
    list.innerHTML = '';
    state.markers.places.forEach(m => m.remove());
    state.markers.places = [];

    let filtered = placesDB.filter(p => {
        let textMatch = query === '' ? true : (p.name.toLowerCase().includes(query) || p.category.includes(query) || (p.desc && p.desc.toLowerCase().includes(query)));
        if(filterWheelchair && p.accessLevel === 'none') return false;
        if(filterDeaf && !p.deafFriendly) return false;
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

// === КРАСИВАЯ КАРТОЧКА ЗАВЕДЕНИЯ ===
window.showPlaceDetails = function(p) {
    map.flyTo({center: [p.lng, p.lat], zoom: 17});
    window.setSheetState('half');
    const t = translations[currentLang];
    window.speak(p.name + ". " + p.desc);

    const imgUrl = p.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80';
    const hoursText = p.hours || '09:00 - 21:00';

    const accessText = p.accessLevel === 'full' ? t.fullAccess : (p.accessLevel === 'partial' ? t.partialAccess : t.noAccess);
    const accessClass = p.accessLevel === 'none' ? 'badge-red' : (p.accessLevel === 'partial' ? 'badge-orange' : 'badge-green');
    const deafBadge = p.deafFriendly ? `<span class="badge badge-purple">🧏 Адаптировано</span>` : '';

    document.getElementById('searchResultsList').innerHTML = `
        <div class="place-detail-card">
            <button class="close-card" onclick="window.renderPlaces(); window.setSheetState('collapsed');">✕</button>
            <div class="card-cover">
                <img src="${imgUrl}" alt="${p.name}">
                <div class="card-badges">
                    <span class="badge ${accessClass}">${accessText}</span>
                    ${deafBadge}
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${p.name}</h3>
                <div class="card-meta">🕒 ${hoursText}</div>
                <p class="card-desc">${p.desc || 'Описание отсутствует.'}</p>
                <button class="start-nav-btn" onclick="window.buildRouteTo(${p.lat}, ${p.lng}, '${p.name.replace(/'/g, "\\'")}')">${t.btnRouteHere}</button>
            </div>
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

// === ЖИВОЙ GPS И СЛЕЖЕНИЕ ===
window.toggleGPS = function() {
    if (state.gpsActive && state.markers.gps && !state.isNavigating) {
        map.flyTo({center: state.markers.gps.getLngLat(), zoom: 18, pitch: 45});
        return;
    }
    if ("geolocation" in navigator) {
        document.getElementById('gpsBtn').style.color = "var(--primary)";
        state.gpsActive = true;
        window.toast('toastGPS');
        navigator.geolocation.watchPosition(pos => {
            const coords = [pos.coords.longitude, pos.coords.latitude];
            const heading = pos.coords.heading || 0;
            if (!state.markers.gps) {
                let el = document.createElement('div'); el.className = 'gps-pulse';
                state.markers.gps = new maplibregl.Marker({element: el}).setLngLat(coords).addTo(map);
                window.toast('toastGPSFound');
            } else {
                state.markers.gps.setLngLat(coords);
            }
            if (state.isNavigating) {
                map.easeTo({ center: coords, bearing: heading, pitch: 60, duration: 1000 });
            } else if (!state.markers.gps) {
                map.flyTo({center: coords, zoom: 18, pitch: 45});
            }
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
    const wrapper = document.getElementById(`wrap-${type}`);
    if (mainCb.checked) {
        if(wrapper) wrapper.classList.add('expanded');
        document.querySelectorAll(`#wrap-${type} .need-sub-options input`).forEach(cb => cb.checked = true);
    } else {
        if(wrapper) wrapper.classList.remove('expanded');
        document.querySelectorAll(`#wrap-${type} .need-sub-options input`).forEach(cb => cb.checked = false);
    }
    window.saveUserSettings();
};

window.saveUserSettings = function() {
    ['wheelchair-main', 'wheelchair-search', 'wheelchair-route', 'vision-main', 'vision-voice', 'deaf-main', 'deaf-search'].forEach(k => {
        const el = document.getElementById('cb-'+k);
        if(el) localStorage.setItem(k, el.checked);
    });
    const cbToasts = document.getElementById('cb-toasts');
    if (cbToasts) localStorage.setItem('toasts', cbToasts.checked);
    const tabW = document.getElementById('tabWheelchair');
    const routeCb = document.getElementById('cb-wheelchair-route');
    if (tabW && routeCb) tabW.style.display = routeCb.checked ? 'block' : 'none';
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
    const savedToasts = localStorage.getItem('toasts');
    const cbToasts = document.getElementById('cb-toasts');
    if (cbToasts) cbToasts.checked = savedToasts !== 'false';
    ['wheelchair-main', 'wheelchair-search', 'wheelchair-route', 'vision-main', 'vision-voice', 'deaf-main', 'deaf-search'].forEach(k => {
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
    if (!state.routeLatLangs.start || !state.routeLatLangs.end) {
        window.toast("Сначала постройте маршрут", true); return;
    }
    state.isNavigating = true;
    document.getElementById('sidebarContent').style.display = 'none';
    const bottomNav = document.querySelector('.mobile-bottom-nav');
    if (bottomNav) bottomNav.style.display = 'none';
    document.getElementById('stopNavBtn').style.display = 'block';
    if (!state.gpsActive) window.toggleGPS();
    window.speak(translations[currentLang].btnDrive);
};

window.stopNavigatorMode = function() {
    state.isNavigating = false;
    document.getElementById('sidebarContent').style.display = 'flex';
    const bottomNav = document.querySelector('.mobile-bottom-nav');
    if (bottomNav) bottomNav.style.display = 'flex';
    document.getElementById('stopNavBtn').style.display = 'none';
    map.easeTo({ pitch: 0, bearing: 0 });
    window.clearRoute();
};