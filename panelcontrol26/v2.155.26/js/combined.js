// ======== combined.js главный модуль точка входа ==== //
// 4921 function updateBannedChatList
// 3602 function updateBlockedEmotesList
// 4172 function makePanelResizable
// 4416 function makePanelDraggable
// 4483 СТИЛИ button-container
// 3108 end of showEmoteSelectionPopup 
// ======== combined.js главный модуль точка входа ==== //
// Ожидание загрузки всех модулей

 
// ====================== включение логирования ==================== //
// Включаем логирование по умолчанию 
// ===================================== end of включение логирования ============================== //
// ================================================================================================ //
// ============================== (1) storage.js ================================================== //
// ================================= хранилище storage.js ======================================== //
// ====== Инициализация хранилища
// ====== Проверяем наличие необходимых ключей в localStorage
// ====== Инициализация хранилища ======================= //
// Глобальные флаги
// Инициализация хранилища  

// ================================ end of storage.js  ========================================= //
// ============================================================================================== //
// ============================================================================================= //
// ====================== Функция инициализации блокировки initBlocking ======================== //
// ======================= (2) blocking.js ========================== // 
// ================= end of Функция инициализации блокировки initBlocking ================== //
// ======================================================================================= //
// ===================================  end of initBlocking blocking.js  =========================================== //
// ==================================================================================================== //
// ================================================================================================== //
// ==============================  ФУНКЦИЯ ФИЛЬТРАЦИИ Сообщений В ЧАТЕ ================================ //
// ============== Функция для добавления addKeyword =================== //
// ================ startKeywordFiltering ================= //

 

// =================== addUser ==================== //

function addUser(username) {
    console.log('[addUser] Добавление никнейма:', username);
    try {
        let bannedUsers = window.bannedUsers || getStorage('bannedUsers', []);
        if (!Array.isArray(bannedUsers)) {
            console.error('[addUser] bannedUsers не массив:', bannedUsers);
            bannedUsers = [];
            setStorage('bannedUsers', bannedUsers);
        }
        // Нормализуем никнейм
        const normalizedUsername = normalizeUsername(username);
        const isDuplicate = bannedUsers.some(user => user.text.toLowerCase() === normalizedUsername.toLowerCase() && user.type === 'user');
        if (isDuplicate) {
            window.Notifications.showPanelNotification(`Никнейм "${username}" уже добавлен`, 5000, false);
            return null;
        }
        const userId = getUserIdFromChat(username);
        const newUser = {
            id: `user_${crypto.randomUUID()}`,
            text: normalizedUsername, // Сохраняем нормализованный никнейм
            displayText: username, // Сохраняем оригинальный для отображения
            type: 'user',
            userId,
            isNickname: true,
            date: new Date().toISOString()
        };
        bannedUsers.push(newUser);
        setStorage('bannedUsers', bannedUsers);
        console.log('[addUser] Added user:', newUser);
        const bannedChatList = document.querySelector('#banned-chat-list');
if (bannedChatList) {
    updateBannedChatList(bannedChatList, {
        bannedKeywords: window.bannedKeywords || getStorage('bannedKeywords', []),
        bannedUsers: window.bannedUsers || getStorage('bannedUsers', []),
        newlyAddedIds: new Set([newUser.id]),
        lastKeyword: newUser
    });
}
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container', '.vod-message', '.chat-room__content', '.chat-list--default', '[data-test-selector="chat-scrollable-area__message-container"]');
        if (chatContainer && window.chatFilter) {
            window.chatFilter.filterTextInNode(chatContainer);
        }
        window.Notifications.showPanelNotification(`Никнейм "${username}" добавлен`, 3000, true);
        return newUser;
    }
    catch (e) {
        console.error('[addUser] Ошибка:', e);
        window.Notifications.showPanelNotification('Ошибка при добавлении никнейма', 5000, false);
        return null;
    }
}
//   функция normalizeUsername (взята из RenameNicknames)
function normalizeUsername(username) {
    if (!username || typeof username !== 'string') {
        console.log('[NormalizeUsername] Invalid username provided:', username);
        return '';
    }
    const trimmed = username.trim();
    if (!trimmed) {
        console.log('[NormalizeUsername] Empty username after trimming');
        return '';
    }
    const hasNonLatin = /[^-\u007F]/.test(trimmed);
    const normalized = hasNonLatin ? trimmed : trimmed.toLowerCase();
    console.log(`[NormalizeUsername] Normalized "${username}" to "${normalized}"`);
    return normalized;
}
function addKeyword(text, platform) {
    try {
        console.log('[addKeyword] Attempting to add:', { text, platform });
        const storageKey = platform === 'user' ? 'bannedUsers' : 'bannedKeywords';
        let items = (storageKey === 'bannedKeywords' ? window.bannedKeywords : window.bannedUsers) || getStorage(storageKey, []);
        if (!Array.isArray(items)) {
            console.error(`[addKeyword] ${storageKey} is not an array, resetting...`);
            items = [];
            setStorage(storageKey, items);
        }
        const isDuplicate = items.some(item => item.text.toLowerCase() === text.toLowerCase() && item.type === platform);
        if (isDuplicate) {
            console.log('[addKeyword] Duplicate found:', text, platform);
            window.Notifications.showPanelNotification(`"${text}" already added`, 5000, false);
            return null;
        }
        if (!text || text.length < 1) {
            console.log('[addKeyword] Invalid input: empty or too short:', text);
            window.Notifications.showPanelNotification('Input cannot be empty', 5000, false);
            return null;
        }
        const userId = platform === 'user' ? getUserIdFromChat(text) : null;
        const isPhrase = platform === 'keyword' && text.trim().includes(' '); // Фраза, если есть пробел
        const newItem = {
            id: `${platform}_${crypto.randomUUID()}`,
            text,
            displayText: text,
            type: platform,
            userId,
            isNickname: platform === 'user',
            isPhrase: isPhrase, // true только для фраз
            isStrictPhrase: isPhrase, // Для строгого соответствия фразы
            date: new Date().toISOString()
        };
        items.push(newItem);
        setStorage(storageKey, items);
        console.log(`[addKeyword] Added to ${storageKey}:`, newItem);
        const bannedChatList = document.querySelector('#banned-chat-list');
        if (bannedChatList) {
            updateBannedChatList(bannedChatList, {
                bannedKeywords: getStorage('bannedKeywords', []),
                bannedUsers: getStorage('bannedUsers', []),
                newlyAddedIds: new Set([newItem.id]),
                lastKeyword: newItem
            });
        }
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container,.vod-message, .chat-room__content, .chat-list--default, [data-test-selector="chat-scrollable-area__message-container"]');
        if (chatContainer && window.chatFilter) {
            console.log('[addKeyword] Applying filter to chat container');
            window.chatFilter.filterTextInNode(chatContainer);
        }
        window.Notifications.showPanelNotification(`"${text}" added`, 3000, true);
        return newItem;
    }
    catch (e) {
        console.error('[addKeyword] Error:', e);
        window.Notifications.showPanelNotification('Error adding item', 5000, false);
        return null;
    }
}
function setupKeywordInput() {
    const { keywordInput, addKeywordButton, bannedChatList, keywordType } = uiElements;
    if (!keywordInput || !addKeywordButton || !bannedChatList || !keywordType) {
        console.error('[Content] UI элементы отсутствуют:', {
            keywordInput: !!keywordInput,
            addKeywordButton: !!addKeywordButton,
            bannedChatList: !!bannedChatList,
            keywordType: !!keywordType
        });
        return;
    }
    // Проверка на совпадение UI-элементов
    if (keywordInput === uiElements.addInput || keywordType === uiElements.platformSelect) {
        console.warn('[Content] Дублирование UI элементов, отключаем setupKeywordInput:', {
            keywordInput: keywordInput?.id,
            addInput: uiElements.addInput?.id,
            keywordType: keywordType?.id,
            platformSelect: uiElements.platformSelect?.id
        });
        return; // Отключаем, если элементы совпадают
    }
    addKeywordButton.removeEventListener('click', handleAddKeyword);
    addKeywordButton.addEventListener('click', handleAddKeyword);
   
    function handleAddKeyword() {
        const text = keywordInput.value.trim();
        const platform = keywordType.value.trim();
        console.log('[UI] Кнопка добавления (keyword) нажата:', { text, platform });
        if (!text) {
            window.Notifications.showPanelNotification('Введите никнейм, ключевое слово, эмодзи или канал', 5000, false);
            return;
        }
        if (!['user', 'keyword', 'bttTV', '7tv', 'ffz', 'TwitchChannel'].includes(platform)) {
            console.error('[UI] Некорректное значение platform:', platform);
            window.Notifications.showPanelNotification('Ошибка: выберите корректный тип', 5000, false);
            return;
        }
        let result;
        if (platform === 'user') {
            console.log('[UI] Вызываем addUser:', { text });
            result = addUser(text);
        }
        else if (platform === 'keyword') {
            console.log('[UI] Вызываем addKeyword:', { text, platform });
            result = addKeyword(text, 'keyword');
        }
        else {
            console.log('[UI] Вызываем addEmoteOrChannel:', { text, platform });
            let emoteUrl = '';
            if (!text.startsWith('http')) {
                if (platform === '7tv') {
                    emoteUrl = `https://cdn.7tv.app/emote/${text}/2x.webp`;
                }
                else if (platform === 'bttTV') {
                    emoteUrl = `https://cdn.betterttv.net/emote/${text}/2x.webp`;
                }
                else if (platform === 'ffz') {
                    emoteUrl = `https://cdn.frankerfacez.com/emote/${text}/2`;
                }
            }
            else {
                emoteUrl = text;
                if (['bttTV', '7tv'].includes(platform) && !emoteUrl.match(/\/\dx\.webp$/)) {
                    emoteUrl = `${emoteUrl}/2x.webp`;
                }
            }
            result = addEmoteOrChannel(text, platform, text, emoteUrl, null, platform === 'TwitchChannel');
        }
        if (result) {
            keywordInput.value = '';
            const bannedChatListButton = document.querySelector('#banned-chat-list-button');
            const blockedEmotesListButton = document.querySelector('#blocked-emotes-list-button');
            if (['user', 'keyword'].includes(platform)) {
                if (bannedChatListButton && currentList !== 'bannedKeywords') {
                    bannedChatList.style.transform = 'translateX(0)';
                    currentList = 'banned';
                    bannedChatListButton.style.backgroundColor = ' #0c7036';
                    bannedChatListButton.style.color = 'white';
                    if (blockedEmotesListButton) {
                        blockedEmotesListButton.style.backgroundColor = '';
                        blockedEmotesListButton.style.color = '';
                    }
                    setStorage('currentList', 'banned');
                    console.log('[UI] Переключено на bannedChatList');
                }
                const bannedKeywords = getStorage('bannedKeywords', []);
                const bannedUsers = getStorage('bannedUsers', []);
                updateBannedChatList(bannedChatList, {
                    bannedKeywords,
                    bannedUsers,
                    newlyAddedIds: new Set([result.id]),
                    lastKeyword: null
                });
                // Уведомление уже показывается в addUser/addKeyword
            }
            else {
                if (uiElements?.blockedList) {
                    updateBlockedEmotesList(uiElements.blockedList, getBlockedItems());
                    goToLastAddedItem();
                }
                window.Notifications.showPanelNotification(`${platform === 'TwitchChannel' ? 'Канал' : 'Эмодзи'} "${text}" добавлено`, 8000, true);
            }
            if (uiElements?.counter) {
                updateCounter(uiElements.counter);
            }
            const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-test-selector="chat-scrollable-area__message-container"]');
            if (chatContainer && window.chatFilter) {
                console.log('[UI] Применяем фильтр к контейнеру чата');
                window.chatFilter.filterTextInNode(chatContainer);
                if (['bttTV', '7tv', 'ffz', 'TwitchChannel'].includes(platform)) {
                    toggleEmotesInChat(true);
                }
            }
        }
    }
    keywordInput.removeEventListener('keypress', handleKeypress);
    keywordInput.addEventListener('keypress', handleKeypress);
    function handleKeypress(e) {
        if (e.key === 'Enter') {
            addKeywordButton.click();
        }
    }
    console.log('[Content] Обработчик ввода настроен');
}
function startKeywordFiltering() {
    console.log("[_Chat_Keyword_Filtering_]  Запуск фильтрации по ключевым словам...");
    isBlockingEnabled = getStorage('isBlockingEnabled', true);
    const isKeywordBlockingEnabled = getStorage('isKeywordBlockingEnabled', true);
    console.log("[_Chat_Keyword_Filtering_]  Состояние блокировки:", { isBlockingEnabled, isKeywordBlockingEnabled });
    const filterMessages = () => {
        if (!isBlockingEnabled || !isKeywordBlockingEnabled) {
            console.log("[_Chat_Keyword_Filtering_]  Фильтрация по ключевым словам отключена, пропускаем...");
            return;
        }
        const bannedKeywords = window.bannedKeywords || getStorage('bannedKeywords', []);
        if (!bannedKeywords.length) {
            console.log("[_Chat_Keyword_Filtering_]  Нет запрещённых слов, пропускаем...");
            return;
        }
       //======== Отладка перерасчет массива хранилища слов отключаем спам лога =====//
      //========  console.log("[_Chat_Keyword_Filtering_]  Текущие ключевые слова:", bannedKeywords); =========//
     //======== Отладка перерасчет массива хранилища слов отключаем спам лога ========//

        // Добавляем .vod-message в селектор сообщений
        const messages = document.querySelectorAll('[data-a-target="chat-line-message"], .vod-message');
        messages.forEach(message => {
            const textFragment = message.querySelector('[data-a-target="chat-message-text"], [data-test-selector="comment-message-selector"]');
            if (!textFragment)
                return;
            // Skip if already filtered
            const messageId = `${Date.now()}_${message.dataset.userId || 'unknown'}`;
            if (filteredMessages.has(messageId))
                return;
            let text = textFragment.textContent;
            let lowerText = text.toLowerCase();
            let modified = false;
            let matchedKeywordText = null;
            for (const keyword of bannedKeywords) {
                const searchText = keyword.text.toLowerCase();
                const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                let regex;
                if (keyword.isPhrase && keyword.isStrictPhrase) {
                    regex = new RegExp(`\\b${escapedText}\\b`, 'gi');
                }
                else if (keyword.isPhrase) {
                    const pattern = escapedText
                        .split(/\s+/)
                        .map(word => `\\s*${word}\\s*`)
                        .join('');
                    regex = new RegExp(`(?:${pattern}){1,3000}`, 'gi');
                }
                else {
                    regex = new RegExp(`(?:\\b${escapedText}\\b)|(?:${escapedText}){1,3000}`, 'gi');
                }
                if (regex.test(lowerText)) {
                    // Replace the matched keyword with a placeholder
                    text = text.replace(regex, '[filtered]');
                    modified = true;
                    matchedKeywordText = keyword.text;
                    filteredMessages.set(messageId, {
                        element: message,
                        userId: message.dataset.userId,
                        keywordId: keyword.id,
                        originalText: textFragment.textContent, // Store original for potential restoration
                        parent: message.parentNode,
                        nextSibling: message.nextSibling
                    });
                    console.log(`[_Chat_Keyword_Filtering_]  Фильтровано слово "${keyword.text}" в сообщении (userId: ${message.dataset.userId})`);
                    window.Notifications.showNotification(`Найдено совпадение с ключевым словом: ${keyword.text}`, true);
                }
            }
            if (modified) {
                // Update the text content with the filtered text
                textFragment.textContent = text;
            }
        });
    };
    const tryStartObserver = (attempt = 1, maxAttempts = 20) => {
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-a-target="chat-room-content"]');
        console.log(`[_Chat_Keyword_Filtering_]  Проверяем контейнер чата (попытка ${attempt}/${maxAttempts}):`, chatContainer);
        if (chatContainer) {
            console.log("[_Chat_Keyword_Filtering_]  Контейнер чата найден:", chatContainer);
            const observer = new MutationObserver(() => {
                console.log("[_Chat_Keyword_Filtering_]  Обнаружены изменения в чате, запускаем filterMessages...");
                filterMessages();
            });
            observer.observe(chatContainer, { childList: true, subtree: true });
            console.log("[_Chat_Keyword_Filtering_]  Наблюдатель фильтрации запущен");
            filterMessages();
            return observer;
        }
        else if (attempt <= maxAttempts) {
            console.warn(`[_Chat_Keyword_Filtering_]  Контейнер чата не найден, попытка ${attempt}/${maxAttempts}...`);
            setTimeout(() => tryStartObserver(attempt + 1, maxAttempts), 1000);
        }
        else {
            console.error("[_Chat_Keyword_Filtering_]  Контейнер чата не найден после всех попыток");
            window.Notifications.showPanelNotification("Ошибка: контейнер чата не найден", false);
        }
    };
    const observer = tryStartObserver();
    return () => {
        if (observer)
            observer.disconnect();
        console.log("[_Chat_Keyword_Filtering_]  Фильтрация остановлена");
    };
}
// ========================================================================================================== //
// =============================== CHATOBSERVER НАБЛЮДЕНИЕ ЗА ИЗМЕНЕНИЯМИ В ЧАТЕ ======================================== //
// ========================================================================================================== //
function getUserIdFromChat(username) {
    const messages = document.querySelectorAll('.chat-line__message');
    for (const message of messages) {
        const usernameElement = message.querySelector('.chat-author__display-name');
        if (usernameElement && usernameElement.textContent.toLowerCase() === username.toLowerCase()) {
            return message.dataset.userId || message.getAttribute('data-user-id') || null;
        }
    }
    return null;
}
function observeKeywordChatContainer(container = document.querySelector('.chat-scrollable-area__message-container, .vod-message, .chat-room__content, .chat-list--default, [data-a-target="chat-room-content"]')) {
    if (!container) {
        console.log("[_Keyword_Blocking_] Chat container not found for observation");
        keywordObserverIsActive = false;
        return;
    }
    if (keywordObserver) {
        keywordObserver.disconnect();
    }
    keywordObserver = new MutationObserver(() => {
        console.log("[_Keyword_Blocking_] Chat changes detected, applying filter...");
        if (chatFilter.isTextBlockingEnabled) {
            chatFilter.filterTextInNode(container);
        }
    });
    keywordObserver.observe(container, { childList: true, subtree: true });
    keywordObserverIsActive = true;
    console.log("[_Keyword_Blocking_] Chat container observer started");
    if (chatFilter.isTextBlockingEnabled) {
        chatFilter.filterTextInNode(container);
    }
}
function startUnifiedRootObserver() {
    let debounceTimeout = null;
    const rootObserver = new MutationObserver(() => {
        if (debounceTimeout) return;
        debounceTimeout = setTimeout(() => {
            console.log('[UnifiedRootObserver] Processing DOM changes');
            const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-test-selector="chat-scrollable-area__message-container"], .vod-message');
            if (chatContainer) {
                if (!observerIsActive) {
                    console.log('[UnifiedRootObserver] Chat container found, starting emote observation');
                    observeChatContainer(chatContainer);
                }
                if (!keywordObserverIsActive && window.chatFilter?.isTextBlockingEnabled) {
                    console.log('[UnifiedRootObserver] Chat container found, starting keyword observation');
                    observeKeywordChatContainer(chatContainer);
                    window.chatFilter.filterTextInNode(chatContainer);
                }
            } else {
                console.log('[UnifiedRootObserver] Chat container not found');
                observerIsActive = false;
                keywordObserverIsActive = false;
            }
            debounceTimeout = null;
        }, 200);
    });
    const rootElement = document.querySelector('.video-player') || document.body;
    rootObserver.observe(rootElement, { childList: true, subtree: true });
    console.log('[UnifiedRootObserver] Started on:', rootElement === document.body ? 'document.body' : '.video-player');

    // Немедленная проверка контейнера
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-test-selector="chat-scrollable-area__message-container"], .vod-message');
    if (chatContainer) {
        toggleEmotesInChat(true);
        if (window.chatFilter?.isTextBlockingEnabled) {
            window.chatFilter.filterTextInNode(chatContainer);
            observeKeywordChatContainer(chatContainer);
        }
    }
}
function monitorKeywordChatReset() {
    const connectionMessageSelectors = [
        '[data-a-target="chat-connection-message"]',
        '.chat-connection-message',
        '.chat-status-message',
        '.vod-message',
        '.chat-line__status'
    ];
    let lastMessageCount = 0;
    let isChatResetting = false;
    const findConnectionMessage = () => {
        return connectionMessageSelectors.reduce((found, sel) => found || document.querySelector(sel), null);
    };
    const resetKeywordFiltering = () => {
        if (isChatResetting)
            return;
        isChatResetting = true;
        console.log("[_Keyword_Blocking_] Chat reset detected, restarting filtering...");
        window.Notifications.showNotification("Chat reset detected, restarting keyword filtering...", 2000);
        if (keywordObserver) {
            keywordObserver.disconnect();
            keywordObserverIsActive = false;
        }
        filteredMessages.clear();
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .vod-message, .chat-room__content');
        if (chatContainer) {
            observeKeywordChatContainer(chatContainer);
        }
        else {
            startUnifiedRootObserver();
        }
        setTimeout(() => {
            isChatResetting = false;
            console.log("[_Keyword_Blocking_] Keyword filtering restarted");
            window.Notifications.showPanelNotification("Keyword filtering restarted", 2500);
        }, 500);
    };
    const checkChatState = () => {
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .vod-message, .chat-room__content');
        if (!chatContainer) {
            console.log("[_Keyword_Blocking_] Chat container not found, triggering reset...");
            resetKeywordFiltering();
            return;
        }
        const connectionMessage = findConnectionMessage();
        if (connectionMessage && connectionMessage.textContent.toLowerCase().includes('connecting to chat')) {
            console.log("[_Keyword_Blocking_] Detected 'Connecting to chat' message, triggering reset...");
            resetKeywordFiltering();
            return;
        }
        const messages = chatContainer.querySelectorAll('[data-a-target="chat-line-message"], .vod-message, .chat-line__message');
        const currentMessageCount = messages.length;
        if (currentMessageCount === 0 && lastMessageCount > 0) {
            console.log("[_Keyword_Blocking_] Chat cleared (no messages), triggering reset...");
            resetKeywordFiltering();
        }
        else if (currentMessageCount > 0 && lastMessageCount === 0) {
            console.log("[_Keyword_Blocking_] New messages appeared after clear, applying filtering...");
            if (chatFilter.isTextBlockingEnabled) {
                chatFilter.filterTextInNode(chatContainer);
            }
        }
        lastMessageCount = currentMessageCount;
    };
    const connectionObserver = new MutationObserver(() => {
        const connectionMessage = findConnectionMessage();
        if (connectionMessage && connectionMessage.textContent.toLowerCase().includes('connecting to chat')) {
            console.log("[_Keyword_Blocking_] Mutation detected 'Connecting to chat', triggering reset...");
            resetKeywordFiltering();
        }
    });
    connectionObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-a-target', 'class']
    });
    setInterval(checkChatState, 500);
}
function monitorKeywordChannelChange() {
    const checkChannel = () => {
        const currentChannel = window.location.pathname.split('/')[1] || null;
        if (currentChannel && currentChannel !== lastChannel) {
            console.log(`[_Keyword_Blocking_] Channel changed: ${lastChannel} -> ${currentChannel}`);
            lastChannel = currentChannel;
            resetKeywordFiltering();
            toggleKeywordsInChat();
        }
    };
    setInterval(checkChannel, 2000);
    window.addEventListener('popstate', () => {
        console.log("[_Keyword_Blocking_] URL changed, checking channel...");
        checkChannel();
    });
}
function monitorKeywordIframeChanges() {
    const iframe = document.getElementById('чат');
    if (!iframe) {
        console.warn('[_Keyword_Blocking_] Iframe with ID "чат" not found');
        return;
    }
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                console.log('[_Keyword_Blocking_] Iframe src changed:', iframe.src);
                resetKeywordFiltering();
                monitorKeywordIframeContent(iframe);
            }
        });
    });
    observer.observe(iframe, { attributes: true, attributeFilter: ['src'] });
    iframe.addEventListener('load', () => {
        console.log('[_Keyword_Blocking_] Iframe loaded or reloaded:', iframe.src);
        monitorKeywordIframeContent(iframe);
    });
    monitorKeywordIframeContent(iframe);
}
function monitorKeywordIframeContent(iframe, attempt = 1, maxAttempts = 5) {
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (!iframeDoc) {
            if (attempt <= maxAttempts) {
                this.log(`[_Keyword_Blocking_] Cannot access iframe contentDocument, retrying (${attempt}/${maxAttempts})...`);
                setTimeout(() => this.monitorKeywordIframeContent(iframe, attempt + 1, maxAttempts), 1000);
            }
            else {
                this.log('[_Keyword_Blocking_] Failed to access iframe contentDocument after all attempts');
            }
            return;
        }
        const chatContainer = iframeDoc.querySelector('.chat-scrollable-area__message-container, .chat-room__content');
        if (chatContainer) {
            this.log('[_Keyword_Blocking_] Chat container found in iframe, applying filtering');
            this.filterTextInNode(chatContainer);
            observeChatContainer(chatContainer);
        }
        else {
            this.log('[_Keyword_Blocking_] Chat container not found in iframe');
            setTimeout(() => this.monitorKeywordIframeContent(iframe, attempt + 1, maxAttempts), 1000);
        }
    }
    catch (error) {
        this.log('[_Keyword_Blocking_] Error accessing iframe content:', error);
        if (attempt <= maxAttempts) {
            setTimeout(() => this.monitorKeywordIframeContent(iframe, attempt + 1, maxAttempts), 1000);
        }
    }
}
function startKeywordWatchdog() {
    const maxFailureDuration = 30000;
    const baseInterval = 5000;
    let lastCheckTime = 0;
    const check = () => {
        const currentTime = Date.now();
        if (currentTime - lastCheckTime < 5000)
            return;
        lastCheckTime = currentTime;
        const isWorking = checkKeywordFilteringStatus();
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container,  .vod-message, .chat-room__content');
        if (!isWorking || !chatContainer) {
            console.log('[_Keyword_Watchdog_] Watchdog: Filtering failure or chat container not found, restarting...');
            keywordLastFailureTime = keywordLastFailureTime || currentTime;
            resetKeywordFiltering();
            if (currentTime - keywordLastFailureTime > maxFailureDuration) {
                console.log('[_Keyword_Watchdog_] Watchdog: Failure lasts too long, forcing full restart...');
                if (observer) {
                    observer.disconnect();
                    observerIsActive = false;
                }
                toggleKeywordsInChat();
                keywordLastFailureTime = 0;
            }
        }
        else {
            keywordLastFailureTime = 0;
            console.log('[_Keyword_Watchdog_] Watchdog: Filtering working correctly');
        }
    };
    setInterval(() => {
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .vod-message, .chat-room__content');
        if (!chatContainer) {
            console.log('[_Keyword_Watchdog_] Watchdog: Chat container not found, checking more frequently');
            check();
        }
    }, 1000);
    setInterval(check, baseInterval);
}
function checkKeywordFilteringStatus() {
    console.log('[_Keyword_Blocking_] Watchdog: Checking filtering status...');
    // Добавляем .vod-message в селектор контейнера
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .vod-message');
    if (!chatContainer) {
        console.log('[_Keyword_Blocking_] Watchdog: Chat container not found');
        return false;
    }
    const messages = chatContainer.querySelectorAll('[data-a-target="chat-line-message"], .vod-message, .chat-line__message');
    if (messages.length === 0) {
        console.log('[_Keyword_Blocking_] Watchdog: No messages in chat, possibly loading');
        return true;
    }
    const bannedKeywords = getStorage('bannedKeywords', []);
    let failureDetected = false;
    messages.forEach((message, index) => {
        if (index > 5)
            return;
        const textFragment = message.querySelector('[data-a-target="chat-message-text"],.vod-message, .text-fragment');
        if (!textFragment)
            return;
        const text = textFragment.textContent.toLowerCase();
        const isVisible = message.style.display !== 'none';
        const shouldBeBlocked = bannedKeywords.some(keyword => {
            const keywordText = keyword.text.toLowerCase();
            return keyword.isPhrase ? text.includes(keywordText) : text.split(/\s+/).includes(keywordText);
        });
        if (getStorage('isKeywordBlockingEnabled', true) && shouldBeBlocked && isVisible) {
            console.log('[_Keyword_Blocking_] Watchdog: Message with banned keyword is visible!');
            failureDetected = true;
        }
    });
    console.log(`[_Keyword_Blocking_] Watchdog: Filtering status: ${failureDetected ? 'Failure detected' : 'Working correctly'}`);
    return !failureDetected;
}
function handleKeywordVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
        console.log("[_Keyword_Blocking_] Visibility changed:", document.visibilityState);
        if (document.visibilityState === 'visible' && !observerIsActive) {
            console.log("[_Keyword_Blocking_] Tab became visible, restarting observation...");
            if (observer)
                observer.disconnect();
            observeChatContainer();
        }
    });
}
function resetKeywordFiltering() {
    console.log("[_Keyword_Blocking_] Resetting keyword filtering...");
    try {
        if (keywordObserver) {
            keywordObserver.disconnect();
            keywordObserverIsActive = false;
        }
        filteredMessages.clear();
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .vod-message, .chat-room__content');
        if (chatContainer && chatFilter.isTextBlockingEnabled) {
            chatFilter.filterTextInNode(chatContainer);
            observeKeywordChatContainer(chatContainer);
        }
        else {
            startKeywordRootObserver();
        }
    }
    catch (error) {
        console.error("[_Keyword_Blocking_] Error in resetKeywordFiltering:", error);
    }
}
// ---------------- Функция    импорта заблокированных слов ---------------------- //

//----------- Функция   экспорта   ключевых слов

//----------- Функция   экспорта banned users

//----------- Функция удаления ключевых слов или banned users


// =========================================================================================== //
//------------ Функция экспорта ChatBannedItems (объединяет bannedKeywords и bannedUsers) ----------- //
//----------- Функция для импорта  banned users


// =========================================================================================== //
//========================= Функция импорта ChatBannedItems ================================== //
// ==================== end of Функция добавления addKeyword  =============================== //
// ========================================================================================== //
// ========================================================================================= // 
// ============================= (3) Функция checkBlockingStatus  ========================== //
// Функция проверки состояния блокировки
// ======================= end of Функция checkBlockingStatus  ============================ //
// ======================================================================================== //
// ======================================================================================== //
// ===== (4) ============= Функция перезапуска логики блокировки =========================== //
// ================================ end of Функция перезапуска логики блокировки ============================= //
// =========================================================================================================== //
// ============================================================================================================ //
// ==================================== (5) Функция запуска watchdog ========================================== //  
function startWatchdog() {
    let lastFailureTime = 0;
    const maxFailureDuration = 30000; // 30 секунд
    const baseInterval = getStorage('watchdogInterval', 5) * 1000;
    const check = () => {
        const currentTime = Date.now();
        if (currentTime - lastCheckTime < 5000)
            return;
        lastCheckTime = currentTime;
        const isWorking = checkBlockingStatus();
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container') ||
            document.querySelector('.chat-image chat-line__message--emote ffz--pointer-events ffz-tooltip ffz-emote') ||
            document.querySelector('.chat-room__content') ||
            document.querySelector('[data-a-target="chat-room-content"]') ||
            document.querySelector('.vod-message') ||
            document.querySelector('.chat-list--default');
        if (!isWorking || !chatContainer) {
            console.log('%c[WATCHDOG]%c Обнаружен сбой в работе блокировки или контейнер чата не найден, перезапуск...', 'color: #FFA500; font-weight: bold;', 'color: #FFA500;');
            lastFailureTime = lastFailureTime || currentTime;
            restartBlockingLogic();
            if (currentTime - lastFailureTime > maxFailureDuration) {
                console.log('%c[WATCHDOG]%c Сбой длится слишком долго, принудительный полный перезапуск...', 'color:rgb(194, 86, 86); font-weight: bold;', 'color:rgb(204, 79, 79);');
                initBlocking();
                startRootObserver(); // Перезапускаем наблюдение за корнем
                lastFailureTime = 0;
            }
        }
        else {
            lastFailureTime = 0;
            console.log(`%c[WATCHDOG] %cБлокировка работает корректно!`, 'color:rgb(6, 167, 0); font-weight: bold;', 'color: rgb(164, 207, 44);');
        }
    };
    setInterval(() => {
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .vod-message, .chat-image chat-line__message--emote ffz--pointer-events ffz-tooltip ffz-emote, .ffz--inline, chat-line__message tw-relative') ||
            document.querySelector('.chat-room__content');
        if (!chatContainer) {
            console.log("[WATCHDOG] Контейнер чата не найден, проверяем чаще");
            check();
        }
    }, 1000); // Проверка каждую секунду, если контейнер отсутствует
    setInterval(check, baseInterval);
}
// =========================== end of Функция запуска watchdog ==================================== //
// =============================================================================================== //
// ===================================================================================================== //
// ============ Функция обработки изменения видимости вкладки handleVisibilityChange ================== //
function handleVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
        console.log("[Extension] Visibility changed:", document.visibilityState);
        if (document.visibilityState === 'visible' && !observerIsActive) {
            console.log("[Blocking_Emotes]  Tab became visible, restarting observation...");
            observer.disconnect();
            observeChatContainer();
        }
    });
}
// ============================= end of обработки видимости вкладки handleVisibilityChange ============ //
// =================================================================================================== //
// ====================================================================================================== //
// ================== (6) Функция для мониторинга смены канала monitorChannelChange ==================== //
// Глобальная переменная для отслеживания последнего канала
// ---------------- функция для мониторинга смены канала  ---------------------------------------- //
function monitorChannelChange() {
    const checkChannel = () => {
        const currentChannel = window.location.pathname.split('/')[1] || null;
        if (currentChannel && currentChannel !== lastChannel) {
            console.log(`[Blocking_Emotes]  Channel changed: ${lastChannel} -> ${currentChannel}`);
            lastChannel = currentChannel;
            restartBlockingLogic();
            toggleEmotesInChat(true);
        }
    };
    // Проверяем изменение канала каждые 2 секунды
    setInterval(checkChannel, 2000);
    // Также реагируем на изменения URL
    window.addEventListener('popstate', () => {
        console.log("[Blocking_Emotes]  URL changed, checking channel...");
        checkChannel();
    });
}
// ===================== end of мониторинг смены канала monitorChannelChange ========================= //
// =================================================================================================== //
// =================== функция для мониторинга изменений в iframe ================================== //
// -----------------------Monitor changes in the iframe with ID 'чат' ----------------------------- //
function monitorIframeChanges() {
    const iframe = document.getElementById('чат');
    if (!iframe) {
        console.warn('[Content] Iframe with ID "чат" not found');
        return;
    }
    // Observe iframe attribute changes (e.g., src)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                console.log('[Content] Iframe src changed:', iframe.src);
                restartBlockingLogic(); // Restart blocking for new chat content
                monitorIframeContent(iframe);
            }
        });
    });
    observer.observe(iframe, {
        attributes: true,
        attributeFilter: ['src']
    });
    // Detect iframe reloads
    iframe.addEventListener('load', () => {
        console.log('[Content] Iframe loaded or reloaded:', iframe.src);
        monitorIframeContent(iframe);
    });
    // Initial check
    monitorIframeContent(iframe);
}
// ========================================================================================================== //
// =========== Функция monitorIframeContent для мониторинга изменений в iframe ============================== //
// Monitor iframe content for chat container
function monitorIframeContent(iframe) {
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (!iframeDoc) {
            console.warn('[Content] Cannot access iframe contentDocument');
            return;
        }
        const chatContainer = iframeDoc.querySelector('.chat-scrollable-area__message-container, .vod-message, .chat-room__content');
        if (chatContainer) {
            console.log('[Content] Chat container found in iframe, applying blocking');
            toggleEmotesInNode(chatContainer, true);
            startKeywordFiltering(); // Apply keyword filtering
            observeChatContainer(iframeDoc); // Start observing chat
        }
        else {
            console.warn('[Content] Chat container not found in iframe');
            // Retry after a delay
            setTimeout(() => monitorIframeContent(iframe), 1000);
        }
    }
    catch (error) {
        console.warn('[Content] Error accessing iframe content:', error);
    }
}
// ========= (6) Функция monitorIframeContent для наблюдения за изменениями в корневом элементе ============ //
// ============================================================================================== //
// ==================== Глобальный observer для отслеживания изменений в чате ==================== //
// Глобальный observer для отслеживания изменений в чате
function startRootObserver() {
    let debounceTimeout = null;
    const rootObserver = new MutationObserver((mutations) => {
        if (debounceTimeout)
            return;
        debounceTimeout = setTimeout(() => {
            console.log('[Blocking_Emotes]  RootObserver: Processing DOM changes:', mutations.length);
            const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .vod-message, .chat-list--default, [data-a-target="chat-room-content"]');
            if (chatContainer && !observerIsActive) {
                console.log('[Blocking_Emotes]  RootObserver: Chat container found, starting observation');
                observeChatContainer();
            }
            else if (!chatContainer) {
                console.log('[Blocking_Emotes]  RootObserver: Chat container not found');
                observerIsActive = false;
            }
            debounceTimeout = null;
        }, 150); // Среднее значение между 100 и 200 мс
    });
    const rootElement = document.querySelector('.video-player') || document.body;
    rootObserver.observe(rootElement, { childList: true, subtree: true });
    console.log('[Blocking_Emotes]  RootObserver started on:', rootElement === document.body ? 'document.body' : '.video-player');
}
// ============================== end of startRootObserver =================================== //
// =========================================================================================== //
// ======= Обработчик события видимости вкладки и вызов handleVisibilityChange ======= //
//---------------------------------------------------------------------------------------------//
// document.addEventListener('visibilitychange', () => {  //
//  console.log("[Extension] Visibility changed:", document.visibilityState);  //
// });  //
// window.addEventListener('beforeunload', () => {
// console.log("[Extension] Page is unloading"); //
// });  //
// ======= Обработчик события видимости вкладки и вызов handleVisibilityChange ======= //
//---------------------------------------------------------------------------------------------//
// ======================================================================================= //
// =============== Глобальный observer для отслеживания изменений в чате ================= //
 
// Глобальные элементы UI


// ============= Глобальный флаг для отслеживания активности наблюдателя  ========================= //
// =========================================================================================== //
// =========================================================================================== //
// ========================== Функция для генерации уникального ID ========================== //
// ============================= end of generateRandomID ======================================== //
// ============================================================================================= //
// ================================================================================================ //
// ========================== Функция  showEmoteSelectionPopup ==================================== //
// ============================================= end of getEmotesFromViewerCard ========================================== //
// ======================================================================================================================= //
// ========================================= end of showEmoteSelectionPopup ============================================== //
// ======================================================================================================================= //
// ======================================================================================================================= //
// ======================================================================================================================= //
// ======================================================================================================================= //
// ========================== Функция для переключения видимости ключевых слов в чате ==================================== // 
// toggleKeywordsInChat переключатель аналогичный enableblockingIn, но для слов


function toggleKeywordsInChat(firstUpdate = false) {
    console.log("[_Keyword_Blocking_] Toggling keywords in chat, firstUpdate:", firstUpdate);
    const messages = document.querySelectorAll('[data-a-target="chat-line-message"], .vod-message, .chat-line__message');
    const keywords = getStorage('bannedKeywords', []);
    if (!keywords.length || !getStorage('isBlockingEnabled', true) || !getStorage('isKeywordBlockingEnabled', true)) {
        console.log("[_Keyword_Blocking_] No keywords or blocking disabled, showing all messages");
        messages.forEach(message => {
            message.style.display = '';
            filteredMessages.delete(message.dataset.messageId || message.textContent);
        });
        if (uiElements && uiElements.counter && !firstUpdate) {
            updateCounter(uiElements.counter);
        }
        return;
    }
    messages.forEach(message => {
        const textFragment = message.querySelector('[data-a-target="chat-message-text"], .vod-message, .text-fragment');
        if (!textFragment)
            return;
        const messageText = textFragment.textContent.toLowerCase();
        let shouldHide = false;
        if (getStorage('isBlockingEnabled', true) && getStorage('isKeywordBlockingEnabled', true)) {
            shouldHide = keywords.some(keyword => {
                const keywordText = keyword.text.toLowerCase();
                if (keyword.isPhrase) {
                    return messageText.includes(keywordText);
                }
                else {
                    return messageText.split(/\s+/).includes(keywordText);
                }
            });
        }
        const messageId = message.dataset.messageId || `${Date.now()}_${message.textContent}`;
        if (shouldHide) {
            message.style.display = 'none';
            filteredMessages.set(messageId, {
                element: message,
                keyword: keywords.find(k => messageText.includes(k.text.toLowerCase()))?.text || 'unknown',
                originalText: messageText
            });
        }
        else {
            message.style.display = '';
            filteredMessages.delete(messageId);
        }
    });
    const hiddenCount = filteredMessages.size;
    console.log(`[_Keyword_Blocking_] Toggled keywords in chat, hidden: ${hiddenCount} messages`);
    if (uiElements && uiElements.counter && !firstUpdate) {
        updateCounter(uiElements.counter);
    }
}

 

// ============================= end of toggleKeywordsInChat =========================== //
// =============================================================================== //
// ============================================================================= //
// ==================== Функция для блокировки эмодзи в узле ===================== //
// Используется в качестве обратного вызова для MutationObserver
// Добавляем функцию после объявления toggleEmotesInNode
// Выбираем селектор для эмодзи 


function restartBlockingLogic() {
    if (isRestarting)
        return;
    isRestarting = true;
    try {
        console.log('%c[WATCHDOG]%c Перезапуск логики блокировки... isBlockingEnabled: ${isBlockingEnabled}', 'color: #FF4500; font-weight: bold;', 'color: #FF4500;');
        window.Notifications.showNotification("Chat not found or blocking failed. Restarting...", 3000);
        // Сохраняем текущее состояние
        const currentBlockingState = isBlockingEnabled;
        observer.disconnect();
        observerIsActive = false;
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container') ||
            document.querySelector('.chat-image chat-line__message--emote ffz--pointer-events ffz-tooltip ffz-emote') ||
            document.querySelector(' .video-chat__message-list-wrapper') ||
            document.querySelector('.vod-message') ||
            document.querySelector('.chat-room__content') ||
            document.querySelector('[data-a-target="chat-room-content"]') ||
            document.querySelector('.chat-line__message tw-relative') ||
            document.querySelector('.chat-list--default');
        if (chatContainer) {
            const emotes = chatContainer.querySelectorAll('.ffz--inline, ' +
            '.chat-image chat-line__message--emote ffz--pointer-events ffz-tooltip ffz-emote' +
            '.chat-line__message img, .chat-line__message .emote, ' +
            '.chat-line__message .bttv-emote, .chat-line__message .seventv-emote, ' +
            '.chat-line__message .ffz-emote, .chat-line__message .twitch-emote', '.chat-line__message tw-relative', '.vod-message');
            emotes.forEach(emote => {
                emote.style.display = '';
                emote.removeAttribute('data-emote-id');
            });
            toggleEmotesInNode(chatContainer);
        }
        processedEmotes = new WeakMap();
        observeChatContainer();
        toggleEmotesInChat();
        // Восстанавливаем состояние
        isBlockingEnabled = currentBlockingState;
        setStorage('isBlockingEnabled', isBlockingEnabled);
        const searchTerm = uiElements?.searchInput?.value.trim();
        if (searchTerm) {
            filterBlockedList(searchTerm);
        }
        setTimeout(() => {
            isRestarting = false;
            console.log('%c[WATCHDOG]%c Перезапуск завершен', 'color: #00C4B4; font-weight: bold;', 'color: #00C4B4;');
            window.Notifications.showNotification("Blocking logic restarted", 2000);
        }, 1000);
    }
    catch (error) {
        console.error(`%c[WATCHDOG]%c Ошибка при перезапуске: ${error.message}`, 'color: #FF0000; font-weight: bold;', 'color: #FF0000;');
        if (attempt < maxAttempts) {
            console.log(`%c[WATCHDOG]%c Повторная попытка перезапуска (${attempt + 1}/${maxAttempts})`, 'color: #FF4500; font-weight: bold;', 'color: #FF4500;');
            setTimeout(() => restartBlockingLogic(attempt + 1, maxAttempts), 2000);
        }
        else {
            isRestarting = false;
            console.error('%c[WATCHDOG]%c Не удалось перезапустить после ${maxAttempts} попыток', 'color: #FF0000; font-weight: bold;', 'color: #FF0000;');
            window.Notifications.showNotification("Failed to restart blocking logic", 3000);
        }
    }
}
function checkBlockingStatus() {
    console.log(`%c[WATCHDOG] %cПроверка состояния блокировки... isBlockingEnabled: ${isBlockingEnabled}`, 'color:rgb(82, 142, 255); font-weight: bold;', 'color: rgb(164, 207, 44);');
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container') ||
        document.querySelector('.chat-image chat-line__message--emote ffz--pointer-events ffz-tooltip ffz-emote') ||
        document.querySelector('.chat-room__content') ||
        document.querySelector('.video-chat__message-list-wrapper') ||
        document.querySelector('.vod-message') ||
        document.querySelector('[data-a-target="chat-room-content"]') ||
        document.querySelector('.chat-list--default');
    if (!chatContainer) {
        console.log(`%c[WATCHDOG]%c Контейнер чата не найден. URL: ${window.location.href}`, 'color:rgb(172, 147, 223); font-weight: bold;', 'color: rgb(164, 207, 44);');
        return false;
    }
    const messages = chatContainer.querySelectorAll('.chat-line__message');
    if (messages.length === 0) {
        console.log("[WATCHDOG] Сообщения в чате не найдены, возможно, чат ещё загружается");
        return true;
    }
    const emotes = chatContainer.querySelectorAll('.chat-image chat-line__message--emote ffz--pointer-events ffz-tooltip ffz-emote' +
        '.video-chat__message-list-wrapper' +
        '.vod-message,' +
        '.ffz--inline, ' +
        '.chat-line__message img, .chat-line__message .emote, ' +
        '.chat-line__message .bttv-emote, .chat-line__message .seventv-emote, ' +
        '.chat-line__message .ffz-emote, .chat-line__message .twitch-emote');
    if (emotes.length === 0) {
        console.log("[WATCHDOG] Эмодзи в чате не найдены, пропускаем проверку");
        return true;
    }
    let failureDetected = false;
    emotes.forEach((emote, index) => {
        if (index > 5)
            return;
        const emoteId = emote.getAttribute('data-emote-id');
        const shouldBeBlocked = emoteId && (blockedChannelIDs.has(emoteId) || blockedEmoteIDs.has(emoteId));
        const isVisible = emote.style.display !== 'none';
        if (isBlockingEnabled && shouldBeBlocked && isVisible) {
            console.log(`[WATCHDOG] Обнаружен сбой: эмодзи с ID ${emoteId} должен быть скрыт, но виден!`);
            failureDetected = true;
        }
        else if (!isBlockingEnabled && isVisible === false) {
            console.log(`[WATCHDOG] Обнаружен сбой: эмодзи с ID ${emoteId} должен быть виден, но скрыт!`);
            failureDetected = true;
        }
    });
    const currentBlockedCount = blockedEmotes.length + blockedChannels.length;
    if (currentBlockedCount !== lastKnownBlockedCount) {
        console.log(`%c[WATCHDOG] %cКоличество заблокированных элементов изменилось: %c${lastKnownBlockedCount} -> ${currentBlockedCount}`, 'color: rgb(221, 101, 175); font-weight: bold;', 'color: rgb(164, 207, 44);', 'color: rgb(255, 165, 0); font-weight: bold;');
        lastKnownBlockedCount = currentBlockedCount;
    }
    console.log(`[WATCHDOG] Blocking status: ${failureDetected ? 'Failure detected' : 'Working correctly'}`);
    return !failureDetected;
}

// =============================== end of toggleEmotesInNode ========================================= //
// ================================================================================================== //     
// ================================================================================================= //
// =================== Функция мониторинга случая сброса чата monitorChatReset ===================== //
function monitorChatReset() {
    const chatSelectors = [
        '.chat-scrollable-area__message-container',
        '.chat-room__content',
        '.chat-list--default',
        '[data-a-target="chat-room-content"]',
        '[data-a-target="chat-container"]',
        '.chat-list__list',
        '.video-chat__message-list-wrapper',
        '.vod-message'
    ];
    const connectionMessageSelectors = [
        '[data-a-target="chat-connection-message"]',
        '.chat-connection-message',
        '.chat-status-message',
        '.chat-line__status',
        '.video-chat__message-list-wrapper',
        '.vod-message'
    ];
    let lastMessageCount = 0;
    let isChatResetting = false;
    const findChatContainer = () => {
        return chatSelectors.reduce((found, sel) => found || document.querySelector(sel), null);
    };
    const findConnectionMessage = () => {
        return connectionMessageSelectors.reduce((found, sel) => found || document.querySelector(sel), null);
    };
    const resetBlockingLogic = () => {
        if (isChatResetting)
            return;
        isChatResetting = true;
        console.log('[ChatReset] Chat reset detected, restarting blocking logic...');
        window.Notifications.showNotification('Chat reset detected, restarting...', 2000, true);
        // уведомление о сбросе чата вне панели прямо на странице Chat reset detected, restarting...
        if (observer) {
            observer.disconnect();
            observerIsActive = false;
        }
        processedEmotes = new WeakMap();
        // processedNodes = new WeakSet(); // Remove or comment out, as processedNodes is not defined
        const chatContainer = findChatContainer();
        if (chatContainer) {
            console.log('[ChatReset] Chat container found, applying blocking...');
            toggleEmotesInChat();
            observer.observe(chatContainer, {
                childList: true,
                subtree: true,
                attributes: false
            });
            observerIsActive = true;
            // Перезапускаем фильтрацию ключевых слов
            if (chatFilter.isTextBlockingEnabled) {
                chatFilter.filterTextInNode(chatContainer);
                observeKeywordChatContainer();
            }
        }
        else {
            console.log('[ChatReset] Chat container not found, starting root observer...');
            startRootObserver();
        }
        setTimeout(() => {
            isChatResetting = false;
            console.log('[ChatReset] Blocking logic restarted');
            window.Notifications.showNotification('Blocking logic restarted', 2500, true);
        }, 500);
    };
    const checkChatState = () => {
        const chatContainer = findChatContainer();
        if (!chatContainer) {
            console.log('[ChatReset] Chat container not found, triggering reset...');
            resetBlockingLogic();
            return;
        }
        const connectionMessage = findConnectionMessage();
        if (connectionMessage && connectionMessage.textContent.toLowerCase().includes('connecting to chat')) {
            console.log("[ChatReset] Detected 'Connecting to chat', triggering reset...");
            resetBlockingLogic();
            return;
        }
        const messages = chatContainer.querySelectorAll('.chat-line__message, .vod-message, .chat-message-text');
        const currentMessageCount = messages.length;
        if (currentMessageCount === 0 && lastMessageCount > 0) {
            console.log('[ChatReset] Chat cleared (no messages), triggering reset...');
            resetBlockingLogic();
        }
        else if (currentMessageCount > 0 && lastMessageCount === 0) {
            console.log('[ChatReset] New messages appeared after clear, applying blocking...');
            toggleEmotesInChat();
            if (chatFilter.isTextBlockingEnabled) {
                chatFilter.filterTextInNode(chatContainer);
            }
        }
        lastMessageCount = currentMessageCount;
    };
    const connectionObserver = new MutationObserver(() => {
        const connectionMessage = findConnectionMessage();
        if (connectionMessage && connectionMessage.textContent.toLowerCase().includes('connecting to chat')) {
            console.log("[ChatReset] Mutation detected 'Connecting to chat', triggering reset...");
            resetBlockingLogic();
        }
    });
    connectionObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-a-target', 'class']
    });
    setInterval(checkChatState, 500);
    console.log('[Content] Chat reset monitor started');
}

// =================== end of Функция мониторинга сброса чата monitorChatReset ================== //
// ============================================================================================ //
// ========================================================================================== //
// ================= наблюдение за изменениями в чате observeChatContainer =================== //
function observeChatContainer() {
    const selectors = [
        '.chat-scrollable-area__message-container',
        '.chat-room__content',
        '[data-a-target="chat-room-content"]',
        '.chat-list--default',
        '.chat-container',
        '[data-test-selector="chat-room-component-layout"]',
        '.video-chat__message-list-wrapper',
        '.vod-message'
    ];
    const findContainer = () => {
        return selectors.reduce((found, selector) => found || document.querySelector(selector), null);
    };
    let chatContainer = findContainer();
    if (chatContainer) {
        console.log("[Blocking_Emotes]  Chat container found:", chatContainer);
        if (observer)
            observer.disconnect();
        observer = new MutationObserver(() => {
            console.log("[Blocking_Emotes]  Chat changes detected, applying filters...");
            toggleEmotesInNode(chatContainer);
            toggleKeywordsInChat();
            if (uiElements && uiElements.counter) {
                updateCounter(uiElements.counter);
            }
        });
        observer.observe(chatContainer, {
            childList: true,
            subtree: true,
            attributes: false
        });
        observerIsActive = true;
        retryCount = 0;
        console.log("[Blocking_Emotes]  Chat container observer started");
        toggleEmotesInNode(chatContainer);
        toggleKeywordsInChat(true); // Начальная фильтрация
        if (uiElements && uiElements.counter) {
            updateCounter(uiElements.counter);
        }
    }
    else {
        retryCount++;
        if (retryCount < maxRetries) {
            console.warn(`[Blocking_Emotes]  Chat container not found, retrying (${retryCount}/${maxRetries})...`);
            setTimeout(observeChatContainer, 1000);
        }
        else {
            console.error("[Blocking_Emotes]  Max retries reached, starting root observer...");
            observerIsActive = false;
            startRootObserver();
        }
    }
}
// =========================== end of   observeChatContainer ============================== //
// ======================================================================================== // 
// ====================================================================================== //
// ====================== наблюдение за корнем body документа =========================== //
// Запускаем наблюдение за корнем body документа === //
// ============ end of observeChatContainer  ============ // 
// ======= Флаг для контроля активации
// =========================================================================================== //
// ============ Функция для добавления эмодзи или канала addEmoteOrChannel ================= //
// Добавление эмодзи или канала

// ===================== end of addEmoteOrChannel Функции ================================= //
// ======================================================================================== //
// ======================================================================================== //
// ========== Функция для удаления эмодзи или канала removeEmoteOrChannel ================= //

// ================================== end of removeEmoteOrChannel ==================================== //
// =================================================================================================== //
// ============================== Функция getBlockedItems =============================================== //
// ===================================================================================================== //
// ======= Функция для получения заблокированных элементов getBlockedItems ======= //

function getBlockedItems() {
    console.log("[Content] Getting blocked items...");
    const items = {
        blockedEmotes: blockedEmotes || [],
        blockedChannels: blockedChannels || [],
        bannedKeywords: window.bannedKeywords || getStorage('bannedKeywords', []) || [],
        bannedUsers: window.bannedUsers || getStorage('bannedUsers', []) || [], // Добавляем bannedUsers
        newlyAddedIds: newlyAddedIds || new Set()
    };
    console.log("[Debug] getBlockedItems:", {
        emotesCount: items.blockedEmotes.length,
        channelsCount: items.blockedChannels.length,
        keywordsCount: items.bannedKeywords.length,
        usersCount: items.bannedUsers.length,
        newlyAddedCount: items.newlyAddedIds.size
    });
    return items;
}
function getBannedChatItems() {
    return {
        bannedKeywords: window.bannedKeywords || getStorage('bannedKeywords', []),
        bannedUsers: window.bannedUsers || getStorage('bannedUsers', []),
        newlyAddedIds: new Set(),   
        lastKeyword: null           
    };
}
// ============================== end of getBlockedItems =============================================== //
// ==================================================================================================== //
// ============================ Интерфейс Панели управления createUI   ============================ //
// Функция для создания пользовательского интерфейса
// ======================================= end of createUI ============================================= //
// ===================================================================================================== //
// ==================================================================================================== //
// ================================= makePanelResizable =============================================== // 
//------------- Функция   изменения размеров панели ------------- //

// =============================== end of  makePanelResizable ============================== // 
// ========================================================================================= //
// ========================================================================================== //
// =========== функция и контейнер для перетаскивания панели makePanelDraggable ============= //

// =============================== end of  makePanelDraggable =============================== //
// ========================================================================================= //
// ================================================================================================ //
// ============== отвечает за привязку обработчиков событий bindButtonHandlers  ==================== //
// -------- обработчики событий к элементам управления и кнопкам в панели управления --------- //
// ================================ end of bindButtonHandlers ========================================== //
// ==================================================================================================== //
// ===================================================================================================== //
// ================== функция для получения эмодзи из тултипа getFfzTooltipEmotes ====================== //

// ======================= end of getFfzTooltipEmotes ============================ //
// ============================================================================= //
// =========================================================================================== //
// ============= функция для поиска контейнера и эмодзи findEmoteContainerAndEmotes ========= //
// ============= Функция для поиска контейнера и эмодзи  ================================== //
// =============== в сообщении Twitch, SevenTV, BTTV и FFZ ================================ //

// ==================== end of findEmoteContainerAndEmotes ====================== //
// ============================================================================= //
// ===================== Установка темы по умолчанию =========================== //
// ============================================================================= //
//  ========= загрузка и переключение Тем Theme Loading and Storage ============ //
// ==================== end of  Установка темы по умолчанию ======================= //
// =============================================================================== // 
// ============================================================================= // 
// ================= Инициализация контекстного меню =========================== //  
// ==================== end of Инициализация контекстного меню ======================== //
// =================================================================================== //
// ==================================================================================== //
// ============ Функция обновления Списка залокированный элементов в чате ============ //
// =========================== updateBlockedEmotesList ==================================== //
// -------------- подсветка текста updateBlockedEmotesList list7btfzhighlightText ------------------ //
 // -------------- подсветка текста updateBlockedEmotesList list7btfzhighlightText ------------------ //

// ------------- Функция обновления списка заблокированных элементов в чате ----------- 

// ======================= end of Функция обновления Списка  updateBlockedEmotesList   ====================== //
// ========================================================================================================== //
// ========================================================================================================= //
// ===============================  Функция updateBannedChatList =========================================== // 

// ================= end of Функция updateBannedChatList ======================= //
// ============================================================================================================ //
// ============================================================================================================ //
// ============== Функция сортировки заблокированных эмодзи каналов , смайлов =============================== //

// ============================================================================================================ //
// ============================  Функция сортировки для banned-chat-list   ==================================== //

// =========== Функция для прокрутки к последнему элементу в banned-chat-list

// ========================== end of Функция сортировки заблокированных эмодзи ============================ //
// =========================================================================================================== //
// ======================================================================================================== //
// ==================== Функция прокрутки к последнему добавленному элементу ============================ //

// ================= end of Функция прокрутки к последнему добавленному элементу ==================== //
// ====================================================================================== //
// ====================================================================================== //
// ================ счетчик  Функция обновления счетчика ==================== //

// ================= end of Функция обновления счетчика ==================== //
// ====================================================================================== //
// ================================================================================================ //
// =============== Функция фильтрации и поиска списка заблокированных элементов ================= //

// ============== end of Функция для фильтрации списка заблокированных элементов =================== //
// =========================================================================================================== //
// ================================================================================================== //
// ================ Функция фильтрации и поиска списка searchBannedChatList ========================= //
// ================= End of Функция фильтрации и поиска списка searchBannedChatList ================== //
// =========================================================================================================== //
// =========================================================================================================== //

 
 
// ============================== end of showStatsChart charts js ============================================ //
// =========================================================================================================== //
// =========================================================================================================== //
// ============================================================================================================== //
// ============================================================================================================= //
// ========================= Функция очистки всех заблокированных элементов ================================== //

// ================== end of Функция очистки списка заблокированных элементов ==================== //
// ====================================================================================== //
// ====================================================================================== //
// ================== Функция экспорта заблокированных элементов ==================== //
 
// ================== end of Функция для импорта список заблокированных элементов ================= //
// =================================================================================== //
// =================================================================================== //
// ============= Функция для блокировки эмодзи в чате ====================== //
// Используется в качестве обратного вызова для MutationObserver
// ============= end of Функция для блокировки эмодзи в чате ============= //
// =================================================================================== //
// =================================================================================== //
// ================== Функции для включения и отключения блокировки ==================== //
// ================ end of Функции для включения и отключения блокировки ================ //
// =================================================================================== //
// =========================== Функция инициализации init  ================================================= //
// ============================= Инициализация UI и обработчиков событий =================================== //
//  Эта функция вызывается при загрузке страницы и инициализирует все необходимые элементы UI и обработчики событий
//  Она также проверяет наличие необходимых данных в хранилище и обновляет UI в соответствии с ними 
//  Важно: эта функция должна быть вызвана после загрузки всех необходимых скриптов и стилей
// ------ инит ------- // 
//  инициализация UI и обработчиков событий

// ==================== end of инит init function ============================================ //
// ===================================================================================== //
// ======================================================================================== //
// ======================== themes.js ======================== //
//  ============ загрузка и переключение Тем Theme Loading and Storage =================== //
// ============== end of  Установка темы по умолчанию ============== //
// =================================================================================== //


// ================================================================================================================= //
// ====================================== scrollable button-container ============================================= //
// ====================== СТИЛИ ДЛЯ КОНТЕЙНЕРА КНОПОК УПРАВЛЕНИЯ ПАНЕЛИ ДЛЯ ПРОКРУТКИ КНОПОК ======================= //
// ======================== СТИЛИ button-container ================== //
function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
    .button-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            position: absolute;
            bottom: calc(1px * (var(--panel-height, 735) / 735));
            right: 6px; 
            max-height: calc(var(--panel-height, 735px) - 300px);
            overflow-y: auto; /* Включаем вертикальную прокрутку */
            overflow-x: hidden; /* Скрываем горизонтальную прокрутку */
            transition: opacity 0.3s;
            background: linear-gradient(rgb(101, 58, 13), transparent, rgb(68, 33, 90));
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid rgb(71, 236, 200);
            box-sizing: border-box;
    }
    .button-container::-webkit-scrollbar {
            width: 10px; /* Ширина вертикального скроллбара */
    }
    .button-container::-webkit-scrollbar-thumb {
            background: #ffffff1a; /* Цвет ползунка */
            border: 1px solid rgba(255, 255, 255, 0.54); 
            border-radius: 5px;
   }
    .button-container::-webkit-scrollbar-track {
            background: rgba(33, 153, 107, 0); /* Цвет трека */
   }
    .button-container button {
            width: 100%;
            min-height: 40px;
   }
    `;
    document.head.appendChild(style);
    console.log("[UI] CSS for button-container injected");
}
// Вызвать функцию в createUI
injectCSS();
// ========================= end of  scrollable button-container ========================== //
// ======================================================================================= //



// =================================================================================== //
// =================== Стили для подсветки и блокировки элементов ==================== //
const list7btfzhighlightsearchterm = document.createElement('style');
list7btfzhighlightsearchterm.innerHTML = `
/*-------------- Стили для крестика в попап   смайлов -------------*/
/*------ Подсветка текста Для поисковика - при наборе текста -------*/
.item-highlight-7btvfzkguthtdhr57h {
    background-color: #ffff00; /* Жёлтый фон */
    color:hsl(0, 0.00%, 0.00%) !important; /* Чёрный текст */
    padding: 1px 2px; /* Отступы для красоты */
    border-radius: 4px; /* Скругленные углы */
}
 /*------ Подсветка --- при вызове go-To-Last ------*/
.last-added-item-highlight {
     background: linear-gradient(180deg,rgb(16, 95, 36), #60af2cab) !important;
     transition: background-color 0.3s ease !important;
     color:rgb(0, 0, 0) !important;
     border: 2px solid #f4ff19 !important;
     padding: 1px 2px; /* Отступы для красоты */
     border-radius: 7px !important;
 }
     


 
    .blocked-item {
        padding: 5px !important; 
        border-bottom: 1px solid #ccc !important; 
    }
    .new-item {
        background-color: #307c30 !important; 
    }
    .delete-button {
        cursor: pointer !important; 
        color: #cfcfcf !important; 
    } 
       
    
/*---------- end of Подсветка текста в поиске -----------*/

 /*---------- стили  для регулировки размеров панели  ---------------*/

    .resize-handle {
        position: absolute !important; 
        background: transparent !important; 
        z-index: 10001 !important; 
    }

    .resize-handle.top, .resize-handle.bottom {
        width: 100% !important; 
        height: 8px !important; 
        left: 0 !important; 
        cursor: ns-resize !important; 
    }

    .resize-handle.top {
        top: -4px !important; 
    }

    .resize-handle.bottom {
        bottom: -4px !important; 
    }

    .resize-handle.left, .resize-handle.right {
        height: 100% !important; 
        width: 8px !important; 
        top: 0 !important; 
        cursor: ew-resize !important; 
    }

    .resize-handle.left {
        left: -4px !important; 
    }

    .resize-handle.right {
        right: -4px !important; 
    }

    .resize-handle.top-left, .resize-handle.top-right,
    .resize-handle.bottom-left, .resize-handle.bottom-right {
        width: 12px !important; 
        height: 12px !important; 
    }

    .resize-handle.top-left {
        top: -6px !important; 
        left: -6px !important; 
        cursor: nwse-resize !important; 
    }

    .resize-handle.top-right {
        top: -6px !important; 
        right: -6px !important; 
        cursor: nesw-resize !important; 
    }

    .resize-handle.bottom-left {
        bottom: -6px !important; 
        left: -6px !important; 
        cursor: nesw-resize !important; 
    }

    .resize-handle.bottom-right {
        bottom: -6px !important; 
        right: -6px !important; 
        cursor: nwse-resize !important; 
    } 
        

    
`;
document.head.appendChild(list7btfzhighlightsearchterm);
// =================== end of Стили для подсветки  элементов ==================== //  



 