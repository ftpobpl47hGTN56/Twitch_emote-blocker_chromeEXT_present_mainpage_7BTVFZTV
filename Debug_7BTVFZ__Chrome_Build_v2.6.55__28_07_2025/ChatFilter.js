

// chat-filter.js module //
class ChatFilter {
    constructor({ getStorage, setStorage, showNotification, log }) {
        this.getStorage = getStorage || (() => null);
        this.setStorage = setStorage || (() => {});
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
            notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
                isError ? 'bg-red-500' : 'bg-green-500'
            } text-white`;
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.remove();
            }, duration);
        });
        // Привязываем методы к экземпляру класса
        this.filterTextInNode = this.filterTextInNode.bind(this);
        this.startTextFiltering = this.startTextFiltering.bind(this);
        this.stopTextFiltering = this.stopTextFiltering.bind(this);
        this.removeColons = this.removeColons.bind(this);
        this.isLinkText = this.isLinkText.bind(this);
        this.isBrailleText = this.isBrailleText.bind(this);
    }

    // Оптимизированный метод removeColons
    removeColons(node = document) {
        const colons = node.querySelectorAll('.chat-line__message-container > span[aria-hidden="true"]');
        const space = '⠀⠀  ';
        colons.forEach(colon => {
            const colonId = colon.dataset.id || `${Date.now()}_${Math.random()}`;
            if (colon.textContent.trim() === ':' && !this.processedColons.has(colonId)) {
                colon.textContent = space;
                colon.dataset.id = colonId;
                this.processedColons.add(colonId);
                this.log('[ChatFilter] Replaced colon with a single space');
            }
        });
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
                this.log(`[ChatFilter] Detected links in text: ${matches.join(', ')}`);
                return true;
            } else {
                this.log(`[ChatFilter] Links allowed (in whitelist): ${matches.join(', ')}`);
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
            this.log('[ChatFilter] Text filtering observer stopped');
        }
        this.filteredMessages.forEach(({ element }, messageId) => {
            if (element && element.parentNode && element.style.display === 'none') {
                element.style.display = '';
                this.log(`[ChatFilter] Restored element (messageId: ${messageId})`);
            }
        });
        this.filteredMessages.clear();
        this.processedColons.clear();
        this.log('[ChatFilter] Text filtering stopped and messages restored');
    }

    filterTextInNode(node) {
        try {
            if (!this.isTextBlockingEnabled) {
                this.log('[ChatFilter] Text blocking disabled, skipping...');
                return;
            }

            let bannedKeywords = this.getStorage('bannedKeywords', []);
            let bannedUsers = this.getStorage('bannedUsers', []);

            if (!Array.isArray(bannedKeywords)) {
                this.log('[ChatFilter] Error: bannedKeywords is not an array, resetting to empty array');
                bannedKeywords = [];
                this.setStorage('bannedKeywords', bannedKeywords);
            }
            if (!Array.isArray(bannedUsers)) {
                this.log('[ChatFilter] Error: bannedUsers is not an array, resetting to empty array');
                bannedUsers = [];
                this.setStorage('bannedUsers', bannedUsers);
            }

            bannedUsers = bannedUsers.filter(user => {
                const isValid = user && (typeof user.userId === 'string' || typeof user.displayText === 'string');
                if (!isValid) {
                    this.log('[ChatFilter] Invalid banned user entry, removing:', user);
                }
                return isValid;
            });
            this.setStorage('bannedUsers', bannedUsers);

            bannedKeywords = bannedKeywords.filter(keyword => {
                const isValid = keyword && keyword.text;
                if (!isValid) {
                    this.log('[ChatFilter] Invalid banned keyword entry, removing:', keyword);
                }
                return isValid;
            });
            this.setStorage('bannedKeywords', bannedKeywords);

            this.log('[ChatFilter] Loaded banned keywords:', bannedKeywords);
            this.log('[ChatFilter] Loaded banned users:', bannedUsers);

            const messages = node.querySelectorAll('.chat-line__message, [data-a-target="chat-message"], .chat-line');
            this.log(`[ChatFilter] Found ${messages.length} messages to process`);
       // обновляем userId и username для кстомных никнеймов для фильтрации 
      messages.forEach(message => {
            const textFragments = message.querySelectorAll('.text-fragment[data-a-target="chat-message-text"], .chat-line__message-mention');
            const linkFragments = message.querySelectorAll('a.ffz-tooltip.link-fragment');
            const userId = message.dataset.userId || message.dataset.user || message.getAttribute('data-user-id') || 'unknown';

            // Извлекаем оригинальный никнейм
            const usernameElement = message.querySelector('.chat-author__display-name');
            let username = '';
            if (usernameElement) {
                const customContainer = usernameElement.querySelector('.custom-nickname-container');
                if (customContainer) {
                    // Используем атрибут data-original-username или текст из .original-nickname
                    username = customContainer.dataset.originalUsername || 
                              customContainer.querySelector('.original-nickname')?.textContent || 
                              usernameElement.textContent;
                } else {
                    username = usernameElement.textContent || '';
                }
                const loginName = message.querySelector('.chat-author__intl-login')?.textContent || '';
                username = (username + loginName).trim().toLowerCase();
            }

            if (!userId || !username) {
                this.log('[ChatFilter] Skipping message: missing userId or username', { userId, username });
                return;
            } // обновляем userId и username для кстомных никнеймов для фильтрации 
                this.log(`[ChatFilter] Extracted userId: ${userId}, username: ${username}, bannedUsers:`, bannedUsers);

                let fullText = '';
                textFragments.forEach(fragment => {
                    fullText += fragment.textContent + ' ';
                });
                linkFragments.forEach(link => {
                    fullText += link.textContent + ' ';
                });
                const lowerText = fullText.toLowerCase().trim();
                this.log(`[ChatFilter] Processing message (user: ${username}, userId: ${userId}, text: ${fullText})`);

                let modified = false;
                let matchedKeyword = null;

                if (this.isBrailleText(fullText)) {
                    matchedKeyword = 'braille_symbols';
                    modified = true;
                }

                const isBannedUser = bannedUsers.some(user => 
                    (user.userId && user.userId === userId) || 
                    (!user.userId && user.displayText && user.displayText.toLowerCase() === username)
                );

                if (!modified && isBannedUser && this.isLinkText(fullText)) {
                    matchedKeyword = 'link_detected';
                    modified = true;
                }

                if (!modified && isBannedUser) {
                    matchedKeyword = username;
                    modified = true;
                }

                let newText = fullText;
                if (!modified) {
                    for (const keyword of bannedKeywords) {
                        const searchText = keyword.text.toLowerCase();
                        const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        let regex = keyword.isPhrase 
                            ? new RegExp(`\\b${escapedText}\\b`, 'gi') 
                            : new RegExp(`\\b${escapedText}\\b`, 'gi');

                        if (regex.test(lowerText)) {
                            newText = newText.replace(regex, '');
                            matchedKeyword = keyword.text;
                            modified = true;
                            this.log(`[ChatFilter] Replaced keyword "${keyword.text}" in message (userId: ${userId})`);
                        }
                    }
                }

                if (!modified && this.unusualSymbolsRegex.test(fullText)) {
                    matchedKeyword = 'unusual_symbols';
                    modified = true;
                }

                const hasEmote = message.querySelector('img[src*="cdn.7tv.app/emote"], img[src*="static-cdn.jtvnw.net/emoticons"]') !== null;
                const messageId = `${Date.now()}_${userId}`;

                if (modified) {
                    if (isBannedUser || matchedKeyword === 'braille_symbols' || matchedKeyword === 'unusual_symbols') {
                        textFragments.forEach(fragment => {
                            this.filteredMessages.set(`${messageId}_${fragment.dataset.aTarget || fragment.className}`, {
                                element: fragment,
                                userId: userId,
                                keyword: matchedKeyword || 'unknown',
                                originalText: fragment.textContent,
                                parent: fragment.parentNode,
                                nextSibling: fragment.nextSibling
                            });
                            fragment.style.display = 'none';
                            this.log(`[ChatFilter] Hid text fragment (userId: ${userId}, username: ${username}, keyword: ${matchedKeyword}, text: ${fragment.textContent})`);
                        });
                        linkFragments.forEach(link => {
                            this.filteredMessages.set(`${messageId}_${link.href || link.className}`, {
                                element: link,
                                userId: userId,
                                keyword: matchedKeyword || 'unknown',
                                originalText: link.textContent,
                                parent: link.parentNode,
                                nextSibling: link.nextSibling
                            });
                            link.style.display = 'none';
                            this.log(`[ChatFilter] Hid link fragment (userId: ${userId}, username: ${username}, keyword: ${matchedKeyword}, text: ${link.textContent})`);
                        });
                    } else {
                        textFragments.forEach(fragment => {
                            this.filteredMessages.set(`${messageId}_${fragment.dataset.aTarget || fragment.className}`, {
                                element: fragment,
                                userId: userId,
                                keyword: matchedKeyword || 'unknown',
                                originalText: fragment.textContent,
                                parent: fragment.parentNode,
                                nextSibling: fragment.nextSibling
                            });
                            fragment.textContent = newText.trim();
                            this.log(`[ChatFilter] Updated text fragment (userId: ${userId}, username: ${username}, keyword: ${matchedKeyword}, new text: ${fragment.textContent})`);
                        });
                    }
                } else if (!isBannedUser) {
                    textFragments.forEach(fragment => {
                        if (fragment.style.display === 'none') {
                            fragment.style.display = '';
                            this.log(`[ChatFilter] Restored text fragment (userId: ${userId}, username: ${username}, text: ${fragment.textContent}${hasEmote ? ', has emote' : ''})`);
                        }
                        this.filteredMessages.delete(`${messageId}_${fragment.dataset.aTarget || fragment.className}`);
                    });
                    linkFragments.forEach(link => {
                        if (link.style.display === 'none') {
                            link.style.display = '';
                            this.log(`[ChatFilter] Restored link fragment (userId: ${userId}, username: ${username}, text: ${link.textContent}${hasEmote ? ', has emote' : ''})`);
                        }
                        this.filteredMessages.delete(`${messageId}_${link.href || link.className}`);
                    });
                }

                this.removeColons(message);
            });
        } catch (error) {
            this.log('[ChatFilter] Error in filterTextInNode:', error);
        }
    }

    setTextFilteringEnabled(enabled) {
        this.isTextBlockingEnabled = enabled;
        this.setStorage('isTextBlockingEnabled', enabled);
        this.log(`[ChatFilter] Text filtering ${enabled ? 'enabled' : 'disabled'}`);
        if (enabled) {
            this.startTextFiltering();
        } else {
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
        this.log('[ChatFilter] Starting text filtering...');
        this.isTextBlockingEnabled = this.getStorage('isTextBlockingEnabled', true);
        this.log('[ChatFilter] Text filtering enabled:', this.isTextBlockingEnabled);

        if (!this.isTextBlockingEnabled) {
            this.log('[ChatFilter] Text filtering disabled, skipping...');
            return () => {};
        }

        const tryStartObserver = (attempt = 1) => {
            const chatContainer = document.querySelector(
                '.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-test-selector="chat-scrollable-area__message-container"]'
            );
            this.log(`[ChatFilter] Checking chat container (attempt ${attempt}/${this.maxRetries}):`, !!chatContainer);

            if (chatContainer) {
                this.log('[ChatFilter] Chat container found:', chatContainer);
                if (this.observer) {
                    this.observer.disconnect();
                }
                this.observer = new MutationObserver((mutations) => {
                    this.log('[ChatFilter] Chat changes detected, applying filter...');
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                this.filterTextInNode(node);
                            }
                        });
                    });
                });
                this.observer.observe(chatContainer, { childList: true, subtree: true });
                this.log('[ChatFilter] Text filtering observer started');
                this.filterTextInNode(chatContainer);
                return this.observer;
            } else if (attempt <= this.maxRetries) {
                this.log(`[ChatFilter] Chat container not found, attempt ${attempt}/${this.maxRetries}...`);
                setTimeout(() => tryStartObserver(attempt + 1), 1000);
            } else {
                this.log('[ChatFilter] Chat container not found after all attempts');
            }
        };

        this.observer = tryStartObserver();
        return () => this.stopTextFiltering();
    }
}

window.TextChatFilter = ChatFilter;