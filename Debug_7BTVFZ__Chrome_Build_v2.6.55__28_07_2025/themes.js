
// ============ themes.js модул =========== //



(function() {

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
        default: 'css/styles.css'
    };

    const themeUrl = chrome.runtime.getURL(themes[savedTheme] || themes.default);
    themeStylesheet.href = themeUrl;
    themeSelect.value = savedTheme;
    setStorage('selectedTheme', savedTheme);
    console.log("[Content] Loaded theme:", savedTheme);
}

// Привязываем функцию к window для глобального доступа
  window.loadTheme = loadTheme;
  console.log("[UI] themes.js module initialized");
})(); 