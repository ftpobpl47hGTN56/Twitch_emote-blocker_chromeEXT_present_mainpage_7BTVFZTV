


// ===== Версия 2.6.56 от 31.08.2025 clear_twitch_chat_recycler.js
// ===== Версия 2.6.56 от 01.09.2025 clear_twitch_chat_recycler.js
// ===== Версия 2.6.56 от 05.09.2025 clear_twitch_chat_recycler.js
// ===== Last update chat_recycler -11-12-2025 =========================



// function countMessageContainers() {

// кальккулятор сообщений // 
 
// Находим все элементы с классом 'Layout-sc-1xcs6mc-0'
  /* const containers = document.querySelectorAll('div.Layout-sc-1xcs6mc-0');
  let messageCount = 0;

  // Проверяем каждый контейнер на наличие вложенного элемента с классом 'chat-line__message'
  containers.forEach(container => {
    if (container.querySelector('div.chat-line__message')) {
      messageCount++;
    }
  });

  console.log('Количество контейнеров с сообщениями:', messageCount);
  return messageCount;
}

// Вызов функции
countMessageContainers(); */
 
// ===== Версия 2.6.56 от 05.09.2025 clear_twitch_chat_recycler.js

(function () {
    'use strict';
    
    console.log('[_Chat_Recycler_] Скрипт chat_recycler.js загружен ');

    // --- Хранилище лимита сообщений ---
    function getStoredLimit() {
        if (window.getStorage) {
            const storedLimit = window.getStorage('chatMessageLimit');
            if (storedLimit !== undefined && !isNaN(parseInt(storedLimit))) {
                return parseInt(storedLimit);
            }
            window.setStorage('chatMessageLimit', 65);
        }
        return 65;
    }
    function setStoredLimit(newLimit) {
        if (window.setStorage) {
            window.setStorage('chatMessageLimit', newLimit);
        }
    }

    let MAX_MESSAGES = getStoredLimit();
    console.log('[_Chat_Recycler_] Инициализирован MAX_MESSAGES:', MAX_MESSAGES);

    // --- Универсальный подсчёт сообщений ---
    function getMessageCount() {
        const containers = document.querySelectorAll('div.Layout-sc-1xcs6mc-0');
        const messages = new Set();
        containers.forEach(container => {
            if (container.querySelector('div.chat-line__message')) {
                messages.add(container);
            }
        });
        const messageCount = messages.size;
        console.log('[_Chat_Recycler_] Подсчёт контейнеров с сообщениями:', messageCount);
        return messageCount;
    }

    // --- Универсальное удаление сообщений ---
    function deleteMessages(count) {
        console.log('[_Chat_Recycler_] Запуск удаления сообщений, count:', count);
        const selectors = [
            '.chat-line__message', // Обычные сообщения
            '.ffz--points-line',   // Сообщения с хайлайтом
            '.user-notice-line.user-notice-line--highlighted' // Рейд-хайлайты
        ];
        let removed = 0;
        selectors.forEach(selector => {
            const messages = document.querySelectorAll(selector);
            console.log('[_Chat_Recycler_] Найдено элементов для селектора', selector, ':', messages.length);
            for (let i = 0; i < messages.length && removed < count; i++) {
                const message = messages[i];
                if (message && message.parentNode) {
                    console.log('[_Chat_Recycler_] Удаление элемента:', message);
                    message.parentNode.removeChild(message);
                    removed++;
                }
            }
        });
        console.log('[_Chat_Recycler_] Удалено сообщений:', removed);
        return removed;
    }

    // --- Очистка застрявших хайлайтов ---
    function clearStuckHighlights() {
        const highlightSelectors = [
            '.chat-line__message-highlight',
            '.user-notice-line.user-notice-line--highlighted',
            '[class*="user-notice-line"][class*="highlighted"]' // Для динамических классов
        ];
        console.log('[_Chat_Recycler_] Очистка застрявших хайлайтов');
        highlightSelectors.forEach(selector => {
            const highlights = document.querySelectorAll(selector);
            console.log('[_Chat_Recycler_] Найдено хайлайтов для селектора', selector, ':', highlights.length);
            highlights.forEach(highlight => {
                const parent = highlight.closest('.ffz--points-line, .user-notice-line, [class*="user-notice-line"]');
                if (parent && parent.parentNode) {
                    console.log('[_Chat_Recycler_] Удаление застрявшего хайлайта:', parent);
                    parent.parentNode.removeChild(parent);
                }
            });
        });
    }

    // --- Автоматическое удаление при превышении лимита ---
    async function autoDeleteMessages() {
        let currentLimit = getStoredLimit ? getStoredLimit() : MAX_MESSAGES;
        if (typeof MAX_MESSAGES !== 'undefined' && MAX_MESSAGES !== currentLimit) {
            MAX_MESSAGES = currentLimit;
            console.log('[_Chat_Recycler_] Обновлён MAX_MESSAGES:', MAX_MESSAGES);
        }
        const messageCount = getMessageCount();
        console.log('[_Chat_Recycler_] Текущий счёт сообщений:', messageCount, 'Лимит:', MAX_MESSAGES);
        if (messageCount > MAX_MESSAGES) {
            const toRemove = messageCount - MAX_MESSAGES;
            console.log('[_Chat_Recycler_] Превышение лимита, удаляем:', toRemove);
            deleteMessages(toRemove);
            clearStuckHighlights(); // Очистка застрявших хайлайтов
            updateTooltip();
        }
    }

    // --- Универсальный тултип ---
    function updateTooltip() {
        const tooltip = document.querySelector('#chat-counter-tooltip');
        if (!tooltip) {
            console.log('[_Chat_Recycler_] Тултип не найден');
            return;
        }
        let currentLimit = getStoredLimit ? getStoredLimit() : MAX_MESSAGES;
        if (typeof MAX_MESSAGES !== 'undefined' && MAX_MESSAGES !== currentLimit) {
            MAX_MESSAGES = currentLimit;
            console.log('[_Chat_Recycler_] Обновлён MAX_MESSAGES в тултипе:', MAX_MESSAGES);
        }
        const messageCount = getMessageCount();
        tooltip.textContent = `${messageCount}/${MAX_MESSAGES}`;
        console.log('[_Chat_Recycler_] Обновлён тултип:', tooltip.textContent);
    }

    // --- Кнопка очистки чата ---
    function addClearChatButton() {
        const inputButtonsContainer = document.querySelector('[data-test-selector="chat-input-buttons-container"]');
        if (!inputButtonsContainer) {
            console.log('[_Chat_Recycler_] Контейнер для кнопок не найден');
            return;
        }
        if (document.querySelector('#clear-chat-button')) {
            console.log('[_Chat_Recycler_] Кнопка очистки уже существует');
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'Layout-sc-1xcs6mc-0 ScTooltipWrapper-sc-31h4d9-0 tw-tooltip-wrapper';
        wrapper.style.display = 'inline-block';
        wrapper.style.position = 'relative';

        const clearChatButton = document.createElement('button');
        clearChatButton.id = 'clear-chat-button';
        clearChatButton.setAttribute('aria-label', 'Clear Chat');
        clearChatButton.className = 'ScCoreButton-sc-ocjdkq-0 kJMgAB';
        clearChatButton.style.marginRight = '4px';
        clearChatButton.innerHTML = `<div class="ScCoreButtonLabel-sc-s7h2b7-0 kaIUar">
            <div data-a-target="tw-core-button-label-text" class="Layout-sc-1xcs6mc-0 bLZXTb">Clear Chat</div>
        </div>`;
        clearChatButton.addEventListener('click', async () => {
            console.log('[_Chat_Recycler_] Нажата кнопка очистки чата');
            deleteMessages(100);
            clearStuckHighlights(); // Очистка застрявших хайлайтов
            updateTooltip();
        });

        const tooltip = document.createElement('div');
        tooltip.id = 'chat-counter-tooltip';
        tooltip.className = 'tw-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.bottom = '125%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.padding = '4px 8px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '14px';
        tooltip.style.fontWeight = '600';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.backgroundColor = 'var(--color-background-tooltip)';
        tooltip.style.color = 'var(--color-text-tooltip)';
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.2s';
        tooltip.style.zIndex = '999';

        wrapper.addEventListener('mouseenter', () => {
            updateTooltip();
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });
        wrapper.addEventListener('mouseleave', () => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });

        wrapper.appendChild(clearChatButton);
        wrapper.appendChild(tooltip);
        inputButtonsContainer.insertBefore(wrapper, inputButtonsContainer.firstChild);
        updateTooltip();
        console.log('[_Chat_Recycler_] Кнопка очистки чата добавлена');
    }

    // --- Секция лимита сообщений в настройках ---
    function addMessageLimitSection() {
        const settingsContent = document.querySelector('.chat-settings__content');
        if (!settingsContent) {
            console.log('[_Chat_Recycler_] Контейнер настроек не найден');
            return;
        }
        let currentLimit = getStoredLimit ? getStoredLimit() : MAX_MESSAGES;
        if (typeof MAX_MESSAGES !== 'undefined' && MAX_MESSAGES !== currentLimit) {
            MAX_MESSAGES = currentLimit;
            console.log('[_Chat_Recycler_] Обновлён MAX_MESSAGES в настройках:', MAX_MESSAGES);
        }

        if (document.querySelector('#message-limit-j6rtk6rur5-section')) {
            const existingButton = document.querySelector('#message-limit-j6rtk6rur5-section .hGDXYq');
            const existingInput = document.querySelector('#message-h5j6rj6rmij6rjr5r-limit-input');
            if (existingButton) existingButton.textContent = MAX_MESSAGES;
            if (existingInput) existingInput.value = MAX_MESSAGES;
            console.log('[_Chat_Recycler_] Секция лимита сообщений уже существует, обновлена');
            return;
        }

        const section = document.createElement('div');
        section.id = 'message-limit-j6rtk6rur5-section';
        section.className = 'Layout-sc-1xcs6mc-0 igZqfU';

        const messageLimitButton = document.createElement('button');
        messageLimitButton.className = 'ScInteractableBase-sc-ofisyf-0 ScInteractableDefault-sc-ofisyf-1 CayVJ imYKMv tw-interactable';
        messageLimitButton.setAttribute('data-a-target', 'message-limit-selector');
        messageLimitButton.innerHTML = `<div class="Layout-sc-1xcs6mc-0 dCYttJ">
            <div class="Layout-sc-1xcs6mc-0 dtSdDz"> Message Limit </div>
            <div class="Layout-sc-1xcs6mc-0 hGDXYq">${MAX_MESSAGES}</div>
            <div class="Layout-sc-1xcs6mc-0 fuLBqz">
                <div class="ScSvgWrapper-sc-wkgzod-0 dKXial tw-svg">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M6.5 5.5 11 10l-4.5 4.5L8 16l6-6-6-6-1.5 1.5z"></path>
                    </svg>
                </div>
            </div>
        </div>`;

        const inputContainer = document.createElement('div');
        inputContainer.id = 'message-h5j6rj6rmij6rjr5r-limit-input-container';
        inputContainer.className = 'Layout-sc-1xcs6mc-0';
        inputContainer.style.display = 'none';
        inputContainer.style.padding = '8px';
        inputContainer.innerHTML = `<label for="message-h5j6rj6rmij6rjr5r-limit-input" class="CoreText-sc-1txzju1-0 yIWOC">Установить лимит сообщений</label>
        <input id="message-h5j6rj6rmij6rjr5r-limit-input" type="number" min="1" value="${MAX_MESSAGES}" style="width: 100%; padding: 4px; margin-top: 4px;" />`;

        messageLimitButton.addEventListener('click', () => {
            inputContainer.style.display = inputContainer.style.display === 'none' ? 'block' : 'none';
            const input = inputContainer.querySelector('#message-h5j6rj6rmij6rjr5r-limit-input');
            if (input) input.value = getStoredLimit ? getStoredLimit() : MAX_MESSAGES;
            console.log('[_Chat_Recycler_] Открыт/закрыт контейнер ввода лимита');
        });

        inputContainer.addEventListener('input', (e) => {
            if (e.target.id === 'message-h5j6rj6rmij6rjr5r-limit-input') {
                const newLimit = parseInt(e.target.value);
                if (newLimit > 0) {
                    if (typeof setStoredLimit === 'function') setStoredLimit(newLimit);
                    MAX_MESSAGES = newLimit;
                    messageLimitButton.querySelector('.hGDXYq').textContent = newLimit;
                    updateTooltip();
                    console.log('[_Chat_Recycler_] Новый лимит сообщений установлен:', newLimit);
                }
            }
        });

        section.appendChild(messageLimitButton);
        section.appendChild(inputContainer);

        // Основной поиск: секция Chat Filters
        let chatFiltersSection = settingsContent.querySelector('[data-test-selector="chat-filter-item-click-target"]')?.parentNode;

        if (chatFiltersSection && chatFiltersSection.parentNode) {
            chatFiltersSection.parentNode.insertBefore(section, chatFiltersSection.nextSibling);
            console.log('[_Chat_Recycler_] Секция лимита сообщений вставлена после Chat Filters');
        } else {
            // Запасной вариант: поиск Show Mod Icons (это div с классом crjNOu, содержащий label "Show Mod Icons")
            const showModIconsSection = Array.from(settingsContent.querySelectorAll('.Layout-sc-1xcs6mc-0.crjNOu'))
                .find(div => div.querySelector('label')?.textContent.trim() === 'Show Mod Icons');

            if (showModIconsSection && showModIconsSection.parentNode) {
                showModIconsSection.parentNode.insertBefore(section, showModIconsSection.nextSibling);
                console.log('[_Chat_Recycler_] Секция Chat Filters не найдена, вставлена после Show Mod Icons');
            } else {
                // Fallback: добавляем в конец
                settingsContent.appendChild(section);
                console.log('[_Chat_Recycler_] Ни Chat Filters, ни Show Mod Icons не найдены, добавлено в конец');
            }
        }
        console.log('[_Chat_Recycler_] Секция лимита сообщений добавлена');
    }

    // --- DOM наблюдатель ---
    function observeDOM() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const callback = function (mutationsList, observer) {
            const chatContainer = document.querySelector('[data-test-selector="chat-scrollable-area__message-container"]') ||
                document.querySelector('.chat-scrollable-area__message-container') ||
                document.querySelector('[role="log"]');
            const inputButtonsContainer = document.querySelector('[data-test-selector="chat-input-buttons-container"]');
            const settingsContent = document.querySelector('.chat-settings__content');

            if (chatContainer && mutationsList.some(mutation => 
                mutation.target.closest('.chat-scrollable-area__message-container') ||
                mutation.target.closest('[role="log"]') ||
                mutation.target.closest('.ffz--points-line') ||
                mutation.target.closest('.user-notice-line') ||
                mutation.target.classList.contains('user-notice-line--highlighted'))) {
                updateTooltip();
                clearStuckHighlights(); // Очистка хайлайтов при изменениях
                console.log('[_Chat_Recycler_] Обнаружены изменения в чате, обновлён тултип');
            }
            if (inputButtonsContainer && !document.querySelector('#clear-chat-button')) {
                addClearChatButton();
            }
            if (settingsContent && !document.querySelector('#message-limit-j6rtk6rur5-section')) {
                addMessageLimitSection();
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        console.log('[_Chat_Recycler_] Наблюдатель DOM запущен');
    }

    // --- Смена канала ---
    function observeURLChanges() {
        let lastChannel = null;
        const reinitialize = () => {
            addClearChatButton();
            addMessageLimitSection();
            updateTooltip();
            clearStuckHighlights(); // Очистка хайлайтов при смене канала
            console.log('[_Chat_Recycler_] Реинициализация после смены канала');
        };
        const checkChatChange = () => {
            const welcomeMessage = document.querySelector('[data-a-target="chat-welcome-message"]');
            const linkElement = document.querySelector('a.tw-link[href*="#WYSIWGChatInputEditor_SkipChat"]');
            let currentChannel = lastChannel;
            if (linkElement) {
                currentChannel = linkElement.getAttribute('href').split('#')[0];
            }
            if (welcomeMessage && (currentChannel !== lastChannel)) {
                lastChannel = currentChannel;
                setTimeout(reinitialize, 1000);
                console.log('[_Chat_Recycler_] Обнаружена смена канала:', currentChannel);
            }
        };
        const observer = new MutationObserver((mutations) => {
            const welcomeMessage = document.querySelector('[data-a-target="chat-welcome-message"]');
            if (mutations.some(mutation => 
                mutation.target.closest('[data-a-target="chat-welcome-message"]') ||
                mutation.target.closest('.chat-scrollable-area__message-container') ||
                mutation.target.closest('[role="log"]') ||
                mutation.target.closest('a.tw-link') ||
                mutation.target.closest('.user-notice-line'))) {
                checkChatChange();
            }
        });
        urlObserver = observer;
        observer.observe(document, { subtree: true, childList: true });
        setInterval(checkChatChange, 500);
        console.log('[_Chat_Recycler_] Наблюдатель смены канала запущен');
    }

    // --- Инициализация ---
    let autoDeleteInterval = null;
    let urlObserver = null;
    async function init() {
        window.deleteMessages = deleteMessages;
        if (autoDeleteInterval) clearInterval(autoDeleteInterval);
        if (urlObserver) urlObserver.disconnect();

        setTimeout(() => {
            addClearChatButton();
            addMessageLimitSection();
            updateTooltip();
            clearStuckHighlights(); // Очистка застрявших хайлайтов при инициализации
        }, 300);

        autoDeleteInterval = setInterval(async () => {
            await autoDeleteMessages();
        }, 500);

        observeDOM();
        observeURLChanges();
        console.log('[_Chat_Recycler_] Инициализация завершена');
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1000);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 1000);
        });
    }
})();

 