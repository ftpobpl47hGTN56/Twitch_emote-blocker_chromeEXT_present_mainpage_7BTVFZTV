 // ==UserScript==
// @name         Twitch_Login_InPut_Auto_Replace (intl   unicode cleanup)
// @namespace    Twitch_Login_InPut_Auto_Replace
// @version      2.3
// @description  Заменяет  intl-имена   мусорныые Unicode на реальные логины в поле ввода 
// @match        https://www.twitch.tv/* 
// ==/UserScript==
 // auto_paste_login_input_chat.js // 
 // auto_paste_login_input_chat.js // 
 // auto_paste_login_input_chat.js //  

 // [Twitch_Login_InPut_Auto_Replace]  js //  
 // [Twitch_Login_InPut_Auto_Replace]  js //
 // [Twitch_Login_InPut_Auto_Replace]  js // 

  (function() {
    'use strict';

    // Функция для поиска инпута
    function findInput() {
        const input = document.querySelector('div[data-a-target="chat-input"][contenteditable="true"]');
        if (!input) {
            console.log('[Twitch_Login_InPut_Auto_Replace] Input not found, retrying...');
            return null;
        }
        console.log('[Twitch_Login_InPut_Auto_Replace] Input found:', input);
        return input;
    }

    // Функция для извлечения текста из contenteditable
    function getInputText(input) {
        const textNode = input.querySelector('[data-slate-string="true"]');
        return textNode ? textNode.textContent : input.textContent || input.innerText;
    }

    // Функция для замены текста в contenteditable
    function replaceInputText(input, loginText) {
        const currentText = getInputText(input);
        const atIndex = currentText.lastIndexOf('@');
        if (atIndex === -1) {
            console.log('[Twitch_Login_InPut_Auto_Replace] No @ found in input');
            return;
        }

        const beforeAt = currentText.substring(0, atIndex);
        const afterAt = currentText.substring(atIndex);
        const spaceIndex = afterAt.indexOf(' ') !== -1 ? afterAt.indexOf(' ') : afterAt.length;
        const newText = `${beforeAt}@${loginText}${afterAt.substring(spaceIndex)}`;

        // Обновляем содержимое
        const textNode = input.querySelector('[data-slate-string="true"]');
        if (textNode) {
            textNode.textContent = newText;
        } else {
            input.textContent = newText;
        }
        console.log('[Twitch_Login_InPut_Auto_Replace] Replaced text to:', newText);

        // Устанавливаем курсор в конец
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(input);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    // Функция для обработки ввода
    function handleInputChange(input) {
        const currentText = getInputText(input);
        if (!currentText.startsWith('@')) {
            console.log('[Twitch_Login_InPut_Auto_Replace] Input does not start with @:', currentText);
            return;
        }

        const atIndex = currentText.lastIndexOf('@');
        const afterAt = currentText.substring(atIndex + 1);
        const spaceIndex = afterAt.indexOf(' ') !== -1 ? afterAt.indexOf(' ') : afterAt.length;
        const typedLogin = afterAt.substring(0, spaceIndex);
        console.log('[Twitch_Login_InPut_Auto_Replace] Typed login:', typedLogin);

        // Проверяем, содержит ли введенный логин нелатинские символы
        if (!/^[a-z0-9_]+$/i.test(typedLogin)) {
            // Ищем совпадение в попапе
            const autocompleteList = document.querySelector('.autocomplete-match-list');
            if (!autocompleteList || !autocompleteList.offsetParent) {
                console.log('[Twitch_Login_InPut_Auto_Replace] Autocomplete list not visible');
                return;
            }

            const buttons = autocompleteList.querySelectorAll('.tw-interactable');
            for (const btn of buttons) {
                const intlLogin = btn.querySelector('.intl-login');
                const dataTarget = btn.getAttribute('data-a-target');
                if (intlLogin && dataTarget.includes(typedLogin)) {
                    const loginText = intlLogin.textContent.replace(/[()]/g, '');
                    console.log('[Twitch_Login_InPut_Auto_Replace] Found matching login:', loginText);
                    replaceInputText(input, loginText);
                    break;
                }
            }
        } else {
            console.log('[Twitch_Login_InPut_Auto_Replace] Typed login is latin, no replacement needed:', typedLogin);
        }
    }

    // Наблюдатель за DOM
    const observer = new MutationObserver(() => {
        const input = findInput();
        if (!input) return;

        // Добавляем обработчик ввода
        input.removeEventListener('input', inputHandler);
        input.addEventListener('input', inputHandler);

        function inputHandler() {
            console.log('[Twitch_Login_InPut_Auto_Replace] Input event triggered');
            handleInputChange(input);
        }

        // Обновляем попап
        const autocompleteList = document.querySelector('.autocomplete-match-list');
        if (autocompleteList && autocompleteList.offsetParent) {
            console.log('[Twitch_Login_InPut_Auto_Replace] Autocomplete appeared/updated');
            document.querySelectorAll('.autocomplete-match-list .tw-interactable').forEach((btn, index) => {
                const intlLogin = btn.querySelector('.intl-login');
                const nameElem = btn.querySelector('p');
                const dataTarget = btn.getAttribute('data-a-target');
                console.log(`[Twitch_Login_InPut_Auto_Replace] #${index} {label: '${nameElem?.textContent}', intlLogin: '${intlLogin?.textContent || null}', dataTarget: '${dataTarget}'}`);
                
                if (intlLogin) {
                    const loginText = intlLogin.textContent.replace(/[()]/g, '');
                    if (nameElem && !/^[a-z0-9_]+$/i.test(nameElem.textContent)) {
                        nameElem.textContent = loginText;
                        btn.setAttribute('data-a-target', `@${loginText}`);
                    }
                }
            });
        }
    });

    // Запускаем наблюдатель
    observer.observe(document.body, { childList: true, subtree: true });

    // Попытка найти input при загрузке
    const initialInput = findInput();
    if (initialInput) {
        initialInput.addEventListener('input', () => {
            console.log('[Twitch_Login_InPut_Auto_Replace] Initial input event triggered');
            handleInputChange(initialInput);
        });
    }
})(); 