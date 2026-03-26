// ======== delete_add_clear_data.js ======== //
// ======== delete_add_clear_data.js ======== //
// ======== delete_add_clear_data.js ======== //


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

// ======== addEmoteOrChannel ========================================

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
// =============================================================================================== //
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
    const bannedChatList = document.querySelector('.banned-chat-list-container')?.parentElement;
    if (bannedChatList) {
        const allItems = [...bannedKeywords, ...bannedUsers];
        const lastKeyword = allItems.length > 0 ? allItems.reduce((latest, current) => {
            return new Date(current.date) > new Date(latest.date) ? current : latest;
        }, allItems[0]) : null;
        updateBannedChatList(bannedChatList, {
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