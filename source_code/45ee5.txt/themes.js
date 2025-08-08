// ============ themes.js модуль =========== //
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
            default: 'css/styles.css'
        };
        const themeUrl = chrome.runtime.getURL(themes[savedTheme] || themes.default);
        themeStylesheet.href = themeUrl;
        themeSelect.value = savedTheme;
        setStorage('selectedTheme', savedTheme);
        console.log("[Content] Loaded theme:", savedTheme);
        // Обновление темы для iframe
        const blockedIframe = document.getElementById('blocked-emotes-iframe');
        const bannedIframe = document.getElementById('banned-chat-iframe');
        [blockedIframe, bannedIframe].forEach(iframe => {
            if (iframe && iframe.contentDocument) {
                const doc = iframe.contentDocument;
                let themeLink = doc.getElementById('theme-stylesheet');
                if (!themeLink) {
                    themeLink = doc.createElement('link');
                    themeLink.id = 'theme-stylesheet';
                    themeLink.rel = 'stylesheet';
                    doc.head.appendChild(themeLink);
                }
                themeLink.href = themeUrl;
                console.log(`[Content] Updated theme for iframe ${iframe.id}:`, savedTheme);
            }
        });
    }
    window.loadTheme = loadTheme;
    console.log("[UI] themes.js module initialized");
})();
//# sourceMappingURL=themes.js.map