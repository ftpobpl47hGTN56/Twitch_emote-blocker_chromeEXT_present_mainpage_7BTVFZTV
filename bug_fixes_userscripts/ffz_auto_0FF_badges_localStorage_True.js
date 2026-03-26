(function() {
    'use strict';

    // Whitelist id чекбоксов, которые нельзя отключать (расширен на основе Вашего примера хранилища)
    const whitelistIds = [
        'twitchbot',
        'broadcaster',
        'admin',
        'no_video',
        'moderator',
        'subscriber',
        'm-twitch',
        'm-tcon',
        'm-other',
        'm-owl',
        'm-game',
        'm-ffz',
        'm-addon-7tv-emotes',
        'm-addon-ffzap-core'
    ];

    // Ключ хранилища FFZ для hidden badges
    const STORAGE_KEY = 'FFZ:setting:p:0:chat.badges.hidden';

    // Функция debounce
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Функция для обновления хранилища hidden badges
    function updateHiddenBadgesStorage(badgeId) {
        let hiddenBadges = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        if (hiddenBadges.hasOwnProperty(badgeId) && hiddenBadges[badgeId] !== true) {
            return; // Уже false или отсутствует, ничего не делаем
        }

        hiddenBadges[badgeId] = true;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddenBadges));
        console.log(`FFZ Hidden Badges updated: ${badgeId} set to false`); // Для отладки

        // Диспатч события для триггера re-render в FFZ
        window.dispatchEvent(new CustomEvent('ffz:settings:updated', { detail: { setting: 'chat.badges.hidden' } }));
        console.log('Dispatched ffz:settings:updated event for badge hidden settings'); // Для отладки
    }

    // Функция для сканирования чата на новые badge'ы
    function scanChatForNewBadges() {
        const chatMessages = document.querySelectorAll('.chat-line__message');
        const seenBadges = new Set(); // Уникальные badge'ы в текущем чате

        chatMessages.forEach(message => {
            const badges = message.querySelectorAll('span[data-badge]');
            badges.forEach(badge => {
                const badgeId = badge.getAttribute('data-badge');
                if (badgeId) {
                    seenBadges.add(badgeId);
                }
            });
        });

        // Для каждого уникального badge проверяем хранилище и применяем видимость
        seenBadges.forEach(badgeId => {
            updateHiddenBadgesStorage(badgeId);
        });
    }

    // Функция для проверки и отключения чекбоксов (для панели настроек)
    function checkAndDisableBadges() {
        const panel = document.querySelector('.ffz-dialog.ffz-main-menu');
        if (!panel || getComputedStyle(panel).display === 'none') {
            return; // Панель не открыта или не видна
        }

        const badgesSection = panel.querySelector('#tab-panel-chat\\.badges\\.tabs\\.visibility');
        if (!badgesSection) {
            return; // Если раздел badges не найден, выходим
        }

        // Создание кнопки "Select All" если её нет
        const resetContainer = badgesSection.querySelector('.tw-mg-b-2.tw-align-right');
        if (resetContainer && !resetContainer.querySelector('.ffz-select-all-button')) {
            const selectAllButton = document.createElement('button');
            selectAllButton.className = 'tw-mg-l-05 tw-button ffz-button--hollow ffz-il-tooltip__container ffz-select-all-button';
            selectAllButton.innerHTML = `
                <span class="tw-button__icon tw-button__icon--left">
                    <figure class="ffz-i-ok"></figure>
                </span>
                <span class="tw-button__text">Select All</span>
            `;
            selectAllButton.addEventListener('click', () => {
                const checkboxes = badgesSection.querySelectorAll('input.ffz-checkbox__input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    if (whitelistIds.includes(checkbox.id)) {
                        return; // Пропускаем whitelist
                    }
                    checkbox.checked = true; // Отмечаем чекбокс
                    checkbox.dispatchEvent(new Event('change', { bubbles: true })); // Симулируем изменение для обновления UI
                });
            });
            resetContainer.appendChild(selectAllButton);
        }

        const checkboxes = badgesSection.querySelectorAll('input.ffz-checkbox__input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (whitelistIds.includes(checkbox.id)) {
                return; // Пропускаем whitelist
            }
            if (checkbox.checked) {
                checkbox.click(); // Симулируем клик для отключения
            }
        });
    }

    // Debounced версии проверок
    const debouncedCheckBadges = debounce(checkAndDisableBadges, 200); // Для панели
    const debouncedScanChat = debounce(scanChatForNewBadges, 500); // Для чата

    // Очистка наблюдателей, слушателей и интервалов
    function cleanup() {
        if (window.myFFZObserver) {
            window.myFFZObserver.disconnect();
            window.myFFZObserver = null;
        }
        if (window.myChatObserver) {
            window.myChatObserver.disconnect();
            window.myChatObserver = null;
        }
        if (window.myUrlObserver) {
            window.myUrlObserver.disconnect();
            window.myUrlObserver = null;
        }
        if (window.myInterval) {
            clearInterval(window.myInterval);
            window.myInterval = null;
        }
        if (window.chatInterval) {
            clearInterval(window.chatInterval);
            window.chatInterval = null;
        }
        if (window.originalPushState) {
            history.pushState = window.originalPushState;
            window.originalPushState = null;
        }
        if (window.originalReplaceState) {
            history.replaceState = window.originalReplaceState;
            window.originalReplaceState = null;
        }
    }

    // Инициализация скрипта
    function initScript() {
        // Проверяем, не запущен ли уже
        if (window.myFFZObserver || window.myInterval || window.myChatObserver || window.chatInterval) {
            return;
        }

        // MutationObserver для панели FFZ
        window.myFFZObserver = new MutationObserver(() => {
            debouncedCheckBadges();
        });
        window.myFFZObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        // MutationObserver для чата (мониторим добавление сообщений)
        window.myChatObserver = new MutationObserver(() => {
            debouncedScanChat();
        });
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
        if (chatContainer) {
            window.myChatObserver.observe(chatContainer, {
                childList: true,
                subtree: true
            });
        }

        // Периодическая проверка панели
        window.myInterval = setInterval(debouncedCheckBadges, 1000);

        // Периодическая проверка чата
        window.chatInterval = setInterval(debouncedScanChat, 5000); // Каждые 5 сек для надежности

        // Перехват history.pushState и replaceState для SPA
        if (!window.originalPushState) {
            window.originalPushState = history.pushState;
            history.pushState = function() {
                window.originalPushState.apply(this, arguments);
                debouncedCheckBadges();
                debouncedScanChat();
            };
        }
        if (!window.originalReplaceState) {
            window.originalReplaceState = history.replaceState;
            history.replaceState = function() {
                window.originalReplaceState.apply(this, arguments);
                debouncedCheckBadges();
                debouncedScanChat();
            };
        }

        // Начальные проверки
        debouncedCheckBadges();
        debouncedScanChat();
        scanChatForNewBadges(); // Сканируем существующие badge'ы при запуске
    }

    // Мониторинг смены URL
    function monitorUrlChanges() {
        let lastUrl = location.href;
        window.myUrlObserver = new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                cleanup(); // Очищаем старые ресурсы
                initScript(); // Перезапускаем скрипт
            }
        });
        window.myUrlObserver.observe(document, { subtree: true, childList: true });
    }

    // Полная инициализация
    function init() {
        cleanup(); // Очищаем на случай повторного запуска
        initScript(); // Запускаем основной функционал
        monitorUrlChanges(); // Запускаем мониторинг URL
    }

    // Запуск при загрузке страницы
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
        window.addEventListener('load', init);
    }

    // Немедленный запуск для SPA
    init();

    // Дополнительный запуск при возвращении на вкладку
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            debouncedCheckBadges();
            debouncedScanChat();
        }
    });

    // Дополнительный таймаут для надежности в extension (если запуск слишком ранний)
    setTimeout(init, 2000);
})();