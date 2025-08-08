(function () {
    'use strict';
    const observeModalWarning = () => {
        const modalObserver = new MutationObserver((mutations, observer) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.getAttribute('aria-label') === 'Verification') {
                        console.log('Обнаружено модальное окно предупреждения.');
                        // Находим кнопку "Send Anyway"
                        const sendAnywayButton = node.querySelector('[data-a-target="nudge-secondary-button"]');
                        if (sendAnywayButton) {
                            // Немедленно нажимаем кнопку
                            sendAnywayButton.click();
                            console.log('Нажата кнопка "Send Anyway"');
                            // Предотвращаем дальнейшую обработку модального окна
                            mutation.target.removeChild(node);
                            console.log('Модальное окно удалено из DOM');
                        }
                        else {
                            console.warn('Кнопка "Send Anyway" не найдена.');
                        }
                    }
                });
            });
        });
        // Наблюдаем за изменениями в body
        modalObserver.observe(document.body, { childList: true, subtree: true });
        console.log('Наблюдение за модальным окном запущено.');
    };
    // Запуск после загрузки страницы
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        observeModalWarning();
    }
    else {
        document.addEventListener('DOMContentLoaded', observeModalWarning);
    }
    // Дополнительно: перехватываем события ввода в чате
    const chatInput = document.querySelector('[data-a-target="chat-input"]');
    if (chatInput) {
        chatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                console.log('Обнаружено нажатие Enter в чате, проверяем модальное окно...');
            }
        });
    }
})();
//# sourceMappingURL=auto_send_anyway.js.map