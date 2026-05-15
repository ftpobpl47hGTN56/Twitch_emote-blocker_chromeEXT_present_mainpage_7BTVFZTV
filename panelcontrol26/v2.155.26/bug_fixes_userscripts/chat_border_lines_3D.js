// ==UserScript==
// @name         Chat border lines 3D 
// @version      2025-10-25 
// @author       j84jhje994e9
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @run-at       document-idle
// ==/UserScript==

(function () {
 // ====================================================================== //
 // ===========          Настройки (цвета можно менять прямо здесь)
 // ====================================================================== //
    let currentStyleClass = 'chat-line-mssg-x768x4g-style--none'; // ==== По умолчанию

    const baseCSS = `
 .chat-line-mssg-x768x4g-style--none {
       background: none !important; 
       border: none !important; 
       box-shadow:none !important; 
       border-radius:0 !important; 
    }
.chat-line-mssg-x768x4g-style--basic {
    position: relative !important;
    border-radius: 0 !important;
    background: none !important;
    box-shadow: none !important; 
    border-top: 2px solid rgb(105,105,105) !important;
    border-bottom: 2px solid rgb(105,105,105) !important;
    border-left: 1px solid transparent !important;
    border-right: 1px solid transparent !important;
  }
    /* 3D Outset: сверху светлая полоса, снизу тёмная */
    .chat-line-mssg-x768x4g-style--3d-outset {
        position: relative !important; 
       border-radius:0 !important; 
       background: linear-gradient(rgb(254 254 254 / 8%), rgb(249 249 249 / 9%)) !important; 
       will-change: background;
   }
    .chat-line-mssg-x768x4g-style--3d-outset::before {
        content:"" !important; 
       position:absolute !important; 
       left:0 !important; 
       right:0 !important; 
       top:0 !important; 
       height:2px !important; 
       background: rgb(206 206 206 / 55%) !important; 
       pointer-events:none !important; 
       will-change: transform;
   }
    .chat-line-mssg-x768x4g-style--3d-outset::after  {
        content:"" !important; 
       position:absolute !important; 
       left:0 !important; 
       right:0 !important; 
       bottom:0 !important; 
       height:2px !important; 
       background: rgb(4 11 9) !important; 
       pointer-events:none !important; 
       will-change: transform;
    }

    /* 3D Inset: сверху тёмная полоса, снизу светлая */
    .chat-line-mssg-x768x4g-style--3d-inset {
        position: relative !important; 
       border-radius:0 !important; 
       background: linear-gradient(rgb(254 254 254 / 5%), rgb(254 254 254 / 8%)) !important;  
       will-change: background;
    }
    .chat-line-mssg-x768x4g-style--3d-inset::before {
        content:"" !important; 
       position:absolute !important; 
       left:0 !important; 
       right:0 !important; 
       top:0 !important; 
       height:2px !important; 
       background: rgb(5 5 5) !important; 
       pointer-events:none !important; 
       will-change: transform;
   }
    .chat-line-mssg-x768x4g-style--3d-inset::after  {
       content:"" !important; 
       position:absolute !important; 
       left:0 !important; 
       right:0 !important; 
       bottom:0 !important; 
       height:2px !important; 
       background: rgb(255 255 255 / 36%) !important; 
       pointer-events:none !important; 
       will-change: transform;
}

    /* Wide Line: только нижняя белая полоса (сверху/по бокам нет) */
    .chat-line-mssg-x768x4g-style--wide-bottom { 
       border-radius:1px !important; 
       background:none !important; 
   }
    .chat-line-mssg-x768x4g-style--wide-bottom::after {
       content:"" !important; 
       position:absolute !important; 
       left:0 !important; 
       right:0 !important; 
       bottom:0 !important; 
       height:2px !important; 
       background: #7b7b7b !important; 
       pointer-events:none !important; 
       will-change: transform;
    }
 select#selectModeborderlinesxXpcFe4ntdf5ed {
       background: #0e1a1a  !important; 
       color: #7fffd4  !important; 
       border: 2px #7fffd4 solid  !important; 
       border-radius: 8px   !important; 
       padding: 10px 8px !important;
       font-size: 17px !important;
}
 #chat-line-mssg-x768x4g-style-section {
      background: #0e151a !important;
      border: 2px solid #00655b !important;
      border-radius: 6px !important;
      color: #9dbdba !important;
      font-size: 15px !important; 
}
 #message-limit-j6rtk6rur5-section {
     background: #0e151a !important;
      border: 2px solid #00655b !important;
      border-radius: 6px !important;
      color: #9dbdba !important;
      font-size: 15px !important; 
}

input#message-h5j6rj6rmij6rjr5r-limit-input {
    padding: 8px 8px !important;
    color: #96cbc6 !important;
    background: #173737 !important;
    border-width: 2px !important;
    border-style: solid !important;
    border-color: #4faea4 !important;
    border-image: initial !important;
    border-radius: 6px !important;
    font-size: 15px !important;
}

 /*------------------ чтобы нижняя часть не перекрывалась линией смайлов ------------------*/
img.chat-image.chat-line__message--emote.ffz--pointer-events.ffz-tooltip.ffz-emote {
    z-index: 100000 !important;
} 


 
     `;

 // ====================================================================== //
 // ===========               Список вариантов (имя + css-класс)
 // ====================================================================== //
    const lineStyles = [
        { name: 'Disabled (No Lines)', className: 'chat-line-mssg-x768x4g-style--none' },
        { name: 'Basic Line (1px Solid)', className: 'chat-line-mssg-x768x4g-style--basic' },
        { name: '3D Line (2px Outset)', className: 'chat-line-mssg-x768x4g-style--3d-outset' },
        { name: '3D Line (2px Inset)', className: 'chat-line-mssg-x768x4g-style--3d-inset' },
        { name: 'Wide Line (2px Solid, Bottom Only)', className: 'chat-line-mssg-x768x4g-style--wide-bottom' }
    ];

 // ====================================================================== //
 // ===========             Внедряем CSS (если ещё не внедрён)
 // ====================================================================== //
    function injectCSS() {
        if (document.getElementById('chat-line-mssg-x768x4g-styles-injected')) return;
        const style = document.createElement('style');
        style.id = 'chat-line-mssg-x768x4g-styles-injected';
        style.textContent = baseCSS;
        document.head.appendChild(style);
    }

 // ====================================================================== //
 // ===========           Динамический CSS для чередования (nth-child)
 // ====================================================================== //
    function updateDynamicCSS(className) {
        const dynamicStyle = document.getElementById('chat-line-dynamic-styles');
        if (dynamicStyle) dynamicStyle.remove();

        const style = document.createElement('style');
        style.id = 'chat-line-dynamic-styles';
     // ===========  Чередование: odd — стиль, even — none (адаптировано под вставку в начало)
        style.textContent = `
            .chat-scrollable-area__message-container > div:nth-child(odd) .chat-line__message,
            [data-test-selector="chat-messages"] > div:nth-child(odd) .chat-line__message,
            ul.InjectLayout-sc-1i43xsx-0.kvgXPf > div:nth-child(odd) .chat-line__message,
            .chat-line:nth-child(odd) .chat-line__message {
                ${getClassStyles(className)}
            }
            .chat-scrollable-area__message-container > div:nth-child(even) .chat-line__message,
            [data-test-selector="chat-messages"] > div:nth-child(even) .chat-line__message,
            ul.InjectLayout-sc-1i43xsx-0.kvgXPf > div:nth-child(even) .chat-line__message,
            .chat-line:nth-child(even) .chat-line__message {
                ${getClassStyles('chat-line-mssg-x768x4g-style--none')}
            }
        `;
        document.head.appendChild(style);
    }

 // ===========  Извлекаем стили класса как текст (для встраивания в CSS)
    function getClassStyles(className) {
    const tempDiv = document.createElement('div');
    tempDiv.className = className;
    document.body.appendChild(tempDiv);
    const styles = window.getComputedStyle(tempDiv);
    let cssText = `
        background: ${styles.background} !important;
        border: ${styles.border} !important;
        box-shadow: ${styles.boxShadow} !important;
        border-radius: ${styles.borderRadius} !important;
    `;
    if (className !== 'chat-line-mssg-x768x4g-style--none') {
        cssText += `position: relative !important;`;
    }
 // ===========  Добавляем ::before и ::after если нужно (для 3D и wide) — оставьте как есть, но если getComputedStyle для псевдо не срабатывает стабильно, вернитесь к прямому встраиванию из baseCSS
    document.body.removeChild(tempDiv);
    return cssText;
}

 // ===========  Fallback: очистка старых классов (если CSS не сработал)
    function clearOurStyleClasses(el) {
        Array.from(el.classList).forEach(cl => {
            if (cl.startsWith('chat-line-mssg-x768x4g-style--')) el.classList.remove(cl);
        });
        el.style.border = '';
        el.style.background = '';
        el.style.boxShadow = '';
        el.style.borderRadius = '';
    }

 // ===========  Применение только к новым (fallback)
    function applyStyleToNewMessages(newMessages, className) {
        newMessages.forEach((msg, localIndex) => {
            clearOurStyleClasses(msg);
            if (localIndex % 2 === 0) {
                msg.classList.add(className);
            } else {
                msg.classList.add('chat-line-mssg-x768x4g-style--none');
            }
        });
    }

 // ====================================================================== //
 // ===========           Применение сохранённого стиля
 // ====================================================================== //
    function applySavedStyle() {
        const saved = localStorage.getItem('chatLineStyleIndex');
        const savedIdx = saved ? Number(saved) : 0;
        currentStyleClass = (!isNaN(savedIdx) && lineStyles[savedIdx]) ? lineStyles[savedIdx].className : lineStyles[0].className;
        updateDynamicCSS(currentStyleClass);
     // ===========  Fallback: применить классы ко всем для инициализации
        const messages = document.querySelectorAll('.chat-line__message, .vod-message');
        messages.forEach((msg, index) => {
            clearOurStyleClasses(msg);
            if (index % 2 === 0) {
                msg.classList.add(currentStyleClass);
            } else {
                msg.classList.add('chat-line-mssg-x768x4g-style--none');
            }
        });
    }

 // ====================================================================== //
 // ===========           Создание селекта в настройках
 // ====================================================================== //
    function createLineStyleSelector() {
        const settingsContent = document.querySelector('.chat-settings__content');
        if (!settingsContent) return;

        const myPrefsHeader = settingsContent.querySelector('.Layout-sc-1xcs6mc-0.gpiLEA p.CoreText-sc-1txzju1-0.yIWOC');
        if (!myPrefsHeader || myPrefsHeader.textContent.trim() !== 'My Preferences') return;

        if (settingsContent.querySelector('#chat-line-mssg-x768x4g-style-section')) return;

        const section = document.createElement('div');
        section.className = 'Layout-sc-1xcs6mc-0 igZqfU';
        section.id = 'chat-line-mssg-x768x4g-style-section';

        const button = document.createElement('button');
        button.className = 'ScInteractableBase-sc-ofisyf-0 ScInteractableDefault-sc-ofisyf-1 CayVJ imYKMv tw-interactable';
        button.setAttribute('data-a-target', 'line-style-selector');

        const buttonContent = document.createElement('div');
        buttonContent.className = 'Layout-sc-1xcs6mc-0 dCYttJ';
        const buttonText = document.createElement('div');
        buttonText.className = 'Layout-sc-1xcs6mc-0 dtSdDz';
        buttonText.textContent = 'Chat Line Style';
        const buttonArrow = document.createElement('div');
        buttonArrow.className = 'Layout-sc-1xcs6mc-0 cWChvM';
        buttonArrow.innerHTML = `<div class="ScSvgWrapper-sc-wkgzod-0 dKXial tw-svg"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M6.5 5.5 11 10l-4.5 4.5L8 16l6-6-6-6-1.5 1.5z"></path></svg></div>`;

        buttonContent.appendChild(buttonText);
        buttonContent.appendChild(buttonArrow);
        button.appendChild(buttonContent);

        const dropdown = document.createElement('div');
        dropdown.id = 'line-style-dropdown';
        dropdown.style.display = 'none';
        dropdown.style.padding = '8px';

        const select = document.createElement('select');
        select.id = 'selectModeborderlinesxXpcFe4ntdf5ed';
        select.style.width = '100%';
        select.style.padding = '4px';
        select.style.marginTop = '4px';

        lineStyles.forEach((s, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = s.name;
            select.appendChild(opt);
        });

        const saved = localStorage.getItem('chatLineStyleIndex');
        const savedIdx = saved ? Number(saved) : 0;
        if (!isNaN(savedIdx) && lineStyles[savedIdx]) {
            select.value = savedIdx;
        }

        select.addEventListener('change', (e) => {
            const idx = Number(e.target.value);
            currentStyleClass = lineStyles[idx].className;
            updateDynamicCSS(currentStyleClass);
            localStorage.setItem('chatLineStyleIndex', String(idx));
         // ===========  Fallback: переприменить только если нужно (редко)
            applyStyleToNewMessages(document.querySelectorAll('.chat-line__message, .vod-message'), currentStyleClass);
        });

        dropdown.appendChild(select);
        section.appendChild(button);
        section.appendChild(dropdown);

        const headerContainer = settingsContent.querySelector('.Layout-sc-1xcs6mc-0.gpiLEA');
        if (headerContainer) {
            headerContainer.insertAdjacentElement('afterend', section);
        } else {
            settingsContent.appendChild(section);
        }

        button.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });
    }

 // ====================================================================== //
 // ===========           Функция дебаунс
 // ====================================================================== //
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

 // ====================================================================== //
 // ===========                      Observers и init
 // ====================================================================== //
    function setupSettingsObserver() {
        const debouncedCreate = debounce(createLineStyleSelector, 100);
        const observer = new MutationObserver(() => {
            const settingsContent = document.querySelector('.chat-settings__content');
            if (settingsContent) {
                debouncedCreate();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    let applyTimeout = null;

    function setupChatObserver() {
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container, [data-test-selector="chat-messages"], ul.InjectLayout-sc-1i43xsx-0.kvgXPf') || document.body;
        const observer = new MutationObserver((mutations) => {
            const newMessagesSet = new Set();
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches && node.matches('.chat-line__message, .vod-message')) {
                            newMessagesSet.add(node);
                        } else {
                            const children = node.querySelectorAll('.chat-line__message, .vod-message');
                            children.forEach(child => newMessagesSet.add(child));
                        }
                    }
                });
            });

            if (newMessagesSet.size > 0) {
                clearTimeout(applyTimeout);
                applyTimeout = setTimeout(() => {
                 // ===========  CSS nth-child уже обработает, но fallback для новых
                    const newArray = Array.from(newMessagesSet);
                    applyStyleToNewMessages(newArray, currentStyleClass);
                }, 100);
            }
        });
        observer.observe(chatContainer, { childList: true, subtree: true });
    }

    function init() {
        injectCSS();
        applySavedStyle(); // ==== Инициализация
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setupSettingsObserver();
            setupChatObserver();
            createLineStyleSelector();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                setupSettingsObserver();
                setupChatObserver();
                createLineStyleSelector();
            });
        }
    }

    init();
})();