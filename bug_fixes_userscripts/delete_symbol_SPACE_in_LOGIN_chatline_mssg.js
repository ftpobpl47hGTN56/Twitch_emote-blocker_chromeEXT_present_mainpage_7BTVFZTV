// delete_symbol_SPACE_in_LOGIN_chatline_mssg.js 
// — обновлённая версия: очистка никнеймов от повторяющихся _, -, 
// | и пробелов везде (не только в конце)

// 
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

    // Обновлённая функция обработки никнейма: удаляем повторяющиеся _, -, | и пробелы ВЕЗДЕ, оставляем max один каждого
    function processNickname(element) {
        if (element.classList.contains('processed')) return;

        let nickname = null;
        const originalSpan = element.querySelector('.original-nickname');
        if (originalSpan) {
            nickname = originalSpan.textContent.trim();
        } else {
            // Fallback: из data-original-username
            const dataUsername = element.getAttribute('data-original-username');
            if (dataUsername) {
                nickname = dataUsername;
            }
        }
        if (!nickname) return;

        // ИЗМЕНЕНИЕ: Глобальная замена повторяющихся символов ВЕЗДЕ (не только в конце)
        // Заменяем 2+ '_' на один '_'
        nickname = nickname.replace(/_+/g, '_');
        // Заменяем 2+ '-' на один '-'
        nickname = nickname.replace(/-+/g, '-');
        // Заменяем 2+ '|' на один '|'
        nickname = nickname.replace(/\|+/g, '|');
        
        // Если нужно обрабатывать ПРОБЕЛЫ (spaces): раскомментируйте строку ниже
        // nickname = nickname.replace(/\s+/g, ' ');  // Заменяет множественные пробелы на один

        // Если после замены пусто (только разделители), очищаем полностью
        if (!nickname.trim()) nickname = '';

        // Обновляем оригинальный span или атрибут
        if (originalSpan) {
            originalSpan.textContent = nickname;
        } else {
            // Если fallback, обновляем атрибут и создаем span, если нужно
            element.setAttribute('data-original-username', nickname);
            if (!originalSpan) {
                const span = document.createElement('span');
                span.className = 'original-nickname';
                span.textContent = nickname;
                element.appendChild(span);
            }
        }

        element.classList.add('processed');
    }

    // Основная функция сканирования чата (без изменений)
    function scanChat() {
        const chatLines = document.querySelectorAll('.chat-line__message');
        chatLines.forEach(line => {
            const usernameContainer = line.querySelector('.chat-line__username .custom-nickname-container') || 
                                     line.querySelector('.chat-line__username');
            if (usernameContainer) {
                processNickname(usernameContainer);
            }
        });
    }

    let currentObserver = null; // Для отключения старого observer

    // MutationObserver для новых сообщений (без изменений)
    function setupObserver() {
        // Отключаем старый observer
        if (currentObserver) {
            currentObserver.disconnect();
        }

        // Более устойчивые селекторы для контейнера чата
        let chatContainer = document.querySelector('#chat-room .simplebar-wrapper') || 
                           document.querySelector('.chat-scrollable-area__message-container') || 
                           document.querySelector('#chat-room') || 
                           document.body;
        if (!chatContainer) return;

        currentObserver = new MutationObserver(debounce(() => {
            scanChat();
        }, 100));

        currentObserver.observe(chatContainer, {
            childList: true,
            subtree: true
        });

        // Немедленное сканирование
        scanChat();
    }

    // Перезапуск при смене URL/канала (без изменений)
    function restartOnUrlChange() {
        let currentUrl = location.href;
        const checkUrl = debounce(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                // Очищаем старые метки processed
                document.querySelectorAll('.processed').forEach(el => el.classList.remove('processed'));
                setupObserver();
            }
        }, 50);

        window.addEventListener('popstate', checkUrl);
        window.addEventListener('hashchange', checkUrl);
        // Для SPA (Twitch) — проверка каждые 500 мс
        setInterval(checkUrl, 2000);
    }

    // Инициализация (без изменений)
    setupObserver();
    restartOnUrlChange();

    // Перезапуск при фокусе на новой вкладке или visibility change (без изменений)
    window.addEventListener('focus', () => {
        setTimeout(() => {
            document.querySelectorAll('.processed').forEach(el => el.classList.remove('processed'));
            setupObserver();
        }, 55);
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(() => {
                document.querySelectorAll('.processed').forEach(el => el.classList.remove('processed'));
                setupObserver();
            }, 55);
        }
    });

})();