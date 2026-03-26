// filter_list_search.js // 

// эта   единственная функция которая фильтрует все списки. 
function filterBlockedList(searchTerm) {
    console.log("[Content] Filtering blocked list with term:", searchTerm);
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    if (!uiElements || !uiElements.blockedList) {
        console.error("[Content] UI elements missing for filtering");
        return;
    }
    // Filter blocked emotes and channels
    const allItems = [...blockedChannels, ...blockedEmotes];
    console.log("[Content] Loaded blocked items:", allItems.length);
    const filteredItems = lowerSearchTerm
        ? allItems.filter(item => {
            const text = [
                item.emoteName,
                item.platform,
                item.channelName || '',
                item.prefix || '',
                item.emoteUrl || ''
            ].join(' ').toLowerCase();
            return text.includes(lowerSearchTerm);
        })
        : allItems;
    const lastItem = filteredItems.length > 0 ? filteredItems.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
    }, filteredItems[0]) : null;
    updateBlockedEmotesList(uiElements.blockedList, {
        blockedEmotes: filteredItems.filter(item => item.platform !== 'TwitchChannel'),
        blockedChannels: filteredItems.filter(item => item.platform === 'TwitchChannel'),
        newlyAddedIds,
        lastItem
    }, lowerSearchTerm);
    console.log("[Content] Filtered blocked items list:", filteredItems.length);
    if (uiElements.resetSearchButton) {
        uiElements.resetSearchButton.disabled = !lowerSearchTerm;
        console.log("[Content] Reset search button disabled:", !lowerSearchTerm);
    }
    else {
        console.warn("[Content] resetSearchButton not found");
    }
}

function filterBannedChatList(searchTerm) {
    console.log("[Content] Filtering banned chat list with term:", searchTerm);
    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    if (!uiElements || !uiElements.bannedChatList) {
        console.error("[Content] UI elements missing for banned chat list");
        return;
    }

    uiElements.bannedChatList.scrollTop = 0;

    const bannedKeywords = getStorage('bannedKeywords', []);
    const bannedUsers    = getStorage('bannedUsers', []);

    // На самом деле фильтрацию должен делать updateBannedChatList
    updateBannedChatList(uiElements.bannedChatList, {
        bannedKeywords,
        bannedUsers,
        newlyAddedIds: new Set(),
        lastKeyword: null
    }, lowerSearchTerm);
}