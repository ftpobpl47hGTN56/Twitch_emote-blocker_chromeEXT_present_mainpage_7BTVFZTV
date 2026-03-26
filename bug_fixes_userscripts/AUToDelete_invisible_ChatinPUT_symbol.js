/*


(function() {
    'use strict';

    // Функция дебаунса (задержка 800 мс для удобства набора)
    function debounce(func, delay) {
        let timeoutId;
        return function(event, ...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, [event, ...args]), delay);
        };
    }

    // Функция для очистки только ведущих пробелов (обновлено: только в начале строк и текста)
    function normalizeSpaces(text) {
        if (!text) return text;
        // Удаляем ведущие пробелы/символы в начале каждой строки (флаг m для multiline)
        text = text.replace(/^[\s\u2800\u200B\uFEFF\u00A0\n\r\t]+/gm, '');
        // Удаляем множественные \n (пустые строки)
        text = text.replace(/\n\s*\n/g, '\n');
        // Trim trailing для конца текста
        return text.trim();
    }

    // Функция cleanup: удаление слушателей и observers
    function cleanup() {
        if (window.chatObserver) {
            window.chatObserver.disconnect();
            window.chatObserver = null;
        }
        if (window.inputHandler) {
            const textarea = document.querySelector('textarea[data-a-target="chat-input"]');
            if (textarea) {
                textarea.removeEventListener('input', window.inputHandler);
            }
            window.inputHandler = null;
        }
        if (window.visibilityHandler) {
            document.removeEventListener('visibilitychange', window.visibilityHandler);
            window.removeEventListener('focus', window.visibilityHandler);
            window.visibilityHandler = null;
        }
        if (window.periodicChecker) {
            clearInterval(window.periodicChecker);
            window.periodicChecker = null;
        }
        console.log('Cleanup выполнен: слушатели удалены.');
    }

    // Функция для периодической проверки (раз в 2 сек)
    function startPeriodicCheck(textarea) {
        if (window.periodicChecker) clearInterval(window.periodicChecker);
        window.periodicChecker = setInterval(() => {
            const currentValue = textarea.value;
            const normalized = normalizeSpaces(currentValue);
            if (currentValue !== normalized) {
                console.warn('Обнаружено повторное появление ведущих символов! Нормализация через интервал.');
                textarea.value = normalized;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }, 2000);
    }

    // Функция инициализации
    function init() {
        cleanup(); // Очистка перед новой инициализацией

        // Поиск textarea
        const textarea = document.querySelector('textarea[data-a-target="chat-input"]');
        if (!textarea) {
            console.warn('Textarea не найдена, повторная инициализация через 1 сек.');
            setTimeout(init, 1000);
            return;
        }

        // Дебаунсированный обработчик ввода (с проверкой на ручной ввод)
        const debouncedHandler = debounce(function(event) {
            const currentValue = this.value;
            
            // Проверка: если это одиночная вставка (ручной ввод) и нет ведущих множественных — пропустить
            if (event && event.inputType === 'insertText' && event.data && event.data.length === 1 && 
                !/^[\s\u2800\u200B\uFEFF\u00A0\n\r\t]{2,}/.test(currentValue)) {
                console.log('Одиночный ручной ввод (пробел?), нормализация пропущена для удобства.');
                return; // Не нормализовать
            }

            console.log('До нормализации:', JSON.stringify(currentValue)); // Для отладки
            const normalized = normalizeSpaces(currentValue);
            console.log('После нормализации (только ведущие):', JSON.stringify(normalized));
            
            if (currentValue !== normalized) {
                this.value = normalized;
                // Триггерим input для обновления UI
                this.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('Ведущие пробелы нормализованы.');
                // Повторная проверка через 300 мс на возврат
                setTimeout(() => {
                    const afterCheck = this.value;
                    const reNormalized = normalizeSpaces(afterCheck);
                    if (afterCheck !== reNormalized) {
                        console.warn('Ведущие символы вернулись! Повторная нормализация.');
                        this.value = reNormalized;
                        this.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }, 300);
            }
        }, 800); // Дебаунс для комфорта

        // Привязка обработчика (с передачей event)
        window.inputHandler = function(e) { debouncedHandler.call(this, e); };
        textarea.addEventListener('input', window.inputHandler);

        // Периодическая проверка
        startPeriodicCheck(textarea);

        // MutationObserver для переподключения к чату
        const chatContainer = document.querySelector('.chat-input-tray__open');
        if (chatContainer) {
            window.chatObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        const connectingElement = mutation.addedNodes.find(node => 
                            node.nodeType === 1 && (
                                node.querySelector('.ScLoadingSpinner-sc-bvzaq8-0') ||
                                (node.textContent && node.textContent.includes('Connecting to Chat'))
                            )
                        );
                        if (connectingElement) {
                            console.log('Обнаружено переподключение к чату, переинициализация.');
                            setTimeout(init, 500);
                        }
                    }
                });
            });
            window.chatObserver.observe(chatContainer, { childList: true, subtree: true });
        }

        // Обработчик для новой вкладки
        const visibilityHandler = function() {
            if (!document.hidden) {
                console.log('Вкладка активирована, переинициализация.');
                setTimeout(init, 200);
            }
        };
        window.visibilityHandler = visibilityHandler;
        document.addEventListener('visibilitychange', visibilityHandler);
        window.addEventListener('focus', visibilityHandler);

        console.log('Скрипт инициализирован (нормализация только ведущих пробелов).');
    }

    // Начальная инициализация
    init();

    // Экспорт
    window.chatSpaceNormalizer = { init, cleanup };
})();

*/