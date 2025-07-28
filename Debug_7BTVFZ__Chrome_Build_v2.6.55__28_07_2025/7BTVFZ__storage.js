(function () {
    let isStorageInitialized = false;

    function initializeStorage() {
        if (isStorageInitialized) {
            console.log('[Content] Storage already initialized, skipping...');
            return;
        }

        isStorageInitialized = true;

        if (!getStorage('bannedKeywords')) {
            setStorage('bannedKeywords', []);
            console.log('[Content] Initialized bannedKeywords storage');
        }
        if (!getStorage('bannedUsers')) {
            setStorage('bannedUsers', []);
            console.log('[Content] Initialized bannedUsers storage');
        } 
        if (!getStorage('isBlockingEnabled')) {
            setStorage('isBlockingEnabled', true);
            console.log('[Content] Initialized isBlockingEnabled storage');
        }
        if (!getStorage('isKeywordBlockingEnabled')) {
            setStorage('isKeywordBlockingEnabled', true);
            console.log('[Content] Initialized isKeywordBlockingEnabled storage');
        }
        if (!getStorage('blockedEmotes')) {
            setStorage('blockedEmotes', []);
            console.log('[Content] Initialized blockedEmotes storage');
        }
        if (!getStorage('blockedChannels')) {
            setStorage('blockedChannels', []);
            console.log('[Content] Initialized blockedChannels storage');
        } 
        if (!getStorage('chatBannedItems')) {
            setStorage('chatBannedItems', []);
            console.log('[Content] Initialized chatBannedItems storage');
        }
        if (!getStorage('globalNotificationsEnabled')) {
            setStorage('globalNotificationsEnabled', false);
            console.log('[Content] Initialized globalNotificationsEnabled storage');
        }
       if (!getStorage('isolatedNotificationsEnabled')) {
       setStorage('isolatedNotificationsEnabled', false);
            console.log('[Content] Initialized panelNotificationsEnabled storage');
        }
        if (!getStorage('renamedTwitchUsers')) {
    setStorage('renamedTwitchUsers', {});
    console.log('[Content] Initialized renamedTwitchUsers storage');
}

       
      
       
        const bannedChatList = document.querySelector('.banned-сhat-list-container');
        if (bannedChatList) {
            updateBannedChatList(bannedChatList, {
                bannedKeywords: getStorage('bannedKeywords', []),
                bannedUsers: getStorage('bannedUsers', []), 
                chatBannedItems: getStorage('chatBannedItems', []),
                newlyAddedIds: new Set(),
                lastKeyword: null
            });
        }
    }

    // Функция чтения из localStorage
    function getStorage(key, defaultValue) {
        const rawData = localStorage.getItem(key);
        try {
            if (!rawData) return defaultValue;
            const parsed = JSON.parse(rawData);
            if (key === 'bannedUsers' || key === 'bannedKeywords') {
                return Array.isArray(parsed) ? parsed : defaultValue;
            }
            return parsed;
        } catch (e) {
            console.error(`[Storage] Error parsing ${key}:`, e);
            return defaultValue;
        }
    }

    // Функция записи в localStorage
    function setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            console.log(`[Storage] Saved ${key}:`, typeof value === 'object' ? value.length : value, 'items');
            return true;
        } catch (e) {
            console.error(`[Storage] Error saving ${key}:`, e);
            return false;
        }
    }

    // Привязываем функции к window для глобального доступа 
    window.initializeStorage = initializeStorage;
    window.setStorage = setStorage;
    window.getStorage = getStorage;

    console.log("[UI] 7BTVFZ__storage module initialized");
})();