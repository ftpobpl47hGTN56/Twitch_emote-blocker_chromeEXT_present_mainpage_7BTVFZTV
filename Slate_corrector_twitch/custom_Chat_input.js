// ==UserScript==
// @name         Twitch Кастомный инпут + API отправка 2025
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Полностью кастомный инпут + 100% доставка сообщений
// @author       You
// @match        https://www.twitch.tv/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

  // ────────────────────── ТОКЕНЫ (обновляются автоматически) ──────────────────────
    let ACCESS_TOKEN = '9ih6tbjwltl0lidhadpseyz7zn2ts3';
    let REFRESH_TOKEN = '4cxwhs1ioqzg81nxn1wb28g0kn95q6plbj81qpzqv4bny7koys';
    const CLIENT_ID = 'gp762nuuoqcoxypju8c569th9wz7q5';

    // Авто-обновление токена (каждые 48 часов + при 401)
    async function refreshAccessToken() {
        try {
            const res = await fetch('https://id.twitch.tv/oauth2/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: REFRESH_TOKEN,
                    client_id: CLIENT_ID
                })
            });

            if (!res.ok) return false;

            const data = await res.json();
            ACCESS_TOKEN = data.access_token;
            REFRESH_TOKEN = data.refresh_token || REFRESH_TOKEN;

            console.log('%cТокен автоматически обновлён! Работает до ~' + new Date(Date.now() + 60*24*60*60*1000).toLocaleDateString(), 'color:#00ff00; font-weight:bold');
            return true;
        } catch (e) {
            console.error('Ошибка автообновления токена:', e);
            return false;
        }
    }

    // Запускаем автообновление каждые 48 часов
    setInterval(refreshAccessToken, 48 * 60 * 60 * 1000);
    refreshAccessToken(); // сразу при старте

    // ────────────────────── ОТПРАВКА СООБЩЕНИЙ ──────────────────────
    let broadcasterId = null;
    let userId = null;

    window.sendTwitchMessage = async (text) => {
        if (!text?.trim()) return false;

        // Получаем ID (кэшируем)
        if (!userId || !broadcasterId) {
            try {
                const u = await fetch('https://api.twitch.tv/helix/users', {
                    headers: { 'Client-ID': CLIENT_ID, 'Authorization': `Bearer ${ACCESS_TOKEN}` }
                }).then(r => r.json());
                userId = u.data[0]?.id;

                const channel = location.pathname.slice(1).split('/')[0];
                const b = await fetch(`https://api.twitch.tv/helix/users?login=${channel}`, {
                    headers: { 'Client-ID': CLIENT_ID, 'Authorization': `Bearer ${ACCESS_TOKEN}` }
                }).then(r => r.json());
                broadcasterId = b.data[0]?.id;
            } catch (e) {
                console.error('Не удалось получить ID пользователя/канала:', e);
                return false;
            }
        }

        try {
            const res = await fetch('https://api.twitch.tv/helix/chat/messages', {
                method: 'POST',
                headers: {
                    'Client-ID': CLIENT_ID,
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    broadcaster_id: broadcasterId,
                    sender_id: userId,
                    message: text.trim()
                })
            });

            if (res.status === 401) {
                console.log('Токен истёк — обновляем...');
                if (await refreshAccessToken()) {
                    return await window.sendTwitchMessage(text); // повторная отправка
                }
                return false;
            }

            if (res.ok) {
                console.log('%cСообщение отправлено: ' + text.trim(), 'color:#00ff00');
                return true;
            } else {
                console.error('Ошибка отправки:', res.status, await res.text());
                return false;
            }
        } catch (e) {
            console.error('Исключение при отправке:', e);
            return false;
        }
    };

    // ────────────────────── КАСТОМНЫЙ ИНПУТ (ваш красивый дизайн) ──────────────────────
    const waitForOriginal = setInterval(() => {
        const original = document.querySelector('div[role="textbox"][data-a-target="chat-input"]') ||
                         document.querySelector('textarea[data-a-target="chat-input"]');

        if (original && original.isConnected && !document.getElementById('my-super-custom-input')) {
            clearInterval(waitForOriginal);
            createCustomInput(original);
        }
    }, 600);

    function createCustomInput(original) {
        // Скрываем оригинал
        original.style.display = 'none'; 
        const container = document.createElement('div');
        container.id = 'my-super-custom-input';
        container.style.cssText = `
    width: 100%;
    position: fixed;
    margin: -140px 0px;
    left: 1px;
    border-radius: 12px;
    background: rgba(21, 43, 44, 0);
    color: rgb(155, 220, 194);
    padding: 6px;
    box-sizing: border-box;
    height: 127px;
        `;

        const input = document.createElement('textarea');
        input.placeholder = '  . . . send in chat ';
        input.rows = 4;
        input.style.cssText = `
    width: 100%;
    position: relative;
    margin: 58px 0px;
    border-radius: 8px;
    background: rgb(28, 19, 36);
    color: rgb(155, 220, 194);
    padding: 5px;
    box-sizing: border-box;
    border: 1px solid;
    height: 50px;
    transition: height 0.15s ease-out;
    overflow-y: hidden;
    z-index: 555555 !important;
         `;
// ─────── ФУНКЦИЯ АВТОРЕСАЙЗА ───────
    function autoResizeTextarea() {
        // Сбрасываем высоту, чтобы правильно посчитать scrollHeight
        input.style.height = 'auto';
        
        // Ограничиваем максимум 8 строк (~180px)
        const maxHeight = 200;
        let newHeight = input.scrollHeight;

        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            input.style.overflowY = 'auto';   // включаем скролл только если >8 строк
        } else {
            input.style.overflowY = 'hidden';
        }

        input.style.height = newHeight + 'px';
    }

    // Вызываем при любом изменении текста
    input.addEventListener('input', autoResizeTextarea);
    
    // Также вызываем при вставке эмодзи (чтобы сразу подстроилось)
    input.addEventListener('paste', () => setTimeout(autoResizeTextarea, 10));
    
    // При фокусе — тоже подстраиваем (на всякий случай)
    input.addEventListener('focus', autoResizeTextarea);

    // Первый вызов — чтобы при открытии страницы высота была правильной
    setTimeout(autoResizeTextarea, 100);


    const btn = document.createElement('button');
    btn.textContent = 'send';
    btn.style.cssText = `
    position: absolute;
    right: 8px;
    top: 111%;
    background: rgb(21, 43, 44);
    color: rgb(138 200 161);
    border: 1px solid;
    padding: 10px 20px;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    height: 32px;
    width: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
        `;


        const send = async () => {
            const text = input.value.trim();
            if (!text) return;
            if (await window.sendTwitchMessage(text)) {
                input.value = '';
            }
        };

        btn.onclick = send;
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
            }
        });

        container.append(input, btn);
        const parent = original.closest('div[class*="chat-input"]') || original.parentElement.parentElement;
        parent.parentNode.insertBefore(container, parent);

        input.focus();
        console.log('%cКастомный инпут готов — сообщения 100% доходят!', 'color:#ff00ff; font-size:18px');
    }

        // ────────────────────── ПОДДЕРЖКА ЭМОДЗИ-ПИКЕРОВ (7TV, FFZ, BTTV, Twitch) ──────────────────────
    // Наблюдаем за всем документом и ловим клики по эмодзи
    document.addEventListener('click', function (e) {
        const button = e.target.closest('button[data-name], button[aria-label*="emote"], button emote-picker__emote-link, [data-emote-name]');
        
        if (!button) return;

        // Ищем название эмодзи по разным атрибутам (все пикеры используют разные)
        let emoteName = button.getAttribute('data-name') ||
                        button.getAttribute('aria-label') ||
                        button.getAttribute('data-emote-name') ||
                        button.querySelector('img')?.alt;

        // Если нашли — чистим от лишнего
        if (emoteName) {
            emoteName = emoteName.trim();
            if (emoteName.startsWith(':')) emoteName = emoteName.slice(1);
            if (emoteName.endsWith(':')) emoteName = emoteName.slice(0, -1);
        }

        if (!emoteName) return;

        // Находим ваш кастомный инпут
        const customInput = document.querySelector('#my-super-custom-input textarea');
        if (!customInput) {
            console.warn('Кастомный инпут не найден');
            return;
        }

        // Вставляем эмодзи в текущую позицию курсора
        const start = customInput.selectionStart;
        const end = customInput.selectionEnd;
        const textBefore = customInput.value.substring(0, start);
        const textAfter = customInput.value.substring(end);
        
        customInput.value = textBefore + emoteName + ' ' + textAfter;
        
        // Возвращаем курсор после вставленного эмодзи
        const newPos = start + emoteName.length + 1;
        customInput.focus();
        customInput.setSelectionRange(newPos, newPos);

        console.log(`%cЭмодзи вставлен: ${emoteName}`, 'color: #ff79c6');
        
        // Опционально: можно закрыть пикер после выбора
        const picker = document.querySelector('[data-a-target="emote-picker"]');
        if (picker) {
            const closeBtn = picker.querySelector('button[aria-label="Close"]');
            if (closeBtn) closeBtn.click();
        }
    }, true); // useCapture = true — ловим на ранней стадии

        // ────────────────────── ПЕРЕСОЗДАНИЕ ИНПУТА ПРИ SPA-ПЕРЕХОДАХ ──────────────────────
    let currentUrl = location.href;

    // Функция пересоздания инпута
    function recreateCustomInput() {
        // Удаляем старый кастомный инпут, если он есть
        const oldContainer = document.getElementById('my-super-custom-input');
        if (oldContainer && oldContainer.parentNode) {
            oldContainer.parentNode.removeChild(oldContainer);
        }

        // Показываем обратно оригинальный инпут (на случай если он был скрыт)
        const originals = [
            document.querySelector('div[role="textbox"][data-a-target="chat-input"]'),
            document.querySelector('textarea[data-a-target="chat-input"]'),
            document.querySelector('textarea[data-a-target="chat-input"]')
        ];
        originals.forEach(el => {
            if (el) el.style.display = '';
        });

        // Перезапускаем ожидание появления нового оригинального инпута
        const waitForNew = setInterval(() => {
            const original = document.querySelector('div[role="textbox"][data-a-target="chat-input"]') ||
                             document.querySelector('textarea[data-a-target="chat-input"]');

            if (original && original.isConnected && !document.getElementById('my-super-custom-input')) {
                clearInterval(waitForNew);
                createCustomInput(original);
            }
        }, 500); // чуть быстрее, чтобы не ждать долго после перехода

        console.log('%cURL изменился — кастомный инпут будет пересоздан', 'color:#ffa500; font-weight:bold');
    }

    // Отслеживаем изменение URL в SPA (Twitch использует history.pushState)
    const observeUrlChange = () => {
        let oldHref = document.location.href;

        const body = document.querySelector("body");
        const observer = new MutationObserver(mutations => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                currentUrl = oldHref;
                recreateCustomInput();
            }
        });

        observer.observe(body, { childList: true, subtree: true });

        // Дополнительно перехватываем pushState/replaceState
        const originalPushState = history.pushState;
        history.pushState = function () {
            originalPushState.apply(this, arguments);
            setTimeout(() => {
                if (currentUrl !== location.href) {
                    currentUrl = location.href;
                    recreateCustomInput();
                }
            }, 100);
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function () {
            originalReplaceState.apply(this, arguments);
            setTimeout(() => {
                if (currentUrl !== location.href) {
                    currentUrl = location.href;
                    recreateCustomInput();
                }
            }, 100);
        };

        // Также реагируем на обычные навигации и редиректы
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                if (currentUrl !== location.href) {
                    currentUrl = location.href;
                    recreateCustomInput();
                }
            }, 150);
        });
    };

    // Запускаем наблюдатель сразу после загрузки
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeUrlChange);
    } else {
        observeUrlChange();
    }

})();