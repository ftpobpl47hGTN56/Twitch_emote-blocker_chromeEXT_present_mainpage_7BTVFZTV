
// update_BlockedEmotesList //

(function() {
    'use strict';
    
     function getItemHeight(container, itemClass) {
        const sampleLi = document.createElement('li');
        sampleLi.className = itemClass;
        sampleLi.style.visibility = 'hidden';
        sampleLi.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
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
    
    function createDebouncedRender(listElement, renderCallback, itemHeight) {
        let scrollTimeout;
        return function debouncedRender() {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                console.log('[Debug] Debounced render triggered');
                renderCallback();
            }, 100);
        };
    }
    
    
     function updateBlockedEmotesList(blockedList, { blockedEmotes, blockedChannels, newlyAddedIds }, searchTerm = '') {
        console.log('[Content] Updating blocked list (virtualized)...', {
            blockedEmotesCount: blockedEmotes.length,
            blockedChannelsCount: blockedChannels.length,
            searchTerm
        });
        if (!blockedList) {
            console.error('[Content] Blocked list element not found');
            return;
        }
        if (!blockedEmotes || !blockedChannels) {
            console.error('[Content] Invalid blocked items data', { blockedEmotes, blockedChannels });
            blockedList.innerHTML = '<div>Error: Invalid data</div>';
            return;
        }
        const allItems = [
            ...blockedChannels.filter(item => item && item.id),
            ...blockedEmotes.filter(item => item && item.id)
        ];
        console.log('[Debug] allItems count:', allItems.length);
        if (allItems.length === 0) {
            console.warn('[Debug] No items to display');
            blockedList.innerHTML = '<div>No blocked items</div>';
            return;
        }
        let container = blockedList.querySelector('.blocked-emotes-list-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'blocked-emotes-list-container';
            blockedList.appendChild(container);
            console.log('[Debug] Created blocked-emotes-list-container');
        }
        const itemHeight = getItemHeight(container, 'blocked-item'); 
        console.log('[Debug] Item height', itemHeight);
        const totalHeight = allItems.length * itemHeight;
        container.style.height = `${totalHeight}px`;
        const lastItem = allItems.length > 0 ? allItems.reduce((latest, current) => {
            return new Date(current.date) > new Date(latest.date) ? current : latest;
        }, allItems[0]) : null;
        console.log('[Debug] Last item', lastItem ? { id: lastItem.id, emoteName: lastItem.emoteName, date: lastItem.date } : null);
        
        let isRendering = false;
        
        function renderVisibleItems() {
            if (isRendering) {
                console.log('[renderVisibleItems] Rendering already in progress, skipping');
                return;
            }
            isRendering = true;
            const scrollTop = blockedList.scrollTop;
            const viewportHeight = blockedList.clientHeight;
            const buffer = 5;
            const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
            const endIndex = Math.min(allItems.length - 1, Math.ceil((scrollTop + viewportHeight) / itemHeight) + buffer);
            console.log('[Debug] Render indices', { scrollTop, viewportHeight, startIndex, endIndex });
            container.innerHTML = '';
            console.log('[Debug] Cleared container');
            if (startIndex > endIndex) {
                console.warn('[Debug] Invalid indices, no items rendered', { startIndex, endIndex });
                isRendering = false;
                return;
            }
            const renderTimestamp = performance.now();
            for (let i = startIndex; i <= endIndex; i++) {
                const item = allItems[i];
                if (!item || !item.id) {
                    console.warn('[Debug] Invalid item at index', i, item);
                    continue;
                }
                const li = document.createElement('li');
                li.className = `blocked-item ${newlyAddedIds.has(item.id) ? 'new-item' : ''} ${item.id === lastItem?.id ? 'last-added-item-highlight' : ''}`;
                li.dataset.id = item.id;
                li.style.position = 'absolute';
                li.style.top = `${i * itemHeight}px`;
                li.style.width = '100%';
                li.style.height = `${itemHeight}px`;
                let titleText = '';
                let infoText = '';
                if (item.platform === 'TwitchChannel') {
                    titleText = `TwitchChannel > channelName: ${item.channelName || item.name || item.emoteName || 'Unknown'}`;
                    infoText = `(emoteName: ${item.emoteName || 'Unknown'})`;
                } else {
                    titleText = `${item.platform} > ${item.emoteName || 'Unknown'}`;
                    infoText = `<a class="emote-link" href="${item.emoteUrl || '#'}" target="_blank" style="color:rgb(34, 184, 59); text-decoration: underline;">(url: ${item.emoteUrl || 'Unknown'})</a>`;
                }
                titleText = window.highlightText(titleText, searchTerm);
                infoText = window.highlightText(infoText, searchTerm);
                li.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${titleText}</span>
                        <div class="date-delete-group">
                            <span class="data-time">${item.date ? new Date(item.date).toLocaleString('en-GB') : 'N/A'}</span>
                            <button class="delete-button" data-render-id="${renderTimestamp}">Delete</button>
                        </div>
                    </div>
                    <span>${infoText}</span>
                `;
                li.querySelector('.delete-button').onclick = () => {
                    removeEmoteOrChannel(item.id);
                };
                const emoteLink = li.querySelector('.emote-link');
                if (emoteLink) {
                    window.addEmotePreviewHandlers(item, emoteLink);
                }
                container.appendChild(li);
                console.log('[Debug] Rendered item', { index: i, id: item.id, top: li.style.top });
                if (item.id === lastItem?.id) {
                    setTimeout(() => {
                        li.classList.remove('last-added-item-highlight');
                        console.log(`[Content] item-highlight removed from: ${item.emoteName || item.id}`);
                    }, 5000);
                }
            }
            console.log('[Debug] Total items in DOM', container.querySelectorAll('li').length);
            isRendering = false;
        }
        
        renderVisibleItems();
        blockedList.removeEventListener('scroll', window.debouncedRenderBlocked);
        window.removeEventListener('resize', window.debouncedRenderBlocked);
        const debouncedRender = createDebouncedRender(blockedList, renderVisibleItems, itemHeight); 
        window.debouncedRenderBlocked = debouncedRender;
        blockedList.addEventListener('scroll', debouncedRender);
        window.addEventListener('resize', debouncedRender);
    } 
     window.updateBlockedEmotesList = updateBlockedEmotesList;
    
})();

 