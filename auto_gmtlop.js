(function () {
    'use strict';

    if (window.__gmtlop_click_hook) return;
    window.__gmtlop_click_hook = true;

    console.log('[GMTLOP] click hook loaded');

    // 1. Перехоплюємо клік по "Дивитись"
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('button, div, a');

        if (!btn) return;

        const text = (btn.innerText || btn.textContent || '').trim().toLowerCase();

        // ловимо кнопку "дивитись"
        if (text === 'дивитись' || text.includes('дивитись')) {

            console.log('[GMTLOP] Watch clicked');

            // даємо Lampa відкрити sources
            setTimeout(waitForSourcesAndClickGMTLOP, 600);
        }
    }, true);


    function waitForSourcesAndClickGMTLOP() {
        let attempts = 0;

        const timer = setInterval(() => {
            attempts++;

            // шукаємо всі елементи джерел
            const items = document.querySelectorAll('.source-item, .selector__item, .player-source, [class*="source"], [class*="selector"]');

            if (items && items.length) {

                console.log('[GMTLOP] sources found:', items.length);

                for (let el of items) {
                    const text = (el.innerText || '').trim().toLowerCase();

                    if (text.includes('gmtlop')) {
                        console.log('[GMTLOP] clicking:', el);

                        el.click();
                        clearInterval(timer);
                        return;
                    }
                }
            }

            // таймаут щоб не висіло
            if (attempts > 20) {
                console.log('[GMTLOP] not found');
                clearInterval(timer);
            }

        }, 300);
    }

})();