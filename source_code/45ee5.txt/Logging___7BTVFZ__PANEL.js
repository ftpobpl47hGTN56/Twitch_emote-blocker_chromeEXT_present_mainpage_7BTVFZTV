// ============ модуль Logging___7BTVFZ__PANEL.js =========== //
let loggingEnabled = getStorage('enable__7BTVFZ__Logging', false);
function isLoggingEnabled() {
    return getStorage('enable__7BTVFZ__Logging', false);
}
function setLoggingEnabled(enabled) {
    console.log("[Debug] setLoggingEnabled called with:", enabled);
    loggingEnabled = enabled;
    setStorage('enable__7BTVFZ__Logging', enabled);
    if (isLoggingEnabled()) {
        console.log(`[Logging] Logging is now ${enabled ? 'enabled' : 'disabled'}`);
    }
}
// Определяем цвета для категорий
const logStyles = {
    'Debug': 'color:rgb(209, 153, 100); font-weight: bold;',
    'Logging': 'color: #2ecc71; font-weight: bold;', // Зеленый
    'Twitch Emote Blocker': 'color:rgb(167, 128, 182); font-weight: bold;', // Фиолетовый
    'EXT': 'color: #e67e22; font-weight: bold;', // Оранжевый
    'default': 'color:rgb(80, 179, 192); font-weight: normal;', // Серый для остальных
    'Blocking': 'color:rgb(167, 134, 189); font-weight: bold;' // Красный
};
// Функция для получения стиля по категории
function getLogStyle(category) {
    return logStyles[category] || logStyles['default'];
}
// Переопределяем console методы
(function () {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    console.log = function (...args) {
        if (!isLoggingEnabled())
            return;
        if (args.length > 0 && typeof args[0] === 'string') {
            // Извлекаем категорию из строки вида [Category]
            const match = args[0].match(/^\[([^\]]+)\]/);
            if (match) {
                const category = match[1];
                const style = getLogStyle(category);
                // Формируем сообщение с цветом для категории
                const formattedMessage = `%c${args[0]}`;
                originalConsoleLog.apply(console, [formattedMessage, style, ...args.slice(1)]);
                return;
            }
        }
        // Если категория не найдена, используем стиль по умолчанию
        originalConsoleLog.apply(console, [`%c${args[0]}`, logStyles['default'], ...args.slice(1)]);
    };
    console.warn = function (...args) {
        if (!isLoggingEnabled())
            return;
        // Для warn используем желтый цвет
        if (args.length > 0 && typeof args[0] === 'string') {
            const match = args[0].match(/^\[([^\]]+)\]/);
            if (match) {
                const category = match[1];
                const style = getLogStyle(category);
                originalConsoleWarn.apply(console, [`%c${args[0]}`, style, ...args.slice(1)]);
                return;
            }
        }
        originalConsoleWarn.apply(console, args);
    };
    console.error = function (...args) {
        if (!isLoggingEnabled())
            return;
        // Для error используем красный цвет
        if (args.length > 0 && typeof args[0] === 'string') {
            const match = args[0].match(/^\[([^\]]+)\]/);
            if (match) {
                const category = match[1];
                const style = getLogStyle(category);
                originalConsoleError.apply(console, [`%c${args[0]}`, style, ...args.slice(1)]);
                return;
            }
        }
        originalConsoleError.apply(console, args);
    };
})();
// Экспортируем setLoggingEnabled в глобальную область
window.setLoggingEnabled = setLoggingEnabled;
// Инициализационные логи
if (isLoggingEnabled()) {
    console.log("[Twitch Emote Blocker] Injected in:", window.location.href, "Is iframe:", window !== window.top);
    console.log("[Twitch Emote Blocker] Script started loading...");
    console.log("[EXT] Injected in:", window.location.href);
}
// Экспортируем в глобальную область
window.setLoggingEnabled = setLoggingEnabled;
window.Logging = {
    isLoggingEnabled,
    setLoggingEnabled,
    getLogStyle
};
//# sourceMappingURL=Logging___7BTVFZ__PANEL.js.map