
// popup_emotes_chat/Emote_Popup_Utils.js


// ============ 7TV-BttTV FFZ Emote_Popup_Utils.js ============ //
  
(function () {
    // ============-23-10-2025- оптимизированная версия ======================== //
    // ====== В ЭТОЙ ВЕРСИИ ДОБАВЛЕНА ПОДДЕРЖКА ВСТАВКИ ТЕКСТ В ИНПУТ ============== //

    // Флаг для отладочных логов (отключите в продакшене)
    const isDebug = false;
    const log = isDebug ? console.log.bind(console) : () => {};
    const warn = isDebug ? console.warn.bind(console) : () => {};

    // Инициализация Web Worker
    const worker = new Worker('worker.js');

    // Глобальный ID интервала для cleanup
    let globalIntervalId;

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
            warn(`[Content] ${platform} viewer card not found, using fallback position`);
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
        log(`[Content] ${platform} popup positioned at left: ${left}, top: ${top}`);
    }

   

// Унифицированная функция для привязки попапа к карточке с поддержкой drag-and-drop 
function attachPopupToViewerCard(popup, viewerCard, platform) {
    if (!viewerCard || !document.contains(viewerCard)) {
        warn(`[Content] ${platform} viewer card not found for drag-and-drop`);
        positionPopup(popup, null, platform);
        return;
    }

    // Позиционируем попап сразу
    positionPopup(popup, viewerCard, platform);

    // Переменные для drag-and-drop с requestAnimationFrame
    let isDragging = false;
    let animationFrameId = null;
    let moveHandler = null; // Сохраним ссылку на обработчик mousemove

    const startDragging = (e) => {
        if (e.target.closest('.viewer-card-drag-cancel')) return;
        isDragging = true;
        log(`[Content] Started dragging ${platform} viewer card`);
    };

    const updatePosition = () => {
        if (isDragging && document.contains(viewerCard)) {
            positionPopup(popup, viewerCard, platform);
            animationFrameId = requestAnimationFrame(updatePosition);
        }
    };

    const stopDragging = () => {
        if (isDragging) {
            isDragging = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            if (document.contains(viewerCard)) {
                positionPopup(popup, viewerCard, platform);
            }
            log(`[Content] Stopped dragging ${platform} viewer card`);
        }
    };

    // Обработчик mousemove — сохраняем ссылку, чтобы потом снять
    moveHandler = () => {
        if (isDragging && !animationFrameId) {
            animationFrameId = requestAnimationFrame(updatePosition);
        }
    };

    viewerCard.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', stopDragging);

    // Наблюдатель за изменениями атрибутов карточки (style, class)
    const attrObserver = new MutationObserver(() => {
        if (!isDragging && document.contains(viewerCard)) {
            positionPopup(popup, viewerCard, platform);
        }
    });
    attrObserver.observe(viewerCard, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        subtree: false
    });

    // Наблюдатель за удалением карточки из DOM
    const parent = viewerCard.parentNode;
    let removalObserverCard = null;
    if (parent) {
        removalObserverCard = new MutationObserver(() => {
            if (!document.contains(viewerCard)) {
                warn(`[Content] ${platform} viewer card removed from DOM, closing popup`);
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                } else {
                    popup.remove();
                }
                cleanup();
            }
        });
        removalObserverCard.observe(parent, { childList: true });
    }

    // Обработчик изменения размера окна
    const resizeHandler = () => {
        if (document.contains(viewerCard)) {
            positionPopup(popup, viewerCard, platform);
        }
    };
    window.addEventListener('resize', resizeHandler, { passive: true });

    // Наблюдатель за удалением попапа
    const removalObserver = new MutationObserver(() => {
        if (!document.contains(popup)) {
            cleanup();
        }
    });
    if (popup.parentNode) {
        removalObserver.observe(popup.parentNode, { childList: true });
    } else {
        removalObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Функция полной очистки всех слушателей и observers
    const cleanup = () => {
        attrObserver.disconnect();
        if (removalObserverCard) removalObserverCard.disconnect();
        removalObserver.disconnect();
        window.removeEventListener('resize', resizeHandler);
        viewerCard.removeEventListener('mousedown', startDragging);
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', stopDragging);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        log(`[Content] Cleanup for ${platform} popup completed`);
    };

    // Возвращаем cleanup, если нужно использовать снаружи (не обязательно, но на всякий случай)
    return cleanup;
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
        log('[Content] Worker response:', e.data);
        if (e.data.status === 'viewerCardRestored') {
            log('[Content] Viewer card visibility restored by worker:', e.data.message);
        }
        else if (e.data.status === 'viewerCardNotFound') {
            warn('[Content] Viewer card not found in DOM:', e.data.message);
        }
    };

    // Функция debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Дебонсированная проверка видимости карточки Twitch
    const checkTwitchCardVisibility = debounce(() => {
        const twitchCard = document.querySelector('[data-a-target="viewer-card-positioner"]') ||
            document.querySelector('.viewer-card');
        if (twitchCard) {
            const computedStyle = window.getComputedStyle(twitchCard);
            if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
                warn("[Content] Twitch viewer card hidden detected in global check, restoring visibility");
                twitchCard.style.display = '';
                twitchCard.style.visibility = 'visible';
                twitchCard.style.opacity = '1';
                preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
            }
        } else {
            warn("[Content] Twitch viewer card not found in global check");
        }
    }, 500);

    // Глобальная проверка видимости карточки (увеличен интервал до 500 мс)
    globalIntervalId = setInterval(checkTwitchCardVisibility, 500);

    // Глобальный cleanup при выгрузке страницы
    window.addEventListener('beforeunload', () => {
        if (globalIntervalId) {
            clearInterval(globalIntervalId);
        }
        worker.terminate();
    }, { once: true });

    // Экспорт общих функций в глобальную область для доступа из других модулей
    window.waitForElement = waitForElement;
    window.positionPopup = positionPopup;
    window.attachPopupToViewerCard = attachPopupToViewerCard;
    window.preventHidingElements = preventHidingElements;
    window.debounce = debounce;
    window.checkTwitchCardVisibility = checkTwitchCardVisibility;
})();