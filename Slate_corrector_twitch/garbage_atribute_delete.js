
// ==UserScript==
// @name         Twitch Chat Input Cleaner - Remove Garbage Text
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматически удаляет мусорный текст "12345ttthFFFFF" из поля ввода чата на Twitch
// @author       Grok
// @match        https://www.twitch.tv/*
// @match        https://twitch.tv/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const garbageText = '12345ttthFFFFF';
    const garbagePattern = new RegExp(garbageText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

    // Функция очистки поля ввода чата
    function cleanChatInput() {
        // Основной селектор для textarea чата на Twitch (актуален на 2025 год)
        const textarea = document.querySelector('textarea[data-a-target="chat-input"]');
        if (textarea && textarea.value.includes(garbageText)) {
            textarea.value = textarea.value.replace(garbagePattern, '').trim();
            // Диспатчим события, чтобы Twitch правильно обновил состояние
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Дополнительно: если мусор injected как текстовий узел в контейнер (как в вашем примере)
        const container = document.querySelector('div.Layout-sc-1xcs6mc-0.bbQAlj.font-scale--default');
        if (container) {
            container.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.includes(garbageText)) {
                    node.textContent = node.textContent.replace(garbagePattern, '').trim();
                }
            });
        }
    }

    // Запуск очистки при любых изменениях в DOM
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                cleanChatInput();
                return; // Можно выйти рано, если нашли и почистили
            }
        }
    });

    // Начинаем наблюдение как можно раньше
    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: false
    });

    // Дополнительная проверка при полной загрузке страницы
    window.addEventListener('load', () => {
        cleanChatInput();
    });

    // Отслеживание изменений URL (для SPA-навигации на Twitch)
    let currentUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            cleanChatInput();
            // Observer уже работает, но можно перезапустить проверку
        }
    }).observe(document, { subtree: true, childList: true });

    // Первоначальная проверка сразу
    cleanChatInput();

})();
