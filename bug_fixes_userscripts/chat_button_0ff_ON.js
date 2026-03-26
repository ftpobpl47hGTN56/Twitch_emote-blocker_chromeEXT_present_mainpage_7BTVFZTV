// Функция дебаунс для предотвращения спама кликов (опционально, удалите если не нужно)
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Инициализация: ждём загрузки чата с Observer
function initChatToggle() {
    const chatHeader = document.querySelector('.stream-chat-header');
    if (!chatHeader) {
        console.log('Хедер чата не найден — ждём загрузки...');
        // Retry каждую секунду, до 10 попыток
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (attempts > 10) {
                clearInterval(interval);
                console.log('Хедер чата не найден после 10 сек — обновите страницу');
                return;
            }
            const newHeader = document.querySelector('.stream-chat-header');
            if (newHeader) {
                clearInterval(interval);
                initChatToggle();  // Рекурсия для продолжения
            }
        }, 1000);
        return;
    }

    // Найти контейнер чата (обновлённый селектор)
    let chatContainer = document.querySelector('section[data-test-selector="chat-room-component-layout"]');
    if (!chatContainer) {
        console.log('Контейнер чата не найден — используем Observer для ожидания');
        // MutationObserver для динамической загрузки
        const observer = new MutationObserver((mutations) => {
            chatContainer = document.querySelector('section[data-test-selector="chat-room-component-layout"]');
            if (chatContainer) {
                observer.disconnect();
                console.log('Контейнер чата найден через Observer');
                proceedWithInit(chatContainer);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        // Fallback: отключить через 10 сек
        setTimeout(() => observer.disconnect(), 10000);
        return;
    }

    proceedWithInit(chatContainer);

    function proceedWithInit(chatContainer) {
        // Создать placeholder div (вставим его в контейнер)
        const placeholderDiv = document.createElement('div');
        placeholderDiv.innerHTML = `
            <div class="Layout-sc-1xcs6mc-0 lahzZT">
                <div class="Layout-sc-1xcs6mc-0 goosYB">
                    <p class="CoreText-sc-1txzju1-0 fomEUL">Chat is hidden.</p>
                </div>
                <button data-a-target="show-chat-button" class="ScCoreButton-sc-ocjdkq-0 kJMgAB">
                    <div class="ScCoreButtonLabel-sc-s7h2b7-0 kaIUar">
                        <div data-a-target="tw-core-button-label-text" class="Layout-sc-1xcs6mc-0 bLZXTb">Show Chat</div>
                    </div>
                </button>
            </div>
        `;
        placeholderDiv.style.display = 'none';  // Скрыт по умолчанию
        placeholderDiv.className = 'chat-placeholder';  // Для стилей
        chatContainer.appendChild(placeholderDiv);  // Вставить в контейнер

        // Стили для placeholder (глобально)
        const style = document.createElement('style');
        style.textContent = `
            .chat-placeholder { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: var(--color-background-layer); display: flex; align-items: center; justify-content: center; z-index: 10; }
            .chat-room[data-hidden="true"] .chat-room__content { display: none !important; }
            .chat-room[data-hidden="false"] .chat-placeholder { display: none !important; }
        `;
        document.head.appendChild(style);

        let isHidden = false;

        // Создать кнопку toggle
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = `
            <div class="ScCoreButtonLabel-sc-s7h2b7-0 kaIUar">
                <div class="Layout-sc-1xcs6mc-0 bLZXTb">Hide Chat</div>
            </div>
        `;
        toggleButton.className = 'ScCoreButton-sc-ocjdkq-0 iPkwTD ScButtonIcon-sc-9yap0r-0 dcNXJO';
        toggleButton.style.marginLeft = '10px';
        toggleButton.ariaLabel = 'Toggle Chat Visibility';

        // Функция toggle (обновлённая: только visibility)
        const toggleChat = debounce(() => {
            if (isHidden) {
                // Восстановить: показать чат, скрыть placeholder
                chatContainer.setAttribute('data-hidden', 'false');
                const scroller = chatContainer.querySelector('[data-a-target="chat-scroller"]');
                if (scroller) scroller.scrollTop = scroller.scrollHeight;
                isHidden = false;
                toggleButton.innerHTML = `
                    <div class="ScCoreButtonLabel-sc-s7h2b7-0 kaIUar">
                        <div class="Layout-sc-1xcs6mc-0 bLZXTb">Hide Chat</div>
                    </div>
                `;
            } else {
                // Скрыть: скрыть чат, показать placeholder
                chatContainer.setAttribute('data-hidden', 'true');
                isHidden = true;
                toggleButton.innerHTML = `
                    <div class="ScCoreButtonLabel-sc-s7h2b7-0 kaIUar">
                        <div class="Layout-sc-1xcs6mc-0 bLZXTb">Show Chat</div>
                    </div>
                `;
            }
        }, 300);

        toggleButton.addEventListener('click', toggleChat);

        // Добавить кнопку
        const headerActions = chatHeader.querySelector('.Layout-sc-1xcs6mc-0 UPwco');
        if (headerActions) {
            headerActions.appendChild(toggleButton);
            console.log('Кнопка Toggle Chat добавлена в действия хедера');
        } else {
            chatHeader.appendChild(toggleButton);
            console.log('Кнопка добавлена в хедер (fallback)');
        }
    }
}

// Запуск
initChatToggle();