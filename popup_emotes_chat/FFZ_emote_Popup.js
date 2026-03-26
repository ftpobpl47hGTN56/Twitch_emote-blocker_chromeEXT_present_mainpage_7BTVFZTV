
// ============ 7TV-BttTV FFZ_emote_Popup.js ============ //
 
(function () {
    // ============-17-08-2025- исправлен удалены спам логов ======================== //
    // ====== В ЭТОЙ ВЕРСИИ ДОБАВЛЕНА ПОДДЕРЖКА ВСТАВКИ ТЕКСТ В ИНПУТ ============== //

    // Обновлённая функция showEmoteSelectionPopup  showEmoteSelectionPopup с исправлением
    function showEmoteSelectionPopup(emotes, callback) {
    console.log("[Content] Attempting to show emote selection popup with emotes:", emotes);

    const restrictedSelector = '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--top, ' +
        '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--bottom, ' +
        '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--right, ' +
        '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--left';
    if (emotes[0]?.element && emotes[0].element.closest(restrictedSelector)) {
        console.log(`[Content] Twitch popup blocked for element within restricted selector: ${restrictedSelector}`);
        return;
    }

    const existingPopup = document.getElementById('emote-selection-popup');
    if (existingPopup) {
        console.log("[Content] Emote selection popup already exists, skipping creation");
        return;
    }

    const popup = document.createElement('div');
    popup.id = 'emote-selection-popup';
    popup.innerHTML = `
       <div class="close-emote-popup-button" style="
            cursor:pointer;
            position:absolute;
            top:6px;right:10px;
            font-size:20px;">✕</div>
          <div class="emote-options">
       </div>
        `;
    document.body.appendChild(popup);
    console.log("[Content] FFZ popup element created and appended to body");

    addPasteAllButton('emote-selection-popup');

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
    popup.style.zIndex = '555555';
    popup.style.maxWidth = '345px';
    popup.style.maxHeight = '500px';
    popup.style.overflowY = 'auto';
    popup.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    popup.style.opacity = '0';
    popup.style.transform = 'scale(0.9)';
    popup.style.display = 'block';
    popup.style.visibility = 'visible';
    popup.style.paddingTop = '32px';

    // ФЛАГ ДЛЯ ПОДАВЛЕНИЯ ЗАКРЫТИЯ ПОСЛЕ ДРАГА
    let suppressClose = false;

    // СИНХРОНИЗАЦИЯ С sep-emote-popup
    function syncWithCustomPopup() {
        const customPopup = document.getElementById('sep-emote-popup');
        if (!customPopup) return;

        const customRect = customPopup.getBoundingClientRect();
        const gap = 10;
        const W = window.innerWidth;
        const popupWidth = popup.offsetWidth || 345;

        let linkedLeft = customRect.right + gap;
        if (linkedLeft + popupWidth > W - 10) {
            linkedLeft = customRect.left - popupWidth - gap;
        }
        if (linkedLeft < 10) linkedLeft = 10;

        popup.style.removeProperty('right');
        popup.style.left = linkedLeft + 'px';
        popup.style.top = customRect.top + 'px';
    }

    // НАБЛЮДАТЕЛЬ ЗА sep-emote-popup
    const customPopupObserver = new MutationObserver((mutations) => {
        const customPopup = document.getElementById('sep-emote-popup');
        if (!customPopup) {
            // Кастомный попап удалён - закрываем этот тоже
            popup.remove();
            customPopupObserver.disconnect();
            return;
        }

        // Отслеживаем изменения style (позиционирование при драге)
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                syncWithCustomPopup();
            }
        });
    });

    // Ищем кастомный попап
    const customPopup = document.getElementById('sep-emote-popup');
    if (customPopup) {
        // Синхронизируем позицию сразу
        syncWithCustomPopup();
        
        // Следим за изменениями style кастомного попапа
        customPopupObserver.observe(customPopup, {
            attributes: true,
            attributeFilter: ['style']
        });

        // НЕ ИСПОЛЬЗУЕМ attachPopupToViewerCard - позиционируем относительно sep-emote-popup
    } else {
        // Фоллбэк - если кастомного попапа нет, привязываемся к viewer card
        waitForElement('.ffz-viewer-card.tw-border, [data-a-target="viewer-card-positioner"], .viewer-card', 1000)
            .then((viewerCard) => {
                console.log("[Content] FFZ/Twitch viewer card found:", viewerCard);
                attachPopupToViewerCard(popup, viewerCard, 'FFZ');
            })
            .catch((error) => {
                console.warn(error.message);
                attachPopupToViewerCard(popup, null, 'FFZ');
            });
    }

    // ЗАКРЫТИЕ ПРИ КЛИКЕ ВНЕ (С ЗАЩИТОЙ ОТ ДРАГА)
    const closeHandler = (e) => {
        if (suppressClose) {
            suppressClose = false;
            return;
        }

        const customPopup = document.getElementById('sep-emote-popup');
        const clickedInCustom = customPopup && customPopup.contains(e.target);
        const clickedInThis = popup.contains(e.target);

        if (!clickedInCustom && !clickedInThis) {
            console.log("[Content] Closing FFZ popup due to outside click");
            popup.remove();
            customPopupObserver.disconnect();
            document.removeEventListener('click', closeHandler, true);
        }
    };

    setTimeout(() => {
        document.addEventListener('click', closeHandler, { capture: true });
    }, 150);

    // СЛУШАЕМ СОБЫТИЕ ОКОНЧАНИЯ ДРАГА ОТ sep-emote-popup
    const dragEndListener = () => {
        suppressClose = true;
        setTimeout(() => { suppressClose = false; }, 100);
    };
    document.addEventListener('sep-popup-drag-end', dragEndListener);

    // Cleanup при удалении
    const cleanupObserver = new MutationObserver(() => {
        if (!document.contains(popup)) {
            customPopupObserver.disconnect();
            cleanupObserver.disconnect();
            document.removeEventListener('sep-popup-drag-end', dragEndListener);
        }
    });
    cleanupObserver.observe(document.body, { childList: true, subtree: true });

    const optionsContainer = popup.querySelector('.emote-options');
    
    // ВСЁ ОСТАЛЬНОЕ БЕЗ ИЗМЕНЕНИЙ (заполнение попапа эмоутами)
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
            } else if (emoteUrl.includes('betterttv.net') || dataProvider === 'bttv' || (dataProvider === 'ffz' && emoteUrl.includes('betterttv.net'))) {
                platform = 'bttTV';
                emoteUrl = emote.src;
                emoteName = emoteName || emoteUrl.split('/').pop().replace(/\.webp|\.png/, '') || 'Unnamed';
                emotePrefix = emoteUrl;
            } else if (emoteUrl.includes('frankerfacez.com') || (dataProvider === 'ffz' && !emoteUrl.includes('betterttv.net'))) {
                platform = 'ffz';
                emoteUrl = emote.src;
                emoteName = emoteName || emoteUrl.split('/').pop().replace(/\.webp|\.png/, '') || 'Unnamed';
                emotePrefix = emoteUrl;
            } else if (emoteUrl.includes('jtvnw.net') || dataProvider === 'twitch') {
                platform = 'TwitchChannel';
                emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                emoteUrl = '';
            } else if (dataProvider === 'emoji') {
                platform = 'emoji';
                emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                emotePrefix = emoteName;
                emoteUrl = emote.src;
            } else {
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
            } else {
                console.error("[Content] Failed to block FFZ emote:", emote);
                if (window.Notifications?.showPanelNotification) {
                    window.Notifications.showPanelNotification('Ошибка: эмодзи уже заблокирован или не удалось добавить', 5000, false);
                }
            }
            callback(emote);
        });
        
        option.appendChild(left);
        option.appendChild(blockButton);
        optionsContainer.appendChild(option);
    });

    console.log("[Content] FFZ popup populated with", emotes.length, "emotes");

    const closeButton = popup.querySelector('.close-emote-popup-button');
    closeButton.onclick = () => {
        console.log("[Content] FFZ emote popup closed via close button");
        popup.remove();
    };

    setTimeout(() => {
        popup.classList.add('visible');
        popup.style.opacity = '1';
        popup.style.transform = 'scale(1)';
        console.log("[Content] FFZ popup visibility class and styles applied");
    }, 10);
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
    // ДОБАВЛЕНЫ НОВЫЕ СЕЛЕКТОРЫ
    const emoteElements = messageContainer.querySelectorAll(
        '.chat-line__message--emote, .ffz-emote, .seventv-emote, ' +
        '.bttv-emote, .twitch-emote, .ffz-emoji, ' +
        '.sep-chat-emote, .sep-emote-base, .sep-emote-overlay'
    );
    
    emoteElements.forEach(img => {
        const alt = img.alt || 'Unnamed';
        const src = img.src || '';

        let platform = img.getAttribute('data-provider') || '';
        if (!platform) {
            if (src.includes('7tv.app')) platform = '7tv';
            else if (src.includes('betterttv.net')) platform = 'bttv';
            else if (src.includes('frankerfacez.com')) platform = 'ffz';
            else if (src.includes('jtvnw.net')) platform = 'twitch';
            else platform = 'Unknown';
        }

        const id = img.getAttribute('data-id') || src.split('/').slice(-2, -1)[0] || '';
        const isOverlay = img.classList.contains('sep-emote-overlay');

        emotes.push({ src, alt, platform, element: img, id, isOverlay });
    });

    console.log("[Content] Extracted emotes from chat message:", emotes);
    return emotes;
}

    // Обработчик клика по смайлу в чате
    function handleChatEmoteClick() {
        document.body.removeEventListener('click', handleChatEmoteClick._handler);
        handleChatEmoteClick._handler = (e) => {
          const emoteElement = e.target.closest(
            '.chat-line__message--emote, .ffz-emote, .seventv-emote, ' +
            '.bttv-emote, .twitch-emote, .ffz-emoji, ' +
            '.sep-chat-emote, .sep-emote-base, .sep-emote-overlay'
        );
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
    setTimeout(() => {
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
                  }, 40);  
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
    const viewerCardObserverFFZ = new MutationObserver((mutations) => {
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
            });
        });
    });
    viewerCardObserverFFZ.observe(document.body, { childList: true, subtree: true });

    // Создаём и добавляем кнопку "Копировать всё"
    // Глобальная переменная для хранения скопированного текста
    

    function addPasteAllButton(popupId) {
        const popup = document.getElementById(popupId);
        if (!popup) {
            console.error(`[Content] Попап с ID ${popupId} не найден`);
            return;
        }
        if (popup.querySelector('.paste-all-button')) {
            console.log(`[Content] Кнопка "Вставить" для попапа ${popupId} уже существует`);
            return;
        }

        // Создаём кнопку "Вставить"
        const pasteBtn = document.createElement('button');
        pasteBtn.className = 'paste-all-button';
        pasteBtn.style.cssText = `
            background: rgba(85, 221, 255, 0.11);
            color: rgba(85, 255, 127, 0.71);
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            position: absolute;
            top: 6px;
            left: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        pasteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg> paste
        `;
        pasteBtn.addEventListener('click', () => {
            // Извлекаем текст эмодзи из попапа
            const emoteSpans = popup.querySelectorAll('.emote-info span');
            console.log(`[Content] Найдено ${emoteSpans.length} элементов .emote-info span`);
            const emoteTexts = Array.from(emoteSpans)
                .map(span => {
                    // Извлекаем только текстовые узлы первого уровня, игнорируя вложенные span
                    const textNodes = Array.from(span.childNodes)
                        .filter(node => node.nodeType === Node.TEXT_NODE)
                        .map(node => node.textContent.trim())
                        .join('');
                    console.log(`[Content] Извлечённый текст из span: "${textNodes}"`);
                    // Удаляем (ffz), (7tv) и т.д., если они есть
                    return textNodes.replace(/\s*\([^)]+\)\s*/g, '').trim();
                })
                .filter(text => text.length > 0);
            
            // Формируем итоговую строку с пробелами в начале и конце
            const allEmotes = emoteTexts.length > 0 ? ` ${emoteTexts.join(' ')} ` : '';
            console.log(`[Content] Общий текст эмодзи: "${allEmotes}"`);

            if (allEmotes) {
                // Вставляем текст напрямую, без сохранения в буфер обмена
                pasteTextToInput(allEmotes);
                console.log(`[Content] Инициирована вставка эмодзи: "${allEmotes}"`);
                if (window.Notifications?.showPanelNotification) {
                    window.Notifications.showPanelNotification(`Вставлено: ${allEmotes}`, 3000, false);
                }
            } else {
                console.warn('[Content] Нет эмодзи для вставки');
                if (window.Notifications?.showPanelNotification) {
                    window.Notifications.showPanelNotification('Ошибка: нет эмодзи для вставки', 3000, false);
                }
            }
        });

        popup.appendChild(pasteBtn);
    }

    // Функция вставки текста в поле ввода
    function pasteTextToInput(text) {
        // Находим поле ввода
        const inputEditors = document.querySelectorAll('[data-a-target="chat-input"]');
        let inputEditor = null;

        // Если найдено несколько полей ввода, выбираем первое видимое
        if (inputEditors.length > 1) {
            console.warn(`[Content] Найдено ${inputEditors.length} элементов с data-a-target="chat-input", выбираем первое видимое`);
            inputEditor = Array.from(inputEditors).find(editor => {
                const style = window.getComputedStyle(editor);
                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
            });
        } else if (inputEditors.length === 1) {
            inputEditor = inputEditors[0];
        }

        if (!inputEditor) {
            console.error('[Content] Поле ввода чата не найдено');
            if (window.Notifications?.showPanelNotification) {
                window.Notifications.showPanelNotification('Ошибка: поле ввода не найдено', 3000, false);
            }
            return;
        }

        // Фокусируем поле ввода
        inputEditor.focus();
        console.log('[Content] Поле ввода в фокусе');

        try {
            // Проверяем тип элемента
            if (inputEditor.tagName.toLowerCase() === 'textarea') {
            // Работа с textarea
            const currentValue = inputEditor.value || '';
            const selectionStart = inputEditor.selectionStart || currentValue.length;
            const selectionEnd = inputEditor.selectionEnd || currentValue.length;

            // Вставляем текст в текущую позицию курсора
            inputEditor.value = currentValue.slice(0, selectionStart) + text + currentValue.slice(selectionEnd);

            // Устанавливаем курсор после вставленного текста
            const newCursorPos = selectionStart + text.length;
            inputEditor.setSelectionRange(newCursorPos, newCursorPos);

            // Диспатчим событие input
            const inputEvent = new Event('input', { bubbles: true });
            inputEditor.dispatchEvent(inputEvent);

            // Диспатчим событие keyup
            const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
            inputEditor.dispatchEvent(keyupEvent);

            console.log(`[Content] Текст успешно вставлен в textarea: "${text}"`);
        } else if (inputEditor.hasAttribute('contenteditable') && inputEditor.getAttribute('contenteditable') === 'true') {
            // Работа с contenteditable
            const supportsInputEvent = 'InputEvent' in window;

            if (supportsInputEvent) {
                // Создаём событие beforeinput
                const beforeInputEvent = new InputEvent('beforeinput', {
                    bubbles: true,
                    cancelable: true,
                    data: text,
                    inputType: 'insertText'
                });

                // Диспатчим beforeinput
                if (!inputEditor.dispatchEvent(beforeInputEvent)) {
                    console.warn('[Content] Событие beforeinput было отменено');
                    if (window.Notifications?.showPanelNotification) {
                        window.Notifications.showPanelNotification('Ошибка: ввод заблокирован редактором', 3000, false);
                    }
                    return;
                }

                // Устанавливаем текст через Range
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(inputEditor);
                range.collapse(false); // Курсор в конец
                selection.removeAllRanges();
                selection.addRange(range);

                // Вставляем текст через TextNode
                const textNode = document.createTextNode(text);
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.setEndAfter(textNode);
                selection.removeAllRanges();
                selection.addRange(range);

                // Диспатчим событие input
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    data: text,
                    inputType: 'insertText'
                });
                inputEditor.dispatchEvent(inputEvent);

                // Диспатчим событие keyup
                const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
                inputEditor.dispatchEvent(keyupEvent);

                    console.log(`[Content] Текст успешно вставлен через InputEvent: "${text}"`);
            } else {
                // Резервный вариант с использованием execCommand
                const selection = window.getSelection();
                selection.removeAllRanges();
                const range = document.createRange();
                range.selectNodeContents(inputEditor);
                range.collapse(false);
                selection.addRange(range);

                if (document.execCommand('insertText', false, text)) {
                    console.log(`[Content] Текст вставлен через execCommand: "${text}"`);
                } else {
                    console.warn('[Content] document.execCommand("insertText") не сработал, пробуем innerText');
                    inputEditor.innerText += text;
                }

                // Диспатчим событие input
                const inputEvent = new Event('input', { bubbles: true });
                inputEditor.dispatchEvent(inputEvent);

                // Диспатчим событие keyup
                const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
                inputEditor.dispatchEvent(keyupEvent);

                console.log(`[Content] Текст успешно вставлен через резервный метод: "${text}"`);
            }
        } else {
            console.error('[Content] Поле ввода не является ни textarea, ни contenteditable');
            if (window.Notifications?.showPanelNotification) {
                window.Notifications.showPanelNotification('Ошибка: неподдерживаемый тип поля ввода', 3000, false);
            }
        }
        } catch (err) {
            console.error('[Content] Ошибка при вставке текста:', err);
            if (window.Notifications?.showPanelNotification) {
                window.Notifications.showPanelNotification('Ошибка при вставке текста', 3000, false);
            }
        }
    }
    window.addPasteAllButton = addPasteAllButton;
    window.pasteTextToInput = pasteTextToInput;
})();