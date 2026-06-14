(function () {
    'use strict';

    // ============================================
    // UKRAINIAN PATRIOTIC PLUGIN FOR LAMPA.MX
    // ============================================
    
    const PLUGIN_VERSION = '1.0.0';
    const PLUGIN_NAME = 'Патріотичний Український Плагін';
    
    // Налаштування
    const CONFIG = {
        filterRussianContent: true,      // Фільтрувати російський контент
        patrioticUI: true,               // Патріотичний візуал
        replaceTexts: true,              // Заміна текстів на українські
        showPatrioticMessages: true,     // Показувати патріотичні повідомлення
        forcedUkrainianDubbing: false,   // Пріоритет українського дубляжу
        blockRuDomains: true,            // Блокувати російські домени
        showTridentAnimation: true       // Анімація тризуба
    };

    // Кольорова схема (синьо-жовта)
    const COLORS = {
        primary: '#0057B7',      // Синій
        secondary: '#FFD700',    // Жовтий
        accent: '#FF6600',       // Помаранчевий (акцент)
        background: '#001133',   // Темно-синій фон
        text: '#FFFFFF',         // Білий текст
        success: '#2ECC71',      // Зелений
        warning: '#F39C12'       // Жовтогарячий
    };

    // Патріотичні повідомлення
    const PATRIOTIC_MESSAGES = [
        '💙💛 Слава Україні!',
        '🇺🇦 Героям слава! 🇺🇦',
        '💪 Україна понад усе!',
        '🎵 Ой у лузі червона калина...',
        '🛡️ Смерть ворогам!',
        '🌻 Україна - це Європа!',
        '🏆 Наш дім - Україна!',
        '⚡ Разом до перемоги!',
        '💙💛 Соборна Україна',
        '🇺🇦 Вільні люди - вільної країни'
    ];

    // Слова для заміни в інтерфейсі
    const TEXT_REPLACEMENTS = {
        'Новинки': '🌾 Свіженьке',
        'Фільми': '🎬 Кінострічки',
        'Серіали': '📺 Серіальчики',
        'Мультфільми': '🎨 Мультяшки',
        'Пошук': '🔍 Шукати',
        'Налаштування': '⚙️ Смаколики',
        'Вийти': '🚪 Вийти',
        'Завантажити': '📥 Завантажити',
        'Дивитися': '▶️ Дивитись',
        'В обране': '💙 В обране',
        'Рейтинг': '⭐ Рейтинг',
        'Рік': '📅 Рік',
        'Жанр': '🎭 Жанр',
        'Країна': '🌍 Країна',
        'Актори': '🎭 Актори',
        'Режисер': '🎬 Режисер'
    };

    // Список російських країн та кодів для фільтрації
    const RUSSIAN_COUNTRIES = [
        'росія', 'російська федерація', 'російська', 'russia', 'russian federation',
        'russian', 'cccp', 'soviet union', 'ссср', 'радянський союз'
    ];

    const RUSSIAN_DOMAINS = [
        '.ru', '.su', 'russia', 'kremlin', 'mosfilm', 'russianfilm'
    ];

    let initialized = false;
    let styleElement = null;
    let messageInterval = null;

    // ============================================
    // ФУНКЦІЇ ДЛЯ РОБОТИ З CSS
    // ============================================
    
    function addPatrioticStyles() {
        if (!CONFIG.patrioticUI) return;
        
        if (styleElement) styleElement.remove();
        
        styleElement = document.createElement('style');
        styleElement.id = 'patriotic-plugin-styles';
        styleElement.textContent = `
            /* Основний патріотичний стиль */
            body {
                background: linear-gradient(135deg, ${COLORS.background} 0%, #002244 100%) !important;
            }
            
            /* Шапка з українським прапором */
            .header__content {
                background: linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.primary} 50%, ${COLORS.secondary} 50%, ${COLORS.secondary} 100%) !important;
                border-bottom: 3px solid ${COLORS.accent} !important;
            }
            
            /* Патріотичні кнопки */
            .button, .btn, .selector__button {
                background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary}) !important;
                color: ${COLORS.text} !important;
                border: none !important;
                transition: transform 0.3s ease !important;
            }
            
            .button:hover, .btn:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 0 15px ${COLORS.secondary} !important;
            }
            
            /* Карточки фільмів */
            .movie-item, .serial-item, .movie-card {
                border: 2px solid ${COLORS.secondary} !important;
                border-radius: 15px !important;
                background: linear-gradient(135deg, rgba(0,87,183,0.9), rgba(0,34,68,0.9)) !important;
                transition: all 0.3s ease !important;
            }
            
            .movie-item:hover {
                transform: translateY(-10px) !important;
                box-shadow: 0 10px 30px ${COLORS.secondary} !important;
                border-color: ${COLORS.accent} !important;
            }
            
            /* Тризуб у кутку */
            .patriotic-trident {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${COLORS.secondary.replace('#', '%23')}"><path d="M12 2L15 8H9L12 2Z M12 8V22 M10 13L12 15L14 13"/></svg>') no-repeat center;
                background-size: contain;
                opacity: 0.7;
                z-index: 9999;
                cursor: pointer;
                transition: all 0.3s ease;
                animation: pulse 2s infinite;
            }
            
            .patriotic-trident:hover {
                opacity: 1;
                transform: scale(1.2);
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            /* Український прапор на карточках */
            .movie-card::before {
                content: "🇺🇦";
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 24px;
                z-index: 10;
                text-shadow: 0 0 5px black;
            }
            
            /* Повідомлення */
            .patriotic-message {
                position: fixed;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary});
                color: ${COLORS.text};
                padding: 15px 30px;
                border-radius: 50px;
                font-weight: bold;
                z-index: 10000;
                animation: slideDown 0.5s ease, fadeOut 3s ease 2s forwards;
                pointer-events: none;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            }
            
            @keyframes slideDown {
                from {
                    top: -100px;
                    opacity: 0;
                }
                to {
                    top: 20%;
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                to {
                    opacity: 0;
                    visibility: hidden;
                }
            }
            
            /* Фільтр для російського контенту */
            .russian-content-filtered {
                display: none !important;
                visibility: hidden !important;
            }
        `;
        
        document.head.appendChild(styleElement);
    }
    
    // ============================================
    // ФУНКЦІЇ ДЛЯ ФІЛЬТРАЦІЇ
    // ============================================
    
    function isRussianContent(item) {
        if (!CONFIG.filterRussianContent) return false;
        
        // Перевірка країни
        if (item.country) {
            const countryLower = item.country.toLowerCase();
            if (RUSSIAN_COUNTRIES.some(ru => countryLower.includes(ru))) {
                return true;
            }
        }
        
        // Перевірка оригінальної назви
        if (item.original_title || item.original_name) {
            const original = (item.original_title || item.original_name || '').toLowerCase();
            if (original.includes('russian') || original.includes('russia')) {
                return true;
            }
        }
        
        // Перевірка студій
        if (item.production_companies) {
            const companies = item.production_companies.toLowerCase();
            if (RUSSIAN_DOMAINS.some(domain => companies.includes(domain))) {
                return true;
            }
        }
        
        return false;
    }
    
    function filterRussianContentFromList(items, container) {
        if (!CONFIG.filterRussianContent) return items;
        
        const filtered = items.filter(item => !isRussianContent(item));
        
        // Додаємо повідомлення про кількість відфільтрованого контенту
        const filteredCount = items.length - filtered.length;
        if (filteredCount > 0 && CONFIG.showPatrioticMessages) {
            setTimeout(() => {
                showPatrioticMessage(`🧹 Відфільтровано ${filteredCount} російських кінопродуктів! Слава Україні! 💙💛`);
            }, 1000);
        }
        
        return filtered;
    }
    
    function blockRussianDomains(url) {
        if (!CONFIG.blockRuDomains) return url;
        
        if (RUSSIAN_DOMAINS.some(domain => url.toLowerCase().includes(domain))) {
            showPatrioticMessage('🚫 Заблоковано російський ресурс! 🇺🇦');
            return null;
        }
        return url;
    }
    
    // ============================================
    // ФУНКЦІЇ ДЛЯ ВІЗУАЛУ
    // ============================================
    
    function showPatrioticMessage(message) {
        if (!CONFIG.showPatrioticMessages) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = 'patriotic-message';
        msgDiv.textContent = message || PATRIOTIC_MESSAGES[Math.floor(Math.random() * PATRIOTIC_MESSAGES.length)];
        document.body.appendChild(msgDiv);
        
        setTimeout(() => {
            if (msgDiv.parentNode) msgDiv.parentNode.removeChild(msgDiv);
        }, 5000);
    }
    
    function addTridentAnimation() {
        if (!CONFIG.showTridentAnimation) return;
        
        const trident = document.createElement('div');
        trident.className = 'patriotic-trident';
        trident.title = 'Слава Україні! 🇺🇦';
        trident.onclick = () => {
            showPatrioticMessage('💙💛 Героям слава! 💙💛');
            playUkrainianAnthem();
        };
        document.body.appendChild(trident);
    }
    
    function playUkrainianAnthem() {
        // Відтворення Державного Гімну України (коротка версія)
        const audio = new Audio('https://raw.githubusercontent.com/patriotic-ukraine/anthem/main/shche-ne-vmerla-ukrainy-short.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // ============================================
    // ФУНКЦІЇ ДЛЯ ЗАМІНИ ТЕКСТІВ
    // ============================================
    
    function replaceUITexts() {
        if (!CONFIG.replaceTexts) return;
        
        const observer = new MutationObserver(() => {
            document.querySelectorAll('*').forEach(element => {
                if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
                    let text = element.textContent;
                    let changed = false;
                    
                    Object.entries(TEXT_REPLACEMENTS).forEach(([search, replace]) => {
                        if (text.includes(search)) {
                            text = text.replace(new RegExp(search, 'g'), replace);
                            changed = true;
                        }
                    });
                    
                    if (changed) {
                        element.textContent = text;
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    // ============================================
    // ФУНКЦІЇ ДЛЯ ПРІОРИТЕТУ УКРАЇНСЬКОГО ДУБЛЯЖУ
    // ============================================
    
    function prioritizeUkrainianDubbing(player) {
        if (!CONFIG.forcedUkrainianDubbing) return;
        
        // Шукаємо українські доріжки
        if (player && player.tracks && player.tracks.audio) {
            const ukrTrack = player.tracks.audio.find(track => 
                track.language === 'uk' || 
                track.name?.toLowerCase().includes('україн') ||
                track.name?.toLowerCase().includes('ukrainian')
            );
            
            if (ukrTrack) {
                player.setAudioTrack(ukrTrack.id);
                showPatrioticMessage('🎧 Українська доріжка обрана! 💙💛');
            }
        }
    }
    
    // ============================================
    // ФУНКЦІЇ ДЛЯ API LAMPA
    // ============================================
    
    function patchLampaAPI() {
        // Перехоплюємо запити до API для фільтрації
        if (window.Lampa && Lampa.Api) {
            const originalRequest = Lampa.Api.request;
            
            Lampa.Api.request = function(url, callback, errorCallback, options) {
                const filteredUrl = blockRussianDomains(url);
                if (!filteredUrl) {
                    if (errorCallback) errorCallback('Blocked by patriotic plugin');
                    return;
                }
                
                originalRequest.call(this, filteredUrl, (data) => {
                    // Фільтруємо результати
                    if (data && data.results) {
                        data.results = filterRussianContentFromList(data.results);
                    }
                    if (callback) callback(data);
                }, errorCallback, options);
            };
        }
    }
    
    function patchContentRows() {
        if (!window.Lampa || !Lampa.ContentRows) return;
        
        const originalAdd = Lampa.ContentRows.add;
        Lampa.ContentRows.add = function(row) {
            // Додаємо патріотичний рядок
            if (row.screen && row.screen.includes('main')) {
                const patrioticRow = {
                    name: 'patriotic_ukraine_row',
                    title: '🇺🇦 Патріотична добірка 🇺🇦',
                    screen: ['main'],
                    index: 0,
                    call: function(params, screen) {
                        return function(call) {
                            call({
                                title: '💙💛 Український кінематограф',
                                url: 'patriotic_collection',
                                source: 'tmdb',
                                results: []
                            });
                        };
                    }
                };
                originalAdd.call(this, patrioticRow);
            }
            return originalAdd.call(this, row);
        };
    }
    
    // ============================================
    // ПЕРІОДИЧНІ ПОВІДОМЛЕННЯ
    // ============================================
    
    function startPeriodicMessages() {
        if (messageInterval) clearInterval(messageInterval);
        
        messageInterval = setInterval(() => {
            if (CONFIG.showPatrioticMessages && Math.random() > 0.7) {
                showPatrioticMessage();
            }
        }, 300000); // Кожні 5 хвилин
    }
    
    // ============================================
    // ГОЛОВНА ФУНКЦІЯ ЗАПУСКУ
    // ============================================
    
    function initPlugin() {
        if (initialized) return;
        initialized = true;
        
        console.log(`🇺🇦 Запуск ${PLUGIN_NAME} v${PLUGIN_VERSION}`);
        
        addPatrioticStyles();
        addTridentAnimation();
        replaceUITexts();
        patchLampaAPI();
        patchContentRows();
        startPeriodicMessages();
        
        // Показуємо вітальне повідомлення
        setTimeout(() => {
            showPatrioticMessage('💙💛 Вітаємо! Патріотичний плагін активовано! Слава Україні! 💙💛');
        }, 2000);
        
        // Підписуємось на події плеєра
        if (window.Lampa) {
            Lampa.Listener.follow('player', function(e) {
                if (e.type === 'create' && e.player) {
                    prioritizeUkrainianDubbing(e.player);
                }
            });
        }
        
        console.log('✅ Патріотичний плагін успішно завантажено!');
    }
    
    // ============================================
    // РЕЄСТРАЦІЯ ПЛАГІНУ
    // ============================================
    
    function registerPlugin() {
        if (window.Lampa && Lampa.Manifest && Lampa.Manifest.plugins) {
            Lampa.Manifest.plugins = {
                ...Lampa.Manifest.plugins,
                name: PLUGIN_NAME,
                version: PLUGIN_VERSION,
                description: 'Патріотичний український плагін для Lampa'
            };
        }
        
        if (window.appready) {
            initPlugin();
        } else {
            Lampa.Listener.follow('app', function(e) {
                if (e.type === 'ready') initPlugin();
            });
        }
    }
    
    // Запускаємо
    if (typeof Lampa !== 'undefined') {
        registerPlugin();
    } else {
        window.addEventListener('load', () => {
            if (typeof Lampa !== 'undefined') registerPlugin();
        });
    }
    
})();