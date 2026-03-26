 

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

    // Селектор для целевого контейнера
    const containerSelector = '.chat-input-tray__open.chat-input-tray__open--persistent'; 
    

    // Функция для добавления кнопки и обработчиков (ИСПРАВЛЕННЫЙ ВАРИАНТ)
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
        position: absolute;
        top: 5px;
        right: 30px;
        z-index: 100000;
        padding: 1px 5px;
        background: rgb(138, 149, 149);
        border: none;
        border-radius: 3px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        rotate: 270deg !important;
    `;
    button.style.cssText = css;

    // 3. Добавляем стили для hover
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        #collapse-expand-input-tray-9x7xtx-btn:hover,
        .collapse-expand-input-tray-9x7xtx-btn:hover {
            opacity: 1 !important;
        } 
    `;
    document.head.appendChild(styleSheet);

    // 4. Устанавливаем начальные стили контейнера
    container.style.setProperty('height', '450px', 'important');
    container.style.setProperty('overflow', 'hidden', 'important');
    container.style.setProperty('transition', 'height 0.3s ease', 'important');

    // 5. Обновленный обработчик toggleHandler
    const toggleHandler = debounce(() => {
        
        // Ищем элемент автокомплита внутри контейнера
        const autocompleteList = container.querySelector('.InjectLayout-sc-1i43xsx-0.autocomplete-match-list');
        
        // 🔥 ПРИНУДИТЕЛЬНО СКРЫВАЕМ ПОПАП АВТОКОМПЛИТА ЭМОЦИЙ
        if (autocompleteList) {
            // Проверяем, что попап видим (по высоте)
            if (autocompleteList.offsetHeight > 0) { 
                autocompleteList.style.display = 'none'; // Скрываем
            }
        }

        const currentHeight = getComputedStyle(container).getPropertyValue('height');
        
        // ЛОГИКА СВОРАЧИВАНИЯ/РАЗВОРАЧИВАНИЯ
        if (currentHeight === '35px') {
            // Разворачиваем
            container.style.setProperty('height', '685px', 'important');
            button.innerHTML = `
                <div class="ScSvgWrapper-sc-wkgzod-0 dKXial tw-svg">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M13.5 14.5 9 10l4.5-4.5L12 4l-6 6 6 6 1.5-1.5z"></path>
                    </svg>
                </div>
            `;
        } else {
            // Сворачиваем
            container.style.setProperty('height', '35px', 'important');
            button.innerHTML = `
                <div class="ScSvgWrapper-sc-wkgzod-0 dKXial tw-svg">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M6.5 5.5 11 10l-4.5 4.5L8 16l6-6-6-6-1.5 1.5z"></path>
                    </svg>
                </div>
            `;
        }
    }, 200);

    button.addEventListener('click', toggleHandler);

    // 6. Вставка кнопки в контейнер
    container.insertBefore(button, container.firstChild);

    // 7. Отключение обсервера (если он активен)
    if (window.customObserver) {
        window.customObserver.disconnect();
        window.customObserver = null;
    }
}

    // Функция для поиска и инициализации контейнера
    function findAndInitialize() {
        const container = document.querySelector(containerSelector);
        if (container) {
            initializeContainer(container);
        }
    }

    // MutationObserver для наблюдения за изменениями в DOM
    function setupObserver() {
        if (window.customObserver) {
            window.customObserver.disconnect();
        }

        window.customObserver = new MutationObserver((mutations) => {
            let shouldInitialize = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (node.matches && node.matches(containerSelector) || node.querySelector(containerSelector))) {
                            shouldInitialize = true;
                        }
                    });
                }
            });
            if (shouldInitialize) {
                findAndInitialize();
            }
        });

        window.customObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Функция для мониторинга изменений URL
    function setupUrlMonitor() {
        let currentUrl = location.href;

        // Перехватываем pushState и replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(() => {
                    findAndInitialize();
                    setupObserver(); // Перезапускаем observer
                }, 500);
            }
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(() => {
                    findAndInitialize();
                    setupObserver(); // Перезапускаем observer
                }, 500);
            }
        };

        // Слушаем popstate
        window.addEventListener('popstate', () => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(() => {
                    findAndInitialize();
                    setupObserver(); // Перезапускаем observer
                }, 500);
            }
        });

        // Периодическая проверка на случай других изменений (например, прямой переход)
        setInterval(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(() => {
                    findAndInitialize();
                    setupObserver(); // Перезапускаем observer
                }, 500);
            }
        }, 2000);
    }

    // Инициализация
    findAndInitialize();
    setupObserver();
    setupUrlMonitor();

})();
 