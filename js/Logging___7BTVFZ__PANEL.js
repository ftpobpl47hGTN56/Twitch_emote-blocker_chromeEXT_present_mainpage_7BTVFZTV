
// ============ модуль Logging___7BTVFZ__PANEL.js =========== //
 


let loggingEnabled = getStorage('7BTVFZ__Logging_panel', false);
function isLoggingEnabled() {
    return getStorage('7BTVFZ__Logging_panel', false);
}
function setLoggingEnabled(enabled) {
    console.log("[Debug] setLoggingEnabled called with:", enabled);
    loggingEnabled = enabled;
    setStorage('7BTVFZ__Logging_panel', enabled);
    if (isLoggingEnabled()) {
        console.log(`[_Logging__panel_] Logging is now ${enabled ? 'enabled' : 'disabled'}`);
    }
}
// Определяем цвета для категорий
const logStyles = {
      '_UI_panel_7BTVFZ_': {
        prefix: 'color: rgb(44, 149, 247); font-weight: bold;',
        text: 'color: rgb(118, 187, 129); font-weight: normal;'
    },
      '_UI_Themes_': {
        prefix: 'color: rgb(120, 110, 209); font-weight: bold;',
        text: 'color: rgb(187, 148, 196); font-weight: normal;'
    },
    
    '_Storage_7BTVFZ_': {
        prefix: 'color: rgb(230, 176, 255); font-weight: bold;',
        text: 'color: rgb(138, 210, 212); font-weight: normal;'
    },
     '_init_Storage_7btvfz_': {
        prefix: 'color: rgb(241, 167, 97); font-weight: bold;',
        text: 'color: rgb(118, 195, 214); font-weight: normal;'
    },
      '_init_Content_': {
        prefix: 'color: rgb(253, 242, 88); font-weight: bold;',
        text: 'color: rgb(106, 192, 226); font-weight: normal;'
    },
    'Debug': {
        prefix: 'color: rgb(209, 153, 100); font-weight: bold;',
        text: 'color: rgb(209, 153, 100); font-weight: normal;'
    },
    '_Logging__panel_': {
        prefix: 'color: rgb(11, 248, 110); font-weight: bold;', // Зеленый для префикса
        text: 'color: rgb(80, 224, 35); font-weight: normal;' // Чуть темнее зеленый для текста
    },
    '_Twitch_7BTVFZ_emote_Blocker_': {
        prefix: 'color: rgb(167, 128, 182); font-weight: bold;', // Фиолетовый для префикса
        text: 'color: rgb(142, 68, 173); font-weight: normal;' // Темнее фиолетовый для текста
    },
    'EXT': {
        prefix: 'color: rgb(230, 126, 34); font-weight: bold;', // Оранжевый для префикса
        text: 'color: rgb(211, 84, 0); font-weight: normal;' // Темнее оранжевый для текста
    },
    'Blocking_Emotes': {
        prefix: 'color: rgb(68, 133, 255); font-weight: bold;', // Красный для префикса
        text: 'color: rgb(158, 187, 196); font-weight: normal;' // Темнее красный для текста
    },
    'ColonReplacer': {
        prefix: 'color: rgb(78, 204, 88); font-weight: bold;', // Розовый для префикса
        text: 'color: rgb(24, 155, 105); font-weight: normal;' // Темнее розовый для текста
    },
     '_Keyword_Blocking_': {
        prefix: 'color: rgb(80, 150, 255); font-weight: bold;', // Голубой для префикса
        text: 'color: rgb(101, 179, 175); font-weight: normal;' // Темнее голубой для текста
    },
      '_Keyword_Watchdog_': {
        prefix: 'color: rgb(101, 103, 184); font-weight: bold;', // Голубой для префикса
        text: 'color: rgb(101, 179, 175); font-weight: normal;' // Темнее голубой для текста
    },
    
    'ChatFilter': {
        prefix: 'color: rgb(70, 226, 218); font-weight: bold;', // Голубой для префикса
        text: 'color: rgb(46, 146, 141); font-weight: normal;' // Темнее голубой для текста
    },
     '_Chat_Keyword_Filtering_': {
        prefix: 'color: rgb(226, 205, 15); font-weight: bold;', // Голубой для префикса
        text: 'color: rgb(179, 144, 50); font-weight: normal;' // Темнее голубой для текста
    },
    
    'WATCHDOG': {
        prefix: 'color: rgb(142, 214, 26); font-weight: bold;',
        text: 'color: rgb(151, 201, 71); font-weight: normal;'
    },
    'WATCHDOG :Блокировка работает корректно!': {
        prefix: 'color: rgb(137, 199, 38); font-weight: bold;',
        text: 'color: rgb(51, 202, 164); font-weight: normal;'
    },
    'WATCHDOG:Перезапуск логики блокировки... isBlockingEnabled: ${isBlockingEnabled}': {
        prefix: 'color: rgb(214, 148, 26); font-weight: bold;',
        text: 'color: rgb(32, 199, 157); font-weight: normal;'
    },
    'Chat_Slate_Word_Filter': {
        prefix: 'color: rgb(192, 145, 211); font-weight: bold;', // Фиолетовый для префикса
        text: 'color: rgb(110, 169, 187); font-weight: normal;' // Темнее фиолетовый для текста
    },
    'Chat_Slate_Word_Corrector': {
        prefix: 'color: rgb(46, 199, 173); font-weight: bold;', // Бирюзовый для префикса
        text: 'color: rgb(38, 166, 144); font-weight: normal;' // Темнее бирюзовый для текста
    },
    'Chat_Slate_Word_Corrector:Error': {
        prefix: 'color: rgb(230, 126, 34); font-weight: bold;', // Оранжевый для префикса
        text: 'color: rgb(209, 106, 106); font-weight: normal;' // Темнее оранжевый для текста
    },
    'Chat_Slate_Word_Corrector:Success': {
        prefix: 'color: rgb(46, 204, 113); font-weight: bold;', // Зеленый для префикса
        text: 'color: rgb(33, 156, 80); font-weight: normal;' // Темнее зеленый для текста
    },
    'Chat_Slate_Word_Corrector:Process': {
        prefix: 'color: rgb(56, 151, 189); font-weight: bold;', // Синий для префикса
        text: 'color: rgb(106, 153, 192); font-weight: normal;' // Темнее синий для текста
    },
    '_Chat_Recycler_': {
        prefix: 'color: rgb(231, 134, 175); font-weight: bold;', // Зеленый для префикса
          text: 'color: rgb(202, 179, 231); font-weight: normal;' // Темнее синий для текста
    }, 
    '_Emoji_Spam_Protect_': {
        prefix: 'color: rgb(189, 202, 0); font-weight: bold;', // Оранжевый для префикса
        text: 'color: rgb(157, 224, 202); font-weight: normal;' // Темнее оранжевый для текста
    },
    'KeywordBlocking': {
        prefix: 'color: rgb(54, 199, 204); font-weight: bold;', // Фиолетовый для префикса
        text: 'color: rgb(153, 187, 186); font-weight: normal;' // Темнее фиолетовый для текста
    },
     '_Previewer_Media_': {
        prefix: 'color: rgb(255, 93, 155); font-weight: bold;', // Зеленый для префикса по умолчанию
        text: 'color: rgb(201, 141, 169); font-weight: normal;' // Темнный для текста
    }, 
    '_Rename_twitch_Nick_names_': {
        prefix: 'color: rgb(63, 189, 178); font-weight: bold;', // Зеленый для префикса по умолчанию
        text: 'color: rgb(165, 185, 110); font-weight: normal;' // Темнный для текста
    },
    'default': {
        prefix: 'color: rgb(185, 202, 109); font-weight: bold;', // Зеленый для префикса по умолчанию
        text: 'color: rgb(162, 192, 192); font-weight: normal;' // Темнный для текста
    }
};
// Функция для получения стиля по категории
function getLogStyle(category) {
    return logStyles[category] || logStyles['default'];
}
// Переопределяем console методы (обновлено: сериализация всех аргументов для раздельного стиля)
(function () {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
   console.log = function (...args) {
    if (!isLoggingEnabled()) return;
    if (args.length > 0) {
        // Сериализуем все аргументы в одну строку
        const fullMessage = args.map(arg => {
            if (typeof arg === 'string') return arg;
            if (arg === null || arg === undefined) return 'null';
            try {
                return JSON.stringify(arg, null, 2); // Для объектов, с отступами для читаемости
            } catch (e) {
                return '[Object]'; // На случай ошибок сериализации
            }
        }).join(' ');

        const match = fullMessage.match(/^\[([^\]]+)\]/);
        if (match) {
            const category = match[1];
            const prefix = match[0];
            const message = fullMessage.substring(prefix.length).trim();
            const styles = getLogStyle(category); // Получаем объект со стилями для категории

            // Выводим: префикс и текст с разными стилями
            originalConsoleLog(`%c${prefix} %c${message}`, styles.prefix, styles.text);
            return;
        }
    }
    // Если категория не найдена, используем стиль по умолчанию
    const defaultStyles = getLogStyle('default');
    originalConsoleLog.apply(console, [`%c${args[0]}`, defaultStyles.prefix, ...args.slice(1)]);
};
   console.warn = function (...args) {
    if (!isLoggingEnabled()) return;
    if (args.length > 0 && typeof args[0] === 'string') {
        const match = args[0].match(/^\[([^\]]+)\]/);
        if (match) {
            const category = match[1];
            const prefix = match[0];
            const message = args[0].substring(prefix.length).trim();
            const styles = getLogStyle(category);
            originalConsoleWarn(`%c${prefix} %c${message}`, styles.prefix, styles.text, ...args.slice(1));
            return;
        }
    }
    const defaultStyles = getLogStyle('default');
    originalConsoleWarn.apply(console, [`%c${args[0]}`, defaultStyles.prefix, ...args.slice(1)]);
};

console.error = function (...args) {
    if (!isLoggingEnabled()) return;
    if (args.length > 0) {
        const fullMessage = args.map(arg => {
            if (typeof arg === 'string') return arg;
            if (arg === null || arg === undefined) return 'null';
            try {
                return JSON.stringify(arg, null, 2);
            } catch (e) {
                return '[Object]';
            }
        }).join(' ');

        const match = fullMessage.match(/^\[([^\]]+)\]/);
        if (match) {
            const category = match[1];
            const prefix = match[0];
            const message = fullMessage.substring(prefix.length).trim();
            const styles = getLogStyle(category);

            originalConsoleError(`%c${prefix} %c${message}`, styles.prefix, styles.text);
            return;
        }
    }
    const defaultStyles = getLogStyle('default');
    originalConsoleError.apply(console, [`%c${args[0]}`, defaultStyles.prefix, ...args.slice(1)]);
};
})();
// Экспортируем setLoggingEnabled в глобальную область
window.setLoggingEnabled = setLoggingEnabled;
// Инициализационные логи
if (isLoggingEnabled()) {
    console.log("[_Twitch_7BTVFZ_emote_Blocker_] Injected in:", window.location.href, "Is iframe:", window !== window.top);
    console.log("[_Twitch_7BTVFZ_emote_Blocker_] Script started loading...");
    console.log("[EXT] Injected in:", window.location.href);
}
// Экспортируем в глобальную область
window.setLoggingEnabled = setLoggingEnabled;
window.Logging = {
    isLoggingEnabled,
    setLoggingEnabled,
    getLogStyle
};
