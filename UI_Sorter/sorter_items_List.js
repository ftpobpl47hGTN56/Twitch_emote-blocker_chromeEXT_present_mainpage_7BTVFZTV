
//  sorter_items_List.js //


function sortBannedChatItems(criteria, order) {
    console.log("[Content] Sorting banned chat items by:", criteria, order);
    // =========== Получаем данные из storage
    const bannedKeywords = getStorage('bannedKeywords', []);
    const bannedUsers = getStorage('bannedUsers', []);
    // =========== Функция сортировки для bannedKeywords и bannedUsers
    const sortFunc = (a, b) => {
        let comparison = 0;
        if (criteria === 'name') {
            comparison = (a.text || '').localeCompare(b.text || '');
        }
        else if (criteria === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        }
        return order === 'asc' ? comparison : -comparison;
    };
    // =========== Сортируем списки
    bannedKeywords.sort(sortFunc);
    bannedUsers.sort(sortFunc);
    // =========== Сохраняем отсортированные данные
    setStorage('bannedKeywords', bannedKeywords);
    setStorage('bannedUsers', bannedUsers);
    // =========== Обновляем отображение второго списка
    if (uiElements?.bannedChatList) {
        updateBannedChatList(uiElements.bannedChatList, {
            bannedKeywords,
            bannedUsers,
            newlyAddedIds: new Set(),
            lastKeyword: null
        }, '', criteria, order);
    }
    else {
        console.warn("[Content] bannedChatList element not found for update");
    }
}

function sortblockedEmotes(criteria, order) {
    console.log("[Content] Sorting by:", criteria, order);
    // Сортировка для blockedEmotes и blockedChannels
    const sortFunc = (a, b) => {
        let comparison = 0;
        if (criteria === 'name') {
            const nameA = a.platform === 'TwitchChannel' ? (a.channelName || a.emoteName || '') : (a.emoteName || '');
            const nameB = b.platform === 'TwitchChannel' ? (b.channelName || b.emoteName || '') : (b.emoteName || '');
            comparison = nameA.localeCompare(nameB);
        }
        else if (criteria === 'platform') {
            comparison = (a.platform || '').localeCompare(b.platform || '');
        }
        else if (criteria === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        }
        return order === 'asc' ? comparison : -comparison;
    };
    blockedEmotes.sort(sortFunc);
    blockedChannels.sort(sortFunc);
    // Сортировка для bannedKeywords и bannedUsers
    const sortKeywordFunc = (a, b) => {
        let comparison = 0;
        if (criteria === 'name') {
            comparison = (a.text || '').localeCompare(b.text || '');
        }
        else if (criteria === 'platform') {
            comparison = (a.text || '').localeCompare(b.text || '');
        }
        else if (criteria === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        }
        return order === 'asc' ? comparison : -comparison;
    };
    const bannedKeywords = getStorage('bannedKeywords', []);
    const bannedUsers = getStorage('bannedUsers', []);
    bannedKeywords.sort(sortKeywordFunc);
    bannedUsers.sort(sortKeywordFunc);
    setStorage('bannedKeywords', bannedKeywords);
    setStorage('bannedUsers', bannedUsers);
    // Обновляем списки без автоматической прокрутки
    if (uiElements?.blockedList) {
        updateBlockedEmotesList(uiElements.blockedList, getBlockedItems());
    }
    if (uiElements?.bannedChatList) {
        updateBannedChatList(uiElements.bannedChatList, {
            bannedKeywords: getStorage('bannedKeywords', []),
            bannedUsers: getStorage('bannedUsers', []),
            newlyAddedIds: new Set(),
            lastKeyword: null
        }, '', criteria, order);
    }
}




function goToLastAddedItem() {
    console.log("[Content] Going to last added item...");
    const blockedList = uiElements?.blockedList || document.getElementById('blocked-emotes-list');
    if (!blockedList) {
        console.warn("[Content] Blocked list element not found");
        return;
    }
    const allItems = [...blockedChannels, ...blockedEmotes];
    if (allItems.length === 0) {
        console.log("[Content] Список пуст, некуда прокручивать");
        return;
    }
    // Находим элемент с самой поздней датой
    const lastItem = allItems.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
    }, allItems[0]);
    console.log('[Debug] Last item', { id: lastItem.id, emoteName: lastItem.emoteName, date: lastItem.date });
    // Вычисляем индекс последнего элемента
    const lastItemIndex = allItems.findIndex(item => item.id === lastItem.id);
    if (lastItemIndex === -1) {
        console.warn("[Content] Последний элемент не найден в списке");
        return;
    }
    // Получаем динамическую высоту элемента
    const getItemHeight = () => {
        const container = blockedList.querySelector('.blocked-emotes-list-container') || blockedList;
        const sampleLi = document.createElement('li');
        sampleLi.className = 'blocked-item';
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
    };
    const itemHeight = getItemHeight();
    console.log('[Debug] Item height in goToLastAddedItem', itemHeight);
    const lastItemPosition = lastItemIndex * itemHeight;
    const viewportHeight = blockedList.clientHeight;
    const container = blockedList.querySelector('.blocked-emotes-list-container') || blockedList;
    const containerHeight = parseFloat(container.style.height) || allItems.length * itemHeight;
    // Прокручиваем к последнему элементу, центрируя его
    const scrollPosition = Math.max(0, lastItemPosition - (viewportHeight / 2) + (itemHeight / 2));
    // Обновляем список перед прокруткой
    updateBlockedEmotesList(blockedList, getBlockedItems());
    // Ждем рендеринга и применяем прокрутку
    setTimeout(() => {
        blockedList.scrollTop = scrollPosition;
        console.log('[Debug] Scroll position set', {
            lastItemIndex,
            lastItemPosition,
            scrollPosition,
            viewportHeight,
            containerHeight,
            maxScroll: containerHeight - viewportHeight
        });
        // Проверяем наличие элемента
        const lastElement = blockedList.querySelector(`[data-id="${lastItem.id}"]`);
        console.log('[Debug] Last element search', { id: lastItem.id, found: !!lastElement });
        if (lastElement) {
            lastElement.classList.add('last-item-highlight');
            console.log(`[Content] Подсвечено: ${lastItem.emoteName} (ID: ${lastItem.id})`);
            setTimeout(() => {
                lastElement.classList.remove('last-item-highlight');
                console.log(`[Content] Подсветка убрана с элемента: ${lastItem.emoteName}`);
            }, 5000);
        }
        else {
            console.warn("[Content] Элемент не отрендерился после прокрутки", { id: lastItem.id });
            // Принудительный рендеринг с повторной прокруткой
            updateBlockedEmotesList(blockedList, getBlockedItems());
            setTimeout(() => {
                const retryElement = blockedList.querySelector(`[data-id="${lastItem.id}"]`);
                if (retryElement) {
                    blockedList.scrollTop = scrollPosition;
                    retryElement.classList.add('last-item-highlight');
                    console.log(`[Content] Подсвечено после повторного рендеринга: ${lastItem.emoteName}`);
                    setTimeout(() => {
                        retryElement.classList.remove('last-item-highlight');
                    }, 5000);
                }
                else {
                    console.error("[Content] Элемент всё ещё не найден", { id: lastItem.id });
                }
            }, 150);
        }
    }, 150);
    console.log(`[Content] Прокрутка инициирована к элементу: ${lastItem.emoteName} (Index: ${lastItemIndex}, Date: ${lastItem.date})`);
}
function goToLastBannedChatItem() {
    goToLastAddedKeyword(); // Перенаправляем на корректную реализацию
}


function goToLastAddedKeyword() {
    console.log('[Content] Going to last added keyword...');
    const bannedChatList = uiElements?.bannedChatList || document.getElementById('banned-chat-list');
    if (!bannedChatList) {
        console.warn('[Content] Banned chat list element not found');
        return;
    }
    const bannedKeywords = getStorage('bannedKeywords', []);
    const bannedUsers = getStorage('bannedUsers', []);
    const allItems = [
        ...bannedKeywords.map(item => ({ ...item, source: 'keyword' })),
        ...bannedUsers.map(item => ({ ...item, source: 'selected' }))
    ];
    if (allItems.length === 0) {
        console.log('[Content] Список пуст, некуда прокручивать');
        return;
    }
    // Находим элемент с самой поздней датой
    const lastItem = allItems.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
    }, allItems[0]);
    console.log('[Debug] Last item', { id: lastItem.id, text: lastItem.text, date: lastItem.date });
    // Вычисляем индекс последнего элемента
    const lastItemIndex = allItems.findIndex(item => item.id === lastItem.id);
    if (lastItemIndex === -1) {
        console.warn('[Content] Последний элемент не найден в списке');
        return;
    }
    // Получаем динамическую высоту элемента
    const getItemHeight = () => {
        const container = bannedChatList.querySelector('.banned-chat-list-container') || bannedChatList;
        const sampleLi = document.createElement('li');
        sampleLi.className = 'keyword-item';
        sampleLi.style.visibility = 'hidden';
        sampleLi.innerHTML = `
            <div class="keyword-content">
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
    };
    const itemHeight = getItemHeight();
    console.log('[Debug] Item height in goToLastAddedKeyword', itemHeight);
    const lastItemPosition = lastItemIndex * itemHeight;
    const viewportHeight = bannedChatList.clientHeight;
    const container = bannedChatList.querySelector('.banned-chat-list-container') || bannedChatList;
    const containerHeight = allItems.length * itemHeight;
    // Прокручиваем к последнему элементу, центрируя его
    const scrollPosition = Math.max(0, lastItemPosition - (viewportHeight / 2) + (itemHeight / 2));
    // Обновляем список перед прокруткой
    updateBannedChatList(bannedChatList, {
    bannedKeywords: getStorage('bannedKeywords', []),
    bannedUsers: getStorage('bannedUsers', []),
    newlyAddedIds: new Set(),
    lastKeyword: null
}, '');
    // Ждём рендеринга и применяем прокрутку
    setTimeout(() => {
        bannedChatList.scrollTop = scrollPosition;
        console.log('[Debug] Scroll position set', {
            lastItemIndex,
            lastItemPosition,
            scrollPosition,
            viewportHeight,
            containerHeight,
            maxScroll: containerHeight - viewportHeight
        });
        // Проверяем наличие элемента
        const lastElement = container.querySelector(`[data-id="${lastItem.id}"]`);
        console.log('[Debug] Last element search', { id: lastItem.id, found: !!lastElement });
        if (lastElement) {
            lastElement.classList.add('last-item-highlight');
            console.log(`[Content] Подсвечено: ${lastItem.text} (ID: ${lastItem.id})`);
            setTimeout(() => {
                lastElement.classList.remove('last-item-highlight');
                console.log(`[Content] Подсветка убрана с элемента: ${lastItem.text}`);
            }, 5000);
        }
        else {
            console.warn('[Content] Элемент не отрендерился после прокрутки', { id: lastItem.id });
            // Принудительный рендеринг с повторной прокруткой
            updateBannedChatList(bannedChatList, {
    bannedKeywords: getStorage('bannedKeywords', []),
    bannedUsers: getStorage('bannedUsers', []),
    newlyAddedIds: new Set(),
    lastKeyword: null
}, '');
            setTimeout(() => {
                const retryElement = container.querySelector(`[data-id="${lastItem.id}"]`);
                if (retryElement) {
                    bannedChatList.scrollTop = scrollPosition;
                    retryElement.classList.add('last-item-highlight');
                    console.log(`[Content] Подсвечено после повторного рендеринга: ${lastItem.text}`);
                    setTimeout(() => {
                        retryElement.classList.remove('last-item-highlight');
                    }, 5000);
                }
                else {
                    console.error('[Content] Элемент всё ещё не найден', { id: lastItem.id });
                }
            }, 150);
        }
    }, 150);
    console.log(`[Content] Прокрутка инициирована к элементу: ${lastItem.text} (Index: ${lastItemIndex}, Date: ${lastItem.date})`);
} 