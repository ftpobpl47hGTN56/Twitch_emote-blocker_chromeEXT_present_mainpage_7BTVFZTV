// emojiSpamProtection.js
(function () {
    'use strict';
    let isEmojiSpamProtectionEnabled = true;
    let emojiSpamLimit = 6;
    function getStorage(key, defaultValue) {
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                const value = result[key] !== undefined ? result[key] : defaultValue;
                console.log(`[_Emoji_Spam_Protect_] Retrieved ${key}:`, value);
                resolve(value);
            });
        });
    }
    function setStorage(key, value) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ [key]: value }, () => {
                if (chrome.runtime.lastError) {
                    console.error(`[_Emoji_Spam_Protect_] Error saving ${key}:`, chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                }
                else {
                    console.log(`[_Emoji_Spam_Protect_] Saved ${key}:`, value);
                    resolve(true);
                }
            });
        });
    }
    function checkEmojiSpamInChat() {
        console.log(`[_Emoji_Spam_Protect_] Checking for emoji spam (enabled: ${isEmojiSpamProtectionEnabled}, limit: ${emojiSpamLimit})`);
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-a-target="chat-room-content"]');
        if (!chatContainer) {
            console.log("[_Emoji_Spam_Protect_] Chat container not found");
            return;
        }
        const messages = chatContainer.querySelectorAll('.chat-line__message');
        messages.forEach(message => {
            const messageContent = message.querySelector('.message');
            if (!messageContent) {
                console.log("[_Emoji_Spam_Protect_] Message content not found in:", message);
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
                    console.log(`[_Emoji_Spam_Protect_] Hid message content with ${totalEmojis} emojis (Graphical: ${emotes.length}, Unicode: ${unicodeEmojis})`);
                    if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                        window.Notifications.showPanelNotification(`Message content hidden due to emoji spam (${totalEmojis} emojis)`, 3000, false);
                    }
                }
                else {
                    if (messageContent.dataset?.emojiSpamHidden === 'true') {
                        messageContent.style.display = '';
                        delete messageContent.dataset.emojiSpamHidden;
                        console.log("[_Emoji_Spam_Protect_] Restored message content visibility");
                    }
                }
            }
            else {
                if (messageContent.dataset?.emojiSpamHidden === 'true') {
                    messageContent.style.display = '';
                    delete messageContent.dataset.emojiSpamHidden;
                    console.log("[_Emoji_Spam_Protect_] Restored message content visibility");
                }
            }
        });
    }
    async function setEmojiSpamProtectionEnabled(state) {
        isEmojiSpamProtectionEnabled = state;
        await setStorage('isEmojiSpamProtectionEnabled', state);
        console.log(`[_Emoji_Spam_Protect_] Emoji spam protection set to: ${state}`);
        await checkEmojiSpamInChat();
    }
    async function setEmojiSpamLimit(limit) {
        const parsedLimit = parseInt(limit);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
            console.warn("[_Emoji_Spam_Protect_] Invalid limit value, using default: 6");
            emojiSpamLimit = 6;
        }
        else {
            emojiSpamLimit = parsedLimit;
        }
        try {
            await setStorage('emojiSpamLimit', emojiSpamLimit);
            console.log(`[_Emoji_Spam_Protect_] Emoji spam limit saved to storage: ${emojiSpamLimit}`);
            await updateEmojiSpamProtectionUI();
            await checkEmojiSpamInChat();
            setTimeout(() => {
                console.log("[_Emoji_Spam_Protect_] Re-checking chat after limit change");
                checkEmojiSpamInChat();
            }, 100);
            if (window.Notifications && window.Notifications.isGlobalNotificationsEnabled()) {
                window.Notifications.showPanelNotification(`Emoji spam limit set to ${emojiSpamLimit}`, 3000, false);
            }
        }
        catch (error) {
            console.error(`[_Emoji_Spam_Protect_] Error saving emoji spam limit: ${error}`);
            await updateEmojiSpamProtectionUI();
            throw error;
        }
    }
    function setupChatObserver() {
        console.log("[_Emoji_Spam_Protect_] Setting up chat observer...");
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-a-target="chat-room-content"]');
        if (!chatContainer) {
            console.log("[_Emoji_Spam_Protect_] Chat container not found for observer");
            return;
        }
        const observer = new MutationObserver((mutations) => {
            console.log("[_Emoji_Spam_Protect_] MutationObserver triggered:", mutations.length, "changes");
            checkEmojiSpamInChat();
        });
        observer.observe(chatContainer, {
            childList: true,
            subtree: true
        });
    }
    function integrateEmojiSpamProtection() {
        console.log("[_Emoji_Spam_Protect_] Integrating with chat observer...");
        const originalObserveChatContainer = window.observeChatContainer || (() => { });
        window.observeChatContainer = function () {
            console.log("[_Emoji_Spam_Protect_] observeChatContainer called");
            originalObserveChatContainer.apply(this, arguments);
            checkEmojiSpamInChat();
        };
        const originalToggleEmotesInChat = window.toggleEmotesInChat || (() => { });
        window.toggleEmotesInChat = function (immediate = false) {
            console.log("[_Emoji_Spam_Protect_] toggleEmotesInChat called");
            originalToggleEmotesInChat(immediate);
            checkEmojiSpamInChat();
        };
        const originalRestartBlockingLogic = window.restartBlockingLogic || (() => { });
        window.restartBlockingLogic = function () {
            console.log("[_Emoji_Spam_Protect_] restartBlockingLogic called");
            originalRestartBlockingLogic.apply(this, arguments);
            checkEmojiSpamInChat();
        };
        setupChatObserver();
    }
    async function initEmojiSpamProtection() {
        console.log("[_Emoji_Spam_Protect_] Initializing...");
        isEmojiSpamProtectionEnabled = await getStorage('isEmojiSpamProtectionEnabled', true);
        emojiSpamLimit = await getStorage('emojiSpamLimit', 6);
        console.log("[_Emoji_Spam_Protect_] Initialized with limit:", emojiSpamLimit);
        async function waitForChat(attempts = 20, delay = 1000) {
            for (let i = 0; i < attempts; i++) {
                const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-a-target="chat-room-content"]');
                if (chatContainer) {
                    console.log("[_Emoji_Spam_Protect_] Chat container found, initializing observer");
                    integrateEmojiSpamProtection();
                    await checkEmojiSpamInChat();
                    await updateEmojiSpamProtectionUI();
                    return true;
                }
                console.log("[_Emoji_Spam_Protect_] Chat container not found, retrying in", delay, "ms");
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            console.warn("[_Emoji_Spam_Protect_] Chat container not found after", attempts, "attempts");
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
            console.log("[_Emoji_Spam_Protect_] UI updated, switch state:", isEnabled);
        }
        else {
            console.warn("[_Emoji_Spam_Protect_] Emoji spam protection switch not found");
        }
        const emojiSpamLimitInput = document.getElementById('emoji-spam-limit-input');
        if (emojiSpamLimitInput) {
            const limit = await getStorage('emojiSpamLimit', 6);
            emojiSpamLimitInput.value = limit;
            console.log("[_Emoji_Spam_Protect_] UI updated, emoji spam limit:", limit);
        }
        else {
            console.warn("[_Emoji_Spam_Protect_] Emoji spam limit input not found");
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