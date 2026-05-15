// ============ js/themes.js модуль =========== //

// ============ js/themes.js модуль =========== //
(function () {
    function loadTheme(themeSelect, themeStylesheet, savedTheme) {
        const themes = {
            amethystGlow: 'css/themes/amethystGlow.css',
            amberBlaze: 'css/themes/amberBlaze.css',
            glassmorphism: 'css/themes/glassmorphism.css',
            dark: 'css/themes/dark.css',
            sapphireBlue: 'css/themes/sapphireBlue.css',
            darkAncientNights: 'css/themes/darkAncientNights.css',
            darkRaspberry: 'css/themes/darkRaspberry.css',
            lightMode: 'css/themes/lightMode.css',
            deepSeaTurquoise: 'css/themes/deepSeaTurquoise.css',
            defaultThemeScrollbar: 'css/themes/default_theme_scrollbar.css',
            default: 'css/styles.css'
        };

        const themeUrl = chrome.runtime.getURL(themes[savedTheme] || themes.default);

        // Если элемент не передан — ищем или создаём
        if (!themeStylesheet) {
            themeStylesheet = document.getElementById('theme-stylesheet');
        }
        if (!themeStylesheet) {
            themeStylesheet = document.createElement('link');
            themeStylesheet.id = 'theme-stylesheet';
            themeStylesheet.rel = 'stylesheet';
            document.head.appendChild(themeStylesheet);
            console.log("[_UI_Themes_] theme-stylesheet created");
        }

        themeStylesheet.href = themeUrl;

        if (themeSelect) themeSelect.value = savedTheme;
        setStorage('selectedTheme', savedTheme);
        console.log("[_UI_Themes_] Loaded theme:", savedTheme);
    }

    window.loadTheme = loadTheme;
    console.log("[_UI_Themes_] themes.js module initialized");
})();