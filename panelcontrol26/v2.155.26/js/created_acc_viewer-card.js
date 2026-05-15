// ==UserScript==
// @name        created_acc_viewer-card twitch.tv
// @namespace   Violentmonkey Scripts
// @match       https://www.twitch.tv/popout/tapa_tapa_mateo/chat*
// @match       https://www.twitch.tv/popout/*
// @match       https://www.twitch.tv/*
// @grant       none
// @version     1.0
// @author      -
// @description 21.02.2026, 03:46:10
// ==/UserScript==


(function () {
    'use strict';

    console.log('🟢 Twitch account date script starting...');

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                const cards = [
                    ...(node.matches('[data-a-target="viewer-card"]') ? [node] : []),
                    ...node.querySelectorAll('[data-a-target="viewer-card"]')
                ];

                for (const card of cards) {
                    if (card.dataset.accountDateAdded) {
                        console.log('⚠️ Card already processed, skipping');
                        continue;
                    }
                    card.dataset.accountDateAdded = 'true';
                    console.log('✅ New card found, processing...');
                    processCard(card);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('👀 Observer started');

    async function processCard(card) {
        const link = card.querySelector('h4 a.tw-link') || card.querySelector('a[href^="/"]');
        if (!link) {
            console.log('❌ No link found in card');
            return;
        }

        const username = link.getAttribute('href').replace(/\//g, '').toLowerCase();
        console.log(`📝 Processing user: ${username}`);

        try {
            // Пробуем получить Client-Id из страницы (более надежно)
            let clientId = 'kimne78kx3ncx6brgo4mv6wki5h1ko'; // дефолтный

            const scriptTags = document.querySelectorAll('script');
            for (const script of scriptTags) {
                if (script.textContent.includes('clientId')) {
                    const match = script.textContent.match(/"clientId":"([^"]+)"/);
                    if (match) {
                        clientId = match[1];
                        console.log(`🔑 Found clientId: ${clientId}`);
                        break;
                    }
                }
            }

            console.log(`🌐 Fetching data for ${username}...`);

            const response = await fetch('https://gql.twitch.tv/gql', {
                method: 'POST',
                headers: {
                    'Client-Id': clientId,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `query {
                        user(login: "${username}") {
                            createdAt
                            id
                        }
                    }`
                })
            });

            console.log(`📡 Response status: ${response.status}`);

            const data = await response.json();
            console.log('📦 Response data:', data);

            if (!data.data?.user?.createdAt) {
                console.log('❌ No createdAt in response');
                return;
            }

            const dateObj = new Date(data.data.user.createdAt);
            const formattedDate = dateObj.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            console.log(`📅 Account created: ${formattedDate}`);

            if (card.querySelector('#created-idacc-twch-765rd')) {
                console.log('⚠️ Date element already exists');
                return;
            }

            const dateElement = document.createElement('div');
            dateElement.id = 'created-idacc-twch-765rd';
            dateElement.textContent = `Создан: ${formattedDate}`;
            dateElement.style.cssText = `
                text-align: center;
                padding: 4px 8px;
                margin-top: 4px;
                color: rgb(220, 255, 252);
                font-size: 14px;
                width: 100%;
                display: block;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            `;

            const displayNameBlock = card.querySelector('.viewer-card-header__display-name');
            if (displayNameBlock) {
                displayNameBlock.appendChild(dateElement);
                console.log('✅ Date added to card!');
            } else {
                console.log('❌ Display name block not found');
                // Попробуем альтернативное место
                const headerOverlay = card.querySelector('.viewer-card-header__overlay');
                if (headerOverlay) {
                    headerOverlay.appendChild(dateElement);
                    console.log('✅ Date added to overlay!');
                }
            }
        } catch (e) {
            console.error('💥 Error fetching account data:', e);
        }
    }

    console.log('🚀 Script loaded successfully');
})();

