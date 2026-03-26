// =============   ui.js ============= //
async function createUI() {
    if (window.location.href.includes('player.twitch.tv') ||
        (window.location.href.includes('twitch.tv/embed') && !window.location.href.includes('popout'))) {
        console.log("[_UI_panel_7BTVFZ_] Skipping UI creation in embedded iframe");
        return null;
    }
    
    // ============ Подключение panelSettings.css файла настроек =========== //
    function loadSettingsStylesheet() {
        let settingsStylesheet = document.getElementById('settings-stylesheet');
        if (!settingsStylesheet) {
            settingsStylesheet = document.createElement('link');
            settingsStylesheet.id = 'settings-stylesheet';
            settingsStylesheet.rel = 'stylesheet';
            settingsStylesheet.href = chrome.runtime.getURL('css/panelSettings.css');
            document.head.appendChild(settingsStylesheet);
            console.log("[_UI_panel_7BTVFZ_] Settings stylesheet added to <head>");
        }
    }
    // Вызов функции загрузки стилей в начале createUI
    loadSettingsStylesheet();
 

    // ================== Подключение lists.css ======================= //
    let listsStylesheet = document.getElementById('lists-stylesheet');
    if (!listsStylesheet) {
        listsStylesheet = document.createElement('link');
        listsStylesheet.id = 'lists-stylesheet';
        listsStylesheet.rel = 'stylesheet';
        listsStylesheet.href = chrome.runtime.getURL('css/Lists.css');
        document.head.appendChild(listsStylesheet);
        console.log("[_UI_panel_7BTVFZ_] Lists stylesheet added to <head>");
    }
    console.log("[_UI_panel_7BTVFZ_] Creating control panel and button...");
        console.log("[_UI_panel_7BTVFZ_] Creating control panel and button...");
    
    // ============== Загружаем 7btvfz_Panel_54h54.html HTML из внешнего файла ==============
    // ============== Загружаем 7btvfz_Panel_54h54.html HTML из внешнего файла ==============

    try {
        const response = await fetch(chrome.runtime.getURL('7btvfz_Panel_54h54.html'));
        if (!response.ok) {
            throw new Error(`Failed to load 7btvfz_Panel_54h54.html: ${response.status}`);
        }
        const panelHtml = await response.text();
        
        const container = document.createElement('div');
        container.innerHTML = panelHtml;
        document.body.appendChild(container);
        console.log("[_UI_panel_7BTVFZ_] Control panel loaded from 7btvfz_Panel_54h54.html and appended to DOM");
        
        // Добавляем динамические классы и тексты сразу после вставки
        const toggleLoggingButton = document.getElementById('toggle-logging-button');
        if (toggleLoggingButton) {
            const isLoggingOn = isLoggingEnabled();  // Ваша функция
            toggleLoggingButton.className = isLoggingOn ? 'active' : '';
            toggleLoggingButton.textContent = isLoggingOn ? 'Logging On' : 'Logging Off';
        }
        
        const toggleGlobalNotificationsButton = document.getElementById('toggle-global-notifications-button');
        if (toggleGlobalNotificationsButton && window.Notifications) {
            const isGlobalOn = window.Notifications.isGlobalNotificationsEnabled();
            toggleGlobalNotificationsButton.className = isGlobalOn ? 'active' : '';
            toggleGlobalNotificationsButton.textContent = isGlobalOn ? 'Global Notifications On' : 'Global Notifications Off';
        }
        
        const toggleIsolatedNotificationsButton = document.getElementById('toggle-isolated-notifications-button');
        if (toggleIsolatedNotificationsButton && window.Notifications) {
            const isIsolatedOn = window.Notifications.isIsolatedNotificationsEnabled();
            toggleIsolatedNotificationsButton.className = isIsolatedOn ? 'active' : '';
            toggleIsolatedNotificationsButton.textContent = isIsolatedOn ? 'Isolated Notifications On' : 'Isolated Notifications Off';
        } 
        // ✅ СТАЛО — правильный ключ:
        const toggleMediaPreviewButton = document.getElementById('toggle-media-preview-button');
        if (toggleMediaPreviewButton) {
            const isMediaOn = getStorage('isLinkProcessingEnabled', false); // ← ПРАВИЛЬНЫЙ КЛЮЧ
            toggleMediaPreviewButton.className = isMediaOn ? 'active' : '';
            toggleMediaPreviewButton.textContent = isMediaOn ? 'Media Preview On' : 'Media Preview Off';
        }
        
    } catch (error) {
        console.error("[_UI_panel_7BTVFZ_] Error loading 7btvfz_Panel_54h54.html:", error);
        // Fallback: можно добавить оригинальный HTML как запасной вариант, если файл не загрузился
        // Но для простоты пока просто лог ошибки
        return null;
    }
    // ============== Загружаем 7btvfz_Panel_54h54.html HTML из внешнего файла ==============
    // ============== Загружаем 7btvfz_Panel_54h54.html HTML из внешнего файла ==============

  
    let themeStylesheet = document.getElementById('theme-stylesheet');
    if (!themeStylesheet) {
        themeStylesheet = document.createElement('link');
        themeStylesheet.id = 'theme-stylesheet';
        themeStylesheet.rel = 'stylesheet';
        document.head.appendChild(themeStylesheet);
        console.log("[_UI_panel_7BTVFZ_] Theme stylesheet added to <head>");
    }
    
    const controlPanel = document.getElementById('control-7btvfz-center-x78x05x46-panel');
    const sortContainer = document.getElementById('sortContainer');
    const sortchatbanneditemsContainer = document.getElementById('sort-chatbanned-items-container');
    const counter = document.getElementById('counter');
    const openPanelContainer = document.getElementById('open-panel-container');
    const openPanelLabel = document.getElementById('open-panel-label');
    const openPanelButton = document.getElementById('open-panel-button');
    const toggleMediaPreviewButton = document.getElementById('toggle-media-preview-button');
    const toggleListsButton = document.getElementById('toggle-lists-button');
    const blockedList = document.getElementById('blocked-emotes-list');
    const bannedChatList = document.getElementById('banned-chat-list');
    const dataSelectionModal = document.getElementById('data-selection-modal');
    const selectBlockedItemsButton = document.getElementById('select-blocked-items');
    const selectBannedkeyWordsPhrasesButton = document.getElementById('select-banned-keywords-phrases-list');
    const selectBannedUsersButton = document.getElementById('select-banned-users');
    const selectChatBannedItemsButton = document.getElementById('select-chat-banned-items');
    const modalCancelButton = document.getElementById('modal-cancel');
    const hueRotateRange = document.getElementById('hue-rotate-range');
    const hueRotateValue = document.getElementById('hue-rotate-value');
    const settingsButton = document.getElementById('settings-button');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsButton = document.getElementById('close-modal-settings-button');
    const toggleGlobalNotificationsButton = document.getElementById('toggle-global-notifications-button');
    const toggleIsolatedNotificationsButton = document.getElementById('toggle-isolated-notifications-button');
    const globalSwitch = document.getElementById('global-notification-switch');
    const isolatedSwitch = document.getElementById('isolated-notification-switch');
    const emojiSpamSwitch = document.getElementById('emoji-spam-protection-switch');
    const emojiSpamLimitInput = document.getElementById('emoji-spam-limit-input');
    // Инициализация currentList из storage
let currentList = getStorage('currentList', 'blockedEmotes');
console.log("[_UI_panel_7BTVFZ_] Initial currentList loaded:", currentList);
    // Проверка инициализации элементов
    console.log("[_UI_panel_7BTVFZ_] Elements initialized:", {
        controlPanel,
        settingsModal,
        toggleGlobalNotificationsButton,
        toggleIsolatedNotificationsButton,
        globalSwitch,
        isolatedSwitch,
        emojiSpamSwitch,
        emojiSpamLimitInput
    });
    console.log("[_UI_panel_7BTVFZ_] Modal elements initialized:", {
        dataSelectionModal,
        selectBlockedItemsButton,
        selectBannedkeyWordsPhrasesButton,
        selectBannedUsersButton,
        modalCancelButton
    });

    // -------------- Сортировщик кнопки chat banned items buttons ------------------ //
    let currentSortOrder = { name: 'asc', platform: 'asc', date: 'asc' };
    let currentBannedChatSortOrder = { name: 'asc', date: 'asc' };
    // Загрузка сохраненных настроек сортировки
    chrome.storage.local.get(['sortOrder', 'bannedChatSortOrder'], (result) => {
        currentSortOrder = result.sortOrder || { name: 'asc', platform: 'asc', date: 'asc' };
        currentBannedChatSortOrder = result.bannedChatSortOrder || { name: 'asc', date: 'asc' };
        console.log("[_UI_panel_7BTVFZ_] Loaded sort orders:", { currentSortOrder, currentBannedChatSortOrder });
    });
    // -------------- Создаем кнопки сортировки для sortBannedChatItems  списка -------------- //
    const sortBannedChatByNameButton = document.createElement('button');
    sortBannedChatByNameButton.id = 'sort-banned-chat-by-name';
    sortBannedChatByNameButton.innerHTML = 'Name ▲';
    sortBannedChatByNameButton.style.cssText = 'cursor: pointer; margin-right: 10px;';
    sortBannedChatByNameButton.onclick = () => {
        const order = currentBannedChatSortOrder.name === 'asc' ? 'desc' : 'asc';
        currentBannedChatSortOrder.name = order;
        sortBannedChatByNameButton.innerHTML = `Name ${order === 'asc' ? '▲' : '▼'}`;
        sortBannedChatItems('name', order); // Вызываем функцию сортировки второго списка
    };
    sortchatbanneditemsContainer.appendChild(sortBannedChatByNameButton);
    const sortBannedChatByDateButton = document.createElement('button');
    sortBannedChatByDateButton.id = 'sort-banned-chat-by-date';
    sortBannedChatByDateButton.innerHTML = 'Date-Time ▲';
    sortBannedChatByDateButton.style.cssText = 'cursor: pointer; margin-right: 10px;';
    sortBannedChatByDateButton.onclick = () => {
        const order = currentBannedChatSortOrder.date === 'asc' ? 'desc' : 'asc';
        currentBannedChatSortOrder.date = order;
        sortBannedChatByDateButton.innerHTML = `Date ${order === 'asc' ? '▲' : '▼'}`;
        sortBannedChatItems('date', order); // Вызываем функцию сортировки второго списка
    };
    sortchatbanneditemsContainer.appendChild(sortBannedChatByDateButton);
    const goToLastBannedChatButton = document.createElement('button');
    goToLastBannedChatButton.id = 'go-to-last-banned-chat';
    goToLastBannedChatButton.innerHTML = 'Go To last Added chat item ▼';
    goToLastBannedChatButton.style.cssText = 'cursor: pointer;';
    goToLastBannedChatButton.onclick = goToLastAddedKeyword; // функция  BannedChatList с учётом виртуализации
    sortchatbanneditemsContainer.appendChild(goToLastBannedChatButton);
    // ---------------- Сортировщик кнопки sortBannedChatItems ------------------ //

    // ------------------- Sorting blockedEmotes buttons ------------------------ //
    const sortByNameButton = document.createElement('button');
    sortByNameButton.id = 'sort-emotes-by-name';
    sortByNameButton.innerHTML = `Name ${currentSortOrder.name === 'asc' ? '▲' : '▼'}`;
    sortByNameButton.classList.add(currentSortOrder.name === 'asc' ? 'active' : '');
    sortByNameButton.onclick = () => {
        const order = currentSortOrder.name === 'asc' ? 'desc' : 'asc';
        currentSortOrder.name = order;
        sortByNameButton.innerHTML = `Name ${order === 'asc' ? '▲' : '▼'}`;
        sortByNameButton.classList.add('active');
        sortByPlatformButton.classList.remove('active');
        sortByDateButton.classList.remove('active');
        sortblockedEmotes('name', order);
        chrome.storage.local.set({ sortOrder: currentSortOrder }, () => {
            console.log("[_UI_panel_7BTVFZ_] Saved emotes sort order:", currentSortOrder);
        });
    };
    sortContainer.appendChild(sortByNameButton);
    const sortByPlatformButton = document.createElement('button');
    sortByPlatformButton.innerHTML = 'Platform ▲';
    sortByPlatformButton.style.cssText = 'cursor: pointer; margin-right: 10px;';
    sortByPlatformButton.onclick = () => {
        const order = currentSortOrder.platform === 'asc' ? 'desc' : 'asc';
        currentSortOrder.platform = order;
        sortByPlatformButton.innerHTML = `Platform ${order === 'asc' ? '▲' : '▼'}`;
        sortblockedEmotes('platform', order);
    };
    sortContainer.appendChild(sortByPlatformButton);
    const sortByDateButton = document.createElement('button');
    sortByDateButton.innerHTML = 'Date-Time ▲';
    sortByDateButton.style.cssText = 'cursor: pointer; margin-right: 10px;';
    sortByDateButton.onclick = () => {
        const order = currentSortOrder.date === 'asc' ? 'desc' : 'asc';
        currentSortOrder.date = order;
        sortByDateButton.innerHTML = `Date ${order === 'asc' ? '▲' : '▼'}`;
        sortblockedEmotes('date', order);
    };
    sortContainer.appendChild(sortByDateButton);
    const goToLastButton = document.createElement('button');
    goToLastButton.innerHTML = 'Go To Last Element ▼';
    goToLastButton.style.cssText = 'cursor: pointer;';
    goToLastButton.onclick = goToLastAddedItem;
    sortContainer.appendChild(goToLastButton);
 // -------------- Создание двух кнопок Переключения списков ------------------ //
    const blockedEmotesListButton = document.createElement('button');
    blockedEmotesListButton.id = 'blocked-emotes-list-button';
    blockedEmotesListButton.textContent = 'Blocked Emotes List ';
    blockedEmotesListButton.style.cssText = 'cursor: pointer; margin-right: 10px;';
    const bannedChatListButton = document.createElement('button');
    bannedChatListButton.id = 'banned-chat-list-button';
    bannedChatListButton.textContent = 'Banned Chat List ';
    bannedChatListButton.style.cssText = 'cursor: pointer;';
 // ------------------ Добавление кнопок в контейнер -------------------- //
    const buttonContainer = document.querySelector('.button-container');
 // ----------------  добавление в конец контейнера --------------------- //
     buttonContainer.appendChild(blockedEmotesListButton);
    buttonContainer.appendChild(bannedChatListButton);
 // Функция управления видимостью сортировочных кнопок
    function updateSortButtonsVisibility() {
        if (currentList === 'blockedEmotes') {
            sortContainer.style.display = 'flex'; // Используем flex вместо block
            sortchatbanneditemsContainer.style.display = 'none';
            console.log("[_UI_panel_7BTVFZ_] Showing sortContainer for blocked-emotes-list");
        }
        else if (currentList === 'bannedKeywords') {
            sortContainer.style.display = 'none';
            sortchatbanneditemsContainer.style.display = 'flex'; // Используем flex вместо block
            console.log("[_UI_panel_7BTVFZ_] Showing sort-chatbanned-items-container for banned-chat-list");
        }
    }
 // --------- Функция для обновления состояния кнопок bannedChatListButton и blockedEmotesListButton ---------- //
 // Функция для обновления стилей кнопок переключения списков
    
    function updateButtonStyles() {
        if (currentList === 'blockedEmotes') {
            blockedEmotesListButton.style.backgroundColor = ' #0c7036';
            blockedEmotesListButton.style.color = 'white';
            bannedChatListButton.style.backgroundColor = '';
            bannedChatListButton.style.color = '';
        }
        else if (currentList === 'bannedKeywords') {
            bannedChatListButton.style.backgroundColor = ' #0c7036';
            bannedChatListButton.style.color = 'white';
            blockedEmotesListButton.style.backgroundColor = '';
            blockedEmotesListButton.style.color = '';
        }
        updateSortButtonsVisibility(); // Обновляем видимость сортировочных кнопок
    }
 // ----------------- Обработчики переключения списков ----------------- //
    blockedEmotesListButton.onclick = () => {
        console.log("[_UI_panel_7BTVFZ_] Нажата кнопка Blocked Emotes");
        blockedList.style.transform = 'translateX(0)';
        bannedChatList.style.transform = 'translateX(-104%)';
        currentList = 'blockedEmotes';
      
        setStorage('currentList', currentList);
        updateButtonStyles();
    };
    bannedChatListButton.onclick = () => {
        console.log("[_UI_panel_7BTVFZ_] Нажата кнопка Banned Chat List");
        blockedList.style.transform = 'translateX(104%)';
        bannedChatList.style.transform = 'translateX(0)';
        currentList = 'bannedKeywords';
        setStorage('currentList', currentList);
        
        updateButtonStyles();

     const currentSearchTerm = uiElements.searchInput?.value.trim() || '';

    updateBannedChatList(uiElements.bannedChatList, {
        bannedKeywords: getStorage('bannedKeywords', []),
        bannedUsers: getStorage('bannedUsers', []),
        newlyAddedIds: new Set(),
        lastKeyword: null
    }, currentSearchTerm);  // ← передаём актуальный поисковый запрос  
};

 // ----------------- добавлена 01-12-2025 currentList: Загрузка сохраненного Списка  ------------------ //
function applySavedListVisibility() {
    const saved = getStorage('currentList', 'blockedEmotes');
    if (saved === 'bannedKeywords') {
        blockedList.style.transform = 'translateX(104%)';
        bannedChatList.style.transform = 'translateX(0)';
        console.log("[_UI_panel_7BTVFZ_] Применено: показан Banned Chat List (восстановлено из storage)");
    } else {
        blockedList.style.transform = 'translateX(0)';
        bannedChatList.style.transform = 'translateX(-104%)';
    }
    // Также обновляем стили кнопок
    updateButtonStyles();
}
 // ----------------- Инициализация состояния кнопок ------------------------------ //
    // Инициализация видимости сортировочных кнопок
    updateSortButtonsVisibility();
    updateButtonStyles();
    applySavedListVisibility();

    // ----------------- Hue Rotate: Загрузка сохраненного значения ------------------ //
    chrome.storage.local.get(['hueRotateValue'], (result) => {
        const value = result.hueRotateValue || 360;
        hueRotateRange.value = value;
        hueRotateValue.textContent = value;
        controlPanel.style.filter = `hue-rotate(${value}deg)`;
        console.log("[_UI_panel_7BTVFZ_] Hue Rotate value loaded:", value);
    });
    // -------------- Hue Rotate: Обработчик изменения значения ------------------ //
    hueRotateRange.addEventListener('input', () => {
        const value = hueRotateRange.value;
        hueRotateValue.textContent = value;
        controlPanel.style.filter = value == 0 ? 'none' : `hue-rotate(${value}deg)`;
        chrome.storage.local.set({ hueRotateValue: value }, () => {
            console.log("[_UI_panel_7BTVFZ_] Hue Rotate value saved:", value);
        });
    });
  // ==================== обработчик для кнопки открытия И закрытия панели ====================== //
  // ====================== Panel visibility ========================= //
    const isVisible = getStorage('panelVisible', false);
    console.log("[_UI_panel_7BTVFZ_] Panel visibility state:", isVisible);
    controlPanel.classList.toggle('visible', isVisible);
    openPanelButton.classList.toggle('active', isVisible);
    openPanelLabel.textContent = isVisible ? 'Close Panel' : 'Open Panel';
    openPanelContainer.setAttribute('aria-label', isVisible ? 'Close control panel' : 'Open control panel');
    openPanelContainer.title = isVisible ? 'Close control panel' : 'Open control panel';
 // ========================= обработчик для кнопки открытия панели ========================= //
    openPanelContainer.addEventListener('click', () => {
    console.log("[_UI_panel_7BTVFZ_] Open panel container clicked");
    const isVisible = controlPanel.classList.contains('visible');
    controlPanel.classList.toggle('visible', !isVisible);
    openPanelButton.classList.toggle('active', !isVisible);
    if (!isVisible) { // Если открываем панель
        controlPanel.style.pointerEvents = 'auto'; // Восстанавливаем события
        const dragHandle = controlPanel.querySelector('.drag-handle');
        const resizeHandles = controlPanel.querySelectorAll('.resize-handle');
        if (dragHandle) dragHandle.style.pointerEvents = 'auto';
        resizeHandles.forEach(handle => handle.style.pointerEvents = 'auto');
        
        // Опционально: Переинициализировать ресайз/драг, если нужно
        makePanelResizable(controlPanel);
        makePanelDraggable(controlPanel);
        console.log("[UI] Pointer events restored on open");
    }
    openPanelLabel.textContent = isVisible ? 'Open Panel' : 'Close Panel';
    openPanelContainer.setAttribute('aria-label', isVisible ? 'Open control panel' : 'Close control panel');
    openPanelContainer.title = isVisible ? 'Open control panel' : 'Close control panel';
    setStorage('panelVisible', !isVisible);
    
    // Сброс позиций при закрытии панели
    if (!controlPanel.classList.contains('visible')) {
        controlPanel.style.left = ''; // Сбрасываем inline left, возвращаемся к CSS right: 380px
        controlPanel.style.top = '';  // Сбрасываем inline top, возвращаемся к CSS top: 0px
        console.log("[_UI_panel_7BTVFZ_] Panel position reset on close");
    }
});
    // =============== обработчик для кнопки закрытия панели ======================= //
    const closePanelButton = document.getElementById('close-panel-button');
    closePanelButton.addEventListener('click', () => {
    console.log("[_UI_panel_7BTVFZ_] Close panel button clicked");
    controlPanel.classList.remove('visible');
    
    // Сброс позиций и изоляции при закрытии панели
    controlPanel.style.left = ''; // Сбрасываем inline left, возвращаемся к CSS right: 380px
    controlPanel.style.top = '';  // Сбрасываем inline top, возвращаемся к CSS top: 0px
    
    // Принудительная изоляция от манипуляций
    controlPanel.style.pointerEvents = 'none'; // Блокируем события на панели
    const dragHandle = controlPanel.querySelector('.drag-handle');
    const resizeHandles = controlPanel.querySelectorAll('.resize-handle');
    if (dragHandle) dragHandle.style.pointerEvents = 'none';
    resizeHandles.forEach(handle => handle.style.pointerEvents = 'none');
    
    console.log("[_UI_panel_7BTVFZ_] Panel position and events reset on close");
    
    openPanelButton.classList.remove('active');
    openPanelLabel.textContent = 'Open Panel';
    openPanelContainer.setAttribute('aria-label', 'Open control panel');
    openPanelContainer.title = 'Open control panel';
    setStorage('panelVisible', false);
});
 // ========================= обработчик для кнопки открытия И закрытия панели  ================================================ //
   
    // ============================== Включение и отключение уведомлений ======================================================= //
    // ================================== Загрузка состояний уведомлений из chrome.storage  ==================================== //
    // Загрузка состояний уведомлений
    chrome.storage.local.get(['globalNotificationsEnabled', 'isolatedNotificationsEnabled'], (result) => {
        const globalState = result.globalNotificationsEnabled !== undefined ? result.globalNotificationsEnabled : false;
        const isolatedState = result.isolatedNotificationsEnabled !== undefined ? result.isolatedNotificationsEnabled : false;
        // Устанавливаем состояния в notifications.js
        window.Notifications.setGlobalNotificationsEnabled(globalState);
        window.Notifications.setIsolatedNotificationsEnabled(isolatedState);
        // Обновляем UI кнопок
        toggleGlobalNotificationsButton.textContent = globalState ? 'Global Notifications On' : 'Global Notifications Off';
        toggleGlobalNotificationsButton.classList.toggle('active', globalState);
        toggleIsolatedNotificationsButton.textContent = isolatedState ? 'Isolated Notifications On' : 'Isolated Notifications Off';
        toggleIsolatedNotificationsButton.classList.toggle('active', isolatedState);
        console.log("[_UI_panel_7BTVFZ_] Notification states loaded:", { globalState, isolatedState });
    });
    // Обработчик для глобальных уведомлений
    toggleGlobalNotificationsButton.addEventListener('click', () => {
        const currentState = window.Notifications.isGlobalNotificationsEnabled();
        const newState = !currentState;
        window.Notifications.setGlobalNotificationsEnabled(newState);
        toggleGlobalNotificationsButton.textContent = newState ? 'Global Notifications On' : 'Global Notifications Off';
        toggleGlobalNotificationsButton.classList.toggle('active', newState);
        const globalSwitch = document.getElementById('global-notification-switch');
        if (globalSwitch)
            globalSwitch.checked = newState;
        console.log("[_UI_panel_7BTVFZ_] Global notifications toggled:", newState);
        if (newState) {
            window.Notifications.showPanelNotification(`Global notifications ${newState ? 'enabled' : 'disabled'}`, 5000, true);
        }
    });
    // Обработчик для изолированных уведомлений
    toggleIsolatedNotificationsButton.addEventListener('click', () => {
        const currentState = window.Notifications.isIsolatedNotificationsEnabled();
        const newState = !currentState;
        window.Notifications.setIsolatedNotificationsEnabled(newState);
        toggleIsolatedNotificationsButton.textContent = newState ? 'Isolated Notifications On' : 'Isolated Notifications Off';
        toggleIsolatedNotificationsButton.classList.toggle('active', newState);
        const isolatedSwitch = document.getElementById('isolated-notification-switch');
        if (isolatedSwitch)
            isolatedSwitch.checked = newState;
        console.log("[_UI_panel_7BTVFZ_] Isolated notifications toggled:", newState);
        if (window.Notifications.isGlobalNotificationsEnabled()) {
            window.Notifications.showPanelNotification(`Isolated notifications ${newState ? 'enabled' : 'disabled'}`, 5000, true);
        }
    });
    // ================================== Загрузка состояний уведомлений из chrome.storage  ==================================== //
    // ================================== Загрузка состояний уведомлений из chrome.storage  ==================================== //
    // ============================== "Защита от имодзи спама" Настройки модального окна  ====================================== //
    // ================================= Обработчики для модального окна "Защита от имодзи спама" ============================== //
    if (emojiSpamSwitch) {
        chrome.storage.local.get(['isEmojiSpamProtectionEnabled'], (result) => {
            const isEnabled = result.isEmojiSpamProtectionEnabled !== undefined ? result.isEmojiSpamProtectionEnabled : true;
            emojiSpamSwitch.checked = isEnabled;
            console.log('[_UI_panel_7BTVFZ_] Emoji spam protection switch initialized:', isEnabled);
        });
        emojiSpamSwitch.addEventListener('change', async () => {
            const newState = emojiSpamSwitch.checked;
            console.log('[_UI_panel_7BTVFZ_] Emoji spam protection switch changed to:', newState);
            try {
                await window.ChatFilter.setEmojiSpamProtectionEnabled(newState);
                console.log('[_UI_panel_7BTVFZ_] Emoji spam protection set to:', newState);
                if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                    window.Notifications.showPanelNotification(`Emoji spam protection ${newState ? 'enabled' : 'disabled'}`, 3000, false);
                }
            }
            catch (error) {
                console.error('[_UI_panel_7BTVFZ_] Error setting emoji spam protection:', error);
                if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                    window.Notifications.showPanelNotification('Error setting emoji spam protection', 5000, false);
                }
                // Восстанавливаем предыдущее состояние
                chrome.storage.local.get(['isEmojiSpamProtectionEnabled'], (result) => {
                    const currentState = result.isEmojiSpamProtectionEnabled !== undefined ? result.isEmojiSpamProtectionEnabled : true;
                    emojiSpamSwitch.checked = currentState;
                });
            }
        });
    }
    else {
        console.warn('[_UI_panel_7BTVFZ_] Emoji spam protection switch not found');
    }
    // ============== Функция ожидания инициализации window.ChatFilter ================ //
    // ============== Относится к категории ChatFilter модуля ========================= //
    async function waitForChatFilter(maxAttempts = 22, delay = 500) {
        for (let i = 0; i < maxAttempts; i++) {
            if (typeof window.ChatFilter.setEmojiSpamLimit === 'function') {
                console.log('[_UI_panel_7BTVFZ_] ChatFilter.setEmojiSpamLimit is available');
                return true;
            }
            console.log(`[_UI_panel_7BTVFZ_] ChatFilter.setEmojiSpamLimit not available, retrying (${i + 1}/${maxAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        console.error('[_UI_panel_7BTVFZ_] ChatFilter.setEmojiSpamLimit not available after max attempts');
        return false;
    }
    // ==============  Обработчик для поля ввода лимита эмодзи =================== //
    if (emojiSpamLimitInput) {
        chrome.storage.local.get(['emojiSpamLimit'], (result) => {
            const limit = result.emojiSpamLimit || 6;
            emojiSpamLimitInput.value = limit;
            console.log('[_UI_panel_7BTVFZ_] Emoji spam limit input initialized:', limit);
        });
        emojiSpamLimitInput.addEventListener('input', async () => {
            const newLimit = Number(emojiSpamLimitInput.value);
            let validLimit = newLimit;
            // Проверка на валидность введенного значения
            if (isNaN(newLimit) || newLimit < 1) {
                validLimit = 1; // Минимальный лимит
                emojiSpamLimitInput.value = validLimit; // Обновляем поле ввода
            }
            console.log('[_UI_panel_7BTVFZ_] Emoji spam limit input changed to:', validLimit);
            try {
                const isChatFilterReady = await waitForChatFilter();
                if (isChatFilterReady) {
                    await window.ChatFilter.setEmojiSpamLimit(validLimit);
                    console.log('[_UI_panel_7BTVFZ_] Emoji spam limit set to:', validLimit);
                    if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                        window.Notifications.showPanelNotification(`Emoji spam limit set to ${validLimit}`, 3000, false);
                    }
                }
                else {
                    throw new Error('setEmojiSpamLimit is not available');
                }
            }
            catch (error) {
                console.error('[_UI_panel_7BTVFZ_] Error updating emoji spam limit:', error);
                if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                    window.Notifications.showPanelNotification('Error updating emoji spam limit', 5000, false);
                }
                // Восстанавливаем предыдущее значение
                chrome.storage.local.get(['emojiSpamLimit'], (result) => {
                    const currentLimit = result.emojiSpamLimit || 6;
                    emojiSpamLimitInput.value = currentLimit;
                });
            }
        });
    }
    else {
        console.warn('[_UI_panel_7BTVFZ_] Emoji spam limit input not found');
    }
    // =============================== "Защита от имодзи спама" модального окна  =============================================== //
    // ============================ Обработчики для модального окна "Защита от имодзи спама" =================================== //
    makePanelDraggable(controlPanel);
    makePanelResizable(controlPanel);
    // ========================================= "Настройки" модального окна  ================================================== //
    // ==================================== Обработчики для модального окна "Настройки" ======================================== //
    if (settingsButton && settingsModal && closeSettingsButton) {
        settingsButton.addEventListener('click', () => {
            console.log("[_UI_panel_7BTVFZ_] Settings button clicked");
            settingsModal.classList.remove('closing'); // Удаляем класс закрытия, если есть
            settingsModal.style.display = 'flex'; // Показываем модальное окно
            settingsModal.classList.add('open'); // Запускаем анимацию открытия
            console.log("[_UI_panel_7BTVFZ_] Class 'open' added, modal display:", settingsModal.style.display, settingsModal.classList);
            // Синхронизация чекбоксов с текущим состоянием уведомлений
            const globalSwitch = document.getElementById('global-notification-switch');
            const isolatedSwitch = document.getElementById('isolated-notification-switch');
            if (globalSwitch && window.Notifications) {
                globalSwitch.checked = window.Notifications.isGlobalNotificationsEnabled();
            }
            if (isolatedSwitch && window.Notifications) {
                isolatedSwitch.checked = window.Notifications.isIsolatedNotificationsEnabled();
            }
            settingsModal.focus();
        });
        // Универсальная функция для закрытия модального окна с анимацией
        function closeModal() {
            console.log("[_UI_panel_7BTVFZ_] Closing modal with animation");
            settingsModal.classList.remove('open'); // Удаляем класс открытия
            settingsModal.classList.add('closing'); // Добавляем класс закрытия
            settingsModal.addEventListener('animationend', function handler(event) {
                // Проверяем, что анимация завершена для .modal-content
                if (event.animationName === 'modalClose') {
                    console.log("[_UI_panel_7BTVFZ_] Animation 'modalClose' ended, hiding modal");
                    settingsModal.style.display = 'none';
                    settingsModal.classList.remove('closing');
                    settingsModal.removeEventListener('animationend', handler);
                }
            }, { once: true });
        }
        closeSettingsButton.addEventListener('click', () => {
            console.log("[_UI_panel_7BTVFZ_] Close settings button clicked");
            closeModal(); // Используем универсальную функцию закрытия
        });
 // ====================== Обработчики для ЗАКРЫТИЯ МОДАЛЬНОГО ОКНА ВНЕ НАЖАТИЯ   ================================== //
 // =============== ЗАКОМЕНТИРОВАЛ ПОКА НЕПОНАДОБИТСЯ ============================ // 
          settingsModal.addEventListener('click', (e) => {
         if (e.target === settingsModal) {  
        console.log("[_UI_panel_7BTVFZ_] Settings modal backdrop clicked");  
          closeModal(); // Используем универсальную функцию закрытия
             }  
        });  
    // =============== Обработчики для ЗАКРЫТИЯ МОДАЛЬНОГО ОКНА ВНЕ НАЖАТИЯ   ======================== //
    // ============================= ЗАКОМЕНТИРОВАЛ ПОКА НЕПОНАДОБИТСЯ ============================= // 
    // =================================== Обработчики для чекбоксов уведомлений ================================= //
        if (globalSwitch && toggleGlobalNotificationsButton && window.Notifications) {
            globalSwitch.addEventListener('change', () => {
                const newState = globalSwitch.checked;
                window.Notifications.setGlobalNotificationsEnabled(newState);
                toggleGlobalNotificationsButton.textContent = newState ? 'Global Notifications On' : 'Global Notifications Off';
                toggleGlobalNotificationsButton.classList.toggle('active', newState);
                console.log('[_UI_panel_7BTVFZ_] Global notification switch changed to:', newState);
                if (newState && window.Notifications.isGlobalNotificationsEnabled()) {
                    window.Notifications.showPanelNotification(`Global notifications ${newState ? 'enabled' : 'disabled'}`, 5000, true);
                }
            });
        }
        else {
            console.error('[_UI_panel_7BTVFZ_] Global notification elements or window.Notifications not found:', {
                globalSwitch,
                toggleGlobalNotificationsButton,
                notifications: !!window.Notifications
            });
        }
        if (isolatedSwitch && toggleIsolatedNotificationsButton && window.Notifications) {
            isolatedSwitch.addEventListener('change', () => {
                const newState = isolatedSwitch.checked;
                window.Notifications.setIsolatedNotificationsEnabled(newState);
                toggleIsolatedNotificationsButton.textContent = newState ? 'Isolated Notifications On' : 'Isolated Notifications Off';
                toggleIsolatedNotificationsButton.classList.toggle('active', newState);
                console.log('[_UI_panel_7BTVFZ_] Isolated notification switch changed to:', newState);
                if (window.Notifications.isGlobalNotificationsEnabled()) {
                    window.Notifications.showPanelNotification(`Isolated notifications ${newState ? 'enabled' : 'disabled'}`, 5000, true);
                }
            });
        }
        else {
            console.error('[_UI_panel_7BTVFZ_] Isolated notification elements or window.Notifications not found:', {
                isolatedSwitch,
                toggleIsolatedNotificationsButton,
                notifications: !!window.Notifications
            });
        }
    // =========================================== Обработчики для чекбоксов уведомлений ====================================== //
    // ======================================================================================================================== //
        // --------------------- Обработчик для поля ввода лимита эмодзи -------------------------- //
        // -------- Обработчик для поля ввода лимита эмодзи
        if (emojiSpamLimitInput && window.ChatFilter) {
            emojiSpamLimitInput.addEventListener('change', async () => {
                const newLimit = Number(emojiSpamLimitInput.value);
                let validLimit = newLimit;
                // Проверка на валидность введенного значения
                if (isNaN(newLimit) || newLimit < 1) {
                    validLimit = 1; // Минимальный лимит
                    emojiSpamLimitInput.value = validLimit; // Обновляем поле ввода
                }
                try {
                    console.log('[_UI_panel_7BTVFZ_] Attempting to update emoji spam limit to:', validLimit);
                    // Сохраняем в chrome.storage.local
                    await chrome.storage.local.set({ 'emojiSpamLimit': validLimit });
                    console.log('[_UI_panel_7BTVFZ_] Emoji spam limit saved to chrome.storage.local:', validLimit);
                    // Обновляем лимит в ChatFilter
                    if (typeof window.ChatFilter.setEmojiSpamLimit === 'function') {
                        await window.ChatFilter.setEmojiSpamLimit(validLimit);
                        console.log('[_UI_panel_7BTVFZ_] Emoji spam limit set in ChatFilter:', validLimit);
                    }
                    else {
                        throw new Error('setEmojiSpamLimit is not a function in ChatFilter');
                    }
                    // Обновляем UI
                    if (typeof window.ChatFilter.updateEmojiSpamProtectionUI === 'function') {
                        await window.ChatFilter.updateEmojiSpamProtectionUI();
                        console.log('[_UI_panel_7BTVFZ_] Emoji spam protection UI updated');
                    }
                    // Показываем уведомление
                    showLimitChangedNotification(validLimit);
                    // Применяем фильтрацию чата
                    if (typeof window.ChatFilter.checkEmojiSpamInChat === 'function') {
                        window.ChatFilter.checkEmojiSpamInChat();
                        console.log('[_UI_panel_7BTVFZ_] Chat filter applied with new limit');
                    }
                }
                catch (error) {
                    console.error('[_UI_panel_7BTVFZ_] Error updating emoji spam limit:', error);
                    if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                        window.Notifications.showPanelNotification('Error updating emoji spam limit', 5000, false);
                    }
                }
            });
        }
        else {
            console.error('[_UI_panel_7BTVFZ_] Emoji spam limit input or ChatFilter not found:', {
                emojiSpamLimitInput: !!emojiSpamLimitInput,
                chatFilter: !!window.ChatFilter
            });
        }
        // Функция для отображения уведомления об изменении лимита
        function showLimitChangedNotification(limit) {
            if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                window.Notifications.showPanelNotification(`Emoji spam limit set to ${limit}`, 3000, false);
                console.log('[_UI_panel_7BTVFZ_] Notification shown for emoji spam limit:', limit);
            }
            else {
                console.log('[_UI_panel_7BTVFZ_] Notifications disabled or not available, skipping notification');
            }
        }
    // ==================================== Обработчики для модального окна "Настройки" ======================================== //
    // ========================================= "Настройки" модального окна  ================================================== //
    // ========================================================================================================================= //
    // ======================== ФУНКЦИЯ ПЕРЕТАСКИВАНИЯ МОДАЛЬНОГО ОКНА НАСТРОЕК ПАНЕЛИ ========================================= //
        function makeDraggable(modal) {
            const dragHandle = modal.querySelector('.drag-hwatalka-zahwata-modal-settings');
            const modalContent = modal.querySelector('.modal-content');
            if (!dragHandle || !modalContent) {
                console.error("[_UI_panel_7BTVFZ_] Drag handle or modal content not found", { dragHandle, modalContent });
                return;
            }
            let isDragging = false;
            let currentX = 0;
            let currentY = 0;
            let initialX;
            let initialY;
            // Инициализация начальной позиции
            modalContent.style.position = 'absolute';
            const rect = modalContent.getBoundingClientRect();
            currentX = rect.left;
            currentY = rect.top;
            dragHandle.addEventListener('mousedown', startDragging);
            function startDragging(e) {
                if (e.button !== 0)
                    return;
                e.stopPropagation(); // Предотвращаем запуск других обработчиков
                initialX = e.clientX - currentX;
                initialY = e.clientY - currentY;
                isDragging = true;
                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', stopDragging);
                console.log("[_UI_panel_7BTVFZ_] Dragging started for settings modal");
            }
            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    const modalRect = modalContent.getBoundingClientRect();
                    const maxX = window.innerWidth - modalRect.width;
                    const maxY = window.innerHeight - modalRect.height;
                    currentX = Math.max(0, Math.min(currentX, maxX));
                    currentY = Math.max(0, Math.min(currentY, maxY));
                    modalContent.style.left = `${currentX}px`;
                    modalContent.style.top = `${currentY}px`;
                    console.log("[_UI_panel_7BTVFZ_] Dragging settings modal: ", { x: currentX, y: currentY });
                }
            }
            function stopDragging() {
                isDragging = false;
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', stopDragging);
                console.log("[_UI_panel_7BTVFZ_] Dragging stopped for settings modal");
            }
        }
    // ============================================================================================================================ //
    // ==================================== ОБРАБОТЧИК РЕСАЙЗА ДЛЯ МОДАЛЬНОГО ОКНА 'НАСТРОЙКИ' ===================================== //
        if (settingsModal) {
            console.log("[_UI_panel_7BTVFZ_] Initializing draggable and resizable for settings modal");
            makeDraggable(settingsModal);
            makeModalResizable(settingsModal);
        }
        else {
            console.warn("[_UI_panel_7BTVFZ_] Settings modal not found, retrying...");
            setTimeout(() => {
                const settingsModalRetry = document.getElementById('settings-modal');
                if (settingsModalRetry) {
                    console.log("[_UI_panel_7BTVFZ_] Settings modal found on retry, initializing...");
                    makeDraggable(settingsModalRetry);
                    makeModalResizable(settingsModalRetry);
                }
                else {
                    console.error("[_UI_panel_7BTVFZ_] Settings modal still not found after retry");
                }
            }, 500);
        }
        if (controlPanel) {
            console.log("[_UI_panel_7BTVFZ_] Initializing draggable and resizable for control panel");
            makePanelDraggable(controlPanel);
            makePanelResizable(controlPanel);
        }
        else {
            console.warn("[_UI_panel_7BTVFZ_] Control panel not found");
        }
        // В конец createUI
        if (settingsModal) {
            makeDraggable(settingsModal);
        }
        else {
            console.warn("[_UI_panel_7BTVFZ_] Settings modal not found, retrying...");
            setTimeout(() => {
                const settingsModalRetry = document.getElementById('settings-modal');
                if (settingsModalRetry)
                    makeDraggable(settingsModalRetry);
            }, 500);
        }
    // =============================== ОБРАБОТЧИК РЕСАЙЗА ДЛЯ МОДАЛЬНОГО ОКНА 'НАСТРОЙКИ' ================================= //
    // ============================ ФУНКЦИЯ ПЕРЕТАСКИВАНИЯ МОДАЛЬНОГО ОКНА НАСТРОЕК ПАНЕЛИ ================================ //
    // ==================================================================================================================== //
    // ================ функция emotePickerHandler для автозакрытия и открытия панели после закрытия emote Picker ========= // 
    // ====================== Вызываем обработчик js/emotePickerHandler.js перед return =================================== //
    //========================= Функция автозакрытия и открытия панели перенесена в модуль ================================ //
    // ==================================================================================================================== // 
        handleEmotePickerInteraction(controlPanel, openPanelButton, openPanelLabel, openPanelContainer);
    //========================= Функция автозакрытия и открытия панели перенесена в модуль ================================ //
    // ================ вызов обработчика теперь  есть тут и отдельо  в js/emotePickerHandler.js ========================== //
    // ======== это решает проблему когда просто вынос функкции вместе с его вызовом делает модуль не работающим ========== //
    
   // ===================== Функция для обновления состояния кнопки Media Preview ========================================= //
 function updateMediaPreviewButtonUI() {
 const toggleMediaPreviewButton = document.getElementById('toggle-media-preview-button');
 if (toggleMediaPreviewButton) {
 const isEnabled = getStorage('isLinkProcessingEnabled', false);
 toggleMediaPreviewButton.textContent = isEnabled ? 'Media Preview On' : 'Media Preview Off';
 toggleMediaPreviewButton.classList.toggle('active', isEnabled);
 toggleMediaPreviewButton.classList.toggle('off', !isEnabled); // Добавляем/удаляем класс off
 console.log(`[_UI_panel_7BTVFZ_] Updated media preview button state: ${isEnabled ? 'On' : 'Off'}`);
 } else {
 console.warn('[_UI_panel_7BTVFZ_] toggle-media-preview-button not found');
 }
}

// ================== Экспорт функции
window.updateMediaPreviewButtonUI = updateMediaPreviewButtonUI;

//================= Делегирование событий для кнопки
document.addEventListener('click', (event) => {
    if (event.target.id === 'toggle-media-preview-button') {
        const isEnabled = getStorage('isLinkProcessingEnabled', false);
        const newState = !isEnabled;
        console.log(`[_UI_panel_7BTVFZ_] Toggling media preview to: ${newState}`);
        try {
            if (newState) {
                window.PreviewerMedia.start();
            } else {
                window.PreviewerMedia.stop();
            }
            updateMediaPreviewButtonUI();
            if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                window.Notifications.showPanelNotification(`Media preview ${newState ? 'enabled' : 'disabled'}`, 3000, false);
            }
        } catch (error) {
            console.error('[_UI_panel_7BTVFZ_] Error toggling media preview:', error);
            if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                window.Notifications.showPanelNotification('Error toggling media preview', 5000, false);
            }
        }
    }
});

//=================== Инициализация начального состояния кнопки после загрузки DOM
 

    //================= Инициализация начального состояния кнопки
    updateMediaPreviewButtonUI();

        return {
            controlPanel,
            counter,
            blockedList,
            bannedChatList,
            addInput: document.getElementById('add-input'),
            addButton: document.getElementById('add-button'),
            clearAllButton: document.getElementById('clear-all-button'),
            exportButton: document.getElementById('export-button'),
            importButton: document.getElementById('import-button'),
            toggleLoggingButton: document.getElementById('toggle-logging-button'),
            unblockAllButton: document.getElementById('unblock-all-button'),
            blockAllButton: document.getElementById('block-all-button'),
            showStatsButton: document.getElementById('show-stats-button'),
            openPanelButton,
            searchInput: document.getElementById('search-input'),
            searchButton: document.getElementById('search-button'),
            resetSearchButton: document.getElementById('clear-search-results-button'),
            platformSelect: document.getElementById('platform-select'),
            themeSelect: document.getElementById('theme-select'),
            chartModal: document.getElementById('chart-modal'),
            statsChart: document.getElementById('stats-chart'),
            closeChartButton: document.getElementById('close-chart-button'),
             toggleListsButton,
            dataSelectionModal,
            selectBlockedItemsButton,
            selectBannedkeyWordsPhrasesButton,
            selectBannedUsersButton,
            selectChatBannedItemsButton,
            modalCancelButton,
            hueRotateRange,
            hueRotateValue,
            settingsButton,
            settingsModal,
            closeSettingsButton,
            toggleGlobalNotificationsButton, // Добавляем в возвращаемый объект
            toggleIsolatedNotificationsButton, // Добавляем в возвращаемый объект
            toggleMediaPreviewButton // Добавляем в возвращаемый объект
        };
    }
} // Добавляем закрывающую скобку для функции createUI
 