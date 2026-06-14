(function () {

    if (!window.Lampa) {
        setTimeout(arguments.callee, 500);
        return;
    }

    if (window.__ua_safe_feed) return;
    window.__ua_safe_feed = true;

    console.log('[UA SAFE FEED] loaded');

    // додаємо пункт меню
    Lampa.Menu.add({
        id: 'ua_safe_feed',
        title: '🇺🇦 UA Feed',
        icon: 'star'
    });

    // відкриття екрану
    Lampa.Activity.push({
        open: function () {

            const content = $('<div class="ua-feed"></div>');

            $('.content').html(content);

            loadContent(content);
        },
        title: 'UA Feed'
    });

    function loadContent(root) {

        root.html('<div class="ua-loading">Loading...</div>');

        // беремо популярні фільми
        Lampa.TMDB.api('/movie/popular').then(data => {

            let items = data.results || [];

            // 🔥 ФІЛЬТР: прибираємо RU контент
            items = items.filter(i => {

                const countries = (i.origin_country || i.production_countries || []);

                const text = JSON.stringify(countries).toLowerCase();

                return !text.includes('ru') && !text.includes('russia');
            });

            render(root, items);

        });
    }

    function render(root, items) {

        let html = `<div class="ua-grid">`;

        items.forEach(item => {

            html += `
                <div class="ua-card" data-id="${item.id}">
                    <div class="ua-poster" style="background-image:url(https://image.tmdb.org/t/p/w300${item.poster_path})"></div>
                    <div class="ua-title">${item.title || item.name}</div>
                </div>
            `;
        });

        html += `</div>`;

        root.html(html);

        bind(root);
    }

    function bind(root) {

        root.find('.ua-card').on('click', function () {

            const id = $(this).data('id');

            Lampa.Activity.push({
                url: '/movie/' + id,
                title: 'Details'
            });

        });
    }

    // стилі
    const css = `
        .ua-feed {
            padding: 20px;
        }

        .ua-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 15px;
        }

        .ua-card {
            cursor: pointer;
            transition: 0.2s;
        }

        .ua-card:hover {
            transform: scale(1.05);
        }

        .ua-poster {
            width: 100%;
            height: 220px;
            background-size: cover;
            border-radius: 12px;
        }

        .ua-title {
            color: #fff;
            margin-top: 8px;
            font-size: 14px;
        }

        .ua-loading {
            color: #fff;
        }
    `;

    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

})();