(function() {
    console.log('[TEST] Патріотичний плагін завантажено');

    function showNotification(msg) {
        if (typeof Lampa !== 'undefined' && Lampa.Notification && Lampa.Notification.show) {
            Lampa.Notification.show(msg, 5000);
        } else {
            alert(msg);
        }
    }

    function init() {
        console.log('[TEST] Init виконано');
        showNotification('💙💛 Патріотичний плагін активовано! Слава Україні!');
    }

    // Запускаємо після повної готовності Lampa
    if (typeof Lampa !== 'undefined') {
        if (window.appready) {
            init();
        } else {
            Lampa.Listener.follow('app', function(e) {
                if (e.type === 'ready') init();
            });
        }
    } else {
        // Якщо Lampa ще не підвантажилась – чекаємо
        window.addEventListener('load', function() {
            if (typeof Lampa !== 'undefined') init();
            else console.warn('[TEST] Lampa не знайдено');
        });
    }
})();