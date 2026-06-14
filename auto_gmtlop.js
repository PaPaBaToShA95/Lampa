(function () {
    'use strict';

    console.log('Auto GMTLOP plugin loaded');

    Lampa.Listener.follow('app', function (e) {
        console.log('Lampa event:', e);
    });

    Lampa.Noty.show('Auto GMTLOP завантажено');
})();