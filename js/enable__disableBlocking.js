
// enable__disableBlocking.js //


(function () {
    // Глобальные переменные для хранения наблюдателей
    let rootObserver = null;
    let keywordObserver = null;
    let connectionObserver = null;
    let iframeObserver = null;

    function enableBlocking() {
    console.log("[Content] Включение блокировки...");
    try {
        isBlockingEnabled = true;
        setStorage('isBlockingEnabled', true);
        console.log("[Content] isBlockingEnabled установлено в:", isBlockingEnabled);

        // Включение обработки эмодзи
        toggleEmotesInChat(true);

        // Включение фильтрации текста через ChatFilter
        chatFilter.setTextFilteringEnabled(true);
        console.log("[Content] Фильтрация текста включена через ChatFilter");

        // Запуск наблюдателей
        startUnifiedRootObserver();
        startKeywordFiltering();
        monitorChannelChange();
        monitorKeywordChatReset();
        monitorIframeChanges();
        monitorKeywordIframeChanges();
        startKeywordWatchdog();
        handleKeywordVisibilityChange();
 

        // Обновление UI
        if (uiElements && uiElements.blockAllButton && uiElements.unblockAllButton) {
            uiElements.blockAllButton.classList.add('active');
            uiElements.unblockAllButton.classList.remove('active');
            console.log("[Content] UI обновлено: blockAllButton активна");
        }

    } catch (error) {
        console.error("[Content] Ошибка в enableBlocking:", error);
        window.Notifications.showPanelNotification('Ошибка при включении блокировки', 5000, false);
    }
}

function disableBlocking() {
    console.log("[Content] Отключение блокировки...");
    try {
        isBlockingEnabled = false;
        setStorage('isBlockingEnabled', false);
        console.log("[Content] isBlockingEnabled установлено в:", isBlockingEnabled);

        // Отключение обработки эмодзи
        toggleEmotesInChat(true);

        // Отключение фильтрации текста через ChatFilter
        chatFilter.setTextFilteringEnabled(false);
        console.log("[Content] Фильтрация текста отключена через ChatFilter");

        // Остановка всех наблюдателей
        if (rootObserver) {
            rootObserver.disconnect();
            rootObserver = null;
            console.log("[Content] rootObserver отключён");
        }
        if (keywordObserver) {
            keywordObserver.disconnect();
            keywordObserver = null;
            keywordObserverIsActive = false;
            console.log("[Content] keywordObserver отключён");
        }
        if (connectionObserver) {
            connectionObserver.disconnect();
            connectionObserver = null;
            console.log("[Content] connectionObserver отключён");
        }
        if (iframeObserver) {
            iframeObserver.disconnect();
            iframeObserver = null;
            console.log("[Content] iframeObserver отключён");
        }

        // Очистка коллекции отфильтрованных сообщений
        filteredMessages.clear();
        console.log("[Content] Коллекция filteredMessages очищена");

        // Отключение мониторинга изменений канала и чата
        if (window.monitorChannelChangeInterval) {
            clearInterval(window.monitorChannelChangeInterval);
            window.monitorChannelChangeInterval = null;
            console.log("[Content] monitorChannelChange отключён");
        }
        if (window.monitorKeywordChatResetInterval) {
            clearInterval(window.monitorKeywordChatResetInterval);
            window.monitorKeywordChatResetInterval = null;
            console.log("[Content] monitorKeywordChatReset отключён");
        }
        if (window.monitorKeywordIframeChangesInterval) {
            clearInterval(window.monitorKeywordIframeChangesInterval);
            window.monitorKeywordIframeChangesInterval = null;
            console.log("[Content] monitorKeywordIframeChanges отключён");
        }
        if (window.keywordWatchdogInterval) {
            clearInterval(window.keywordWatchdogInterval);
            window.keywordWatchdogInterval = null;
            console.log("[Content] startKeywordWatchdog отключён");
        }

       
        // Обновление UI
        if (uiElements && uiElements.unblockAllButton && uiElements.blockAllButton) {
            uiElements.unblockAllButton.classList.add('active');
            uiElements.blockAllButton.classList.remove('active');
            console.log("[Content] UI обновлено: unblockAllButton активна");
        }

    } catch (error) {
        console.error("[Content] Ошибка в disableBlocking:", error);
        window.Notifications.showPanelNotification('Ошибка при отключении блокировки', 5000, false);
    }
}

    // Сохранение наблюдателей для последующего управления
    function storeObservers() {
        if (!rootObserver) {
            rootObserver = new MutationObserver(() => {
                console.log("[Content] rootObserver активен");
            });
        }
        if (!keywordObserver) {
            keywordObserver = new MutationObserver(() => {
                console.log("[Content] keywordObserver активен");
            });
        }
        if (!connectionObserver) {
            connectionObserver = new MutationObserver(() => {
                console.log("[Content] connectionObserver активен");
            });
        }
        if (!iframeObserver) {
            iframeObserver = new MutationObserver(() => {
                console.log("[Content] iframeObserver активен");
            });
        }
    }

    // Экспорт функций
    window.enableBlocking = enableBlocking;
    window.disableBlocking = disableBlocking;
    console.log("[UI] Модуль enable__disableBlocking инициализирован");
})();





// /*
// 
// enable__disableBlocking.js //

/* ТЕСТ  // enable__disableBlocking.js //
/* ТЕСТ  // enable__disableBlocking.js //
/* ТЕСТ  // enable__disableBlocking.js //
/* ТЕСТ  // enable__disableBlocking.js //
/* ТЕСТ  // enable__disableBlocking.js //
/* ТЕСТ  // enable__disableBlocking.js //
/* ТЕСТ  // enable__disableBlocking.js //

(function () {
    // Глобальные переменные для хранения наблюдателей
    let rootObserver = null;
    let keywordObserver = null;
    let connectionObserver = null;
    let iframeObserver = null;

    function enableBlocking() {
    console.log("[Content] Включение блокировки...");
    try {
        isBlockingEnabled = true;
        setStorage('isBlockingEnabled', true);
        console.log("[Content] isBlockingEnabled установлено в:", isBlockingEnabled);

        // Очистка кэша обработанных эмодзи
        processedEmotes = new WeakMap();
        console.log("[Content] Коллекция processedEmotes очищена");

        // Включение обработки эмодзи
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .vod-message, .chat-list--default');
        if (chatContainer) {
            const messages = Array.from(chatContainer.querySelectorAll('.chat-line__message, .vod-message')).slice(-150);
            toggleEmotesInNode(chatContainer, true, messages); // Немедленное обновление эмодзи
            console.log("[Content] Эмодзи в чате обновлены");
        }

        // Включение фильтрации текста через ChatFilter
        chatFilter.setTextFilteringEnabled(true);
        if (chatContainer) {
            const messages = Array.from(chatContainer.querySelectorAll('.chat-line__message, .vod-message')).slice(-150);
            chatFilter.filterTextInNode(chatContainer, messages); // Немедленная фильтрация текста
            console.log("[Content] Текст в чате отфильтрован");
        }

        // Запуск наблюдателей
        startUnifiedRootObserver();
        startKeywordFiltering();
        monitorChannelChange();
        monitorKeywordChatReset();
        monitorIframeChanges();
        monitorKeywordIframeChanges();
        startKeywordWatchdog();
        handleKeywordVisibilityChange();

        // Включение обработки никнеймов
        if (window.renameNicknamesInstance) {
            window.renameNicknamesInstance.toggleRenameNickEnabled(true);
            console.log("[Content] RenameNicknames включено");
        } else {
            console.warn("[Content] Экземпляр RenameNicknames не найден");
        }

        // Обновление UI
        if (uiElements && uiElements.blockAllButton && uiElements.unblockAllButton) {
            uiElements.blockAllButton.classList.add('active');
            uiElements.unblockAllButton.classList.remove('active');
            console.log("[Content] UI обновлено: blockAllButton активна");
        }

    } catch (error) {
        console.error("[Content] Ошибка в enableBlocking:", error);
        window.Notifications.showPanelNotification('Ошибка при включении блокировки', 5000, false);
    }
}

function disableBlocking() {
    console.log("[Content] Отключение блокировки...");
    try {
        isBlockingEnabled = false;
        setStorage('isBlockingEnabled', false);
        console.log("[Content] isBlockingEnabled установлено в:", isBlockingEnabled);

        // Очистка кэша обработанных эмодзи
        processedEmotes = new WeakMap();
        console.log("[Content] Коллекция processedEmotes очищена");

        // Восстановление всех скрытых эмодзи
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-room__content, .vod-message, .chat-list--default');
        if (chatContainer) {
            const messages = Array.from(chatContainer.querySelectorAll('.chat-line__message, .vod-message')).slice(-150);
            const emotes = messages.flatMap(msg => msg.querySelectorAll(`
                .chat-image,
                .chat-line__message--emote,
                .bttv-emote,
                .seventv-emote,
                .ffz-emote,
                .twitch-emote
            `)).slice(-150);
            emotes.forEach(emote => {
                emote.style.display = ''; // Восстанавливаем видимость
            });
            console.log("[Content] Все эмодзи восстановлены");
        }

        // Восстановление отфильтрованных сообщений
        filteredMessages.forEach((data, messageId) => {
            if (data.element && data.element.parentNode) {
                const textFragment = data.element.querySelector('[data-a-target="chat-message-text"], [data-test-selector="comment-message-selector"]');
                if (textFragment && data.originalText) {
                    textFragment.textContent = data.originalText; // Восстанавливаем оригинальный текст
                }
                data.element.style.display = ''; // Восстанавливаем видимость сообщения
            }
        });
        filteredMessages.clear();
        console.log("[Content] Коллекция filteredMessages очищена, сообщения восстановлены");

        // Отключение фильтрации текста через ChatFilter
        chatFilter.setTextFilteringEnabled(false);
        console.log("[Content] Фильтрация текста отключена через ChatFilter");

        // Остановка всех наблюдателей
        if (rootObserver) {
            rootObserver.disconnect();
            rootObserver = null;
            console.log("[Content] rootObserver отключён");
        }
        if (keywordObserver) {
            keywordObserver.disconnect();
            keywordObserver = null;
            keywordObserverIsActive = false;
            console.log("[Content] keywordObserver отключён");
        }
        if (connectionObserver) {
            connectionObserver.disconnect();
            connectionObserver = null;
            console.log("[Content] connectionObserver отключён");
        }
        if (iframeObserver) {
            iframeObserver.disconnect();
            iframeObserver = null;
            console.log("[Content] iframeObserver отключён");
        }

        // Остановка мониторинга
        if (window.monitorChannelChangeInterval) {
            clearInterval(window.monitorChannelChangeInterval);
            window.monitorChannelChangeInterval = null;
            console.log("[Content] monitorChannelChange отключён");
        }
        if (window.monitorKeywordChatResetInterval) {
            clearInterval(window.monitorKeywordChatResetInterval);
            window.monitorKeywordChatResetInterval = null;
            console.log("[Content] monitorKeywordChatReset отключён");
        }
        if (window.monitorKeywordIframeChangesInterval) {
            clearInterval(window.monitorKeywordIframeChangesInterval);
            window.monitorKeywordIframeChangesInterval = null;
            console.log("[Content] monitorKeywordIframeChanges отключён");
        }
        if (window.keywordWatchdogInterval) {
            clearInterval(window.keywordWatchdogInterval);
            window.keywordWatchdogInterval = null;
            console.log("[Content] startKeywordWatchdog отключён");
        }

        // Отключение обработки никнеймов
        if (window.renameNicknamesInstance) {
            window.renameNicknamesInstance.toggleRenameNickEnabled(false);
            console.log("[Content] RenameNicknames отключено");
        } else {
            console.warn("[Content] Экземпляр RenameNicknames не найден");
        }

        // Обновление UI
        if (uiElements && uiElements.unblockAllButton && uiElements.blockAllButton) {
            uiElements.unblockAllButton.classList.add('active');
            uiElements.blockAllButton.classList.remove('active');
            console.log("[Content] UI обновлено: unblockAllButton активна");
        }

    } catch (error) {
        console.error("[Content] Ошибка в disableBlocking:", error);
        window.Notifications.showPanelNotification('Ошибка при отключении блокировки', 5000, false);
    }
}
    // Сохранение наблюдателей для последующего управления
    function storeObservers() {
        if (!rootObserver) {
            rootObserver = new MutationObserver(() => {
                console.log("[Content] rootObserver активен");
            });
        }
        if (!keywordObserver) {
            keywordObserver = new MutationObserver(() => {
                console.log("[Content] keywordObserver активен");
            });
        }
        if (!connectionObserver) {
            connectionObserver = new MutationObserver(() => {
                console.log("[Content] connectionObserver активен");
            });
        }
        if (!iframeObserver) {
            iframeObserver = new MutationObserver(() => {
                console.log("[Content] iframeObserver активен");
            });
        }
    }

    // Экспорт функций
    window.enableBlocking = enableBlocking;
    window.disableBlocking = disableBlocking;
    console.log("[UI] Модуль enable__disableBlocking инициализирован");
})(); */
/* ТЕСТ  // enable__disableBlocking.js //
/* ТЕСТ  // enable__disableBlocking.js //
/* ТЕСТ  // enable__disableBlocking.js //
/* ТЕСТ  // enable__disableBlocking.js //
/* ТЕСТ  // enable__disableBlocking.js //

// *///