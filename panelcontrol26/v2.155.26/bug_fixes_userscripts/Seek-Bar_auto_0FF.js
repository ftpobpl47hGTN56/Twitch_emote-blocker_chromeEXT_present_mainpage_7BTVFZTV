// ==UserScript==
// @name         Seek_bar_0ff click simulation
// @namespace    http://google.com/
// @version      01.02.3
// @description   click simulation with offline operation, restart when changing URL/tab, player and seekbar monitoring
// @author       gullampis810
// @match        https://www.twitch.tv/*
// @icon         https://avatars.mds.yandex.net/i?id=9e211ada5f9e390aed83832497063792-5349885-images-thumbs&n=13
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const storageKey = 'disableTwitchSeekBar';
    let currentPath = window.location.pathname;
    let intervalId; // Для периодической проверки URL
    let playerCheckId; // Для проверки плеера
    let run = false;

    // Функция для проверки наличия seek bar и кнопки настроек
    function checkPlayerElements() {
        const seekBar = document.querySelector('[data-a-target="player-seekbar"]');
        const settingsButton = document.querySelector('[data-a-target="player-settings-button"]');
        return seekBar && settingsButton;
    }

    // Функция для выполнения действия (один раз)
    function performAction() {
        const settingsButton = document.querySelector('[data-a-target="player-settings-button"]');
        settingsButton.click(); // Открываем попап

        setTimeout(() => {
            // Ищем переключатель seek bar в меню (точный селектор)
            const toggleButtons = document.querySelectorAll('button[role="menuitem"]');
            const seekToggle = Array.from(toggleButtons).find(el => {
                const text = el.textContent.toLowerCase();
                return text.includes('seek bar');
            });

            if (seekToggle) {
                const text = seekToggle.textContent.toLowerCase();
                if (text.includes('hide')) {
                    seekToggle.click(); // Кликаем только если видим
                    console.log('[Seek_bar_0ff] Seek bar отключен через симуляцию клика.');
                } else {
                    console.log('[Seek_bar_0ff] Seek bar уже отключен.');
                }
            }

            // Закрываем попап кликом по кнопке "Close"
            const closeButtons = document.querySelectorAll('button[role="menuitem"]');
            const closeButton = Array.from(closeButtons).find(el => el.textContent.toLowerCase().includes('close'));
            if (closeButton) {
                closeButton.click();
            } else {
                // Fallback: клик по settingsButton, если Close не найдена
                settingsButton.click();
            }
            run = true;
            if (playerCheckId) clearInterval(playerCheckId);
        }, 300); // Задержка для загрузки попапа
    }

    // Запуск проверки плеера (интервал до первого срабатывания)
    function startPlayerCheck() {
        if (run) return;
        playerCheckId = setInterval(() => {
            if (checkPlayerElements()) {
                clearInterval(playerCheckId);
                performAction();
            }
        }, 300); // Проверяем каждые 2 секунды
    }

    // Периодическая проверка смены URL (для SPA как Twitch)
    function monitorUrlChange() {
        intervalId = setInterval(() => {
            if (window.location.pathname !== currentPath) {
                currentPath = window.location.pathname;
                run = false;
                if (playerCheckId) clearInterval(playerCheckId);
                startPlayerCheck();
                console.log('[Seek_bar_0ff] Обнаружена смена URL канала. Перезапуск скрипта.');
            }
        }, 500); // Проверяем URL каждую секунду
    }

    // Инициализация: запуск при загрузке страницы с задержкой
    if (localStorage.getItem(storageKey) !== 'false') {
        setTimeout(() => {
            startPlayerCheck();
            monitorUrlChange();
        }, 500);
    }

    // Очистка при необходимости
    window.addEventListener('beforeunload', () => {
        if (intervalId) clearInterval(intervalId);
        if (playerCheckId) clearInterval(playerCheckId);
    });
})();