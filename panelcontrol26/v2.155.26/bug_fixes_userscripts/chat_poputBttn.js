
(function() {
    'use strict';

    let currentButton = null;
    let observer = null;

    function extractChannelName() {
        const titleElement = document.querySelector('h1.tw-title');
        if (titleElement) {
            return titleElement.textContent.trim();
        }
        const linkElement = document.querySelector('a[href^="/"][href$="/"]');
        if (linkElement) {
            const href = linkElement.getAttribute('href');
            return href.substring(1, href.length - 1);
        }
        return null;
    }

    function createChatBubbleSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 32 32');
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = '<path fill="currentColor" d="M28 4H10a2.006 2.006 0 0 0-2 2v14a2.006 2.006 0 0 0 2 2h18a2.006 2.006 0 0 0 2-2V6a2.006 2.006 0 0 0-2-2m0 16H10V6h18Z"/><path fill="currentColor" d="M18 26H4V16h2v-2H4a2.006 2.006 0 0 0-2 2v10a2.006 2.006 0 0 0 2 2h14a2.006 2.006 0 0 0 2-2v-2h-2Z"/>';
        return svg;
    }

    function createPopoutButton(channel) {
        if (!channel) return;

        // Удаляем старую кнопку, если существует
        if (currentButton) {
            currentButton.remove();
        }

        const headerDiv = document.querySelector('.stream-chat-header .kvrzxX');
        if (!headerDiv) return;

        const titleH4 = headerDiv.querySelector('h4[data-test-selector="chat-room-header-label"]');
        if (!titleH4) return;

        const button = document.createElement('button');
        button.className = 'ScCoreButton-sc-ocjdkq-0 iPkwTD ScButtonIcon-sc-9yap0r-0 dcNXJO';
        button.setAttribute('aria-label', 'Chat Popout');
        button.style.marginRight = '8px';
        button.appendChild(createChatBubbleSVG());

        button.addEventListener('click', function() {
            const popoutUrl = `https://www.twitch.tv/popout/${channel}/chat?popout=`;
            window.open(popoutUrl, '_blank', 'width=400,height=600,menubar=no,toolbar=no,scrollbars=yes,resizable=yes');
        });

        // Вставляем кнопку перед h4 в заголовке
        headerDiv.insertBefore(button, titleH4);

        currentButton = button;
    }

    function init() {
        const channel = extractChannelName();
        if (channel) {
            createPopoutButton(channel);
        }
    }

    function setupObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            const connectingText = node.querySelector('strong') || node;
                            if (connectingText && connectingText.textContent.trim() === 'Connecting to Chat') {
                                setTimeout(init, 500);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
    setupObserver();
})();