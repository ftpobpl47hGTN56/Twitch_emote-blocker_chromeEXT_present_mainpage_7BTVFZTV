// -------------------- colon replacer in chat -------------------- //

// Скрипт для замены двоеточия на невидимый символ '⠀' после логина в новых сообщениях чата
(function () {
    const INVISIBLE_CHAR = '⠀';
    // Функция для замены двоеточия на невидимый символ
    function replaceColonInMessage(messageDiv) {
        const usernameSpan = messageDiv.querySelector('.chat-line__username');
        const colonSpan = usernameSpan ? usernameSpan.nextElementSibling : null;
        if (colonSpan &&
            colonSpan.getAttribute('aria-hidden') === 'true' &&
            colonSpan.textContent.trim() === ':') {
            colonSpan.textContent = INVISIBLE_CHAR + ' ';
        }
    }
    // Наблюдатель для отслеживания новых сообщений
    const chatContainer = document.querySelector('body'); // Используйте более точный селектор, если чат в другом контейнере
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 &&
                    node.classList.contains('chat-line__message')) {
                    replaceColonInMessage(node);
                }
                else if (node.nodeType === 1) {
                    // Иногда добавляются фрагменты, ищем внутри
                    const messageDivs = node.querySelectorAll('.chat-line__message');
                    messageDivs.forEach(replaceColonInMessage);
                }
            }
        }
    });
    // Запускаем наблюдение за добавлением новых сообщений
    observer.observe(chatContainer, {
        childList: true,
        subtree: true
    });
    // Также заменяем в уже существующих сообщениях (при перезапуске скрипта)
    document.querySelectorAll('.chat-line__message').forEach(replaceColonInMessage);
})();
//# sourceMappingURL=ColonReplacer_in_chat.js.map