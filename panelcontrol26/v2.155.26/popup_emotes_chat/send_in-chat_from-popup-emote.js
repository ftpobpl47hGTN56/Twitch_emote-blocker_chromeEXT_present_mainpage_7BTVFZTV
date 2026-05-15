// popup_emotes_chat/send_in-chat_from-popup-emote.js

// ======= send_in-chat_from-popup-emote.js ======== //

// Добавляет кнопку "Отправить в чат" в попап выбора эмодзи (custom-ffz-popup-emotes-trhj8h5e4jk9)
// Последнее обновление: декабрь 2025

(function () {
    'use strict';

    const DEBUG = false;
    const log = (...args) => DEBUG && console.log('[SendToChat]', ...args);
    const warn = (...args) => console.warn('[SendToChat]', ...args);

    // ────────────────────────────────────────────────
    // 1. Функция получения текста всех эмодзи из попапа
    // ────────────────────────────────────────────────
    function getAllEmoteTextsFromPopup(popup) {
        const spans = popup.querySelectorAll('.emote-info span');
        if (!spans.length) return '';

        const texts = Array.from(spans)
            .map(span => {
                // Берём только текстовые узлы первого уровня (без вложенного <span>(platform)</span>)
                const text = Array.from(span.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE)
                    .map(node => node.textContent.trim())
                    .join('')
                    .replace(/\s*\([^)]+\)\s*/g, '')     // убираем (ffz), (7tv) и т.п.
                    .trim();

                return text;
            })
            .filter(Boolean);

        if (!texts.length) return '';

        // Добавляем пробелы по краям — как в оригинальной кнопке paste
        return ` ${texts.join(' ')} `;
    }

    // ────────────────────────────────────────────────
    // 2. Функция отправки сообщения в чат Twitch
    // ────────────────────────────────────────────────
    function sendMessageToTwitchChat(message) {
        if (!message.trim()) {
            warn('Попытка отправить пустое сообщение');
            return false;
        }

        // 1. Находим поле ввода
        const chatInput = document.querySelector('[data-a-target="chat-input"]');
        if (!chatInput) {
            warn('Поле ввода чата не найдено');
            return false;
        }

        // 2. Фокусируем
        chatInput.focus();

        // 3. Вставляем текст
        try {
            if (chatInput.tagName.toLowerCase() === 'textarea') {
                chatInput.value = message;
                chatInput.setSelectionRange(message.length, message.length);
            } else if (chatInput.isContentEditable || chatInput.contentEditable === 'true') {
                chatInput.textContent = message;
                const range = document.createRange();
                range.selectNodeContents(chatInput);
                range.collapse(false);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else {
                warn('Неизвестный тип поля ввода чата');
                return false;
            }

            // 4. Имитируем нажатие Enter
            const enterEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13
            });

            const success = chatInput.dispatchEvent(enterEvent);

            if (success) {
                log('Сообщение отправлено в чат:', message);
                return true;
            } else {
                warn('Событие keydown Enter было предотвращено');
                return false;
            }
        } catch (err) {
            warn('Ошибка при отправке сообщения в чат:', err);
            return false;
        }
    }

    // ────────────────────────────────────────────────
    // 3. Создание и вставка кнопки "Отправить в чат"
    // ────────────────────────────────────────────────
    function addSendToChatButton(popupId = 'custom-ffz-popup-emotes-trhj8h5e4jk9') {
        // Ждём появления попапа
        const popup = document.getElementById(popupId);
        if (!popup) {
            // Если попапа ещё нет — пробуем через 300–400 мс
            setTimeout(() => addSendToChatButton(popupId), 400);
            return;
        }

        // Уже есть кнопка? Не создаём дубликат
        if (popup.querySelector('.send-to-chat-button')) {
            log('Кнопка "Отправить в чат" уже существует');
            return;
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'send-to-chat-button';
        btn.style.cssText = `
            background: rgba(0, 204, 153, 0.18);
            color: rgba(0, 255, 204, 0.9);
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            position: absolute;
            top: 6px;
            left: 100px;               /* правее кнопки paste */
            display: flex;
            align-items: center;
            gap: 6px;
        `;

        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            chat
        `;

        btn.addEventListener('click', () => {
            const text = getAllEmoteTextsFromPopup(popup);
            if (!text) {
                warn('Нет эмодзи для отправки');
                return;
            }

            const sent = sendMessageToTwitchChat(text);
            if (sent && window.Notifications?.showPanelNotification) {
                window.Notifications.showPanelNotification(`Отправлено в чат: ${text.trim()}`, 4000, false);
            }
        });

        popup.appendChild(btn);
        log('Кнопка "Отправить в чат" добавлена в попап');
    }

    // ────────────────────────────────────────────────
    // Запуск
    // ────────────────────────────────────────────────
    function init() {
        // Пытаемся сразу
        addSendToChatButton();

        // На случай если попап появится позже (динамически)
        const observer = new MutationObserver(() => {
            if (document.getElementById('custom-ffz-popup-emotes-trhj8h5e4jk9')) {
                addSendToChatButton();
                // Можно отключить после первого успешного добавления
                // observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
