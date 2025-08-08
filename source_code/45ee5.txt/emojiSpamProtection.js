// emojiSpamProtection.js
(function () {
    'use strict';
    let isEmojiSpamProtectionEnabled = true;
    let emojiSpamLimit = 6;
    function getStorage(key, defaultValue) {
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                const value = result[key] !== undefined ? result[key] : defaultValue;
                console.log(`[EmojiSpamProtection] Retrieved ${key}:`, value);
                resolve(value);
            });
        });
    }
    function setStorage(key, value) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ [key]: value }, () => {
                if (chrome.runtime.lastError) {
                    console.error(`[EmojiSpamProtection] Error saving ${key}:`, chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                }
                else {
                    console.log(`[EmojiSpamProtection] Saved ${key}:`, value);
                    resolve(true);
                }
            });
        });
    }
    function checkEmojiSpamInChat() {
        console.log(`[EmojiSpamProtection] Checking for emoji spam (enabled: ${isEmojiSpamProtectionEnabled}, limit: ${emojiSpamLimit})`);
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-a-target="chat-room-content"]');
        if (!chatContainer) {
            console.log("[EmojiSpamProtection] Chat container not found");
            return;
        }
        const messages = chatContainer.querySelectorAll('.chat-line__message');
        messages.forEach(message => {
            const messageContent = message.querySelector('.message');
            if (!messageContent) {
                console.log("[EmojiSpamProtection] Message content not found in:", message);
                return;
            }
            if (isEmojiSpamProtectionEnabled) {
                const emotes = messageContent.querySelectorAll('.chat-line__message img, .chat-line__message .emote, ' +
                    '.chat-line__message .bttv-emote, .chat-line__message .seventv-emote, ' +
                    '.chat-line__message .ffz-emote, .chat-line__message .twitch-emote');
                const textContent = messageContent.textContent || '';
                const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
                const unicodeEmojis = (textContent.match(emojiRegex) || []).length;
                const totalEmojis = emotes.length + unicodeEmojis;
                if (totalEmojis > emojiSpamLimit) {
                    messageContent.style.display = 'none';
                    messageContent.dataset.emojiSpamHidden = 'true';
                    console.log(`[EmojiSpamProtection] Hid message content with ${totalEmojis} emojis (Graphical: ${emotes.length}, Unicode: ${unicodeEmojis})`);
                    if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                        window.Notifications.showPanelNotification(`Message content hidden due to emoji spam (${totalEmojis} emojis)`, 3000, false);
                    }
                }
                else {
                    if (messageContent.dataset?.emojiSpamHidden === 'true') {
                        messageContent.style.display = '';
                        delete messageContent.dataset.emojiSpamHidden;
                        console.log("[EmojiSpamProtection] Restored message content visibility");
                    }
                }
            }
            else {
                if (messageContent.dataset?.emojiSpamHidden === 'true') {
                    messageContent.style.display = '';
                    delete messageContent.dataset.emojiSpamHidden;
                    console.log("[EmojiSpamProtection] Restored message content visibility");
                }
            }
        });
    }
    async function setEmojiSpamProtectionEnabled(state) {
        isEmojiSpamProtectionEnabled = state;
        await setStorage('isEmojiSpamProtectionEnabled', state);
        console.log(`[EmojiSpamProtection] Emoji spam protection set to: ${state}`);
        await checkEmojiSpamInChat();
    }
    async function setEmojiSpamLimit(limit) {
        const parsedLimit = parseInt(limit);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
            console.warn("[EmojiSpamProtection] Invalid limit value, using default: 6");
            emojiSpamLimit = 6;
        }
        else {
            emojiSpamLimit = parsedLimit;
        }
        try {
            await setStorage('emojiSpamLimit', emojiSpamLimit);
            console.log(`[EmojiSpamProtection] Emoji spam limit saved to storage: ${emojiSpamLimit}`);
            await updateEmojiSpamProtectionUI();
            await checkEmojiSpamInChat();
            setTimeout(() => {
                console.log("[EmojiSpamProtection] Re-checking chat after limit change");
                checkEmojiSpamInChat();
            }, 100);
            if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                window.Notifications.showPanelNotification(`Emoji spam limit set to ${emojiSpamLimit}`, 3000, false);
            }
        }
        catch (error) {
            console.error(`[EmojiSpamProtection] Error saving emoji spam limit: ${error}`);
            await updateEmojiSpamProtectionUI();
            throw error;
        }
    }
    function setupChatObserver() {
        console.log("[EmojiSpamProtection] Setting up chat observer...");
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-a-target="chat-room-content"]');
        if (!chatContainer) {
            console.log("[EmojiSpamProtection] Chat container not found for observer");
            return;
        }
        const observer = new MutationObserver((mutations) => {
            console.log("[EmojiSpamProtection] MutationObserver triggered:", mutations.length, "changes");
            checkEmojiSpamInChat();
        });
        observer.observe(chatContainer, {
            childList: true,
            subtree: true
        });
    }
    function integrateEmojiSpamProtection() {
        console.log("[EmojiSpamProtection] Integrating with chat observer...");
        const originalObserveChatContainer = window.observeChatContainer || (() => { });
        window.observeChatContainer = function () {
            console.log("[EmojiSpamProtection] observeChatContainer called");
            originalObserveChatContainer.apply(this, arguments);
            checkEmojiSpamInChat();
        };
        const originalToggleEmotesInChat = window.toggleEmotesInChat || (() => { });
        window.toggleEmotesInChat = function (immediate = false) {
            console.log("[EmojiSpamProtection] toggleEmotesInChat called");
            originalToggleEmotesInChat(immediate);
            checkEmojiSpamInChat();
        };
        const originalRestartBlockingLogic = window.restartBlockingLogic || (() => { });
        window.restartBlockingLogic = function () {
            console.log("[EmojiSpamProtection] restartBlockingLogic called");
            originalRestartBlockingLogic.apply(this, arguments);
            checkEmojiSpamInChat();
        };
        setupChatObserver();
    }
    async function initEmojiSpamProtection() {
        console.log("[EmojiSpamProtection] Initializing...");
        isEmojiSpamProtectionEnabled = await getStorage('isEmojiSpamProtectionEnabled', true);
        emojiSpamLimit = await getStorage('emojiSpamLimit', 6);
        console.log("[EmojiSpamProtection] Initialized with limit:", emojiSpamLimit);
        async function waitForChat(attempts = 20, delay = 1000) {
            for (let i = 0; i < attempts; i++) {
                const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-a-target="chat-room-content"]');
                if (chatContainer) {
                    console.log("[EmojiSpamProtection] Chat container found, initializing observer");
                    integrateEmojiSpamProtection();
                    await checkEmojiSpamInChat();
                    await updateEmojiSpamProtectionUI();
                    return true;
                }
                console.log("[EmojiSpamProtection] Chat container not found, retrying in", delay, "ms");
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            console.warn("[EmojiSpamProtection] Chat container not found after", attempts, "attempts");
            setTimeout(() => initEmojiSpamProtection(), 5000);
            return false;
        }
        await waitForChat();
    }
    async function updateEmojiSpamProtectionUI() {
        const emojiSpamSwitch = document.getElementById('emoji-spam-protection-switch');
        if (emojiSpamSwitch) {
            const isEnabled = await getStorage('isEmojiSpamProtectionEnabled', true);
            emojiSpamSwitch.checked = isEnabled;
            console.log("[EmojiSpamProtection] UI updated, switch state:", isEnabled);
        }
        else {
            console.warn("[EmojiSpamProtection] Emoji spam protection switch not found");
        }
        const emojiSpamLimitInput = document.getElementById('emoji-spam-limit-input');
        if (emojiSpamLimitInput) {
            const limit = await getStorage('emojiSpamLimit', 6);
            emojiSpamLimitInput.value = limit;
            console.log("[EmojiSpamProtection] UI updated, emoji spam limit:", limit);
        }
        else {
            console.warn("[EmojiSpamProtection] Emoji spam limit input not found");
        }
    }
    // Инициализация
    initEmojiSpamProtection();
    // Экспорт для совместимости с ChatFilter
    window.ChatFilter = window.ChatFilter || {};
    window.ChatFilter.setEmojiSpamProtectionEnabled = setEmojiSpamProtectionEnabled;
    window.ChatFilter.setEmojiSpamLimit = setEmojiSpamLimit;
    window.ChatFilter.checkEmojiSpamInChat = checkEmojiSpamInChat;
    window.ChatFilter.updateEmojiSpamProtectionUI = updateEmojiSpamProtectionUI;
})();
//# sourceMappingURL=emojiSpamProtection.js.map