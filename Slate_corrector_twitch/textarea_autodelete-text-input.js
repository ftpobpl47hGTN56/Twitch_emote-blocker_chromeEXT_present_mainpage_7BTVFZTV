(function() {
    let lastUrl = location.href;
    let clearedForCurrent = false;

    function clearChatInput() {
        const input = document.querySelector('textarea[data-a-target="chat-input"]');
        if (input) {
            if (!clearedForCurrent) {
                const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                nativeSetter.call(input, '');

                const inputEvent = new Event('input', { bubbles: true });
                input.dispatchEvent(inputEvent);

                clearedForCurrent = true;
                console.log('Поле ввода чата очищено для текущего канала');
            }
        } else {
            console.log('Поле ввода ещё не найдено');
        }
    }

    function triggerClear() {
        clearedForCurrent = false;
        lastUrl = location.href;

        let attempts = 0;
        const interval = setInterval(() => {
            clearChatInput();
            attempts++;
            if (document.querySelector('textarea[data-a-target="chat-input"]') || attempts > 20) {
                clearInterval(interval);
            }
        }, 2000);
    }

    // Начальная очистка
    triggerClear();

    // Перехват изменений URL
    (function() {
        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            triggerClear();
            console.log('Обнаружена смена канала (pushState)');
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            triggerClear();
            console.log('Обнаружена смена канала (replaceState)');
        };
    })();

    window.addEventListener('popstate', function() {
        if (location.href !== lastUrl) {
            triggerClear();
            console.log('Обнаружена смена канала (popstate)');
        }
    });
})();