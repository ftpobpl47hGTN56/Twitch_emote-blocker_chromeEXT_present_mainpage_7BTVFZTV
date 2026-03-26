// ==UserScript==
// @name         Two-dots replacer Kick chat
// @namespace    http://tampermonkey.net/
// @version      2.2.4
// @description  Two-dots replacer Kick chat
// @author       56h5ee5ejy
// @match        https://kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

// -------------------- colon replacer in Kick chat -------------------- //

// Скрипт для замены двоеточия на невидимый символ '‏‎ ' после логина в новых сообщениях чата Kick
(function () {
    const INVISIBLE_CHAR = '‏‎ '; // Невидимый символ для замены

    // Функция для замены двоеточия в сообщении
    function replaceColonInMessage(messageDiv) {
        // Находим контейнер с username (div с button внутри)
        const usernameDiv = messageDiv.querySelector('div.inline-flex.min-w-0.flex-nowrap.items-baseline');
        // Находим следующий элемент - span с двоеточием
        const colonSpan = usernameDiv ? usernameDiv.nextElementSibling : null;
        if (colonSpan &&
            colonSpan.classList.contains('inline-flex') &&
            colonSpan.classList.contains('font-bold') &&
            colonSpan.getAttribute('aria-hidden') === 'true' &&
            colonSpan.innerHTML.trim().startsWith(':')) { // Проверяем на наличие ':' в HTML (учитывая &nbsp;)
            colonSpan.innerHTML = INVISIBLE_CHAR + '‏‎ '; // Заменяем на невидимый символ + неразрывный пробел
        }
    }

    // Наблюдатель для отслеживания новых сообщений
    const chatContainer = document.querySelector('body'); // Если чат в конкретном контейнере, замените на более точный селектор, например, document.querySelector('.chat-container')
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 &&
                    node.classList.contains('betterhover:group-hover:bg-shade-lower')) { // Проверяем по уникальному классу сообщения
                    replaceColonInMessage(node);
                } else if (node.nodeType === 1) {
                    // Если добавлен фрагмент, ищем внутри сообщения
                    const messageDivs = node.querySelectorAll('div[class*="betterhover:group-hover:bg-shade-lower"]');
                    messageDivs.forEach(replaceColonInMessage);
                }
            }
        }
    });

    // Запускаем наблюдение за добавлением новых элементов
    observer.observe(chatContainer, {
        childList: true,
        subtree: true
    });

    // Заменяем в уже существующих сообщениях (при загрузке или перезапуске скрипта)
    document.querySelectorAll('div[class*="betterhover:group-hover:bg-shade-lower"]').forEach(replaceColonInMessage);
})();
//# sourceMappingURL=ColonReplacer_in_Kick_chat.js.map