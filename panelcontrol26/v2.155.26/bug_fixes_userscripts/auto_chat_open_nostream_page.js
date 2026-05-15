// C:\Projects__on__SSD_C_Win10\Debug_7BTVFZ__Chrome_Build_v2.6.55__28_07_2025\js\auto_chat_open_nostream_page.js

// ==UserScript==
// @name         Auto Open Chat   Twitch
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Automatically opens the chat tab on Twitch channel pages, excluding /videos and /schedule pages.
// @author       gullampis810
// @match        https://www.twitch.tv/* 
// @icon         https://png.pngtree.com/png-vector/20191027/ourmid/pngtree-open-icon-isolated-on-abstract-background-png-image_1875077.jpg
// @run-at       document-end
// ==/UserScript==

(function () {
    // Флаг для управления логами
    const enableLogs = false;

    // Функция для логирования
    function log(...args) {
        if (enableLogs) {
            console.log(...args);
        }
    }

    // Функция для предупреждений
    function warn(...args) {
        if (enableLogs) {
            console.warn(...args);
        }
    }

    // Функция для ошибок
    function error(...args) {
        if (enableLogs) {
            console.error(...args);
        }
    }

    // Функция для проверки, можно ли открывать чат
    function shouldOpenChat() {
        const currentUrl = window.location.pathname.toLowerCase();
        if (currentUrl.includes('/videos') || currentUrl.includes('/schedule')) {
            log('URL содержит /videos или /schedule, чат не будет открыт.');
            return false;
        }
        return true;
    }

    // Функция для открытия чата
    function openChatTabIfClosed() {
        if (!shouldOpenChat()) {
            return false;
        }
        log('Попытка найти кнопку чата...');
        const chatTab = document.querySelector('[data-a-target="channel-home-tab-Chat"]');
        if (!chatTab) {
            warn('Кнопка чата не найдена! Проверьте селектор или загрузку страницы.');
            return false;
        }
        log('Кнопка чата найдена:', chatTab);
        const isChatOpen = chatTab.getAttribute('aria-selected') === 'true';
        if (!isChatOpen) {
            log('Чат закрыт — выполняю клик...');
            if (chatTab.offsetParent !== null) {
                chatTab.click();
                log('Клик по кнопке чата выполнен.');
                chatTab.setAttribute('aria-selected', 'true');
                chatTab.setAttribute('tabindex', '0');
                const otherTabs = document.querySelectorAll('[role="tab"][data-a-target]:not([data-a-target="channel-home-tab-Chat"])');
                log('Найдено других вкладок:', otherTabs.length);
                otherTabs.forEach(tab => {
                    tab.setAttribute('aria-selected', 'false');
                    tab.setAttribute('tabindex', '-1');
                });
                const channelRoot = document.querySelector('.channel-root');
                if (channelRoot) {
                    log('Обновляю классы channel-root...');
                    channelRoot.classList.add('channel-root--watch-chat', 'channel-root--watch');
                    channelRoot.classList.remove('channel-root--home');
                } else {
                    warn('Контейнер .channel-root не найден!');
                }
                const channelInfo = document.querySelector('.channel-root__info');
                if (channelInfo) {
                    log('Обновляю классы channel-root__info...');
                    channelInfo.classList.add('channel-root__info--with-chat');
                    channelInfo.classList.remove('channel-root__info--home');
                } else {
                    warn('Контейнер .channel-root__info не найден!');
                }
                return true;
            } else {
                warn('Кнопка чата не видима (offsetParent null), повторяю попытку...');
                return false;
            }
        } else {
            log('Чат уже открыт — ничего делать не нужно.');
            return true;
        }
    }

    // Функция для повторных попыток открытия чата
    function tryOpenChat(maxAttempts = 65, interval = 100) {
        if (!shouldOpenChat()) {
            log('Пропускаю попытки открытия чата из-за URL.');
            return;
        }
        let attempts = 0;
        function attempt() {
            attempts++;
            log(`Попытка ${attempts} из ${maxAttempts}...`);
            const success = openChatTabIfClosed();
            if (!success && attempts < maxAttempts) {
                log(`Повторная попытка через ${interval} мс...`);
                setTimeout(attempt, interval);
            } else if (!success) {
                error('Не удалось открыть чат после всех попыток.');
            }
        }
        attempt();
    }

    // Функция для отслеживания изменений URL
    function watchUrlChanges() {
        let lastUrl = window.location.pathname;
        log('Начальное значение URL:', lastUrl);
        const checkUrl = () => {
            const currentUrl = window.location.pathname;
            if (currentUrl !== lastUrl) {
                log(`URL изменился с ${lastUrl} на ${currentUrl}, проверяю необходимость открытия чата...`);
                lastUrl = currentUrl;
                tryOpenChat();
            }
        };
        setInterval(checkUrl, 500);
    }

    // MutationObserver для отслеживания появления кнопки чата
    function observeDOM() {
        const observer = new MutationObserver((mutations, obs) => {
            const chatTab = document.querySelector('[data-a-target="channel-home-tab-Chat"]');
            if (chatTab && shouldOpenChat()) {
                log('Кнопка чата появилась в DOM, пробую открыть чат...');
                tryOpenChat();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        log('MutationObserver запущен для отслеживания кнопки чата.');
    }

    // Запускаем при полной загрузке страницы
    window.addEventListener('load', () => {
        log('Событие load сработало, запускаю tryOpenChat и наблюдатель URL...');
        tryOpenChat();
        watchUrlChanges();
        observeDOM();
    });

    // Запускаем при DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        log('Событие DOMContentLoaded сработало, запускаю tryOpenChat и наблюдатель...');
        tryOpenChat();
        observeDOM();
    });
})(); 