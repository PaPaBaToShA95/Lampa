(function () {
    'use strict';

    if (window.__auto_gmtlop_loaded) return;
    window.__auto_gmtlop_loaded = true;

    function log(...args) {
        console.log('[AUTO GMTLOP]', ...args);
    }

    function selectGMTLOP(player) {
        try {
            if (!player || !player.sources) return false;

            const sources = player.sources || [];

            log('Sources:', sources);

            // шукаємо GMTLOP
            const gmtlopIndex = sources.findIndex(s =>
                (s.title || s.name || '').toLowerCase().includes('gmtlop')
            );

            if (gmtlopIndex === -1) {
                log('GMTLOP not found');
                return false;
            }

            log('GMTLOP found at index:', gmtlopIndex);

            // пробуємо вибрати джерело
            if (typeof player.play_source === 'function') {
                player.play_source(gmtlopIndex);
                return true;
            }

            if (typeof player.set_source === 'function') {
                player.set_source(gmtlopIndex);
                return true;
            }

            // fallback через активний індекс
            player.source = gmtlopIndex;

            return true;

        } catch (e) {
            console.error('[AUTO GMTLOP] error:', e);
        }
    }

    function hookPlayer() {
        if (!window.Lampa || !Lampa.Player) return;

        const OriginalOpen = Lampa.Player.open;

        if (!OriginalOpen || OriginalOpen.__gmtlop_hooked) return;

        function WrappedOpen(data) {
            const result = OriginalOpen.apply(this, arguments);

            setTimeout(() => {
                try {
                    if (Lampa.Player && Lampa.Player.instance) {
                        selectGMTLOP(Lampa.Player.instance);
                    }
                } catch (e) {
                    console.error(e);
                }
            }, 800);

            return result;
        }

        WrappedOpen.__gmtlop_hooked = true;
        Lampa.Player.open = WrappedOpen;

        log('Player hook installed');
    }

    function init() {
        if (!window.Lampa) {
            setTimeout(init, 1000);
            return;
        }

        log('Initializing...');

        hookPlayer();

        // повторна перевірка (Lampa може дозавантажувати модулі)
        setInterval(hookPlayer, 3000);
    }

    init();

})();