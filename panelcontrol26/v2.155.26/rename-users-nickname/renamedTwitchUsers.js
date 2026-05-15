 // rename-users-nickname/Twitch_Viewer_Card-data-user-account.js


(function () {
    // ====== Константы
    const INVISIBLE_CHAR = '⠀';
    const CHAT_SELECTORS = [
        '.chat-scrollable-area__message-container',
        '.chat-room__content',
        '.chat-list--default',
        '[data-a-target="chat-room-content"]',
        '.video-chat__message-list-wrapper',
        '.chat-container',
        '[data-test-selector="chat-room-component-layout"]',
        '[data-a-target="chat-scroller"]',
        '.Layout-sc-1xcs6mc-0.nvivF'
    ];
    class RenameNicknamesInstantFull {
        constructor({ getStorage, setStorage, log }) {
            this.getStorage = getStorage || (() => null);
            this.setStorage = setStorage || (() => { });
            this.log = log || ((...args) => console.log(...args));
            this.isRenameNickEnabled = this.getStorage('isRenameNickEnabled', true);
            this.renamedUsersCache = this.getStorage('renamedTwitchUsers', {});
            this.processedMessages = new WeakMap(); // Используем WeakMap для автоматической очистки
            this.observer = null;
            this.styleElement = null;
            this.lastChannel = window.location.pathname.split('/')[1] || null;
            this.checkInterval = null;
        }
        // ====== Нормализация имени пользователя
        normalizeUsername(username, forKey = true) {
            if (!username || typeof username !== 'string')
                return '';
            const trimmed = username.trim();
            if (!trimmed)
                return '';
            return forKey
                ? trimmed.toLowerCase().replace(/[<>"';&]/g, '')
                : trimmed.replace(/[<>"';&]/g, '');
        }
        // ====== Получение оригинального имени из сообщения
        // после многих попыток спама и создания новых чатов 
        // грок обновили и он написал исправленую  версию функции 08-30-2025
        getOriginalUsernameFromMessage(messageElement) {
            const container = messageElement.querySelector('.custom-nickname-container');
            if (container && container.dataset.originalUsername) {
                return container.dataset.originalUsername; // Уже нормализовано
            }
            // Fallback для необработанных сообщений
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
                ? this.normalizeUsername(`${displayName} (${login})`, true)
                : this.normalizeUsername(displayName, true);
        }
        // ====== Замена двоеточия на невидимый символ
        replaceColonInMessage(messageElement) {
            const usernameSpan = messageElement.querySelector('.chat-author__display-name');
            const colonSpan = usernameSpan?.nextElementSibling;
            if (colonSpan &&
                colonSpan.getAttribute('aria-hidden') === 'true' &&
                colonSpan.textContent.trim() === ':') {
                colonSpan.textContent = INVISIBLE_CHAR + ' ';
            }
        }
        // ====== Применение кастомного никнейма
        applyCustomNickname(messageElement, forceUpdate = false) {
            if (!this.isRenameNickEnabled || !messageElement.isConnected)
                return;
            // Игнорируем проверку processedMessages при forceUpdate
            if (!forceUpdate && this.processedMessages.has(messageElement))
                return;
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
            const newNickname = this.renamedUsersCache[originalUsername] || null; // Изменено: возвращаем null вместо originalUsername
            // Находим или создаем custom-nickname-container
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
            // Удаляем существующий custom-nickname, если он есть
            const existingCustomNick = container.querySelector('.custom-nickname');
            if (existingCustomNick) {
                existingCustomNick.remove();
                this.log(`[_Rename_twitch_Nick_names_] Removed existing custom-nickname for "${originalUsername}"`);
            }
            // Добавляем custom-nickname только если он существует
            if (newNickname) {
                const customNickSpan = document.createElement('span');
                customNickSpan.className = 'custom-nickname';
                customNickSpan.textContent = newNickname;
                container.appendChild(customNickSpan);
                this.log(`[_Rename_twitch_Nick_names_] Added custom nickname "${newNickname}" for "${originalUsername}"`);
            }
            else {
                this.log(`[_Rename_twitch_Nick_names_] No custom nickname for "${originalUsername}", using original`);
            }
            this.replaceColonInMessage(messageElement);
            // Пометить сообщение как обработанное
            this.processedMessages.set(messageElement, { originalUsername, newNickname });
            messageElement.dataset.processed = 'true';
            this.log(`[_Rename_twitch_Nick_names_] Applied nickname "${newNickname || originalUsername}" for "${originalUsername}" in message`);
        }
        // ====== Периодическая проверка чата (для устойчивости к перерисовке)
        startPeriodicCheck() {
            if (this.checkInterval)
                clearInterval(this.checkInterval);
            this.checkInterval = setInterval(() => {
                const chatContainer = this.findChatContainer();
                if (chatContainer) {
                    this.updateChatNicknamesForAll();
                }
            }, 200); // Проверка каждые 200 мс
            this.log('[_Rename_twitch_Nick_names_] Periodic check started');
        }
        // ====== Наблюдение за корневым элементом
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
          // ====== Наблюдение за чатом
        observeChatMessages(doc = document) {
            if (!this.isRenameNickEnabled)
                return;
            const chatContainer = this.findChatContainer(doc);
            if (!chatContainer) {
                this.startRootObserver();
                return;
            }
            if (this.observer)
                this.observer.disconnect();
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
                        if (node.nodeType !== Node.ELEMENT_NODE)
                            return;
                        if (node.classList.contains('chat-line__message')) {
                            this.applyCustomNickname(node);
                        }
                        else {
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
        // ====== Поиск контейнера чата
        findChatContainer(doc = document) {
            return CHAT_SELECTORS.reduce((found, selector) => found || doc.querySelector(selector), null);
        }
        // ====== Обновление всех никнеймов
        updateChatNicknamesForAll(doc = document) {
            if (!this.isRenameNickEnabled)
                return;
            const messageElements = Array.from(doc.querySelectorAll('.chat-line__message:not([data-processed])'));
            messageElements.forEach(message => this.applyCustomNickname(message));
        }
       
        // ====== Очистка кэша пользователей
        async cleanRenamedUserKeys() {
            const key = 'renamedTwitchUsers';
            const rawData = localStorage.getItem(key);
            if (!rawData)
                return;
            let renamedUsers;
            try {
                renamedUsers = JSON.parse(rawData);
            }
            catch (e) {
                this.log('[_Rename_twitch_Nick_names_] Failed to parse renamed nicknames:', e);
                return;
            }
            const cleaned = {};
            for (const originalKey in renamedUsers) {
                const value = renamedUsers[originalKey];
                const newNickname = typeof value === 'string' ? value.replace(/[<>"';&]/g, '') : '';
                if (!newNickname || newNickname.match(/^\s*$/))
                    continue;
                const cleanKey = this.normalizeUsername(originalKey, true);
                cleaned[cleanKey] = newNickname;
            }
            localStorage.setItem(key, JSON.stringify(cleaned));
            this.renamedUsersCache = cleaned;
            this.log('[_Rename_twitch_Nick_names_] Cleaned renamed users cache');
        }
         // ====== Обновление никнеймов для конкретного пользователя
        async updateChatNicknamesForUser(originalUsername, doc = document, forceUpdate = true) {
            this.log(`[_Rename_twitch_Nick_names_] Starting update for user "${originalUsername}"`);
            const messageElements = Array.from(doc.querySelectorAll('.chat-line__message')); // Уточнили селектор
            let processedCount = 0;
            for (const message of messageElements) {
                if (!message.isConnected)
                    continue;
                const messageOriginalUsername = this.getOriginalUsernameFromMessage(message);
                if (messageOriginalUsername !== originalUsername)
                    continue;
                // Принудительно очищаем кэш для этого сообщения
                this.processedMessages.delete(message);
                delete message.dataset.processed;
                this.log(`[_Rename_twitch_Nick_names_] Found message for "${originalUsername}"`);
                this.applyCustomNickname(message, true); // Принудительное обновление
                processedCount++;
            }
            this.log(`[_Rename_twitch_Nick_names_] Updated ${processedCount} messages for "${originalUsername}"`);
            if (processedCount === 0) {
                this.log(`[_Rename_twitch_Nick_names_] No messages found for "${originalUsername}"`);
            }
        }
        // ====== Добавление кнопки редактирования никнейма
        addNicknameEditButton() {
            const usernameContainer = document.querySelector('.viewer-card-header__display-name');
            if (!usernameContainer)
                return;
            const usernameElement = usernameContainer.querySelector('.CoreText-sc-1txzju1-0 a');
            if (!usernameElement)
                return;
            const displayName = usernameElement.textContent?.trim();
            if (!displayName)
                return;
            const loginElement = document.querySelector('.viewer-card__name .tw-login');
            const login = loginElement?.textContent?.replace(/[()]/g, '').trim() || '';
            const originalUsername = login && login !== displayName
                ? this.normalizeUsername(`${displayName} (${login})`)
                : this.normalizeUsername(displayName);
            // Очистка существующего кастомного никнейма в профиле
            const existingCustomNick = usernameContainer.querySelector('.custom-nickname-profile');
            if (existingCustomNick)
                existingCustomNick.remove();
            if (this.renamedUsersCache[originalUsername]) {
                const customNickSpan = document.createElement('span');
                customNickSpan.className = 'custom-nickname-profile';
                customNickSpan.textContent = this.renamedUsersCache[originalUsername];
                usernameContainer.appendChild(customNickSpan);
            }
       
       // Надёжный поиск родительского контейнера ряда кнопок (gQGOcr внутри jHLEAt)
            let buttonsContainer = document.querySelector('button[aria-label^="Follow"], button[data-a-target="follow-button"]')?.closest('.Layout-sc-1xcs6mc-0.gPVkpw')?.parentElement;
            if (!buttonsContainer) {
                buttonsContainer = document.querySelector('button[data-a-target="usercard-whisper-button"]')?.closest('.Layout-sc-1xcs6mc-0.gPVkpw')?.parentElement;
            }
            if (!buttonsContainer) {
                // Для своего профиля
                buttonsContainer = document.querySelector('.viewer-card .Layout-sc-1xcs6mc-0.dCHPUH .viewer-card-drag-cancel');
            }
            if (!buttonsContainer || buttonsContainer.querySelector('.rename-nick-button')) {
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
            });
            inputField.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter') {
                    let newNickname = inputField.value.trim().replace(/[<>"';&]/g, '');
                    if (!newNickname || newNickname.match(/^\s*$/) || newNickname.length > 50) {
                        inputField.style.display = 'none';
                        inputField.value = '';
                        return;
                    }
                    const existingUser = Object.keys(this.renamedUsersCache).find(key => this.renamedUsersCache[key] === newNickname && key !== originalUsername);
                    if (existingUser) {
                        inputField.style.display = 'none';
                        inputField.value = '';
                        return;
                    }
                    // Обновляем кэш
                    this.renamedUsersCache[originalUsername] = newNickname;
                    await this.setStorage('renamedTwitchUsers', this.renamedUsersCache);
                    // Очистка и обновление кастомного никнейма в профиле
                    const existingCustomNick = usernameContainer.querySelector('.custom-nickname-profile');
                    if (existingCustomNick)
                        existingCustomNick.remove();
                    const customNickSpan = document.createElement('span');
                    customNickSpan.className = 'custom-nickname-profile';
                    customNickSpan.textContent = newNickname;
                    usernameContainer.appendChild(customNickSpan);
                    deleteButton.style.display = 'inline-block';
                    await this.updateChatNicknamesForUser(originalUsername, document, true); // Принудительное обновление
                    inputField.style.display = 'none';
                    inputField.value = '';
                }
            });
            inputField.addEventListener('blur', () => {
                inputField.style.display = 'none';
                inputField.value = '';
            });
            deleteButton.addEventListener('click', async () => {
                if (this.renamedUsersCache[originalUsername]) {
                    // Удаляем никнейм из кэша
                    delete this.renamedUsersCache[originalUsername];
                    await this.setStorage('renamedTwitchUsers', this.renamedUsersCache);
                    // Удаляем кастомный никнейм из профиля
                    const existingCustomNick = usernameContainer.querySelector('.custom-nickname-profile');
                    if (existingCustomNick)
                        existingCustomNick.remove();
                    deleteButton.style.display = 'none';
                    await this.updateChatNicknamesForUser(originalUsername, document, true); // Принудительное обновление
                }
            });
        }
        // ====== Добавление стилей
        addStyles() {
        if (this.styleElement)
            return;
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
        .custom-nickname-container .original-nickname {
            opacity: 1;
            pointer-events: auto;
            display: inline-block;
        }

        .custom-nickname-container:has(.custom-nickname) .original-nickname {
            opacity: 0;
            pointer-events: none;
        }

        
        .original-nickname {
            opacity: 1;
            white-space: nowrap;
            pointer-events: auto;
            display: inline-block;
            font-weight: 600;
            unicode-bidi: plaintext;
        }

        .chat-author__display-name {
            position: relative;
            display: inline-block;
            font-family: 'Roobert', sans-serif !important;
            font-weight: 600;
            unicode-bidi: plaintext;
        }

        .custom-nickname-container {
            position: relative;
            display: inline-block;
            unicode-bidi: plaintext;
            z-index: 100999;
        }

        .custom-nickname-container:has(.custom-nickname) .original-nickname {
            opacity: 0;
            pointer-events: none;
            z-index: 1;
        }
        .custom-nickname-container:has(.custom-nickname) .original-nickname {
            width: 225px;
        }
        .custom-nickname { 
            position: absolute;
            top: 0;
            left: 0;
            opacity: 1 !important;
            color: inherit;
            pointer-events: none;
            z-index: 1;
            white-space: nowrap;
            overflow: visible;
            font-family: inherit;
            font-weight: 600;
            unicode-bidi: plaintext;
        }

        .custom-nickname-container:hover::after {
            width: 115px !important;
            content: attr(data-original-username);
            position: absolute;
            bottom: 100%;
            left: 33px;
            white-space: normal;
            background: rgb(51, 87, 75);
            color: rgb(69, 184, 178);
            font-size: 16px;
            padding: 2px 8px;
            border-radius: 4px;
            border: 2px solid rgb(69, 184, 178);
            margin-bottom: 5px;
            z-index: 500100 !important
            word-break: break-word;
            display: flex;
            justify-content: space-around;
            unicode-bidi: plaintext;
        }

        .viewer-card-header__display-name {
            display: inline-block;
            font-family: 'Roobert', sans-serif !important;
            unicode-bidi: plaintext;
        }

        .viewer-card-header__display-name .custom-nickname-profile {
            font-size: 14px;
            color: rgb(43, 255, 0);
            font-weight: 500;
            margin-top: 2px;
            white-space: nowrap;
            overflow: visible;
            unicode-bidi: plaintext;
        }

        .viewer-card-header__display-name .custom-nickname-profile::before {
            content: '(';
        }

        .viewer-card-header__display-name .custom-nickname-profile::after {
            content: ')';
        }

        /* --------- * Исправляет баг для значка когда значок выходит за пределы * -------- */
        /* --------- * Исправляет баг для значка когда значок выходит за пределы * -------- */
        .chat-line__message--badges {
            left: 8px !important;
        }

        /* --------- * Исправляет баг для значка когда значок выходит за пределы * -------- */
        /* --------- * Исправляет баг для значка когда значок выходит за пределы * -------- */
      `;
            document.head.appendChild(this.styleElement);
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc) {
                        const iframeStyle = iframeDoc.createElement('style');
                        iframeStyle.textContent = this.styleElement.textContent;
                        iframeDoc.head.appendChild(iframeStyle);
                        this.log('[_Rename_twitch_Nick_names_] Added styles to iframe');
                    }
                }
                catch (e) {
                    this.log('[_Rename_twitch_Nick_names_] Failed to add styles to iframe:', e);
                }
            });
            this.log('[_Rename_twitch_Nick_names_] CSS applied');
        }
        
        // ====== Мониторинг смены канала
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
        // ====== Мониторинг видимости вкладки
        handleVisibilityChange() {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && this.isRenameNickEnabled) {
                    this.log('[_Rename_twitch_Nick_names_] Tab visible, reapplying nicknames...');
                    this.updateChatNicknamesForAll();
                    this.startPeriodicCheck();
                }
            });
        }
        // ====== Инициализация
        async init() {
            await this.cleanRenamedUserKeys();
            if (!await this.getStorage('renamedTwitchUsers')) {
                await this.setStorage('renamedTwitchUsers', {});
            }
            this.renamedUsersCache = await this.getStorage('renamedTwitchUsers', {});
            this.addStyles();
            const viewerCardObserver = new MutationObserver(() => {
                const viewerCard = document.querySelector('.viewer-card');
                if (viewerCard && !viewerCard.dataset.editButtonAdded) {
                    viewerCard.dataset.editButtonAdded = 'true';
                    this.addNicknameEditButton();
                     setTimeout(() => {
                        if (!document.querySelector('.rename-nick-button')) {
                            this.addNicknameEditButton();
                        }
                    }, 500); // Повторная попытка через 500 мс
                }
            });
            viewerCardObserver.observe(document.body, { childList: true, subtree: true });
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
                            this.addStyles();
                            this.observeChatMessages();
                            this.monitorChannelChange();
                            this.startPeriodicCheck();
                        }
                        else {
                            if (this.observer)
                                this.observer.disconnect();
                            if (this.checkInterval)
                                clearInterval(this.checkInterval);
                            this.processedMessages = new WeakMap();
                        }
                    }
                }
            });
            this.log('[_Rename_twitch_Nick_names_] Module initialized');
        }
    }
    // ====== Инициализация модуля
       function initRenameNicknames() {
        // Прямое использование localStorage вместо getStorage/setStorage
        const getStorage = (key, defaultValue) => {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            } catch (e) {
                console.error('[_Rename_twitch_Nick_names_] Error reading from localStorage:', e);
                return defaultValue;
            }
        };

        const setStorage = async (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('[_Rename_twitch_Nick_names_] Error writing to localStorage:', e);
            }
        };

        window.renameNicknamesInstance = new RenameNicknamesInstantFull({
            getStorage: getStorage,
            setStorage: setStorage,
            log: (...args) => console.log(...args)
        });
        window.renameNicknamesInstance.init();
    }
    initRenameNicknames();
})(); 
 