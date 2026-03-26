// == ignoreUnignoreButtonFFZHover.js == автономный IIFE-модуль (обновлённая версия) ==
(() => {
    'use strict';

    const HOVER_CONTAINER_SELECTOR = '.ffz--hover-actions';
    const BUTTON_CLASS = 'ignore-unignore-ffz-button-7btvfz';

    // Скрыть сообщения пользователя
    function hideUserMessages(userId) {
        if (!userId) return;
        document.querySelectorAll(`.chat-line__message[data-user-id="${userId}"]`).forEach(msg => {
            const container = msg.querySelector('.message') || msg;
            if (container) container.style.display = 'none';
        });
    }

    // Показать сообщения пользователя
    function showUserMessages(userId) {
        if (!userId) return;
        document.querySelectorAll(`.chat-line__message[data-user-id="${userId}"]`).forEach(msg => {
            const container = msg.querySelector('.message') || msg;
            if (container) container.style.display = '';
        });
    }

    // Обновление внешнего вида кнопки
    function updateButtonAppearance(button, isBanned) {
    if (isBanned) {
        // SVG для "Снять игнор" (зелёный check)
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="19" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="none" stroke="#a2c3a8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19c0-2.21-2.686-4-6-4s-6 1.79-6 4m18-9l-4 4l-2-2m-6 0a4 4 0 1 1 0-8a4 4 0 0 1 0 8"/>
            </svg>`;
        button.dataset.title = 'Unmute user';
    } else {
        // SVG для "Игнор" (красный times)
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="19" viewBox="0 0 640 512" aria-hidden="true">
                <path fill="#a24457" d="m589.6 240l45.6-45.6c6.3-6.3 6.3-16.5 0-22.8l-22.8-22.8c-6.3-6.3-16.5-6.3-22.8 0L544 194.4l-45.6-45.6c-6.3-6.3-16.5-6.3-22.8 0l-22.8 22.8c-6.3 6.3-6.3 16.5 0 22.8l45.6 45.6l-45.6 45.6c-6.3 6.3-6.3 16.5 0 22.8l22.8 22.8c6.3 6.3 16.5 6.3 22.8 0l45.6-45.6l45.6 45.6c6.3 6.3 16.5 6.3 22.8 0l22.8-22.8c6.3-6.3 6.3-16.5 0-22.8zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128m89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4"/>
            </svg>`;
        button.dataset.title = 'ignore user';
    }

    // Убираем классы цвета Twitch, так как цвет теперь внутри SVG
    button.classList.remove('tw-c-text-good', 'tw-c-text-bad');
}
    // Добавление/обновление кнопки в hover-контейнере
    function addToggleButton(hoverContainer) {
        if (hoverContainer.querySelector(`.${BUTTON_CLASS}`)) {
            return;
        }

        const messageLine = hoverContainer.closest('.chat-line__message');
        if (!messageLine) return;

        const userId = messageLine.dataset.userId || messageLine.getAttribute('data-user-id') || null;
        const usernameEl = messageLine.querySelector('.chat-author__display-name');
        const displayName = usernameEl ? usernameEl.textContent.trim() : 'unknown';
        if (!displayName) return;

        // Текущий список bannedUsers
        let bannedUsers = [];
        try {
            const raw = localStorage.getItem('bannedUsers');
            bannedUsers = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(bannedUsers)) bannedUsers = [];
        } catch (err) {
            console.error('[IgnoreToggle] Ошибка чтения bannedUsers:', err);
            bannedUsers = [];
        }

        const isBanned = bannedUsers.some(u =>
            (u.userId && u.userId === userId) ||
            (u.displayText && u.displayText.toLowerCase() === displayName.toLowerCase())
        );

        const actionWrapper = document.createElement('div');
        actionWrapper.className = 'ffz-hover-action';

        const button = document.createElement('button');
        button.className = `ffz-tooltip ffz-mod-icon ${BUTTON_CLASS}`;
        updateButtonAppearance(button, isBanned);

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            let currentBanned = [];
            try {
                const raw = localStorage.getItem('bannedUsers');
                currentBanned = raw ? JSON.parse(raw) : [];
                if (!Array.isArray(currentBanned)) currentBanned = [];
            } catch (err) {
                currentBanned = [];
            }

            const currentlyBanned = currentBanned.some(u =>
                (u.userId && u.userId === userId) ||
                (u.displayText && u.displayText.toLowerCase() === displayName.toLowerCase())
            );

            if (currentlyBanned) {
                // Снять игнор
                const newList = currentBanned.filter(u =>
                    !( (u.userId && u.userId === userId) ||
                       (u.displayText && u.displayText.toLowerCase() === displayName.toLowerCase()) )
                );
                localStorage.setItem('bannedUsers', JSON.stringify(newList));
                console.log(`[IgnoreToggle] Снят игнор: ${displayName} (id: ${userId})`);
                showUserMessages(userId);
                if (window.Notifications?.showPanelNotification) {
                    window.Notifications.showPanelNotification(`Снят игнор: ${displayName}`);
                }
            } else {
                // Добавить в игнор
                const newEntry = {
                    id: `user_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
                    text: displayName.toLowerCase(),
                    displayText: displayName,
                    type: 'user',
                    userId: userId || null,
                    date: new Date().toISOString()
                };
                currentBanned.push(newEntry);
                localStorage.setItem('bannedUsers', JSON.stringify(currentBanned));
                console.log(`[IgnoreToggle] Добавлен в игнор: ${displayName} (id: ${userId})`);
                hideUserMessages(userId);
                if (window.Notifications?.showPanelNotification) {
                    window.Notifications.showPanelNotification(`Игнорируется: ${displayName}`);
                }
            }

            // Обновляем кнопку в текущем hover
            const newState = !currentlyBanned;
            updateButtonAppearance(button, newState);

            // Обновляем панель списка, если функция доступна
            if (typeof window.updateBannedChatList === 'function') {
                const bannedChatList = document.getElementById('banned-chat-list') || document.querySelector('.banned-chat-list');
                if (bannedChatList) {
                    window.updateBannedChatList(bannedChatList, {
                        bannedKeywords: JSON.parse(localStorage.getItem('bannedKeywords') || '[]'),
                        bannedUsers: JSON.parse(localStorage.getItem('bannedUsers') || '[]')
                    });
                }
            }
        });

        actionWrapper.appendChild(button);
        hoverContainer.appendChild(actionWrapper);
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;
                if (node.matches && node.matches(HOVER_CONTAINER_SELECTOR)) {
                    addToggleButton(node);
                }
                const containers = node.querySelectorAll ? node.querySelectorAll(HOVER_CONTAINER_SELECTOR) : [];
                containers.forEach(addToggleButton);
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll(HOVER_CONTAINER_SELECTOR).forEach(addToggleButton);

    console.log('[IgnoreToggle] Модуль переключаемой кнопки Игнор/Снять игнор (обновлён) загружен');
})();