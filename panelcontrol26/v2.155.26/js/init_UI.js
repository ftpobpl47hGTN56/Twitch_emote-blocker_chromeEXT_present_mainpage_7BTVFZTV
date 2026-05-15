// js/init_UI.js //

//  инициализация UI и обработчиков событий
   
async function init() {
    console.log("[_init_Content_] Starting init function...");
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
        uiElements = await createUI();
        if (uiElements) {
            console.log("[_init_Content_] UI created:", uiElements);
        }
        // ========== SearchInput Настройка поиска =============
    
        // ========== SearchInput Настройка поиска =============

        
        // Привязка обработчиков кнопок
        bindButtonHandlers(uiElements, {
            search: () => {
                const searchTerm = uiElements.searchInput.value.trim();
                console.log("[_init_Content_] Search triggered with term:", searchTerm);
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
    console.log('[_init_Content_] Add triggered:', { value, platform });

    // Очищаем инпут сразу для всех типов
    uiElements.addInput.value = '';

    let newItem = null;

    if (platform === 'keyword') {
        newItem = addKeyword(value, 'keyword');
    } else if (platform === 'user') {
        newItem = addUser(value);
    }

    // Обработка keyword и user
    if (newItem && (platform === 'keyword' || platform === 'user')) {
        if (uiElements.bannedChatList) {
            // Перечитываем актуальные данные из хранилища
            const bannedKeywords = getStorage('bannedKeywords', []);
            const bannedUsers = getStorage('bannedUsers', []);
            // Важно: передаём newlyAddedIds и lastKeyword
            updateBannedChatList(uiElements.bannedChatList, {
                bannedKeywords,
                bannedUsers,
                newlyAddedIds: new Set([newItem.id]),
                lastKeyword: newItem
            }, ''); // поиск пустой

            goToLastAddedKeyword(); // если функция существует
            updateCounter(uiElements.counter);
            window.Notifications.showPanelNotification(
                platform === 'user' ? `Никнейм "${value}" добавлен` : `Ключевое слово "${value}" добавлено`,
                8000, true
            );
        }
        return;
    }

    // Остальная часть для эмодзи и каналов (оставляем почти как было)
    let emoteUrl = '';
    let emoteName = value;
    let emotePrefix = value;
    if (platform !== 'TwitchChannel') {
        if (!value.startsWith('http')) {
            if (platform === '7tv') {
                emoteUrl = `https://cdn.7tv.app/emote/${value}/2x.webp`;
            } else if (platform === 'bttTV') {
                emoteUrl = `https://cdn.betterttv.net/emote/${value}/2x.webp`;
            } else if (platform === 'ffz') {
                emoteUrl = `https://cdn.frankerfacez.com/emote/${value}/2`;
            }
        } else {
            emoteUrl = value;
            if (platform === 'bttTV' && !emoteUrl.match(/\/\dx\.webp$/)) {
                emoteUrl = `${emoteUrl}/2x.webp`;
            } else if (platform === '7tv' && !emoteUrl.match(/\/\dx\.webp$/)) {
                emoteUrl = `${emoteUrl}/2x.webp`;
            }
        }
    }

    const item = addEmoteOrChannel(emotePrefix, platform, emoteName, emoteUrl, null, platform === 'TwitchChannel');
    if (item && uiElements.blockedList) {
        updateBlockedEmotesList(uiElements.blockedList, getBlockedItems());
        goToLastAddedItem();
        updateCounter(uiElements.counter);
        window.Notifications.showPanelNotification(
            `${platform === 'TwitchChannel' ? 'Канал' : 'Эмодзи'} "${value}" добавлено`,
            8000, true
        );
    }
},
            addKeyword: () => {
                const keywordValue = uiElements.keywordInput?.value.trim();
                if (keywordValue) {
                    const platform = uiElements.keywordType?.value || 'keyword';
                    const newItem = platform === 'user' ? addUser(keywordValue) : addKeyword(keywordValue, 'keyword');
                    uiElements.keywordInput.value = '';
                    if (newItem && uiElements.bannedChatList) {
                        const bannedKeywords = getStorage('bannedKeywords', []);
                        const bannedUsers = getStorage('bannedUsers', []);
                        updateBannedChatList(uiElements.bannedChatList, {
                            bannedKeywords,
                            bannedUsers,
                            newlyAddedIds: new Set([newItem.id]),
                            lastKeyword: newItem
                        });
                        goToLastAddedKeyword();
                        updateCounter(uiElements.counter);
                    }
                    console.log("[_init_Content_] Added via UI:", newItem);
                }
            },
            clearAll: () => {
                clearAllBlockedItems(uiElements.counter);
                setStorage('bannedKeywords', []);
                setStorage('bannedUsers', []);
                newlyAddedIds.clear();
                if (uiElements.bannedChatList) {
                    updateBannedChatList(uiElements.bannedChatList, {
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
            platformChange: () => console.log("[_init_Content_] Platform changed:", uiElements.platformSelect.value),
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
                console.log(`[_init_Content_] Logging toggled to: ${newState ? 'enabled' : 'disabled'}`);
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
    // СТАЛО:
let themeStylesheet = document.getElementById('theme-stylesheet');
if (!themeStylesheet) {
    themeStylesheet = document.createElement('link');
    themeStylesheet.id = 'theme-stylesheet';
    themeStylesheet.rel = 'stylesheet';
    document.head.appendChild(themeStylesheet);
}
loadTheme(uiElements.themeSelect, themeStylesheet, savedTheme);

        // Обновление списков заблокированных элементов и ключевых слов
        const bannedKeywords = getStorage('bannedKeywords', []);
        const bannedUsers = getStorage('bannedUsers', []);
        //========== console.log("[_init_Content_] Loaded bannedUsers:", bannedUsers); ================//
      //=======  console.log("[_init_Content_] Loaded bannedKeywords:", bannedKeywords); ==============//
        const allItems = [...bannedKeywords, ...bannedUsers];
        const lastKeyword = allItems.length > 0 ? allItems.reduce((latest, current) => {
            return new Date(current.date) > new Date(latest.date) ? current : latest;
        }, allItems[0]) : null;
        updateBlockedEmotesList(uiElements.blockedList, getBlockedItems());
        updateBannedChatList(uiElements.bannedChatList, {
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
        console.log("[_init_Content_] Initialization complete");
    }
    catch (error) {
        console.error("[_init_Content_] Initialization error:", error);
    }
} 



