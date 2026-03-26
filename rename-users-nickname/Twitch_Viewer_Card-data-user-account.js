// ==UserScript==
// @name            Twitch Viewer Card - Дата регистрации аккаунта
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     Добавляет дату создания аккаунта в viewer card из twitchtracker.com
// @author          5rj5jyy85rntf
// @match           https://www.twitch.tv/*
// @grant           GM_xmlhttpRequest
// @license         MIT
// @run-at          document-end
// @icon            https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                const cards = [
                    ...(node.matches('[data-a-target="viewer-card"]') ? [node] : []),
                    ...node.querySelectorAll('[data-a-target="viewer-card"]')
                ];

                for (const card of cards) {
                    if (card.dataset.accountDateAdded) continue;
                    card.dataset.accountDateAdded = 'true';
                    processCard(card);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function processCard(card) {
        const link = card.querySelector('a.tw-link[href^="/"]');
        if (!link) {
            console.log('Viewer card: ссылка на профиль не найдена');
            return;
        }

        const username = link.getAttribute('href').slice(1).toLowerCase();
        console.log('Processing username:', username);

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://twitchtracker.com/${username}`,
            onload: function (response) {
                if (response.status !== 200) {
                    console.log('Ошибка загрузки twitchtracker:', response.status);
                    return;
                }

                const text = response.responseText;
                console.log('Страница twitchtracker загружена, длина текста:', text.length);

                let rawDate = null;
                let formattedDate = null;

                // Вариант 1: timestamp в title
                const titleMatch = text.match(/Created.*?title="(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})"/is);
                if (titleMatch) {
                    rawDate = titleMatch[1];
                    console.log('Found timestamp in title:', rawDate);
                }

                // Вариант 2: timestamp в тексте
                if (!rawDate) {
                    const tsMatch = text.match(/Created.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/is);
                    if (tsMatch) {
                        rawDate = tsMatch[1];
                        console.log('Found timestamp in text:', rawDate);
                    }
                }

                // Вариант 3: английская дата "May 6, 2020"
                if (!rawDate) {
                    const engMatch = text.match(/Created.*?([A-Za-z]+ \d{1,2}, \d{4})/is);
                    if (engMatch) {
                        const engDateStr = engMatch[1];
                        console.log('Found english date:', engDateStr);
                        const dateObj = new Date(engDateStr);
                        if (!isNaN(dateObj.getTime())) {
                            formattedDate = dateObj.toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }) + ' г.';
                        }
                    }
                }

                // Форматирование из timestamp
                if (rawDate && !formattedDate) {
                    const dateObj = new Date(rawDate.replace(' ', 'T') + 'Z');
                    if (!isNaN(dateObj.getTime())) {
                        formattedDate = dateObj.toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }) + ' г.';
                    }
                }

                if (!formattedDate) {
                    console.log('No date found on twitchtracker page');
                    return;
                }

                console.log('Formatted date:', formattedDate);

                // Новый элемент под никнеймом
                const dateElement = document.createElement('div');
                dateElement.textContent = `Дата регистрации: ${formattedDate}`;
                dateElement.style.textAlign = 'center';
                dateElement.style.padding = '4px 0 8px 0';
                dateElement.style.color = '#ffffff';
                dateElement.style.fontSize = '13px';
                dateElement.style.opacity = '0.9';

                const displayNameBlock = card.querySelector('.viewer-card-header__display-name');
                if (displayNameBlock) {
                    displayNameBlock.after(dateElement);
                    console.log('Дата вставлена под никнеймом');
                } else {
                    console.log('Блок с никнеймом не найден — дата не вставлена');
                }
            },
            onerror: function () {
                console.error('Ошибка запроса к twitchtracker.com');
            }
        });
    }
})();






