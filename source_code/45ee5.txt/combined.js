// ======== combined.js главный модуль точка входа ==== //
// 4921 function updateBannedСhatList
// 3602 function updateBlockedEmotesList
// 4172 function makePanelResizable
// 4416 function makePanelDraggable
// 4483 СТИЛИ button-container
// 3108 end of showEmoteSelectionPopup 
// ======== combined.js главный модуль точка входа ==== //
// Ожидание загрузки всех модулей
Promise.all([
    import('./ui.js').then(module => {
        ui = module.default;
        console.log('[Content] ui loaded');
    }).catch(error => {
        console.error("[Content] Failed to load ui module:", error);
    }),
    import('.js/emotePickerHandler.js').then(() => {
        console.log('[Content] emotePickerHandler module loaded');
    }).catch(error => {
        console.error("[Content] Failed to load emotePickerHandler module:", error);
    }),
    import('.js/fix_autofocus__input_twitch_chat.js').then(module => {
        console.log('[Content] fix_autofocus__input_twitch_chat module loaded');
        if (module.default.init) {
            module.default.init();
        }
    }).catch(error => {
        console.error("[Content] Failed to load fix_autofocus__input_twitch_chat module:", error);
        showIsolatedNotification('Failed to load fix_autofocus__input_twitch_chat module', 5000);
    }),
    import('.js/Twitch_Auto_reload _when_stuck_v0_2_4_25.js').then(module => {
        console.log('[Content] Twitch_Auto_reload _when_stuck_v0_2_4_25 module loaded');
        if (module.default.init) {
            module.default.init();
        }
    }).catch(error => {
        console.error("[Content] Failed to load Twitch_Auto_reload _when_stuck_v0_2_4_25 module:", error);
        showIsolatedNotification('Failed to load Twitch_Auto_reload _when_stuck_v0_2_4_25 module', 5000);
    }),
    import('.js/auto_chat_open_nostream_page.js').then(module => {
        console.log('[Content] auto_chat_open_nostream_page   module loaded');
        if (module.default.init) {
            module.default.init();
        }
    }).catch(error => {
        console.error("[Content] Failed to load auto_chat_open_nostream_page   module:", error);
        showIsolatedNotification('Failed to load auto_chat_open_nostream_page   module', 5000);
    }),
    import('.js/audiovolume_fix_twtch_.js').then(module => {
        console.log('[Content] audiovolume_fix_twtch_ module loaded');
        if (module.default.init) {
            module.default.init();
        }
    }).catch(error => {
        console.error("[Content] Failed to load audiovolume_fix_twtch_ module:", error);
        showIsolatedNotification('Failed to load audiovolume_fix_twtch_ module', 5000);
    }),
    import('./FFZ_ShowEmotePopup.js').then(module => {
        console.log('[Content] FFZ_ShowEmotePopup module loaded');
        // Инициализация функций из модуля
        module.observeTwitchCard();
        module.handleChatEmoteClick();
    }).catch(error => {
        console.error('[Content] Failed to load FFZ_ShowEmotePopup module:', error);
        showIsolatedNotification('Failed to load FFZ_ShowEmotePopup module', 5000);
    }),
    import('./panel__Settings.js')
        .then(module => {
        window.makeResizable = module.makeResizable; // Делаем функцию доступной глобально 
        console.log('[Content] resizeModal loaded');
    })
        .catch(error => {
        console.error('[Content] Failed to load panel__Settings:', error);
        showIsolatedNotification('Failed to load panel__Settings module', 5000);
    }),
    import('./themes.js').then(module => {
        console.log('[UI] themeS.js imported');
        const themeSelect = document.getElementById('theme-select');
        const themeStylesheet = document.getElementById('theme-stylesheet');
        chrome.storage.local.get(['selectedTheme'], (result) => {
            const savedTheme = result.selectedTheme || 'dayNight';
            console.log('[UI] Loading theme:', savedTheme);
            module.loadTheme(themeSelect, themeStylesheet, savedTheme);
        });
    }),
    import('./emojiSpamProtection.js').then(() => {
        console.log('[Content] emojiSpamProtection module loaded');
    }).catch(error => {
        console.error("[Content] Failed to load emojiSpamProtection module:", error);
        showIsolatedNotification('Failed to load emojiSpamProtection module', 5000);
    }),
    import('./enable__disableBlocking.js').then(module => {
        console.log('[Content] enable__disableBlocking module loaded');
    }).catch(error => {
        console.error("[Content] Failed to load enable__disableBlocking module:", error);
        showIsolatedNotification('Failed to load enable__disableBlocking module', 5000);
    }),
    import('./custom__EmotesPanelPicker.js').then(module => {
        console.log("[Content] Custom Emote Picker module loaded");
        window.setupCustomEmotePicker = module.setupCustomEmotePicker;
    }).catch(error => {
        console.error("[Content] Failed to load Custom Emote Picker module:", error);
        showIsolatedNotification('Failed to load Custom Emote Picker module', 5000);
    }),
    import('./ChatFilter.js').then(module => {
        ChatFilter = module.default;
        console.log('[Content] ChatFilter loaded');
    }).catch(error => {
        console.error("[Content] Failed to load ChatFilter:", error);
        showIsolatedNotification('Failed to load ChatFilter module', 5000);
    }),
    import('./notifications.js').then(module => {
        notifications = module.default;
        console.log('[Content] Notifications loaded');
    }).catch(error => {
        console.error("[Content] Failed to load Notifications:", error);
        showIsolatedNotification('Failed to load Notifications module', 5000);
    }),
    import('./Logging___7BTVFZ__PANEL.js').then(module => {
        window.Logging = module.default;
        console.log('[Content] Logging module loaded');
    }).catch(error => {
        console.error("[Content] Failed to load Logging module:", error);
        showIsolatedNotification('Failed to load Logging module', 5000);
    }),
    import('./7BTVFZ__storage.js')
        .then(module => {
        storage = module.default;
        console.log('[Content] 7BTVFZ__storage loaded');
    })
        .catch(error => {
        console.error('[Content] Failed to load 7BTVFZ__storage:', error);
        showIsolatedNotification('Failed to load 7BTVFZ__storage module', 5000);
    }),
    import('./bindButtonHandlers.js').then(module => {
        buttonHandlers = module.default;
        console.log('[Content] ButtonHandlers loaded');
    }).catch(error => {
        console.error("[Content] Failed to load ButtonHandlers:", error);
        showIsolatedNotification('Failed to load ButtonHandlers module', 5000);
    }),
    import('./PreviewerMedia.js').then(module => {
        buttonHandlers = module.default;
        console.log('[Content] PreviewerMedia loaded');
    }).catch(error => {
        console.error("[Content] Failed to load PreviewerMedia:", error);
        showIsolatedNotification('Failed to load PreviewerMedia module', 5000);
    }),
    import('./renamedTwitchUsers.js').then(module => {
        console.log('[Content] renamedTwitchUsers module loaded');
        module.default.initRenameNicknames();
    }).catch(error => {
        console.error("[Content] Failed to load renamedTwitchUsers module:", error);
        showIsolatedNotification('Failed to load renamedTwitchUsers module', 5000);
    }),
    import('./auto_send_anyway.js').then(module => {
        console.log('[Content] auto_send_anyway module loaded');
        // Если в модуле есть экспортируемая функция для инициализации, вызовите её
        if (module.init) {
            module.init();
        }
    }).catch(error => {
        console.error("[Content] Failed to load auto_send_anyway module:", error);
        showIsolatedNotification('Failed to load auto_send_anyway module', 5000);
    }),
]).then(() => {
    console.log('[Content] All modules loaded, initializing...');
    init();
}).catch(error => {
    console.error('[Content] Initialization failed:', error);
    showIsolatedNotification('Extension initialization failed', 5000);
});
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
let ui;
let storage;
let notifications;
let observerIsActive = true;
let isStorageInitialized = false;
let isTextBlockingEnabled = getStorage('isTextBlockingEnabled', true);
let isEmoteBlockingEnabled = getStorage('isEmoteBlockingEnabled', true);
let bannedKeywords = getStorage('bannedKeywords', []);
let bannedUsers = getStorage('bannedUsers', []);
let lastChannel = window.location.pathname.split('/')[1] || null;
let removedItem = null;
let updated = false;
let isRendering = false;
let keywordObserverIsActive = false;
let keywordObserver = null;
let restartAttempts = 10;
let lastKeywordCheckTime = 0;
let keywordLastFailureTime = 0;
let keywordRetryCount = 0;
let blockedEmotes = [];
let blockedChannels = [];
let blockedEmoteIDs = new Set();
let blockedChannelIDs = new Set();
let newlyAddedIds = new Set();
let isObservingChat = false;
let retryCount = 0;
let mutationCount = 0;
let isBlockingEnabled = getStorage('isBlockingEnabled', false); // Единственное объявление
let processedEmotes = new WeakMap();
let keywordFilterObserver = null;
// ============ Переменные для отслеживания состояния блокировки ============ // 
let lastKnownBlockedCount = blockedEmotes.length + blockedChannels.length;
let lastCheckTime = Date.now();
let isRestarting = false;
// ================================ end of storage.js  ========================================= //
// ============================================================================================== //
// ============================================================================================= //
// ====================== Функция инициализации блокировки initBlocking ======================== //
// ======================= (2) blocking.js ========================== // 
function initBlocking() {
    console.log("[Content] Initializing blocking...");
    try {
        blockedEmotes = getStorage('blockedEmotes', []);
        let rawBlockedChannels = getStorage('blockedChannels', []);
        toggleEmotesInChat();
        blockedChannels = rawBlockedChannels.map(item => {
            if (item.channelName && item.prefix)
                return item;
            const prefix = item.name || item.emoteName.split(/[^a-zA-Z0-9]/)[0] || item.emoteName;
            return {
                id: item.id,
                channelName: prefix,
                prefix: prefix,
                platform: item.platform,
                emoteName: item.emoteName || item.name || 'Unnamed',
                date: item.date
            };
        });
        isBlockingEnabled = getStorage('isBlockingEnabled', true);
        blockedEmoteIDs = new Set(blockedEmotes.map(emote => emote.id));
        blockedChannelIDs = new Set(blockedChannels.map(channel => channel.id));
        console.log("[Blocking] Loaded:", {
            blockedEmotes: blockedEmotes.length,
            blockedChannels: blockedChannels.length,
            isBlockingEnabled
        });
        setStorage('blockedChannels', blockedChannels);
        toggleEmotesInChat();
        if (getStorage('isTextBlockingEnabled', true)) {
            console.log("[KeywordBlocking] Initializing keyword filtering...");
            chatFilter.setTextFilteringEnabled(true);
            startKeywordFiltering();
        }
        startWatchdog();
        handleVisibilityChange();
        startUnifiedRootObserver(); // Замена
        monitorChannelChange();
        monitorChatReset();
        monitorKeywordChatReset();
        toggleKeywordsInChat();
        observeChatContainer();
        setInterval(() => {
            if (!observerIsActive) {
                console.log("[ChatContainer] Observer inactive, checking for container...");
                const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-a-target="chat-room-content"]');
                if (chatContainer) {
                    console.log("[ChatContainer] Found container, restarting observer...");
                    observerIsActive = true;
                    observeChatContainer();
                }
            }
        }, 5000);
        console.log("[Content] Blocking initialization complete");
    }
    catch (error) {
        console.error("[Content] Blocking initialization error:", error);
    }
}
window.debugBlocking = () => {
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-line__message, [tw-relative="chat-line__message"], [data-a-target="chat-room-content"], .chat-list--default, .chat-container, [data-a-target="chat-container"], .chat-list__list');
    const emotes = chatContainer ? chatContainer.querySelectorAll('.chat-line__message img, .chat-message-emote, [data-a-target="emote"], [data-test-selector="emote"], .seventv-emote, .bttv-emote, .ffz-emote') : [];
    console.log("[Debug] Blocking state:", {
        isBlockingEnabled,
        observerIsActive,
        chatContainerFound: !!chatContainer,
        emoteCount: emotes.length,
        sampleEmotes: Array.from(emotes).slice(0, 3).map(e => ({
            src: e.src,
            alt: e.getAttribute('alt') || e.getAttribute('data-emote-name') || e.getAttribute('title') || '',
            id: e.getAttribute('data-emote-id') || e.getAttribute('data-id') || ''
        })),
        blockedEmoteIDs: [...blockedEmoteIDs],
        blockedChannelIDs: [...blockedChannelIDs]
    });
    if (chatContainer) {
        console.log("[Debug] Forcing toggleEmotesInChat...");
        toggleEmotesInChat(true);
    }
    else {
        console.log("[Debug] Chat container not found, restarting observer...");
        observerIsActive = false;
        observer.disconnect();
        startRootObserver();
    }
};
// ================= end of Функция инициализации блокировки initBlocking ================== //
// ======================================================================================= //
// ===================================  end of blocking.js  =========================================== //
// ==================================================================================================== //
// ================================================================================================== //
// ==============================  ФУНКЦИЯ ФИЛЬТРАЦИИ Сообщений В ЧАТЕ ================================ //
// ============== Функция для добавления addKeyword =================== //
// ================ startKeywordFiltering ================= //
// Global storage for filtered messages
const filteredMessages = new Map();
const maxKeywordRetries = 20;
const maxRetries = 20;
// ----------------------- addUser ----------------------- //
function addUser(username) {
    console.log('[addUser] Добавление никнейма:', username);
    try {
        let bannedUsers = getStorage('bannedUsers', []);
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
                bannedKeywords: getStorage('bannedKeywords', []),
                bannedUsers: getStorage('bannedUsers', []),
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
// Добавляем функцию normalizeUsername (взята из RenameNicknames)
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
        let items = getStorage(storageKey, []);
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
        const bannedСhatList = document.querySelector('#banned-сhat-list');
        if (bannedСhatList) {
            updateBannedСhatList(bannedСhatList, {
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
    const { keywordInput, addKeywordButton, bannedСhatList, keywordType } = uiElements;
    if (!keywordInput || !addKeywordButton || !bannedСhatList || !keywordType) {
        console.error('[Content] UI элементы отсутствуют:', {
            keywordInput: !!keywordInput,
            addKeywordButton: !!addKeywordButton,
            bannedСhatList: !!bannedСhatList,
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
            const blockedEmotesButton = document.querySelector('#blocked-emotes-button');
            if (['user', 'keyword'].includes(platform)) {
                if (bannedChatListButton && currentList !== 'bannedWords') {
                    bannedСhatList.style.transform = 'translateX(0)';
                    currentList = 'banned';
                    bannedChatListButton.style.backgroundColor = ' #0c7036';
                    bannedChatListButton.style.color = 'white';
                    if (blockedEmotesButton) {
                        blockedEmotesButton.style.backgroundColor = '';
                        blockedEmotesButton.style.color = '';
                    }
                    setStorage('currentList', 'banned');
                    console.log('[UI] Переключено на bannedСhatList');
                }
                const bannedKeywords = getStorage('bannedKeywords', []);
                const bannedUsers = getStorage('bannedUsers', []);
                updateBannedСhatList(bannedСhatList, {
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
    console.log("[Blocking] Запуск фильтрации по ключевым словам...");
    isBlockingEnabled = getStorage('isBlockingEnabled', true);
    const isKeywordBlockingEnabled = getStorage('isKeywordBlockingEnabled', true);
    console.log("[Blocking] Состояние блокировки:", { isBlockingEnabled, isKeywordBlockingEnabled });
    const filterMessages = () => {
        if (!isBlockingEnabled || !isKeywordBlockingEnabled) {
            console.log("[Blocking] Фильтрация по ключевым словам отключена, пропускаем...");
            return;
        }
        const bannedKeywords = getStorage('bannedKeywords', []);
        if (!bannedKeywords.length) {
            console.log("[Blocking] Нет запрещённых слов, пропускаем...");
            return;
        }
        console.log("[Blocking] Текущие ключевые слова:", bannedKeywords);
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
                    console.log(`[Blocking] Фильтровано слово "${keyword.text}" в сообщении (userId: ${message.dataset.userId})`);
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
        console.log(`[Blocking] Проверяем контейнер чата (попытка ${attempt}/${maxAttempts}):`, chatContainer);
        if (chatContainer) {
            console.log("[Blocking] Контейнер чата найден:", chatContainer);
            const observer = new MutationObserver(() => {
                console.log("[Blocking] Обнаружены изменения в чате, запускаем filterMessages...");
                filterMessages();
            });
            observer.observe(chatContainer, { childList: true, subtree: true });
            console.log("[Blocking] Наблюдатель фильтрации запущен");
            filterMessages();
            return observer;
        }
        else if (attempt <= maxAttempts) {
            console.warn(`[Blocking] Контейнер чата не найден, попытка ${attempt}/${maxAttempts}...`);
            setTimeout(() => tryStartObserver(attempt + 1, maxAttempts), 1000);
        }
        else {
            console.error("[Blocking] Контейнер чата не найден после всех попыток");
            window.Notifications.showPanelNotification("Ошибка: контейнер чата не найден", false);
        }
    };
    const observer = tryStartObserver();
    return () => {
        if (observer)
            observer.disconnect();
        console.log("[Blocking] Фильтрация остановлена");
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
        console.log("[KeywordBlocking] Chat container not found for observation");
        keywordObserverIsActive = false;
        return;
    }
    if (keywordObserver) {
        keywordObserver.disconnect();
    }
    keywordObserver = new MutationObserver(() => {
        console.log("[KeywordBlocking] Chat changes detected, applying filter...");
        if (chatFilter.isTextBlockingEnabled) {
            chatFilter.filterTextInNode(container);
        }
    });
    keywordObserver.observe(container, { childList: true, subtree: true });
    keywordObserverIsActive = true;
    console.log("[KeywordBlocking] Chat container observer started");
    if (chatFilter.isTextBlockingEnabled) {
        chatFilter.filterTextInNode(container);
    }
}
function startUnifiedRootObserver() {
    let debounceTimeout = null;
    const rootObserver = new MutationObserver(() => {
        if (debounceTimeout)
            return;
        debounceTimeout = setTimeout(() => {
            console.log('[UnifiedRootObserver] Processing DOM changes');
            const chatContainer = document.querySelector('.chat-scrollable-area__message-container,.vod-message, .chat-room__content, .chat-list--default, [data-test-selector="chat-scrollable-area__message-container"]');
            if (chatContainer) {
                // Для эмодзи/каналов
                if (!observerIsActive) {
                    console.log('[UnifiedRootObserver] Chat container found, starting emote observation');
                    observeChatContainer(chatContainer);
                }
                // Для ключевых слов
                if (!keywordObserverIsActive && window.chatFilter?.isTextBlockingEnabled) {
                    console.log('[UnifiedRootObserver] Chat container found, starting keyword observation');
                    observeKeywordChatContainer(chatContainer);
                    window.chatFilter.filterTextInNode(chatContainer);
                }
            }
            else {
                console.log('[UnifiedRootObserver] Chat container not found');
                observerIsActive = false;
                keywordObserverIsActive = false;
            }
            debounceTimeout = null;
        }, 150);
    });
    const rootElement = document.querySelector('.video-player') || document.body;
    rootObserver.observe(rootElement, { childList: true, subtree: true });
    console.log('[UnifiedRootObserver] Started on:', rootElement === document.body ? 'document.body' : '.video-player');
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
        console.log("[KeywordBlocking] Chat reset detected, restarting filtering...");
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
            console.log("[KeywordBlocking] Keyword filtering restarted");
            window.Notifications.showPanelNotification("Keyword filtering restarted", 2500);
        }, 500);
    };
    const checkChatState = () => {
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .vod-message, .chat-room__content');
        if (!chatContainer) {
            console.log("[KeywordBlocking] Chat container not found, triggering reset...");
            resetKeywordFiltering();
            return;
        }
        const connectionMessage = findConnectionMessage();
        if (connectionMessage && connectionMessage.textContent.toLowerCase().includes('connecting to chat')) {
            console.log("[KeywordBlocking] Detected 'Connecting to chat' message, triggering reset...");
            resetKeywordFiltering();
            return;
        }
        const messages = chatContainer.querySelectorAll('[data-a-target="chat-line-message"], .vod-message, .chat-line__message');
        const currentMessageCount = messages.length;
        if (currentMessageCount === 0 && lastMessageCount > 0) {
            console.log("[KeywordBlocking] Chat cleared (no messages), triggering reset...");
            resetKeywordFiltering();
        }
        else if (currentMessageCount > 0 && lastMessageCount === 0) {
            console.log("[KeywordBlocking] New messages appeared after clear, applying filtering...");
            if (chatFilter.isTextBlockingEnabled) {
                chatFilter.filterTextInNode(chatContainer);
            }
        }
        lastMessageCount = currentMessageCount;
    };
    const connectionObserver = new MutationObserver(() => {
        const connectionMessage = findConnectionMessage();
        if (connectionMessage && connectionMessage.textContent.toLowerCase().includes('connecting to chat')) {
            console.log("[KeywordBlocking] Mutation detected 'Connecting to chat', triggering reset...");
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
            console.log(`[KeywordBlocking] Channel changed: ${lastChannel} -> ${currentChannel}`);
            lastChannel = currentChannel;
            resetKeywordFiltering();
            toggleKeywordsInChat();
        }
    };
    setInterval(checkChannel, 2000);
    window.addEventListener('popstate', () => {
        console.log("[KeywordBlocking] URL changed, checking channel...");
        checkChannel();
    });
}
function monitorKeywordIframeChanges() {
    const iframe = document.getElementById('чат');
    if (!iframe) {
        console.warn('[KeywordBlocking] Iframe with ID "чат" not found');
        return;
    }
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                console.log('[KeywordBlocking] Iframe src changed:', iframe.src);
                resetKeywordFiltering();
                monitorKeywordIframeContent(iframe);
            }
        });
    });
    observer.observe(iframe, { attributes: true, attributeFilter: ['src'] });
    iframe.addEventListener('load', () => {
        console.log('[KeywordBlocking] Iframe loaded or reloaded:', iframe.src);
        monitorKeywordIframeContent(iframe);
    });
    monitorKeywordIframeContent(iframe);
}
function monitorKeywordIframeContent(iframe, attempt = 1, maxAttempts = 5) {
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (!iframeDoc) {
            if (attempt <= maxAttempts) {
                this.log(`[KeywordBlocking] Cannot access iframe contentDocument, retrying (${attempt}/${maxAttempts})...`);
                setTimeout(() => this.monitorKeywordIframeContent(iframe, attempt + 1, maxAttempts), 1000);
            }
            else {
                this.log('[KeywordBlocking] Failed to access iframe contentDocument after all attempts');
            }
            return;
        }
        const chatContainer = iframeDoc.querySelector('.chat-scrollable-area__message-container, .chat-room__content');
        if (chatContainer) {
            this.log('[KeywordBlocking] Chat container found in iframe, applying filtering');
            this.filterTextInNode(chatContainer);
            observeChatContainer(chatContainer);
        }
        else {
            this.log('[KeywordBlocking] Chat container not found in iframe');
            setTimeout(() => this.monitorKeywordIframeContent(iframe, attempt + 1, maxAttempts), 1000);
        }
    }
    catch (error) {
        this.log('[KeywordBlocking] Error accessing iframe content:', error);
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
            console.log('[KeywordBlocking] Watchdog: Filtering failure or chat container not found, restarting...');
            keywordLastFailureTime = keywordLastFailureTime || currentTime;
            resetKeywordFiltering();
            if (currentTime - keywordLastFailureTime > maxFailureDuration) {
                console.log('[KeywordBlocking] Watchdog: Failure lasts too long, forcing full restart...');
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
            console.log('[KeywordBlocking] Watchdog: Filtering working correctly');
        }
    };
    setInterval(() => {
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .vod-message, .chat-room__content');
        if (!chatContainer) {
            console.log('[KeywordBlocking] Watchdog: Chat container not found, checking more frequently');
            check();
        }
    }, 1000);
    setInterval(check, baseInterval);
}
function checkKeywordFilteringStatus() {
    console.log('[KeywordBlocking] Watchdog: Checking filtering status...');
    // Добавляем .vod-message в селектор контейнера
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .vod-message');
    if (!chatContainer) {
        console.log('[KeywordBlocking] Watchdog: Chat container not found');
        return false;
    }
    const messages = chatContainer.querySelectorAll('[data-a-target="chat-line-message"], .vod-message, .chat-line__message');
    if (messages.length === 0) {
        console.log('[KeywordBlocking] Watchdog: No messages in chat, possibly loading');
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
            console.log('[KeywordBlocking] Watchdog: Message with banned keyword is visible!');
            failureDetected = true;
        }
    });
    console.log(`[KeywordBlocking] Watchdog: Filtering status: ${failureDetected ? 'Failure detected' : 'Working correctly'}`);
    return !failureDetected;
}
function handleKeywordVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
        console.log("[KeywordBlocking] Visibility changed:", document.visibilityState);
        if (document.visibilityState === 'visible' && !observerIsActive) {
            console.log("[KeywordBlocking] Tab became visible, restarting observation...");
            if (observer)
                observer.disconnect();
            observeChatContainer();
        }
    });
}
function resetKeywordFiltering() {
    console.log("[KeywordBlocking] Resetting keyword filtering...");
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
        console.error("[KeywordBlocking] Error in resetKeywordFiltering:", error);
    }
}
// ---------------- Функция    импорта заблокированных слов ---------------------- //
function importBannedKeywords(counter) {
    try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        const validKeywords = (data.bannedKeywords || []).filter(item => item.id && item.text && item.date);
                        setStorage('bannedKeywords', validKeywords);
                        const bannedСhatList = uiElements?.bannedСhatList || document.getElementById('banned-сhat-list');
                        if (bannedСhatList) {
                            updateBannedСhatList(bannedСhatList, {
                                bannedKeywords: validKeywords,
                                newlyAddedIds: new Set(),
                                lastKeyword: validKeywords[validKeywords.length - 1] || null
                            });
                        }
                        if (uiElements && uiElements.counter) {
                            updateCounter(uiElements.counter);
                        }
                        window.Notifications.showPanelNotification("Banned keywords imported successfully!", true);
                    }
                    catch (error) {
                        window.Notifications.showPanelNotification("Failed to import data: Invalid file", false);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    catch (error) {
        window.Notifications.showPanelNotification("Failed to import data: Invalid file", false);
    }
}
//----------- Функция   экспорта   ключевых слов
function exportBannedKeywords() {
    console.log("[Content] Exporting banned keywords...");
    try {
        const bannedKeywords = getStorage('bannedKeywords', []);
        console.log('[Content] bannedKeywords:', bannedKeywords);
        const keywordsArray = Array.isArray(bannedKeywords) ? bannedKeywords : [];
        const total = keywordsArray.length;
        const data = {
            bannedKeywords: keywordsArray,
            total: total
        };
        console.log('[Content] Export data:', data);
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const fileName = `7BTTVFZ_banned_keywords_${date}_total${total}.json`;
        console.log('[Content] File name:', fileName);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        console.log(`[Content] Initiating download for file: ${fileName}, URL: ${url}, Blob size: ${blob.size}`);
        setTimeout(() => {
            try {
                a.click();
                console.log(`[Content] Download triggered for ${fileName}`);
                window.Notifications.showPanelNotification(`Exported ${fileName} successfully!`, true);
            }
            catch (clickError) {
                console.error('[Content] Error triggering download:', clickError);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                console.log('[Content] Fallback download triggered');
                window.Notifications.showPanelNotification(`Exported ${fileName} successfully!`, true);
            }
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log(`[Content] Cleaned up after download: ${fileName}`);
            }, 100);
        }, 0);
    }
    catch (error) {
        console.error("[Content] Banned keywords export error:", error);
        window.Notifications.showPanelNotification("Failed to export banned keywords", false);
    }
}
//----------- Функция   экспорта banned users
function exportBannedUsers() {
    console.log("[Content] Exporting banned users...");
    try {
        const bannedUsers = getStorage('bannedUsers', []);
        if (!Array.isArray(bannedUsers)) {
            console.error("[Content] bannedUsers is not an array:", bannedUsers);
            window.Notifications.showPanelNotification("Failed to export users", false);
            return;
        }
        const data = { bannedUsers, total: bannedUsers.length };
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const fileName = `7BTFZ_banned_users_${date}_total${data.total}.json`;
        if (!document.body) {
            console.error("[Content] document.body is not available");
            window.Notifications.showPanelNotification("Failed to export users: DOM not ready", false);
            return;
        }
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        window.Notifications.showPanelNotification(`Exported ${data.total} users successfully!`, true);
    }
    catch (error) {
        console.error("[Content] Export banned users error:", error);
        window.Notifications.showPanelNotification("Failed to export users", false);
    }
}
//----------- Функция для импорта  banned users
function importBannedUsers(counter) {
    console.log("[Content] Importing banned users...");
    try {
        if (!document.body) {
            console.error("[Content] document.body is not available");
            window.Notifications.showPanelNotification("Failed to import users: DOM not ready", false);
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) {
                window.Notifications.showPanelNotification("No file selected", false);
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                window.Notifications.showPanelNotification("File too large (max 10MB)", false);
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const validUsers = (data.bannedUsers || []).filter(item => item.id && item.text && item.date);
                    setStorage('bannedUsers', []);
                    setStorage('bannedUsers', validUsers);
                    const bannedChatList = uiElements?.bannedСhatList || document.getElementById('banned-сhat-list');
                    if (bannedChatList) {
                        const bannedKeywords = getStorage('bannedKeywords', []);
                        const allItems = [...bannedKeywords, ...validUsers];
                        const lastKeyword = allItems.length > 0 ? allItems.reduce((latest, current) => new Date(current.date) > new Date(latest.date) ? current : latest, allItems[0]) : null;
                        updateBannedСhatList(bannedChatList, {
                            bannedKeywords,
                            bannedUsers: validUsers,
                            newlyAddedIds: new Set(),
                            lastKeyword
                        });
                    }
                    else {
                        console.error("[Content] bannedChatList not found");
                        window.Notifications.showPanelNotification("Failed to update UI: List element not found", false);
                    }
                    if (counter)
                        updateCounter(counter);
                    window.Notifications.showPanelNotification(`Imported ${validUsers.length} users successfully!`, true);
                    if (isTextBlockingEnabled && window.chatFilter) {
                        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-test-selector="chat-scrollable-area__message-container"]');
                        if (chatContainer)
                            window.chatFilter.filterTextInNode(chatContainer);
                    }
                }
                catch (error) {
                    console.error("[Content] Import error:", error);
                    window.Notifications.showPanelNotification("Failed to import users: Invalid file", false);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    catch (error) {
        console.error("[Content] Import error:", error);
        window.Notifications.showPanelNotification("Failed to import users", false);
    }
}
//----------- Функция удаления ключевых слов или banned users
function removeKeyWordOrbannedUser(id, source) {
    console.log('[Content] Attempting to remove item:', { id, source });
    // Получаем данные из localStorage
    let bannedKeywords = getStorage('bannedKeywords', []);
    let bannedUsers = getStorage('bannedUsers', []);
    let removedItem = null;
    let updated = false;
    console.log('[Debug] Current bannedKeywords:', bannedKeywords);
    console.log('[Debug] Current bannedUsers:', bannedUsers);
    // Проверяем и исправляем source
    if (source === 'keyword') {
        removedItem = bannedKeywords.find(k => k.id === id);
        if (!removedItem) {
            console.warn('[Content] Keyword not found for id:', id);
            window.Notifications?.showPanelNotification?.('Ключевое слово не найдено', 5000, false);
            return;
        }
        bannedKeywords = bannedKeywords.filter(k => k.id !== id);
        setStorage('bannedKeywords', bannedKeywords);
        updated = true;
    }
    else if (source === 'selected' || source === 'user') {
        removedItem = bannedUsers.find(u => u.id === id);
        if (!removedItem) {
            console.warn('[Content] User not found for id:', id);
            window.Notifications?.showPanelNotification?.('Пользователь не найден', 5000, false);
            return;
        }
        bannedUsers = bannedUsers.filter(u => u.id !== id);
        setStorage('bannedUsers', bannedUsers);
        updated = true;
    }
    else {
        console.error('[Content] Invalid source:', source);
        window.Notifications?.showPanelNotification?.('Неверный источник', 5000, false);
        return;
    }
    // Удаляем id из newlyAddedIds
    newlyAddedIds.delete(id);
    console.log('[Debug] Removed id from newlyAddedIds:', id);
    if (updated) {
        console.log('[Content] Removed item with id:', id, 'from', source, 'text:', removedItem.text);
        window.Notifications?.showPanelNotification?.(`Удалено: ${removedItem.text}`, 3000, true);
    }
    // Восстановление сообщений
    if (isTextBlockingEnabled) {
        filteredMessages.forEach(({ element, parent, nextSibling, keyword }, messageId) => {
            if (!parent || !parent.isConnected) {
                console.log('[Debug] Parent not connected, removing from filteredMessages:', messageId);
                filteredMessages.delete(messageId);
                return;
            }
            const textFragment = element.querySelector('.text-fragment[data-a-target="chat-message-text"]');
            if (!textFragment) {
                console.log('[Debug] Text fragment not found, removing from filteredMessages:', messageId);
                filteredMessages.delete(messageId);
                return;
            }
            const text = textFragment.textContent.toLowerCase();
            const userId = element.dataset.userId;
            let shouldKeepFiltered = false;
            for (const kw of bannedKeywords) {
                const searchText = kw.text.toLowerCase();
                const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = kw.isPhrase
                    ? new RegExp(`\\b${escapedText}\\b`, 'gi')
                    : new RegExp(`(?:\\b${escapedText}\\b)|(?:${escapedText}){1,3000}`, 'gi');
                if (regex.test(text)) {
                    shouldKeepFiltered = true;
                    break;
                }
            }
            if (!shouldKeepFiltered && (source === 'user' || source === 'selected')) {
                for (const user of bannedUsers) {
                    if (user.userId === userId || user.text.toLowerCase() === keyword?.toLowerCase()) {
                        shouldKeepFiltered = true;
                        break;
                    }
                }
            }
            if (!shouldKeepFiltered && keyword === removedItem.text) {
                parent.insertBefore(element, nextSibling);
                element.style.display = '';
                console.log(`[Content] Restored message (messageId: ${messageId}, userId: ${element.dataset.userId})`);
                filteredMessages.delete(messageId);
            }
        });
    }
    // Обновляем список
    const bannedСhatList = document.querySelector('.banned-сhat-list-container')?.parentElement;
    if (bannedСhatList) {
        const allItems = [...bannedKeywords, ...bannedUsers];
        const lastKeyword = allItems.length > 0 ? allItems.reduce((latest, current) => {
            return new Date(current.date) > new Date(latest.date) ? current : latest;
        }, allItems[0]) : null;
        updateBannedСhatList(bannedСhatList, {
            bannedKeywords,
            bannedUsers,
            newlyAddedIds,
            lastKeyword
        });
        // Показываем уведомление, если список пуст
        if (allItems.length === 0) {
            window.Notifications?.showPanelNotification?.('No items added', 3000, false);
        }
    }
    else {
        console.error('[Content] Banned chat list container not found for update');
    }
    if (isTextBlockingEnabled) {
        toggleKeywordsInChat();
    }
}
function goToLastAddedKeyword() {
    console.log('[Content] Going to last added keyword...');
    const bannedСhatList = uiElements?.bannedСhatList || document.getElementById('banned-сhat-list');
    if (!bannedСhatList) {
        console.warn('[Content] Banned chat list element not found');
        return;
    }
    const bannedKeywords = getStorage('bannedKeywords', []);
    const bannedUsers = getStorage('bannedUsers', []);
    const allItems = [
        ...bannedKeywords.map(item => ({ ...item, source: 'keyword' })),
        ...bannedUsers.map(item => ({ ...item, source: 'selected' }))
    ];
    if (allItems.length === 0) {
        console.log('[Content] Список пуст, некуда прокручивать');
        return;
    }
    // Находим элемент с самой поздней датой
    const lastItem = allItems.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
    }, allItems[0]);
    console.log('[Debug] Last item', { id: lastItem.id, text: lastItem.text, date: lastItem.date });
    // Вычисляем индекс последнего элемента
    const lastItemIndex = allItems.findIndex(item => item.id === lastItem.id);
    if (lastItemIndex === -1) {
        console.warn('[Content] Последний элемент не найден в списке');
        return;
    }
    // Получаем динамическую высоту элемента
    const getItemHeight = () => {
        const container = bannedСhatList.querySelector('.banned-сhat-list-container') || bannedСhatList;
        const sampleLi = document.createElement('li');
        sampleLi.className = 'keyword-item';
        sampleLi.style.visibility = 'hidden';
        sampleLi.innerHTML = `
            <div class="keyword-content">
                <span>Test</span>
                <div class="date-delete-group">
                    <span class="data-time">Test</span>
                    <button class="delete-button">Delete</button>
                </div>
            </div>
            <span>Test</span>
        `;
        container.appendChild(sampleLi);
        const height = sampleLi.offsetHeight || 60;
        sampleLi.remove();
        return height;
    };
    const itemHeight = getItemHeight();
    console.log('[Debug] Item height in goToLastAddedKeyword', itemHeight);
    const lastItemPosition = lastItemIndex * itemHeight;
    const viewportHeight = bannedСhatList.clientHeight;
    const container = bannedСhatList.querySelector('.banned-сhat-list-container') || bannedСhatList;
    const containerHeight = allItems.length * itemHeight;
    // Прокручиваем к последнему элементу, центрируя его
    const scrollPosition = Math.max(0, lastItemPosition - (viewportHeight / 2) + (itemHeight / 2));
    // Обновляем список перед прокруткой
    updateBannedСhatList(bannedСhatList, {
        bannedKeywords: getStorage('bannedKeywords', []),
        bannedUsers: getStorage('bannedUsers', []),
        newlyAddedIds: new Set(),
        lastKeyword: null // Не подсвечиваем при ручной прокрутке
    }, '', 'date', 'asc');
    // Ждём рендеринга и применяем прокрутку
    setTimeout(() => {
        bannedСhatList.scrollTop = scrollPosition;
        console.log('[Debug] Scroll position set', {
            lastItemIndex,
            lastItemPosition,
            scrollPosition,
            viewportHeight,
            containerHeight,
            maxScroll: containerHeight - viewportHeight
        });
        // Проверяем наличие элемента
        const lastElement = container.querySelector(`[data-id="${lastItem.id}"]`);
        console.log('[Debug] Last element search', { id: lastItem.id, found: !!lastElement });
        if (lastElement) {
            lastElement.classList.add('last-item-highlight');
            console.log(`[Content] Подсвечено: ${lastItem.text} (ID: ${lastItem.id})`);
            setTimeout(() => {
                lastElement.classList.remove('last-item-highlight');
                console.log(`[Content] Подсветка убрана с элемента: ${lastItem.text}`);
            }, 5000);
        }
        else {
            console.warn('[Content] Элемент не отрендерился после прокрутки', { id: lastItem.id });
            // Принудительный рендеринг с повторной прокруткой
            updateBannedСhatList(bannedСhatList, {
                bannedKeywords: getStorage('bannedKeywords', []),
                bannedUsers: getStorage('bannedUsers', []),
                newlyAddedIds: new Set(),
                lastKeyword: null
            }, '', 'date', 'asc');
            setTimeout(() => {
                const retryElement = container.querySelector(`[data-id="${lastItem.id}"]`);
                if (retryElement) {
                    bannedСhatList.scrollTop = scrollPosition;
                    retryElement.classList.add('last-item-highlight');
                    console.log(`[Content] Подсвечено после повторного рендеринга: ${lastItem.text}`);
                    setTimeout(() => {
                        retryElement.classList.remove('last-item-highlight');
                    }, 5000);
                }
                else {
                    console.error('[Content] Элемент всё ещё не найден', { id: lastItem.id });
                }
            }, 150);
        }
    }, 150);
    console.log(`[Content] Прокрутка инициирована к элементу: ${lastItem.text} (Index: ${lastItemIndex}, Date: ${lastItem.date})`);
}
// =========================================================================================== //
//------------ Функция экспорта ChatBannedItems (объединяет bannedKeywords и bannedUsers) ----------- //
function exportChatBannedItems() {
    console.log("[Content] Exporting ChatBannedItems...");
    try {
        const bannedKeywords = getStorage('bannedKeywords', []);
        const bannedUsers = getStorage('bannedUsers', []);
        if (!Array.isArray(bannedKeywords) || !Array.isArray(bannedUsers)) {
            console.error("[Content] Invalid data: bannedKeywords or bannedUsers is not an array");
            window.Notifications.showPanelNotification("Failed to export ChatBannedItems", false);
            return;
        }
        const data = {
            chatBannedItems: {
                bannedKeywords,
                bannedUsers
            },
            total: bannedKeywords.length + bannedUsers.length
        };
        console.log('[Content] Export data:', data);
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const fileName = `7BTTVFZ_chat_banned_items_${date}_total${data.total}.json`;
        console.log('[Content] File name:', fileName);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        console.log(`[Content] Initiating download for file: ${fileName}, URL: ${url}, Blob size: ${blob.size}`);
        setTimeout(() => {
            try {
                a.click();
                console.log(`[Content] Download triggered for ${fileName}`);
                window.Notifications.showPanelNotification(`Exported ${fileName} successfully!`, true);
            }
            catch (clickError) {
                console.error('[Content] Error triggering download:', clickError);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                console.log('[Content] Fallback download triggered');
                window.Notifications.showPanelNotification(`Exported ${fileName} successfully!`, true);
            }
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log(`[Content] Cleaned up after download: ${fileName}`);
            }, 100);
        }, 0);
    }
    catch (error) {
        console.error("[Content] ChatBannedItems export error:", error);
        window.Notifications.showPanelNotification("Failed to export ChatBannedItems", false);
    }
}
// =========================================================================================== //
//========================= Функция импорта ChatBannedItems ================================== //
function importChatBannedItems(counter) {
    console.log("[Content] Importing ChatBannedItems...");
    try {
        if (!document.body) {
            console.error("[Content] document.body is not available");
            window.Notifications.showPanelNotification("Failed to import ChatBannedItems: DOM not ready", false);
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) {
                window.Notifications.showPanelNotification("No file selected", false);
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                window.Notifications.showPanelNotification("File too large (max 10MB)", false);
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const validKeywords = (data.chatBannedItems?.bannedKeywords || []).filter(item => item.id && item.text && item.date);
                    const validUsers = (data.chatBannedItems?.bannedUsers || []).filter(item => item.id && item.text && item.date);
                    // Сохраняем данные в хранилище
                    setStorage('bannedKeywords', validKeywords);
                    setStorage('bannedUsers', validUsers);
                    const bannedChatList = uiElements?.bannedСhatList || document.getElementById('banned-сhat-list');
                    if (bannedChatList) {
                        const allItems = [...validKeywords, ...validUsers];
                        const lastKeyword = allItems.length > 0 ? allItems.reduce((latest, current) => new Date(current.date) > new Date(latest.date) ? current : latest, allItems[0]) : null;
                        updateBannedСhatList(bannedChatList, {
                            bannedKeywords: validKeywords,
                            bannedUsers: validUsers,
                            newlyAddedIds: new Set(),
                            lastKeyword
                        });
                    }
                    else {
                        console.error("[Content] bannedChatList not found");
                        window.Notifications.showPanelNotification("Failed to update UI: List element not found", false);
                    }
                    if (counter)
                        updateCounter(counter);
                    window.Notifications.showPanelNotification(`Imported ${validKeywords.length} keywords and ${validUsers.length} users successfully!`, true);
                    // Если фильтрация текста включена, обновляем чат
                    if (isTextBlockingEnabled && window.chatFilter) {
                        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-test-selector="chat-scrollable-area__message-container"]');
                        if (chatContainer)
                            window.chatFilter.filterTextInNode(chatContainer);
                    }
                }
                catch (error) {
                    console.error("[Content] Import error:", error);
                    window.Notifications.showPanelNotification("Failed to import ChatBannedItems: Invalid file", false);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    catch (error) {
        console.error("[Content] Import error:", error);
        window.Notifications.showPanelNotification("Failed to import ChatBannedItems", false);
    }
}
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
            console.log("[Blocking] Tab became visible, restarting observation...");
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
            console.log(`[Blocking] Channel changed: ${lastChannel} -> ${currentChannel}`);
            lastChannel = currentChannel;
            restartBlockingLogic();
            toggleEmotesInChat(true);
        }
    };
    // Проверяем изменение канала каждые 2 секунды
    setInterval(checkChannel, 2000);
    // Также реагируем на изменения URL
    window.addEventListener('popstate', () => {
        console.log("[Blocking] URL changed, checking channel...");
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
            console.log('[Blocking] RootObserver: Processing DOM changes:', mutations.length);
            const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .vod-message, .chat-list--default, [data-a-target="chat-room-content"]');
            if (chatContainer && !observerIsActive) {
                console.log('[Blocking] RootObserver: Chat container found, starting observation');
                observeChatContainer();
            }
            else if (!chatContainer) {
                console.log('[Blocking] RootObserver: Chat container not found');
                observerIsActive = false;
            }
            debounceTimeout = null;
        }, 150); // Среднее значение между 100 и 200 мс
    });
    const rootElement = document.querySelector('.video-player') || document.body;
    rootObserver.observe(rootElement, { childList: true, subtree: true });
    console.log('[Blocking] RootObserver started on:', rootElement === document.body ? 'document.body' : '.video-player');
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
let observer = new MutationObserver((mutations, obs) => {
    console.log("[Observer] Mutations detected:", mutations.length);
    processedEmotes = new WeakMap(); // Сбрасываем перед обработкой новых узлов
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .vod-message, .chat-image chat-line__message--emote ffz--pointer-events ffz-tooltip ffz-emote, .ffz--inline, chat-line__message tw-relative') || document.querySelector('.chat-room__content');
    if (chatContainer) {
        toggleEmotesInNode(chatContainer);
    }
    else {
        console.log("[Observer] Chat container not found");
    }
});
// Глобальные элементы UI
let uiElements = null;
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
    console.log("[KeywordBlocking] Toggling keywords in chat, firstUpdate:", firstUpdate);
    const messages = document.querySelectorAll('[data-a-target="chat-line-message"], .vod-message, .chat-line__message');
    const keywords = getStorage('bannedKeywords', []);
    if (!keywords.length || !getStorage('isBlockingEnabled', true) || !getStorage('isKeywordBlockingEnabled', true)) {
        console.log("[KeywordBlocking] No keywords or blocking disabled, showing all messages");
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
    console.log(`[KeywordBlocking] Toggled keywords in chat, hidden: ${hiddenCount} messages`);
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
const EMOTE_SELECTOR = `
    .chat-line__message img,
    .chat-line__message .emote,
    .chat-line__message .bttv-emote,
    .chat-line__message .seventv-emote,
    .chat-line__message .ffz-emote,
    .chat-line__message .twitch-emote,
    .video-chat__message-list-wrapper,
    .vod-message,
`;
function generateRandomID(type = 'emote') {
    // Генерация UUID v4
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    const prefix = type === 'keyword' ? 'keyword_' : 'emote_';
    const id = `${prefix}${uuid}`;
    if (isLoggingEnabled()) {
        console.log(`[GenerateID] Generated ${type} ID: ${id} (length: ${id.length})`);
    }
    return id;
}
function toggleEmotesInNode(node, immediate = false) {
    const startTime = performance.now();
    try {
        // Проверяем, что node находится в чате
        // Проверяем, что node находится в чате
        if (!node.closest(`
            .chat-scrollable-area__message-container,
            .video-chat__message-list-wrapper,
            .vod-message,
            .ffz--inline,
            .chat-image.chat-line__message--emote.ffz--pointer-events.ffz-tooltip.ffz-emote,
            .chat-line__message.tw-relative
        `)) {
            console.log("[Blocking] Node outside chat, skipping");
            return;
        }
        const emotes = node.querySelectorAll(`
            .chat-line__message img,
            .chat-line__message .emote,
            .chat-line__message .bttv-emote,
            .chat-line__message .seventv-emote,
            .chat-line__message .ffz-emote,
            .chat-line__message .twitch-emote
        `);
        console.log(`[Blocking] Found ${emotes.length} emotes in chat node`);
        // Функция для извлечения ID эмодзи из URL
        const getEmoteId = (url) => {
            if (url.includes('betterttv.net')) {
                const match = url.match(/betterttv\.net\/emote\/([0-9a-f]{24})/);
                return match ? match[1] : null;
            }
            else if (url.includes('7tv.app')) {
                const match = url.match(/7tv\.app\/emote\/([0-9a-f]{24})/);
                return match ? match[1] : null;
            }
            return null;
        };
        for (const emote of emotes) {
            const emoteUrl = emote.src || emote.getAttribute('srcset')?.split(' ')[0] || '';
            const emoteAlt = emote.getAttribute('alt') || '';
            const emoteId = emote.getAttribute('data-id') || emote.getAttribute('data-emote-id') || '';
            const provider = emote.getAttribute('data-provider') || '';
            let blockedEntry = null;
            // Определяем платформу и ищем совпадение
            if (emoteUrl.includes('7tv.app') || provider === '7tv') {
                const emoteIdFromUrl = getEmoteId(emoteUrl);
                blockedEntry = blockedEmotes.find(e => e.platform === '7tv' && (e.emoteUrl === emoteUrl ||
                    (emoteIdFromUrl && getEmoteId(e.emoteUrl) === emoteIdFromUrl)));
            }
            else if (emoteUrl.includes('betterttv.net') || provider === 'bttv') {
                const emoteIdFromUrl = getEmoteId(emoteUrl);
                blockedEntry = blockedEmotes.find(e => e.platform === 'bttTV' && (e.emoteUrl === emoteUrl ||
                    (emoteIdFromUrl && getEmoteId(e.emoteUrl) === emoteIdFromUrl)));
            }
            else if (emoteUrl.includes('frankerfacez.com') || provider === 'ffz') {
                blockedEntry = blockedEmotes.find(e => e.platform === 'ffz' && e.emoteUrl === emoteUrl);
            }
            else if (emoteUrl.includes('jtvnw.net') || emoteUrl.includes('twitchcdn.net') || provider === 'twitch') {
                blockedEntry = blockedChannels.find(e => e.platform === 'TwitchChannel' &&
                    (e.emoteName.toLowerCase() === emoteAlt.toLowerCase() ||
                        (e.prefix && emoteAlt.toLowerCase().startsWith(e.prefix.toLowerCase()))));
                if (!blockedEntry && emoteId) {
                    blockedEntry = blockedChannels.find(e => e.id === emoteId);
                }
            }
            // Присваиваем data-emote-id, если нашли совпадение
            if (blockedEntry && !emote.getAttribute('data-emote-id')) {
                emote.setAttribute('data-emote-id', blockedEntry.id);
            }
            const emoteIdAssigned = emote.getAttribute('data-emote-id');
            let shouldBeBlocked = false;
            // Проверяем по ID
            if (emoteIdAssigned && (blockedEmoteIDs.has(emoteIdAssigned) || blockedChannelIDs.has(emoteIdAssigned))) {
                shouldBeBlocked = true;
            }
            else if ((provider === 'twitch' || emoteUrl.includes('jtvnw.net') || emoteUrl.includes('twitchcdn.net')) && emoteAlt) {
                shouldBeBlocked = blockedChannels.some(e => e.platform === 'TwitchChannel' &&
                    (e.emoteName.toLowerCase() === emoteAlt.toLowerCase() ||
                        (e.prefix && emoteAlt.toLowerCase().startsWith(e.prefix.toLowerCase()))));
            }
            const isBlocked = isBlockingEnabled && shouldBeBlocked;
            emote.style.display = isBlocked ? 'none' : '';
            // Логируем только заблокированные эмодзи или в дебаг-режиме
            if (isBlocked) {
                console.log(`[Blocking] Emote ${emoteAlt || emoteUrl} (ID: ${emoteIdAssigned || emoteId || 'none'}, Provider: ${provider}) hidden`);
            }
        }
        console.log(`[Blocking] toggleEmotesInNode took ${performance.now() - startTime} ms`);
    }
    catch (error) {
        console.error("[Blocking] Error in toggleEmotesInNode:", error);
    }
}
function toggleEmotesInChat(immediate = false) {
    console.log(`[${new Date().toISOString()}] [Blocking] toggleEmotesInChat started (immediate: ${immediate}, isBlockingEnabled: ${isBlockingEnabled})`);
    const startTime = performance.now();
    // Сбрасываем кэш, чтобы пересмотреть все эмодзи
    processedEmotes = new WeakMap();
    // Находим основной контейнер чата
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container') || document.querySelector('.chat-room__content');
    if (!chatContainer) {
        console.log("[Blocking] Chat container not found in toggleEmotesInChat");
        return;
    }
    // Обрабатываем весь чат
    toggleEmotesInNode(chatContainer, immediate);
}
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
// ========================== Инициализация контекстного меню ==================================== //  
// =============================================================================================== //
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("[Content] Received message:", request);
    if (request.action === 'contextMenuClicked') {
        const { menuItemId, srcUrl, linkText, frameId } = request.info;
        console.log("[Content] Menu item clicked:", menuItemId, "srcUrl:", srcUrl);
        if (menuItemId === 'blockEmote' && srcUrl) {
            let platform, emoteName, emoteUrl, emotePrefix;
            let emoteAlt = linkText?.trim() || '';
            let targetElement = null;
            try {
                const frame = frameId && document.querySelectorAll('iframe')[frameId]
                    ? document.querySelectorAll('iframe')[frameId]
                    : document;
                const images = frame.querySelectorAll(`img[src="${srcUrl}"], img[srcset*="${srcUrl}"], .chat-line__message img, .seventv-emote, .bttv-emote, .ffz-emote, .twitch-emote, .chat-message-emote`);
                for (const img of images) {
                    if (img.src === srcUrl || img.getAttribute('srcset')?.includes(srcUrl)) {
                        targetElement = img;
                        break;
                    }
                }
                if (!targetElement && images.length > 0) {
                    targetElement = images[0];
                }
                console.log('[Content] Found target element:', targetElement);
            }
            catch (e) {
                console.warn('[Content] Failed to find element in DOM:', e);
            }
            if (targetElement) {
                emoteAlt = targetElement.getAttribute('alt') ||
                    targetElement.getAttribute('data-emote-name') ||
                    targetElement.getAttribute('title') ||
                    targetElement.getAttribute('data-code') || // Для эмодзи
                    '';
                emoteAlt = emoteAlt.trim();
            }
            const dataProvider = targetElement?.getAttribute('data-provider') || '';
            const dataSet = targetElement?.getAttribute('data-set') || '';
            if (srcUrl.includes('7tv.app') || dataProvider === '7tv' || dataSet.includes('seventv_emotes')) {
                platform = '7tv';
                emoteUrl = srcUrl;
                emoteName = emoteAlt || srcUrl.split('/').slice(-2)[0] || 'Unnamed';
                emotePrefix = emoteUrl;
            }
            else if (srcUrl.includes('betterttv.net') || dataProvider === 'bttv' || (dataProvider === 'ffz' && srcUrl.includes('betterttv.net'))) {
                platform = 'bttTV';
                emoteUrl = srcUrl;
                emoteName = emoteAlt || srcUrl.split('/').pop().replace(/\.webp|\.png/, '') || 'Unnamed';
                emotePrefix = emoteUrl;
            }
            else if (srcUrl.includes('frankerfacez.com') || (dataProvider === 'ffz' && !srcUrl.includes('betterttv.net'))) {
                platform = 'ffz';
                emoteUrl = srcUrl;
                emoteName = emoteAlt || srcUrl.split('/').pop().replace(/\.webp|\.png/, '') || 'Unnamed';
                emotePrefix = emoteUrl;
            }
            else if (srcUrl.includes('jtvnw.net') || emoteAlt || dataProvider === 'twitch') {
                platform = 'TwitchChannel';
                emoteName = emoteAlt || srcUrl.split('/').pop() || 'Unnamed';
                const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                emoteUrl = '';
            }
            else if (dataProvider === 'emoji') {
                platform = 'emoji';
                emoteName = emoteAlt || srcUrl.split('/').pop() || 'Unnamed';
                emotePrefix = emoteName;
                emoteUrl = srcUrl;
            }
            else {
                platform = 'TwitchChannel';
                emoteName = emoteAlt || srcUrl.split('/').pop() || 'Unnamed';
                const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                emoteUrl = '';
            }
            if (!emoteName || emoteName === 'Unknown') {
                emoteName = targetElement?.getAttribute('data-id') || srcUrl.split('/').pop() || 'Unnamed';
            }
            console.log(`[Content] Blocking emote:`, { emoteName, platform, emoteUrl, emotePrefix });
            const item = addEmoteOrChannel(emotePrefix, platform, emoteName, emoteUrl, targetElement);
            if (item && targetElement) {
                targetElement.setAttribute('data-emote-id', item.id);
                targetElement.style.display = 'none';
                console.log(`[Content] Immediately hid emote ${emoteName} with ID ${item.id}`);
                if (uiElements?.counter) {
                    updateCounter(uiElements.counter);
                }
            }
        }
        else if (menuItemId === 'showEmotesPopup' && srcUrl) {
            let emotes = [];
            let targetElement = null;
            try {
                const frame = document;
                console.log("[Content] Frame selected for search:", frame);
                const emoteId = srcUrl.split('/')[4];
                const emoteElement = frame.querySelector(`img[src*="${emoteId}"], img[srcset*="${emoteId}"], .chat-image[src*="${emoteId}"], .ffz-emote[src*="${emoteId}"], .chat-line__message--emote[src*="${emoteId}"]`);
                console.log("[Content] Searched for emoteElement with emoteId:", emoteId, "Result:", emoteElement);
                const container = emoteElement?.closest('.chat-line__message-container, .chat-line__message, .ffz--inline, .modified-emote') || emoteElement?.parentElement || emoteElement;
                console.log("[Content] Container found:", container);
                if (!emoteElement && !container) {
                    console.warn("[Content] No emote element or container found for srcUrl:", srcUrl);
                    emotes = [{
                            src: srcUrl,
                            alt: 'Unnamed',
                            platform: srcUrl.includes('7tv.app') ? '7tv' :
                                srcUrl.includes('betterttv.net') ? 'bttTV' :
                                    srcUrl.includes('frankerfacez.com') ? 'ffz' :
                                        srcUrl.includes('twemoji') ? 'emoji' : 'TwitchChannel',
                            element: null,
                            id: emoteId || ''
                        }];
                    console.log("[Content] Fallback: Created single emote entry:", emotes);
                }
                else {
                    const images = container?.querySelectorAll('img.chat-image, img.chat-line__message--emote, .ffz-emote, .seventv-emote, .bttv-emote, .twitch-emote, img[src*=".7tv.app"], img[src*=".betterttv.net"], img[src*=".frankerfacez.com"], img[src*=".twitchcdn.net"], img[data-provider="emoji"]') || [];
                    console.log("[Content] Raw images:", Array.from(images).map(img => ({
                        src: img.src,
                        alt: img.getAttribute('alt'),
                        dataEmoteName: img.getAttribute('data-emote-name'),
                        dataProvider: img.getAttribute('data-provider'),
                        dataSet: img.getAttribute('data-set'),
                        dataCode: img.getAttribute('data-code')
                    })));
                    emotes = Array.from(images).map(img => {
                        const emoteUrl = img.src || img.getAttribute('srcset')?.split(' ')[0] || '';
                        const emoteAlt = img.getAttribute('alt') ||
                            img.getAttribute('data-emote-name') ||
                            img.getAttribute('title') ||
                            img.getAttribute('data-code') || '';
                        const dataProvider = img.getAttribute('data-provider') || '';
                        const dataSet = img.getAttribute('data-set') || '';
                        let platform = 'TwitchChannel';
                        if (emoteUrl.includes('7tv.app') || dataProvider === '7tv' || dataSet.includes('seventv_emotes')) {
                            platform = '7tv';
                        }
                        else if (emoteUrl.includes('betterttv.net') || dataProvider === 'bttv') {
                            platform = 'bttTV';
                        }
                        else if (emoteUrl.includes('frankerfacez.com') || dataProvider === 'ffz') {
                            platform = 'ffz';
                        }
                        else if (dataProvider === 'emoji') {
                            platform = 'emoji';
                        }
                        return {
                            src: emoteUrl,
                            alt: emoteAlt.trim() || 'Unnamed',
                            platform,
                            element: img,
                            id: img.getAttribute('data-emote-id') || img.getAttribute('data-id') || ''
                        };
                    }).filter(emote => emote.src || emote.alt);
                    // Добавляем vp вручную, если не найден
                    if (!emotes.some(emote => emote.alt === 'vp') && srcUrl.includes('01FF4NRKKR000FF5VVCKV49JZ2')) {
                        emotes.push({
                            src: srcUrl,
                            alt: 'vp',
                            platform: '7tv',
                            element: null,
                            id: '01FF4NRKKR000FF5VVCKV49JZ2'
                        });
                        console.log("[Content] Manually added vp to emotes");
                    }
                    targetElement = container;
                    console.log('[Content] Found emotes in container:', emotes);
                }
            }
            catch (e) {
                console.error('[Content] Error finding elements in DOM:', e);
                const emoteId = srcUrl.split('/')[4] || '';
                emotes = [{
                        src: srcUrl,
                        alt: 'Unnamed',
                        platform: srcUrl.includes('7tv.app') ? '7tv' :
                            srcUrl.includes('betterttv.net') ? 'bttTV' :
                                srcUrl.includes('frankerfacez.com') ? 'ffz' :
                                    srcUrl.includes('twemoji') ? 'emoji' : 'TwitchChannel',
                        element: null,
                        id: emoteId
                    }];
                console.log("[Content] Fallback due to error:", emotes);
            }
            console.log("[Content] Showing emote selection popup for emotes:", emotes);
            showEmoteSelectionPopup(emotes, (selectedEmote) => {
                let emoteName = selectedEmote.alt;
                let emoteUrl = selectedEmote.src;
                let emotePrefix = emoteName;
                if (selectedEmote.platform === 'TwitchChannel' || selectedEmote.platform === 'emoji') {
                    const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                    emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                    emoteUrl = selectedEmote.platform === 'emoji' ? emoteUrl : '';
                }
                else {
                    emotePrefix = emoteUrl;
                }
                console.log(`[Content] Blocking selected emote from popup:`, { emoteName, platform: selectedEmote.platform, emoteUrl, emotePrefix });
                const item = addEmoteOrChannel(emotePrefix, selectedEmote.platform, emoteName, emoteUrl, selectedEmote.element);
                if (item && selectedEmote.element) {
                    selectedEmote.element.setAttribute('data-emote-id', item.id);
                    selectedEmote.element.style.display = 'none';
                    console.log(`[Content] Immediately hid emote ${emoteName} with ID ${item.id}`);
                    if (uiElements?.counter) {
                        updateCounter(uiElements.counter);
                    }
                    setStorage(() => {
                        console.log("[Content] Storage updated after blocking from popup");
                        toggleEmotesInNode(document.body, true);
                    });
                }
                else {
                    console.error("[Content] Failed to block emote from popup:", selectedEmote);
                }
            });
        }
        else {
            console.warn("[Content] Unhandled menuItemId or missing srcUrl:", menuItemId, srcUrl);
        }
    }
});
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
        console.log("[Blocking] Chat container found:", chatContainer);
        if (observer)
            observer.disconnect();
        observer = new MutationObserver(() => {
            console.log("[Blocking] Chat changes detected, applying filters...");
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
        console.log("[Blocking] Chat container observer started");
        toggleEmotesInNode(chatContainer);
        toggleKeywordsInChat(true); // Начальная фильтрация
        if (uiElements && uiElements.counter) {
            updateCounter(uiElements.counter);
        }
    }
    else {
        retryCount++;
        if (retryCount < maxRetries) {
            console.warn(`[Blocking] Chat container not found, retrying (${retryCount}/${maxRetries})...`);
            setTimeout(observeChatContainer, 1000);
        }
        else {
            console.error("[Blocking] Max retries reached, starting root observer...");
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
function addEmoteOrChannel(emotePrefix, platform, emoteName, emoteUrl, targetElement = null, isExactMatch = false) {
    console.log("[Blocking] Adding emote/channel:", { emotePrefix, platform, emoteName, emoteUrl, isExactMatch });
    if (platform === 'user') {
        console.error('[addEmoteOrChannel] Ошибка: вызов с type="user" недопустим. Используйте addKeyword для никнеймов.');
        console.trace('[addEmoteOrChannel] Трассировка стека для user');
        window.Notifications.showPanelNotification('Ошибка: для никнеймов используйте addKeyword', 5000, false);
        return null;
    }
    const emoteId = generateRandomID();
    const currentDateTime = new Date().toISOString();
    let prefix = '';
    let finalEmoteUrl = emoteUrl;
    if (platform === 'bttTV' && emoteUrl && !emoteUrl.match(/\/\dx\.webp$/)) {
        finalEmoteUrl = `${emoteUrl}/2x.webp`;
    }
    else if (platform === '7tv' && emoteUrl && !emoteUrl.match(/\/\dx\.webp$/)) {
        finalEmoteUrl = `${emoteUrl}/2x.webp`;
    }
    let emoteIdFromUrl = null;
    if (platform === 'bttTV' && finalEmoteUrl) {
        const urlParts = finalEmoteUrl.split('/');
        emoteIdFromUrl = urlParts.find(part => /^[0-9a-f]{24}$/.test(part));
    }
    else if (platform === '7tv' && finalEmoteUrl) {
        const urlParts = finalEmoteUrl.split('/');
        emoteIdFromUrl = urlParts.find(part => /^[0-9a-f]{24}$/.test(part));
    }
    // Упрощённая проверка дубликатов
    const isDuplicate = platform === 'TwitchChannel'
        ? blockedChannels.some(e => e.emoteName === emoteName && e.platform === platform && e.id === emoteIdFromUrl)
        : blockedEmotes.some(e => (e.emoteUrl === finalEmoteUrl || e.id === emoteIdFromUrl) && e.platform === platform);
    if (isDuplicate) {
        console.log(`[Blocking] Duplicate found: ${emoteName}, not adding.`);
        return null;
    }
    let newEntry;
    if (platform === 'TwitchChannel') {
        if (isExactMatch) {
            prefix = emoteName;
        }
        else {
            const match = emoteName.match(/^([a-z0-9]+)/);
            prefix = match ? match[1] : emoteName;
        }
        newEntry = {
            id: emoteId,
            channelName: prefix,
            prefix: prefix,
            platform,
            emoteName: emoteName || 'Unnamed',
            date: currentDateTime
        };
        blockedChannels.push(newEntry);
        blockedChannelIDs.add(emoteId);
        newlyAddedIds.add(emoteId);
        setStorage('blockedChannels', blockedChannels);
    }
    else {
        newEntry = {
            id: emoteId,
            name: emoteName || emotePrefix || 'Unnamed',
            platform,
            emoteName: emoteName || 'Unnamed',
            emoteUrl: finalEmoteUrl,
            date: currentDateTime
        };
        blockedEmotes.push(newEntry);
        blockedEmoteIDs.add(emoteId);
        newlyAddedIds.add(emoteId);
        setStorage('blockedEmotes', blockedEmotes);
    }
    console.log(`[Blocking] Successfully added: ${emoteName}, ID: ${emoteId}`);
    if (targetElement) {
        targetElement.setAttribute('data-emote-id', emoteId);
        targetElement.style.display = 'none';
    }
    processedEmotes = new WeakMap();
    toggleEmotesInChat(true);
    // Обновляем список и прокручиваем сразу
    if (uiElements?.blockedList) {
        updateBlockedEmotesList(uiElements.blockedList, getBlockedItems());
        goToLastAddedItem();
    }
    // Обновляем счетчик
    if (uiElements?.counter) {
        updateCounter(uiElements.counter);
    }
    return newEntry;
}
// ===================== end of addEmoteOrChannel Функции ================================= //
// ======================================================================================== //
// ======================================================================================== //
// ========== Функция для удаления эмодзи или канала removeEmoteOrChannel ================= //
function removeEmoteOrChannel(id) {
    console.log(`[Blocking] Removing emote/channel: ${id}`);
    try {
        let removed = false;
        const emoteIndex = blockedEmotes.findIndex(e => e.id === id);
        if (emoteIndex !== -1) {
            blockedEmotes.splice(emoteIndex, 1);
            blockedEmoteIDs.delete(id);
            newlyAddedIds.delete(id);
            setStorage('blockedEmotes', blockedEmotes);
            removed = true;
        }
        const channelIndex = blockedChannels.findIndex(c => c.id === id);
        if (channelIndex !== -1) {
            blockedChannels.splice(channelIndex, 1);
            blockedChannelIDs.delete(id);
            newlyAddedIds.delete(id);
            setStorage('blockedChannels', blockedChannels);
            removed = true;
        }
        if (removed) {
            processedEmotes = new WeakMap();
            toggleEmotesInChat(true);
            if (uiElements && uiElements.blockedList) {
                updateBlockedEmotesList(uiElements.blockedList, getBlockedItems());
                // Прокручиваем к последнему элементу после добавления
                // Удаление вызова  goToLastAddedItem();
            }
            if (uiElements && uiElements.counter) {
                updateCounter(uiElements.counter);
            }
        }
    }
    catch (error) {
        console.error("[Blocking] Error removing emote/channel:", error);
    }
}
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
        bannedKeywords: getStorage('bannedKeywords', []) || [],
        bannedUsers: getStorage('bannedUsers', []) || [], // Добавляем bannedUsers
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
// ============================== end of getBlockedItems =============================================== //
// ==================================================================================================== //
// ============================ Интерфейс Панели управления createUI   ============================ //
// Функция для создания пользовательского интерфейса
// ======================================= end of createUI ============================================= //
// ===================================================================================================== //
// ==================================================================================================== //
// ================================= makePanelResizable =============================================== // 
//------------- Функция   изменения размеров панели ------------- //
function makePanelResizable(panel) {
    console.log("[UI] Setting up resizable panel...");
    const handles = panel.querySelectorAll('.resize-handle');
    let isResizing = false;
    let currentHandle = null;
    let startX, startY, startWidth, startHeight, startLeft;
    //------------- Функция для обновления позиций и размеров элементов
    function updateChildElements() {
        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;
        //------------- Устанавливаем CSS-переменные для адаптивности
        panel.style.setProperty('--panel-width', `${panelWidth}px`);
        panel.style.setProperty('--panel-height', `${panelHeight}px`);
        //------------- Проверяем ширину панели для скрытия/показа инпутов
        const isNarrow = panelWidth <= 200; // Панель сжата до 200px или меньше
        //------------- Обновляем ширину #sortContainer
        const sortContainer = document.getElementById('sortContainer');
        if (sortContainer) {
            sortContainer.style.width = `${panelWidth - 225}px`; // Совпадает с #blocked-emotes-list
        }
        //------------- Обновляем ширину #sortchatbanneditemsContainer
        //------------- Обновляем размеры #blocked-emotes-list ----------------- //
        const blockedList = document.getElementById('blocked-emotes-list');
        if (blockedList) {
            const reservedHeight = 250; // Пространство для заголовка, сортировщика, кнопок и отступов
            blockedList.style.width = `${panelWidth - 225}px`; // Учитываем кнопки справа
            blockedList.style.height = `${Math.max(30, panelHeight - reservedHeight)}px`; // Минимум 30px
        }
        //------------- Синхронизированные параметры для всех контейнеров
        const baseBottom = 130 - 30 - 8; // 92px
        const minBottom = 90 - 8; // 82px
        const verticalGap = 10; // Отступ между контейнерами (10px)
        //------------- Обновляем позицию и ширину .theme-selector-container
        const themeSelectorContainer = panel.querySelector('.theme-selector-container');
        if (themeSelectorContainer) {
            themeSelectorContainer.style.bottom = `${Math.max(minBottom, baseBottom * (panelHeight / 735)) + 31}px`; // Поднимаем на 31px
            themeSelectorContainer.style.left = `10px`;
            themeSelectorContainer.style.width = `150px`;
            themeSelectorContainer.classList.toggle('hidden', isNarrow);
            const themeSelect = themeSelectorContainer.querySelector('#theme-select');
            if (themeSelect) {
                const selectWidth = 145;
                themeSelect.style.width = `${selectWidth}px`;
            }
        }
        //------------- Обновляем позицию и ширину .search-input  ----------------- //
        const searchInput = panel.querySelector('.search-input');
        if (searchInput) {
            searchInput.style.bottom = `${Math.max(minBottom, baseBottom * (panelHeight / 735)) + 31}px`; // Поднимаем на 31px
            searchInput.style.left = `165px`; // Отступ от левого края
            searchInput.style.width = `${Math.max(100, panelWidth - 377)}px`; // Минимальная ширина 100px
            searchInput.classList.toggle('hidden', isNarrow);
            const searchInputField = searchInput.querySelector('#search-input');
            const searchButton = searchInput.querySelector('#search-button');
            if (searchInputField && searchButton) {
                const buttonWidth = 80;
                const gap = 10;
                searchInputField.style.width = `${Math.max(50, panelWidth - 290 - buttonWidth - gap)}px`; // Минимальная ширина 50px
                searchButton.style.width = `${buttonWidth}px`;
                searchButton.style.flexShrink = `0`; // Запрещаем сжатие
                searchButton.style.boxSizing = `border-box`; // Учитываем padding и border
            }
        }
        //------------- Обновляем позицию и ширину .input-container  ----------------- //
        const inputContainer = panel.querySelector('.input-container');
        if (inputContainer) {
            inputContainer.style.bottom = `${Math.max(minBottom - verticalGap, (baseBottom - verticalGap) * (panelHeight / 735)) + 31}px`; // Поднимаем на 31px
            inputContainer.style.left = `10px`;
            inputContainer.style.width = `${Math.max(200, panelWidth - 222)}px`; // Минимальная ширина 200px
            inputContainer.classList.toggle('hidden', isNarrow);
            const platformSelect = inputContainer.querySelector('#platform-select');
            const addInput = inputContainer.querySelector('#add-input');
            const addButton = inputContainer.querySelector('#add-button');
            if (platformSelect && addInput && addButton) {
                const selectWidth = 150;
                const buttonWidth = 80;
                const gap = 10;
                platformSelect.style.width = `${selectWidth}px`;
                addButton.style.width = `${buttonWidth}px`;
                addButton.style.flexShrink = `0`; // Запрещаем сжатие
                addButton.style.boxSizing = `border-box`; // Учитываем padding и border
                addInput.style.width = `${Math.max(50, panelWidth - 180 - selectWidth - buttonWidth - 2 * gap)}px`; // Минимальная ширина 50px
            }
        }
        //------------- Обновляем позицию и ширину .hue-rotate-container
        const hueRotateContainer = panel.querySelector('.hue-rotate-container');
        if (hueRotateContainer) {
            inputContainer.style.bottom = `${Math.max(minBottom - 2 * verticalGap, (baseBottom - 2 * verticalGap) * (panelHeight / 735)) + 10}px`; // Ниже на 20px
            hueRotateContainer.style.left = `155px`;
            hueRotateContainer.style.width = `200px`;
            hueRotateContainer.classList.toggle('hidden', isNarrow);
        }
        //------------- Обновляем позицию и размеры .button-container ----------------- //
        const buttonContainer = panel.querySelector('.button-container');
        if (buttonContainer) {
            const reservedHeight = 250; // Синхронизируем с #blocked-emotes-list
            const maxButtonContainerWidth = 180; // 185 - 10px (right) - 10px (отступ от #blocked-emotes-list)
            buttonContainer.style.width = `${Math.max(180, Math.min(maxButtonContainerWidth, panelWidth * 0.25))}px`; // Ограничиваем ширину
            buttonContainer.style.height = `${Math.max(30, panelHeight - reservedHeight)}px`; // Такая же высота, как у #blocked-emotes-list
            buttonContainer.style.maxHeight = `calc(${panelHeight}px - 100px)`; // Сохраняем maxHeight
            buttonContainer.style.bottom = `${Math.max(100, 155 * (panelHeight / 735))}px`; // Сохраняем bottom
            buttonContainer.style.right = `10px`; // Позиционируем справа
            buttonContainer.style.top = `61px`; // Синхронизируем с #blocked-emotes-list
            buttonContainer.style.display = `flex`;
            buttonContainer.style.flexDirection = `column`;
            buttonContainer.style.gap = `30px`; // Сохраняем расстояние между кнопками
        }
        //------------- Обновляем позицию и ширину счетчика #counter ----------------- //
        const counter = panel.querySelector('#counter');
        if (counter) {
            counter.style.maxWidth = `${Math.min(660, 700 * (panelWidth / 750))}px`; // Увеличиваем на 35px
            counter.style.right = `10px`; // Позиция в правом углу
            counter.style.top = `10px`; // Позиция в верхнем углу
        }
        //------------- Обновляем размеры dragHandle ----------------- //
        const dragHandle = panel.querySelector('.drag-handle');
        if (dragHandle) {
            dragHandle.style.width = `${panelWidth - 6}px`; // Учитываем left: 3px
            dragHandle.style.height = `${panelHeight}px`; // Полная высота панели
        }
    }
    handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Предотвращаем перехват другими обработчиками
            isResizing = true;
            currentHandle = handle;
            startX = e.clientX;
            startY = e.clientY;
            const rect = panel.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            startLeft = rect.left;
            document.body.style.userSelect = 'none'; // Отключаем выделение текста
            console.log("[UI] Resizing started with handle:", handle.className);
        });
    });
    document.addEventListener('mousemove', (e) => {
        if (!isResizing)
            return;
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        const minWidth = 200;
        const minHeight = 200;
        const maxWidth = window.innerWidth - 20;
        const maxHeight = window.innerHeight - 20;
        // ------------------------------ Обработка изменения ширины ---------------------------------- //
        if (currentHandle.classList.contains('right')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + (e.clientX - startX)));
        }
        else if (currentHandle.classList.contains('left')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth - (e.clientX - startX)));
            newLeft = startLeft + (e.clientX - startX);
        }
        // ------------------------------ Обработка изменения высоты ---------------------------------- //
        if (currentHandle.classList.contains('bottom')) {
            newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + (e.clientY - startY)));
        }
        else if (currentHandle.classList.contains('top')) {
            newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight - (e.clientY - startY)));
            //------------- Не изменяем top панели
        }
        // ------------------------------ Обработка угловых ручек ---------------------------------- //
        if (currentHandle.classList.contains('top-left')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth - (e.clientX - startX)));
            newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight - (e.clientY - startY)));
            newLeft = startLeft + (e.clientX - startX);
        }
        else if (currentHandle.classList.contains('top-right')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + (e.clientX - startX)));
            newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight - (e.clientY - startY)));
        }
        else if (currentHandle.classList.contains('bottom-left')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth - (e.clientX - startX)));
            newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + (e.clientY - startY)));
            newLeft = startLeft + (e.clientX - startX);
        }
        else if (currentHandle.classList.contains('bottom-right')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + (e.clientX - startX)));
            newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + (e.clientY - startY)));
        }
        //------------- Ограничиваем позицию, чтобы панель не выходила за экран
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - newWidth));
        //------------- Применяем новые размеры и позицию
        panel.style.width = `${newWidth}px`;
        panel.style.height = `${newHeight}px`;
        panel.style.left = `${newLeft}px`;
        //------------- Не трогаем panel.style.top
        //------------- Обновляем размеры и позиции элементов
        updateChildElements();
        //------------- Сохраняем размеры и позицию
        setStorage('panelSize', { width: newWidth, height: newHeight });
        setStorage('panelPosition', { left: newLeft });
    });
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            currentHandle = null;
            document.body.style.userSelect = ''; //---- Восстанавливаем выделение текста
            console.log("[UI] Resizing stopped");
        }
    });
    //------------- Вызываем при инициализации, чтобы синхронизировать размеры и позиции
    updateChildElements();
}
// =============================== end of  makePanelResizable ============================== // 
// ========================================================================================= //
// ========================================================================================== //
// =========== функция и контейнер для перетаскивания панели makePanelDraggable ============= //
function makePanelDraggable(panel) {
    console.log("[UI] Setting up draggable panel...");
    let offsetX = 0, offsetY = 0, isDragging = false;
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.style.cssText = `
        width: ${panel.offsetWidth - 6}px;
        height: ${panel.offsetHeight}px;
        background: transparent;
        cursor: grab;
        position: absolute;
        top: 0px;
        left: 3px;
        z-index: -1;
        border-radius: 8px 8px 0px 0px;

        
 #control-panel,
.modal-content {
        position: fixed;
        background: #1f1f23;
        border-radius: 8px;
        z-index: 10000;
        min-width: 200px; /* Минимальная ширина */
        min-height: 100px; /* Минимальная высота */
        width: 750px; /* Начальная ширина */
        height: 730px; /* Начальная высота */
    }
    `;
    panel.appendChild(dragHandle);
    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
        dragHandle.style.cursor = 'grabbing';
        console.log("[UI] Dragging started");
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging)
            return;
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;
        panel.style.left = `${newLeft}px`;
        panel.style.top = `${newTop}px`;
        setStorage('panelPosition', { left: newLeft, top: newTop });
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            dragHandle.style.cursor = 'grab';
            console.log("[UI] Dragging stopped");
        }
    });
}
// =============================== end of  makePanelDraggable =============================== //
// ========================================================================================= //
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
// ================================================================================================ //
// ============== отвечает за привязку обработчиков событий bindButtonHandlers  ==================== //
// -------- обработчики событий к элементам управления и кнопкам в панели управления --------- //
// ================================ end of bindButtonHandlers ========================================== //
// ==================================================================================================== //
// ===================================================================================================== //
// ================== функция для получения эмодзи из тултипа getFfzTooltipEmotes ====================== //
function getFfzTooltipEmotes() {
    const tooltip = document.querySelector('.ffz__tooltip');
    if (!tooltip)
        return [];
    const imgs = Array.from(tooltip.querySelectorAll('img')).filter(img => img.classList.contains('chat-image') ||
        img.classList.contains('chat-line__message--emote') ||
        img.classList.contains('ffz-emote') ||
        img.classList.contains('seventv-emote') ||
        img.classList.contains('bttv-emote') ||
        img.classList.contains('twitch-emote') ||
        img.getAttribute('data-provider'));
    // Дедупликация по data-id+src
    const seen = new Set();
    const uniqueImgs = imgs.filter(img => {
        const key = (img.getAttribute('data-id') || '') + (img.src || '');
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
    return uniqueImgs.map(img => ({
        src: img.src,
        alt: img.getAttribute('alt') || img.getAttribute('data-emote-name') || '',
        platform: img.getAttribute('data-provider') || '',
        element: img,
        id: img.getAttribute('data-id') || ''
    }));
}
// ======================= end of getFfzTooltipEmotes ============================ //
// ============================================================================= //
// =========================================================================================== //
// ============= функция для поиска контейнера и эмодзи findEmoteContainerAndEmotes ========= //
// ============= Функция для поиска контейнера и эмодзи  ================================== //
// =============== в сообщении Twitch, SevenTV, BTTV и FFZ ================================ //
function findEmoteContainerAndEmotes(clickedImg) {
    const messageContainer = clickedImg.closest('.message, .chat-line__message, .chat-line__message-container, .ffz--inline, .modified-emote, .scaled-modified-emote, [class*="modified-emote"]') || clickedImg.parentElement || clickedImg;
    if (!messageContainer) {
        return [{
                src: clickedImg.src,
                alt: clickedImg.getAttribute('alt') || clickedImg.getAttribute('data-emote-name') || '',
                platform: clickedImg.getAttribute('data-provider') || '',
                element: clickedImg,
                id: clickedImg.getAttribute('data-id') || ''
            }];
    }
    // 1. Получаем основной смайл
    const mainEmote = getMainEmoteFromContainer(messageContainer);
    // 2. Получаем остальные смайлы (без основного)
    const otherImgs = Array.from(messageContainer.querySelectorAll('img')).filter(img => img !== mainEmote);
    // 3. Собираем итоговый список: сначала основной, потом остальные
    const allImgs = mainEmote ? [mainEmote, ...otherImgs] : otherImgs;
    // Дальше фильтруем по твоей логике (по видимости и нужным классам)
    const filtered = allImgs.filter(img => {
        const style = window.getComputedStyle(img);
        const isVisible = style.display !== 'none' && style.opacity !== '0' && img.offsetWidth > 0 && img.offsetHeight > 0;
        const isEmote = img.classList.contains('chat-image') ||
            img.classList.contains('chat-line__message--emote') ||
            img.classList.contains('ffz-emote') ||
            img.classList.contains('seventv-emote') ||
            img.classList.contains('bttv-emote') ||
            img.classList.contains('twitch-emote') ||
            img.classList.contains('modified-emote') ||
            img.classList.contains('scaled-modified-emote') ||
            img.getAttribute('data-provider');
        const isValidElement = img.isConnected; // Проверяем, что элемент всё ещё в DOM
        return img.src && isVisible && isEmote && isValidElement;
    });
    return filtered.map(img => ({
        src: img.src,
        alt: img.getAttribute('alt') || img.getAttribute('data-emote-name') || '',
        platform: img.getAttribute('data-provider') || '',
        element: img,
        id: img.getAttribute('data-id') || ''
    }));
}
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
// -------------- подсветка текста highlightText ------------------ //
const highlightCache = new Map();
function highlightText(text, term) {
    if (!term)
        return text;
    const cacheKey = `${text}:${term}`;
    if (highlightCache.has(cacheKey))
        return highlightCache.get(cacheKey);
    const lowerText = text.toLowerCase();
    const lowerTerm = term.toLowerCase();
    const index = lowerText.indexOf(lowerTerm);
    if (index === -1) {
        highlightCache.set(cacheKey, text);
        return text;
    }
    const before = text.slice(0, index);
    const match = text.slice(index, index + term.length);
    const after = text.slice(index + term.length);
    const result = `${before}<span class="highlight">${match}</span>${after}`;
    highlightCache.set(cacheKey, result);
    return result;
}
// ------------- Функция обновления списка заблокированных элементов в чате ----------- 
function updateBlockedEmotesList(blockedList, { blockedEmotes, blockedChannels, newlyAddedIds }, searchTerm = '') {
    console.log('[Content] Updating blocked list (virtualized)...', {
        blockedEmotesCount: blockedEmotes.length,
        blockedChannelsCount: blockedChannels.length,
        searchTerm
    });
    if (!blockedList) {
        console.error('[Content] Blocked list element not found');
        return;
    }
    // Проверяем, что данные не пусты
    if (!blockedEmotes || !blockedChannels) {
        console.error('[Content] Invalid blocked items data', { blockedEmotes, blockedChannels });
        blockedList.innerHTML = '<div>Error: Invalid data</div>';
        return;
    }
    const allItems = [
        ...blockedChannels.filter(item => item && item.id),
        ...blockedEmotes.filter(item => item && item.id)
    ];
    console.log('[Debug] allItems count:', allItems.length);
    if (allItems.length === 0) {
        console.warn('[Debug] No items to display');
        blockedList.innerHTML = '<div>No blocked items</div>';
        return;
    }
    let container = blockedList.querySelector('.blocked-emotes-list-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'blocked-emotes-list-container';
        blockedList.appendChild(container);
        console.log('[Debug] Created blocked-emotes-list-container');
    }
    // Динамическая высота элемента
    const getItemHeight = () => {
        const sampleLi = document.createElement('li');
        sampleLi.className = 'blocked-item';
        sampleLi.style.visibility = 'hidden';
        sampleLi.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>Test</span>
                <div class="date-delete-group">
                    <span class="data-time">Test</span>
                    <button class="delete-button">Delete</button>
                </div>
            </div>
            <span>Test</span>
        `;
        container.appendChild(sampleLi);
        const height = sampleLi.offsetHeight || 60;
        sampleLi.remove();
        return height;
    };
    const itemHeight = getItemHeight();
    console.log('[Debug] Item height', itemHeight);
    const totalHeight = allItems.length * itemHeight;
    container.style.height = `${totalHeight}px`;
    const lastItem = allItems.length > 0 ? allItems.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
    }, allItems[0]) : null;
    console.log('[Debug] Last item', lastItem ? { id: lastItem.id, emoteName: lastItem.emoteName, date: lastItem.date } : null);
    // Проверка превью-контейнера
    let previewContainer = document.querySelector('.emote-preview-container');
    if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.className = 'emote-preview-container';
        Object.assign(previewContainer.style, {
            position: 'absolute',
            zIndex: '10000',
            display: 'none',
            background: 'rgb(16, 79, 83)',
            padding: '5px',
            borderRadius: '4px',
            pointerEvents: 'none',
            maxWidth: '150px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        });
        document.body.appendChild(previewContainer);
        console.log('[Debug] Created emote-preview-container');
    }
    function renderVisibleItems() {
        const scrollTop = blockedList.scrollTop;
        const viewportHeight = blockedList.clientHeight;
        const buffer = 5;
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
        const endIndex = Math.min(allItems.length - 1, Math.ceil((scrollTop + viewportHeight) / itemHeight) + buffer);
        console.log('[Debug] Render indices', { scrollTop, viewportHeight, startIndex, endIndex });
        container.innerHTML = '';
        console.log('[Debug] Cleared container');
        if (startIndex > endIndex) {
            console.warn('[Debug] Invalid indices, no items rendered', { startIndex, endIndex });
            return;
        }
        for (let i = startIndex; i <= endIndex; i++) {
            const item = allItems[i];
            if (!item || !item.id) {
                console.warn('[Debug] Invalid item at index', i, item);
                continue;
            }
            const li = document.createElement('li');
            li.className = `blocked-item ${newlyAddedIds.has(item.id) ? 'new-item' : ''} ${item.id === lastItem?.id ? 'last-item-highlight' : ''}`;
            li.dataset.id = item.id;
            li.style.position = 'absolute';
            li.style.top = `${i * itemHeight}px`;
            li.style.width = '100%';
            li.style.height = `${itemHeight}px`;
            let titleText = '';
            let infoText = '';
            if (item.platform === 'TwitchChannel') {
                titleText = `TwitchChannel > channelName: ${item.channelName || item.name || item.emoteName || 'Unknown'}`;
                infoText = `(emoteName: ${item.emoteName || 'Unknown'})`;
            }
            else {
                titleText = `${item.platform} > ${item.emoteName || 'Unknown'}`;
                infoText = `<a class="emote-link" href="${item.emoteUrl || '#'}" target="_blank" style="color:rgb(34, 184, 59); text-decoration: underline;">(url: ${item.emoteUrl || 'Unknown'})</a>`;
            }
            titleText = highlightText(titleText, searchTerm);
            infoText = highlightText(infoText, searchTerm);
            li.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${titleText}</span>
                    <div class="date-delete-group">
                        <span class="data-time">${item.date ? new Date(item.date).toLocaleString('en-GB') : 'N/A'}</span>
                        <button class="delete-button">Delete</button>
                    </div>
                </div>
                <span>${infoText}</span>
            `;
            li.querySelector('.delete-button').onclick = () => {
                removeEmoteOrChannel(item.id);
            };
            // Обработчики для превью
            if (item.emoteUrl && item.platform !== 'TwitchChannel') {
                const emoteLink = li.querySelector('.emote-link');
                if (emoteLink) {
                    emoteLink.addEventListener('mouseover', (e) => {
                        if (!item.emoteUrl) {
                            console.warn('[Debug] No emoteUrl for preview', item);
                            return;
                        }
                        const img = new Image();
                        img.src = item.emoteUrl;
                        img.alt = 'Emote Preview';
                        img.style.maxWidth = '100px';
                        img.style.maxHeight = '100px';
                        img.onerror = () => {
                            previewContainer.innerHTML = '<span style="color: white; font-size: 12px;">Не удалось загрузить изображение</span>';
                            previewContainer.style.display = 'block';
                            console.warn('[Debug] Failed to load emote preview', item.emoteUrl);
                        };
                        img.onload = () => {
                            previewContainer.innerHTML = '';
                            previewContainer.appendChild(img);
                            previewContainer.style.display = 'block';
                            const x = Math.min(e.clientX + 10, window.innerWidth - 150);
                            const y = Math.min(e.clientY + 10, window.innerHeight - 150);
                            previewContainer.style.left = `${x}px`;
                            previewContainer.style.top = `${y}px`;
                            console.log('[Debug] Showing preview for', item.emoteUrl);
                        };
                    });
                    emoteLink.addEventListener('mouseout', () => {
                        previewContainer.style.display = 'none';
                        previewContainer.innerHTML = '';
                        console.log('[Debug] Hiding preview');
                    });
                    emoteLink.addEventListener('mousemove', (e) => {
                        const x = Math.min(e.clientX + 10, window.innerWidth - 150);
                        const y = Math.min(e.clientY + 10, window.innerHeight - 150);
                        previewContainer.style.left = `${x}px`;
                        previewContainer.style.top = `${y}px`;
                    });
                }
            }
            container.appendChild(li);
            console.log('[Debug] Rendered item', { index: i, id: item.id, top: li.style.top });
            if (item.id === lastItem?.id) {
                setTimeout(() => {
                    li.classList.remove('last-item-highlight');
                    console.log(`[Content] Highlight removed from: ${item.emoteName || item.id}`);
                }, 5000);
            }
        }
        console.log('[Debug] Total items in DOM', container.querySelectorAll('li').length);
    }
    renderVisibleItems();
    blockedList.removeEventListener('scroll', renderVisibleItems);
    window.removeEventListener('resize', renderVisibleItems);
    let scrollTimeout;
    const debouncedRender = () => {
        if (scrollTimeout)
            clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            console.log('[Debug] Debounced render triggered');
            renderVisibleItems();
        }, 100);
    };
    blockedList.addEventListener('scroll', debouncedRender);
    window.addEventListener('resize', debouncedRender);
}
// ======================= end of Функция обновления Списка  updateBlockedEmotesList   ====================== //
// ========================================================================================================== //
// ========================================================================================================= //
// ===============================  Функция updateBannedСhatList =========================================== // 
function updateBannedСhatList(bannedСhatList, { bannedKeywords = [], bannedUsers = [], newlyAddedIds = new Set(), lastKeyword = null }, searchTerm = '') {
    console.log('[Content] Updating banned chat list...', {
        keywordsCount: bannedKeywords.length,
        usersCount: bannedUsers.length,
        searchTerm,
        lastKeywordId: lastKeyword?.id,
        timestamp: performance.now()
    });
    if (!bannedСhatList) {
        console.error('[Content] Banned chat list element not found');
        return;
    }
    // Находим или создаём контейнер .banned-сhat-list-container
    let container = bannedСhatList.querySelector('.banned-сhat-list-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'banned-сhat-list-container';
        bannedСhatList.appendChild(container);
        console.log('[Debug] Created banned-сhat-list-container');
    }
    // Устанавливаем стили контейнера
    container.style.position = 'relative';
    container.style.padding = '0';
    // Динамическая высота элемента
    const getItemHeight = () => {
        const sampleLi = document.createElement('li');
        sampleLi.className = 'keyword-item';
        sampleLi.style.visibility = 'hidden';
        sampleLi.innerHTML = `
            <div class="keyword-content">
                <span>Test</span>
                <div class="date-delete-group">
                    <span class="data-time">Test</span>
                    <button class="delete-button">Delete</button>
                </div>
            </div>
            <span>Test</span>
        `;
        container.appendChild(sampleLi);
        const height = sampleLi.offsetHeight || 60;
        sampleLi.remove();
        return height;
    };
    const itemHeight = getItemHeight();
    // Собираем все элементы
    let allItems = [
        ...bannedKeywords.map(item => ({ ...item, source: 'keyword' })),
        ...bannedUsers.map(item => ({ ...item, source: 'selected' }))
    ].filter(item => item && item.id && item.text);
    if (!Array.isArray(allItems)) {
        console.error('[Content] Invalid items array:', allItems);
        container.innerHTML = '<div>No items available</div>';
        bannedСhatList.scrollTop = 0;
        return;
    }
    // Фильтрация уже выполнена в filterBannedChatList, используем переданные данные
    let filteredItems = allItems;
    // Устанавливаем высоту контейнера
    const totalHeight = filteredItems.length * itemHeight;
    container.style.height = `${totalHeight}px`;
    let isRendering = false;
    function renderVisibleItems() {
        if (isRendering) {
            console.log('[renderVisibleItems] Rendering already in progress, skipping');
            return;
        }
        isRendering = true;
        const scrollTop = bannedСhatList.scrollTop;
        const viewportHeight = bannedСhatList.clientHeight;
        const buffer = 5;
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
        const endIndex = Math.min(filteredItems.length - 1, Math.ceil((scrollTop + viewportHeight) / itemHeight) + buffer);
        console.log('[renderVisibleItems] Rendering items:', {
            startIndex,
            endIndex,
            total: filteredItems.length,
            scrollTop,
            viewportHeight,
            itemHeight
        });
        // Очищаем контейнер перед рендерингом
        container.innerHTML = '';
        // Проверяем, есть ли элементы для рендеринга
        if (filteredItems.length === 0) {
            container.innerHTML = '<div>' + (searchTerm ? 'No items match the search' : 'No items added') + '</div>';
            isRendering = false;
            return;
        }
        // Проверяем валидность индексов
        if (startIndex > endIndex || startIndex >= filteredItems.length) {
            console.warn('[renderVisibleItems] Invalid indices, skipping render:', { startIndex, endIndex });
            isRendering = false;
            return;
        }
        const renderTimestamp = performance.now();
        for (let i = startIndex; i <= endIndex; i++) {
            const item = filteredItems[i];
            if (!item || !item.id) {
                console.warn('[Debug] Invalid item at index:', i, item);
                continue;
            }
            let li = document.createElement('li');
            li.className = `list-item keyword-item ${newlyAddedIds.has(item.id) ? 'new-item' : ''}`;
            li.dataset.id = item.id;
            li.style.position = 'absolute';
            li.style.top = `${i * itemHeight}px`;
            li.style.width = '100%';
            const displayText = item.isNickname ? item.text : item.text;
            const titleText = highlightText(`${item.isNickname ? 'Nickname' : 'Keyword'}: ${displayText}`, searchTerm);
            const infoText = highlightText(`(${item.isNickname ? 'User' : item.isPhrase ? 'Phrase' : 'Word'})`, searchTerm);
            const dateTimeText = item.date ? new Date(item.date).toLocaleString('en-US') : 'N/A';
            li.innerHTML = `
                <div class="keyword-content" style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="item-text">${titleText}</span>
                    <div class="date-delete-group">
                        <span class="data-time">${dateTimeText}</span>
                        <button class="delete-button" data-render-id="${renderTimestamp}">Delete</button>
                    </div>
                </div>
                <span class="item-text">${infoText}</span>
            `;
            const deleteButton = li.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => {
                console.log('[renderVisibleItems] Delete button clicked:', { id: item.id, source: item.source });
                try {
                    removeKeyWordOrbannedUser(item.id, item.source);
                }
                catch (e) {
                    console.error('[renderVisibleItems] Error removing item:', e);
                    window.Notifications?.showPanelNotification?.('Error removing item', 5000, false);
                }
            }, { once: true });
            container.appendChild(li);
        }
        console.log('[Debug] Total items in DOM:', container.children.length);
        isRendering = false;
    }
    // Первоначальный рендеринг
    renderVisibleItems();
    // Удаляем старые обработчики
    bannedСhatList.removeEventListener('scroll', debouncedRender);
    window.removeEventListener('resize', debouncedRender);
    let scrollTimeout;
    let lastScrollTop = bannedСhatList.scrollTop;
    function debouncedRender() {
        if (scrollTimeout)
            clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const currentScrollTop = bannedСhatList.scrollTop;
            if (Math.abs(currentScrollTop - lastScrollTop) < itemHeight / 2) {
                console.log('[Debug] Scroll position unchanged, skipping render');
                return;
            }
            lastScrollTop = currentScrollTop;
            console.log('[Debug] Debounced render triggered');
            renderVisibleItems();
        }, 100);
    }
    bannedСhatList.addEventListener('scroll', debouncedRender, { passive: true });
    window.addEventListener('resize', debouncedRender, { passive: true });
    console.log('[updateBannedСhatList] UI updated, items:', filteredItems.length);
}
// ================= end of Функция updateBannedСhatList ======================= //
// ============================================================================================================ //
// ============================================================================================================ //
// ============== Функция сортировки заблокированных эмодзи каналов , смайлов =============================== //
function sortblockedEmotes(criteria, order) {
    console.log("[Content] Sorting by:", criteria, order);
    // Сортировка для blockedEmotes и blockedChannels
    const sortFunc = (a, b) => {
        let comparison = 0;
        if (criteria === 'name') {
            const nameA = a.platform === 'TwitchChannel' ? (a.channelName || a.emoteName || '') : (a.emoteName || '');
            const nameB = b.platform === 'TwitchChannel' ? (b.channelName || b.emoteName || '') : (b.emoteName || '');
            comparison = nameA.localeCompare(nameB);
        }
        else if (criteria === 'platform') {
            comparison = (a.platform || '').localeCompare(b.platform || '');
        }
        else if (criteria === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        }
        return order === 'asc' ? comparison : -comparison;
    };
    blockedEmotes.sort(sortFunc);
    blockedChannels.sort(sortFunc);
    // Сортировка для bannedKeywords и bannedUsers
    const sortKeywordFunc = (a, b) => {
        let comparison = 0;
        if (criteria === 'name') {
            comparison = (a.text || '').localeCompare(b.text || '');
        }
        else if (criteria === 'platform') {
            comparison = (a.text || '').localeCompare(b.text || '');
        }
        else if (criteria === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        }
        return order === 'asc' ? comparison : -comparison;
    };
    const bannedKeywords = getStorage('bannedKeywords', []);
    const bannedUsers = getStorage('bannedUsers', []);
    bannedKeywords.sort(sortKeywordFunc);
    bannedUsers.sort(sortKeywordFunc);
    setStorage('bannedKeywords', bannedKeywords);
    setStorage('bannedUsers', bannedUsers);
    // Обновляем списки без автоматической прокрутки
    if (uiElements?.blockedList) {
        updateBlockedEmotesList(uiElements.blockedList, getBlockedItems());
    }
    if (uiElements?.bannedСhatList) {
        updateBannedСhatList(uiElements.bannedСhatList, {
            bannedKeywords: getStorage('bannedKeywords', []),
            bannedUsers: getStorage('bannedUsers', []),
            newlyAddedIds: new Set(),
            lastKeyword: null
        }, '', criteria, order);
    }
}
// ============================================================================================================ //
// ============================  Функция сортировки для banned-сhat-list   ==================================== //
function sortBannedChatItems(criteria, order) {
    console.log("[Content] Sorting banned chat items by:", criteria, order);
    // =========== Получаем данные из storage
    const bannedKeywords = getStorage('bannedKeywords', []);
    const bannedUsers = getStorage('bannedUsers', []);
    // =========== Функция сортировки для bannedKeywords и bannedUsers
    const sortFunc = (a, b) => {
        let comparison = 0;
        if (criteria === 'name') {
            comparison = (a.text || '').localeCompare(b.text || '');
        }
        else if (criteria === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        }
        return order === 'asc' ? comparison : -comparison;
    };
    // =========== Сортируем списки
    bannedKeywords.sort(sortFunc);
    bannedUsers.sort(sortFunc);
    // =========== Сохраняем отсортированные данные
    setStorage('bannedKeywords', bannedKeywords);
    setStorage('bannedUsers', bannedUsers);
    // =========== Обновляем отображение второго списка
    if (uiElements?.bannedСhatList) {
        updateBannedСhatList(uiElements.bannedСhatList, {
            bannedKeywords,
            bannedUsers,
            newlyAddedIds: new Set(),
            lastKeyword: null
        }, '', criteria, order);
    }
    else {
        console.warn("[Content] bannedСhatList element not found for update");
    }
}
// =========== Функция для прокрутки к последнему элементу в banned-сhat-list
function goToLastBannedChatItem() {
    const bannedChatListContainer = document.querySelector('#banned-сhat-list .banned-сhat-list-container');
    if (bannedChatListContainer) {
        const lastItem = bannedChatListContainer.lastElementChild;
        if (lastItem) {
            lastItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            console.log("[UI] Scrolled to last banned chat item");
        }
        else {
            console.log("[UI] No items found in banned chat list to scroll to");
        }
    }
    else {
        console.warn("[UI] Banned chat list container not found");
    }
}
// ========================== end of Функция сортировки заблокированных эмодзи ============================ //
// =========================================================================================================== //
// ======================================================================================================== //
// ==================== Функция прокрутки к последнему добавленному элементу ============================ //
function goToLastAddedItem() {
    console.log("[Content] Going to last added item...");
    const blockedList = uiElements?.blockedList || document.getElementById('blocked-emotes-list');
    if (!blockedList) {
        console.warn("[Content] Blocked list element not found");
        return;
    }
    const allItems = [...blockedChannels, ...blockedEmotes];
    if (allItems.length === 0) {
        console.log("[Content] Список пуст, некуда прокручивать");
        return;
    }
    // Находим элемент с самой поздней датой
    const lastItem = allItems.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
    }, allItems[0]);
    console.log('[Debug] Last item', { id: lastItem.id, emoteName: lastItem.emoteName, date: lastItem.date });
    // Вычисляем индекс последнего элемента
    const lastItemIndex = allItems.findIndex(item => item.id === lastItem.id);
    if (lastItemIndex === -1) {
        console.warn("[Content] Последний элемент не найден в списке");
        return;
    }
    // Получаем динамическую высоту элемента
    const getItemHeight = () => {
        const container = blockedList.querySelector('.blocked-emotes-list-container') || blockedList;
        const sampleLi = document.createElement('li');
        sampleLi.className = 'blocked-item';
        sampleLi.style.visibility = 'hidden';
        sampleLi.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>Test</span>
                <div class="date-delete-group">
                    <span class="data-time">Test</span>
                    <button class="delete-button">Delete</button>
                </div>
            </div>
            <span>Test</span>
        `;
        container.appendChild(sampleLi);
        const height = sampleLi.offsetHeight || 60;
        sampleLi.remove();
        return height;
    };
    const itemHeight = getItemHeight();
    console.log('[Debug] Item height in goToLastAddedItem', itemHeight);
    const lastItemPosition = lastItemIndex * itemHeight;
    const viewportHeight = blockedList.clientHeight;
    const container = blockedList.querySelector('.blocked-emotes-list-container') || blockedList;
    const containerHeight = parseFloat(container.style.height) || allItems.length * itemHeight;
    // Прокручиваем к последнему элементу, центрируя его
    const scrollPosition = Math.max(0, lastItemPosition - (viewportHeight / 2) + (itemHeight / 2));
    // Обновляем список перед прокруткой
    updateBlockedEmotesList(blockedList, getBlockedItems());
    // Ждем рендеринга и применяем прокрутку
    setTimeout(() => {
        blockedList.scrollTop = scrollPosition;
        console.log('[Debug] Scroll position set', {
            lastItemIndex,
            lastItemPosition,
            scrollPosition,
            viewportHeight,
            containerHeight,
            maxScroll: containerHeight - viewportHeight
        });
        // Проверяем наличие элемента
        const lastElement = blockedList.querySelector(`[data-id="${lastItem.id}"]`);
        console.log('[Debug] Last element search', { id: lastItem.id, found: !!lastElement });
        if (lastElement) {
            lastElement.classList.add('last-item-highlight');
            console.log(`[Content] Подсвечено: ${lastItem.emoteName} (ID: ${lastItem.id})`);
            setTimeout(() => {
                lastElement.classList.remove('last-item-highlight');
                console.log(`[Content] Подсветка убрана с элемента: ${lastItem.emoteName}`);
            }, 5000);
        }
        else {
            console.warn("[Content] Элемент не отрендерился после прокрутки", { id: lastItem.id });
            // Принудительный рендеринг с повторной прокруткой
            updateBlockedEmotesList(blockedList, getBlockedItems());
            setTimeout(() => {
                const retryElement = blockedList.querySelector(`[data-id="${lastItem.id}"]`);
                if (retryElement) {
                    blockedList.scrollTop = scrollPosition;
                    retryElement.classList.add('last-item-highlight');
                    console.log(`[Content] Подсвечено после повторного рендеринга: ${lastItem.emoteName}`);
                    setTimeout(() => {
                        retryElement.classList.remove('last-item-highlight');
                    }, 5000);
                }
                else {
                    console.error("[Content] Элемент всё ещё не найден", { id: lastItem.id });
                }
            }, 150);
        }
    }, 150);
    console.log(`[Content] Прокрутка инициирована к элементу: ${lastItem.emoteName} (Index: ${lastItemIndex}, Date: ${lastItem.date})`);
}
// ================= end of Функция прокрутки к последнему добавленному элементу ==================== //
// ====================================================================================== //
// ====================================================================================== //
// ================ счетчик  Функция обновления счетчика ==================== //
function updateCounter(counter) {
    if (!counter) {
        console.error("[Content] Counter element not found");
        return;
    }
    const blockedChannels = getStorage('blockedChannels', []);
    const blockedEmotes = getStorage('blockedEmotes', []);
    const bannedKeywords = getStorage('bannedKeywords', []);
    const bannedUsers = getStorage('bannedUsers', []);
    const twitchCount = blockedChannels.length;
    const bttvCount = blockedEmotes.filter(e => e.platform === 'bttTV').length;
    const tv7Count = blockedEmotes.filter(e => e.platform === '7tv').length;
    const ffzCount = blockedEmotes.filter(e => e.platform === 'ffz').length;
    const chatBannedCount = bannedKeywords.length;
    const totalCount = twitchCount + bttvCount + tv7Count + ffzCount + chatBannedCount;
    counter.innerText = `Twitch: ${twitchCount} | BTTV: ${bttvCount} | 7TV: ${tv7Count} | FFZ: ${ffzCount} | Chat Banned items: ${chatBannedCount} | Total: ${totalCount}`;
    counter.offsetHeight; // Форсируем перерисовку
}
// ================= end of Функция обновления счетчика ==================== //
// ====================================================================================== //
// ================================================================================================ //
// =============== Функция фильтрации и поиска списка заблокированных элементов ================= //
let currentList = 'blocked'; // глобальный список для хранения текущего списка (заблокированные эмодзи или ключевые слова)
function filterBlockedList(searchTerm) {
    console.log("[Content] Filtering blocked list with term:", searchTerm);
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    if (!uiElements || !uiElements.blockedList) {
        console.error("[Content] UI elements missing for filtering");
        return;
    }
    // Filter blocked emotes and channels
    const allItems = [...blockedChannels, ...blockedEmotes];
    console.log("[Content] Loaded blocked items:", allItems.length);
    const filteredItems = lowerSearchTerm
        ? allItems.filter(item => {
            const text = [
                item.emoteName,
                item.platform,
                item.channelName || '',
                item.prefix || '',
                item.emoteUrl || ''
            ].join(' ').toLowerCase();
            return text.includes(lowerSearchTerm);
        })
        : allItems;
    const lastItem = filteredItems.length > 0 ? filteredItems.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
    }, filteredItems[0]) : null;
    updateBlockedEmotesList(uiElements.blockedList, {
        blockedEmotes: filteredItems.filter(item => item.platform !== 'TwitchChannel'),
        blockedChannels: filteredItems.filter(item => item.platform === 'TwitchChannel'),
        newlyAddedIds,
        lastItem
    }, lowerSearchTerm);
    console.log("[Content] Filtered blocked items list:", filteredItems.length);
    if (uiElements.resetSearchButton) {
        uiElements.resetSearchButton.disabled = !lowerSearchTerm;
        console.log("[Content] Reset search button disabled:", !lowerSearchTerm);
    }
    else {
        console.warn("[Content] resetSearchButton not found");
    }
}
function filterBannedChatList(searchTerm) {
    console.log("[Content] Filtering banned chat list with term:", searchTerm);
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    if (!uiElements || !uiElements.bannedСhatList) {
        console.error("[Content] UI elements missing for filtering banned chat list");
        return;
    }
    // Сбрасываем позицию скролла при новом поиске
    uiElements.bannedСhatList.scrollTop = 0;
    // Загружаем данные из localStorage
    const bannedKeywords = getStorage('bannedKeywords', []);
    const bannedUsers = getStorage('bannedUsers', []);
    console.log("[Content] Loaded banned items:", {
        keywordsCount: bannedKeywords.length,
        usersCount: bannedUsers.length
    });
    // Объединяем ключевые слова и пользователей
    const allItems = [
        ...bannedKeywords.map(item => ({ ...item, source: 'keyword' })),
        ...bannedUsers.map(item => ({ ...item, source: 'selected' }))
    ].filter(item => item && item.id && item.text);
    // Фильтруем элементы по поисковому запросу
    const filteredItems = lowerSearchTerm
        ? allItems.filter(item => {
            const text = [
                item.text || '',
                item.isNickname ? 'selected' : item.isPhrase ? 'phrase' : 'keyword'
            ].join(' ').toLowerCase();
            return text.includes(lowerSearchTerm);
        })
        : allItems;
    console.log("[Content] Filtered banned chat items:", filteredItems.length);
    // Находим последний добавленный элемент
    const lastItem = filteredItems.length > 0 ? filteredItems.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
    }, filteredItems[0]) : null;
    // Обновляем список с отфильтрованными данными
    updateBannedСhatList(uiElements.bannedСhatList, {
        bannedKeywords: filteredItems.filter(item => item.source === 'keyword'),
        bannedUsers: filteredItems.filter(item => item.source === 'selected'),
        newlyAddedIds: new Set(), // Очищаем для предотвращения подсветки старых элементов
        lastKeyword: lastItem
    }, lowerSearchTerm);
    // Обновляем состояние кнопки сброса поиска
    if (uiElements.resetSearchButton) {
        uiElements.resetSearchButton.disabled = !lowerSearchTerm;
        console.log("[Content] Reset search button disabled:", !lowerSearchTerm);
    }
    else {
        console.warn("[Content] resetSearchButton not found");
    }
}
// ============== end of Функция для фильтрации списка заблокированных элементов =================== //
// =========================================================================================================== //
// ================================================================================================== //
// ================ Функция фильтрации и поиска списка searchBannedChatList ========================= //
// ================= End of Функция фильтрации и поиска списка searchBannedChatList ================== //
// =========================================================================================================== //
// =========================================================================================================== //
// ==================== Функция для отображения графика статистики chart.js  ========================= //
function showStatsChart(canvas) {
    if (!canvas) {
        console.warn("[Content] Stats chart canvas not found");
        return;
    }
    const currentTheme = uiElements?.themeSelect?.value || 'default';
    const isLightTheme = currentTheme === 'lightMode';
    // Цвета для платформ
    const platformColors = {
        TwitchChannel: {
            background: isLightTheme ? 'rgba(145, 70, 255, 0.8)' : 'rgba(145, 70, 255, 0.6)',
            border: 'rgb(227, 218, 240)'
        },
        '7tv': {
            background: isLightTheme ? ' #1b756e' : ' #1b756e',
            border: ' #68cfa8'
        },
        bttTV: {
            background: isLightTheme ? 'rgba(255, 87, 51, 0.8)' : 'rgba(255, 87, 51, 0.6)',
            border: 'rgb(233, 156, 69)'
        },
        ffz: {
            background: isLightTheme ? 'rgba(77, 68, 80, 0.84)' : 'rgba(0, 0, 0, 0.6)',
            border: 'rgb(96, 221, 221)'
        }
    };
    // Данные для графика
    const platforms = ['TwitchChannel', '7tv', 'bttTV', 'ffz'];
    const emoteCounts = platforms.map(platform => blockedEmotes.filter(e => e.platform === platform).length +
        blockedChannels.filter(c => c.platform === platform).length);
    // Формируем цвета для графика
    const backgroundColors = platforms.map(platform => platformColors[platform].background);
    const borderColors = platforms.map(platform => platformColors[platform].border);
    // Цвета текста и сетки в зависимости от темы
    const textColor = isLightTheme ? ' #333333' : ' #FFFFFF';
    const gridColor = isLightTheme ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    const borderGridColor = isLightTheme ? ' #CCCCCC' : ' #444444';
    // Уничтожаем существующий график
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    // Создаём новый график
    canvas.chart = new Chart(canvas, {
        type: 'bar', // Можно заменить на 'line', 'pie', и т.д.
        data: {
            labels: platforms,
            datasets: [{
                    label: 'Blocked Items by Platform',
                    data: emoteCounts,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 2
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Blocked Emotes and Channels by Platform',
                    color: textColor,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: gridColor,
                        borderColor: borderGridColor
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        font: {
                            size: 12
                        },
                        stepSize: 1
                    },
                    grid: {
                        color: gridColor,
                        borderColor: borderGridColor
                    }
                }
            }
        }
    });
    console.log("[Content] Stats chart rendered with data:", emoteCounts);
}
// ============================== end of showStatsChart charts js ============================================ //
// =========================================================================================================== //
// =========================================================================================================== //
// ==================== Функция для анимации открытия и закрытия модального окна ============================= //
function animateModalOpen(modal, callback) {
    console.log("[UI] Opening modal with animation...");
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
        modal.classList.add('active');
        if (callback)
            callback();
    });
}
function animateModalClose(modal, callback) {
    console.log("[UI] Animating modal close...");
    modal.style.transition = 'opacity 0.3s';
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        if (callback)
            callback();
        //---------- Убрали вызов updateCounter, так как он вызывается в importData или importBlockedItems
        console.log("[UI] Modal closed");
    }, 300);
}
// =============================== end of animateModalOpen/Close ============================================= //
// =========================================================================================================== //
// =========================================================================================================== //
// =========================================================================================================== //
// ==================== Функция для анимации открытия модального окна charts js =============================== //
function animateModalOpen(modal, callback) {
    modal.style.display = 'flex'; // Показываем окно
    modal.style.opacity = '0'; // Начальная прозрачность
    modal.style.transform = 'translateY(-100%)'; // Начальное положение выше экрана
    const duration = 300; // Длительность анимации в миллисекундах
    const startTime = performance.now();
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Прогресс от 0 до 1
        //------------- Используем функцию ease-in-out для плавности
        const ease = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        modal.style.opacity = ease; // Прозрачность от 0 до 1
        modal.style.transform = `translateY(${(1 - ease) * -100}%)`; // Движение сверху вниз
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
        else {
            modal.style.opacity = '1';
            modal.style.transform = 'translateY(0)';
            modal.classList.add('visible');
            if (callback)
                callback(); // Вызываем callback (например, для рендера графика)
        }
    }
    requestAnimationFrame(animate);
}
// ============================================================================================================= //
// ============================ анимация chart js модального окна animateModalOpen ============================= //
// ============================================================================================================= //
// Функция для анимации закрытия модального окна
function animateModalClose(modal, callback) {
    modal.style.opacity = '1'; // Начальная прозрачность
    modal.style.transform = 'translateY(0)'; // Начальное положение
    const duration = 300; // Длительность анимации в миллисекундах
    const startTime = performance.now();
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Прогресс от 0 до 1
        // Используем функцию ease-in-out для плавности
        const ease = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        modal.style.opacity = 1 - ease; // Прозрачность от 1 до 0
        modal.style.transform = `translateY(${ease * -100}%)`; // Движение вверх
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
        else {
            modal.style.display = 'none'; // Скрываем после анимации
            modal.classList.remove('visible');
            if (callback)
                callback();
        }
    }
    requestAnimationFrame(animate);
}
// ==================== end of анимация chart js модального окна animateModalClose ============================ //
// ============================================================================================================== //
// ============================================================================================================= //
// ========================= Функция очистки всех заблокированных элементов ================================== //
function clearAllBlockedItems(counter) {
    debugger; // Остановит выполнение
    console.log("[Content] Clearing all blocked items...");
    // 1. Очищаем данные
    blockedEmotes = [];
    blockedChannels = [];
    blockedEmoteIDs.clear();
    blockedChannelIDs.clear();
    newlyAddedIds.clear();
    setStorage('blockedEmotes', blockedEmotes);
    setStorage('blockedChannels', blockedChannels);
    processedEmotes = new WeakMap();
    // 2. Проверяем, что данные пусты
    if (blockedEmotes.length === 0 && blockedChannels.length === 0) {
        console.log("[Content] Data cleared successfully");
    }
    else {
        console.error("[Content] Failed to clear data", { blockedEmotes, blockedChannels });
        return;
    }
    // 3. Обновляем UI
    const blockedList = uiElements?.blockedList || document.getElementById('blocked-emotes-list');
    if (blockedList) {
        console.log("[Content] Clearing blocked list in UI...");
        blockedList.innerHTML = ''; // Очищаем список
        requestAnimationFrame(() => {
            blockedList.offsetHeight; // Форсируем reflow
            console.log("[Content] Blocked list cleared in DOM");
        });
    }
    else {
        console.error("[Content] Blocked list element not found in DOM");
    }
    // Перезапускаем обработку эмодзи
    toggleEmotesInChat(true);
    // 4. Обновляем счетчик
    updateCounter(counter);
    console.log("[Content] All blocked items cleared and UI updated");
}
// ================== end of Функция очистки списка заблокированных элементов ==================== //
// ====================================================================================== //
// ====================================================================================== //
// ================== Функция экспорта заблокированных элементов ==================== //
function exportBlockedItems(type = 'both') {
    console.log(`[Content] Exporting ${type}...`);
    try {
        const blockedEmotes = getStorage('blockedEmotes', []);
        const blockedChannels = getStorage('blockedChannels', []);
        const data = {};
        let total = 0;
        if (type === 'blockedEmotes' || type === 'both') {
            data.blockedEmotes = Array.isArray(blockedEmotes) ? blockedEmotes : [];
            total += data.blockedEmotes.length;
        }
        if (type === 'blockedChannels' || type === 'both') {
            data.blockedChannels = Array.isArray(blockedChannels) ? blockedChannels : [];
            total += data.blockedChannels.length;
        }
        data.total = total;
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const fileName = `7BTTVFZ_Emotes_Channels_${type}_${date}_total_${total}.json`;
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        console.log(`[Content] Initiating download for file: ${fileName}, URL: ${url}, Blob size: ${blob.size}`);
        setTimeout(() => {
            try {
                a.click();
                console.log(`[Content] Download triggered for ${fileName}`);
            }
            catch (clickError) {
                console.error('[Content] Error triggering download:', clickError);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                console.log('[Content] Fallback download triggered');
            }
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log(`[Content] Cleaned up after download: ${fileName}`);
            }, 100);
        }, 0);
    }
    catch (error) {
        console.error(`[Content] ${type} export error:`, error);
    }
}
// ================== end of Функция экспорт списка заблокированных элементов ==================== //
// ====================================================================================== //
// =================================================================================== //
// ================== Функция импорт заблокированных элементов ==================== //
function importBlockedItems(counter) {
    console.log("[Content] Importing blocked items...");
    try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        blockedEmotes = [];
                        blockedChannels = [];
                        blockedEmoteIDs.clear();
                        blockedChannelIDs.clear();
                        newlyAddedIds.clear();
                        const validEmotes = (data.blockedEmotes || []).filter(item => item.id && item.platform && item.emoteName && item.emoteUrl && item.date);
                        const validChannels = (data.blockedChannels || []).filter(item => item.id && item.platform && item.emoteName && item.date);
                        // Мигрируем старый формат для blockedChannels
                        blockedChannels = validChannels.map(item => {
                            if (item.channelName && item.prefix) {
                                return item;
                            }
                            const prefix = item.name || item.emoteName.split(/[^a-zA-Z0-9]/)[0] || item.emoteName;
                            return {
                                id: item.id,
                                channelName: prefix,
                                prefix: prefix,
                                platform: item.platform,
                                emoteName: item.emoteName || item.name || 'Unnamed',
                                date: item.date
                            };
                        });
                        blockedEmotes = validEmotes;
                        blockedEmoteIDs = new Set(blockedEmotes.map(e => e.id));
                        blockedChannelIDs = new Set(blockedChannels.map(c => c.id));
                        newlyAddedIds = new Set();
                        processedEmotes = new WeakMap();
                        console.log("[Content] Imported:", {
                            blockedEmotes: blockedEmotes.length,
                            blockedChannels: blockedChannels.length,
                            invalidEmotes: (data.blockedEmotes || []).length - validEmotes.length,
                            invalidChannels: (data.blockedChannels || []).length - validChannels.length
                        });
                        setStorage('blockedEmotes', blockedEmotes);
                        setStorage('blockedChannels', blockedChannels);
                        toggleEmotesInChat(true);
                        const blockedList = uiElements?.blockedList || document.getElementById('blocked-emotes-list');
                        if (blockedList) {
                            console.log("[Content] Updating blocked list after import...");
                            blockedList.innerHTML = '';
                            updateBlockedEmotesList(blockedList, getBlockedItems());
                            requestAnimationFrame(() => {
                                blockedList.offsetHeight;
                                console.log("[Content] Blocked list DOM updated after import");
                            });
                        }
                        else {
                            console.error("[Content] Blocked list element not found in DOM");
                        }
                        updateCounter(counter);
                        console.log("[Content] Import successful");
                    }
                    catch (error) {
                        console.error("[Content] Import error:", error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    catch (error) {
        console.error("[Content] Import error:", error);
    }
}
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
function init() {
    console.log("[Content] Starting init function...");
    try {
        // Инициализация newlyAddedIds
        let newlyAddedIds = new Set();
        // Инициализация ChatFilter
        chatFilter = new ChatFilter({
            getStorage,
            setStorage,
            showNotification,
            log: (...args) => isLoggingEnabled() && console.log(...args)
        });
        // Инициализация обработки эмодзи
        toggleEmotesInChat();
        // Инициализация хранилища
        initializeStorage();
        // Инициализация блокировки
        initBlocking();
        // Создание UI элементов
        uiElements = createUI();
        if (uiElements) {
            console.log("[Content] UI created:", uiElements);
        }
        // Настройка поиска
        function setupSearchInput() {
            const { searchInput, searchButton, clearSearchButton } = uiElements;
            if (!searchInput || !searchButton || !clearSearchButton) {
                console.error("[Content] Search UI elements missing:", {
                    searchInput: !!searchInput,
                    searchButton: !!searchButton,
                    clearSearchButton: !!clearSearchButton
                });
                return;
            }
            let searchTimeout;
            // Поиск в реальном времени
            searchInput.addEventListener('input', () => {
                if (searchTimeout)
                    clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const searchTerm = searchInput.value.trim();
                    console.log("[UI] Search input changed:", searchTerm);
                    if (currentList === 'bannedWords') {
                        filterBannedChatList(searchTerm);
                    }
                    else {
                        filterBlockedList(searchTerm);
                    }
                    clearSearchButton.disabled = !searchTerm;
                }, 300);
            });
            // Поиск по Enter
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = searchInput.value.trim();
                    console.log("[UI] Search triggered via Enter:", searchTerm);
                    if (currentList === 'bannedWords') {
                        filterBannedChatList(searchTerm);
                    }
                    else {
                        filterBlockedList(searchTerm);
                    }
                    clearSearchButton.disabled = !searchTerm;
                }
            });
            // Сброс поиска
            clearSearchButton.addEventListener('click', () => {
                searchInput.value = '';
                clearSearchButton.disabled = true;
                console.log("[UI] Search cleared");
                if (currentList === 'bannedWords') {
                    filterBannedChatList('');
                }
                else {
                    filterBlockedList('');
                }
                if (uiElements.bannedСhatList) {
                    uiElements.bannedСhatList.scrollTop = 0;
                }
            });
            // Обработчик для кнопки Search (на случай, если она всё же используется)
            searchButton.addEventListener('click', () => {
                const searchTerm = searchInput.value.trim();
                console.log("[UI] Search button clicked:", searchTerm);
                if (currentList === 'bannedWords') {
                    filterBannedChatList(searchTerm);
                }
                else {
                    filterBlockedList(searchTerm);
                }
                clearSearchButton.disabled = !searchTerm;
            });
        }
        setupSearchInput();
        // Привязка обработчиков кнопок
        bindButtonHandlers(uiElements, {
            search: () => {
                const searchTerm = uiElements.searchInput.value.trim();
                console.log("[Content] Search triggered with term:", searchTerm);
                filterBlockedList(searchTerm);
                updateCounter(uiElements.counter);
            },
            add: () => {
                const value = uiElements.addInput.value.trim();
                if (!value) {
                    window.Notifications.showPanelNotification('Введите значение для добавления', 5000, false);
                    return;
                }
                const platform = uiElements.platformSelect.value;
                console.log('[Content] Add triggered:', { value, platform });
                if (platform === 'keyword') {
                    const newKeyword = addKeyword(value, 'keyword');
                    if (newKeyword && uiElements.bannedСhatList) {
                        uiElements.addInput.value = '';
                        const bannedKeywords = getStorage('bannedKeywords', []);
                        const bannedUsers = getStorage('bannedUsers', []);
                        updateBannedСhatList(uiElements.bannedСhatList, {
                            bannedKeywords,
                            bannedUsers,
                            newlyAddedIds: new Set([newKeyword.id]),
                            lastKeyword: newKeyword
                        });
                        goToLastAddedKeyword();
                        updateCounter(uiElements.counter);
                        window.Notifications.showPanelNotification(`Ключевое слово "${value}" добавлено`, 8000, true);
                    }
                    return;
                }
                if (platform === 'user') {
                    console.log('[Content] Вызываем addUser:', value);
                    const newUser = addUser(value);
                    if (newUser && uiElements.bannedСhatList) {
                        uiElements.addInput.value = '';
                        const bannedKeywords = getStorage('bannedKeywords', []);
                        const bannedUsers = getStorage('bannedUsers', []);
                        updateBannedСhatList(uiElements.bannedСhatList, {
                            bannedKeywords,
                            bannedUsers,
                            newlyAddedIds: new Set([newUser.id]),
                            lastKeyword: newUser
                        });
                        goToLastAddedKeyword();
                        updateCounter(uiElements.counter);
                    }
                    return;
                }
                let emoteUrl = '';
                let emoteName = value;
                let emotePrefix = value;
                if (platform !== 'TwitchChannel') {
                    if (!value.startsWith('http')) {
                        if (platform === '7tv') {
                            emoteUrl = `https://cdn.7tv.app/emote/${value}/2x.webp`;
                        }
                        else if (platform === 'bttTV') {
                            emoteUrl = `https://cdn.betterttv.net/emote/${value}/2x.webp`;
                        }
                        else if (platform === 'ffz') {
                            emoteUrl = `https://cdn.frankerfacez.com/emote/${value}/2`;
                        }
                    }
                    else {
                        emoteUrl = value;
                        if (platform === 'bttTV' && !emoteUrl.match(/\/\dx\.webp$/)) {
                            emoteUrl = `${emoteUrl}/2x.webp`;
                        }
                        else if (platform === '7tv' && !emoteUrl.match(/\/\dx\.webp$/)) {
                            emoteUrl = `${emoteUrl}/2x.webp`;
                        }
                    }
                }
                console.log('[Content] Вызываем addEmoteOrChannel:', { emotePrefix, platform, emoteName, emoteUrl });
                const item = addEmoteOrChannel(emotePrefix, platform, emoteName, emoteUrl, null, platform === 'TwitchChannel');
                console.log("[Content] Added via UI:", item);
                if (item && uiElements.blockedList) {
                    uiElements.addInput.value = '';
                    updateBlockedEmotesList(uiElements.blockedList, getBlockedItems());
                    goToLastAddedItem();
                    updateCounter(uiElements.counter);
                    window.Notifications.showPanelNotification(`${platform === 'TwitchChannel' ? 'Канал' : 'Эмодзи'} "${value}" добавлено`, 8000, true);
                }
            },
            addKeyword: () => {
                const keywordValue = uiElements.keywordInput?.value.trim();
                if (keywordValue) {
                    const platform = uiElements.keywordType?.value || 'keyword';
                    const newItem = platform === 'user' ? addUser(keywordValue) : addKeyword(keywordValue, 'keyword');
                    uiElements.keywordInput.value = '';
                    if (newItem && uiElements.bannedСhatList) {
                        const bannedKeywords = getStorage('bannedKeywords', []);
                        const bannedUsers = getStorage('bannedUsers', []);
                        updateBannedСhatList(uiElements.bannedСhatList, {
                            bannedKeywords,
                            bannedUsers,
                            newlyAddedIds: new Set([newItem.id]),
                            lastKeyword: newItem
                        });
                        goToLastAddedKeyword();
                        updateCounter(uiElements.counter);
                    }
                    console.log("[Content] Added via UI:", newItem);
                }
            },
            clearAll: () => {
                clearAllBlockedItems(uiElements.counter);
                setStorage('bannedKeywords', []);
                setStorage('bannedUsers', []);
                newlyAddedIds.clear();
                if (uiElements.bannedСhatList) {
                    updateBannedСhatList(uiElements.bannedСhatList, {
                        bannedKeywords: [],
                        bannedUsers: [],
                        newlyAddedIds,
                        lastKeyword: null
                    });
                }
                updateCounter(uiElements.counter);
            },
            export: () => exportBlockedItems(),
            import: () => importBlockedItems(uiElements.counter),
            unblockAll: () => {
                disableBlocking();
                updateCounter(uiElements.counter);
            },
            blockAll: () => {
                enableBlocking();
                updateCounter(uiElements.counter);
                toggleEmotesInChat();
                toggleEmotesInNode(document.body, true);
                startKeywordFiltering();
            },
            showStats: () => {
                animateModalOpen(uiElements.chartModal, () => {
                    showStatsChart(uiElements.statsChart);
                    uiElements.statsChart.style.width = '100%';
                    uiElements.statsChart.style.height = '400px';
                    if (uiElements.statsChart.chart) {
                        uiElements.statsChart.chart.resize();
                    }
                });
            },
            closeChart: () => animateModalClose(uiElements.chartModal),
            platformChange: () => console.log("[Content] Platform changed:", uiElements.platformSelect.value),
            themeChange: () => {
                const selectedTheme = uiElements.themeSelect.value;
                const themeStylesheet = document.getElementById('theme-stylesheet');
                loadTheme(uiElements.themeSelect, themeStylesheet, selectedTheme);
            },
            toggleLogging: () => {
                console.log("[Debug] toggleLogging handler called");
                const newState = !isLoggingEnabled();
                console.log("[Debug] New logging state:", newState);
                setLoggingEnabled(newState);
                console.log("[Debug] Button element:", uiElements.toggleLoggingButton);
                if (uiElements.toggleLoggingButton) {
                    uiElements.toggleLoggingButton.textContent = newState ? 'Logging On' : 'Logging Off';
                    uiElements.toggleLoggingButton.classList.toggle('active', newState);
                }
                else {
                    console.error("[Debug] toggleLoggingButton is undefined");
                }
                console.log(`[Content] Logging toggled to: ${newState ? 'enabled' : 'disabled'}`);
            }
        });
        // Настройка ввода ключевых слов
        setupKeywordInput();
        // Обновление UI для состояния блокировки
        if (uiElements && uiElements.blockAllButton && uiElements.unblockAllButton) {
            if (isBlockingEnabled) {
                uiElements.blockAllButton.classList.add('active');
                uiElements.unblockAllButton.classList.remove('active');
            }
            else {
                uiElements.unblockAllButton.classList.add('active');
                uiElements.blockAllButton.classList.remove('active');
            }
        }
        if (uiElements && uiElements.toggleLoggingButton) {
            uiElements.toggleLoggingButton.classList.toggle('active', isLoggingEnabled());
            uiElements.toggleLoggingButton.textContent = isLoggingEnabled() ? 'Logging On' : 'Logging Off';
            console.log("[Debug] Initial toggleLoggingButton state:", isLoggingEnabled());
        }
        else {
            console.error("[Debug] toggleLoggingButton not found during init");
        }
        // Загрузка сохраненной темы
        const savedTheme = getStorage('selectedTheme', 'default');
        const themeStylesheet = document.getElementById('theme-stylesheet');
        loadTheme(uiElements.themeSelect, themeStylesheet, savedTheme);
        // Обновление списков заблокированных элементов и ключевых слов
        const bannedKeywords = getStorage('bannedKeywords', []);
        const bannedUsers = getStorage('bannedUsers', []);
        console.log("[Content] Loaded bannedUsers:", bannedUsers);
        console.log("[Content] Loaded bannedKeywords:", bannedKeywords);
        const allItems = [...bannedKeywords, ...bannedUsers];
        const lastKeyword = allItems.length > 0 ? allItems.reduce((latest, current) => {
            return new Date(current.date) > new Date(latest.date) ? current : latest;
        }, allItems[0]) : null;
        updateBlockedEmotesList(uiElements.blockedList, getBlockedItems());
        updateBannedСhatList(uiElements.bannedСhatList, {
            bannedKeywords,
            bannedUsers,
            newlyAddedIds,
            lastKeyword
        });
        updateCounter(uiElements.counter);
        // Инициализация контекстного меню
        initContextMenu();
        // Запуск фильтрации ключевых слов через ChatFilter
        if (getStorage('isTextBlockingEnabled', true)) {
            chatFilter.setTextFilteringEnabled(true);
            startKeywordFiltering();
        }
        // Запуск наблюдателей и мониторинга
        if (!window.location.href.includes('player.twitch.tv') && !window.location.href.includes('twitch.tv/embed')) {
            startRootObserver();
            startKeywordRootObserver();
        }
        monitorChannelChange();
        monitorKeywordChannelChange();
        monitorIframeChanges();
        monitorKeywordIframeChanges();
        monitorKeywordChatReset();
        startKeywordWatchdog();
        handleKeywordVisibilityChange();
        console.log("[Content] Initialization complete");
    }
    catch (error) {
        console.error("[Content] Initialization error:", error);
    }
}
// ==================== end of инит init function ============================================ //
// ===================================================================================== //
// ======================================================================================== //
// ======================== themes.js ======================== //
//  ============ загрузка и переключение Тем Theme Loading and Storage =================== //
// ============== end of  Установка темы по умолчанию ============== //
// =================================================================================== //
// =================================================================================== //
// =================== Стили для подсветки и блокировки элементов ==================== //
const highlightStyle = document.createElement('style');
highlightStyle.innerHTML = `
/* Стили для крестика в попап   смайлов*/
#emote-selection-popup .close-emote-popup-button {
    position: fixed;
    top: 0px;
    right: 20px;
    cursor: pointer;
    color: rgb(85, 255, 161);
    font-weight: bold;
    user-select: none;
} 
 .emote-options {
    position: relative;
    top: 8px;
    width: 205px;
} 
/* Подсветка текста в поиске */
.highlight {
    background-color: #ffff00; /* Жёлтый фон */
    color:hsl(0, 0.00%, 0.00%) !important; /* Чёрный текст */
    padding: 1px 2px; /* Отступы для красоты */
    border-radius: 4px; /* Скругленные углы */
}

.last-item-highlight {
        background-color: #115a14;
        transition: background-color 0.3s ease;
        color: #cfcfcf;
    }
    .blocked-item {
        padding: 5px;
        border-bottom: 1px solid #ccc;
    }
    .new-item {
        background-color: #307c30;
    }
    .delete-button {
        cursor: pointer;
        color: #cfcfcf;
    } 
       
        /* стили  для регулировки размеров панели  */

    .resize-handle {
        position: absolute;
        background: transparent;
        z-index: 10001;
    }

    .resize-handle.top, .resize-handle.bottom {
        width: 100%;
        height: 8px;
        left: 0;
        cursor: ns-resize;
    }

    .resize-handle.top {
        top: -4px;
    }

    .resize-handle.bottom {
        bottom: -4px;
    }

    .resize-handle.left, .resize-handle.right {
        height: 100%;
        width: 8px;
        top: 0;
        cursor: ew-resize;
    }

    .resize-handle.left {
        left: -4px;
    }

    .resize-handle.right {
        right: -4px;
    }

    .resize-handle.top-left, .resize-handle.top-right,
    .resize-handle.bottom-left, .resize-handle.bottom-right {
        width: 12px;
        height: 12px;
    }

    .resize-handle.top-left {
        top: -6px;
        left: -6px;
        cursor: nwse-resize;
    }

    .resize-handle.top-right {
        top: -6px;
        right: -6px;
        cursor: nesw-resize;
    }

    .resize-handle.bottom-left {
        bottom: -6px;
        left: -6px;
        cursor: nesw-resize;
    }

    .resize-handle.bottom-right {
        bottom: -6px;
        right: -6px;
        cursor: nwse-resize;
    } 
        
`;
document.head.appendChild(highlightStyle);
// =================== end of Стили для подсветки и блокировки элементов ==================== //
// =========================================================================================== //
// ============================= Инициализация скрипта ==================================== //
init();
console.log("[Twitch Emote Blocker] Script initialization triggered");
// =========================== end of Инициализация скрипта ============================== //  
//# sourceMappingURL=combined.js.map