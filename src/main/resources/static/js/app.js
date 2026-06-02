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
        fullAccess: "✅ Доступно для колясок", partialAccess: "🤝 Кнопка вызова", noAccess: "❌ Ступени (Нужна помощь)"
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
        fullAccess: "✅ Доступно для візків", partialAccess: "🤝 Кнопка виклику", noAccess: "❌ Сходинки (Потрібна допомога)"
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
        fullAccess: "✅ Арбаларға қолжетімді", partialAccess: "🤝 Шақыру батырмасы", noAccess: "❌ Баспалдақ (Көмек керек)"
    }
};

// === БАЗА ДАННЫХ (Fallback) ===
let placesDB = [
    { id: 1, name: "MEGA Alma-Ata", lat: 43.2018, lng: 76.8923, category: "shop", accessLevel: "full", deafFriendly: true, desc: "ТЦ, пандусы." },
    { id: 2, name: "Magnum", lat: 43.2375, lng: 76.8875, category: "shop", accessLevel: "full", deafFriendly: true, desc: "Супермаркет." },
    { id: 3, name: "Аптека Садыхан", lat: 43.2380, lng: 76.8890, category: "pharmacy", accessLevel: "full", deafFriendly: false, desc: "Круглосуточно." },
    { id: 4, name: "Ресторан Navat", lat: 43.2420, lng: 76.9010, category: "food", accessLevel: "partial", deafFriendly: false, desc: "Кнопка вызова." }
];

// === СОСТОЯНИЕ ===
let currentLang = 'ru';
let voiceEnabled = false; let is3D = false; let isGpsActive = false;
let currentProfile = 'driving-car';
let routeStartLatlng = null; let routeEndLatlng = null;
let gpsWatchId = null; let gpsMarker = null; let routeStartMarker = null; let routeEndMarker = null;
let mapPickingMode = null;

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
    applyLanguage(); // Применяем язык при старте
});

// === ЛОГИКА МУЛЬТИЯЗЫЧНОСТИ ===
function applyLanguage() {
    currentLang = document.getElementById('settingLanguage').value;
    localStorage.setItem('language', currentLang);
    const t = translations[currentLang];

    // Поиск
    document.getElementById('searchInput').placeholder = t.searchPlaceholder;

    // Табы (Лом Меню)
    document.querySelectorAll('.nav-tab, .mob-nav-item').forEach(item => {
        const target = item.getAttribute('data-target');
        const labelEl = item.querySelector('.label');
        if (target === 'panel-search') labelEl.innerText = t.tabSearch;
        if (target === 'panel-routes') labelEl.innerText = t.tabRoutes;
        if (target === 'panel-profile') labelEl.innerText = t.tabOptions;
    });

    // Опции
    document.getElementById('txtOptionsTitle').innerText = t.optionsTitle;
    document.getElementById('lblLanguage').innerText = t.lblLanguage;
    document.getElementById('lblTheme').innerText = t.lblTheme;
    document.getElementById('lblAccessibility').innerText = t.lblAccessibility;
    document.getElementById('cb-wheelchair').parentNode.querySelector('.cb-txt').innerText = t.needsWheelchair;
    document.getElementById('cb-vision').parentNode.querySelector('.cb-txt').innerText = t.needsVision;
    document.getElementById('cb-deaf').parentNode.querySelector('.cb-txt').innerText = t.needsDeaf;

    // Маршруты
    document.getElementById('txtRouteTitle').innerText = t.routeTitle;
    document.getElementById('routeStart').placeholder = t.pointA;
    // Если B пустое, ставим плейсхолдер
    if (!routeEndLatlng) document.getElementById('routeEnd').placeholder = t.кудаНажать;
    else document.getElementById('routeEnd').placeholder = t.pointB;
    document.getElementById('routeResult').querySelector('.reset-btn').innerText = t.btnReset;
    document.getElementById('routeResult').querySelector('.start-nav-btn').innerText = t.btnDrive;

    // ИИ
    document.getElementById('traffic-light-overlay').querySelector('.traffic-close').innerText = t.trafficClose;

    // Обновляем список мест (чтобы текст внутри карточек перевелся)
    window.renderPlaces();
}

// === УПРАВЛЕНИЕ UI И ШТОРКОЙ ===
function setSheetState(s) {
    if (window.innerWidth > 768) return;
    document.getElementById('sidebarContent').className = `sidebar-content state-${s}`;
}

const dragHandle = document.getElementById('dragHandle');
let startY = 0;
dragHandle.addEventListener('touchstart', e => startY = e.touches[0].clientY, {passive: true});
dragHandle.addEventListener('touchend', e => {
    let diff = startY - e.changedTouches[0].clientY;
    if (diff > 40) setSheetState('half'); else if (diff < -40) setSheetState('collapsed');
});

function openMobileMenu(targetId, el) {
    document.querySelectorAll('.mob-nav-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    document.getElementById(targetId).classList.add('active');
    setSheetState(targetId === 'panel-search' ? 'collapsed' : 'half');
}

// === БЭКЕНД И МЕСТА ===
async function fetchBackendPlaces() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/places`);
        const data = await res.json();
        if (data && data.length > 0) {
            placesDB = data.map(p => ({
                id: p.id, name: p.name, lat: p.lat || p.latitude, lng: p.lng || p.longitude,
                category: p.category || 'shop', accessLevel: p.accessLevel || 'full', deafFriendly: p.deafFriendly !== undefined ? p.deafFriendly : true,
                desc: p.desc || p.description || 'Нет описания.'
            }));
            window.renderPlaces();
        }
    } catch (e) { console.warn("Используется Fallback БД."); }
}

window.renderPlaces = function() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const isW = document.getElementById('cb-wheelchair').checked;
    const isDeaf = document.getElementById('cb-deaf').checked;
    const t = translations[currentLang];

    // Очистка
    document.getElementById('searchResultsList').innerHTML = '';

    // Фильтр
    let filtered = placesDB.filter(p => {
        let textMatch = query === '' ? true : (p.name.toLowerCase().includes(query) || p.category.includes(query));
        if(isW && p.accessLevel === 'none') return false;
        if(isDeaf && !p.deafFriendly) return false;
        return textMatch;
    });

    filtered.forEach(p => {
        let item = document.createElement('div');
        item.className = 'result-item';
        let accessText = p.accessLevel === 'full' ? t.fullAccess : (p.accessLevel === 'partial' ? t.partialAccess : t.noAccess);

        item.innerHTML = `
            <div class="result-title">${p.name}</div>
            <div class="result-desc">${p.desc}</div>
            <div style="font-size:11px; color:var(--primary); font-weight:700; margin-top:4px;">${accessText}</div>
        `;
        item.onclick = () => showPlaceDetails(p);
        document.getElementById('searchResultsList').appendChild(item);
    });
};

function showPlaceDetails(p) {
    map.flyTo({center: [p.lng, p.lat], zoom: 17});
    setSheetState('half');
    const t = translations[currentLang];
    speak(p.name + ". " + p.desc);

    document.getElementById('searchResultsList').innerHTML = `
        <div class="place-detail-card">
            <button class="close-card" onclick="window.renderPlaces(); setSheetState('collapsed');">✕</button>
            <h3>${p.name}</h3>
            <p style="color:var(--text-muted); font-size:14px; margin-bottom:15px;">${p.desc}</p>
            <button class="start-nav-btn" style="width:100%;" onclick="buildRouteTo(${p.lat}, ${p.lng}, '${p.name}')">${t.btnRouteHere}</button>
        </div>
    `;
}

// === ЛОГИКА МАРШРУТОВ (Обновлено под новый реверс) ===
function swapRoutePoints() {
    if(!routeStartLatlng || !routeEndLatlng) return;

    // Меняем координаты
    let temp = routeStartLatlng; routeStartLatlng = routeEndLatlng; routeEndLatlng = temp;

    // Меняем текст в инпутах
    let startVal = document.getElementById('routeStart').value;
    let endVal = document.getElementById('routeEnd').value;
    document.getElementById('routeStart').value = endVal;
    document.getElementById('routeEnd').value = startVal;

    // Двигаем маркеры на карте
    if(routeStartMarker) routeStartMarker.setLngLat(routeStartLatlng);
    if(routeEndMarker) routeEndMarker.setLngLat(routeEndLatlng);

    calculateRoute();
}

// Вспомогательная функция очистки точки
window.clearRoutePoint = function(type) {
    const t = translations[currentLang];
    if (type === 'start') {
        routeStartLatlng = null;
        document.getElementById('routeStart').value = '';
        if(routeStartMarker) routeStartMarker.remove();
    } else {
        routeEndLatlng = null;
        document.getElementById('routeEnd').value = '';
        document.getElementById('routeEnd').placeholder = t.кудаНажать;
        if(routeEndMarker) routeEndMarker.remove();
    }
    document.getElementById('routeResult').style.display = 'none';
    map.getSource('route').setData({ "type": "FeatureCollection", "features": [] });
};

// ... (остальные функции calcRoute, fitBounds, fitRoute и т.д. остаются без изменений) ...

// === УТИЛИТЫ (GPS, Голос, Опции) ===
function toast(msgKey) {
    const msg = translations[currentLang][msgKey];
    const c = document.getElementById('toast-container'); const t = document.createElement('div'); t.className = 'toast'; t.innerText = msg; c.appendChild(t); setTimeout(() => t.remove(), 3000);
}

function loadUserSettings() {
    // Язык
    const savedLang = localStorage.getItem('language') || 'ru';
    document.getElementById('settingLanguage').value = savedLang;

    // Тема
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.getElementById('settingTheme').value = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Чекбоксы
    if(localStorage.getItem('wheelchair') === 'true') document.getElementById('cb-wheelchair').checked = true;
    if(localStorage.getItem('vision') === 'true') document.getElementById('cb-vision').checked = true;
    if(localStorage.getItem('deaf') === 'true') document.getElementById('cb-deaf').checked = true;
}

// ... (остальные функции GPS, Камеры ИИ остаются прежними) ...