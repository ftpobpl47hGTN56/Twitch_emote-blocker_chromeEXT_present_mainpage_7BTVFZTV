//========= fix Twitch_Auto_reload _when_stuck_v0_2_4_25 stream ================ //
// ==UserScript==
// @name         Twitch_Auto_reload _when_stuck_v0_2_4_25
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Automatically reloads Twitch player when it gets stuck on loading with status logging
// @author       You
// @match        https://www.twitch.tv/*
// @icon         https://userscontent2.emaze.com/images/56507c3a-0fb2-4f1a-b608-d5b18985f486/f8914c04-35a1-4821-a74e-bee02595c64d.gif
// @grant        none
// @downloadURL  https://update.greasyfork.org/scripts/472868/Twitch%2C%20Auto%20reload%20when%20stuck.user.js
// @updateURL    https://update.greasyfork.org/scripts/472868/Twitch%2C%20Auto%20reload%20when%20stuck.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // Функция для удобного логирования
    function logStatus(message, isError = false) {
        const timestamp = new Date().toLocaleTimeString();
        console[isError ? 'error' : 'log'](`[Twitch Auto Reload] [${timestamp}] ${message}`);
    }
    // Клик по кнопке "Продолжить"
    setInterval(() => {
        const button = document.querySelector(".content-overlay-gate__allow-pointers button");
        if (button) {
            button.click();
            logStatus("Clicked continue button successfully");
        }
    }, 1000);
    // Переменные для отслеживания состояния
    let loadingStartTime = null;
    const maxLoadingTime = 10000; // 10 секунд максимального времени загрузки
    let lastStatusLogged = null;
    // Функция перезапуска плеера
    function resetPlayer() {
        const resetButton = document.querySelector('[data-a-target="ffz-player-reset-button"]');
        if (resetButton) {
            // Эмуляция двойного клика через событие dblclick
            resetButton.dispatchEvent(new Event('dblclick', { bubbles: true }));
            logStatus("Player reset attempted using FFZ button (dblclick)");
            return true;
        }
        else {
            logStatus("FFZ reset button not found, falling back to page reload", true);
            location.reload();
            return false;
        }
    }
    // Основной цикл проверки
    setInterval(() => {
        const loadingSpinner = document.querySelector('.tw-loading-spinner');
        const currentTime = Date.now();
        if (loadingSpinner && loadingSpinner.offsetParent !== null) {
            if (!loadingStartTime) {
                loadingStartTime = currentTime;
                logStatus("Loading started");
            }
            else {
                const loadingDuration = currentTime - loadingStartTime;
                // Логирование прогресса каждые 2 секунды
                const secondsElapsed = Math.floor(loadingDuration / 1000);
                if (lastStatusLogged !== secondsElapsed && secondsElapsed % 2 === 0) {
                    logStatus(`Loading in progress: ${secondsElapsed}s`);
                    lastStatusLogged = secondsElapsed;
                }
                if (loadingDuration >= maxLoadingTime) {
                    logStatus("Loading stuck detected, attempting reset", true);
                    const resetSuccess = resetPlayer();
                    if (resetSuccess) {
                        logStatus("Player reset initiated");
                    }
                    loadingStartTime = null;
                    lastStatusLogged = null;
                }
            }
        }
        else {
            if (loadingStartTime) {
                const loadingDuration = currentTime - loadingStartTime;
                logStatus(`Loading completed after ${Math.floor(loadingDuration / 1000)}s`);
                loadingStartTime = null;
                lastStatusLogged = null;
            }
            else if (!lastStatusLogged) {
                logStatus("Player is running normally");
                lastStatusLogged = 0;
            }
        }
    }, 1000);
})();
//# sourceMappingURL=Twitch_Auto_reload%20_when_stuck_v0_2_4_25.js.map