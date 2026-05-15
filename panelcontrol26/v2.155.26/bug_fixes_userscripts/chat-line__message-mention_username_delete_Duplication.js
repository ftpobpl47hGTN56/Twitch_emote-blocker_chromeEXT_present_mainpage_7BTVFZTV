// ==UserScript==
// @name         Fix Chat Mention Duplication with Clickable  Mentions
// @namespace    http://tampermonkey.net/
// @version      1.4.7
// @description  Fixes duplicated mentions in chat messages, ensures mentions are clickable and trigger cardviewer, with debug logging
// @author       Grok
// @match        *://*.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// ==/UserScript==

/*
// рабочий скрипт пока выключен для chatFilter.js
(function() {
    'use strict';

    // ========== Функция для исправления одного сообщения
    function fixMessage(messageDiv) {
        const messageBody = messageDiv.querySelector('span[data-a-target="chat-line-message-body"]');
        if (!messageBody) {
            console.log('Twitch Chat Mention Fix: Не найден span[data-a-target="chat-line-message-body"] в сообщении', messageDiv);
            return;
        }

        const mentionFragments = messageBody.querySelectorAll('span.mention-fragment[data-a-target="chat-message-mention"]');
        const textFragments = messageBody.querySelectorAll('span.text-fragment[data-a-target="chat-message-text"]');
        if (mentionFragments.length === 0) {
            console.log('Twitch Chat Mention Fix: Не найдены упоминания в сообщении', messageBody);
            return;
        }

        // ========== Собираем первое упоминание и весь текст
        let firstMention = null;
        let allText = '';
        const nodes = Array.from(messageBody.childNodes);

        nodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.classList.contains('mention-fragment')) {
                    const mentionText = node.textContent.trim();
                    if (!firstMention) {
                        firstMention = mentionText; // Сохраняем первое упоминание
                    }
                    allText += mentionText;
                } else if (node.classList.contains('text-fragment')) {
                    allText += node.textContent.trim();
                }
            }
        });

        if (!firstMention) {
            console.log('Twitch Chat Mention Fix: Не найдено корректное упоминание', messageBody);
            return;
        }

        // ========== Удаляем [filtered] и повторяющиеся упоминания из текста
        let cleanText = allText.replace(/\[filtered\]/g, '').trim();
        if (cleanText.startsWith(firstMention)) {
            cleanText = cleanText.substring(firstMention.length).trim();
        }
        // ========== Удаляем все упоминания из текста
        const mentionRegex = new RegExp(firstMention.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'g');
        cleanText = cleanText.replace(mentionRegex, '').trim();

        // ========== Удаляем все существующие mention-fragment и text-fragment
        mentionFragments.forEach(fragment => fragment.remove());
        textFragments.forEach(fragment => fragment.remove());

        // ========== Создаём новое упоминание
        const newMention = document.createElement('span');
        newMention.classList.add('mention-fragment', 'mention-fragment--sender');
        newMention.setAttribute('data-a-target', 'chat-message-mention');
        newMention.textContent = firstMention;
        messageBody.appendChild(newMention);

        // ========== Создаём новый text-fragment, если есть оставшийся текст
        if (cleanText) {
            const newFragment = document.createElement('span');
            newFragment.classList.add('text-fragment');
            newFragment.setAttribute('data-a-target', 'chat-message-text');
            newFragment.textContent = ` ${cleanText}`;
            messageBody.appendChild(newFragment);
            console.log('Twitch Chat Mention Fix: Исправлено сообщение:', firstMention, '+', cleanText);
        } else {
            console.log('Twitch Chat Mention Fix: Исправлено сообщение, только упоминание:', firstMention);
        }
    }

    // ========== Функция для инициализации наблюдения за чатом
    function initChatObserver() {
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
        if (!chatContainer) {
            console.log('Twitch Chat Mention Fix: Контейнер чата не найден, ожидание...');
            return false;
        }

        // ========== Наблюдатель за новыми сообщениями
        const observer = new MutationObserver((mutations) => {
            console.log('Twitch Chat Mention Fix: MutationObserver сработал, найдено мутаций:', mutations.length);
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList.contains('chat-line__message')) {
                            console.log('Twitch Chat Mention Fix: Обработка нового сообщения');
                            fixMessage(node);
                        } else if (node.querySelectorAll) {
                            const messages = node.querySelectorAll('.chat-line__message');
                            console.log('Twitch Chat Mention Fix: Найдено сообщений в мутации:', messages.length);
                            messages.forEach(fixMessage);
                        }
                    }
                });
            });
        });

        // ========== Наблюдаем за изменениями в контейнере чата
        observer.observe(chatContainer, { childList: true, subtree: true });

        // ========== Исправляем существующие сообщения
        const existingMessages = chatContainer.querySelectorAll('.chat-line__message');
        console.log('Twitch Chat Mention Fix: Найдено существующих сообщений:', existingMessages.length);
        existingMessages.forEach(fixMessage);

        console.log('Twitch Chat Mention Fix: Скрипт успешно инициализирован');

        // ========== Резервный механизм с setInterval
        setInterval(() => {
            const messages = chatContainer.querySelectorAll('.chat-line__message');
            console.log('Twitch Chat Mention Fix: Периодическая проверка, найдено сообщений:', messages.length);
            messages.forEach(fixMessage);
        }, 2000); // Проверка каждые 2 секунды

        return true;
    }

    // ========== Функция для наблюдения за появлением чата
    function observeDOM() {
        const observer = new MutationObserver((mutations, obs) => {
            if (initChatObserver()) {
                obs.disconnect();
                console.log('Twitch Chat Mention Fix: Наблюдатель DOM отключён, чат найден');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ========== Пробуем инициализировать сразу
    if (!initChatObserver()) {
        observeDOM();
    }
})(); 

*/