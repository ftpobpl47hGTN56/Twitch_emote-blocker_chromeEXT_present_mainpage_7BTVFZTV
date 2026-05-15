// rename-users-nickname/init.js

(function () {
    // Проверка, что все зависимости загружены
    if (!window.TwitchNickRenameConstants || !window.RenameNicknamesInstantFull || !window.TwitchNickRenameUI) {
        console.error('[_Rename_twitch_Nick_names_] Один из модулей не загружен');
        return;
    }

    function initRenameNicknames() {
        const getStorage = (key, defaultValue) => {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            } catch (e) {
                console.error('[_Rename_twitch_Nick_names_] Error reading from localStorage:', e);
                return defaultValue;
            }
        };

        const setStorage = async (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('[_Rename_twitch_Nick_names_] Error writing to localStorage:', e);
            }
        };

      const instance = new window.RenameNicknamesInstantFull({
            getStorage,
            setStorage,
            log: (...args) => console.log(...args)
        });

        // СНАЧАЛА сохраняем в window
        window.renameNicknamesInstance = instance;

        // ПОТОМ добавляем UI-части
        window.TwitchNickRenameUI.addStyles();
        window.TwitchNickRenameUI.startViewerCardObserver(instance);

        // Запускаем основную инициализацию
        instance.init();

    }

    // Автозапуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRenameNicknames);
    } else {
        initRenameNicknames();
    }
})();