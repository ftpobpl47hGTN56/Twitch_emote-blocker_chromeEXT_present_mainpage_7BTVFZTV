(function () {
    // ====== Константы и утилиты
    window.TwitchNickRenameConstants = {
        INVISIBLE_CHAR: '⠀',
        CHAT_SELECTORS: [
            '.chat-scrollable-area__message-container',
            '.chat-room__content',
            '.chat-list--default',
            '[data-a-target="chat-room-content"]',
            '.video-chat__message-list-wrapper',
            '.chat-container',
            '[data-test-selector="chat-room-component-layout"]',
            '[data-a-target="chat-scroller"]',
            '.Layout-sc-1xcs6mc-0.nvivF'
        ]
    };

    // Нормализация имени пользователя (вынесена как глобальная утилита)
    window.normalizeUsername = function (username, forKey = true) {
        if (!username || typeof username !== 'string') return '';
        const trimmed = username.trim();
        if (!trimmed) return '';
        return forKey
            ? trimmed.toLowerCase().replace(/[<>"';&]/g, '')
            : trimmed.replace(/[<>"';&]/g, '');
    };
})();