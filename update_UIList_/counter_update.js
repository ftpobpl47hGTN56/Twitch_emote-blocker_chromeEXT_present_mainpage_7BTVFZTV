
// ================ счетчик  Функция обновления счетчика ==================== //

function updateCounter(counter) {
    if (!counter) {
        console.error("[Content] Counter element not found");
        return;
    }
    const blockedChannels = getStorage('blockedChannels', []);
    const blockedEmotes = getStorage('blockedEmotes', []);
    const bannedKeywords = getStorage('bannedKeywords', []);
    const bannedUsers = getStorage('bannedUsers', []);
    const twitchCount = blockedChannels.length;
    const bttvCount = blockedEmotes.filter(e => e.platform === 'bttTV').length;
    const tv7Count = blockedEmotes.filter(e => e.platform === '7tv').length;
    const ffzCount = blockedEmotes.filter(e => e.platform === 'ffz').length;
    const chatBannedCount = bannedKeywords.length;
    const totalCount = twitchCount + bttvCount + tv7Count + ffzCount + chatBannedCount;
    counter.innerText = `Twitch: ${twitchCount} | BTTV: ${bttvCount} | 7TV: ${tv7Count} | FFZ: ${ffzCount} | Chat Banned items: ${chatBannedCount} | Total: ${totalCount}`;
    counter.offsetHeight; // Форсируем перерисовку
}


// ================= end of Функция обновления счетчика ==================== //