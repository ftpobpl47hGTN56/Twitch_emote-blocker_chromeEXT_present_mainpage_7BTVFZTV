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
     
    // ---------------- Bind Modal select banned users button ------------------------ //
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
    // ---------------- Bind Modal select chat banned items button ---------------- //
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
    // ----------------------  Bind Modal export button ---------------------- //
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
    // --------------  Bind Modal import button ---------------- //
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
    // ----------- Bind Modal select banned keywords button ---------------- //
    if (elements.selectbannedKeywordsPhrasesButton) {
        elements.selectbannedKeywordsPhrasesButton.onclick = () => {
            console.log("[UI] Select Banned Keywords button clicked");
            const action = elements.dataSelectionModal.dataset.action;
            animateModalClose(elements.dataSelectionModal, () => {
                if (action === 'export') {
                    console.log("[UI] Modal closed, exporting banned keywords...");
                    exportbannedKeywords();
                }
                else if (action === 'import') {
                    console.log("[UI] Modal closed, importing banned keywords...");
                    importbannedKeywords(elements.counter);
                    updateCounter(elements.counter); // Update counter after import
                }
            });
        };
        console.log("[UI] selectbannedKeywordsPhrasesButton handler bound");
    }
    else {
        console.error("[UI] selectbannedKeywordsPhrasesButton is undefined in bindButtonHandlers");
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
 // ---------------------- Обработчик   searchInput ----------------------- //
 // ============== ОБРАБОТЧИКИ ПОИСКА И ОЧИСТКИ ======================== //

// ============ Обработчик Кнопка "Search"
const searchButton = document.getElementById('search-button');
if (searchButton) {
    searchButton.addEventListener('click', () => {
        const input = document.getElementById('search-input');
        const query = input?.value || '';
        filterBannedChatList(query);
    });
}

 // =========== Обработчик Кнопка "Clear search results" 07 12 2025
const clearSearchButton = document.getElementById('clear-search-results-button');
if (clearSearchButton) {
    clearSearchButton.addEventListener('click', () => {
        const input = document.getElementById('search-input');
        if (input) {
            input.value = ''; // очищаем поле
            input.focus(); // опционально: фокус остаётся
        }
        filterBannedChatList(''); 
        filterBlockedList(''); // обновляем список без фильтра, что вызовет updateBlockedEmotesList
    });
}

//============== Дополнительно: поиск по нажатию Enter в поле ввода
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            filterBannedChatList(searchInput.value);
        }
        if (e.key === 'Escape') {
            searchInput.value = '';
            filterBannedChatList('');
             filterBlockedList('');
        }
    });
}
 // ---------------------- Обработчик clear Search Button   ---------------- //
    if (elements.resetSearchButton) {
        elements.resetSearchButton.onclick = () => {
            elements.searchInput.value = '';
            console.log("[UI] Search cleared");
           if (currentList === 'bannedKeywords' || currentList === 'bannedChatList') {  
    filterBannedChatList('');
} else {
    filterBlockedList('');
}
        elements.resetSearchButton.disabled = true;
        if (uiElements.bannedChatList) {
                uiElements.bannedChatList.scrollTop = 0;
            }
        };
        elements.resetSearchButton.disabled = !elements.searchInput.value.trim();
    }
    else {
        console.error("[UI] resetSearchButton is undefined in bindButtonHandlers");
    }
} 


