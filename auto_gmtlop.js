(function () {
    'use strict';

    // ============================================
    // НАЛАШТУВАННЯ
    // ============================================
    const CONFIG = {
        filterRussianContent: true,
        patrioticUI: true,
        replaceTexts: true,
        showPatrioticMessages: true,
        showTridentAnimation: true,
        forcedUkrainianDubbing: false
    };

    const COLORS = {
        primary: '#0057B7',
        secondary: '#FFD700',
        accent: '#FF6600',
        background: '#001133'
    };

    const PATRIOTIC_MESSAGES = [
        '💙💛 Слава Україні!',
        '🇺🇦 Героям слава!',
        '💪 Україна понад усе!',
        '🎵 Ой у лузі червона калина...',
        '🛡️ Смерть ворогам!',
        '🌻 Україна - це Європа!',
        '💙💛 Разом до перемоги!'
    ];

    const TEXT_REPLACEMENTS = {
        'Новинки': '🌾 Свіженьке',
        'Фільми': '🎬 Кінострічки',
        'Серіали': '📺 Серіальчики',
        'Мультфільми': '🎨 Мультяшки',
        'Пошук': '🔍 Шукати',
        'Налаштування': '⚙️ Смаколики',
        'Дивитися': '▶️ Дивитись',
        'В обране': '💙 В обране',
        'Рейтинг': '⭐ Рейтинг',
        'Рік': '📅 Рік',
        'Країна': '🌍 Країна'
    };

    const RUSSIAN_KEYWORDS = [
        'росія', 'російська', 'russia', 'russian', 'cccp', 'ссср', 'радянський', 'soviet'
    ];

    let initialized = false;
    let styleElement = null;

    // ============================================
    // ДОПОМІЖНІ ФУНКЦІЇ
    // ============================================
    function log(message) {
        console.log(`🇺🇦 [Patriotic Plugin] ${message}`);
    }

    function showToast(message) {
        if (!CONFIG.showPatrioticMessages) return;
        if (typeof Lampa !== 'undefined' && Lampa.Notification && Lampa.Notification.show) {
            Lampa.Notification.show(message, 3000);
        } else {
            alert(message);
        }
    }

    // ============================================
    // ДОДАВАННЯ СТИЛІВ (безпечно)
    // ============================================
    function addPatrioticStyles() {
        if (!CONFIG.patrioticUI) return;
        if (styleElement && styleElement.parentNode) return;

        styleElement = document.createElement('style');
        styleElement.id = 'patriotic-styles';
        styleElement.textContent = `
            .patriotic-trident {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 44px;
                height: 44px;
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${COLORS.secondary.replace('#', '%23')}"><path d="M12 2L15 8H9L12 2Z M12 8V22 M10 13L12 15L14 13"/></svg>') no-repeat center;
                background-size: contain;
                opacity: 0.8;
                z-index: 9999;
                cursor: pointer;
                transition: all 0.2s;
            }
            .patriotic-trident:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            .movie-card[data-country*="рос"] {
                border: 2px solid red !important;
                opacity: 0.5;
            }
        `;
        document.head.appendChild(styleElement);
        log('Стилі додано');
    }

    // ============================================
    // ФІЛЬТРАЦІЯ РОСІЙСЬКОГО КОНТЕНТУ (через API)
    // ============================================
    function isRussianContent(item) {
        if (!CONFIG.filterRussianContent) return false;
        if (!item) return false;

        const fields = [
            item.country,
            item.original_title,
            item.original_name,
            item.production_countries,
            item.origin_country
        ];

        for (let field of fields) {
            if (!field) continue;
            const str = String(field).toLowerCase();
            if (RUSSIAN_KEYWORDS.some(keyword => str.includes(keyword))) {
                return true;
            }
        }
        return false;
    }

    // Перехоплюємо метод list у джерелі 'tmdb'
    function patchTmdbSource() {
        if (!window.Lampa || !Lampa.Source || !Lampa.Source.tmdb) return false;

        const originalList = Lampa.Source.tmdb.list;
        Lampa.Source.tmdb.list = function(params, oncomplete, onerror) {
            if (!CONFIG.filterRussianContent) {
                return originalList.call(this, params, oncomplete, onerror);
            }

            originalList.call(this, params, function(data) {
                if (data && data.results && Array.isArray(data.results)) {
                    const before = data.results.length;
                    data.results = data.results.filter(item => !isRussianContent(item));
                    const after = data.results.length;
                    if (before > after && CONFIG.showPatrioticMessages) {
                        showToast(`🧹 Відфільтровано ${before - after} російських кінопродуктів! 💙💛`);
                    }
                }
                if (oncomplete) oncomplete(data);
            }, onerror);
        };
        log('Джерело tmdb пропатчено для фільтрації російського контенту');
        return true;
    }

    // ============================================
    // ЗАМІНА ТЕКСТІВ В ІНТЕРФЕЙСІ (безпечний observer)
    // ============================================
    function startTextReplacer() {
        if (!CONFIG.replaceTexts) return;

        const observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.textContent) {
                            replaceTextInNode(node);
                        }
                    });
                } else if (mutation.type === 'characterData' && mutation.target.parentNode) {
                    replaceTextInNode(mutation.target.parentNode);
                }
            }
        });

        function replaceTextInNode(node) {
            if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
            // Не чіпаємо теги script/style
            if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;

            for (let child of node.childNodes) {
                if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
                    let newText = child.textContent;
                    let changed = false;
                    for (let [search, replace] of Object.entries(TEXT_REPLACEMENTS)) {
                        if (newText.includes(search)) {
                            newText = newText.split(search).join(replace);
                            changed = true;
                        }
                    }
                    if (changed) child.textContent = newText;
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    replaceTextInNode(child);
                }
            }
        }

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        log('Заміну текстів активовано');
    }

    // ============================================
    // ТРИЗУБ (клікабельний)
    // ============================================
    function addTrident() {
        if (!CONFIG.showTridentAnimation) return;
        if (document.querySelector('.patriotic-trident')) return;

        const trident = document.createElement('div');
        trident.className = 'patriotic-trident';
        trident.title = 'Слава Україні! 🇺🇦';
        trident.onclick = () => {
            const msg = PATRIOTIC_MESSAGES[Math.floor(Math.random() * PATRIOTIC_MESSAGES.length)];
            showToast(msg);
        };
        document.body.appendChild(trident);
        log('Тризуб додано');
    }

    // ============================================
    // ПЕРІОДИЧНІ ПОВІДОМЛЕННЯ
    // ============================================
    let messageInterval = null;
    function startPeriodicMessages() {
        if (!CONFIG.showPatrioticMessages) return;
        if (messageInterval) clearInterval(messageInterval);

        messageInterval = setInterval(() => {
            if (Math.random() > 0.8) {
                const msg = PATRIOTIC_MESSAGES[Math.floor(Math.random() * PATRIOTIC_MESSAGES.length)];
                showToast(msg);
            }
        }, 10 * 60 * 1000); // кожні 10 хвилин
        log('Періодичні повідомлення запущено');
    }

    // ============================================
    // ГОЛОВНА ФУНКЦІЯ ІНІЦІАЛІЗАЦІЇ
    // ============================================
    function init() {
        if (initialized) return;
        initialized = true;

        log('Запуск патріотичного плагіну...');
        addPatrioticStyles();
        patchTmdbSource();
        startTextReplacer();
        addTrident();
        startPeriodicMessages();

        showToast('💙💛 Патріотичний плагін активовано! Слава Україні!');
        log('Плагін успішно завантажено');
    }

    // ============================================
    // ОЧІКУВАННЯ ГОТОВНОСТІ LAMPA
    // ============================================
    function waitForLampa() {
        if (typeof Lampa !== 'undefined' && Lampa.Listener && document.body) {
            if (window.appready) {
                init();
            } else {
                Lampa.Listener.follow('app', function(e) {
                    if (e.type === 'ready') init();
                });
            }
        } else {
            setTimeout(waitForLampa, 500);
        }
    }

    waitForLampa();
})();