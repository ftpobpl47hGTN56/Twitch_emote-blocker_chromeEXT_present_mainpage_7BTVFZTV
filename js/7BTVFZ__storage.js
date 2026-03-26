// 7BTVFZ__storage.js //

 'use strict';

 
    function initializeStorage() {
        if (isStorageInitialized) {
            console.log('_initializeStorage_7btvfz_ Storage already initialized, skipping...');
            return;
        } 
        // Инициализация bannedKeywords
        if (!localStorage.getItem('bannedKeywords')) {
            localStorage.setItem('bannedKeywords', JSON.stringify([]));
            console.log('_initializeStorage_7btvfz_ Initialized bannedKeywords storage');
        } 
        // Инициализация bannedUsers
        if (!localStorage.getItem('bannedUsers')) {
            localStorage.setItem('bannedUsers', JSON.stringify([]));
            console.log('_initializeStorage_7btvfz_ Initialized bannedUsers storage');
        }

        // Остальные ключи без кэширования
        if (!localStorage.getItem('isLinkProcessingEnabled')) {
            localStorage.setItem('isLinkProcessingEnabled', JSON.stringify(false));
            console.log('_initializeStorage_7btvfz_ Initialized isLinkProcessingEnabled storage');
        }
        if (!localStorage.getItem('isColonReplacementEnabled')) {
            localStorage.setItem('isColonReplacementEnabled', JSON.stringify(false));
            console.log('_initializeStorage_7btvfz_ Initialized isColonReplacementEnabled storage');
        }
        if (!localStorage.getItem('isBlockingEnabled')) {
            localStorage.setItem('isBlockingEnabled', JSON.stringify(true));
            console.log('_initializeStorage_7btvfz_ Initialized isBlockingEnabled storage');
        }
        if (!localStorage.getItem('isKeywordBlockingEnabled')) {
            localStorage.setItem('isKeywordBlockingEnabled', JSON.stringify(true));
            console.log('_initializeStorage_7btvfz_ Initialized isKeywordBlockingEnabled storage');
        }
        if (!localStorage.getItem('blockedEmotes')) {
            localStorage.setItem('blockedEmotes', JSON.stringify([]));
            console.log('_initializeStorage_7btvfz_ Initialized blockedEmotes storage');
        }
        if (!localStorage.getItem('blockedChannels')) {
            localStorage.setItem('blockedChannels', JSON.stringify([]));
            console.log('_initializeStorage_7btvfz_ Initialized blockedChannels storage');
        }
        if (!localStorage.getItem('chatBannedItems')) {
            localStorage.setItem('chatBannedItems', JSON.stringify([]));
            console.log('_initializeStorage_7btvfz_ Initialized chatBannedItems storage');
        }
        if (!localStorage.getItem('globalNotificationsEnabled')) {
            localStorage.setItem('globalNotificationsEnabled', JSON.stringify(false));
            console.log('_initializeStorage_7btvfz_ Initialized globalNotificationsEnabled storage');
        }
        if (!localStorage.getItem('isolatedNotificationsEnabled')) {
            localStorage.setItem('isolatedNotificationsEnabled', JSON.stringify(false));
            console.log('_initializeStorage_7btvfz_ Initialized panelNotificationsEnabled storage');
        }
        if (!localStorage.getItem('emotePickerSelector')) {
            localStorage.setItem('emotePickerSelector', JSON.stringify('[data-a-target="emote-picker-button"]'));
            console.log('_initializeStorage_7btvfz_ Initialized emotePickerSelector storage');
        }

        const bannedChatList = document.querySelector('.banned-chat-list-container');
        if (bannedChatList) {
            updateBannedChatList(bannedChatList, {
                bannedKeywords: JSON.parse(localStorage.getItem('bannedKeywords') || '[]'),
                bannedUsers: JSON.parse(localStorage.getItem('bannedUsers') || '[]'),
                chatBannedItems: JSON.parse(localStorage.getItem('chatBannedItems') || '[]'),
                newlyAddedIds: new Set(),
                lastKeyword: null
            });
        }
    }

    // Функция чтения из localStorage без кэша
    function getStorage(key, defaultValue) {
        const rawData = localStorage.getItem(key);
        try {
            if (!rawData) {
                return defaultValue;
            }
            return JSON.parse(rawData);
        } catch (e) {
            console.error(`[_Storage_7BTVFZ_] Error parsing ${key}:`, e);
            return defaultValue;
        }
    }

    // Функция записи в localStorage без кэша
    function setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            console.log(`[_Storage_7BTVFZ_] Saved ${key}:`, typeof value === 'object' && value !== null ? value.length : value, 'items');

            // Обновляем глобальные переменные
            if (key === 'bannedKeywords') {
                window.bannedKeywords = Array.isArray(value) ? value : [];
            } else if (key === 'bannedUsers') {
                window.bannedUsers = Array.isArray(value) ? value : [];
            }
            return true;
        } catch (e) {
            console.error(`[_Storage_7BTVFZ_] Error saving ${key}:`, e);
            return false;
        }
    }

    // Привязываем функции к window для глобального доступа
    window.initializeStorage = initializeStorage;
    window.setStorage = setStorage;
    window.getStorage = getStorage;
    console.log("[_Storage_7BTVFZ_]  module initialized");
 