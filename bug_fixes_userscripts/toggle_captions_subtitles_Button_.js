// ==UserScript==
// @name         Twitch Custom Closed Captions Container
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Moves Closed Captions to a collapsible container at the bottom of the video player settings menu, prevents duplication, and makes it toggleable with an arrow button (hidden content by default).
// @author       6кг5уу5
// @match        https://www.twitch.tv/*
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const menu = node.closest('[data-a-target="player-settings-menu"]');
                        if (menu) {
                            handleMenu(menu);
                        } else {
                            // Check if node or descendants contain CC button
                            const ccButtons = node.querySelectorAll('button[role="menuitem"]');
                            let ccItem = Array.from(ccButtons).find(btn => btn.textContent.includes('Closed Captions'));
                            if (ccItem) {
                                const parentMenu = ccItem.closest('[data-a-target="player-settings-menu"]');
                                if (parentMenu) {
                                    handleMenu(parentMenu);
                                }
                            } else if (node.tagName === 'BUTTON' && node.getAttribute('role') === 'menuitem' && node.textContent.includes('Closed Captions')) {
                                const parentMenu = node.closest('[data-a-target="player-settings-menu"]');
                                if (parentMenu) {
                                    handleMenu(parentMenu);
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function handleMenu(menu) {
        // Check if this is a submenu (lacks Quality item or has "Back to Video Player Settings" button)
        const isSubmenu = !menu.querySelector('[data-a-target="player-settings-menu-item-quality"]') ||
                          menu.querySelector('[data-test-selector="main-menu"]');
        if (isSubmenu) {
            // Remove custom-cc-container if it exists in submenu
            const existingContainer = menu.querySelector('#custom-cc-container');
            if (existingContainer) {
                existingContainer.remove();
            }
            return;
        }

        // Proceed only for main menu
        if (menu.querySelector('#custom-cc-container')) {
            return; // Already modified, skip to prevent duplication
        }

        let ccButtons = menu.querySelectorAll('button[role="menuitem"]');
        let ccItem = Array.from(ccButtons).find(btn => btn.textContent.includes('Closed Captions'));
        if (!ccItem) {
            return;
        }

        let ccContainer = ccItem.parentNode; // The wrapping div (class "Layout-sc-1xcs6mc-0 igZqfU")
        ccContainer.style.display = 'none'; // Hide original to avoid React DOM mismatch issues

        let clonedCcContainer = ccContainer.cloneNode(true); // Clone to preserve structure
        clonedCcContainer.style.display = 'block'; // Ensure visible when toggled

        // Find the cloned CC button to attach click event
        let clonedCcButton = clonedCcContainer.querySelector('button[role="menuitem"]');
        if (clonedCcButton) {
            // Trigger click on original button to invoke React event handlers
            clonedCcButton.addEventListener('click', () => {
                ccItem.click(); // Directly call click() on the original button
            });
        }

        // Create toggle button for the container
        let toggleBtn = document.createElement('button');
        toggleBtn.className = 'ScInteractableBase-sc-ofisyf-0 ScInteractableDefault-sc-ofisyf-1 CayVJ imYKMv tw-interactable';
        toggleBtn.role = 'button';
        toggleBtn.innerHTML = `
            <div class="Layout-sc-1xcs6mc-0 dCYttJ">
                <div class="Layout-sc-1xcs6mc-0 dtSdDz">Closed Captions</div>
                <div class="Layout-sc-1xcs6mc-0 cWChvM">
                    <div class="ScSvgWrapper-sc-wkgzod-0 dKXial tw-svg">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <path d="M6.5 5.5 11 10l-4.5 4.5L8 16l6-6-6-6-1.5 1.5z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        `;

        let svg = toggleBtn.querySelector('svg');
        svg.style.transition = 'transform 0.2s';
        svg.style.transform = 'rotate(0deg)'; // Starts as right arrow (collapsed)

        // Content div for the cloned CC container (hidden by default)
        let contentDiv = document.createElement('div');
        contentDiv.style.display = 'none';
        contentDiv.appendChild(clonedCcContainer);

        // Outer container
        let outerContainer = document.createElement('div');
        outerContainer.id = 'custom-cc-container';
        outerContainer.className = 'Layout-sc-1xcs6mc-0 igZqfU';
        outerContainer.appendChild(toggleBtn);
        outerContainer.appendChild(contentDiv);

        // Append to the very bottom of the main menu
        menu.appendChild(outerContainer);

        // Toggle event
        toggleBtn.addEventListener('click', () => {
            let isHidden = contentDiv.style.display === 'none';
            contentDiv.style.display = isHidden ? 'block' : 'none';
            svg.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)'; // Right to down for expanded
        });
    }
})();

