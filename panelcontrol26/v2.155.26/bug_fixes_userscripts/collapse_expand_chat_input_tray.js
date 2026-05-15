// collapse_expand_chat_input_tray.js
 

(function() {
    'use strict';

    // Функция debounce для задержки выполнения обработчика
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Более надёжный селектор — ловим любой открытый трей
    const containerSelector = '.chat-input-tray__open';

    // Функция для добавления кнопки и обработчиков
    function initializeContainer(container) {
        // 1. Проверка на существование кнопки
        if (container.querySelector('.collapse-expand-input-tray-9x7xtx-btn')) {
            return;
        }

        // 2. Создание кнопки
        const button = document.createElement('button');
        button.id = 'collapse-expand-input-tray-9x7xtx-btn';
        button.className = 'collapse-expand-input-tray-9x7xtx-btn';
        button.innerHTML = `
            <div class="ScSvgWrapper-sc-wkgzod-0 dKXial tw-svg">
                <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M6.5 5.5 11 10l-4.5 4.5L8 16l6-6-6-6-1.5 1.5z"></path>
                </svg>
            </div>
        `;

        const css = `
            position: absolute !important;
            top: 5px !important;
            right: 30px !important;
            z-index: 100000 !important;
            padding: 1px 5px !important;
            background: rgb(138, 149, 149) !important;
            border: none !important;
            border-radius: 3px !important;
            cursor: pointer !important;
            opacity: 0.7 !important;
            transition: opacity 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            rotate: 270deg !important;
        `;
        button.style.cssText = css;

        // 3. Стили для hover
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            #collapse-expand-input-tray-9x7xtx-btn:hover,
            .collapse-expand-input-tray-9x7xtx-btn:hover {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(styleSheet);

        // 4. Начальные стили контейнера (с !important)
        container.style.setProperty('height', '46px', 'important');
        container.style.setProperty('overflow', 'hidden', 'important');
        container.style.setProperty('transition', 'height 0.3s ease', 'important');

        // 5. Обработчик toggle
        const toggleHandler = debounce(() => {
            // Прячем автокомплит эмоций, если он открыт
            const autocompleteList = container.querySelector('.InjectLayout-sc-1i43xsx-0.autocomplete-match-list');
            if (autocompleteList && autocompleteList.offsetHeight > 0) {
                autocompleteList.style.setProperty('display', 'none', 'important');
            }

            const currentHeight = getComputedStyle(container).getPropertyValue('height').trim();

            if (currentHeight === '46px' || parseInt(currentHeight) <= 55) {
                // Разворачиваем
                container.style.setProperty('height', '530px', 'important');
                button.innerHTML = `
                    <div class="ScSvgWrapper-sc-wkgzod-0 dKXial tw-svg">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <path d="M13.5 14.5 9 10l4.5-4.5L12 4l-6 6 6 6 1.5-1.5z"></path>
                        </svg>
                    </div>
                `;
                button.style.setProperty('rotate', '0deg', 'important');
            } else {
                // Сворачиваем
                container.style.setProperty('height', '46px', 'important');
                button.innerHTML = `
                    <div class="ScSvgWrapper-sc-wkgzod-0 dKXial tw-svg">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <path d="M6.5 5.5 11 10l-4.5 4.5L8 16l6-6-6-6-1.5 1.5z"></path>
                        </svg>
                    </div>
                `;
                button.style.setProperty('rotate', '270deg', 'important');
            }
        }, 200);

        button.addEventListener('click', toggleHandler);

        // 6. Вставка кнопки
        container.insertBefore(button, container.firstChild);
    }

    // Функция поиска и инициализации (теперь переинициализирует при каждом появлении)
    function findAndInitialize() {
        const containers = document.querySelectorAll(containerSelector);
        containers.forEach(container => {
            initializeContainer(container);
        });
    }

    // MutationObserver
    function setupObserver() {
        if (window.customObserver) {
            window.customObserver.disconnect();
        }

        window.customObserver = new MutationObserver((mutations) => {
            let shouldInitialize = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.matches && node.matches(containerSelector) ||
                                node.querySelector && node.querySelector(containerSelector)) {
                                shouldInitialize = true;
                            }
                        }
                    });
                }
            });
            if (shouldInitialize) {
                setTimeout(findAndInitialize, 100); // небольшая задержка на отрисовку Twitch
            }
        });

        window.customObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Мониторинг URL (оставил как было)
    function setupUrlMonitor() {
        let currentUrl = location.href;

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(() => {
                    findAndInitialize();
                    setupObserver();
                }, 500);
            }
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(() => {
                    findAndInitialize();
                    setupObserver();
                }, 500);
            }
        };

        window.addEventListener('popstate', () => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(() => {
                    findAndInitialize();
                    setupObserver();
                }, 500);
            }
        });

        setInterval(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(() => {
                    findAndInitialize();
                    setupObserver();
                }, 500);
            }
        }, 1000);
    }

    // Инициализация
    findAndInitialize();
    setupObserver();
    setupUrlMonitor();

})();