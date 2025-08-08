 // ======================================================================================================= //
(function () {
    'use strict';
    const chatInputSelector = '[data-a-target="chat-input"]';
    const tagSelector = '[data-a-target="stream-title"] a[href*="/"]';
    const popupSelector = 'div[data-popper-placement]';
    let userInteracted = false;
    let mouseSelecting = false;
    function isChatInputFocused() {
        const chatInput = document.querySelector(chatInputSelector);
        return chatInput && document.activeElement === chatInput;
    }
    function restoreCursorToEnd() {
        const chatInput = document.querySelector(chatInputSelector);
        if (chatInput && isChatInputFocused() && !userInteracted && !mouseSelecting) {
            console.log('>> Восстанавливаем курсор в конец');
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(chatInput);
            range.collapse(false); // курсор в конец
            selection.removeAllRanges();
            selection.addRange(range);
            chatInput.focus();
        }
        else {
            console.log('>> Пропускаем restoreCursorToEnd — взаимодействие пользователя');
        }
    }
    function blurChatInput() {
        const chatInput = document.querySelector(chatInputSelector);
        if (chatInput && isChatInputFocused()) {
            console.log('Снимаем фокус');
            chatInput.blur();
        }
    }
    // Клавиатура
    document.addEventListener('keydown', (event) => {
        if (isChatInputFocused()) {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace', 'Delete'].includes(event.key) ||
                (event.ctrlKey && event.key.toLowerCase() === 'a')) {
                userInteracted = true;
                console.log('>> Клавиатурное взаимодействие');
            }
            if (event.key === 'Escape') {
                blurChatInput();
            }
        }
    });
    // Мышь: отслеживаем попытку выделения
    document.addEventListener('mousedown', (event) => {
        const chatInput = document.querySelector(chatInputSelector);
        if (chatInput && chatInput.contains(event.target)) {
            mouseSelecting = true;
            console.log('>> Начало выделения мышью');
        }
    });
    document.addEventListener('mouseup', (event) => {
        if (mouseSelecting) {
            mouseSelecting = false;
            userInteracted = true;
            console.log('>> Конец выделения мышью');
        }
    });
    // Потеря фокуса сбрасывает флаги
    document.addEventListener('blur', (event) => {
        if (event.target.matches(chatInputSelector)) {
            userInteracted = false;
            mouseSelecting = false;
            console.log('>> Инпут потерял фокус — сброс флагов');
        }
    }, true);
    // Наведение мыши на теги — осторожно
    ['mouseenter', 'mouseover', 'mouseleave', 'mouseout'].forEach((eventName) => {
        document.addEventListener(eventName, (event) => {
            if (event.target.matches(tagSelector)) {
                if (isChatInputFocused()) {
                    console.log(`Событие ${eventName} на тег`);
                    setTimeout(restoreCursorToEnd, 50);
                }
            }
        }, true);
    });
    // Клик вне инпута — снимаем фокус
    document.addEventListener('click', (event) => {
        const chatInput = document.querySelector(chatInputSelector);
        if (chatInput && !chatInput.contains(event.target) && isChatInputFocused()) {
            blurChatInput();
        }
    });
    // MutationObserver: появление попапа
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                const popup = document.querySelector(popupSelector);
                if (popup && isChatInputFocused()) {
                    setTimeout(restoreCursorToEnd, 50);
                }
                else if (!popup && isChatInputFocused()) {
                    setTimeout(restoreCursorToEnd, 50);
                }
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
(function () {
    'use strict';
})();
//# sourceMappingURL=fix_autofocus_input_twtch_chat.js.map
