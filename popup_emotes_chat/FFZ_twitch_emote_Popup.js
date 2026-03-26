// ============ FFZ_twitch_emote_Popup.js ============  //

(function () {
    // ============-17-08-2025- исправлен удалены спам логов ======================== //
    // ====== В ЭТОЙ ВЕРСИИ ДОБАВЛЕНА ПОДДЕРЖКА ВСТАВКИ ТЕКСТ В ИНПУТ ============== //
 
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
        // Добавляем кнопку "Копировать всё"
        addCopyAllButton('twitch-emote-popup');
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
        popup.style.zIndex = '100001';
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
        }, 2000);
    }

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

    // Часть viewerCardObserver для Twitch
    const viewerCardObserverTwitch = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.matches && node.matches('[data-a-target="viewer-card-positioner"]') && !node.__popup_shown) {
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
    viewerCardObserverTwitch.observe(document.body, { childList: true, subtree: true });

})();