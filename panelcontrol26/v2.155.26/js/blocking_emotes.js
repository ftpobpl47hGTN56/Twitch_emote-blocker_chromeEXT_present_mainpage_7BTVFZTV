

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
function toggleEmotesInChat(immediate = false) {
    console.log(`[${new Date().toISOString()}] [Blocking_Emotes]  toggleEmotesInChat started (immediate: ${immediate}, isBlockingEnabled: ${isBlockingEnabled})`);
    const startTime = performance.now();
    // Сбрасываем кэш, чтобы пересмотреть все эмодзи
    processedEmotes = new WeakMap();
    // Находим основной контейнер чата
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container') || document.querySelector('.chat-room__content');
    if (!chatContainer) {
        console.log("[Blocking_Emotes]  Chat container not found in toggleEmotesInChat");
        return;
    }
    // Обрабатываем весь чат
    toggleEmotesInNode(chatContainer, immediate);
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
            console.log("[Blocking_Emotes]  Node outside chat, skipping");
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
        console.log(`[Blocking_Emotes]  Found ${emotes.length} emotes in chat node`);
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
                console.log(`[Blocking_Emotes]  Emote ${emoteAlt || emoteUrl} (ID: ${emoteIdAssigned || emoteId || 'none'}, Provider: ${provider}) hidden`);
            }
        }
        console.log(`[Blocking_Emotes]  toggleEmotesInNode took ${performance.now() - startTime} ms`);
    }
    catch (error) {
        console.error("[Blocking_Emotes]  Error in toggleEmotesInNode:", error);
    }
}

