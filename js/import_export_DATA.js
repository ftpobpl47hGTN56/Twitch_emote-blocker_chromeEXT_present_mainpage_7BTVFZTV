 

 function exportBlockedItems(type = 'both') {
    console.log(`[Content] Exporting ${type}...`);
    try {
        const blockedEmotes = getStorage('blockedEmotes', []);
        const blockedChannels = getStorage('blockedChannels', []);
        const data = {};
        let total = 0;
        if (type === 'blockedEmotes' || type === 'both') {
            data.blockedEmotes = Array.isArray(blockedEmotes) ? blockedEmotes : [];
            total += data.blockedEmotes.length;
        }
        if (type === 'blockedChannels' || type === 'both') {
            data.blockedChannels = Array.isArray(blockedChannels) ? blockedChannels : [];
            total += data.blockedChannels.length;
        }
        data.total = total;
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const fileName = `7BTTVFZ_Emotes_Channels_${type}_${date}_total_${total}.json`;
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        console.log(`[Content] Initiating download for file: ${fileName}, URL: ${url}, Blob size: ${blob.size}`);
        setTimeout(() => {
            try {
                a.click();
                console.log(`[Content] Download triggered for ${fileName}`);
            }
            catch (clickError) {
                console.error('[Content] Error triggering download:', clickError);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                console.log('[Content] Fallback download triggered');
            }
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log(`[Content] Cleaned up after download: ${fileName}`);
            }, 100);
        }, 0);
    }
    catch (error) {
        console.error(`[Content] ${type} export error:`, error);
    }
}

function exportChatBannedItems() {
    console.log("[Content] Exporting ChatBannedItems...");
    try {
        const bannedKeywords = getStorage('bannedKeywords', []);
        const bannedUsers = getStorage('bannedUsers', []);
        if (!Array.isArray(bannedKeywords) || !Array.isArray(bannedUsers)) {
            console.error("[Content] Invalid data: bannedKeywords or bannedUsers is not an array");
            window.Notifications.showPanelNotification("Failed to export ChatBannedItems", false);
            return;
        }
        const data = {
            chatBannedItems: {
                bannedKeywords,
                bannedUsers
            },
            total: bannedKeywords.length + bannedUsers.length
        };
        console.log('[Content] Export data:', data);
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const fileName = `7BTTVFZ_chat_banned_items_${date}_total${data.total}.json`;
        console.log('[Content] File name:', fileName);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        console.log(`[Content] Initiating download for file: ${fileName}, URL: ${url}, Blob size: ${blob.size}`);
        setTimeout(() => {
            try {
                a.click();
                console.log(`[Content] Download triggered for ${fileName}`);
                window.Notifications.showPanelNotification(`Exported ${fileName} successfully!`, true);
            }
            catch (clickError) {
                console.error('[Content] Error triggering download:', clickError);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                console.log('[Content] Fallback download triggered');
                window.Notifications.showPanelNotification(`Exported ${fileName} successfully!`, true);
            }
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log(`[Content] Cleaned up after download: ${fileName}`);
            }, 100);
        }, 0);
    }
    catch (error) {
        console.error("[Content] ChatBannedItems export error:", error);
        window.Notifications.showPanelNotification("Failed to export ChatBannedItems", false);
    }
}

function exportBannedUsers() {
    console.log("[Content] Exporting banned users...");
    try {
        const bannedUsers = getStorage('bannedUsers', []);
        if (!Array.isArray(bannedUsers)) {
            console.error("[Content] bannedUsers is not an array:", bannedUsers);
            window.Notifications.showPanelNotification("Failed to export users", false);
            return;
        }
        const data = { bannedUsers, total: bannedUsers.length };
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const fileName = `7BTFZ_banned_users_${date}_total${data.total}.json`;
        if (!document.body) {
            console.error("[Content] document.body is not available");
            window.Notifications.showPanelNotification("Failed to export users: DOM not ready", false);
            return;
        }
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        window.Notifications.showPanelNotification(`Exported ${data.total} users successfully!`, true);
    }
    catch (error) {
        console.error("[Content] Export banned users error:", error);
        window.Notifications.showPanelNotification("Failed to export users", false);
    }
}
function exportbannedKeywords() {
    console.log("[Content] Exporting banned keywords...");
    try {
        const bannedKeywords = getStorage('bannedKeywords', []);
        console.log('[Content] bannedKeywords:', bannedKeywords);
        const keywordsArray = Array.isArray(bannedKeywords) ? bannedKeywords : [];
        const total = keywordsArray.length;
        const data = {
            bannedKeywords: keywordsArray,
            total: total
        };
        console.log('[Content] Export data:', data);
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const fileName = `7BTTVFZ_banned_keywords_${date}_total${total}.json`;
        console.log('[Content] File name:', fileName);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        console.log(`[Content] Initiating download for file: ${fileName}, URL: ${url}, Blob size: ${blob.size}`);
        setTimeout(() => {
            try {
                a.click();
                console.log(`[Content] Download triggered for ${fileName}`);
                window.Notifications.showPanelNotification(`Exported ${fileName} successfully!`, true);
            }
            catch (clickError) {
                console.error('[Content] Error triggering download:', clickError);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                console.log('[Content] Fallback download triggered');
                window.Notifications.showPanelNotification(`Exported ${fileName} successfully!`, true);
            }
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log(`[Content] Cleaned up after download: ${fileName}`);
            }, 100);
        }, 0);
    }
    catch (error) {
        console.error("[Content] Banned keywords export error:", error);
        window.Notifications.showPanelNotification("Failed to export banned keywords", false);
    }
}
 function importBlockedItems(counter) {
    console.log("[Content] Importing blocked items...");
    try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        blockedEmotes = [];
                        blockedChannels = [];
                        blockedEmoteIDs.clear();
                        blockedChannelIDs.clear();
                        newlyAddedIds.clear();
                        const validEmotes = (data.blockedEmotes || []).filter(item => item.id && item.platform && item.emoteName && item.emoteUrl && item.date);
                        const validChannels = (data.blockedChannels || []).filter(item => item.id && item.platform && item.emoteName && item.date);
                        // Мигрируем старый формат для blockedChannels
                        blockedChannels = validChannels.map(item => {
                            if (item.channelName && item.prefix) {
                                return item;
                            }
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
                        blockedEmotes = validEmotes;
                        blockedEmoteIDs = new Set(blockedEmotes.map(e => e.id));
                        blockedChannelIDs = new Set(blockedChannels.map(c => c.id));
                        newlyAddedIds = new Set();
                        processedEmotes = new WeakMap();
                        console.log("[Content] Imported:", {
                            blockedEmotes: blockedEmotes.length,
                            blockedChannels: blockedChannels.length,
                            invalidEmotes: (data.blockedEmotes || []).length - validEmotes.length,
                            invalidChannels: (data.blockedChannels || []).length - validChannels.length
                        });
                        setStorage('blockedEmotes', blockedEmotes);
                        setStorage('blockedChannels', blockedChannels);
                        toggleEmotesInChat(true);
                        const blockedList = uiElements?.blockedList || document.getElementById('blocked-emotes-list');
                        if (blockedList) {
                            console.log("[Content] Updating blocked list after import...");
                            blockedList.innerHTML = '';
                            updateBlockedEmotesList(blockedList, getBlockedItems());
                            requestAnimationFrame(() => {
                                blockedList.offsetHeight;
                                console.log("[Content] Blocked list DOM updated after import");
                            });
                        }
                        else {
                            console.error("[Content] Blocked list element not found in DOM");
                        }
                        updateCounter(counter);
                        console.log("[Content] Import successful");
                    }
                    catch (error) {
                        console.error("[Content] Import error:", error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    catch (error) {
        console.error("[Content] Import error:", error);
    }
}
 
function importChatBannedItems(counter) {
    console.log("[Content] Importing ChatBannedItems...");
    try {
        if (!document.body) {
            console.error("[Content] document.body is not available");
            window.Notifications.showPanelNotification("Failed to import ChatBannedItems: DOM not ready", false);
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) {
                window.Notifications.showPanelNotification("No file selected", false);
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                window.Notifications.showPanelNotification("File too large (max 10MB)", false);
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const validKeywords = (data.chatBannedItems?.bannedKeywords || []).filter(item => item.id && item.text && item.date);
                    const validUsers = (data.chatBannedItems?.bannedUsers || []).filter(item => item.id && item.text && item.date);
                    // Сохраняем данные в хранилище
                    setStorage('bannedKeywords', validKeywords);
                    setStorage('bannedUsers', validUsers);
                    const bannedChatList = uiElements?.bannedChatList || document.getElementById('banned-chat-list');
                    if (bannedChatList) {
                        const allItems = [...validKeywords, ...validUsers];
                        const lastKeyword = allItems.length > 0 ? allItems.reduce((latest, current) => new Date(current.date) > new Date(latest.date) ? current : latest, allItems[0]) : null;
                        updateBannedChatList(bannedChatList, {
                            bannedKeywords: validKeywords,
                            bannedUsers: validUsers,
                            newlyAddedIds: new Set(),
                            lastKeyword
                        });
                    }
                    else {
                        console.error("[Content] bannedChatList not found");
                        window.Notifications.showPanelNotification("Failed to update UI: List element not found", false);
                    }
                    if (counter)
                        updateCounter(counter);
                    window.Notifications.showPanelNotification(`Imported ${validKeywords.length} keywords and ${validUsers.length} users successfully!`, true);
                    // Если фильтрация текста включена, обновляем чат
                    if (isTextBlockingEnabled && window.chatFilter) {
                        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-test-selector="chat-scrollable-area__message-container"]');
                        if (chatContainer)
                            window.chatFilter.filterTextInNode(chatContainer);
                    }
                }
                catch (error) {
                    console.error("[Content] Import error:", error);
                    window.Notifications.showPanelNotification("Failed to import ChatBannedItems: Invalid file", false);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    catch (error) {
        console.error("[Content] Import error:", error);
        window.Notifications.showPanelNotification("Failed to import ChatBannedItems", false);
    }
}
function importBannedUsers(counter) {
    console.log("[Content] Importing banned users...");
    try {
        if (!document.body) {
            console.error("[Content] document.body is not available");
            window.Notifications.showPanelNotification("Failed to import users: DOM not ready", false);
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) {
                window.Notifications.showPanelNotification("No file selected", false);
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                window.Notifications.showPanelNotification("File too large (max 10MB)", false);
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const validUsers = (data.bannedUsers || []).filter(item => item.id && item.text && item.date);
                    setStorage('bannedUsers', []);
                    setStorage('bannedUsers', validUsers);
                    const bannedChatList = uiElements?.bannedChatList || document.getElementById('banned-chat-list');
                    if (bannedChatList) {
                        const bannedKeywords = getStorage('bannedKeywords', []);
                        const allItems = [...bannedKeywords, ...validUsers];
                        const lastKeyword = allItems.length > 0 ? allItems.reduce((latest, current) => new Date(current.date) > new Date(latest.date) ? current : latest, allItems[0]) : null;
                        updateBannedChatList(bannedChatList, {
                            bannedKeywords,
                            bannedUsers: validUsers,
                            newlyAddedIds: new Set(),
                            lastKeyword
                        });
                    }
                    else {
                        console.error("[Content] bannedChatList not found");
                        window.Notifications.showPanelNotification("Failed to update UI: List element not found", false);
                    }
                    if (counter)
                        updateCounter(counter);
                    window.Notifications.showPanelNotification(`Imported ${validUsers.length} users successfully!`, true);
                    if (isTextBlockingEnabled && window.chatFilter) {
                        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .chat-list--default, [data-test-selector="chat-scrollable-area__message-container"]');
                        if (chatContainer)
                            window.chatFilter.filterTextInNode(chatContainer);
                    }
                }
                catch (error) {
                    console.error("[Content] Import error:", error);
                    window.Notifications.showPanelNotification("Failed to import users: Invalid file", false);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    catch (error) {
        console.error("[Content] Import error:", error);
        window.Notifications.showPanelNotification("Failed to import users", false);
    }
}

function importbannedKeywords(counter) {
    try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        const validKeywords = (data.bannedKeywords || []).filter(item => item.id && item.text && item.date);
                        setStorage('bannedKeywords', validKeywords);
                        const bannedChatList = uiElements?.bannedChatList || document.getElementById('banned-chat-list');
                        if (bannedChatList) {
                            updateBannedChatList(bannedChatList, {
                                bannedKeywords: validKeywords,
                                newlyAddedIds: new Set(),
                                lastKeyword: validKeywords[validKeywords.length - 1] || null
                            });
                        }
                        if (uiElements && uiElements.counter) {
                            updateCounter(uiElements.counter);
                        }
                        window.Notifications.showPanelNotification("Banned keywords imported successfully!", true);
                    }
                    catch (error) {
                        window.Notifications.showPanelNotification("Failed to import data: Invalid file", false);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    catch (error) {
        window.Notifications.showPanelNotification("Failed to import data: Invalid file", false);
    }
}