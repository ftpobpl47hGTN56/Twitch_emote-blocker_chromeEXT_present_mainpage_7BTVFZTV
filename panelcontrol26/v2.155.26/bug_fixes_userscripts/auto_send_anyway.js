(function () {
    'use strict';

   const clickSendAnyway = () => {
    const sendAnywayBtn = document.querySelector('button[data-a-target="nudge-secondary-button"][aria-label="Send Anyway"]');
    
    if (sendAnywayBtn) {
        sendAnywayBtn.click();
        console.log('Автоматически нажата кнопка "Send Anyway"');
        
        // Задержка перед попыткой закрытия модалки (дать время на отправку сообщения)
        setTimeout(() => {
            console.log('Запуск попыток закрытия модального окна');
            tryClickClose();
        }, 120);
        
        return true;
    }
    return false;
};

    const tryClickSendAnyway = (attemptsLeft = 15) => {
        if (clickSendAnyway() || attemptsLeft <= 0) {
            return;
        }
        setTimeout(() => tryClickSendAnyway(attemptsLeft - 1), 100);
    };

    const clickCloseButton = () => {
    const closeBtn = document.querySelector('button[data-a-target="modalClose"][aria-label="Close modal"]');
    
    if (closeBtn) {
        closeBtn.click();
        console.log('Автоматически нажата кнопка закрытия модального окна (крестик)');
        return true;
    }
    return false;
};

const tryClickClose = (attemptsLeft = 10) => {
    if (clickCloseButton() || attemptsLeft <= 0) {
        return;
    }
    setTimeout(() => tryClickClose(attemptsLeft - 1), 100);
};

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;

                const modal = node.querySelector ? node.querySelector('[aria-label="Verification"]') 
                                             || node.closest('[aria-label="Verification"]') 
                                             : null;

                if (modal || (node.getAttribute && node.getAttribute('aria-label') === 'Verification')) {
                    console.log('Обнаружено модальное окно с предупреждением об оскорблениях');
                    tryClickSendAnyway();
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Автоматическое подтверждение "Send Anyway" активно (2025 версия)');

    // Проверка при загрузке скрипта, если модальное окно уже открыто
   // Проверка при загрузке скрипта, если модальное окно уже открыто
setTimeout(() => {
    if (document.querySelector('[aria-label="Verification"]')) {
        console.log('Модальное окно уже открыто при запуске скрипта');
        tryClickSendAnyway();
    }
}, 80);

setTimeout(() => {
    if (document.querySelector('[aria-label="Verification"]')) {
        tryClickSendAnyway();
    }
}, 100);

})();