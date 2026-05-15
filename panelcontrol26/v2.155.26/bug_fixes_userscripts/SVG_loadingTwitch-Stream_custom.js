(function() {
    'use strict';

    // SVG иконка с измененным размером на 56x56
    const customSpinnerSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24">
            <title>90-ring-with-bg SVG Icon</title>
            <path fill="#51d2c3" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
            <path fill="#51d2c3" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
            </path>
        </svg>
    `;

    // Функция для замены спиннера
    function replaceSpinner(spinnerElement) {
        if (spinnerElement && spinnerElement.querySelector('.ScLoadingSpinnerCircle-sc-bvzaq8-1')) {
            const circleElement = spinnerElement.querySelector('.ScLoadingSpinnerCircle-sc-bvzaq8-1');
            if (circleElement) {
                circleElement.outerHTML = customSpinnerSVG;
            }
        }
    }

    // Функция для обработки всех существующих спиннеров
    function replaceAllSpinners() {
        const spinners = document.querySelectorAll('.tw-loading-spinner');
        spinners.forEach(replaceSpinner);
    }

    // Инициализация: заменить существующие спиннеры
    replaceAllSpinners();

    // Наблюдатель за изменениями DOM для перезапуска при навигации (новая страница или смена канала)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Проверяем добавленный узел и его потомков на наличие спиннеров
                        const newSpinners = node.querySelectorAll ? node.querySelectorAll('.tw-loading-spinner') : [];
                        if (node.classList && node.classList.contains('tw-loading-spinner')) {
                            newSpinners.push(node);
                        }
                        newSpinners.forEach(replaceSpinner);
                    }
                });
            }
        });
    });

    // Запуск наблюдателя на body (или на основном контейнере, если известен; здесь body для универсальности)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Дополнительно: обработка для SPA-навигации (если страница использует history API)
    let currentUrl = window.location.href;
    const historyListener = function() {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            // Небольшая задержка для полной загрузки DOM после навигации
            setTimeout(replaceAllSpinners, 100);
        }
    };

    // Подписка на события popstate (назад/вперед) и pushState/replaceState (если доступно)
    window.addEventListener('popstate', historyListener);
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function() {
        originalPushState.apply(history, arguments);
        historyListener();
    };
    history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        historyListener();
    };

})();