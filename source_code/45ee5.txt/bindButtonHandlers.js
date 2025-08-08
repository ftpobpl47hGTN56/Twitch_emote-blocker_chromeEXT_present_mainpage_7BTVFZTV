// ========== обработчики  bindButtonHandlers.js модуль =============== //
function bindButtonHandlers(elements, handlers) {
    if (!elements)
        return;
    console.log("[UI] Binding button handlers...");
    // -------------- Bind existing buttons ---------------- //
    // ------------- обработчикии к кнопкам панели управления ---------------- //
    elements.searchButton.onclick = handlers.search;
    elements.addButton.onclick = handlers.add;
    elements.clearAllButton.onclick = handlers.clearAll;
    elements.unblockAllButton.onclick = handlers.unblockAll;
    elements.blockAllButton.onclick = handlers.blockAll;
    elements.showStatsButton.onclick = handlers.showStats;
    elements.closeChartButton.onclick = handlers.closeChart;
    elements.platformSelect.onchange = handlers.platformChange;
    elements.themeSelect.onchange = handlers.themeChange;
    // --------------------------- Bind toggle logging button -------------------------- //
    if (elements.toggleLoggingButton) {
        elements.toggleLoggingButton.onclick = handlers.toggleLogging;
        console.log("[UI] toggleLoggingButton handler bound");
    }
    else {
        console.error("[UI] toggleLoggingButton is undefined in bindButtonHandlers");
    }
    // ------------------------ Bind banned keywords button -------------------------- //
    if (elements.bannedСhatListButton) {
        elements.bannedСhatListButton.onclick = () => {
            console.log("[UI] Banned Keywords button clicked");
            handlers.toggleList('keywords');
        };
        console.log("[UI] bannedСhatListButton handler bound");
    }
    else {
        console.error("[UI] bannedСhatListButton is undefined in bindButtonHandlers");
    }
    // ------------------------ Bind toggle lists button ----------------------------- //
    if (elements.toggleListsButton) {
        elements.toggleListsButton.onclick = () => {
            console.log("[UI] Toggle Lists button clicked");
            handlers.toggleList(elements.currentList === 'blocked' ? 'keywords' : 'blocked');
            if (elements.counter) {
                updateCounter(elements.counter);
            }
        };
        console.log("[UI] toggleListsButton handler bound");
    }
    else {
        console.error("[UI] toggleListsButton is undefined in bindButtonHandlers");
    }
    // ---------------- Bind select banned users button ------------------------ //
    if (elements.selectBannedUsersButton) {
        elements.selectBannedUsersButton.onclick = () => {
            console.log("[UI] Select Banned Users button clicked");
            const action = elements.dataSelectionModal.dataset.action;
            animateModalClose(elements.dataSelectionModal, () => {
                if (action === 'export') {
                    console.log("[UI] Modal closed, exporting banned users...");
                    exportBannedUsers();
                }
                else if (action === 'import') {
                    console.log("[UI] Modal closed, importing banned users...");
                    importBannedUsers(elements.counter);
                }
            });
        };
        console.log("[UI] selectBannedUsersButton handler bound");
    }
    else {
        console.error("[UI] selectBannedUsersButton is undefined in bindButtonHandlers");
    }
    // ---------------- Bind select chat banned items button ---------------- //
    if (elements.selectChatBannedItemsButton) {
        elements.selectChatBannedItemsButton.onclick = () => {
            console.log("[UI] Select Chat Banned Items button clicked");
            if (!elements.dataSelectionModal) {
                console.error("[UI] dataSelectionModal is undefined");
                return;
            }
            const action = elements.dataSelectionModal.dataset.action;
            animateModalClose(elements.dataSelectionModal, () => {
                if (action === 'export') {
                    console.log("[UI] Modal closed, exporting chat banned items...");
                    if (typeof exportChatBannedItems === 'function') {
                        exportChatBannedItems();
                    }
                    else {
                        console.error("[UI] exportChatBannedItems is not defined");
                        window.Notifications.showPanelNotification("Export functionality not available", false);
                    }
                }
                else if (action === 'import') {
                    console.log("[UI] Modal closed, importing chat banned items...");
                    if (typeof importChatBannedItems === 'function') {
                        importChatBannedItems(elements.counter);
                        if (elements.counter) {
                            updateCounter(elements.counter);
                        }
                    }
                    else {
                        console.error("[UI] importChatBannedItems is not defined");
                        window.Notifications.showPanelNotification("Import functionality not available", false);
                    }
                }
            });
            console.log("[UI] selectChatBannedItemsButton handler bound");
        };
    }
    else {
        console.error("[UI] selectChatBannedItemsButton is undefined in bindButtonHandlers");
    }
    // ----------------------  Bind export button ---------------------- //
    if (elements.exportButton) {
        elements.exportButton.onclick = () => {
            console.log("[UI] Export button clicked, opening data selection modal...");
            if (elements.dataSelectionModal) {
                // Устанавливаем атрибут, чтобы указать, что это экспорт
                elements.dataSelectionModal.dataset.action = 'export';
                // Обновляем заголовок модального окна
                const modalTitle = elements.dataSelectionModal.querySelector('h3');
                if (modalTitle)
                    modalTitle.textContent = 'Select Data to Export';
                animateModalOpen(elements.dataSelectionModal);
            }
            else {
                console.error("[UI] dataSelectionModal is undefined");
            }
        };
        console.log("[UI] exportButton handler bound");
    }
    else {
        console.error("[UI] exportButton is undefined in bindButtonHandlers");
    }
    // --------------  Bind import button ---------------- //
    if (elements.importButton) {
        elements.importButton.onclick = () => {
            console.log("[UI] Import button clicked, opening data selection modal...");
            if (elements.dataSelectionModal) {
                // Устанавливаем атрибут, чтобы указать, что это импорт
                elements.dataSelectionModal.dataset.action = 'import';
                // Обновляем заголовок модального окна
                const modalTitle = elements.dataSelectionModal.querySelector('h3');
                if (modalTitle)
                    modalTitle.textContent = 'Select Data to Import';
                animateModalOpen(elements.dataSelectionModal);
            }
            else {
                console.error("[UI] dataSelectionModal is undefined");
            }
        };
        // Обновляем счетчик после импорта
        if (elements.counter) {
            updateCounter(elements.counter);
        }
        console.log("[UI] importButton handler bound");
    }
    else {
        console.error("[UI] importButton is undefined in bindButtonHandlers");
    }
    // ----------- Bind modal buttons ---------------- //
    if (elements.selectBlockedItemsButton) {
        elements.selectBlockedItemsButton.onclick = () => {
            console.log("[UI] Select Blocked Items button clicked");
            const action = elements.dataSelectionModal.dataset.action;
            animateModalClose(elements.dataSelectionModal, () => {
                if (action === 'export') {
                    console.log("[UI] Modal closed, exporting blocked items...");
                    exportBlockedItems('both');
                }
                else if (action === 'import') {
                    console.log("[UI] Modal closed, importing blocked items...");
                    importBlockedItems(elements.counter, 'both');
                    // Убрали updateCounter, так как он вызывается внутри importBlockedItems
                }
            });
            console.log("[UI] selectBlockedItemsButton handler bound");
        };
    }
    else {
        console.error("[UI] selectBlockedItemsButton is undefined in bindButtonHandlers");
    }
    // ----------- Bind select banned keywords button ---------------- //
    if (elements.selectBannedkeyWordsPhrasesButton) {
        elements.selectBannedkeyWordsPhrasesButton.onclick = () => {
            console.log("[UI] Select Banned Keywords button clicked");
            const action = elements.dataSelectionModal.dataset.action;
            animateModalClose(elements.dataSelectionModal, () => {
                if (action === 'export') {
                    console.log("[UI] Modal closed, exporting banned keywords...");
                    exportBannedKeywords();
                }
                else if (action === 'import') {
                    console.log("[UI] Modal closed, importing banned keywords...");
                    importBannedKeywords(elements.counter);
                    updateCounter(elements.counter); // Update counter after import
                }
            });
        };
        console.log("[UI] selectBannedkeyWordsPhrasesButton handler bound");
    }
    else {
        console.error("[UI] selectBannedkeyWordsPhrasesButton is undefined in bindButtonHandlers");
    }
    // ----------- Bind modal cancel button ---------------- //
    if (elements.modalCancelButton) {
        elements.modalCancelButton.onclick = () => {
            console.log("[UI] Modal Cancel button clicked");
            animateModalClose(elements.dataSelectionModal);
        };
        console.log("[UI] modalCancelButton handler bound");
    }
    else {
        console.error("[UI] modalCancelButton is undefined in bindButtonHandlers");
    }
    // ---------------------- Search input Button handler ---------------- //
    let searchTimeout;
    elements.searchInput.oninput = () => {
        if (searchTimeout)
            clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = elements.searchInput.value.trim();
            if (!searchTerm) {
                filterBlockedList('', elements.currentList);
                if (elements.resetSearchButton) {
                    elements.resetSearchButton.disabled = true;
                }
            }
            else {
                filterBlockedList(searchTerm, elements.currentList);
                if (elements.resetSearchButton) {
                    elements.resetSearchButton.disabled = false;
                }
            }
        }, 300);
    };
    // ---------------------- Обработчик для searchInput ----------------------- //
    elements.searchInput.oninput = () => {
        if (searchTimeout)
            clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = elements.searchInput.value.trim();
            console.log("[UI] Search input changed:", searchTerm);
            if (currentList === 'bannedWords') {
                filterBannedChatList(searchTerm);
            }
            else {
                filterBlockedList(searchTerm);
            }
            if (elements.resetSearchButton) {
                elements.resetSearchButton.disabled = !searchTerm;
            }
        }, 300);
    };
    // ---------------------- clear Search Button handler ---------------- //
    if (elements.resetSearchButton) {
        elements.resetSearchButton.onclick = () => {
            elements.searchInput.value = '';
            console.log("[UI] Search cleared");
            if (currentList === 'bannedWords') {
                filterBannedChatList('');
            }
            else {
                filterBlockedList('');
            }
            elements.resetSearchButton.disabled = true;
            if (uiElements.bannedСhatList) {
                uiElements.bannedСhatList.scrollTop = 0;
            }
        };
        elements.resetSearchButton.disabled = !elements.searchInput.value.trim();
    }
    else {
        console.error("[UI] resetSearchButton is undefined in bindButtonHandlers");
    }
}
//# sourceMappingURL=bindButtonHandlers.js.map