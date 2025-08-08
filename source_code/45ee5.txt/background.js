// Background.js //
console.log("[Background] Background script loaded at:", new Date().toISOString());
// =========== находится в модуле Background.js ============== //
// Инициализация контекстного меню при установке или обновлении расширения
chrome.runtime.onInstalled.addListener(() => {
    console.log("[Background] Extension installed or updated");
    initializeContextMenu();
});
// =========== находится в модуле Background.js ============== //
// Внедрение скриптов и стилей на страницу player.html
chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url.includes('twitch.tv/popout') && details.frameId !== 0) {
        console.log('[Background] Injecting into chat iframe:', details.url);
        chrome.scripting.executeScript({
            target: { tabId: details.tabId, frameIds: [details.frameId] },
            files: ['chart.umd.js', 'combined.js']
        }, () => {
            if (chrome.runtime.lastError) {
                console.warn('[Background] Injection error:', chrome.runtime.lastError);
            }
            else {
                console.log('[Background] Scripts injected into iframe');
            }
        });
    }
    if (details.url.startsWith('chrome-extension://') && details.frameId === 0) {
        console.log('[Background] Injecting into extension page:', details.url);
        chrome.scripting.executeScript({
            target: { tabId: details.tabId, frameIds: [details.frameId] },
            files: ['chart.umd.js', 'combined.js']
        });
    }
}, { url: [{ urlMatches: 'https://*.twitch.tv/*' }, { urlMatches: 'chrome-extension://*/*' }] });
// =========== находится в модуле Background.js ============== //
// Обработчик сообщений от content script и iframe
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("[Background] Received message:", request);
    try {
        if (request.action === 'createContextMenu') {
            console.log("[Background] Creating context menu...");
            initializeContextMenu(request.items);
            sendResponse({ status: 'success' });
        }
        else if (request.action === 'openControlPanel') {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]?.id) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'openControlPanel' }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error("[Background] Error sending openControlPanel message:", chrome.runtime.lastError);
                            sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
                        }
                        else {
                            console.log("[Background] openControlPanel message sent:", response);
                            sendResponse({ status: 'success' });
                        }
                    });
                }
                else {
                    console.error("[Background] No active tab found");
                    sendResponse({ status: 'error', message: 'No active tab found' });
                }
            });
            return true; // Асинхронный ответ
        }
        else if (request.action === 'exportFile') {
            console.log("[Background] Processing exportFile action...");
            const { data, fileName } = request;
            if (!data || !fileName) {
                console.error("[Background] Invalid exportFile request:", request);
                sendResponse({ status: 'error', message: 'Missing data or fileName' });
                return true;
            }
            // Создаём JSON-строку
            const jsonString = JSON.stringify(data, null, 2);
            // Используем data: URL для передачи содержимого
            const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
            chrome.downloads.download({
                url: dataUrl,
                filename: fileName,
                saveAs: true
            }, (downloadId) => {
                if (chrome.runtime.lastError) {
                    console.error('[Background] Download error:', chrome.runtime.lastError);
                    sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
                }
                else {
                    console.log(`[Background] Initiated download for ${fileName}, Download ID: ${downloadId}`);
                    sendResponse({ status: 'success' });
                }
            });
            return true; // Асинхронный ответ
        }
        else {
            console.warn("[Background] Unknown action:", request.action);
            sendResponse({ status: 'error', message: `Unknown action: ${request.action}` });
        }
    }
    catch (error) {
        console.error("[Background] Error processing message:", error);
        sendResponse({ status: 'error', message: error.message });
    }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("[Background] Received message:", request);
    if (request.action === 'openControlPanel') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'openControlPanel' }, (response) => {
                    sendResponse(response || { status: 'success' });
                });
            }
            else {
                sendResponse({ status: 'error', message: 'No active tab found' });
            }
        });
        return true; // Асинхронный ответ
    }
    // Остальная логика остается без изменений
});
// =========== находится в модуле Background.js ============== //
// Обработчик кликов по контекстному меню
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("[Background] Context menu clicked:", info);
    try {
        if (!tab?.id) {
            console.error("[Background] No tab ID available");
            return;
        }
        chrome.tabs.sendMessage(tab.id, {
            action: 'contextMenuClicked',
            info: info
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("[Background] Error sending message to content script:", chrome.runtime.lastError);
            }
            else {
                console.log("[Background] Response from content script:", response || "No response");
            }
        });
    }
    catch (error) {
        console.error("[Background] Error handling context menu click:", error);
    }
});
// Функция для инициализации контекстного меню
function initializeContextMenu(items = [
    {
        id: 'blockEmote',
        title: 'Block Emote',
        contexts: ['image'],
        documentUrlPatterns: [
            'https://www.twitch.tv/*',
            'https://player.twitch.tv/*',
            'https://*.ttvnw.net/*',
            'https://*.jtvnw.net/*',
            'https://cdn.frankerfacez.com/*',
            'https://cdn.7tv.app/*',
            'https://cdn.betterttv.net/*',
            "https://www.twitch.tv/popout/*/chat*"
        ]
    },
    {
        id: 'showEmotesPopup',
        title: 'Show Emotes Popup',
        contexts: ['image'],
        documentUrlPatterns: [
            'https://www.twitch.tv/*',
            'https://player.twitch.tv/*',
            'https://*.ttvnw.net/*',
            'https://*.jtvnw.net/*',
            'https://cdn.frankerfacez.com/*',
            'https://cdn.7tv.app/*',
            'https://cdn.betterttv.net/*',
            "https://www.twitch.tv/popout/*/chat*"
        ]
    }
]) {
    try {
        console.log("[Background] Initializing context menu...");
        chrome.contextMenus.removeAll(() => {
            if (chrome.runtime.lastError) {
                console.error("[Background] Error removing existing context menus:", chrome.runtime.lastError);
                return;
            }
            items.forEach(item => {
                chrome.contextMenus.create({
                    id: item.id,
                    title: item.title,
                    contexts: item.contexts,
                    documentUrlPatterns: item.documentUrlPatterns
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error(`[Background] Error creating context menu item ${item.id}:`, chrome.runtime.lastError);
                    }
                    else {
                        console.log(`[Background] Context menu item created: ${item.id}`);
                    }
                });
            });
            console.log("[Background] Context menu initialization complete");
        });
    }
    catch (error) {
        console.error("[Background] Error initializing context menu:", error);
    }
}
// Обработка ошибок расширения
chrome.runtime.onError = (error) => {
    console.error("[Background] Runtime error:", error);
};
console.log("[Background] Background script initialization complete");
//# sourceMappingURL=background.js.map