// ============= модуль ui.js ============= //
function createUI() {
    if (window.location.href.includes('player.twitch.tv') ||
        (window.location.href.includes('twitch.tv/embed') && !window.location.href.includes('popout'))) {
        console.log("[UI] Skipping UI creation in embedded iframe");
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
            console.log("[UI] Settings stylesheet added to <head>");
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
        console.log("[UI] Lists stylesheet added to <head>");
    }
    console.log("[UI] Creating control panel and button...");
    const controlPanelHtml = `
       <div id="control-panel">
     <!------------- Метка подпись активного списка ----------------->
        <div id="active-list-label" class="active-list-label"></div>
     <!------------- Ручки для изменения размера панели ------------->
        <div class="resize-handle top"></div>
        <div class="resize-handle bottom"></div>
        <div class="resize-handle left"></div>
        <div class="resize-handle right"></div>
        <div class="resize-handle top-left"></div>
        <div class="resize-handle top-right"></div>
        <div class="resize-handle bottom-left"></div>
        <div class="resize-handle bottom-right"></div>
     <!------------- Контейнер для кнопок сортировки ------------->
      <div id="sort-chatbanned-items-container"></div>
        <div id="sortContainer"></div>
     <!------------- Контейнер для списков ----------------------->
        <div id="lists-container">
            <ul id="blocked-emotes-list" class="list active">
                <div class="blocked-emotes-list-container"></div>
            </ul>
            <ul id="banned-сhat-list" class="list">
                <div class="banned-сhat-list-container"></div>
            </ul>
        </div>
     <!------------------------ Контейнер для ввода данных --------------------------->
        <div class="input-container">
            <select id="platform-select">
                <option value="TwitchChannel">TwitchChannel</option>
                <option value="7tv">7tv</option>
                <option value="bttTV">bttTV</option>
                <option value="ffz">ffz</option>
                <option value="keyword">Keyword</option>
                <option value="user">User</option>
            </select>
            <input type="text" id="add-input" placeholder="add channel/emote/keyword">
            <button id="add-button">Add it</button>
     <!------------------------ Кнопка для открытия модального окна настроек ---------------------->
            <button id="settings-button" title="Open Settings">Settings</button> 
        </div>
     <!----------------------- Контейнер для управляющих кнопок ------------------------->
        <div class="button-container">  
            <button id="clear-all-button">Delete All</button>
            <button id="show-stats-button">Show Stats Chart</button>
            <button id="export-button">Export</button>
            <button id="import-button">Import</button>
            <button id="toggle-logging-button" class="${isLoggingEnabled() ? 'active' : ''}">
        ${isLoggingEnabled() ? 'Logging On' : 'Logging Off'} 
        </button>
     <!------------------------ Новые кнопки для управления уведомлениями ----------------------------->
    <button id="toggle-global-notifications-button" class="${window.Notifications.isGlobalNotificationsEnabled() ? 'active' : ''}">
        ${window.Notifications.isGlobalNotificationsEnabled() ? 'Global Notifications On' : 'Global Notifications Off'}
    </button>
    <button id="toggle-isolated-notifications-button" class="${window.Notifications.isIsolatedNotificationsEnabled() ? 'active' : ''}">
        ${window.Notifications.isIsolatedNotificationsEnabled() ? 'Isolated Notifications On' : 'Isolated Notifications Off'}
    </button>
            <button id="unblock-all-button">Disable Blocking</button>
            <button id="block-all-button">Enable Blocking</button>
            <button id="clear-search-results-button" class="clear-search-results-button">Clear search results</button>
        </div>
     <!------------------------ Контейнер для кнопки закрытия панели ------------------------>
        <div class="close-panel-container" style="text-align: right;">
            <button id="close-panel-button" style="padding: 5px 10px;">✖ Close</button>
        </div>
     <!------------------------ Метка версии и авторства ---------------------->
        <div class="version-label">v.2.6.55 (C) tapeavion</div>
     <!------------------------ Ползунок для Hue Rotate ------------------->
        <div class="hue-rotate-container">
            <label for="hue-rotate-range">Hue Rotate : <span id="hue-rotate-value">360 °</span></label>
            <input type="range" id="hue-rotate-range" min="0" max="360" value="360">
        </div>
     <!---------------------------- Поле поиска ---------------------->
        <div class="search-input">
            <input type="text" id="search-input" placeholder="Search in blocked list...">
            <button id="search-button">Search</button>
        </div>
     <!------------------------ Выбор темы ------------------------->
        <div class="theme-selector-container">
            <select id="theme-select">
                <option value="default">Default Theme</option>
                <option value="glassmorphism">Glassmorphism Theme</option>
                <option value="dark">Dark Theme</option>
                <option value="sapphireBlue">Blue Sapphire</option>
                <option value="darkRaspberry">Dark Raspberry Theme</option>
                <option value="lightMode">Light Mode</option>
                <option value="deepSeaTurquoise">Deep Sea Turquoise</option>
                <option value="amberBlaze">Amber Blaze</option>
                <option value="amethystGlow">Amethyst Glow</option>
                <option value="darkAncientNights">Dark Ancient Nights </option>
            </select>
        </div>
     <!------------- Модальное окно для графиков ------------->
        <div id="chart-modal" style="display: none;">
            <div class="chart-container">
                <button id="close-chart-button">Close</button>
                <canvas id="stats-chart"></canvas>
            </div>
        </div>
     <!------------- Модальное окно для выбора типа данных ------------->
        <div id="data-selection-modal" class="data-selection-modal" style="display: none;">
            <div class="data-selection-modal-content">
                <h3>Select Data Type</h3>
                <div class="data-selection-modal-options">
                    <button id="select-blocked-items" class="data-selection-modal-button">Blocked Items</button>
                    <button id="select-banned-keywords-phrases-list" class="data-selection-modal-button">Banned Keywords/Phrases</button>
                    <button id="select-banned-users" class="data-selection-modal-button">Banned Users</button>
                    <button id="select-chat-banned-items" class="data-selection-modal-button">Chat Banned Items</button>
                </div>
                <button id="modal-cancel" class="data-selection-modal-button cancel">Cancel</button>
            </div>
        </div>
    <!-------------------------------- Модальное окно настроек --------------------------------->
       <div id="settings-modal" class="modal" style="display: none;" role="dialog" aria-labelledby="settings-title" aria-modal="true">
    <div class="modal-content">
        <button id="close-modal-settings-button" class="close-modal-settings-button" aria-label="Close settings">close ✖</button>
        <h3 id="settings-title">Settings ⚙️</h3>
        <div class="drag-hwatalka-zahwata-modal-settings"></div>
     <!------ Изменено с resize-handle на modal-resize-handle ------>
        <div class="modal-resize-handle"></div>
     <!------ Изменено с resize-handle на modal-resize-handle ------>
        <div class="settings-container">
            <div class="notification-setting">
                <label class="ios-switch-label" for="global-notification-switch">Enable Global Notifications</label>
                <label class="ios-switch">
                    <input type="checkbox" id="global-notification-switch">
                    <span class="slider"></span>
                </label>
            </div>
            <div class="notification-setting">
                <label class="ios-switch-label" for="isolated-notification-switch">Enable Isolated Notifications</label>
                <label class="ios-switch">
                    <input type="checkbox" id="isolated-notification-switch">
                    <span class="slider"></span>
                </label>
            </div>
            <div class="notification-setting">
                <label class="ios-switch-label" for="emoji-spam-protection-switch">Enable Emoji Spam Protection</label>
                <label class="ios-switch">
                    <input type="checkbox" id="emoji-spam-protection-switch" checked>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="notification-setting">
                <label for="emoji-spam-limit-input">Emoji Spam Limit (min 1)</label>
                <input type="number" id="emoji-spam-limit-input" min="1" max="100" value="6">
            </div>
        </div>
    </div>
</div>
     <!---------------------- Счётчик ---------------------->
        <div id="counter"></div>
      </div>
      <div id="open-panel-container" title="Open control panel">
          <span id="open-panel-label"></span>
          <div id="open-panel-button"></div>
      </div>
    `;
    const container = document.createElement('div');
    container.innerHTML = controlPanelHtml;
    document.body.appendChild(container);
    console.log("[UI] Control panel and button container appended to DOM");
    // -------------- Add custom Button openPanel switch ------------------ //
    const newButtonHtml = `
        <div class="Layout-sc-1xcs6mc-0">
            <div class="InjectLayout-sc-1i43xsx-0 kBtJDm">
                <button class="ScCoreButton-sc-ocjdkq-0 kIbAir ScButtonIcon-sc-9yap0r-0 eSFFfM" aria-label="Custom Action" data-a-target="custom-button">
                    <div class="ButtonIconFigure-sc-1emm8lf-0 buvMbr">
                        <div class="ScSvgWrapper-sc-wkgzod-0 jHiZwZ tw-svg">
                            <svg width="20" height="20" viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="presentation">
                                <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-6a1 1 0 112 0v3a1 1 0 11-2 0v3zm0-3a1 1 0 112 0 1 1 0 01-2 0z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    `;
    //------------- Наблюдатель для динамической загрузки заголовка чата ------------------ //
    function observeChatHeader() {
        if (window.location.href.includes('twitch.tv/popout') || window.location.href.includes('twitch.tv/embed')) {
            const observer = new MutationObserver(() => {
                const chatHeader = document.querySelector('.Layout-sc-1xcs6mc-0.fiHaCw.stream-chat-header');
                if (chatHeader && !chatHeader.querySelector('[data-a-target="custom-button"]')) {
                    console.log("[UI] Chat header appeared, adding custom button...");
                    const buttonContainer = document.createElement('div');
                    buttonContainer.innerHTML = `
                        <div class="Layout-sc-1xcs6mc-0">
                            <div class="InjectLayout-sc-1i43xsx-0 kBtJDm">
                                <button class="ScCoreButton-sc-ocjdkq-0 kIbAir ScButtonIcon-sc-9yap0r-0 eSFFfM" aria-label="Custom Action" data-a-target="custom-button">
                                    <div class="ButtonIconFigure-sc-1emm8lf-0 buvMbr">
                                        <div class="ScSvgWrapper-sc-wkgzod-0 jHiZwZ tw-svg">
                                            <svg width="20" height="20" viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="presentation">
                                                <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-6a1 1 0 112 0v3a1 1 0 11-2 0v3zm0-3a1 1 0 112 0 1 1 0 01-2 0z" clip-rule="evenodd"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    `;
                    const targetContainer = chatHeader.querySelector('.InjectLayout-sc-1i43xsx-0.kBtJDm') || chatHeader;
                    targetContainer.insertAdjacentElement('afterend', buttonContainer);
                    console.log("[UI] Custom button added to dynamically loaded chat header");
                    // ------------------ Добавляем обработчик для кнопки ------------------ //
                    buttonContainer.querySelector('[data-a-target="custom-button"]').addEventListener('click', () => {
                        chrome.runtime.sendMessage({ action: 'openControlPanel' }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.error("[UI] Error sending openControlPanel message:", chrome.runtime.lastError);
                            }
                            else {
                                console.log("[UI] openControlPanel message sent:", response);
                            }
                        });
                    });
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            console.log("[UI] Observing DOM for chat header");
        }
    }
    const targetContainer = document.querySelector('.Layout-sc-1xcs6mc-0.czRfnU');
    if (targetContainer) {
        targetContainer.insertAdjacentHTML('beforeend', newButtonHtml);
        console.log("[UI] Custom button added next to 'Go Ad-Free for Free'");
    }
    else {
        console.warn("[UI] Target container for custom button not found");
    }
    let themeStylesheet = document.getElementById('theme-stylesheet');
    if (!themeStylesheet) {
        themeStylesheet = document.createElement('link');
        themeStylesheet.id = 'theme-stylesheet';
        themeStylesheet.rel = 'stylesheet';
        document.head.appendChild(themeStylesheet);
        console.log("[UI] Theme stylesheet added to <head>");
    }
    const controlPanel = document.getElementById('control-panel');
    const sortContainer = document.getElementById('sortContainer');
    const sortchatbanneditemsContainer = document.getElementById('sort-chatbanned-items-container');
    const counter = document.getElementById('counter');
    const openPanelContainer = document.getElementById('open-panel-container');
    const openPanelLabel = document.getElementById('open-panel-label');
    const openPanelButton = document.getElementById('open-panel-button');
    const bannedСhatListButton = document.getElementById('banned-chat-list-button');
    const toggleListsButton = document.getElementById('toggle-lists-button');
    const blockedList = document.getElementById('blocked-emotes-list');
    const bannedСhatList = document.getElementById('banned-сhat-list');
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
    // Проверка инициализации элементов
    console.log("[UI] Elements initialized:", {
        controlPanel,
        settingsModal,
        toggleGlobalNotificationsButton,
        toggleIsolatedNotificationsButton,
        globalSwitch,
        isolatedSwitch,
        emojiSpamSwitch,
        emojiSpamLimitInput
    });
    console.log("[UI] Modal elements initialized:", {
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
        console.log("[UI] Loaded sort orders:", { currentSortOrder, currentBannedChatSortOrder });
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
    goToLastBannedChatButton.innerHTML = 'Go To New Added Element ▼';
    goToLastBannedChatButton.style.cssText = 'cursor: pointer;';
    goToLastBannedChatButton.onclick = goToLastBannedChatItem; // Новая функция для второго списка
    sortchatbanneditemsContainer.appendChild(goToLastBannedChatButton);
    // ---------------- Сортировщик кнопки sortBannedChatItems ------------------ //
    // ------------------- Sorting blockedEmotes buttons ---------------------- //
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
            console.log("[UI] Saved emotes sort order:", currentSortOrder);
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
    // -------------- Создание двух кнопок ------------------ //
    const blockedEmotesButton = document.createElement('button');
    blockedEmotesButton.id = 'blocked-emotes-button';
    blockedEmotesButton.textContent = 'Blocked Emotes';
    blockedEmotesButton.style.cssText = 'cursor: pointer; margin-right: 10px;';
    const bannedChatListButton = document.createElement('button');
    bannedChatListButton.id = 'banned-chat-list-button';
    bannedChatListButton.textContent = 'Banned Chat List ';
    bannedChatListButton.style.cssText = 'cursor: pointer;';
    // ------------------ Добавление кнопок в контейнер -------------------- //
    const buttonContainer = document.querySelector('.button-container');
    // ---------------- И замените их на добавление в конец контейнера --------------------- //
    buttonContainer.appendChild(bannedChatListButton);
    buttonContainer.appendChild(blockedEmotesButton);
    // Функция управления видимостью сортировочных кнопок
    function updateSortButtonsVisibility() {
        if (currentList === 'blockedEmotes') {
            sortContainer.style.display = 'flex'; // Используем flex вместо block
            sortchatbanneditemsContainer.style.display = 'none';
            console.log("[UI] Showing sortContainer for blocked-emotes-list");
        }
        else if (currentList === 'bannedWords') {
            sortContainer.style.display = 'none';
            sortchatbanneditemsContainer.style.display = 'flex'; // Используем flex вместо block
            console.log("[UI] Showing sort-chatbanned-items-container for banned-сhat-list");
        }
    }
    // --------- Функция для обновления состояния кнопок bannedChatListButton и blockedEmotesButton ---------- //
    // Функция для обновления стилей кнопок переключения списков
    function updateButtonStyles() {
        if (currentList === 'blockedEmotes') {
            blockedEmotesButton.style.backgroundColor = ' #0c7036';
            blockedEmotesButton.style.color = 'white';
            bannedChatListButton.style.backgroundColor = '';
            bannedChatListButton.style.color = '';
        }
        else if (currentList === 'bannedWords') {
            bannedChatListButton.style.backgroundColor = ' #0c7036';
            bannedChatListButton.style.color = 'white';
            blockedEmotesButton.style.backgroundColor = '';
            blockedEmotesButton.style.color = '';
        }
        updateSortButtonsVisibility(); // Обновляем видимость сортировочных кнопок
    }
    // ----------------- Обработчики для кнопок переключения списков ----------------- //
    blockedEmotesButton.onclick = () => {
        console.log("[UI] Нажата кнопка Blocked Emotes");
        blockedList.style.transform = 'translateX(0)';
        bannedСhatList.style.transform = 'translateX(-104%)';
        currentList = 'blockedEmotes';
        updateBlockedEmotesList(blockedList, getBlockedItems());
        setStorage('currentList', currentList);
        updateButtonStyles();
    };
    bannedChatListButton.onclick = () => {
        console.log("[UI] Нажата кнопка Banned Chat List");
        blockedList.style.transform = 'translateX(104%)';
        bannedСhatList.style.transform = 'translateX(0)';
        currentList = 'bannedWords';
        updateBannedСhatList(bannedСhatList, getBlockedItems());
        setStorage('currentList', currentList);
        updateButtonStyles();
    };
    // ----------------- Инициализация состояния кнопок ------------------------------ //
    // Инициализация видимости сортировочных кнопок
    updateSortButtonsVisibility();
    updateButtonStyles();
    // ----------------- Hue Rotate: Загрузка сохраненного значения ------------------ //
    chrome.storage.local.get(['hueRotateValue'], (result) => {
        const value = result.hueRotateValue || 360;
        hueRotateRange.value = value;
        hueRotateValue.textContent = value;
        controlPanel.style.filter = `hue-rotate(${value}deg)`;
        console.log("[UI] Hue Rotate value loaded:", value);
    });
    // -------------- Hue Rotate: Обработчик изменения значения ------------------ //
    hueRotateRange.addEventListener('input', () => {
        const value = hueRotateRange.value;
        hueRotateValue.textContent = value;
        controlPanel.style.filter = value == 0 ? 'none' : `hue-rotate(${value}deg)`;
        chrome.storage.local.set({ hueRotateValue: value }, () => {
            console.log("[UI] Hue Rotate value saved:", value);
        });
    });
    // ========================= обработчик для кнопки открытия И закрытия панели  ==================================== //
    // ------------------- Panel visibility --------------------------------- //
    const isVisible = getStorage('panelVisible', false);
    console.log("[UI] Panel visibility state:", isVisible);
    controlPanel.classList.toggle('visible', isVisible);
    openPanelButton.classList.toggle('active', isVisible);
    openPanelLabel.textContent = isVisible ? 'Close Panel' : 'Open Panel';
    openPanelContainer.setAttribute('aria-label', isVisible ? 'Close control panel' : 'Open control panel');
    openPanelContainer.title = isVisible ? 'Close control panel' : 'Open control panel';
    // -------------- Добавляем обработчик для кнопки открытия панели ------------------ //
    openPanelContainer.addEventListener('click', () => {
        console.log("[UI] Open panel container clicked");
        const isVisible = controlPanel.classList.contains('visible');
        controlPanel.classList.toggle('visible', !isVisible);
        openPanelButton.classList.toggle('active', !isVisible);
        openPanelLabel.textContent = isVisible ? 'Open Panel' : 'Close Panel';
        openPanelContainer.setAttribute('aria-label', isVisible ? 'Open control panel' : 'Close control panel');
        openPanelContainer.title = isVisible ? 'Open control panel' : 'Close control panel';
        setStorage('panelVisible', !isVisible);
    });
    // -------------- Добавляем обработчик для кнопки закрытия панели -------------- //
    const closePanelButton = document.getElementById('close-panel-button');
    closePanelButton.addEventListener('click', () => {
        console.log("[UI] Close panel button clicked");
        controlPanel.classList.remove('visible');
        openPanelButton.classList.remove('active');
        openPanelLabel.textContent = 'Open Panel';
        openPanelContainer.setAttribute('aria-label', 'Open control panel');
        openPanelContainer.title = 'Open control panel';
        setStorage('panelVisible', false);
    });
    // ========================= обработчик для кнопки открытия И закрытия панели  ==================================== //
    // ===================================== Включение и отключение уведомлений ================================================ //
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
        console.log("[UI] Notification states loaded:", { globalState, isolatedState });
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
        console.log("[UI] Global notifications toggled:", newState);
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
        console.log("[UI] Isolated notifications toggled:", newState);
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
            console.log('[UI] Emoji spam protection switch initialized:', isEnabled);
        });
        emojiSpamSwitch.addEventListener('change', async () => {
            const newState = emojiSpamSwitch.checked;
            console.log('[UI] Emoji spam protection switch changed to:', newState);
            try {
                await window.ChatFilter.setEmojiSpamProtectionEnabled(newState);
                console.log('[UI] Emoji spam protection set to:', newState);
                if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                    window.Notifications.showPanelNotification(`Emoji spam protection ${newState ? 'enabled' : 'disabled'}`, 3000, false);
                }
            }
            catch (error) {
                console.error('[UI] Error setting emoji spam protection:', error);
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
        console.warn('[UI] Emoji spam protection switch not found');
    }
    // ============== Функция ожидания инициализации window.ChatFilter ================ //
    // ============== Относится к категории ChatFilter модуля ================ //
    async function waitForChatFilter(maxAttempts = 22, delay = 500) {
        for (let i = 0; i < maxAttempts; i++) {
            if (typeof window.ChatFilter.setEmojiSpamLimit === 'function') {
                console.log('[UI] ChatFilter.setEmojiSpamLimit is available');
                return true;
            }
            console.log(`[UI] ChatFilter.setEmojiSpamLimit not available, retrying (${i + 1}/${maxAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        console.error('[UI] ChatFilter.setEmojiSpamLimit not available after max attempts');
        return false;
    }
    // ==============  Обработчик для поля ввода лимита эмодзи =================== //
    if (emojiSpamLimitInput) {
        chrome.storage.local.get(['emojiSpamLimit'], (result) => {
            const limit = result.emojiSpamLimit || 6;
            emojiSpamLimitInput.value = limit;
            console.log('[UI] Emoji spam limit input initialized:', limit);
        });
        emojiSpamLimitInput.addEventListener('input', async () => {
            const newLimit = Number(emojiSpamLimitInput.value);
            let validLimit = newLimit;
            // Проверка на валидность введенного значения
            if (isNaN(newLimit) || newLimit < 1) {
                validLimit = 1; // Минимальный лимит
                emojiSpamLimitInput.value = validLimit; // Обновляем поле ввода
            }
            console.log('[UI] Emoji spam limit input changed to:', validLimit);
            try {
                const isChatFilterReady = await waitForChatFilter();
                if (isChatFilterReady) {
                    await window.ChatFilter.setEmojiSpamLimit(validLimit);
                    console.log('[UI] Emoji spam limit set to:', validLimit);
                    if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                        window.Notifications.showPanelNotification(`Emoji spam limit set to ${validLimit}`, 3000, false);
                    }
                }
                else {
                    throw new Error('setEmojiSpamLimit is not available');
                }
            }
            catch (error) {
                console.error('[UI] Error updating emoji spam limit:', error);
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
        console.warn('[UI] Emoji spam limit input not found');
    }
    // =============================== "Защита от имодзи спама" модального окна  =============================================== //
    // ============================ Обработчики для модального окна "Защита от имодзи спама" =================================== //
    makePanelDraggable(controlPanel);
    makePanelResizable(controlPanel);
    // ========================================= "Настройки" модального окна  ================================================== //
    // ==================================== Обработчики для модального окна "Настройки" ======================================== //
    if (settingsButton && settingsModal && closeSettingsButton) {
        settingsButton.addEventListener('click', () => {
            console.log("[UI] Settings button clicked");
            settingsModal.classList.remove('closing'); // Удаляем класс закрытия, если есть
            settingsModal.style.display = 'flex'; // Показываем модальное окно
            settingsModal.classList.add('open'); // Запускаем анимацию открытия
            console.log("[UI] Class 'open' added, modal display:", settingsModal.style.display, settingsModal.classList);
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
            console.log("[UI] Closing modal with animation");
            settingsModal.classList.remove('open'); // Удаляем класс открытия
            settingsModal.classList.add('closing'); // Добавляем класс закрытия
            settingsModal.addEventListener('animationend', function handler(event) {
                // Проверяем, что анимация завершена для .modal-content
                if (event.animationName === 'modalClose') {
                    console.log("[UI] Animation 'modalClose' ended, hiding modal");
                    settingsModal.style.display = 'none';
                    settingsModal.classList.remove('closing');
                    settingsModal.removeEventListener('animationend', handler);
                }
            }, { once: true });
        }
        closeSettingsButton.addEventListener('click', () => {
            console.log("[UI] Close settings button clicked");
            closeModal(); // Используем универсальную функцию закрытия
        });
        // =================================== Обработчики для ЗАКРЫТИЯ МОДАЛЬНОГО ОКНА ВНЕ НАЖАТИЯ   ================================== //
        // ========= ЗАКОМЕНТИРОВАЛ ПОКА НЕПОНАДОБИТСЯ ========== // 
        //  settingsModal.addEventListener('click', (e) => {
        //  if (e.target === settingsModal) { //
        //  console.log("[UI] Settings modal backdrop clicked"); //
        //   closeModal(); // Используем универсальную функцию закрытия
        //     } //
        // }); //
        // =============== Обработчики для ЗАКРЫТИЯ МОДАЛЬНОГО ОКНА ВНЕ НАЖАТИЯ   ================= //
        // ============================= ЗАКОМЕНТИРОВАЛ ПОКА НЕПОНАДОБИТСЯ ============================= // 
        // =================================== Обработчики для чекбоксов уведомлений ================================= //
        if (globalSwitch && toggleGlobalNotificationsButton && window.Notifications) {
            globalSwitch.addEventListener('change', () => {
                const newState = globalSwitch.checked;
                window.Notifications.setGlobalNotificationsEnabled(newState);
                toggleGlobalNotificationsButton.textContent = newState ? 'Global Notifications On' : 'Global Notifications Off';
                toggleGlobalNotificationsButton.classList.toggle('active', newState);
                console.log('[UI] Global notification switch changed to:', newState);
                if (newState && window.Notifications.isGlobalNotificationsEnabled()) {
                    window.Notifications.showPanelNotification(`Global notifications ${newState ? 'enabled' : 'disabled'}`, 5000, true);
                }
            });
        }
        else {
            console.error('[UI] Global notification elements or window.Notifications not found:', {
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
                console.log('[UI] Isolated notification switch changed to:', newState);
                if (window.Notifications.isGlobalNotificationsEnabled()) {
                    window.Notifications.showPanelNotification(`Isolated notifications ${newState ? 'enabled' : 'disabled'}`, 5000, true);
                }
            });
        }
        else {
            console.error('[UI] Isolated notification elements or window.Notifications not found:', {
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
                    console.log('[UI] Attempting to update emoji spam limit to:', validLimit);
                    // Сохраняем в chrome.storage.local
                    await chrome.storage.local.set({ 'emojiSpamLimit': validLimit });
                    console.log('[UI] Emoji spam limit saved to chrome.storage.local:', validLimit);
                    // Обновляем лимит в ChatFilter
                    if (typeof window.ChatFilter.setEmojiSpamLimit === 'function') {
                        await window.ChatFilter.setEmojiSpamLimit(validLimit);
                        console.log('[UI] Emoji spam limit set in ChatFilter:', validLimit);
                    }
                    else {
                        throw new Error('setEmojiSpamLimit is not a function in ChatFilter');
                    }
                    // Обновляем UI
                    if (typeof window.ChatFilter.updateEmojiSpamProtectionUI === 'function') {
                        await window.ChatFilter.updateEmojiSpamProtectionUI();
                        console.log('[UI] Emoji spam protection UI updated');
                    }
                    // Показываем уведомление
                    showLimitChangedNotification(validLimit);
                    // Применяем фильтрацию чата
                    if (typeof window.ChatFilter.checkEmojiSpamInChat === 'function') {
                        window.ChatFilter.checkEmojiSpamInChat();
                        console.log('[UI] Chat filter applied with new limit');
                    }
                }
                catch (error) {
                    console.error('[UI] Error updating emoji spam limit:', error);
                    if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                        window.Notifications.showPanelNotification('Error updating emoji spam limit', 5000, false);
                    }
                }
            });
        }
        else {
            console.error('[UI] Emoji spam limit input or ChatFilter not found:', {
                emojiSpamLimitInput: !!emojiSpamLimitInput,
                chatFilter: !!window.ChatFilter
            });
        }
        // Функция для отображения уведомления об изменении лимита
        function showLimitChangedNotification(limit) {
            if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                window.Notifications.showPanelNotification(`Emoji spam limit set to ${limit}`, 3000, false);
                console.log('[UI] Notification shown for emoji spam limit:', limit);
            }
            else {
                console.log('[UI] Notifications disabled or not available, skipping notification');
            }
        }
        // ==================================== Обработчики для модального окна "Настройки" ======================================== //
        // ========================================= "Настройки" модального окна  ================================================== //
        // ==================================================================================================================== //
        // ======================== ФУНКЦИЯ ПЕРЕТАСКИВАНИЯ МОДАЛЬНОГО ОКНА НАСТРОЕК ПАНЕЛИ =================================== //
        function makeDraggable(modal) {
            const dragHandle = modal.querySelector('.drag-hwatalka-zahwata-modal-settings');
            const modalContent = modal.querySelector('.modal-content');
            if (!dragHandle || !modalContent) {
                console.error("[UI] Drag handle or modal content not found", { dragHandle, modalContent });
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
                console.log("[UI] Dragging started for settings modal");
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
                    console.log("[UI] Dragging settings modal: ", { x: currentX, y: currentY });
                }
            }
            function stopDragging() {
                isDragging = false;
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', stopDragging);
                console.log("[UI] Dragging stopped for settings modal");
            }
        }
        // ============================================================================================================================ //
        // ==================================== ОБРАБОТЧИК РЕСАЙЗА ДЛЯ МОДАЛЬНОГО ОКНА 'НАСТРОЙКИ' ===================================== //
        if (settingsModal) {
            console.log("[UI] Initializing draggable and resizable for settings modal");
            makeDraggable(settingsModal);
            makeModalResizable(settingsModal);
        }
        else {
            console.warn("[UI] Settings modal not found, retrying...");
            setTimeout(() => {
                const settingsModalRetry = document.getElementById('settings-modal');
                if (settingsModalRetry) {
                    console.log("[UI] Settings modal found on retry, initializing...");
                    makeDraggable(settingsModalRetry);
                    makeModalResizable(settingsModalRetry);
                }
                else {
                    console.error("[UI] Settings modal still not found after retry");
                }
            }, 500);
        }
        if (controlPanel) {
            console.log("[UI] Initializing draggable and resizable for control panel");
            makePanelDraggable(controlPanel);
            makePanelResizable(controlPanel);
        }
        else {
            console.warn("[UI] Control panel not found");
        }
        // В конец createUI
        if (settingsModal) {
            makeDraggable(settingsModal);
        }
        else {
            console.warn("[UI] Settings modal not found, retrying...");
            setTimeout(() => {
                const settingsModalRetry = document.getElementById('settings-modal');
                if (settingsModalRetry)
                    makeDraggable(settingsModalRetry);
            }, 500);
        }
        // =============================== ОБРАБОТЧИК РЕСАЙЗА ДЛЯ МОДАЛЬНОГО ОКНА 'НАСТРОЙКИ' ===================================== //
        // ============================ ФУНКЦИЯ ПЕРЕТАСКИВАНИЯ МОДАЛЬНОГО ОКНА НАСТРОЕК ПАНЕЛИ ==================================== //
        // =========================================================================================================================== //
        // ================ функция emotePickerHandler для автозакрытия и открытия панели после закрытия emote Picker =============== // 
        // ====================== Вызываем обработчик js/emotePickerHandler.js перед return ============================== //
        //========================= Функция автозакрытия и открытия панели перенесена в модуль ============================= //
        // ================================================================================================================ // 
        handleEmotePickerInteraction(controlPanel, openPanelButton, openPanelLabel, openPanelContainer);
        //========================= Функция автозакрытия и открытия панели перенесена в модуль ============================= //
        // ================ вызов обработчика теперь  есть тут и отдельо  в js/emotePickerHandler.js ========================= //
        // ======== это решает проблему когда просто вынос функкции вместе с его вызовом делает модуль не работающим ========= //
        return {
            controlPanel,
            counter,
            blockedList,
            bannedСhatList,
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
            bannedСhatListButton,
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
            toggleIsolatedNotificationsButton // Добавляем в возвращаемый объект
        };
    }
} // Добавляем закрывающую скобку для функции createUI
//# sourceMappingURL=ui.js.map