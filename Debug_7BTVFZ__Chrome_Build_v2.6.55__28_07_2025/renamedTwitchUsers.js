

class RenameNicknames {
    constructor({ getStorage, setStorage, log }) {
        this.getStorage = getStorage || (() => null);
        this.setStorage = setStorage || (() => {});
        this.log = log || ((...args) => console.log(...args));
        this.isRenameNickEnabled = this.getStorage('isRenameNickEnabled', true);
      this.junkUnicodeRegex = /[\u{1F000}-\u{1F9FF}\u{FE00}-\u{FEFF}\u{FFF0}-\u{FFFF}\u{0600}-\u{06FF}]{3,}/u;
      this.junkNickHandlingMode = this.getStorage('junkNickHandlingMode', 'removeDisplayName'); // 'removeDisplayName' или 'addUnderscores'
        this.retryCount = 0;
        this.maxRetries = 50;
        this.observer = null;
        this.observerIsActive = false;
        this.isResetting = false;
        this.isUpdatingAll = false; // Флаг для предотвращения дублирующих вызовов
        this.isUpdatingUser = false; // Флаг для предотвращения дублирующих вызовов
        this.lastChannel = window.location.pathname.split('/')[1] || null;
        this.chatSelectors = [
            '.chat-scrollable-area__message-container',
            '.chat-room__content',
            '.chat-list--default',
            '[data-a-target="chat-room-content"]',
            '.video-chat__message-list-wrapper',
            '.chat-container',
            '[data-test-selector="chat-room-component-layout"]'
        ];
        this.lastMessageCount = 0;
        this.isChatResetting = false;
        this.renamedUsersCache = this.getStorage('renamedTwitchUsers', {});
        this.processedMessages = new Map();
        this.styleElement = null;
    }
 
 async updateRenamedUsersCache() {
    try {
        const renamedUsers = await this.getStorage('renamedTwitchUsers', {});
        this.renamedUsersCache = renamedUsers || {};

        // Ограничение на максимальное количество кастомных никнеймов
        const maxNicknames = 1000;
        const keys = Object.keys(this.renamedUsersCache);
        if (keys.length > maxNicknames) {
            const oldestKeys = keys.slice(0, keys.length - maxNicknames);
            oldestKeys.forEach(key => delete this.renamedUsersCache[key]);
            await this.setStorage('renamedTwitchUsers', this.renamedUsersCache);
            this.log(`[RenameNicknames] Removed ${oldestKeys.length} oldest nicknames to enforce limit of ${maxNicknames}`);
        }

        // Очистка устаревших записей в processedMessages
        for (const [messageId, data] of this.processedMessages) {
            if (!this.renamedUsersCache[data.originalUsername] || 
                this.renamedUsersCache[data.originalUsername] !== data.newNickname) {
                this.processedMessages.delete(messageId);
            }
        }
        // Ограничение на размер processedMessages
        const maxProcessedMessages = 700;
        if (this.processedMessages.size > maxProcessedMessages) {
            const entries = Array.from(this.processedMessages.entries());
            const toRemove = entries.slice(0, entries.length - maxProcessedMessages);
            toRemove.forEach(([messageId]) => this.processedMessages.delete(messageId));
            this.log(`[RenameNicknames] Removed ${toRemove.length} oldest processed messages to enforce limit of ${maxProcessedMessages}`);
        }

        this.log('[RenameNicknames] Renamed users cache updated:', this.renamedUsersCache);
    } catch (error) {
        this.log('[RenameNicknames] Error updating renamed users cache:', error);
    }
}

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

    normalizeUsername(username) {
        if (!username || typeof username !== 'string') {
            this.log('[NormalizeUsername] Invalid username provided:', username);
            return '';
        }
        const trimmed = username.trim();
        if (!trimmed) {
            this.log('[NormalizeUsername] Empty username after trimming');
            return '';
        }
        const hasNonLatin = /[^-\u007F]/.test(trimmed);
        const normalized = hasNonLatin ? trimmed : trimmed.toLowerCase();
        this.log(`[NormalizeUsername] Normalized "${username}" to "${normalized}"`);
        return normalized;
    }

 // Новый метод для обработки мусорных никнеймов
    handleJunkNickname(messageElement, usernameElement, originalUsername, login) {
        if (!this.junkUnicodeRegex.test(originalUsername)) {
            return null; // Никнейм не содержит мусорного Unicode
        }

        const messageId = messageElement.dataset.userId || messageElement.dataset.user || `temp_${Date.now()}_${Math.random()}`;
        let newNickname;

        if (this.junkNickHandlingMode === 'removeDisplayName') {
            // Вариант 1: оставляем только логин
            newNickname = login || originalUsername;
        } else {
            // Вариант 2: добавляем ___ к логину
            newNickname = login ? `___${login}___` : originalUsername;
        }

        this.log(`[RenameNicknames] Detected junk Unicode in "${originalUsername}", applying ${this.junkNickHandlingMode}: "${newNickname}" (ID: ${messageId})`);

        // Сохраняем в кэш для последующей обработки
        this.renamedUsersCache[originalUsername] = newNickname;
        this.setStorage('renamedTwitchUsers', this.renamedUsersCache);

        return newNickname;
    }

    // Модифицированный метод updateChatNicknamesForAll
    updateChatNicknamesForAll(doc = document) {
        if (this.isUpdatingAll) {
            this.log('[RenameNicknames] updateChatNicknamesForAll already in progress, skipping...');
            return;
        }
        this.isUpdatingAll = true;
        console.time('updateChatNicknamesForAll');

        setTimeout(() => {
            try {
                const messageElements = Array.from(doc.querySelectorAll('.chat-line__message:not([data-processed])'));
                this.log(`[Nickname] Updating unprocessed chat messages: ${messageElements.length}`);

                messageElements.forEach(message => {
                    if (!message.isConnected) {
                        this.log('[Nickname] Skipping disconnected message');
                        return;
                    }

                    const messageId = message.dataset.userId || message.dataset.user || `message_${Date.now()}_${Math.random()}`;
                    if (this.processedMessages.has(messageId)) {
                        this.log('[Nickname] Skipping processed message ID:', messageId);
                        return;
                    }

                    const usernameElement = message.querySelector('.chat-author__display-name');
                    if (!usernameElement) {
                        this.log('[Nickname] No username element for ID:', messageId);
                        return;
                    }

                    const originalUsername = this.getOriginalUsernameFromMessage(message);
                    const loginElement = message.querySelector('.chat-author__intl-login');
                    const login = loginElement?.textContent?.replace(/[()]/g, '').trim() || '';

                    // Проверяем на мусорный Unicode
                    let newNickname = this.handleJunkNickname(message, usernameElement, originalUsername, login) || 
                                     this.renamedUsersCache[originalUsername] || 
                                     originalUsername;

                    const existingContainer = usernameElement.querySelector('.custom-nickname-container');
                    if (existingContainer) existingContainer.remove();

                    const container = document.createElement('span');
                    container.className = 'custom-nickname-container';
                    container.dataset.originalUsername = originalUsername;

                    const originalNickSpan = document.createElement('span');
                    originalNickSpan.className = 'original-nickname';
                    originalNickSpan.textContent = usernameElement.textContent || originalUsername;
                    container.appendChild(originalNickSpan);

                    if (newNickname !== originalUsername) {
                        const customNickSpan = document.createElement('span');
                        customNickSpan.className = 'custom-nickname';
                        customNickSpan.textContent = newNickname;
                        container.appendChild(customNickSpan);
                        this.log(`[Nickname] Applied "${newNickname}" for "${originalUsername}" (ID: ${messageId})`);
                    }

                    usernameElement.innerHTML = '';
                    usernameElement.appendChild(container);

                    message.dataset.processed = 'true';
                    this.processedMessages.set(messageId, {
                        element: message,
                        originalUsername,
                        newNickname
                    });
                });
            } catch (error) {
                this.log('[Error] in updateChatNicknamesForAll:', error);
            } finally {
                this.isUpdatingAll = false;
                console.timeEnd('updateChatNicknamesForAll');
            }
        }, 100);
    }

    // Модифицированный метод observeChatMessages
    observeChatMessages(doc = document) {
        if (!this.isRenameNickEnabled) {
            this.log('[Nickname] Disabled, skipping');
            return;
        }

        const tryStartObserver = async (attempt = 1) => {
            const chatContainer = this.findChatContainer(doc);
            if (chatContainer) {
                this.log('[ChatContainer] Found:', chatContainer);
                if (this.observer) {
                    this.observer.disconnect();
                    this.observerIsActive = false;
                }
                this.observer = new MutationObserver((mutations) => {
                    this.log('[Mutations] Detected, processing new messages...');
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(async node => {
                            if (node.nodeType !== Node.ELEMENT_NODE) return;

                            const messages = node.classList.contains('chat-line__message')
                                ? [node]
                                : Array.from(node.querySelectorAll('.chat-line__message'));

                            for (const message of messages) {
                                const messageId = message.dataset.userId || message.dataset.user || `message_${Date.now()}_${Math.random()}`;
                                const usernameElement = message.querySelector('.chat-author__display-name');
                                if (!usernameElement) {
                                    this.log('[Nickname] No username element for ID:', messageId);
                                    continue;
                                }

                                if (this.processedMessages.has(messageId)) {
                                    this.log('[Nickname] Skipping processed message ID:', messageId);
                                    continue;
                                }

                                const originalUsername = this.getOriginalUsernameFromMessage(message);
                                if (!originalUsername) {
                                    this.log('[Nickname] No original username for ID:', messageId);
                                    continue;
                                }

                                const loginElement = message.querySelector('.chat-author__intl-login');
                                const login = loginElement?.textContent?.replace(/[()]/g, '').trim() || '';

                                // Проверяем на мусорный Unicode
                                await this.updateRenamedUsersCache();
                                let newNickname = this.handleJunkNickname(message, usernameElement, originalUsername, login) || 
                                                 this.renamedUsersCache[originalUsername] || 
                                                 originalUsername;

                                const existingContainer = usernameElement.querySelector('.custom-nickname-container');
                                if (existingContainer) existingContainer.remove();

                                const container = document.createElement('span');
                                container.className = 'custom-nickname-container';
                                container.dataset.originalUsername = originalUsername;

                                const originalNickSpan = document.createElement('span');
                                originalNickSpan.className = 'original-nickname';
                                originalNickSpan.textContent = usernameElement.textContent || originalUsername;
                                container.appendChild(originalNickSpan);

                                if (newNickname !== originalUsername) {
                                    const customNickSpan = document.createElement('span');
                                    customNickSpan.className = 'custom-nickname';
                                    customNickSpan.textContent = newNickname;
                                    container.appendChild(customNickSpan);
                                    this.log(`[Nickname] Applied "${newNickname}" for "${originalUsername}" (ID: ${messageId})`);
                                }

                                usernameElement.innerHTML = '';
                                usernameElement.appendChild(container);

                                message.dataset.processed = 'true';
                                this.processedMessages.set(messageId, {
                                    element: message,
                                    originalUsername,
                                    newNickname
                                });
                            }
                        });
                    });
                });

                this.observer.observe(chatContainer, { childList: true, subtree: true });
                this.observerIsActive = true;
                this.retryCount = 0;
                this.log('[Nickname] Observer started');
                return this.observer;
            } else if (attempt <= this.maxRetries) {
                this.log(`[ChatContainer] Not found, attempt ${attempt}/${this.maxRetries}...`);
                setTimeout(() => tryStartObserver(attempt + 1), 1000);
            } else {
                this.log('[ChatContainer] Max retries, starting root observer...');
                this.observerIsActive = false;
                this.startRootObserver();
            }
        };

        tryStartObserver();
    }

    // Метод для переключения режима обработки мусорных никнеймов
    setJunkNickHandlingMode(mode) {
        if (['removeDisplayName', 'addUnderscores'].includes(mode)) {
            this.junkNickHandlingMode = mode;
            this.setStorage('junkNickHandlingMode', mode);
            this.log(`[RenameNicknames] Junk nickname handling mode set to: ${mode}`);
            this.resetNicknames();
            this.updateChatNicknamesForAll();
        } else {
            this.log('[RenameNicknames] Invalid junk nickname handling mode:', mode);
        }
    }

    getOriginalUsernameFromMessage(messageElement) {
    const displayNameElement = messageElement.querySelector('.chat-author__display-name');
    const loginElement = messageElement.querySelector('.chat-author__intl-login');
    
    const datasetUser = messageElement.dataset.user?.trim() || 'unknown';
    const login = loginElement?.textContent?.replace(/[()]/g, '').trim() || '';
    
    this.log('[GetOriginalUsername] dataset.user:', datasetUser, 'login:', login);
    
    if (login && login !== datasetUser) {
        const fullUsername = this.normalizeUsername(`${datasetUser} (${login})`);
        this.log('[GetOriginalUsername] Formed full username:', fullUsername);
        return fullUsername;
    }
    
    const normalized = this.normalizeUsername(datasetUser);
    this.log('[GetOriginalUsername] Using normalized username:', normalized);
    return normalized;
}

  monitorIframeChat() {
    const iframe = document.getElementById('чат');
    if (!iframe) {
        this.log('[RenameNicknames] Iframe with ID "чат" not found');
        return;
    }

    const monitorIframeContent = (attempt = 1, maxAttempts = 10) => {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDoc) {
                throw new Error('Cannot access iframe document');
            }

            const iframeStyle = iframeDoc.createElement('style');
            iframeStyle.textContent = `
                .chat-author__display-name {
                    position: relative;
                    display: inline-block;
                     width: auto;
                    max-width: none;
                    font-family: 'Roobert', sans-serif !important;
                }

                .custom-nickname-container {
                    position: relative;
                    display: inline-block;
                    width: inherit;
                }

                .original-nickname {
                    opacity: 1;
                    white-space: nowrap;
                    pointer-events: auto;
                    display: inline-block;
                }

                .custom-nickname-container:has(.custom-nickname) .original-nickname {
                    opacity: 0;
                    pointer-events: none;
                }

                .custom-nickname {
                    position: absolute;
                    top: 0;
                    left: 0;
                    opacity: 1 !important;
                    color: inherit; /* Наследуем цвет от родителя */
                    font-weight: 500;
                    pointer-events: none;
                    z-index: 1;
                    white-space: nowrap;
                    overflow: visible;
                }

    .custom-nickname-container:hover::after {
           content: attr(data-original-username);
              position: absolute;
              bottom: 100%;
              left: 0;
              white-space: nowrap;
              background: rgb(51, 87, 75);
              color: rgb(69, 184, 178);
              font-size: 16px;
              padding: 2px 8px;
              border-radius: 4px;
              border: 2px solid rgb(69, 184, 178);
              margin-bottom: 5px;
              z-index: 9999;
                }

                .viewer-card-header__display-name { 
                    display: inline-block;
                    font-family: 'Roobert', sans-serif !important;
                }

                .viewer-card-header__display-name .custom-nickname-profile { 
                    font-size: 12px;
                    color: rgb(43, 255, 0);
                    font-weight: 400;
                    margin-top: 2px;
                    white-space: nowrap;
                    overflow: visible;
                }

                .viewer-card-header__display-name .custom-nickname-profile::before {
                    content: '(';
                }

                .viewer-card-header__display-name .custom-nickname-profile::after {
                    content: ')';
                }
            `;
            iframeDoc.head.appendChild(iframeStyle);
            this.log('[RenameNicknames] Added CSS styles to iframe');

            const chatContainer = this.findChatContainer(iframeDoc);
            if (chatContainer && this.isRenameNickEnabled) {
                this.log('[RenameNicknames] Chat container found in iframe, applying nicknames');
                this.updateChatNicknamesForAll(iframeDoc);
                this.observeChatMessages(iframeDoc);
            } else if (attempt <= maxAttempts) {
                this.log('[RenameNicknames] Chat container not found in iframe, retrying...');
                setTimeout(() => monitorIframeContent(attempt + 1, maxAttempts), 500);
            }
        } catch (error) {
            this.log('[RenameNicknames] Iframe access error:', error);
            if (attempt <= maxAttempts) {
                setTimeout(() => monitorIframeContent(attempt + 1, maxAttempts), 500);
            }
        }
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                this.log('[RenameNicknames] Iframe src changed:', iframe.src);
                this.resetNicknames();
                monitorIframeContent();
            }
        });
    });

    observer.observe(iframe, { attributes: true, attributeFilter: ['src'] });
    iframe.addEventListener('load', () => {
        this.log('[RenameNicknames] Iframe loaded or reloaded:', iframe.src);
        monitorIframeContent();
    });

    monitorIframeContent();
}

   queueMessage(message, originalUsername, newNickname, priority = false) {
    this.messageQueue.push({ message, originalUsername, newNickname, priority });
    if (this.messageQueue.length > 1000) {
        this.messageQueue = this.messageQueue.slice(-500);
        this.log('[RenameNicknames] Queue size limited to prevent memory issues');
    }
    // Сортировка очереди: приоритетные сообщения обрабатываются первыми
    if (priority) {
        this.messageQueue.sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0));
    }
    this.processMessageQueue();
}

  addNicknameEditButton() {
    const usernameContainer = document.querySelector('.viewer-card-header__display-name');
    if (!usernameContainer) {
        this.log('[AddNicknameEditButton] Username container not found');
        return;
    }

    const usernameElement = usernameContainer.querySelector('.CoreText-sc-1txzju1-0 a');
    if (!usernameElement) {
        this.log('[AddNicknameEditButton] Username element not found');
        return;
    }

    const displayName = usernameElement.textContent?.trim();
    if (!displayName) {
        this.log('[AddNicknameEditButton] Display name is empty');
        return;
    }

    const loginElement = document.querySelector('.viewer-card__name .tw-login');
    const login = loginElement?.textContent?.replace(/[()]/g, '').trim() || '';
    const originalUsername = login && login !== displayName 
        ? this.normalizeUsername(`${displayName} (${login})`) 
        : this.normalizeUsername(displayName);
    this.log('[AddNicknameEditButton] Formed originalUsername:', originalUsername);

    // Удаляем существующий кастомный ник, если он есть
    const existingCustomNick = usernameContainer.querySelector('.custom-nickname-profile');
    if (existingCustomNick) {
        existingCustomNick.remove();
    }

    // Добавляем кастомный никнейм, если он есть в кэше
    if (this.renamedUsersCache[originalUsername]) {
        const customNickSpan = document.createElement('span');
        customNickSpan.className = 'custom-nickname-profile';
        customNickSpan.textContent = this.renamedUsersCache[originalUsername];
        usernameContainer.appendChild(customNickSpan);
        this.log('[AddNicknameEditButton] Applied custom nickname in profile:', this.renamedUsersCache[originalUsername]);
    }

    const buttonsContainer = document.querySelector('.Layout-sc-1xcs6mc-0.jHLEAt');
    if (!buttonsContainer || buttonsContainer.querySelector('.rename-nick-button')) {
        this.log('[AddNicknameEditButton] Buttons container not found or button already exists');
        return;
    }

    const editContainer = document.createElement('div');
    editContainer.className = 'Layout-sc-1xcs6mc-0 gPVkpw';
    editContainer.innerHTML = '<div class="InjectLayout-sc-1i43xsx-0 iDMNUO viewer-card-drag-cancel"></div>';
    const buttonWrapper = editContainer.querySelector('.InjectLayout-sc-1i43xsx-0');

    const editButton = document.createElement('button');
    editButton.innerHTML = '✏️';
    editButton.className = 'rename-nick-button ScCoreButton-sc-ocjdkq-0 kJMgAB';
    editButton.style.cursor = 'pointer';
    editButton.style.background = 'none';
    editButton.style.border = 'none';
    editButton.style.fontSize = '16px';
    editButton.setAttribute('aria-label', 'Edit nickname');

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.style.display = 'none';
    inputField.style.marginLeft = '8px';
    inputField.placeholder = 'Введите новый ник';
    inputField.className = 'rename-nick-input';

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '🗑️';
    deleteButton.className = 'delete-nick-button ScCoreButton-sc-ocjdkq-0 kJMgAB';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.background = 'none';
    deleteButton.style.border = 'none';
    deleteButton.style.fontSize = '16px';
    deleteButton.style.marginLeft = '4px';
    deleteButton.style.display = this.renamedUsersCache[originalUsername] ? 'inline-block' : 'none';
    deleteButton.setAttribute('aria-label', 'Reset nickname');

    buttonWrapper.appendChild(editButton);
    buttonWrapper.appendChild(inputField);
    buttonWrapper.appendChild(deleteButton);
    buttonsContainer.appendChild(editContainer);

    editButton.addEventListener('click', () => {
        inputField.style.display = 'inline-block';
        inputField.value = this.renamedUsersCache[originalUsername] || '';
        inputField.focus();
        this.log('[AddNicknameEditButton] Edit button clicked, input field shown');
    });

    inputField.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            let newNickname = inputField.value.trim();
            newNickname = newNickname.replace(/[<>"';&]/g, '');
            if (!newNickname) {
                this.log('[AddNicknameEditButton] Invalid nickname entered (empty or invalid)');
                inputField.style.display = 'none';
                inputField.value = '';
                return;
            }
            newNickname = this.normalizeUsername(newNickname);
            const existingUser = Object.keys(this.renamedUsersCache).find(
                key => this.renamedUsersCache[key] === newNickname && key !== originalUsername
            );
            if (existingUser) {
                this.log(`[AddNicknameEditButton] Nickname "${newNickname}" already used by "${existingUser}"`);
                inputField.style.display = 'none';
                inputField.value = '';
                return;
            }
            this.renamedUsersCache[originalUsername] = newNickname;
            await this.setStorage('renamedTwitchUsers', this.renamedUsersCache);
            await this.updateRenamedUsersCache();
            // Обновляем кастомный ник в профиле
            const existingCustomNick = usernameContainer.querySelector('.custom-nickname-profile');
            if (existingCustomNick) {
                existingCustomNick.remove();
            }
            const customNickSpan = document.createElement('span');
            customNickSpan.className = 'custom-nickname-profile';
            customNickSpan.textContent = newNickname;
            usernameContainer.appendChild(customNickSpan);
            deleteButton.style.display = 'inline-block';
            this.log(`[AddNicknameEditButton] Saved new nickname for "${originalUsername}": "${newNickname}"`);
            this.updateChatNicknamesForUser(originalUsername);
            inputField.style.display = 'none';
            inputField.value = '';
        }
    });

    inputField.addEventListener('blur', () => {
        inputField.style.display = 'none';
        inputField.value = '';
        this.log('[AddNicknameEditButton] Input field lost focus');
    });

    deleteButton.addEventListener('click', async () => {
        if (this.renamedUsersCache[originalUsername]) {
            delete this.renamedUsersCache[originalUsername];
            await this.setStorage('renamedTwitchUsers', this.renamedUsersCache);
            await this.updateRenamedUsersCache();
            const existingCustomNick = usernameContainer.querySelector('.custom-nickname-profile');
            if (existingCustomNick) {
                existingCustomNick.remove();
            }
            deleteButton.style.display = 'none';
            this.log(`[AddNicknameEditButton] Reset nickname for "${originalUsername}"`);
            this.updateChatNicknamesForUser(originalUsername);
        }
    });
}

  updateChatNicknamesForUser(originalUsername, doc = document) {
    if (this.isUpdatingUser) {
        this.log(`[RenameNicknames] updateChatNicknamesForUser for "${originalUsername}" already in progress, skipping...`);
        return;
    }
    this.isUpdatingUser = true;

    try {
        this.processedMessages.forEach((value, key) => {
            if (value.originalUsername === originalUsername) {
                this.processedMessages.delete(key);
            }
        });

        const messageElements = Array.from(doc.querySelectorAll('.chat-line__message'));
        this.log(`[RenameNicknames] Updating nicknames for user ${originalUsername}:`, messageElements.length);

        messageElements.forEach(message => {
            if (!message.isConnected) {
                this.log('[RenameNicknames] Skipping disconnected message');
                return;
            }

            const messageId = message.dataset.userId || message.dataset.user || `temp_${Date.now()}_${Math.random()}`;
            const usernameElement = message.querySelector('.chat-author__display-name');
            if (!usernameElement) {
                this.log('[RenameNicknames] Username element not found for message ID:', messageId);
                return;
            }

            const messageOriginalUsername = this.getOriginalUsernameFromMessage(message);
            if (messageOriginalUsername === originalUsername) {
                const newNickname = this.renamedUsersCache[originalUsername] || originalUsername;

                const existingContainer = usernameElement.querySelector('.custom-nickname-container');
                if (existingContainer) existingContainer.remove();

                const container = document.createElement('span');
                container.className = 'custom-nickname-container';
                container.dataset.originalUsername = originalUsername;

                const originalNickSpan = document.createElement('span');
                originalNickSpan.className = 'original-nickname';
                originalNickSpan.textContent = usernameElement.textContent || originalUsername;
                container.appendChild(originalNickSpan);

                if (newNickname !== originalUsername) {
                    const customNickSpan = document.createElement('span');
                    customNickSpan.className = 'custom-nickname';
                    customNickSpan.textContent = newNickname;
                    container.appendChild(customNickSpan);
                    this.log(`[RenameNicknames] Applied custom nickname "${newNickname}" for "${originalUsername}" (ID: ${messageId})`);
                } else {
                    this.log(`[RenameNicknames] No custom nickname for "${originalUsername}", keeping original (ID: ${messageId})`);
                }

                usernameElement.innerHTML = '';
                usernameElement.appendChild(container);

                this.processedMessages.set(messageId, {
                    element: message,
                    originalUsername,
                    newNickname
                });
            }
        });
    } catch (error) {
        this.log('[RenameNicknames] Error in updateChatNicknamesForUser:', error);
    } finally {
        this.isUpdatingUser = false;
    }  // Сбрасываем атрибут исправляет не работающий PreviewerMedia.js в чате
        message.dataset.processed = null; // Сбрасываем атрибут исправляет не работающий PreviewerMedia.js в чате
// Сбрасываем атрибут исправляет не работающий PreviewerMedia.js в чате
}

 

   findChatContainer(doc = document) {
    const selectors = [
        '.chat-scrollable-area__message-container',
        '.chat-room__content',
        '.chat-list--default',
        '[data-a-target="chat-room-content"]',
        '.video-chat__message-list-wrapper',
        '.chat-container',
        '[data-test-selector="chat-room-component-layout"]',
        '[data-a-target="chat-scroller"]',
        '.Layout-sc-1xcs6mc-0.nvivF' // Добавлен из вашей структуры
    ];
    const container = selectors.reduce((found, selector) => found || doc.querySelector(selector), null);
    if (!container) {
        this.log('[RenameNicknames] No chat container found with selectors:', selectors);
    } else {
        this.log('[RenameNicknames] Found chat container:', container);
    }
    return container;
}

 

   startRootObserver() {
    const maxDuration = 60000; // 60 секунд таймаут
    const startTime = performance.now();
    const rootElement = document.querySelector('.video-player, .channel-root, .twitch-player') || document.body;
    const rootObserver = new MutationObserver(this.debounce(() => {
        const chatContainer = this.findChatContainer();
        if (chatContainer && !this.observerIsActive) {
            this.log('[RenameNicknames] RootObserver: Chat container found, starting observation');
            this.observeChatMessages();
        } else if (performance.now() - startTime > maxDuration) {
            this.log('[RenameNicknames] RootObserver: Chat container not found after timeout, stopping');
            rootObserver.disconnect();
        } else {
            this.log('[RenameNicknames] RootObserver: Chat container not found');
            this.observerIsActive = false;
        }
    }, 100)); // Уменьшена задержка дебouncing

    rootObserver.observe(rootElement, { childList: true, subtree: true, attributes: false });
    this.log('[RenameNicknames] RootObserver started on:', rootElement === document.body ? 'document.body' : rootElement.className);
}

    monitorChatReset() {
        const connectionMessageSelectors = [
            '[data-a-target="chat-connection-message"]',
            '.chat-connection-message',
            '.chat-status-message',
            '.chat-line__status'
        ];

        const findConnectionMessage = () => {
            return connectionMessageSelectors.reduce((found, sel) => found || document.querySelector(sel), null);
        };

        const resetNicknames = () => {
            if (this.isChatResetting) return;
            this.isChatResetting = true;

            this.log('[RenameNicknames] Chat reset detected, restarting nickname application...');
            if (this.observer) {
                this.observer.disconnect();
                this.observerIsActive = false;
            }

            this.processedMessages.clear();
            this.messageQueue = [];

            const chatContainer = this.findChatContainer();
            if (chatContainer) {
                this.observeChatMessages();
                this.updateChatNicknamesForAll();
            } else {
                this.startRootObserver();
            }

            this.isChatResetting = false;
            this.log('[RenameNicknames] Nickname application restarted');
        };

        const checkChatState = (timestamp) => {
            const chatContainer = this.findChatContainer();
            if (!chatContainer) {
                this.log('[RenameNicknames] Chat container not found, triggering reset...');
                resetNicknames();
                requestAnimationFrame(checkChatState);
                return;
            }

            const connectionMessage = findConnectionMessage();
            if (connectionMessage && connectionMessage.textContent.toLowerCase().includes('connecting to chat')) {
                this.log('[RenameNicknames] Detected "Connecting to chat" message, triggering reset...');
                resetNicknames();
                requestAnimationFrame(checkChatState);
                return;
            }

            const messages = chatContainer.querySelectorAll('.chat-line__message');
            const currentMessageCount = messages.length;

            if (currentMessageCount === 0 && this.lastMessageCount > 0) {
                this.log('[RenameNicknames] Chat cleared (no messages), triggering reset...');
                resetNicknames();
            } else if (currentMessageCount > 0 && this.lastMessageCount === 0) {
                this.log('[RenameNicknames] New messages appeared after clear, applying nicknames...');
                this.updateChatNicknamesForAll();
            }

            this.lastMessageCount = currentMessageCount;
            requestAnimationFrame(checkChatState);
        };

        const connectionObserver = new MutationObserver(() => {
            const connectionMessage = findConnectionMessage();
            if (connectionMessage && connectionMessage.textContent.toLowerCase().includes('connecting to chat')) {
                this.log('[RenameNicknames] Mutation detected "Connecting to chat", triggering reset...');
                resetNicknames();
            }
        });

        connectionObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-a-target', 'class']
        });

        requestAnimationFrame(checkChatState);
    }

   monitorChannelChange() {
    const checkChannel = (timestamp) => {
        const currentChannel = window.location.pathname.split('/')[1] || null;
        if (currentChannel && currentChannel !== this.lastChannel) {
            this.log(`[RenameNicknames] Channel changed: ${this.lastChannel} -> ${currentChannel}`);
            this.lastChannel = currentChannel;
            this.processedMessages.clear();
            this.resetNicknames();
            this.observeChatMessages();
        }
        requestAnimationFrame(checkChannel);
    };

    window.addEventListener('popstate', () => {
        this.log('[RenameNicknames] URL changed, checking channel...');
        checkChannel(performance.now());
    });

    window.addEventListener('load', () => {
        this.log('[RenameNicknames] Page loaded, checking channel...');
        checkChannel(performance.now());
    });

    requestAnimationFrame(checkChannel);
}

 monitorIframeChat() {
    const iframe = document.getElementById('чат');
    if (!iframe) {
        this.log('[RenameNicknames] Iframe with ID "чат" not found');
        return;
    }

    const monitorIframeContent = (attempt = 1, maxAttempts = 10) => {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDoc) {
                throw new Error('Cannot access iframe document');
            }

            const iframeStyle = iframeDoc.createElement('style');
            iframeStyle.textContent = `
                .chat-author__display-name.renamed {
                    position: relative;
                    color: transparent;
                    display: inline-block;
                     width: auto;
                    max-width: none;
                    font-family: 'Roobert', sans-serif !important;
                }
                .chat-author__display-name.renamed .custom-nickname {
                    position: absolute;
                    top: 0;
                    left: 0;
                    color: rgb(168, 241, 238);
                    font-weight: 500;
                    pointer-events: none;
                    z-index: 1;
                    white-space: nowrap;
                    overflow: visible;
                }
        .chat-author__display-name.renamed:hover::after {
             content: attr(data-original-username);
              position: absolute;
              bottom: 100%;
              left: 0;
              white-space: nowrap;
              background: rgb(51, 87, 75);
              color: rgb(168, 241, 238);
              font-size: 14px;
              padding: 2px 8px;
              border-radius: 4px;
              border: 2px solid rgb(87, 255, 247);
              margin-bottom: 5px;
              z-index: 9999; 
                }
         .viewer-card-header__display-name { 
                    display: inline-block;
                    font-family: 'Roobert', sans-serif !important;
                }
           .viewer-card-header__display-name .custom-nickname-profile { 
                    font-size: 14px;
                    color: rgb(43, 255, 0);
                    font-weight: 400;
                    margin-top: 2px;
                    white-space: nowrap;
                    overflow: visible;
                }
                .viewer-card-header__display-name .custom-nickname-profile::before {
                    content: '(';
                }
                .viewer-card-header__display-name .custom-nickname-profile::after {
                    content: ')';
                }
            `;
            iframeDoc.head.appendChild(iframeStyle);
            this.log('[RenameNicknames] Added CSS styles to iframe');

            const chatContainer = this.findChatContainer(iframeDoc);
            if (chatContainer && this.isRenameNickEnabled) {
                this.log('[RenameNicknames] Chat container found in iframe, applying nicknames');
                this.updateChatNicknamesForAll(iframeDoc);
                this.observeChatMessages(iframeDoc);
            } else if (attempt <= maxAttempts) {
                this.log('[RenameNicknames] Chat container not found in iframe, retrying...');
                setTimeout(() => monitorIframeContent(attempt + 1, maxAttempts), 500);
            }
        } catch (error) {
            this.log('[RenameNicknames] Iframe access error:', error);
            if (attempt <= maxAttempts) {
                setTimeout(() => monitorIframeContent(attempt + 1, maxAttempts), 500);
            }
        }
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                this.log('[RenameNicknames] Iframe src changed:', iframe.src);
                this.resetNicknames();
                monitorIframeContent();
            }
        });
    });

    observer.observe(iframe, { attributes: true, attributeFilter: ['src'] });
    iframe.addEventListener('load', () => {
        this.log('[RenameNicknames] Iframe loaded or reloaded:', iframe.src);
        monitorIframeContent();
    });

    monitorIframeContent();
}

    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            this.log('[RenameNicknames] Visibility changed:', document.visibilityState);
            if (document.visibilityState === 'visible' && !this.observerIsActive) {
                this.log('[RenameNicknames] Tab became visible, restarting observation...');
                if (this.observer) this.observer.disconnect();
                this.observeChatMessages();
            }
        });
    }

    startWatchdog() {
        const maxFailureDuration = 30000;
        let lastCheckTime = 0;
        let lastFailureTime = 0;

        const check = (timestamp) => {
            if (timestamp - lastCheckTime < 5000) {
                requestAnimationFrame(check);
                return;
            }
            lastCheckTime = timestamp;

            const chatContainer = this.findChatContainer();
            if (!chatContainer) {
                this.log('[RenameNicknames] Watchdog: Chat container not found, restarting...');
                lastFailureTime = lastFailureTime || timestamp;
                this.resetNicknames();

                if (timestamp - lastFailureTime > maxFailureDuration) {
                    this.log('[RenameNicknames] Watchdog: Failure lasts too long, forcing full restart...');
                    if (this.observer) {
                        this.observer.disconnect();
                        this.observerIsActive = false;
                    }
                    this.observeChatMessages();
                    lastFailureTime = 0;
                }
            } else {
                lastFailureTime = 0;
                this.log('[RenameNicknames] Watchdog: Nickname application working correctly');
            }
            requestAnimationFrame(check);
        };

        requestAnimationFrame(check);
    }

resetNicknames() {
    if (this.isResetting) {
        this.log('[Nickname] Reset in progress, skipping...');
        return;
    }
    this.isResetting = true;
    this.log('[Nickname] Resetting nickname application...');

    try {
        if (this.observer) {
            this.observer.disconnect();
            this.observerIsActive = false;
        }
        this.processedMessages.clear();
        this.cleanProcessedMessages();
        const chatContainer = this.findChatContainer();
        if (chatContainer) {
            chatContainer.querySelectorAll('.chat-line__message').forEach(message => {
                delete message.dataset.processed;
                const usernameElement = message.querySelector('.chat-author__display-name');
                if (usernameElement) {
                    const container = usernameElement.querySelector('.custom-nickname-container');
                    if (container) container.remove();
                    const originalText = this.getOriginalUsernameFromMessage(message);
                    usernameElement.textContent = originalText || usernameElement.textContent;
                }
            });
            if (this.isRenameNickEnabled) {
                this.observeChatMessages();
                this.updateChatNicknamesForAll();
            }
        } else {
            this.startRootObserver();
        }
    } catch (error) {
        this.log('[Error] in resetNicknames:', error);
    } finally {
        this.isResetting = false;
        this.log('[Nickname] Reset completed');
    }
}

    interceptFunctions() {
        const originalToggleEmotesInChat = window.toggleEmotesInChat || (() => {});
        window.toggleEmotesInChat = (...args) => {
            originalToggleEmotesInChat(...args);
            setTimeout(() => this.updateChatNicknamesForAll(), 100);
            this.log('[RenameNicknames] Applied nicknames after toggleEmotesInChat');
        };

        const originalRestartBlockingLogic = window.restartBlockingLogic || (() => {});
        window.restartBlockingLogic = (...args) => {
            originalRestartBlockingLogic(...args);
            setTimeout(() => this.updateChatNicknamesForAll(), 100);
            this.log('[RenameNicknames] Applied nicknames after restartBlockingLogic');
        };
    }

   addStyles() {
    if (this.styleElement) {
        this.styleElement.remove();
    }
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = `
        .chat-author__display-name {
            position: relative;
            display: inline-block;
             width: auto;
            max-width: none;
            font-family: 'Roobert', sans-serif !important;
        }

        .custom-nickname-container {
            position: relative;
            display: inline-block;
                width: inherit;
        }

        .original-nickname {
            opacity: 1; /* По умолчанию видимый */
            white-space: nowrap;
            pointer-events: auto;
            display: inline-block;
        }

        .custom-nickname-container:has(.custom-nickname) .original-nickname {
            opacity: 0; /* Скрываем, если есть кастомный ник */
            pointer-events: none;
        }

        .custom-nickname {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 1 !important;
            color: inherit; /* Наследуем цвет от родителя */
            font-weight: 500;
            pointer-events: none;
            z-index: 2;
            white-space: nowrap;
            overflow: visible;
        }

        .custom-nickname-container:hover::after {
              content: attr(data-original-username);
              position: absolute;
              bottom: 100%;
              left: 0;
              white-space: nowrap;
              background: rgb(51, 87, 75);
              color: rgb(69, 184, 178);
              font-size: 16px;
              padding: 2px 8px;
              border-radius: 4px;
              border: 2px solid rgb(69, 184, 178);
              margin-bottom: 5px;
              z-index: 9999;
        }

        .viewer-card-header__display-name { 
            display: inline-block;
            font-family: 'Roobert', sans-serif !important;
        }

        .viewer-card-header__display-name .custom-nickname-profile { 
            font-size: 14px;
            color: rgb(43, 255, 0);
            font-weight: 500;
            margin-top: 2px;
            white-space: nowrap;
            overflow: visible;
        }

        .viewer-card-header__display-name .custom-nickname-profile::before {
            content: '(';
        }

        .viewer-card-header__display-name .custom-nickname-profile::after {
            content: ')';
        }
    `;
    document.head.appendChild(this.styleElement);
    this.log('[RenameNicknames] CSS applied');
}

async init() {
    if (!await this.getStorage('renamedTwitchUsers')) {
        await this.setStorage('renamedTwitchUsers', {});
        this.log('[Nickname] Initialized renamedTwitchUsers storage');
    }

    await this.updateRenamedUsersCache();

    window.addEventListener('load', async () => {
        this.log('[Nickname] Page loaded, reapplying nicknames...');
        await this.updateRenamedUsersCache();
        this.resetNicknames();
    });

    const viewerCardObserver = new MutationObserver(() => {
        const viewerCard = document.querySelector('.viewer-card');
        if (viewerCard && !viewerCard.dataset.editButtonAdded) {
            viewerCard.dataset.editButtonAdded = 'true';
            this.addNicknameEditButton();
        }
    });

    viewerCardObserver.observe(document.body, { childList: true, subtree: true });
    this.addStyles();
    this.addNicknameEditButton();
    this.observeChatMessages();
    this.monitorChatReset();
    this.monitorChannelChange();
    this.monitorIframeChat();
    this.handleVisibilityChange();
    this.startWatchdog();
    this.interceptFunctions();

    this.log('[Nickname] Module initialized');

    window.addEventListener('storage', (event) => {
        if (event.key === 'isRenameNickEnabled') {
            const newValue = JSON.parse(event.newValue);
            if (newValue !== this.isRenameNickEnabled) {
                this.isRenameNickEnabled = newValue;
                this.log(`[Nickname] isRenameNickEnabled changed to ${newValue}`);
                if (this.isRenameNickEnabled) {
                    this.resetNicknames();
                    this.observeChatMessages();
                } else {
                    this.observer?.disconnect();
                    this.observerIsActive = false;
                    this.resetNicknames(); // Сброс кастомных ников
                }
            }
        }
    });
}
}


async function cleanRenamedUserKeys() {
    const key = 'renamedTwitchUsers';
    const rawData = localStorage.getItem(key);

    if (!rawData) {
        console.log('[RenameNicknames] No renamed nicknames found.');
        return;
    }

    let renamedUsers;
    try {
        renamedUsers = JSON.parse(rawData);
        if (!renamedUsers || typeof renamedUsers !== 'object') {
            console.error('[RenameNicknames] Invalid renamed nicknames data');
            return;
        }
    } catch (e) {
        console.error('[RenameNicknames] Failed to parse renamed nicknames:', e);
        return;
    }

    let cleaned = {};
    let changed = 0;

    for (const originalKey in renamedUsers) {
        if (!originalKey || typeof originalKey !== 'string') {
            console.log(`[RenameNicknames] Skipping invalid key: ${originalKey}`);
            continue;
        }

        // Проверяем, является ли ключ кастомным ником
        const newNickname = renamedUsers[originalKey].trim().replace(/[<>"';&]/g, '');
        if (Object.values(renamedUsers).includes(originalKey)) {
            console.log(`[RenameNicknames] Skipping key "${originalKey}" as it appears to be a custom nickname`);
            changed++;
            continue;
        }

        const match = originalKey.match(/^(.+?) \(([^)]+)\)$/);
        let cleanKey;
        if (match) {
            const displayName = match[1];
            const login = match[2];
            cleanKey = `${displayName} (${login})`;
        } else {
            cleanKey = originalKey;
        }

        const hasNonLatin = /[^-\u007F]/.test(cleanKey);
        cleanKey = hasNonLatin ? cleanKey : cleanKey.toLowerCase();

        if (!cleaned[cleanKey]) {
            cleaned[cleanKey] = newNickname;
            if (cleanKey !== originalKey) {
                changed++;
                console.log(`[RenameNicknames] Fixed key: "${originalKey}" -> "${cleanKey}"`);
            }
        }
    }

    if (changed > 0) {
        localStorage.setItem(key, JSON.stringify(cleaned));
        console.log(`[RenameNicknames] Cleaned ${changed} key(s).`);
    } else {
        console.log('[RenameNicknames] No duplicate or invalid keys to clean.');
    }
}

cleanRenamedUserKeys();

function initRenameNicknames() {
    if (!window.getStorage || !window.setStorage) {
        console.error('[RenameNicknames] Required dependencies (getStorage or setStorage) are missing');
        return;
    }
    const renameNicknames = new RenameNicknames({
        getStorage: window.getStorage,
        setStorage: window.setStorage,
        log: (...args) => console.log(...args)
    });
    renameNicknames.init();
}

initRenameNicknames();

export default { initRenameNicknames };