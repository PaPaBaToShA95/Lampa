(function () {

    if (!window.Lampa) {
        setTimeout(arguments.callee, 500);
        return;
    }

    if (window.__ua_safe_feed) return;
    window.__ua_safe_feed = true;

    console.log('[UA SAFE FEED] loaded');

    // меню
    if (Lampa.Menu && Lampa.Menu.add) {
        Lampa.Menu.add({
            id: 'ua_safe_feed',
            title: '🇺🇦 UA Feed',
            icon: 'star'
        });
    }

    function openFeed() {

        const root = document.createElement('div');
        root.className = 'ua-feed';

        document.querySelector('.content').innerHTML = '';
        document.querySelector('.content').appendChild(root);

        root.innerHTML = '<div style="color:white">Loading...</div>';

        loadContent(root);
    }

    function loadContent(root) {

        // fallback якщо TMDB недоступний
        const url = 'https://api.themoviedb.org/3/movie/popular?api_key=undefined&language=en-US&page=1';

        fetch(url)
            .then(r => r.json())
            .then(data => {

                let items = data.results || [];

                // 🔥 фільтр RU
                items = items.filter(i => {

                    const text = JSON.stringify(i).toLowerCase();

                    return !text.includes('russia') &&
                           !text.includes('ru') &&
                           !text.includes('россия');
                });

                render(root, items);
            })
            .catch(err => {
                root.innerHTML = '<div style="color:red">API error</div>';
                console.log(err);
            });
    }

    function render(root, items) {

        root.innerHTML = '';

        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
        grid.style.gap = '12px';

        items.forEach(item => {

            const card = document.createElement('div');
            card.style.cursor = 'pointer';
            card.style.color = '#fff';

            const img = document.createElement('div');
            img.style.height = '220px';
            img.style.backgroundSize = 'cover';
            img.style.borderRadius = '10px';
            img.style.backgroundImage =
                `url(https://image.tmdb.org/t/p/w300${item.poster_path})`;

            const title = document.createElement('div');
            title.textContent = item.title || item.name;
            title.style.fontSize = '14px';
            title.style.marginTop = '6px';

            card.appendChild(img);
            card.appendChild(title);

            card.onclick = function () {
                if (Lampa.Activity && Lampa.Activity.push) {
                    Lampa.Activity.push({
                        url: '/movie/' + item.id,
                        title: item.title
                    });
                }
            };

            grid.appendChild(card);
        });

        root.appendChild(grid);
    }

    // перехоплення відкриття меню
    document.addEventListener('click', function (e) {

        const el = e.target.closest('[data-id="ua_safe_feed"]');

        if (el) {
            openFeed();
        }

    }, true);

    // стилі
    const style = document.createElement('style');
    style.innerHTML = `
        .ua-feed {
            padding: 20px;
        }
    `;

    document.head.appendChild(style);

})();