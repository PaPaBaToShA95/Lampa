(function() {
    // Функція додавання кнопки в меню
    function addPatrioticButton() {
        if (typeof Lampa === 'undefined' || !Lampa.Menu || !Lampa.Menu.add) {
            setTimeout(addPatrioticButton, 500);
            return;
        }
        
        Lampa.Menu.add({
            title: '💙💛 Патріот',
            component: 'patriotic',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 2L15 8H9L12 2Z M12 8V22 M10 13L12 15L14 13"/></svg>',
            onclick: function() {
                if (Lampa.Notification && Lampa.Notification.show) {
                    Lampa.Notification.show('Слава Україні! Героям слава! 💙💛', 5000);
                } else {
                    alert('Слава Україні! 💙💛');
                }
            }
        });
        
        console.log('[Patriot] Кнопку додано в меню');
        if (Lampa.Notification && Lampa.Notification.show) {
            Lampa.Notification.show('Патріотичний плагін активовано!', 4000);
        }
    }
    
    // Запуск після готовності Lampa
    function start() {
        if (window.appready) {
            addPatrioticButton();
        } else {
            Lampa.Listener.follow('app', function(e) {
                if (e.type === 'ready') addPatrioticButton();
            });
        }
    }
    
    if (typeof Lampa !== 'undefined') {
        start();
    } else {
        window.addEventListener('load', function() {
            if (typeof Lampa !== 'undefined') start();
        });
    }
})();