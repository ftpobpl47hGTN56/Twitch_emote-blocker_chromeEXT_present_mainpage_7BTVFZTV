// rename-users-nickname/core.js

(function () {
    const { INVISIBLE_CHAR, CHAT_SELECTORS } = window.TwitchNickRenameConstants;

    class RenameNicknamesInstantFull {
        constructor({ getStorage, setStorage, log }) {
            this.getStorage = getStorage || (() => null);
            this.setStorage = setStorage || (() => { });
            this.log = log || ((...args) => console.log(...args));
            this.isRenameNickEnabled = this.getStorage('isRenameNickEnabled', true);
            this.renamedUsersCache = this.getStorage('renamedTwitchUsers', {});
            this.processedMessages = new WeakMap();
            this.observer = null;
            this.styleElement = null;
            this.lastChannel = window.location.pathname.split('/')[1] || null;
            this.checkInterval = null;
        }

        // Все методы класса из оригинального кода (без изменений, кроме использования window.normalizeUsername)
        getOriginalUsernameFromMessage(messageElement) {
            const container = messageElement.querySelector('.custom-nickname-container');
            if (container && container.dataset.originalUsername) {
                return container.dataset.originalUsername;
            }
            const displayNameElement = messageElement.querySelector('.chat-author__display-name');
            const loginElement = messageElement.querySelector('.chat-author__intl-login');
            let displayName = displayNameElement?.textContent?.trim();
            const login = loginElement?.textContent?.replace(/[()]/g, '').trim();
            if (!displayName && login) {
                displayName = login;
            }
            if (!displayName) {
                this.log('[_Rename_twitch_Nick_names_] No username found for message element');
                return '';
            }
            return login && displayName !== login
                ? window.normalizeUsername(`${displayName} (${login})`, true)
                : window.normalizeUsername(displayName, true);
        }

        replaceColonInMessage(messageElement) {
            const usernameSpan = messageElement.querySelector('.chat-author__display-name');
            const colonSpan = usernameSpan?.nextElementSibling;
            if (colonSpan &&
                colonSpan.getAttribute('aria-hidden') === 'true' &&
                colonSpan.textContent.trim() === ':') {
                colonSpan.textContent = INVISIBLE_CHAR + ' ';
            }
        }

        applyCustomNickname(messageElement, forceUpdate = false) {
            if (!this.isRenameNickEnabled || !messageElement.isConnected) return;
            if (!forceUpdate && this.processedMessages.has(messageElement)) return;

            const usernameElement = messageElement.querySelector('.chat-author__display-name');
            if (!usernameElement) {
                this.log(`[_Rename_twitch_Nick_names_] No usernameElement found in message:`, messageElement);
                return;
            }

            const originalUsername = this.getOriginalUsernameFromMessage(messageElement);
            if (!originalUsername) {
                this.log(`[_Rename_twitch_Nick_names_] No originalUsername found in message:`, messageElement);
                return;
            }

            const newNickname = this.renamedUsersCache[originalUsername] || null;

            let container = usernameElement.querySelector('.custom-nickname-container');
            if (!container) {
                container = document.createElement('span');
                container.className = 'custom-nickname-container';
                container.dataset.originalUsername = originalUsername;
                const originalNickSpan = document.createElement('span');
                originalNickSpan.className = 'original-nickname';
                originalNickSpan.textContent = usernameElement.textContent || originalUsername;
                container.appendChild(originalNickSpan);
                usernameElement.innerHTML = '';
                usernameElement.appendChild(container);
                this.log(`[_Rename_twitch_Nick_names_] Created new container for "${originalUsername}"`);
            }

            const existingCustomNick = container.querySelector('.custom-nickname');
            if (existingCustomNick) {
                existingCustomNick.remove();
                this.log(`[_Rename_twitch_Nick_names_] Removed existing custom-nickname for "${originalUsername}"`);
            }

            if (newNickname) {
                const customNickSpan = document.createElement('span');
                customNickSpan.className = 'custom-nickname';
                customNickSpan.textContent = newNickname;
                container.appendChild(customNickSpan);
                this.log(`[_Rename_twitch_Nick_names_] Added custom nickname "${newNickname}" for "${originalUsername}"`);
            } else {
                this.log(`[_Rename_twitch_Nick_names_] No custom nickname for "${originalUsername}", using original`);
            }

            this.replaceColonInMessage(messageElement);
            this.processedMessages.set(messageElement, { originalUsername, newNickname });
            messageElement.dataset.processed = 'true';
            this.log(`[_Rename_twitch_Nick_names_] Applied nickname "${newNickname || originalUsername}" for "${originalUsername}" in message`);
        }

        startPeriodicCheck() {
            if (this.checkInterval) clearInterval(this.checkInterval);
            this.checkInterval = setInterval(() => {
                const chatContainer = this.findChatContainer();
                if (chatContainer) {
                    this.updateChatNicknamesForAll();
                }
            }, 200);
            this.log('[_Rename_twitch_Nick_names_] Periodic check started');
        }

        startRootObserver() {
            const rootElement = document.querySelector('.video-player, .channel-root, .twitch-player') || document.body;
            const rootObserver = new MutationObserver(() => {
                const chatContainer = this.findChatContainer();
                if (chatContainer) {
                    this.observeChatMessages();
                    rootObserver.disconnect();
                }
            });
            rootObserver.observe(rootElement, { childList: true, subtree: true });
            this.log('[_Rename_twitch_Nick_names_] RootObserver started');
        }

        observeChatMessages(doc = document) {
            if (!this.isRenameNickEnabled) return;
            const chatContainer = this.findChatContainer(doc);
            if (!chatContainer) {
                this.startRootObserver();
                return;
            }
            if (this.observer) this.observer.disconnect();

            this.observer = new MutationObserver((mutations) => {
                let chatCleared = false;
                mutations.forEach(mutation => {
                    if (mutation.removedNodes.length > 0) {
                        mutation.removedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('chat-line__message')) {
                                chatCleared = true;
                                this.processedMessages.delete(node);
                            }
                        });
                    }
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;
                        if (node.classList.contains('chat-line__message')) {
                            this.applyCustomNickname(node);
                        } else {
                            node.querySelectorAll('.chat-line__message').forEach(msg => this.applyCustomNickname(msg));
                        }
                    });
                });
                if (chatCleared) {
                    this.log('[_Rename_twitch_Nick_names_] Chat cleared, reapplying nicknames...');
                    this.updateChatNicknamesForAll(doc);
                }
            });

            this.observer.observe(chatContainer, { childList: true, subtree: true });
            this.log('[_Rename_twitch_Nick_names_] Observer started');
            this.updateChatNicknamesForAll(doc);
        }

        findChatContainer(doc = document) {
            return CHAT_SELECTORS.reduce((found, selector) => found || doc.querySelector(selector), null);
        }

        updateChatNicknamesForAll(doc = document) {
            if (!this.isRenameNickEnabled) return;
            const messageElements = Array.from(doc.querySelectorAll('.chat-line__message:not([data-processed])'));
            messageElements.forEach(message => this.applyCustomNickname(message));
        }

        async cleanRenamedUserKeys() {
            const key = 'renamedTwitchUsers';
            const rawData = localStorage.getItem(key);
            if (!rawData) return;
            let renamedUsers;
            try {
                renamedUsers = JSON.parse(rawData);
            } catch (e) {
                this.log('[_Rename_twitch_Nick_names_] Failed to parse renamed nicknames:', e);
                return;
            }
            const cleaned = {};
            for (const originalKey in renamedUsers) {
                const value = renamedUsers[originalKey];
                const newNickname = typeof value === 'string' ? value.replace(/[<>"';&]/g, '') : '';
                if (!newNickname || newNickname.match(/^\s*$/)) continue;
                const cleanKey = window.normalizeUsername(originalKey, true);
                cleaned[cleanKey] = newNickname;
            }
            localStorage.setItem(key, JSON.stringify(cleaned));
            this.renamedUsersCache = cleaned;
            this.log('[_Rename_twitch_Nick_names_] Cleaned renamed users cache');
        }

        async updateChatNicknamesForUser(originalUsername, doc = document, forceUpdate = true) {
            this.log(`[_Rename_twitch_Nick_names_] Starting update for user "${originalUsername}"`);
            const messageElements = Array.from(doc.querySelectorAll('.chat-line__message'));
            let processedCount = 0;
            for (const message of messageElements) {
                if (!message.isConnected) continue;
                const messageOriginalUsername = this.getOriginalUsernameFromMessage(message);
                if (messageOriginalUsername !== originalUsername) continue;
                this.processedMessages.delete(message);
                delete message.dataset.processed;
                this.log(`[_Rename_twitch_Nick_names_] Found message for "${originalUsername}"`);
                this.applyCustomNickname(message, true);
                processedCount++;
            }
            this.log(`[_Rename_twitch_Nick_names_] Updated ${processedCount} messages for "${originalUsername}"`);
            if (processedCount === 0) {
                this.log(`[_Rename_twitch_Nick_names_] No messages found for "${originalUsername}"`);
            }
        }

        monitorChannelChange() {
            const checkChannel = () => {
                const currentChannel = window.location.pathname.split('/')[1] || null;
                if (currentChannel && currentChannel !== this.lastChannel) {
                    this.lastChannel = currentChannel;
                    this.processedMessages = new WeakMap();
                    this.observeChatMessages();
                    this.startPeriodicCheck();
                }
            };
            window.addEventListener('popstate', checkChannel);
            window.addEventListener('load', checkChannel);
        }

        handleVisibilityChange() {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && this.isRenameNickEnabled) {
                    this.log('[_Rename_twitch_Nick_names_] Tab visible, reapplying nicknames...');
                    this.updateChatNicknamesForAll();
                    this.startPeriodicCheck();
                }
            });
        }

        async init() {
            await this.cleanRenamedUserKeys();
            if (!await this.getStorage('renamedTwitchUsers')) {
                await this.setStorage('renamedTwitchUsers', {});
            }
            this.renamedUsersCache = await this.getStorage('renamedTwitchUsers', {});
            if (this.isRenameNickEnabled) {
                this.observeChatMessages();
                this.monitorChannelChange();
                this.handleVisibilityChange();
                this.startPeriodicCheck();
            }
            window.addEventListener('storage', (event) => {
                if (event.key === 'isRenameNickEnabled') {
                    const newValue = JSON.parse(event.newValue || 'false');
                    if (newValue !== this.isRenameNickEnabled) {
                        this.isRenameNickEnabled = newValue;
                        if (newValue) {
                            this.observeChatMessages();
                            this.monitorChannelChange();
                            this.startPeriodicCheck();
                        } else {
                            if (this.observer) this.observer.disconnect();
                            if (this.checkInterval) clearInterval(this.checkInterval);
                            this.processedMessages = new WeakMap();
                        }
                    }
                }
            });
            this.log('[_Rename_twitch_Nick_names_] Module core initialized');
        }
    }

    window.RenameNicknamesInstantFull = RenameNicknamesInstantFull;
})();