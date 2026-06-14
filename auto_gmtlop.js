(function () {
    'use strict';

    if (window.__ukraine_theme_loaded) return;
    window.__ukraine_theme_loaded = true;

    console.log('[UA THEME] loaded');

    const css = `
        :root {
            --ua-blue: #0057B7;
            --ua-yellow: #FFD700;
        }

        /* Загальний фон */
        body {
            background: linear-gradient(180deg, #0b1a33, #050a14) !important;
        }

        /* Верхня панель */
        .head,
        .header {
            background: linear-gradient(90deg, var(--ua-blue), #002f6c) !important;
            border-bottom: 2px solid var(--ua-yellow);
        }

        /* Активні елементи */
        .focus,
        .active,
        .selected,
        .button--active {
            background: var(--ua-yellow) !important;
            color: #000 !important;
            box-shadow: 0 0 15px var(--ua-yellow);
        }

        /* Кнопки */
        button,
        .button {
            border-radius: 10px !important;
            transition: 0.2s ease;
        }

        button:hover,
        .button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px var(--ua-blue);
        }

        /* Карточки контенту */
        .card,
        .card--item {
            border: 1px solid rgba(255, 215, 0, 0.15);
        }

        /* Фокус навігації */
        .focus:before {
            background: linear-gradient(90deg, var(--ua-blue), var(--ua-yellow)) !important;
        }

        /* Сайдбар */
        .menu,
        .sidebar {
            background: #061225 !important;
            border-right: 2px solid var(--ua-blue);
        }

        /* Текст заголовків */
        h1, h2, h3 {
            color: var(--ua-yellow) !important;
        }

        /* Лого/верхній бренд */
        .logo:after {
            content: "🇺🇦 Український режим";
            margin-left: 10px;
            font-size: 12px;
            color: var(--ua-yellow);
        }

        /* Легкий glow ефект */
        .focus, .selected {
            animation: glowUA 2s infinite alternate;
        }

        @keyframes glowUA {
            from { box-shadow: 0 0 5px var(--ua-blue); }
            to { box-shadow: 0 0 20px var(--ua-yellow); }
        }
    `;

    function injectCSS() {
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    function init() {
        if (!window.Lampa) {
            setTimeout(init, 1000);
            return;
        }

        injectCSS();
    }

    init();

})();