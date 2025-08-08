 (function () {
    console.log('Скрипт auto_chat_open_nostream_page.js загружен в', new Date().toLocaleString());
    // Функция для проверки, можно ли открывать чат
    function shouldOpenChat() {
        const currentUrl = window.location.pathname.toLowerCase();
        // Не открываем чат, если URL содержит /videos или /schedule
        if (currentUrl.includes('/videos') || currentUrl.includes('/schedule')) {
            console.log('URL содержит /videos или /schedule, чат не будет открыт.');
            return false;
        }
        return true;
    }
    // Функция для открытия чата
    function openChatTabIfClosed() {
        if (!shouldOpenChat()) {
            return false;
        }
        console.log('Попытка найти кнопку чата...');
        const chatTab = document.querySelector('[data-a-target="channel-home-tab-Chat"]');
        if (!chatTab) {
            console.warn('Кнопка чата не найдена! Проверьте селектор или загрузку страницы.');
            return false;
        }
        console.log('Кнопка чата найдена:', chatTab);
        const isChatOpen = chatTab.getAttribute('aria-selected') === 'true';
        if (!isChatOpen) {
            console.log('Чат закрыт — выполняю клик...');
            if (chatTab.offsetParent !== null) {
                chatTab.click();
                console.log('Клик по кнопке чата выполнен.');
                // Обновляем атрибуты
                chatTab.setAttribute('aria-selected', 'true');
                chatTab.setAttribute('tabindex', '0');
                // Деактивируем другие вкладки
                const otherTabs = document.querySelectorAll('[role="tab"][data-a-target]:not([data-a-target="channel-home-tab-Chat"])');
                console.log('Найдено других вкладок:', otherTabs.length);
                otherTabs.forEach(tab => {
                    tab.setAttribute('aria-selected', 'false');
                    tab.setAttribute('tabindex', '-1');
                });
                // Обновляем классы контейнера
                const channelRoot = document.querySelector('.channel-root');
                if (channelRoot) {
                    console.log('Обновляю классы channel-root...');
                    channelRoot.classList.add('channel-root--watch-chat', 'channel-root--watch');
                    channelRoot.classList.remove('channel-root--home');
                }
                else {
                    console.warn('Контейнер .channel-root не найден!');
                }
                // Обновляем классы инфо-контейнера
                const channelInfo = document.querySelector('.channel-root__info');
                if (channelInfo) {
                    console.log('Обновляю классы channel-root__info...');
                    channelInfo.classList.add('channel-root__info--with-chat');
                    channelInfo.classList.remove('channel-root__info--home');
                }
                else {
                    console.warn('Контейнер .channel-root__info не найден!');
                }
                return true;
            }
            else {
                console.warn('Кнопка чата не видима (offsetParent null), повторяю попытку...');
                return false;
            }
        }
        else {
            console.log('Чат уже открыт — ничего делать не нужно.');
            return true;
        }
    }
    // Функция для повторных попыток открытия чата
    function tryOpenChat(maxAttempts = 65, interval = 100) {
        if (!shouldOpenChat()) {
            console.log('Пропускаю попытки открытия чата из-за URL.');
            return;
        }
        let attempts = 0;
        function attempt() {
            attempts++;
            console.log(`Попытка ${attempts} из ${maxAttempts}...`);
            const success = openChatTabIfClosed();
            if (!success && attempts < maxAttempts) {
                console.log(`Повторная попытка через ${interval} мс...`);
                setTimeout(attempt, interval);
            }
            else if (!success) {
                console.error('Не удалось открыть чат после всех попыток.');
            }
        }
        attempt();
    }
    // Функция для отслеживания изменений URL
    function watchUrlChanges() {
        let lastUrl = window.location.pathname;
        console.log('Начальное значение URL:', lastUrl);
        // Проверяем URL с интервалом
        const checkUrl = () => {
            const currentUrl = window.location.pathname;
            if (currentUrl !== lastUrl) {
                console.log(`URL изменился с ${lastUrl} на ${currentUrl}, проверяю необходимость открытия чата...`);
                lastUrl = currentUrl;
                tryOpenChat();
            }
        };
        // Запускаем проверку каждые 500 мс
        setInterval(checkUrl, 500);
    }
    // MutationObserver для отслеживания появления кнопки чата
    function observeDOM() {
        const observer = new MutationObserver((mutations, obs) => {
            const chatTab = document.querySelector('[data-a-target="channel-home-tab-Chat"]');
            if (chatTab && shouldOpenChat()) {
                console.log('Кнопка чата появилась в DOM, пробую открыть чат...');
                tryOpenChat();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        console.log('MutationObserver запущен для отслеживания кнопки чата.');
    }
    // Запускаем при полной загрузке страницы
    window.addEventListener('load', () => {
        console.log('Событие load сработало, запускаю tryOpenChat и наблюдатель URL...');
        tryOpenChat();
        watchUrlChanges();
        observeDOM();
    });
    // Запускаем при DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Событие DOMContentLoaded сработало, запускаю tryOpenChat и наблюдатель...');
        tryOpenChat();
        observeDOM();
    });
})();
//# sourceMappingURL=auto_chat_open_nostream_page.js.map
