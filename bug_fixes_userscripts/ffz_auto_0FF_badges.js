// content.js
(function() {
    'use strict';

    // Whitelist id чекбоксов, которые нельзя отключать
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

    // Функция debounce
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Функция для проверки и отключения чекбоксов
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

    // Debounced версия проверки
    const debouncedCheck = debounce(checkAndDisableBadges, 200); // Уменьшил задержку до 200ms для большей отзывчивости

    // Очистка наблюдателей, слушателей и интервалов
    function cleanup() {
        if (window.myFFZObserver) {
            window.myFFZObserver.disconnect();
            window.myFFZObserver = null;
        }
        if (window.myUrlObserver) {
            window.myUrlObserver.disconnect();
            window.myUrlObserver = null;
        }
        if (window.myInterval) {
            clearInterval(window.myInterval);
            window.myInterval = null;
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
        if (window.myFFZObserver || window.myInterval) {
            return;
        }

        // MutationObserver для мониторинга DOM с более точной настройкой
        window.myFFZObserver = new MutationObserver(() => {
            debouncedCheck();
        });
        window.myFFZObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true, // Отслеживаем изменения атрибутов (например, style)
            attributeFilter: ['style', 'class'] // Фокус на style и class
        });

        // Периодическая проверка через setInterval
        window.myInterval = setInterval(debouncedCheck, 1000); // Проверка каждые 3 секунды для надежности

        // Перехват history.pushState и replaceState для SPA
        if (!window.originalPushState) {
            window.originalPushState = history.pushState;
            history.pushState = function() {
                window.originalPushState.apply(this, arguments);
                debouncedCheck();
            };
        }
        if (!window.originalReplaceState) {
            window.originalReplaceState = history.replaceState;
            history.replaceState = function() {
                window.originalReplaceState.apply(this, arguments);
                debouncedCheck();
            };
        }

        // Начальная проверка
        debouncedCheck();
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
            debouncedCheck();
        }
    });
})();



 
