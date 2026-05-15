// rename-users-nickname/ui.js

(function () {
    const { INVISIBLE_CHAR } = window.TwitchNickRenameConstants || { INVISIBLE_CHAR: '⠀' };

    // Добавление стилей
    function addStyles() {
        if (document.getElementById('rename-nick-styles')) return;
        const styleElement = document.createElement('style');
        styleElement.id = 'rename-nick-styles';
        styleElement.textContent = `
        .custom-nickname-container .original-nickname {
            opacity: 1;
            pointer-events: auto;
            display: inline-block;
        }

        .custom-nickname-container:has(.custom-nickname) .original-nickname {
            opacity: 0;
            pointer-events: none;
        }

        .original-nickname {
            opacity: 1;
            white-space: nowrap;
            pointer-events: auto;
            display: inline-block;
            font-weight: 600;
            unicode-bidi: plaintext;
        }

        .chat-author__display-name {
            position: relative;
            display: inline-block;
            font-family: 'Roobert', sans-serif !important;
            font-weight: 600;
            unicode-bidi: plaintext;
        }

        .custom-nickname-container {
            position: relative;
            display: inline-block;
            unicode-bidi: plaintext;
            z-index: 100999;
        }

        .custom-nickname-container:has(.custom-nickname) .original-nickname {
            opacity: 0;
            pointer-events: none;
            z-index: 1;
        }
        .custom-nickname-container:has(.custom-nickname) .original-nickname {
            width: 225px;   
        }
            
        .custom-nickname-container:has(.custom-nickname) .original-nickname {
        /*   width: 100% !important; */
        }

        .custom-nickname { 
            position: absolute;
            top: 0;
            left: 0;
            opacity: 1 !important;
            color: inherit;
            pointer-events: none;
            z-index: 1;
            white-space: nowrap;
            overflow: visible;
            font-family: inherit;
            font-weight: 600;
            unicode-bidi: plaintext;
        }

        .custom-nickname-container:hover::after {
            width: 115px !important;
            content: attr(data-original-username);
            position: absolute;
            bottom: 100%;
            left: 33px;
            white-space: normal;
            background: rgb(51, 87, 75);
            color: rgb(69, 184, 178);
            font-size: 16px;
            padding: 2px 8px;
            border-radius: 4px;
            border: 2px solid rgb(69, 184, 178);
            margin-bottom: 5px;
            z-index: 500100 !important;
            word-break: break-word;
            display: flex;
            justify-content: space-around;
            unicode-bidi: plaintext;
        }

        .viewer-card-header__display-name {
            display: inline-block;
            font-family: 'Roobert', sans-serif !important;
            unicode-bidi: plaintext;
        }

        .viewer-card-header__display-name .custom-nickname-profile {
            font-size: 14px;
            color: rgb(43, 255, 0);
            font-weight: 500;
            margin-top: 2px;
            white-space: nowrap;
            overflow: visible;
            unicode-bidi: plaintext;
        }

        .viewer-card-header__display-name .custom-nickname-profile::before {
            content: '(';
        }

        .viewer-card-header__display-name .custom-nickname-profile::after {
            content: ')';
        }

        .chat-line__message--badges {
            left: 8px !important;
        }
      `;
        document.head.appendChild(styleElement);

        // Добавление стилей в iframe'ы
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc && !iframeDoc.getElementById('rename-nick-styles')) {
                    const iframeStyle = iframeDoc.createElement('style');
                    iframeStyle.id = 'rename-nick-styles';
                    iframeStyle.textContent = styleElement.textContent;
                    iframeDoc.head.appendChild(iframeStyle);
                }
            } catch (e) {
                console.log('[_Rename_twitch_Nick_names_] Failed to add styles to iframe:', e);
            }
        });

        console.log('[_Rename_twitch_Nick_names_] CSS applied');
    }

    // Добавление кнопки редактирования никнейма
    function addNicknameEditButton(instance) {
        const usernameContainer = document.querySelector('.viewer-card-header__display-name');
        if (!usernameContainer) return;

        const usernameElement = usernameContainer.querySelector('.CoreText-sc-1txzju1-0 a');
        if (!usernameElement) return;

        const displayName = usernameElement.textContent?.trim();
        if (!displayName) return;

        const loginElement = document.querySelector('.viewer-card__name .tw-login');
        const login = loginElement?.textContent?.replace(/[()]/g, '').trim() || '';
        const originalUsername = login && login !== displayName
            ? window.normalizeUsername(`${displayName} (${login})`)
            : window.normalizeUsername(displayName);

        // Очистка и применение кастомного никнейма в профиле
        const existingCustomNick = usernameContainer.querySelector('.custom-nickname-profile');
        if (existingCustomNick) existingCustomNick.remove();
        if (instance.renamedUsersCache[originalUsername]) {
            const customNickSpan = document.createElement('span');
            customNickSpan.className = 'custom-nickname-profile';
            customNickSpan.textContent = instance.renamedUsersCache[originalUsername];
            usernameContainer.appendChild(customNickSpan);
        }

    let buttonsContainer = document.querySelector('button[aria-label^="Follow"], button[data-a-target="follow-button"]')?.closest('.Layout-sc-1xcs6mc-0.gPVkpw')?.parentElement;
if (!buttonsContainer) {
    buttonsContainer = document.querySelector('button[data-a-target="usercard-whisper-button"]')?.closest('.Layout-sc-1xcs6mc-0.gPVkpw')?.parentElement;
}
if (!buttonsContainer) {
    // Для своего профиля
    buttonsContainer = document.querySelector('.viewer-card .Layout-sc-1xcs6mc-0.dCHPUH .viewer-card-drag-cancel');
}
if (!buttonsContainer || buttonsContainer.querySelector('.rename-nick-button')) {
    return;
}

        const editContainer = document.createElement('div');
        editContainer.className = 'Layout-sc-1xcs6mc-0 gPVkpw';
        editContainer.innerHTML = '<div class="InjectLayout-sc-1i43xsx-0 iDMNUO viewer-card-drag-cancel"></div>';
        const buttonWrapper = editContainer.querySelector('.InjectLayout-sc-1i43xsx-0');

        const editButton = document.createElement('button');
        editButton.innerHTML = '✏️';
        editButton.className = 'rename-nick-button ScCoreButton-sc-ocjdkq-0 kJMgAB';
        editButton.style.cssText = 'cursor:pointer;background:none;border:none;font-size:16px;';
        editButton.setAttribute('aria-label', 'Edit nickname');

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.style.display = 'none';
        inputField.style.marginLeft = '8px';
        inputField.placeholder = 'Введите новый ник';
        inputField.className = 'rename-nick-input';

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '🗑️';
        deleteButton.className = 'delete-nick-button ScCoreButton-sc-ocjdkq-0 kJMgAB';
        deleteButton.style.cssText = 'cursor:pointer;background:none;border:none;font-size:16px;margin-left:4px;display:' + (instance.renamedUsersCache[originalUsername] ? 'inline-block' : 'none');
        deleteButton.setAttribute('aria-label', 'Reset nickname');

        buttonWrapper.appendChild(editButton);
        buttonWrapper.appendChild(inputField);
        buttonWrapper.appendChild(deleteButton);
        buttonsContainer.appendChild(editContainer);

        editButton.addEventListener('click', () => {
            inputField.style.display = 'inline-block';
            inputField.value = instance.renamedUsersCache[originalUsername] || '';
            inputField.focus();
        });

        inputField.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                let newNickname = inputField.value.trim().replace(/[<>"';&]/g, '');
                if (!newNickname || newNickname.match(/^\s*$/) || newNickname.length > 50) {
                    inputField.style.display = 'none';
                    inputField.value = '';
                    return;
                }
                const existingUser = Object.keys(instance.renamedUsersCache).find(key => instance.renamedUsersCache[key] === newNickname && key !== originalUsername);
                if (existingUser) {
                    inputField.style.display = 'none';
                    inputField.value = '';
                    return;
                }
                instance.renamedUsersCache[originalUsername] = newNickname;
                await instance.setStorage('renamedTwitchUsers', instance.renamedUsersCache);

                const existingCustomNick = usernameContainer.querySelector('.custom-nickname-profile');
                if (existingCustomNick) existingCustomNick.remove();
                const customNickSpan = document.createElement('span');
                customNickSpan.className = 'custom-nickname-profile';
                customNickSpan.textContent = newNickname;
                usernameContainer.appendChild(customNickSpan);
                deleteButton.style.display = 'inline-block';

                await instance.updateChatNicknamesForUser(originalUsername, document, true);
                inputField.style.display = 'none';
                inputField.value = '';
            }
        });

        inputField.addEventListener('blur', () => {
            inputField.style.display = 'none';
            inputField.value = '';
        });

        deleteButton.addEventListener('click', async () => {
            if (instance.renamedUsersCache[originalUsername]) {
                delete instance.renamedUsersCache[originalUsername];
                await instance.setStorage('renamedTwitchUsers', instance.renamedUsersCache);
                const existingCustomNick = usernameContainer.querySelector('.custom-nickname-profile');
                if (existingCustomNick) existingCustomNick.remove();
                deleteButton.style.display = 'none';
                await instance.updateChatNicknamesForUser(originalUsername, document, true);
            }
        });
    }

    // Наблюдатель за viewer-card
    function startViewerCardObserver(instance) {
        const viewerCardObserver = new MutationObserver(() => {
            const viewerCard = document.querySelector('.viewer-card');
            if (viewerCard && !viewerCard.dataset.editButtonAdded) {
                viewerCard.dataset.editButtonAdded = 'true';
                addNicknameEditButton(instance);
                setTimeout(() => {
                    if (!document.querySelector('.rename-nick-button')) {
                        addNicknameEditButton(instance);
                    }
                }, 500);
            }
        });
        viewerCardObserver.observe(document.body, { childList: true, subtree: true });
    }

    window.TwitchNickRenameUI = {
        addStyles,
        startViewerCardObserver
    };
})();