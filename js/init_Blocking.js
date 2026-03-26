// ============ initBlocking.js модуль инициализации блокировки смайлов ========= //


function initBlocking() {
    console.log("[Content] Initializing blocking...");
    try {
        blockedEmotes = getStorage('blockedEmotes', []);
        let rawBlockedChannels = getStorage('blockedChannels', []);
        blockedChannels = rawBlockedChannels.map(item => {
            if (item.channelName && item.prefix) return item;
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
        console.log("[Blocking_Emotes]  Loaded:", {
            blockedEmotes: blockedEmotes.length,
            blockedChannels: blockedChannels.length,
            isBlockingEnabled
        });
        setStorage('blockedChannels', blockedChannels);

        // Немедленная фильтрация эмодзи и текста
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-a-target="chat-room-content"], .vod-message');
        if (chatContainer) {
            toggleEmotesInChat(true);
            if (getStorage('isTextBlockingEnabled', true)) {
                console.log("[_Keyword_Blocking_] Applying initial text filtering...");
                window.chatFilter.filterTextInNode(chatContainer);
            }
        }

        // Запуск наблюдателей
        startUnifiedRootObserver();
        if (getStorage('isTextBlockingEnabled', true)) {
            console.log("[_Keyword_Blocking_] Initializing keyword filtering...");
            chatFilter.setTextFilteringEnabled(true);
            startKeywordFiltering();
        }
        startWatchdog();
        handleVisibilityChange();
        monitorChannelChange();
        monitorChatReset();
        monitorKeywordChatReset();
        toggleKeywordsInChat();
        observeChatContainer();

        // Периодическая проверка контейнера чата
        setInterval(() => {
            if (!observerIsActive || !keywordObserverIsActive) {
                console.log("[ChatContainer] Observer inactive, checking for container...");
                const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-a-target="chat-room-content"], .vod-message');
                if (chatContainer) {
                    console.log("[ChatContainer] Found container, restarting observers...");
                    observerIsActive = true;
                    keywordObserverIsActive = true;
                    observeChatContainer();
                    window.chatFilter.filterTextInNode(chatContainer);
                }
            }
        }, 3000); // Уменьшена частота проверки до 3 секунд

        console.log("[Content] Blocking initialization complete");
    } catch (error) {
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