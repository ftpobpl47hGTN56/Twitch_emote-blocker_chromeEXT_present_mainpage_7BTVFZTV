// ==UserScript==
// @name         Chat Slate Word Corrector
// @namespace    http://tampermonkey.net/
// @version      1.0.6  // Обновленная версия
// @description  Исправляет наложение начальных букв при автодополнении в поле ввода чата Twitch
// @author       gullampis810
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// ==/UserScript==

// Обновленная версия с цветными логами по типам, сентябрь 2025 //

// Chat_slate_Word_Corrector.js //





/*

(function() {
    'use strict';

    // Функция для инициализации скрипта
    function initChatSlateWordCorrector() {
        const chatInput = document.querySelector('[data-a-target="chat-input"]');

        // Проверяем, что поле ввода найдено
        if (!chatInput) {
            console.log('[Chat_Slate_Word_Corrector:Process] Поле ввода чата не найдено, ожидание...');
            return false;
        }

        // ДОБАВЛЕНО: Проверяем флаг инициализации, чтобы избежать дублирования обработчиков
        if (chatInput.dataset.correctorInitialized === 'true') {
            console.log('[Chat_Slate_Word_Corrector:Process] Обработчики уже прикреплены к этому полю, пропуск.');
            return true;
        }

        // Функция для обработки ввода перед его обработкой Slate
        function handleBeforeInput(event) {
            console.log('[Chat_Slate_Word_Corrector:Process] Событие beforeinput сработало. inputType:', event.inputType, 'data:', event.data);
            if (event.inputType === 'insertText' || event.inputType === 'insertFromPaste') {
                const inputText = event.data || '';
                const selection = window.getSelection();
                if (!selection.rangeCount) {
                    console.log('[Chat_Slate_Word_Corrector:Process] Нет выделения, пропуск обработки.');
                    return;
                }
                const range = selection.getRangeAt(0);
                const currentText = chatInput.textContent.trim();
                const words = currentText.split(' ');
                const lastWord = words[words.length - 1] || '';

                console.log('[Chat_Slate_Word_Corrector:Process] Текущий текст:', currentText, 'Последнее слово:', lastWord, 'Вставляемый текст:', inputText);

                // Проверяем, совпадает ли начало вставляемого текста с последним словом
                if (inputText && lastWord && inputText.toLowerCase().startsWith(lastWord.toLowerCase())) {
                    console.log('[Chat_Slate_Word_Corrector:Process] Обнаружено наложение, предотвращаем стандартное поведение.');
                    event.preventDefault();

                    // Удаляем последние символы (начальный фрагмент слова)
                    const newText = currentText.slice(0, -lastWord.length) + inputText;

                    console.log('[Chat_Slate_Word_Corrector:Success] Новый текст для вставки:', newText.slice(-inputText.length));

                    // Вставляем исправленный текст
                    document.execCommand('insertText', false, newText.slice(-inputText.length));
                } else {
                    console.log('[Chat_Slate_Word_Corrector:Process] Наложения не обнаружено, стандартная обработка.');
                }
            } else {
                console.log('[Chat_Slate_Word_Corrector:Process] Не подходящий inputType, пропуск.');
            }
        }

        // Функция для обработки вставки текста
        function handlePaste(event) {
            console.log('[Chat_Slate_Word_Corrector:Process] Событие paste сработало.');
            event.preventDefault();
            const pastedText = (event.clipboardData || window.clipboardData).getData('text');
            const currentText = chatInput.textContent.trim();
            const words = currentText.split(' ');
            const lastWord = words[words.length - 1] || '';

            console.log('[Chat_Slate_Word_Corrector:Process] Вставляемый текст из буфера:', pastedText, 'Текущий текст:', currentText, 'Последнее слово:', lastWord);

            // Если вставляемый текст начинается с последнего слова, заменяем его
            if (pastedText.toLowerCase().startsWith(lastWord.toLowerCase())) {
                console.log('[Chat_Slate_Word_Corrector:Process] Обнаружено наложение при вставке, корректируем.');
                const newText = currentText.slice(0, -lastWord.length) + pastedText;
                document.execCommand('insertText', false, newText.slice(-pastedText.length));
                console.log('[Chat_Slate_Word_Corrector:Success] Вставка завершена успешно.');
            } else {
                console.log('[Chat_Slate_Word_Corrector:Process] Наложения не обнаружено, стандартная вставка.');
                document.execCommand('insertText', false, pastedText);
            }
        }

        // Добавляем обработчики событий
        chatInput.addEventListener('beforeinput', handleBeforeInput);
        chatInput.addEventListener('paste', handlePaste);

        // ДОБАВЛЕНО: Устанавливаем флаг инициализации
        chatInput.dataset.correctorInitialized = 'true';

        // Добавляем логи на фокус и потерю фокуса для отслеживания проблемы
        chatInput.addEventListener('focus', () => {
            console.log('[Chat_Slate_Word_Corrector:Process] Поле ввода получило фокус.');
        });
        chatInput.addEventListener('blur', () => {
            console.log('[Chat_Slate_Word_Corrector:Process] Поле ввода потеряло фокус.');
        });

        console.log('[Chat_Slate_Word_Corrector:Success] Скрипт успешно инициализирован, обработчики прикреплены.');
        return true;
    }

    // Функция для наблюдения за DOM
    function observeDOM() {
        const observer = new MutationObserver((mutations, obs) => {
            console.log('[Chat_Slate_Word_Corrector:Process] MutationObserver сработал, проверяем наличие поля ввода.');
            // ИЗМЕНЕНО: Всегда вызываем init, без отключения observer
            initChatSlateWordCorrector();
        });

        // Наблюдаем за изменениями в body
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log('[Chat_Slate_Word_Corrector:Success] MutationObserver запущен.');
    }

    // Пробуем инициализировать сразу
    console.log('[Chat_Slate_Word_Corrector:Process] Запуск инициализации скрипта.');
    if (!initChatSlateWordCorrector()) {
        // Если поле ввода не найдено, запускаем наблюдатель
        observeDOM();
    } else {
        // ДОБАВЛЕНО: Если сразу нашли, тоже запускаем observer для будущих изменений
        observeDOM();
    }
})();  



*/