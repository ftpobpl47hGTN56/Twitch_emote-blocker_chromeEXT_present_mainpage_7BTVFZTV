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
        document.querySelectorAll('.chat-link-blurred').forEach(el => {
        el.classList.remove('chat-link-blurred');
        });
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
             // Создаём резервные копии всех текстовых фрагментов перед возможными изменениями
                textFragments.forEach(fragment => {
                    this.filteredMessages.set(`${messageId}_${fragment.dataset.aTarget || fragment.className}`, {
                        element: fragment,
                        userId: userId,
                        keyword: 'pending', // Временное значение, обновим, если будет модификация
                        originalText: fragment.textContent,
                        parent: fragment.parentNode,
                        nextSibling: fragment.nextSibling
                    });
                });

                let modified = false;
                let matchedKeyword = null;

                for (const keyword of bannedKeywords) {
                    const searchText = keyword.text.toLowerCase();
                    const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = keyword.isPhrase ? new RegExp(`\\b${escapedText}\\b`, 'gi') : new RegExp(`\\b${escapedText}\\b`, 'gi');
                    if (regex.test(lowerText)) {
                        matchedKeyword = keyword.text;
                        modified = true;
                        textFragments.forEach(fragment => {
                            fragment.textContent = fragment.textContent.replace(regex, '');
                        });
                    }
                }

                if (modified) {
                    // Обновляем ключевое слово в резервных копиях, теперь известно
                    textFragments.forEach(fragment => {
                        const key = `${messageId}_${fragment.dataset.aTarget || fragment.className}`;
                        const entry = this.filteredMessages.get(key);
                        if (entry) {
                            entry.keyword = matchedKeyword || 'unknown';
                        }
                    });
                } else {
                    // Изменений нет, удаляем резервные копии
                    textFragments.forEach(fragment => {
                        this.filteredMessages.delete(`${messageId}_${fragment.dataset.aTarget || fragment.className}`);
                    });
                }
                                }
             if (modified && (matchedKeyword === 'braille_symbols' || matchedKeyword === 'unusual_symbols')) {
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

                if (modified && matchedKeyword === 'link_detected') {
                    textFragments.forEach(fragment => fragment.classList.add('chat-link-blurred'));
                    linkFragments.forEach(link => link.classList.add('chat-link-blurred'));
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
    if (!document.getElementById('chat-filter-styles')) {
        const style = document.createElement('style');
        style.id = 'chat-filter-styles';
        style.textContent = `
            .chat-link-blurred {
                filter: blur(4px);
                transition: filter 0.2s ease;
                cursor: pointer;
            }
            .chat-link-blurred:hover {
                filter: blur(0px);
            }
        `;
        document.head.appendChild(style);
    }

    if (!this.isTextBlockingEnabled) {
        this.log('[ChatFilter] Text filtering is disabled, skipping...');
        return () => {};
    }
    const tryStartObserver = (attempt = 1) => {
        const chatContainer = document.querySelector('[data-test-selector="chat-scrollable-area__message-container"], .chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, .vod-message');
        if (chatContainer) {
            this.log('[ChatFilter] Chat container found, applying initial filtering...');
            // Немедленная фильтрация
            this.debouncedFilterTextInNode(chatContainer);
            // Настройка наблюдателя
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
            this.log('[ChatFilter] Text filtering observer started');
            return this.observer;
        } else if (attempt <= this.maxRetries) {
            this.log(`[ChatFilter] Chat container not found, retrying (${attempt}/${this.maxRetries})...`);
            setTimeout(() => tryStartObserver(attempt + 1), 500); // Уменьшаем задержку
        } else {
            this.log('[ChatFilter] Chat container not found after max retries');
            // Запускаем root observer
            startUnifiedRootObserver();
        }
    };
    // Немедленно выполняем фильтрацию, если контейнер уже доступен
    const chatContainer = document.querySelector('[data-test-selector="chat-scrollable-area__message-container"], .chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, .vod-message');
    if (chatContainer) {
        this.debouncedFilterTextInNode(chatContainer);
    }
    this.observer = tryStartObserver();
    return () => this.stopTextFiltering();
    }
}
window.TextChatFilter = ChatFilter;
 