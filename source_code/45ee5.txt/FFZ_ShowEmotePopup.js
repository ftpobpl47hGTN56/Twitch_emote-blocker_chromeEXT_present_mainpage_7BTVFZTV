// Инициализация Web Worker
const worker = new Worker('worker.js');
// Общая функция для ожидания появления элемента в DOM
function waitForElement(selector, timeout = 1000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        const observer = new MutationObserver((mutations, obs) => {
            const foundElement = document.querySelector(selector);
            if (foundElement) {
                obs.disconnect();
                resolve(foundElement);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`[Content] Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}
// Общая функция для позиционирования попапа
function positionPopup(popup, viewerCard, platform) {
    if (!viewerCard || !document.contains(viewerCard)) {
        popup.style.right = '20px';
        popup.style.top = '20px';
        console.warn(`[Content] ${platform} viewer card not found, using fallback position`);
        return;
    }
    const rect = viewerCard.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = 320;
    const offset = 20;
    const minGap = 10;
    let left = rect.right + offset;
    let top = rect.top;
    if (left + popupWidth + minGap > viewportWidth) {
        left = rect.left - popupWidth - offset;
    }
    if (top + popup.offsetHeight + minGap > viewportHeight) {
        top = viewportHeight - popup.offsetHeight - offset;
    }
    if (top < minGap) {
        top = minGap;
    }
    if (left < minGap) {
        left = minGap;
        if (rect.bottom + popup.offsetHeight + offset <= viewportHeight) {
            left = rect.left;
            top = rect.bottom + offset;
        }
    }
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    console.log(`[Content] ${platform} popup positioned at left: ${left}, top: ${top}`);
} // заменен //
// Унифицированная функция для привязки попапа к карточке с поддержкой drag-and-drop
function attachPopupToViewerCard(popup, viewerCard, platform) {
    if (!viewerCard || !document.contains(viewerCard)) {
        console.warn(`[Content] ${platform} viewer card not found for drag-and-drop`);
        positionPopup(popup, null, platform);
        return;
    }
    // Позиционируем попап сразу
    positionPopup(popup, viewerCard, platform);
    // Обработчик перетаскивания
    let isDragging = false;
    const startDragging = (e) => {
        if (e.target.closest('.viewer-card-drag-cancel'))
            return;
        isDragging = true;
        console.log(`[Content] Started dragging ${platform} viewer card`);
    };
    const updatePosition = () => {
        if (isDragging) {
            positionPopup(popup, viewerCard, platform);
        }
    };
    const stopDragging = () => {
        if (isDragging) {
            isDragging = false;
            console.log(`[Content] Stopped dragging ${platform} viewer card`);
            positionPopup(popup, viewerCard, platform);
        }
    };
    viewerCard.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseup', stopDragging);
    // Наблюдатель за изменениями атрибутов карточки
    const observer = new MutationObserver(() => {
        if (!isDragging) {
            positionPopup(popup, viewerCard, platform);
        }
    });
    observer.observe(viewerCard, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        subtree: false
    });
    // Обработчик изменения размера окна
    const resizeHandler = () => {
        positionPopup(popup, viewerCard, platform);
    };
    window.addEventListener('resize', resizeHandler, { passive: true });
    // Периодическая проверка видимости карточки
    const checkVisibilityInterval = setInterval(() => {
        if (!document.contains(viewerCard)) {
            console.warn(`[Content] ${platform} viewer card removed from DOM, closing popup`);
            popup.remove();
            clearInterval(checkVisibilityInterval);
            return;
        }
        const computedStyle = window.getComputedStyle(viewerCard);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
            console.warn(`[Content] ${platform} viewer card hidden, restoring visibility`);
            viewerCard.style.display = '';
            viewerCard.style.visibility = 'visible';
            viewerCard.style.opacity = '1';
            preventHidingElements([], platform === 'Twitch' ? '[data-a-target="viewer-card-positioner"]' : '.ffz-viewer-card.tw-border');
            positionPopup(popup, viewerCard, platform);
        }
    }, 100);
    // Очистка при удалении попапа
    const cleanup = () => {
        observer.disconnect();
        window.removeEventListener('resize', resizeHandler);
        viewerCard.removeEventListener('mousedown', startDragging);
        document.removeEventListener('mousemove', updatePosition);
        document.removeEventListener('mouseup', stopDragging);
        clearInterval(checkVisibilityInterval);
        console.log(`[Content] Cleanup for ${platform} popup completed`);
    };
    popup.addEventListener('remove', cleanup, { once: true });
}
let lastPopupTriggerTime = 0;
const debounceDelay = 300; // Задержка 300 мс
let lastPopupId = null;
// Обновлённая функция showTwitchEmotePopup
function showTwitchEmotePopup(emotes, callback) {
    console.log("[Content] Attempting to show Twitch emote popup with emotes:", emotes);
    // =======  Проверка для запрета показа попапа только в контейнере PrattleNot ======= //
    // Проверка для запрета показа попапа только в контейнере PrattleNot
    const restrictedSelector = '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--top, ' +
        '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--bottom, ' +
        '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--right, ' +
        '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--left';
    if (emotes[0]?.element && emotes[0].element.closest(restrictedSelector)) {
        console.log(`[Content] Twitch popup blocked for element within restricted selector: ${restrictedSelector}`);
        return;
    }
    // =======  Проверка для запрета показа попапа только в контейнере PrattleNot ======= //
    const existingPopup = document.getElementById('twitch-emote-popup');
    if (existingPopup) {
        console.log("[Content] Twitch popup already exists, skipping creation");
        return;
    }
    const popup = document.createElement('div');
    popup.id = 'twitch-emote-popup';
    popup.innerHTML = `
        <div class="close-twitch-emote-popup-button" style="cursor:pointer;position:absolute;top:6px;right:10px;font-size:20px;">✕</div>
        <div class="emote-options"></div>
    `;
    document.body.appendChild(popup);
    console.log("[Content] Twitch popup element created and appended to body");
    // Инлайн-стили для попапа
    popup.style.position = 'fixed';
    popup.style.boxShadow = 'rgb(75 191 191 / 24%) 0px 4px 10px 2px';
    popup.style.background = 'linear-gradient(205deg, #406f76, #3b1d47)';
    popup.style.color = 'rgb(235, 235, 235)';
    popup.style.fontWeight = 'bold';
    popup.style.fontSize = '16px';
    popup.style.border = '1px solid #12b6a7';
    popup.style.borderRadius = '8px';
    popup.style.padding = '10px 10px 10px 10px';
    popup.style.zIndex = '10001';
    popup.style.maxWidth = '320px';
    popup.style.maxHeight = '500px';
    popup.style.overflowY = 'auto';
    popup.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    popup.style.opacity = '0';
    popup.style.transform = 'scale(0.9)';
    popup.style.display = 'block';
    popup.style.visibility = 'visible';
    popup.style.paddingTop = '32px';
    // Ожидание появления карточки
    waitForElement('[data-a-target="viewer-card-positioner"], .viewer-card', 1000)
        .then((twitchCard) => {
        console.log("[Content] Twitch viewer card found:", twitchCard);
        attachPopupToViewerCard(popup, twitchCard, 'Twitch');
    })
        .catch((error) => {
        console.warn(error.message);
        attachPopupToViewerCard(popup, null, 'Twitch'); // Используем запасную позицию
    });
    const optionsContainer = popup.querySelector('.emote-options');
    // Заполнение попапа
    emotes.forEach((emote) => {
        const option = document.createElement('div');
        option.className = 'emote-option';
        option.style.display = 'flex';
        option.style.alignItems = 'center';
        option.style.justifyContent = 'space-between';
        option.style.padding = '8px 0';
        option.style.borderBottom = '1px solid rgba(115, 209, 204, 0.16)';
        option.style.gap = '10px';
        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.minWidth = '0';
        const img = document.createElement('img');
        img.src = emote.src || '';
        img.alt = emote.alt || 'Emote';
        img.style.width = '24px';
        img.style.height = '24px';
        img.style.marginRight = '10px';
        img.style.flexShrink = '0';
        img.style.userSelect = 'none';
        const info = document.createElement('div');
        info.className = 'emote-info';
        info.style.fontSize = '14px';
        info.style.whiteSpace = 'nowrap';
        info.style.overflow = 'hidden';
        info.style.textOverflow = 'ellipsis';
        info.innerHTML = `<span>${emote.alt || 'Unnamed'} <span style="user-select:none;">(${emote.platform})</span></span>`;
        left.appendChild(img);
        left.appendChild(info);
        const blockButton = document.createElement('button');
        blockButton.className = 'block-button';
        blockButton.type = 'button';
        blockButton.textContent = 'Block';
        blockButton.style.background = ' #ff5555';
        blockButton.style.color = ' #ffffff';
        blockButton.style.border = 'none';
        blockButton.style.padding = '4px 8px';
        blockButton.style.borderRadius = '4px';
        blockButton.style.cursor = 'pointer';
        blockButton.style.fontSize = '14px';
        blockButton.style.marginLeft = '10px';
        blockButton.style.flexShrink = '0';
        blockButton.style.userSelect = 'none';
        blockButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("[Content] Block button clicked for Twitch emote:", emote);
            let targetElement = emote.element;
            if (!targetElement || !targetElement.isConnected) {
                targetElement = document.querySelector(`img[src="${emote.src}"]`);
                console.log("[Content] Twitch emote element re-fetched by src:", targetElement);
            }
            let platform = emote.platform || 'TwitchChannel';
            let emoteName = emote.alt || 'Unnamed';
            let emoteUrl = emote.src || '';
            let emotePrefix = emoteName;
            if (targetElement) {
                emoteName = targetElement.getAttribute('alt') ||
                    targetElement.getAttribute('data-emote-name') ||
                    targetElement.getAttribute('title') ||
                    targetElement.getAttribute('data-code') ||
                    emoteName;
                emoteName = emoteName.trim();
            }
            const dataProvider = targetElement?.getAttribute('data-provider') || '';
            const dataSet = targetElement?.getAttribute('data-set') || '';
            if (emoteUrl.includes('7tv.app') || dataProvider === '7tv' || dataSet?.includes('seventv_emotes')) {
                platform = '7tv';
                emoteUrl = emote.src;
                emoteName = emoteName || emoteUrl.split('/').slice(-2)[0] || 'Unnamed';
                emotePrefix = emoteUrl;
            }
            else if (emoteUrl.includes('betterttv.net') || dataProvider === 'bttv' || (dataProvider === 'ffz' && emoteUrl.includes('betterttv.net'))) {
                platform = 'bttTV';
                emoteUrl = emote.src;
                emoteName = emoteName || emoteUrl.split('/').pop().replace(/\.webp|\.png/, '') || 'Unnamed';
                emotePrefix = emoteUrl;
            }
            else if (emoteUrl.includes('frankerfacez.com') || (dataProvider === 'ffz' && !emoteUrl.includes('betterttv.net'))) {
                platform = 'ffz';
                emoteUrl = emote.src;
                emoteName = emoteName || emoteUrl.split('/').pop().replace(/\.webp|\.png/, '') || 'Unnamed';
                emotePrefix = emoteUrl;
            }
            else if (emoteUrl.includes('jtvnw.net') || dataProvider === 'twitch') {
                platform = 'TwitchChannel';
                emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                emoteUrl = '';
            }
            else if (dataProvider === 'emoji') {
                platform = 'emoji';
                emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                emotePrefix = emoteName;
                emoteUrl = emote.src;
            }
            else {
                platform = 'TwitchChannel';
                emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                emoteUrl = '';
            }
            if (!emoteName || emoteName === 'Unknown') {
                emoteName = targetElement?.getAttribute('data-id') || emoteUrl.split('/').pop() || 'Unnamed';
            }
            console.log(`[Content] Blocking Twitch emote:`, { emoteName, platform, emoteUrl, emotePrefix });
            const item = addEmoteOrChannel(emotePrefix, platform, emoteName, emoteUrl, targetElement);
            if (item && targetElement) {
                targetElement.setAttribute('data-emote-id', item.id);
                targetElement.style.display = 'none';
                console.log(`[Content] Immediately hid Twitch emote ${emoteName} with ID ${item.id}`);
                const parentContainer = targetElement.closest('.ffz--inline, .chat-line__message, .chat-image');
                if (parentContainer) {
                    const allEmotes = parentContainer.querySelectorAll('img.chat-line__message--emote, .ffz-emote, .seventv-emote, .bttv-emote, .twitch-emote, .chat-image');
                    const allBlocked = Array.from(allEmotes).every(e => e.style.display === 'none');
                    if (allBlocked) {
                        parentContainer.style.display = 'none';
                        console.log("[Content] Parent container hidden as all emotes are blocked");
                    }
                }
                if (uiElements?.counter) {
                    updateCounter(uiElements.counter);
                }
                setStorage(() => {
                    console.log("[Content] Storage updated after blocking Twitch emote");
                    toggleEmotesInNode(document.body, true);
                });
            }
            else {
                console.error("[Content] Failed to block Twitch emote:", emote);
                if (window.Notifications?.showPanelNotification) {
                    window.Notifications.showPanelNotification('Ошибка: эмодзи уже заблокирован или не удалось добавить', 5000, false);
                }
            }
            // popup.remove(); удаляем что бы не мешал //
            // popup.remove(); //
            callback(emote);
            if (twitchCard) {
                preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
            }
        });
        option.appendChild(left);
        option.appendChild(blockButton);
        optionsContainer.appendChild(option);
    });
    console.log("[Content] Twitch popup populated with", emotes.length, "emotes");
    // Кнопка закрытия попапа
    const closeButton = popup.querySelector('.close-twitch-emote-popup-button');
    closeButton.onclick = () => {
        console.log("[Content] Twitch emote popup closed via close button");
        popup.remove();
        if (twitchCard) {
            preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
        }
    };
    // Анимация
    setTimeout(() => {
        popup.classList.add('visible');
        popup.style.opacity = '1';
        popup.style.transform = 'scale(1)';
        console.log("[Content] Twitch popup visibility class and styles applied");
    }, 10);
    // Закрытие при клике вне попапа
    document.addEventListener('click', function closePopup(e) {
        if (!popup.contains(e.target) && e.target !== popup && (!twitchCard || !twitchCard.contains(e.target))) {
            console.log("[Content] Closing Twitch popup due to outside click");
            popup.remove();
            if (twitchCard) {
                preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
            }
        }
    }, { capture: true, once: true });
    // Обход проблемы с асинхронным добавлением кнопки закрытия
    const waitForCloseButton = setInterval(() => {
        const twitchCardCloseButton = twitchCard?.querySelector('button[aria-label="Hide"], button[aria-label="Close"]');
        if (twitchCardCloseButton) {
            twitchCardCloseButton.removeEventListener('click', twitchCardCloseButton._closeHandler);
            twitchCardCloseButton._closeHandler = () => {
                console.log("[Content] Twitch viewer card close button clicked");
                popup.remove();
                preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
            };
            twitchCardCloseButton.addEventListener('click', twitchCardCloseButton._closeHandler, { once: true });
            clearInterval(waitForCloseButton);
        }
    }, 5000);
}
// Обновлённая функция showEmoteSelectionPopup
function showEmoteSelectionPopup(emotes, callback) {
    console.log("[Content] Attempting to show emote selection popup with emotes:", emotes);
    // =======  Проверка для запрета показа попапа только в контейнере PrattleNot ======= //
    // Проверка для запрета показа попапа только в контейнере PrattleNot
    const restrictedSelector = '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--top, ' +
        '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--bottom, ' +
        '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--right, ' +
        '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--left';
    if (emotes[0]?.element && emotes[0].element.closest(restrictedSelector)) {
        console.log(`[Content] Twitch popup blocked for element within restricted selector: ${restrictedSelector}`);
        return;
    }
    // =======  Проверка для запрета показа попапа только в контейнере PrattleNot ======= //
    const existingPopup = document.getElementById('emote-selection-popup');
    if (existingPopup) {
        console.log("[Content] Emote selection popup already exists, skipping creation");
        return;
    }
    const popup = document.createElement('div');
    popup.id = 'emote-selection-popup';
    popup.innerHTML = `
        <div class="close-emote-popup-button" style="cursor:pointer;position:absolute;top:6px;right:10px;font-size:20px;">✕</div>
        <div class="emote-options"></div>
    `;
    document.body.appendChild(popup);
    console.log("[Content] FFZ popup element created and appended to body");
    // Инлайн-стили для попапа
    popup.style.position = 'fixed';
    popup.style.boxShadow = 'rgb(75 191 191 / 24%) 0px 4px 10px 2px';
    popup.style.background = 'linear-gradient(205deg, #406f76, #3b1d47)';
    popup.style.color = 'rgb(235, 235, 235)';
    popup.style.fontWeight = 'bold';
    popup.style.fontSize = '16px';
    popup.style.border = '1px solid #12b6a7';
    popup.style.borderRadius = '8px';
    popup.style.padding = '10px 10px 10px 10px';
    popup.style.zIndex = '10001';
    popup.style.maxWidth = '320px';
    popup.style.maxHeight = '500px';
    popup.style.overflowY = 'auto';
    popup.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    popup.style.opacity = '0';
    popup.style.transform = 'scale(0.9)';
    popup.style.display = 'block';
    popup.style.visibility = 'visible';
    popup.style.paddingTop = '32px';
    // Ожидание появления карточки
    waitForElement('.ffz-viewer-card.tw-border, [data-a-target="viewer-card-positioner"], .viewer-card', 1000)
        .then((viewerCard) => {
        console.log("[Content] FFZ/Twitch viewer card found:", viewerCard);
        attachPopupToViewerCard(popup, viewerCard, 'FFZ');
    })
        .catch((error) => {
        console.warn(error.message);
        attachPopupToViewerCard(popup, null, 'FFZ'); // Используем запасную позицию
    });
    const optionsContainer = popup.querySelector('.emote-options');
    // Заполнение попапа
    emotes.forEach((emote) => {
        const option = document.createElement('div');
        option.className = 'emote-option';
        option.style.display = 'flex';
        option.style.alignItems = 'center';
        option.style.justifyContent = 'space-between';
        option.style.padding = '8px 0';
        option.style.borderBottom = '1px solid rgba(115, 209, 204, 0.16)';
        option.style.gap = '10px';
        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.minWidth = '0';
        const img = document.createElement('img');
        img.src = emote.src || '';
        img.alt = emote.alt || 'Emote';
        img.style.width = '24px'; // Исправлено: было 'width'
        img.style.height = '24px';
        img.style.marginRight = '10px';
        img.style.flexShrink = '0';
        img.style.userSelect = 'none';
        const info = document.createElement('div');
        info.className = 'emote-info';
        info.style.fontSize = '14px';
        info.style.whiteSpace = 'nowrap';
        info.style.overflow = 'hidden';
        info.style.textOverflow = 'ellipsis';
        info.innerHTML = `<span>${emote.alt || 'Unnamed'} <span style="user-select:none;">(${emote.platform})</span></span>`;
        left.appendChild(img);
        left.appendChild(info);
        const blockButton = document.createElement('button');
        blockButton.className = 'block-button';
        blockButton.type = 'button';
        blockButton.textContent = 'Block';
        blockButton.style.background = '#ff5555';
        blockButton.style.color = '#ffffff';
        blockButton.style.border = 'none';
        blockButton.style.padding = '4px 8px';
        blockButton.style.borderRadius = '4px';
        blockButton.style.cursor = 'pointer';
        blockButton.style.fontSize = '14px';
        blockButton.style.marginLeft = '10px';
        blockButton.style.flexShrink = '0';
        blockButton.style.userSelect = 'none';
        blockButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("[Content] Block button clicked for FFZ emote:", emote);
            let targetElement = emote.element;
            if (!targetElement || !targetElement.isConnected) {
                targetElement = document.querySelector(`img[src="${emote.src}"]`);
                console.log("[Content] FFZ emote element re-fetched by src:", targetElement);
            }
            let platform = emote.platform || 'TwitchChannel';
            let emoteName = emote.alt || 'Unnamed';
            let emoteUrl = emote.src || '';
            let emotePrefix = emoteName;
            if (targetElement) {
                emoteName = targetElement.getAttribute('alt') ||
                    targetElement.getAttribute('data-emote-name') ||
                    targetElement.getAttribute('title') ||
                    targetElement.getAttribute('data-code') ||
                    emoteName;
                emoteName = emoteName.trim();
            }
            const dataProvider = targetElement?.getAttribute('data-provider') || '';
            const dataSet = targetElement?.getAttribute('data-set') || '';
            if (emoteUrl.includes('7tv.app') || dataProvider === '7tv' || dataSet?.includes('seventv_emotes')) {
                platform = '7tv';
                emoteUrl = emote.src;
                emoteName = emoteName || emoteUrl.split('/').slice(-2)[0] || 'Unnamed';
                emotePrefix = emoteUrl;
            }
            else if (emoteUrl.includes('betterttv.net') || dataProvider === 'bttv' || (dataProvider === 'ffz' && emoteUrl.includes('betterttv.net'))) {
                platform = 'bttTV';
                emoteUrl = emote.src;
                emoteName = emoteName || emoteUrl.split('/').pop().replace(/\.webp|\.png/, '') || 'Unnamed';
                emotePrefix = emoteUrl;
            }
            else if (emoteUrl.includes('frankerfacez.com') || (dataProvider === 'ffz' && !emoteUrl.includes('betterttv.net'))) {
                platform = 'ffz';
                emoteUrl = emote.src;
                emoteName = emoteName || emoteUrl.split('/').pop().replace(/\.webp|\.png/, '') || 'Unnamed';
                emotePrefix = emoteUrl;
            }
            else if (emoteUrl.includes('jtvnw.net') || dataProvider === 'twitch') {
                platform = 'TwitchChannel';
                emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                emoteUrl = '';
            }
            else if (dataProvider === 'emoji') {
                platform = 'emoji';
                emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                emotePrefix = emoteName;
                emoteUrl = emote.src;
            }
            else {
                platform = 'TwitchChannel';
                emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                emoteUrl = '';
            }
            if (!emoteName || emoteName === 'Unknown') {
                emoteName = targetElement?.getAttribute('data-id') || emoteUrl.split('/').pop() || 'Unnamed';
            }
            console.log(`[Content] Blocking FFZ emote:`, { emoteName, platform, emoteUrl, emotePrefix });
            const item = addEmoteOrChannel(emotePrefix, platform, emoteName, emoteUrl, targetElement);
            if (item && targetElement) {
                targetElement.setAttribute('data-emote-id', item.id);
                targetElement.style.display = 'none';
                console.log(`[Content] Immediately hid FFZ emote ${emoteName} with ID ${item.id}`);
                const parentContainer = targetElement.closest('.ffz--inline, .chat-line__message, .chat-image');
                if (parentContainer) {
                    const allEmotes = parentContainer.querySelectorAll('img.chat-line__message--emote, .ffz-emote, .seventv-emote, .bttv-emote, .twitch-emote, .chat-image');
                    const allBlocked = Array.from(allEmotes).every(e => e.style.display === 'none');
                    if (allBlocked) {
                        parentContainer.style.display = 'none';
                        console.log("[Content] Parent container hidden as all emotes are blocked");
                    }
                }
                if (uiElements?.counter) {
                    updateCounter(uiElements.counter);
                }
                setStorage(() => {
                    console.log("[Content] Storage updated after blocking FFZ emote");
                    toggleEmotesInNode(document.body, true);
                });
            }
            else {
                console.error("[Content] Failed to block FFZ emote:", emote);
                if (window.Notifications?.showPanelNotification) {
                    window.Notifications.showPanelNotification('Ошибка: эмодзи уже заблокирован или не удалось добавить', 5000, false);
                }
            }
            // удаляем что бы незакрывался автоматически и не мешал  //
            //  popup.remove(); //
            callback(emote);
        });
        option.appendChild(left);
        option.appendChild(blockButton);
        optionsContainer.appendChild(option);
    });
    console.log("[Content] FFZ popup populated with", emotes.length, "emotes");
    // Кнопка закрытия попапа
    const closeButton = popup.querySelector('.close-emote-popup-button');
    closeButton.onclick = () => {
        console.log("[Content] FFZ emote popup closed via close button");
        popup.remove();
    };
    // Анимация
    setTimeout(() => {
        popup.classList.add('visible');
        popup.style.opacity = '1';
        popup.style.transform = 'scale(1)';
        console.log("[Content] FFZ popup visibility class and styles applied");
    }, 10);
    // Закрытие при клике вне попапа
    document.addEventListener('click', function closePopup(e) {
        if (!popup.contains(e.target) && e.target !== popup && (!viewerCard || !viewerCard.contains(e.target))) {
            console.log("[Content] Closing FFZ popup due to outside click");
            popup.remove();
        }
    }, { capture: true, once: true });
    // удаляем этот блок кода Обход поскольку это вызывает вызова с перового раза баги отображения попап
    // и спам в логах // 
    //  // Обход проблемы с асинхронным добавлением кнопки закрытия
    // const waitForCloseButton = setInterval(() => {
    // const viewerCardCloseButton = viewerCard?.querySelector('button[aria-label="Close"], button[aria-label="Hide"]');
    // if (viewerCardCloseButton) {
    //   viewerCardCloseButton.removeEventListener('click', viewerCardCloseButton._closeHandler);
    // viewerCardCloseButton._closeHandler = () => {
    //      console.log("[Content] FFZ viewer card close button clicked");
    //    popup.remove();
    //};
    // viewerCardCloseButton.addEventListener('click', viewerCardCloseButton._closeHandler, { once: true });
    // clearInterval(waitForCloseButton);
    //  }  //
    //  }, 5000); //
}
// Функция для отправки данных в Worker
function preventHidingElements(elements, viewerCardSelector) {
    worker.postMessage({
        emotePickerElements: elements,
        viewerCardSelector: viewerCardSelector
    });
}
// Обработчик сообщений от Worker
worker.onmessage = function (e) {
    console.log('[Content] Worker response:', e.data);
    if (e.data.status === 'viewerCardRestored') {
        console.log('[Content] Viewer card visibility restored by worker:', e.data.message);
    }
    else if (e.data.status === 'viewerCardNotFound') {
        console.warn('[Content] Viewer card not found in DOM:', e.data.message);
    }
};
// ========= Наблюдатель за появлением карточки Twitch ======== //
let twitchCardObserver;
function observeTwitchCard() {
    if (twitchCardObserver) {
        twitchCardObserver.disconnect();
    }
    twitchCardObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.matches && (node.matches('[data-a-target="viewer-card-positioner"]') || node.matches('.viewer-card'))) {
                    console.log('[Content] Twitch viewer card detected in DOM:', node);
                    node.__popup_shown = true;
                    const emotes = getEmotesFromTwitchCard(node);
                    if (emotes.length) {
                        console.log('[Content] Showing Twitch emote popup for detected card:', emotes);
                        showTwitchEmotePopup(emotes, (selectedEmote) => {
                            let emoteName = selectedEmote.alt || 'Unnamed';
                            let emoteUrl = selectedEmote.src || '';
                            let emotePrefix = emoteName;
                            const platform = selectedEmote.platform || 'Twitch';
                            if (platform === 'TwitchChannel' || platform === 'emoji') {
                                const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                                emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                                emoteUrl = platform === 'emoji' ? emoteUrl : '';
                            }
                            else {
                                emotePrefix = emoteUrl || emoteName;
                            }
                            console.log(`[Content] Blocking selected Twitch emote from popup:`, { emoteName, platform, emoteUrl, emotePrefix });
                            const item = addEmoteOrChannel(emotePrefix, platform, emoteName, emoteUrl, selectedEmote.element);
                            if (item) {
                                if (selectedEmote.element) {
                                    selectedEmote.element.setAttribute('data-emote-id', item.id);
                                    selectedEmote.element.style.display = 'none';
                                    console.log(`[Content] Immediately hid Twitch emote ${emoteName} with ID ${item.id}`);
                                }
                                setStorage(() => {
                                    console.log("[Content] Storage updated after blocking from Twitch popup");
                                    toggleEmotesInNode(document.body, true);
                                });
                            }
                            else {
                                console.error("[Content] Failed to block Twitch emote from popup:", selectedEmote);
                            }
                        });
                    }
                    preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
                }
            });
        });
    });
    twitchCardObserver.observe(document.body, { childList: true, subtree: true });
}
// Запускаем наблюдатель
observeTwitchCard();
function getEmotesFromViewerCard(card) {
    const emotes = [];
    const mainEmoteImg = card.querySelector('.ffz-avatar img');
    const displayName = card.querySelector('.viewer-card__display-name h4')?.textContent?.trim() || 'Unnamed';
    const platformText = card.querySelector('.viewer-card__banner p')?.textContent?.trim() || 'Unknown';
    const platform = platformText.includes('Twitch') ? 'Twitch' : '7tv';
    if (mainEmoteImg) {
        emotes.push({
            src: mainEmoteImg.src,
            alt: mainEmoteImg.alt || mainEmoteImg.title || displayName,
            platform: platform,
            element: mainEmoteImg,
            id: mainEmoteImg.src.split('/').slice(-2, -1)[0] || ''
        });
        if (window.Notifications?.showPanelNotification) {
            window.Notifications.showPanelNotification(`Main emote found: ${displayName} (${platform})`, 3000, false);
        }
    }
    else {
        if (window.Notifications?.showPanelNotification) {
            window.Notifications.showPanelNotification('No main emote image found in viewer card', 3000, false);
        }
        console.log("[DEBUG] No main emote image. Card HTML:", card.outerHTML);
    }
    card.querySelectorAll('.ffz-emote-card__modifiers .tw-image-avatar').forEach(img => {
        emotes.push({
            src: img.src,
            alt: img.alt || img.title || img.closest('.tw-flex.tw-align-items-center')?.querySelector('h4')?.textContent?.trim() || 'Unnamed',
            platform: platform,
            element: img,
            id: img.src.split('/').slice(-2, -1)[0] || ''
        });
    });
    if (emotes.length === 0 && window.Notifications?.showPanelNotification) {
        window.Notifications.showPanelNotification('No emotes found in viewer card', 3000, false);
    }
    return emotes;
}
// Сохранение существующих функций
function getEmotesFromTwitchCard(card) {
    const emotes = [];
    const mainEmoteImg = card.querySelector('.emote-card__big-emote');
    const displayName = card.querySelector('h4[data-test-selector="emote-code-header"]')?.textContent?.trim() || 'Unnamed';
    const platform = card.querySelector('p[data-test-selector="emote-type-copy"]')?.textContent?.trim() || 'Twitch';
    if (mainEmoteImg) {
        emotes.push({
            src: mainEmoteImg.src,
            alt: mainEmoteImg.alt || displayName,
            platform: platform,
            element: mainEmoteImg,
            id: mainEmoteImg.src.split('/').slice(-2, -1)[0] || ''
        });
    }
    console.log("[Content] Extracted emotes from Twitch card:", emotes);
    return emotes;
}
function getEmotesFromViewerCard(card) {
    const emotes = [];
    const mainEmoteImg = card.querySelector('.ffz-avatar img');
    const displayName = card.querySelector('.viewer-card__display-name h4')?.textContent?.trim() || 'Unnamed';
    const platformText = card.querySelector('.viewer-card__banner p')?.textContent?.trim() || 'Unknown';
    const platform = platformText.includes('Twitch') ? 'Twitch' : '7tv';
    if (mainEmoteImg) {
        emotes.push({
            src: mainEmoteImg.src,
            alt: mainEmoteImg.alt || mainEmoteImg.title || displayName,
            platform: platform,
            element: mainEmoteImg,
            id: mainEmoteImg.src.split('/').slice(-2, -1)[0] || ''
        });
        if (window.Notifications?.showPanelNotification) {
            window.Notifications.showPanelNotification(`Main emote found: ${displayName} (${platform})`, 3000, false);
        }
    }
    else {
        if (window.Notifications?.showPanelNotification) {
            window.Notifications.showPanelNotification('No main emote image found in viewer card', 3000, false);
        }
        console.log("[DEBUG] No main emote image. Card HTML:", card.outerHTML);
    }
    card.querySelectorAll('.ffz-emote-card__modifiers .tw-image-avatar').forEach(img => {
        emotes.push({
            src: img.src,
            alt: img.alt || img.title || img.closest('.tw-flex.tw-align-items-center')?.querySelector('h4')?.textContent?.trim() || 'Unnamed',
            platform: platform,
            element: img,
            id: img.src.split('/').slice(-2, -1)[0] || ''
        });
    });
    if (emotes.length === 0 && window.Notifications?.showPanelNotification) {
        window.Notifications.showPanelNotification('No emotes found in viewer card', 3000, false);
    }
    console.log("[Content] Extracted emotes from viewer card:", emotes);
    return emotes;
}
function getEmotesFromChatMessage(messageContainer) {
    const emotes = [];
    const emoteElements = messageContainer.querySelectorAll('.chat-line__message--emote, .ffz-emote, .seventv-emote, .bttv-emote, .twitch-emote, .ffz-emoji');
    emoteElements.forEach(img => {
        const alt = img.alt || 'Unnamed';
        const src = img.src || '';
        const platform = img.getAttribute('data-provider') || 'Unknown';
        const id = img.getAttribute('data-id') || src.split('/').slice(-2, -1)[0] || '';
        emotes.push({
            src: src,
            alt: alt,
            platform: platform,
            element: img,
            id: id
        });
    });
    console.log("[Content] Extracted emotes from chat message:", emotes);
    return emotes;
}
// Обработчик клика по смайлу в чате
function handleChatEmoteClick() {
    document.body.removeEventListener('click', handleChatEmoteClick._handler);
    handleChatEmoteClick._handler = (e) => {
        const emoteElement = e.target.closest('.chat-line__message--emote, .ffz-emote, .seventv-emote, .bttv-emote, .twitch-emote, .ffz-emoji');
        if (!emoteElement)
            return;
        if (document.getElementById('emote-selection-popup') || document.getElementById('twitch-emote-popup')) {
            console.log("[Content] Popup already open, skipping click");
            return;
        }
        const messageContainer = emoteElement.closest('.chat-line__message');
        if (!messageContainer) {
            console.warn("[Content] No chat-line__message found for emote click");
            return;
        }
        const emotes = getEmotesFromChatMessage(messageContainer);
        if (emotes.length) {
            console.log("[Content] Showing emote selection popup for chat emotes:", emotes);
            showEmoteSelectionPopup(emotes, (selectedEmote) => {
                console.log("[Content] Blocking emote from chat popup:", selectedEmote);
            });
            // Симулируем клик по имени пользователя для вызова Twitch-карточки
            waitForElement('[data-a-target="chat-message-username"]', 1000)
                .then((usernameElement) => {
                if (!document.querySelector('[data-a-target="viewer-card-positioner"]')) {
                    usernameElement.click();
                    console.log("[Content] Simulated click on username to trigger Twitch viewer card");
                }
            })
                .catch((error) => {
                console.warn("[Content] Username element not found for simulated click:", error.message);
            });
        }
    };
    document.body.addEventListener('click', handleChatEmoteClick._handler, { capture: true });
}
// Запускаем обработчик
handleChatEmoteClick();
// Наблюдатель за сообщениями в чате
const chatObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.classList && node.classList.contains('chat-line__message') && !node.__popup_shown) {
                node.__popup_shown = true;
                const emotes = getEmotesFromChatMessage(node);
                if (emotes.length) {
                    console.log("[Content] Showing emote selection popup for new chat message:", emotes);
                    showEmoteSelectionPopup(emotes, (selectedEmote) => {
                        let emoteName = selectedEmote.alt || 'Unnamed';
                        let emoteUrl = selectedEmote.src || '';
                        let emotePrefix = emoteName;
                        const platform = selectedEmote.platform || 'Unknown';
                        if (platform === 'TwitchChannel' || platform === 'emoji') {
                            const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                            emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                            emoteUrl = platform === 'emoji' ? emoteUrl : '';
                        }
                        else {
                            emotePrefix = emoteUrl || emoteName;
                        }
                        console.log(`[Content] Blocking selected emote from chat popup:`, { emoteName, platform, emoteUrl, emotePrefix });
                        const item = addEmoteOrChannel(emotePrefix, platform, emoteName, emoteUrl, selectedEmote.element);
                        if (item) {
                            if (selectedEmote.element) {
                                selectedEmote.element.setAttribute('data-emote-id', item.id);
                                selectedEmote.element.style.display = 'none';
                                console.log(`[Content] Immediately hid emote ${emoteName} with ID ${item.id}`);
                            }
                            setStorage(() => {
                                console.log("[Content] Storage updated after blocking from chat popup");
                                toggleEmotesInNode(document.body, true);
                            });
                        }
                        else {
                            console.error("[Content] Failed to block emote from chat popup:", selectedEmote);
                            if (window.Notifications?.showPanelNotification) {
                                window.Notifications.showPanelNotification('Ошибка: эмодзи уже заблокирован или не удалось добавить', 5000, false);
                            }
                        }
                    });
                }
            }
        });
    });
});
chatObserver.observe(document.querySelector('.chat-scrollable-area__message-container') || document.body, {
    childList: true,
    subtree: true
});
// Observer за карточкой зрителя ffz-viewer-card, который будет показывать попап при появлении карточки
// Наблюдатель за появлением карточек
const viewerCardObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.matches && node.matches('.ffz-viewer-card.tw-border') && !node.__popup_shown) {
                node.__popup_shown = true;
                const emotes = getEmotesFromViewerCard(node);
                if (emotes.length) {
                    console.log("[Content] Showing FFZ emote popup for detected card:", emotes);
                    showEmoteSelectionPopup(emotes, (selectedEmote) => {
                        console.log("[Content] Blocking FFZ emote:", selectedEmote);
                    });
                }
            }
            else if (node.matches && node.matches('[data-a-target="viewer-card-positioner"]') && !node.__popup_shown) {
                node.__popup_shown = true;
                const emotes = getEmotesFromTwitchCard(node);
                if (emotes.length) {
                    console.log("[Content] Showing Twitch emote popup for detected card:", emotes);
                    showTwitchEmotePopup(emotes, (selectedEmote) => {
                        console.log("[Content] Blocking Twitch emote:", selectedEmote);
                    });
                }
                preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
            }
        });
    });
});
viewerCardObserver.observe(document.body, { childList: true, subtree: true });
// Глобальная проверка видимости карточки
setInterval(() => {
    const twitchCard = document.querySelector('[data-a-target="viewer-card-positioner"]') ||
        document.querySelector('.viewer-card');
    if (twitchCard) {
        const computedStyle = window.getComputedStyle(twitchCard);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
            console.warn("[Content] Twitch viewer card hidden detected in global check, restoring visibility");
            twitchCard.style.display = '';
            twitchCard.style.visibility = 'visible';
            twitchCard.style.opacity = '1';
            preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
        }
    }
    else {
        console.warn("[Content] Twitch viewer card not found in global check");
    }
}, 100);
//# sourceMappingURL=FFZ_ShowEmotePopup.js.map