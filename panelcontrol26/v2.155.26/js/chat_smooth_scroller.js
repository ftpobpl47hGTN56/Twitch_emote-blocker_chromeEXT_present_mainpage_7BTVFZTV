
// ==UserScript==
// @name         chat_smooth_scroller
// @namespace    smooth-chat-scroller
// @version      0.505.26
// @match        https://www.twitch.tv/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==


(function () {
    'use strict';

    const SPEEDS = [
      { label: 'Off',    factor: 0     },
            { label: 'Slow',   factor: 0.04  },
            { label: 'Medium', factor: 0.09  },
            { label: 'Fast',   factor: 0.45  },
    ];

    const CONNECTING_TEXT = 'Connecting to Chat';
    const STORAGE_KEY = 'scs_speed_idx';
    const SCROLL_SEL  = '.scrollable-area[data-a-target="chat-scroller"]';
    const OBSERVE_SEL = '.chat-scrollable-area__message-container';
    const FOOTER_SEL  = '[data-a-target="chat-list-footer"]';

    let currentSpeed = parseInt(localStorage.getItem(STORAGE_KEY) ?? '2', 10);
    let scroller     = null;
    let chatObserver = null;
    let initTimer    = null;

    // ── LERP скроллер ────────────────────────────────────────────
    class SmoothScroller {
        constructor(el) {
            this.el      = el;
            this.current = el.scrollTop;
            this.rafId   = null;
        }
        scrollDown() {
            const factor = SPEEDS[currentSpeed].factor;
            if (factor === 0) { this.el.scrollTop = this.el.scrollHeight; return; }
            if (!this.rafId) this.current = this.el.scrollTop;
            if (this.rafId) cancelAnimationFrame(this.rafId);
            this._loop(factor);
        }
        _loop(factor) {
            const target = this.el.scrollHeight - this.el.clientHeight;
            const delta  = target - this.current;
            if (Math.abs(delta) > 0.5) {
                this.current += delta * factor;
                this.el.scrollTop = this.current;
                this.rafId = requestAnimationFrame(() => this._loop(factor));
            } else {
                this.el.scrollTop = target;
                this.current      = target;
                this.rafId        = null;
            }
        }
        destroy() {
            if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
        }
    }

    // ── Чат init ─────────────────────────────────────────────────
    function initChat() {
        const scrollEl  = document.querySelector(SCROLL_SEL);
        const observeEl = document.querySelector(OBSERVE_SEL);
        if (!scrollEl || !observeEl) return false;
        cleanupChat();
        scroller = new SmoothScroller(scrollEl);
        chatObserver = new MutationObserver(() => {
            const isPaused = !!document.querySelector(FOOTER_SEL);
            const bottom   = scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight;
            if (!isPaused && bottom < 150) scroller.scrollDown();
        });
        chatObserver.observe(observeEl, { childList: true });
        return true;
    }

    function cleanupChat() {
        chatObserver?.disconnect(); chatObserver = null;
        scroller?.destroy();       scroller = null;
    }

    function waitForChat() {
        if (initChat()) return;
        const bo = new MutationObserver(() => { if (initChat()) bo.disconnect(); });
        bo.observe(document.body, { childList: true, subtree: true });
    }

    // ── SPA навигация ─────────────────────────────────────────────
     // ── SPA навигация через "Connecting to Chat" ──────────────────
    // Убираем pushState/replaceState — они ненадёжны
    // Вместо этого наблюдаем за статус-сообщением в чате

     
    const navObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!(node instanceof Element)) continue;

                // Ищем текст "Connecting to Chat" в добавленном узле
                const text = node.textContent || '';
                if (text.includes(CONNECTING_TEXT)) {
                    console.log('[SCS] Connecting to Chat detected → reinit');
                    cleanupChat();
                    clearTimeout(initTimer);
                    // Ждём пока чат полностью загрузится после подключения
                    initTimer = setTimeout(waitForChat, 1200);
                    return;
                }
            }
        }
    });

    // Наблюдаем за областью чата (не за всем body — дешевле)
    function startNavObserver() {
        const chatRoot = document.querySelector('.chat-room__content')
                      || document.querySelector('[data-a-target="chat-scroller"]')
                      || document.body;

        navObserver.observe(chatRoot, {
            childList: true,
            subtree:   true,
        });
    }

    // Запускаем сразу, и переподключаем если chatRoot появился позже
    if (document.body) {
        startNavObserver();
    } else {
        document.addEventListener('DOMContentLoaded', startNavObserver);
    }

    // ── CSS для строки в попавере ─────────────────────────────────
    function injectCSS() {
        if (document.getElementById('scs-style')) return;
        const s = document.createElement('style');
        s.id = 'scs-style';
        s.textContent = `
            #scs-popover-row {
                position: relative;
                color: #75e79b;
                border: 1px solid #ffe27f;;
                border-radius: 5px;
            }
            #scs-popover-row .scs-row-btn {
                display: flex;
                align-items: center;
                width: 100%;
                padding: 8px 10px;
                background: rgb(14 21 26);
                border: 1px solid #7fffd4;;
                border-radius: 5px;
                cursor: pointer;
                color: inherit;
                font: inherit;
            }
            #scs-popover-row .scs-row-btn:hover {
                background: rgb(14 21 26);
                 border: 1px solid #7fffd4;;
            }
            #scs-popover-row .scs-row-label {

                flex: 1;
                text-align: left;
                font-size: 13px;
            }
            #scs-popover-row .scs-row-val {

                font-size: 13px;
                color: #edb663;
                font-weight: 600;
                margin-right: 6px;
            }
            #scs-popover-row .scs-row-arrow {
                font-size: 10px;
                opacity: .5;
                transition: transform .15s;
            }
            #scs-popover-row.open .scs-row-arrow {
                transform: rotate(180deg);
            }
            #scs-dropdown {
                display: none;
                padding: 4px 0;
                border-top: 1px solid rgba(255,255,255,.08);
            }
            #scs-popover-row.open #scs-dropdown {
                display: block;
                  color: #dcac66; font-weight: 700;
                 background: rgb(26 17 38);
                 border: 1px solid #7fffd4;;
            }
            .scs-opt {
                padding: 7px 16px;
                cursor: pointer;
                font-size: 12px;
                transition: background .1s;
            }
            .scs-opt:hover  { 
                background: rgba(255,255,255,.07);
             }
            .scs-opt.active {
                color: #dcac66; font-weight: 700;
                 background: rgb(7 50 36);
                 border: 1px solid #7fffd4;;
                   border: 1px solid #7fffd4;;
                border-radius: 15px;
             }
        `;
        document.head.appendChild(s);
    }

    // ── Строка для инжекта в попавер ──────────────────────────────
    function buildRow() {
        const row = document.createElement('div');
        row.id = 'scs-popover-row';
        // Оборачиваем в нативный Twitch-класс для единообразия
        row.className = 'Layout-sc-1xcs6mc-0 igZqfU';

        row.innerHTML = `
            <button class="scs-row-btn">
                <span class="scs-row-label">Smooth Scroll</span>
                <span class="scs-row-val" id="scs-row-cur">${SPEEDS[currentSpeed].label}</span>
                <span class="scs-row-arrow">▼</span>
            </button>
            <div id="scs-dropdown">
                ${SPEEDS.map((s, i) => `
                    <div class="scs-opt${i === currentSpeed ? ' active' : ''}" data-idx="${i}">
                        ${s.label}
                    </div>
                `).join('')}
            </div>
        `;

        // Открыть/закрыть дропдаун
        row.querySelector('.scs-row-btn').addEventListener('click', e => {
            e.stopPropagation();
            row.classList.toggle('open');
        });

        // Выбор скорости
        row.querySelectorAll('.scs-opt').forEach(opt => {
            opt.addEventListener('click', e => {
                e.stopPropagation();
                currentSpeed = parseInt(opt.dataset.idx, 10);
                localStorage.setItem(STORAGE_KEY, currentSpeed);

                // Обновить UI
                document.getElementById('scs-row-cur').textContent = SPEEDS[currentSpeed].label;
                row.querySelectorAll('.scs-opt').forEach((o, i) => {
                    o.classList.toggle('active', i === currentSpeed);
                });
                row.classList.remove('open');
            });
        });

        return row;
    }

    // ── Инжект в попавер Chat Settings ────────────────────────────
    function tryInjectIntoPopover(popover) {
        // Уже вставлено
        if (popover.querySelector('#scs-popover-row')) return;

        const content = popover.querySelector('.chat-settings__content');
        if (!content) return;

        injectCSS();

        // Вставляем первым пунктом внутри content
        content.insertBefore(buildRow(), content.firstChild);
    }

    // Следим за появлением попавера в DOM
    const popoverObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!(node instanceof Element)) continue;

                // Сам попавер
                if (node.matches?.('.chat-settings__popover')) {
                    tryInjectIntoPopover(node);
                }
                // Или внутри добавленного узла
                const inner = node.querySelector?.('.chat-settings__popover');
                if (inner) tryInjectIntoPopover(inner);
            }
        }
    });

    popoverObserver.observe(document.body, { childList: true, subtree: true });

    // Если попавер уже открыт при загрузке страницы
    const existing = document.querySelector('.chat-settings__popover');
    if (existing) { injectCSS(); tryInjectIntoPopover(existing); }

    // ── Старт ─────────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForChat);
    } else {
        waitForChat();
    }

})();