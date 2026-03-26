// ==UserScript==
// @name         Slate_reset_input_type_delete_text.js (Chat Connect Trigger)
// @namespace    http://tampermonkey.net/
// @version      1.29.10.2025
// @description  Симулирует ввод и удаление текста в Twitch чате (поддержка textarea и Slate div) для прогрева и фикса дебаунса. Триггер на "Connecting to Chat"
// @author       gullampis810 (адаптировано)
// @match        https://www.twitch.tv/*
// @run-at       document-end 
// ==/UserScript==

(function() {
    'use strict';

    let warmupInitialized = false; // Глобальный флаг для предотвращения дубликатов

    // Функция для получения поля ввода и его типа
    function getInputField() {
        let input = document.querySelector('[data-a-target="chat-input"]');
        if (!input) return null;

        const isTextarea = input.tagName === 'TEXTAREA';
        const isSlate = input.getAttribute('data-slate-editor') === 'true';

        console.log(`[Slate_Recycler:Input] Найден инпут: ${input.tagName}, Slate: ${isSlate}, Textarea: ${isTextarea}`);
        return { input, isTextarea, isSlate };
    }

    // Функция для перемещения курсора в конец
    function moveCursorToEnd(field) {
        if (!field.input) return;
        field.input.focus();

        if (field.isTextarea) {
            field.input.setSelectionRange(field.input.value.length, field.input.value.length);
        } else {
            const range = document.createRange();
            const sel = window.getSelection();
            const lastNode = field.input.childNodes[field.input.childNodes.length - 1];
            if (lastNode) {
                range.selectNodeContents(lastNode);
                range.collapse(false);
            } else {
                range.setStart(field.input, 0);
                range.collapse(true);
            }
            sel.removeAllRanges();
            sel.addRange(range);
        }
        console.log('[Slate_Recycler:Cursor] Курсор перемещён в конец.');
    }

    // Функция для удаления всего текста (с фиксом preview)
    function deleteAllText(field) {
        if (!field.input) return;

        field.input.focus();

        // Очистка preview (для textarea-структуры Twitch)
        const previewDiv = field.input.closest('.chat-input__textarea')?.querySelector('.bbQAlj') || 
                          field.input.parentElement.querySelector('.font-scale--default');
        if (previewDiv) {
            previewDiv.textContent = '';
            console.log('[Slate_Recycler:Preview] Preview очищен.');
        }

        if (field.isTextarea) {
            field.input.value = '';
            field.input.dispatchEvent(new Event('input', { bubbles: true }));
            field.input.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            // Для Slate div
            const sel = window.getSelection();
            if (sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                range.selectAllChildren(field.input);
                sel.removeAllRanges();
                sel.addRange(range);
            }
            document.execCommand('delete', false, null);
            const fullRange = document.createRange();
            fullRange.selectNodeContents(field.input);
            fullRange.deleteContents();
            field.input.dispatchEvent(new Event('input', { bubbles: true }));
        }

        moveCursorToEnd(field);
        console.log('[Slate_Recycler:Delete] Текст полностью удалён (включая огрызки).');
    }

    // Функция симуляции ввода одного символа
    function simulateTypeChar(char, field) {
        if (!field.input) return;

        const keyMap = { 
            ' ': { key: ' ', code: 'Space', keyCode: 32, which: 32 },
        };
        const keyInfo = keyMap[char] || { 
            key: char, 
            code: `Key${char.toUpperCase()}`, 
            keyCode: char.charCodeAt(0), 
            which: char.charCodeAt(0) 
        };

        const events = [
            { type: 'keydown', ...keyInfo },
            { type: 'keypress', ...keyInfo },
            { type: 'input', inputType: 'insertText', data: char },
            { type: 'keyup', ...keyInfo }
        ];

        let eventDelay = 0;
        events.forEach((eventData, index) => {
            setTimeout(() => {
                let event;
                if (eventData.type === 'input') {
                    event = new InputEvent('input', { 
                        bubbles: true, 
                        cancelable: true, 
                        inputType: 'insertText', 
                        data: char 
                    });
                } else {
                    event = new KeyboardEvent(eventData.type, { 
                        bubbles: true, 
                        cancelable: true, 
                        key: eventData.key, 
                        code: eventData.code, 
                        keyCode: eventData.keyCode, 
                        which: eventData.which,
                        ctrlKey: false, altKey: false, shiftKey: false, metaKey: false 
                    });
                }

                field.input.dispatchEvent(event);
                console.log(`[Slate_Recycler:Type] Диспатч "${eventData.type}" для "${char}".`);

                // Вставка текста
                if (eventData.type === 'input') {
                    if (field.isTextarea) {
                        field.input.value += char;
                        field.input.dispatchEvent(new Event('input', { bubbles: true }));
                    } else {
                        // Для Slate
                        const sel = window.getSelection();
                        if (sel.rangeCount > 0) {
                            const range = sel.getRangeAt(0);
                            const textNode = document.createTextNode(char);
                            range.insertNode(textNode);
                            range.setStartAfter(textNode);
                            range.setEndAfter(textNode);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }
                }
            }, eventDelay);
            eventDelay += 10;
        });

        setTimeout(() => moveCursorToEnd(field), eventDelay + 5);
    }

 //======================= Основная функция прогрева ===========================
 // ============== НОВАЯ ВЕРСИЯ С НАСТРАИВАЕМЫМ КОЛИЧЕСТВОМ ЦИКЛОВ =============
    const CYCLES_COUNT = 8;        // ←←←← ЗДЕСЬ МЕНЯЙТЕ НА НУЖНОЕ ЧИСЛО повтор цикла  (1, 3, 5, 10 и т.д.)
    const CHAR_SEQUENCE = [ ' ', ' ', ];  // Последовательность символов за один цикл

    function triggerSlateWarmup() {
        if (warmupInitialized) {
            console.log('[Slate_Recycler:Warmup] Прогрев уже выполнен на этом канале, пропуск.');
            return;
        }

        const field = getInputField();
        if (!field) {
            console.log('[Slate_Recycler:Warmup] Инпут не найден, повтор через 500 мс.');
            setTimeout(triggerSlateWarmup, 10);
            return;
        }

        warmupInitialized = true;
        console.log(`[Slate_Recycler:Warmup] Запуск ${CYCLES_COUNT} циклов прогрева...`);

        let currentCycle = 0;

        function runSingleCycle() {
            if (currentCycle >= CYCLES_COUNT) {
                console.log('[Slate_Recycler:Warmup] Все циклы завершены.');
                return;
            }

            currentCycle++;
            console.log(`[Slate_Recycler:Cycle] Цикл ${currentCycle} из ${CYCLES_COUNT}`);

            field.input.focus();
            field.input.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            let sequenceDelay = 0;
            CHAR_SEQUENCE.forEach((char, index) => {
                sequenceDelay += 100;
                setTimeout(() => simulateTypeChar(char, field), sequenceDelay);
            });

            // Очистка после текущего цикла + запуск следующего
            setTimeout(() => {
    // ====== отключаем вызов автоочистки текста что бы  инпут не самоуничтожался из-за поганово Slate ====== // 
         // =========  deleteAllText(field);    ==========//
     // ====== отключаем вызов автоочистки текста что бы  инпут не самоуничтожался из-за поганово Slate ====== //
                // Небольшая пауза между циклами, чтобы Twitch не думал, что это спам
                setTimeout(runSingleCycle, 100);
            }, sequenceDelay + 100);
        }

        // Старт первого цикла
        runSingleCycle();
    }
         
        // Увеличенная задержка для полной очистки

    // Специализированный Observer для триггера "Connecting to Chat"
    function setupChatConnectObserver() {
        const observer = new MutationObserver((mutations) => {
            let connectTriggered = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            // Проверяем добавленный узел или его поддерево
                            const connectElement = node.querySelector('strong.CoreText-sc-1txzju1-0.bIUThl') || 
                                                  (node.matches && node.matches('strong.CoreText-sc-1txzju1-0.bIUThl') ? node : null);
                            if (connectElement && connectElement.textContent.trim() === 'Connecting to Chat') {
                                connectTriggered = true;
                            }
                        }
                    });
                }
            });

            if (connectTriggered) {
                console.log('[Slate_Recycler:ConnectTrigger] Обнаружен "Connecting to Chat", сброс флага и перезапуск через 2 сек.');
                warmupInitialized = false; // Сброс для перезапуска
                setTimeout(triggerSlateWarmup, 100); // Задержка для завершения подключения
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log('[Slate_Recycler:ConnectObserver] Наблюдатель за "Connecting to Chat" запущен.');
    }

    // Инициализация
    window.addEventListener('load', () => {
        console.log('[Slate_Recycler:Init] Запуск через 3 секунды.');
        setTimeout(() => {
       const chatContainer = document.querySelector('[data-a-target="chat-room-component-layout"]') || document.querySelector('.chat-room__container');
if (!chatContainer) {
    console.log('[Slate_Recycler:Init] Чат-контейнер не готов, повтор через 1 сек.');
    setTimeout(() => {
        triggerSlateWarmup();
        setupChatConnectObserver();
    }, 300);
    return;
}
            triggerSlateWarmup();
            setupChatConnectObserver();
        }, 500);
    });

    window.SlateRecyclerTest = triggerSlateWarmup;
})();




 