(function () {
    'use strict';

    console.log('Auto GMTLOP plugin loaded');

    Lampa.Listener.follow('app', function (e) {
        console.log('Lampa event:', e);
    });

    Lampa.Noty.show('Auto GMTLOP завантажено');
})();(function () {
    'use strict';

    function selectGMTLOP() {
        setTimeout(function () {
            $('.selectbox__item').each(function () {
                let text = $(this).text().toLowerCase();

                if (text.includes('gmtlop')) {
                    $(this).trigger('hover:enter');
                    $(this).click();
                    return false;
                }
            });
        }, 300);
    }

    Lampa.Listener.follow('select', function () {
        selectGMTLOP();
    });

    Lampa.Noty.show('Auto GMTLOP увімкнено');
})();