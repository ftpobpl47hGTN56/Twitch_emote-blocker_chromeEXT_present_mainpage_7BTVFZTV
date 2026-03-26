
// update_BannedChatList.js // 

(function() {
    'use strict';
    
    // Встроенные утилиты (локальные для этого модуля)
    function getItemHeight(container, itemClass) {
        const sampleLi = document.createElement('li');
        sampleLi.className = itemClass;
        sampleLi.style.visibility = 'hidden';
        sampleLi.innerHTML = `
            <div class="keyword-content" style="display: flex; justify-content: space-between; align-items: center;">
                <span>Test</span>
                <div class="date-delete-group">
                    <span class="data-time">Test</span>
                    <button class="delete-button">Delete</button>
                </div>
            </div>
            <span>Test</span>
        `;
        container.appendChild(sampleLi);
        const height = sampleLi.offsetHeight || 60;
        sampleLi.remove();
        return height;
    }
    
    function createDebouncedRender(listElement, renderCallback, itemHeight, lastScrollTopRef ) {
        let scrollTimeout;
        let lastScrollTop = lastScrollTopRef || 0;
        return function debouncedRender() {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const currentScrollTop = listElement.scrollTop;
                if (Math.abs(currentScrollTop - lastScrollTop) < itemHeight / 2) {
                    console.log('[Debug] Scroll position unchanged, skipping render');
                    return;
                }
                lastScrollTop = currentScrollTop;
                console.log('[Debug] Debounced render triggered');
                renderCallback();
            }, 100);
        };
    }
     
    
    // Основная функция (остальной код без изменений)
      function updateBannedChatList(bannedChatList, { bannedKeywords = [], bannedUsers = [], newlyAddedIds = new Set(), lastKeyword = null }, searchTerm = '') {
        console.log('[Content] Updating banned chat list...', {
            keywordsCount: bannedKeywords.length,
            usersCount: bannedUsers.length,
            searchTerm,
            lastKeywordId: lastKeyword?.id,
            timestamp: performance.now()
        });
        if (!bannedChatList) {
            console.error('[Content] Banned chat list element not found');
            return;
        }

        // === ВСТАВЛЯЕМ СЮДА ===
        let currentSearchTerm = searchTerm.trim();
        window.currentSearchTerm = currentSearchTerm; // важно: сохраняем в window для highlightText и дебаунса
       

        // === СБРАСЫВАЕМ ПРЕДЫДУЩИЙ DEBOUNCE ПРИ ЛЮБОМ ВЫЗОВЕ С НОВЫМ searchTerm ===
        

        let container = bannedChatList.querySelector('.banned-chat-list-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'banned-chat-list-container';
            bannedChatList.appendChild(container);
            console.log('[Debug] Created banned-chat-list-container');
        }
        container.style.position = 'relative';
        container.style.padding = '0';
        const itemHeight = getItemHeight(container, 'keyword-item');  
        let allItems = [
            ...bannedKeywords.map(item => ({ ...item, source: 'keyword' })),
            ...bannedUsers.map(item => ({ ...item, source: 'selected' }))
        ].filter(item => item && item.id && item.text);
        
        if (!Array.isArray(allItems)) {
            console.error('[Content] Invalid items array:', allItems);
            container.innerHTML = '<div>No items available</div>';
            bannedChatList.scrollTop = 0;
            return;
        }
              // ПРАВИЛЬНАЯ фильтрация по поисковому запросу
        let filteredItems = allItems;
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filteredItems = allItems.filter(item => {
                const textToSearch = [
                    item.text || '',
                    item.isNickname ? 'user' : item.isPhrase ? 'phrase' : 'keyword'
                ].join(' ').toLowerCase();
                return textToSearch.includes(lowerSearch);
            });
            console.log(`[updateBannedChatList] Filtered by "${searchTerm}": ${filteredItems.length} из ${allItems.length}`);
        }

        const totalHeight = filteredItems.length * itemHeight;
        container.style.height = `${totalHeight}px`;
        
        let isRendering = false;
        
        function renderVisibleItems() {
            if (isRendering) {
                console.log('[renderVisibleItems] Rendering already in progress, skipping');
                return;
            }
            isRendering = true;
            const scrollTop = bannedChatList.scrollTop;
            const viewportHeight = bannedChatList.clientHeight;
            const buffer = 15;
            const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
            const endIndex = Math.min(filteredItems.length - 1, Math.ceil((scrollTop + viewportHeight) / itemHeight) + buffer);
            console.log('[renderVisibleItems] Rendering items:', {
                startIndex, endIndex, total: filteredItems.length, scrollTop, viewportHeight, itemHeight
            });
            container.innerHTML = '';
            if (filteredItems.length === 0) {
                container.innerHTML = '<div>' + (searchTerm ? 'No items match the search' : 'No items added') + '</div>';
                isRendering = false;
                return;
            }
            if (startIndex > endIndex || startIndex >= filteredItems.length) {
                console.warn('[renderVisibleItems] Invalid indices, skipping render:', { startIndex, endIndex });
                isRendering = false;
                return;
            }
            const renderTimestamp = performance.now();
            for (let i = startIndex; i <= endIndex; i++) {
                const item = filteredItems[i];
                if (!item || !item.id) {
                    console.warn('[Debug] Invalid item at index:', i, item);
                    continue;
                }
                let li = document.createElement('li');
                li.className = `list-item keyword-item ${newlyAddedIds.has(item.id) ? 'new-item' : ''} ${item.id === lastKeyword?.id ? 'last-added-item-highlight' : ''}`;
                li.dataset.id = item.id;
                li.style.position = 'absolute';
                li.style.top = `${i * itemHeight}px`;
                li.style.width = '100%';
                const displayText = item.isNickname ? item.text : item.text;
                const titleText = window.highlightText(`${item.isNickname ? 'Nickname' : 'Keyword'}: ${displayText}`, searchTerm);
                const infoText = window.highlightText(`(${item.isNickname ? 'User' : item.isPhrase ? 'Phrase' : 'Word'})`, searchTerm);
                const dateTimeText = item.date ? new Date(item.date).toLocaleString('en-US') : 'N/A';
                li.innerHTML = `
                    <div class="keyword-content" style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="item-text">${titleText}</span>
                        <div class="date-delete-group">
                            <span class="data-time">${dateTimeText}</span>
                            <button class="delete-button" data-render-id="${renderTimestamp}">Delete</button>
                        </div>
                    </div>
                    <span class="item-text">${infoText}</span>
                `;
                const deleteButton = li.querySelector('.delete-button');
                deleteButton.addEventListener('click', () => {
                    console.log('[renderVisibleItems] Delete button clicked:', { id: item.id, source: item.source });
                    try {
                        removeKeyWordOrbannedUser(item.id, item.source);
                    } catch (e) {
                        console.error('[renderVisibleItems] Error removing item:', e);
                        window.Notifications?.showPanelNotification?.('Error removing item', 5000, false);
                    }
                }, { once: true });
                container.appendChild(li);
                if (item.id === lastKeyword?.id) {
                    setTimeout(() => {
                        li.classList.remove('last-added-item-highlight');
                        console.log(`[Content]  item-highlight убрана с элемента: ${item.text} (ID: ${item.id})`);
                    }, 6000);
                }
            }
            console.log('[Debug] Total items in DOM:', container.children.length);
            isRendering = false;
        }
        
        renderVisibleItems();
        if (lastKeyword && lastKeyword.id) {
            scrollToLastItem(bannedChatList, filteredItems, lastKeyword.id, itemHeight);  
        }
        // Удаляем старые обработчики (на всякий случай)
bannedChatList.removeEventListener('scroll', window.debouncedRenderBanned);
window.removeEventListener('resize', window.debouncedRenderBanned);

// Создаём новый дебаунс-рендер
const debouncedRender = createDebouncedRender(bannedChatList, () => {
    // Дополнительная защита: если список только что обновился — не очищаем сразу
    if (performance.now() - (window.lastBannedListUpdate || 0) < 300) {
        console.log('[Debug] Skipping debounced render right after update');
        return;
    }
    renderVisibleItems();
}, itemHeight);

// Сохраняем для будущего удаления
window.debouncedRenderBanned = debouncedRender;

// Устанавливаем обработчики
bannedChatList.addEventListener('scroll', debouncedRender, { passive: true });
window.addEventListener('resize', debouncedRender, { passive: true });

// Принудительный рендер сразу после обновления
renderVisibleItems();

// Если добавлен новый элемент — прокрутка и подсветка
if (lastKeyword && lastKeyword.id) {
    scrollToLastItem(bannedChatList, filteredItems, lastKeyword.id, itemHeight);  
}

// Сохраняем время последнего обновления списка
window.lastBannedListUpdate = performance.now();
        console.log('[updateBannedChatList] UI updated, items:', filteredItems.length);
    }
    
    // Экспорт
    window.updateBannedChatList = updateBannedChatList;
    
    
})();