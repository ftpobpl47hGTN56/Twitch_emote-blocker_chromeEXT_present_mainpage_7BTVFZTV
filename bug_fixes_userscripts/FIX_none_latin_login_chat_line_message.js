


// FIX_none_latin_login_chat_line_message.js 

// remove non-latin символы оставляет только login //


 
// FIX_none_latin_login_chat_line_message.js — 

// исправленная 10 ноября 2025 года.
// исправленная 10 ноября 2025 года.

// исправленная версия: удаление нелатинских символов, оставляет только логин 

(function() {
    'use strict';

    // Функция для debounce
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

    // Проверка на нелатинские символы (non-ASCII)
    function hasNonLatin(text) {
        return /[^\x00-\x7F]/.test(text);
    }

    // Извлечение логина из data-original-username как fallback
    function extractLoginFromData(dataAttr) {
        const match = dataAttr.match(/\(([^)]+)\)$/);
        return match ? match[1].trim() : null;
    }

    // Функция обработки никнейма: удаляем нелатинские, оставляем логин
    function processNickname(element) {
        if (element.classList.contains('processed')) return;

        const displayName = element.querySelector('.chat-author__display-name');
        if (!displayName) return;

        const fullName = displayName.textContent.trim();
        if (!hasNonLatin(fullName)) return; // Только если есть нелатинские символы

        let cleanLogin = null;
        const intlLogin = element.querySelector('.chat-author__intl-login');
        if (intlLogin) {
            const loginText = intlLogin.textContent.trim();
            if (loginText.startsWith('(') && loginText.endsWith(')')) {
                cleanLogin = loginText.slice(1, -1).trim();
            }
        } else {
            // Fallback: из data-original-username
            const customContainer = displayName.querySelector('.custom-nickname-container');
            if (customContainer) {
                const dataUsername = customContainer.getAttribute('data-original-username');
                if (dataUsername) {
                    cleanLogin = extractLoginFromData(dataUsername);
                }
            }
        }

        if (!cleanLogin) return; // Нет логина для замены

        // Заменяем только текст в .original-nickname, сохраняя структуру
        const originalNickname = displayName.querySelector('.original-nickname');
        if (originalNickname) {
            originalNickname.textContent = cleanLogin;
        }

        // Скрываем intl-login, если он есть
        if (intlLogin) {
            intlLogin.style.display = 'none';
        }

        element.classList.add('processed');
    }

    // Основная функция сканирования чата
    function scanChat() {
        const chatLines = document.querySelectorAll('.chat-line__message');
        chatLines.forEach(line => {
            const usernameContainer = line.querySelector('.chat-line__username');
            if (usernameContainer) {
                processNickname(usernameContainer);
            }
        });
    }

    // MutationObserver для новых сообщений
    // MutationObserver для новых сообщений
function setupObserver() {
    // Более устойчивый селектор для контейнера чата
    let chatContainer = document.querySelector('#chat-room .simplebar-wrapper') || 
                       document.querySelector('#chat-room') || 
                       document.querySelector('.chat-scrollable-area__message-container') || 
                       document.querySelector('.chat-room') ||  // Дополнительный fallback
                       document.body;
    if (!chatContainer) return;

    const observer = new MutationObserver(debounce(() => {
        scanChat();
    }, 100));

    observer.observe(chatContainer, {
        childList: true,
        subtree: true
    });

    // Немедленное сканирование после установки
    setTimeout(scanChat, 50);  // Небольшая задержка для асинхронной загрузки
}

    // Перезапуск при смене URL/канала
    function restartOnUrlChange() {
        let currentUrl = location.href;
        const checkUrl = debounce(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                // Очищаем старые метки processed
                document.querySelectorAll('.processed').forEach(el => el.classList.remove('processed'));
                setupObserver();
            }
        }, 55);

        window.addEventListener('popstate', checkUrl);
        window.addEventListener('hashchange', checkUrl);
        // Для SPA (Twitch) — проверка каждые 500 мс
        setInterval(checkUrl, 200);
    }

   // Инициализация
setupChatTriggerObserver();  // Сначала триггер для подключений
setupObserver();  // Затем observer чата

// Перезапуск при фокусе на новой вкладке (сохраняем для возврата)
window.addEventListener('focus', () => {
    setTimeout(() => {
        document.querySelectorAll('.processed').forEach(el => el.classList.remove('processed'));
        setupObserver();
        scanChat();  // Добавляем scan для существующих
    }, 255);
});

    // Observer для триггера "Connecting to Chat" — перезапуск при подключении
function setupChatTriggerObserver() {
    const triggerObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {  // Только элементы
                    const strongElement = node.querySelector ? node.querySelector('strong.CoreText-sc-1txzju1-0.bIUThl') : 
                                         (node.tagName === 'STRONG' && node.classList.contains('CoreText-sc-1txzju1-0') && node.classList.contains('bIUThl') ? node : null);
                    if (strongElement && strongElement.textContent.trim() === 'Connecting to Chat') {
                        // Очищаем старые метки и перезапускаем
                        document.querySelectorAll('.processed').forEach(el => el.classList.remove('processed'));
                        setupObserver();
                        scanChat();  // Сканируем сразу после триггера
                    }
                }
            });
        });
    });

    triggerObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

    // Перезапуск при фокусе на новой вкладке
    window.addEventListener('focus', () => {
        setTimeout(() => {
            document.querySelectorAll('.processed').forEach(el => el.classList.remove('processed'));
            setupObserver();
        }, 55);
    });

})();



