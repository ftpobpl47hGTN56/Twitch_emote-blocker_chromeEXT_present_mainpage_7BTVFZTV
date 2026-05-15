
// popup_emotes_chat/7TV_BtTV_FFZ_Popup.js


(function () {
    // ============-18-04-2026- v2: ПОСТОЯННЫЙ rAF-ЦИКЛ =========================== //
    // ====== Второй попап сам отслеживает позицию первого каждый кадр — ========== //
    // ====== не зависит от кастомных событий драга и от MutationObserver ========= //

    // ID ПЕРВОГО попапа (из EmotePopup-7BTVFZ.js) — ЕДИНАЯ КОНСТАНТА
    const MAIN_POPUP_ID = 'sepem-popup-7tvfzpicker';
    const THIS_POPUP_ID = 'custom-ffz-popup-emotes-trhj8h5e4jk9';

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

        const existingPopup = document.getElementById(THIS_POPUP_ID);
        if (existingPopup) {
            console.log("[Content] Emote selection popup already exists, skipping creation");
            return;
        }

        const popup = document.createElement('div');
        popup.id = THIS_POPUP_ID;
        popup.innerHTML = `
           <div class="close-ffz-popup-trhj8h5e4jk9" style="
                cursor:pointer;
                position:absolute;
                top:6px;right:10px;
                font-size:20px;">✕</div>
              <div class="emote-options">
           </div>
            `;
        document.body.appendChild(popup);
        console.log("[Content] FFZ popup element created and appended to body");

        addPasteAllButton(THIS_POPUP_ID);

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

        // ────────────────────────────────────────────────────────────────────
        // ПОСТОЯННЫЙ rAF-ЦИКЛ СИНХРОНИЗАЦИИ С ПЕРВЫМ ПОПАПОМ
        // ────────────────────────────────────────────────────────────────────

        let suppressClose = false;
        let rafId = null;
        let lastMainLeft = null, lastMainTop = null;
        let lastMyWidth  = null, lastMyHeight = null;
        let mainWasFound = false;
        let framesWithoutMain = 0;

        function syncWithMainPopup() {
            const mainPopup = document.getElementById(MAIN_POPUP_ID);
            if (!mainPopup) {
                framesWithoutMain++;
                // Первый попап был, но теперь исчез — закрываем себя
                if (mainWasFound && framesWithoutMain > 2) {
                    return 'lost';
                }
                return 'waiting';
            }
            mainWasFound = true;
            framesWithoutMain = 0;

            const mainRect = mainPopup.getBoundingClientRect();
            const myWidth  = popup.offsetWidth  || 345;
            const myHeight = popup.offsetHeight || 400;

            // Оптимизация: пропускаем обновление, если ни позиция первого,
            // ни размеры второго не изменились
            if (mainRect.left === lastMainLeft &&
                mainRect.top  === lastMainTop  &&
                myWidth       === lastMyWidth  &&
                myHeight      === lastMyHeight) {
                return 'ok';
            }
            lastMainLeft  = mainRect.left;
            lastMainTop   = mainRect.top;
            lastMyWidth   = myWidth;
            lastMyHeight  = myHeight;

            const gap = 10;
            const W = window.innerWidth;
            const H = window.innerHeight;

            // Пытаемся справа от первого
            let linkedLeft = mainRect.right + gap;
            if (linkedLeft + myWidth > W - 10) {
                linkedLeft = mainRect.left - myWidth - gap;
            }
            if (linkedLeft < 10) {
                linkedLeft = Math.max(10, W - myWidth - 10);
            }

            let linkedTop = mainRect.top;
            if (linkedTop + myHeight > H - 10) {
                linkedTop = Math.max(10, H - myHeight - 10);
            }
            if (linkedTop < 10) linkedTop = 10;

            popup.style.removeProperty('right');
            popup.style.left = linkedLeft + 'px';
            popup.style.top  = linkedTop  + 'px';
            return 'ok';
        }

        // Постоянный rAF-цикл — работает всё время пока попап открыт
        function trackLoop() {
            if (!document.contains(popup)) {
                rafId = null;
                return;
            }

            const status = syncWithMainPopup();
            if (status === 'lost') {
                closeBoth();
                return;
            }
            rafId = requestAnimationFrame(trackLoop);
        }

        function startTracking() {
            if (rafId) return;
            rafId = requestAnimationFrame(trackLoop);
        }

        function stopTracking() {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        // Функция закрытия ОБОИХ попапов синхронно
        function closeBoth() {
            console.log("[Content] Closing BOTH popups");
            stopTracking();
            cleanupObserver?.disconnect();
            document.removeEventListener('click', closeHandler, true);
            document.removeEventListener('sep-popup-drag-end', dragEndListener);
            window.removeEventListener('resize', resizeListener);

            const mainPopup = document.getElementById(MAIN_POPUP_ID);
            if (mainPopup && mainPopup.parentNode) {
              /*  mainPopup.remove(); */
            }
            if (popup.parentNode) {
               popup.remove(); 
            }
        }

        // Стартовый подгон позиции (пока opacity: 0)
        syncWithMainPopup();

        // Запускаем постоянный rAF-трекер немедленно
        startTracking();

        const dragEndListener = () => {
            suppressClose = true;
            setTimeout(() => { suppressClose = false; }, 100);
        };
        document.addEventListener('sep-popup-drag-end', dragEndListener);

        const resizeListener = () => { syncWithMainPopup(); };
        window.addEventListener('resize', resizeListener, { passive: true });

        const closeHandler = (e) => {
            if (suppressClose) {
                suppressClose = false;
                return;
            }
            const mp = document.getElementById(MAIN_POPUP_ID);
            const clickedInMain = mp && mp.contains(e.target);
            const clickedInThis = popup.contains(e.target);
            if (!clickedInMain && !clickedInThis) {
                console.log("[Content] Closing BOTH popups due to outside click");
                closeBoth();
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeHandler, { capture: true });
        }, 150);

        // Cleanup observer — если попап удалили извне
        const cleanupObserver = new MutationObserver(() => {
            if (!document.contains(popup)) {
                stopTracking();
                cleanupObserver.disconnect();
                document.removeEventListener('click', closeHandler, true);
                document.removeEventListener('sep-popup-drag-end', dragEndListener);
                window.removeEventListener('resize', resizeListener);
            }
        });
        cleanupObserver.observe(document.body, { childList: true, subtree: true });

        const optionsContainer = popup.querySelector('.emote-options');

        // ─── Заполнение попапа эмоутами (без изменений) ─────────────────────
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

        // Кнопка ✕ — закрывает ОБА попапа синхронно
        const closeButton = popup.querySelector('.close-ffz-popup-trhj8h5e4jk9');
        closeButton.onclick = () => {
            console.log("[Content] FFZ emote popup close button clicked — closing BOTH");
            closeBoth();
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
            if (document.getElementById(THIS_POPUP_ID) || document.getElementById('twitch-emote-popup')) {
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

    // Observer за карточкой зрителя
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

    // Кнопка "Вставить"
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
            const emoteSpans = popup.querySelectorAll('.emote-info span');
            console.log(`[Content] Найдено ${emoteSpans.length} элементов .emote-info span`);
            const emoteTexts = Array.from(emoteSpans)
                .map(span => {
                    const textNodes = Array.from(span.childNodes)
                        .filter(node => node.nodeType === Node.TEXT_NODE)
                        .map(node => node.textContent.trim())
                        .join('');
                    console.log(`[Content] Извлечённый текст из span: "${textNodes}"`);
                    return textNodes.replace(/\s*\([^)]+\)\s*/g, '').trim();
                })
                .filter(text => text.length > 0);

            const allEmotes = emoteTexts.length > 0 ? ` ${emoteTexts.join(' ')} ` : '';
            console.log(`[Content] Общий текст эмодзи: "${allEmotes}"`);

            if (allEmotes) {
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
        const inputEditors = document.querySelectorAll('[data-a-target="chat-input"]');
        let inputEditor = null;

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

        inputEditor.focus();
        console.log('[Content] Поле ввода в фокусе');

        try {
            if (inputEditor.tagName.toLowerCase() === 'textarea') {
                const currentValue = inputEditor.value || '';
                const selectionStart = inputEditor.selectionStart || currentValue.length;
                const selectionEnd = inputEditor.selectionEnd || currentValue.length;

                inputEditor.value = currentValue.slice(0, selectionStart) + text + currentValue.slice(selectionEnd);

                const newCursorPos = selectionStart + text.length;
                inputEditor.setSelectionRange(newCursorPos, newCursorPos);

                const inputEvent = new Event('input', { bubbles: true });
                inputEditor.dispatchEvent(inputEvent);

                const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
                inputEditor.dispatchEvent(keyupEvent);

                console.log(`[Content] Текст успешно вставлен в textarea: "${text}"`);
            } else if (inputEditor.hasAttribute('contenteditable') && inputEditor.getAttribute('contenteditable') === 'true') {
                const supportsInputEvent = 'InputEvent' in window;

                if (supportsInputEvent) {
                    const beforeInputEvent = new InputEvent('beforeinput', {
                        bubbles: true,
                        cancelable: true,
                        data: text,
                        inputType: 'insertText'
                    });

                    if (!inputEditor.dispatchEvent(beforeInputEvent)) {
                        console.warn('[Content] Событие beforeinput было отменено');
                        if (window.Notifications?.showPanelNotification) {
                            window.Notifications.showPanelNotification('Ошибка: ввод заблокирован редактором', 3000, false);
                        }
                        return;
                    }

                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNodeContents(inputEditor);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    const textNode = document.createTextNode(text);
                    range.insertNode(textNode);
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    const inputEvent = new InputEvent('input', {
                        bubbles: true,
                        cancelable: true,
                        data: text,
                        inputType: 'insertText'
                    });
                    inputEditor.dispatchEvent(inputEvent);

                    const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
                    inputEditor.dispatchEvent(keyupEvent);

                    console.log(`[Content] Текст успешно вставлен через InputEvent: "${text}"`);
                } else {
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

                    const inputEvent = new Event('input', { bubbles: true });
                    inputEditor.dispatchEvent(inputEvent);

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
    window.showEmoteSelectionPopup = showEmoteSelectionPopup;
})();