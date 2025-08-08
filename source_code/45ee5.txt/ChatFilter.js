// chat-filter.js module //
class ChatFilter {
    constructor({ getStorage, setStorage, showNotification, log }) {
        this.getStorage = getStorage || (() => null);
        this.setStorage = setStorage || (() => { });
        this.log = log || ((...args) => console.log(...args));
        this.isTextBlockingEnabled = this.getStorage('isTextBlockingEnabled', true);
        this.filteredMessages = new Map();
        this.processedColons = new Set();
        this.observer = null;
        this.retryCount = 0;
        this.maxRetries = 20;
        this.unusualSymbolsRegex = /[\u4E00-\u9FFF\u{1F000}-\u{1F9FF}]/gu;
        this.showNotification = showNotification || ((message, duration = 3000, isError = false) => {
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${isError ? 'bg-red-500' : 'bg-green-500'} text-white`;
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), duration);
        });
        this.filterTextInNode = this.filterTextInNode.bind(this);
        this.startTextFiltering = this.startTextFiltering.bind(this);
        this.stopTextFiltering = this.stopTextFiltering.bind(this);
        this.removeColons = this.removeColons.bind(this);
        this.isLinkText = this.isLinkText.bind(this);
        this.isBrailleText = this.isBrailleText.bind(this);
        this.debouncedFilterTextInNode = this.debounce(this.filterTextInNode, 100);
        // Ограничение размера коллекций
        this.maxFilteredMessages = 1000;
        this.maxProcessedColons = 1000;
    }
    // Debounce метод
    debounce(func, wait) {
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
    // Проверяет, содержит ли текст ссылки
    isLinkText(text) {
        const linkRegex = /\b((?:https?:\/\/|www\.)[a-zA-Z0-9\-\.]+(?:\.[a-zA-Z]{2,})(?:\/[^\s]*)?|[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)\b/gi;
        const matches = text.match(linkRegex);
        if (matches) {
            const allowedDomains = ['twitch.tv', 'youtube.com'];
            const isAllowed = matches.some(link => allowedDomains.some(domain => link.includes(domain)));
            if (!isAllowed) {
                this.log(`[ChatFilter] Detected links: ${matches.join(', ')}`);
                return true;
            }
        }
        return false;
    }
    // Проверяет, содержит ли текст символы Брайля
    isBrailleText(text) {
        const brailleRegex = /[\u2800-\u28FF]/u;
        return brailleRegex.test(text);
    }
    // Удаление двоеточий
    removeColons(node) {
        const colons = node.querySelectorAll('.chat-line__message-container > span[aria-hidden="true"]');
        const space = '⠀⠀  ';
        for (const colon of colons) {
            const colonId = colon.dataset.id || `${Date.now()}_${Math.random()}`;
            if (colon.textContent.trim() === ':' && !this.processedColons.has(colonId)) {
                colon.textContent = space;
                colon.dataset.id = colonId;
                this.processedColons.add(colonId);
                if (this.processedColons.size > this.maxProcessedColons) {
                    this.processedColons.clear(); // Очистка для предотвращения роста памяти
                }
            }
        }
    }
    // Остановка фильтрации
    stopTextFiltering() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
            this.log('[ChatFilter] Observer stopped');
        }
        this.filteredMessages.forEach(({ element }) => {
            if (element && element.style.display === 'none') {
                element.style.display = '';
            }
        });
        this.filteredMessages.clear();
        this.processedColons.clear();
        this.log('[ChatFilter] Filtering stopped, messages restored');
    }
    filterTextInNode(node) {
        try {
            if (!this.isTextBlockingEnabled) {
                return;
            }
            let bannedKeywords = this.getStorage('bannedKeywords', []);
            let bannedUsers = this.getStorage('bannedUsers', []);
            if (!Array.isArray(bannedKeywords)) {
                bannedKeywords = [];
                this.setStorage('bannedKeywords', bannedKeywords);
            }
            if (!Array.isArray(bannedUsers)) {
                bannedUsers = [];
                this.setStorage('bannedUsers', bannedUsers);
            }
            bannedUsers = bannedUsers.filter(user => user && (typeof user.userId === 'string' || typeof user.displayText === 'string'));
            this.setStorage('bannedUsers', bannedUsers);
            bannedKeywords = bannedKeywords.filter(keyword => keyword && keyword.text);
            this.setStorage('bannedKeywords', bannedKeywords);
            // Обрабатываем только новые сообщения
            const messages = node.classList?.contains('chat-line__message') ? [node] : node.querySelectorAll('.chat-line__message');
            for (const message of messages) {
                const messageContainer = message.querySelector('.message');
                const userId = message.dataset.userId || message.getAttribute('data-user-id') || 'unknown';
                const usernameElement = message.querySelector('.chat-author__display-name');
                let username = '';
                if (usernameElement) {
                    const customContainer = usernameElement.querySelector('.custom-nickname-container');
                    if (customContainer) {
                        username = customContainer.dataset.originalUsername ||
                            customContainer.querySelector('.original-nickname')?.textContent ||
                            usernameElement.textContent;
                    }
                    else {
                        username = usernameElement.textContent || '';
                    }
                    const loginName = message.querySelector('.chat-author__intl-login')?.textContent || '';
                    username = (username + loginName).trim().toLowerCase();
                }
                if (!userId || !username || !messageContainer) {
                    continue;
                }
                const isBannedUser = bannedUsers.some(user => (user.userId && user.userId === userId) ||
                    (!user.userId && user.displayText && user.displayText.toLowerCase() === username));
                const messageId = `${Date.now()}_${userId}`;
                if (isBannedUser) {
                    this.filteredMessages.set(messageId, {
                        element: messageContainer,
                        userId: userId,
                        keyword: username,
                        originalDisplay: messageContainer.style.display,
                        parent: messageContainer.parentNode,
                        nextSibling: messageContainer.nextSibling
                    });
                    messageContainer.style.display = 'none';
                    this.removeColons(message);
                    continue; // Пропускаем дальнейшую обработку
                }
                const textFragments = message.querySelectorAll('.text-fragment[data-a-target="chat-message-text"], .chat-line__message-mention');
                const linkFragments = message.querySelectorAll('a.ffz-tooltip.link-fragment');
                let fullText = '';
                textFragments.forEach(fragment => fullText += fragment.textContent + ' ');
                linkFragments.forEach(link => fullText += link.textContent + ' ');
                const lowerText = fullText.toLowerCase().trim();
                let modified = false;
                let matchedKeyword = null;
                if (this.isBrailleText(fullText)) {
                    matchedKeyword = 'braille_symbols';
                    modified = true;
                }
                else if (this.isLinkText(fullText)) {
                    matchedKeyword = 'link_detected';
                    modified = true;
                }
                else if (this.unusualSymbolsRegex.test(fullText)) {
                    matchedKeyword = 'unusual_symbols';
                    modified = true;
                }
                else {
                    for (const keyword of bannedKeywords) {
                        const searchText = keyword.text.toLowerCase();
                        const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const regex = keyword.isPhrase ? new RegExp(`\\b${escapedText}\\b`, 'gi') : new RegExp(`\\b${escapedText}\\b`, 'gi');
                        if (regex.test(lowerText)) {
                            fullText = fullText.replace(regex, '');
                            matchedKeyword = keyword.text;
                            modified = true;
                        }
                    }
                }
                if (modified && (matchedKeyword === 'braille_symbols' || matchedKeyword === 'unusual_symbols' || matchedKeyword === 'link_detected')) {
                    this.filteredMessages.set(messageId, {
                        element: messageContainer,
                        userId: userId,
                        keyword: matchedKeyword,
                        originalDisplay: messageContainer.style.display,
                        parent: messageContainer.parentNode,
                        nextSibling: messageContainer.nextSibling
                    });
                    messageContainer.style.display = 'none';
                }
                else if (modified) {
                    textFragments.forEach(fragment => {
                        this.filteredMessages.set(`${messageId}_${fragment.dataset.aTarget || fragment.className}`, {
                            element: fragment,
                            userId: userId,
                            keyword: matchedKeyword || 'unknown',
                            originalText: fragment.textContent,
                            parent: fragment.parentNode,
                            nextSibling: fragment.nextSibling
                        });
                        fragment.textContent = fullText.trim();
                    });
                }
                else {
                    if (messageContainer.style.display === 'none') {
                        messageContainer.style.display = '';
                    }
                    textFragments.forEach(fragment => {
                        if (fragment.style.display === 'none') {
                            fragment.style.display = '';
                        }
                        this.filteredMessages.delete(`${messageId}_${fragment.dataset.aTarget || fragment.className}`);
                    });
                    linkFragments.forEach(link => {
                        if (link.style.display === 'none') {
                            link.style.display = '';
                        }
                        this.filteredMessages.delete(`${messageId}_${link.href || link.className}`);
                    });
                }
                this.removeColons(message);
                // Ограничение размера filteredMessages
                if (this.filteredMessages.size > this.maxFilteredMessages) {
                    this.filteredMessages.clear();
                }
            }
        }
        catch (error) {
            this.log('[ChatFilter] Error in filterTextInNode:', error);
        }
    }
    setTextFilteringEnabled(enabled) {
        this.isTextBlockingEnabled = enabled;
        this.setStorage('isTextBlockingEnabled', enabled);
        if (enabled) {
            this.startTextFiltering();
        }
        else {
            this.stopTextFiltering();
            this.filteredMessages.forEach(({ element }) => {
                if (element && element.style) {
                    element.style.display = '';
                }
            });
            this.filteredMessages.clear();
            this.processedColons.clear();
        }
    }
    startTextFiltering() {
        if (!this.isTextBlockingEnabled) {
            return () => { };
        }
        const tryStartObserver = (attempt = 1) => {
            const chatContainer = document.querySelector('[data-test-selector="chat-scrollable-area__message-container"], .chat-scrollable-area__message-container');
            if (chatContainer) {
                if (this.observer) {
                    this.observer.disconnect();
                }
                this.observer = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.classList?.contains('chat-line__message')) {
                                this.debouncedFilterTextInNode(node);
                            }
                        });
                    });
                });
                this.observer.observe(chatContainer, { childList: true, subtree: true });
                this.debouncedFilterTextInNode(chatContainer);
                return this.observer;
            }
            else if (attempt <= this.maxRetries) {
                setTimeout(() => tryStartObserver(attempt + 1), 1000);
            }
        };
        this.observer = tryStartObserver();
        return () => this.stopTextFiltering();
    }
}
window.TextChatFilter = ChatFilter;
//# sourceMappingURL=ChatFilter.js.map