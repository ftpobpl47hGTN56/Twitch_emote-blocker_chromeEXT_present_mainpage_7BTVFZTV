// ==UserScript==
// @name         Slate_reset_input_type_delete_text.js
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Прогрев Slate: вставка символов → полная очистка. Триггер на "Connecting to Chat" и смену канала.
// @author       gullampis810 (fix v2)
// @match        https://www.twitch.tv/*
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // ─── Настройки ────────────────────────────────────────────────────────────
    const CYCLES_COUNT    = 8;          // кол-во циклов
    const CHAR_SEQUENCE   = [' ', ' ']; // символы за один цикл
    const CYCLE_DELAY     = 100;        // мс между циклами
    const CHAR_DELAY      = 10;         // мс между событиями внутри simulateTypeChar
    const CLEANUP_DELAY   = 300;        // мс после последнего цикла → перед очисткой
    const INIT_DELAY      = 800;        // мс после load / навигации
    const RECONNECT_DELAY = 1500;       // мс после "Connecting to Chat"
    const POLL_INTERVAL   = 400;        // мс между попытками найти инпут
    const POLL_MAX_TRIES  = 30;

    let warmupInitialized = false;
    let lastPathname      = location.pathname;

    // ─── Получение инпута ─────────────────────────────────────────────────────
    function getInputField() {
        const input = document.querySelector('[data-a-target="chat-input"]');
        if (!input) return null;
        return {
            input,
            isTextarea: input.tagName === 'TEXTAREA',
            isSlate:    input.getAttribute('data-slate-editor') === 'true',
        };
    }

    // ─── Курсор в конец ───────────────────────────────────────────────────────
    function moveCursorToEnd(field) {
        field.input.focus();
        if (field.isTextarea) {
            const len = field.input.value.length;
            field.input.setSelectionRange(len, len);
        } else {
            const sel  = window.getSelection();
            const last = field.input.childNodes[field.input.childNodes.length - 1];
            const range = document.createRange();
            if (last) {
                range.selectNodeContents(last);
                range.collapse(false);
            } else {
                range.setStart(field.input, 0);
                range.collapse(true);
            }
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    // ─── Очистка (оригинальная логика + задержка для Slate) ───────────────────
    function deleteAllText(field) {
        field.input.focus();

        if (field.isTextarea) {
            field.input.value = '';
            field.input.dispatchEvent(new Event('input',  { bubbles: true }));
            field.input.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            // Шаг 1: выделяем всё через Selection API
            const sel = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(field.input);
            sel.removeAllRanges();
            sel.addRange(range);

            // Шаг 2: удаляем через execCommand (Slate его обрабатывает)
            document.execCommand('delete', false, null);

            // Шаг 3: если что-то осталось — форс-очистка содержимого
            setTimeout(() => {
                const remaining = field.input.textContent.replace(/\uFEFF/g, '').trim();
                if (remaining !== '') {
                    const range2 = document.createRange();
                    range2.selectNodeContents(field.input);
                    range2.deleteContents();
                }
                field.input.dispatchEvent(new InputEvent('input', {
                    inputType: 'deleteContentBackward',
                    bubbles:   true,
                }));
                moveCursorToEnd(field);
                console.log('[SlateWarmup:Delete] Очистка завершена.');
            }, 80);
        }

        moveCursorToEnd(field);
    }

    // ─── Симуляция ввода одного символа (оригинальная механика) ──────────────
    function simulateTypeChar(char, field) {
        const keyInfo = char === ' '
            ? { key: ' ', code: 'Space', keyCode: 32, which: 32 }
            : { key: char, code: `Key${char.toUpperCase()}`, keyCode: char.charCodeAt(0), which: char.charCodeAt(0) };

        const events = [
            { type: 'keydown',   ...keyInfo },
            { type: 'keypress',  ...keyInfo },
            { type: 'input',     inputType: 'insertText', data: char },
            { type: 'keyup',     ...keyInfo },
        ];

        let delay = 0;
        events.forEach((evData) => {
            setTimeout(() => {
                let evt;
                if (evData.type === 'input') {
                    evt = new InputEvent('input', {
                        bubbles:    true,
                        cancelable: true,
                        inputType:  'insertText',
                        data:        char,
                    });
                } else {
                    evt = new KeyboardEvent(evData.type, {
                        bubbles:    true,
                        cancelable: true,
                        key:        evData.key,
                        code:       evData.code,
                        keyCode:    evData.keyCode,
                        which:      evData.which,
                    });
                }
                field.input.dispatchEvent(evt);

                // Физическая вставка символа (только на событии input)
                if (evData.type === 'input') {
                    if (field.isTextarea) {
                        field.input.value += char;
                        field.input.dispatchEvent(new Event('input', { bubbles: true }));
                    } else {
                        const sel = window.getSelection();
                        if (sel.rangeCount > 0) {
                            const range    = sel.getRangeAt(0);
                            const textNode = document.createTextNode(char);
                            range.insertNode(textNode);
                            range.setStartAfter(textNode);
                            range.setEndAfter(textNode);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }
                }
            }, delay);
            delay += CHAR_DELAY;
        });

        setTimeout(() => moveCursorToEnd(field), delay + 5);

        return delay + 5; // возвращаем время завершения
    }

    // ─── Основной прогрев ─────────────────────────────────────────────────────
    function triggerSlateWarmup() {
        if (warmupInitialized) {
            console.log('[SlateWarmup] Уже запущен, пропуск.');
            return;
        }

        const field = getInputField();
        if (!field) {
            console.log('[SlateWarmup] Инпут не найден, повтор...');
            setTimeout(triggerSlateWarmup, POLL_INTERVAL);
            return;
        }

        warmupInitialized = true;
        console.log(`[SlateWarmup] Старт: ${CYCLES_COUNT} цикл(а/ов).`);

        let currentCycle = 0;

        function runCycle() {
            if (currentCycle >= CYCLES_COUNT) {
                // ── Все циклы завершены → очищаем инпут ──
                setTimeout(() => {
                    deleteAllText(field);
                    console.log('[SlateWarmup] Все циклы завершены, поле очищено.');
                }, CLEANUP_DELAY);
                return;
            }

            currentCycle++;
            console.log(`[SlateWarmup] Цикл ${currentCycle}/${CYCLES_COUNT}`);

            field.input.focus();
            field.input.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            let seqDelay = 0;
            CHAR_SEQUENCE.forEach((char) => {
                seqDelay += 100;
                setTimeout(() => simulateTypeChar(char, field), seqDelay);
            });

            // Следующий цикл — без очистки между ними
            setTimeout(runCycle, seqDelay + CYCLE_DELAY);
        }

        runCycle();
    }

    // ─── Polling с лимитом ────────────────────────────────────────────────────
    function scheduleWarmup(delayMs) {
        setTimeout(() => {
            let tries = 0;
            const timer = setInterval(() => {
                if (getInputField()) {
                    clearInterval(timer);
                    triggerSlateWarmup();
                } else if (++tries >= POLL_MAX_TRIES) {
                    clearInterval(timer);
                    console.warn('[SlateWarmup] Инпут не найден, сдаюсь.');
                }
            }, POLL_INTERVAL);
        }, delayMs);
    }

    // ─── Observer: "Connecting to Chat" по тексту (без хрупких классов) ───────
    function setupReconnectObserver() {
        const mo = new MutationObserver((mutations) => {
            for (const mut of mutations) {
                for (const node of mut.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.textContent?.trim() === 'Connecting to Chat') {
                        console.log('[SlateWarmup] "Connecting to Chat" — перезапуск.');
                        warmupInitialized = false;
                        scheduleWarmup(RECONNECT_DELAY);
                        return;
                    }
                }
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });
        console.log('[SlateWarmup] ReconnectObserver активен.');
    }

    // ─── SPA-навигация (смена канала) ─────────────────────────────────────────
   function setupNavigationObserver() {
    // Патчим оба метода — Twitch использует оба
    const _push    = history.pushState.bind(history);
    const _replace = history.replaceState.bind(history);

    history.pushState = function (...args) {
        _push(...args);
        onNavigate();
    };
    history.replaceState = function (...args) {
        _replace(...args);
        onNavigate();
    };

    window.addEventListener('popstate', onNavigate);

    // Страховочный polling URL — на случай если роутер Twitch
    // патчит pushState раньше нас и наш wrapper не вызывается
    setInterval(() => {
        if (location.pathname !== lastPathname) {
            onNavigate();
        }
    }, 700);

    console.log('[SlateWarmup] NavigationObserver активен.');
}
    function onNavigate() {
        const path = location.pathname;
        if (path === lastPathname) return;
        lastPathname = path;
        console.log(`[SlateWarmup] Навигация → ${path}`);
        warmupInitialized = false;
        scheduleWarmup(INIT_DELAY);
    }

    // ─── Инициализация ────────────────────────────────────────────────────────
    window.addEventListener('load', () => {
        scheduleWarmup(INIT_DELAY);
        setupReconnectObserver();
        setupNavigationObserver();
    });

    // Ручной тест из консоли: SlateWarmupRun()
    window.SlateWarmupRun = () => { warmupInitialized = false; triggerSlateWarmup(); };

})();