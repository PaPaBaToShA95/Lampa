(function () {

    if (!window.Lampa) {
        setTimeout(arguments.callee, 500);
        return;
    }

    Lampa.Plugins.add({
        id: 'ua_theme',
        name: 'Ukraine Theme',
        version: '1.0.0'
    }, function () {

        const css = `
            body {
                background: linear-gradient(180deg, #002f6c, #001428) !important;
            }

            .focus, .selected {
                background: #ffd700 !important;
                color: #000 !important;
            }

            .head {
                background: #0057b7 !important;
            }
        `;

        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);

        console.log('[UA THEME] active');
    });

})();