(function () {
    function enableBlocking() {
        console.log("[Content] Enabling blocking...");
        try {
            isBlockingEnabled = true;
            setStorage('isBlockingEnabled', true);
            console.log("[Content] isBlockingEnabled set to:", isBlockingEnabled);
            toggleEmotesInChat(true);
            chatFilter.setTextFilteringEnabled(true);
            console.log("[Content] Text filtering enabled via ChatFilter");
            if (uiElements && uiElements.blockAllButton && uiElements.unblockAllButton) {
                uiElements.blockAllButton.classList.add('active');
                uiElements.unblockAllButton.classList.remove('active');
                console.log("[Content] UI updated: blockAllButton active");
            }
            if (window.renameNicknamesInstance) {
                window.renameNicknamesInstance.toggleRenameNickEnabled(true);
                console.log("[Content] RenameNicknames enabled");
            }
            else {
                console.warn("[Content] RenameNicknames instance not found");
            }
        }
        catch (error) {
            console.error("[Content] Error in enableBlocking:", error);
        }
    }
    function disableBlocking() {
        console.log("[Content] Disabling blocking...");
        try {
            isBlockingEnabled = false;
            setStorage('isBlockingEnabled', false);
            console.log("[Content] isBlockingEnabled set to:", isBlockingEnabled);
            toggleEmotesInChat(true);
            chatFilter.setTextFilteringEnabled(false);
            console.log("[Content] Text filtering disabled via ChatFilter");
            if (uiElements && uiElements.unblockAllButton && uiElements.blockAllButton) {
                uiElements.unblockAllButton.classList.add('active');
                uiElements.blockAllButton.classList.remove('active');
                console.log("[Content] UI updated: unblockAllButton active");
            }
            if (window.renameNicknamesInstance) {
                window.renameNicknamesInstance.toggleRenameNickEnabled(false);
                console.log("[Content] RenameNicknames disabled");
            }
            else {
                console.warn("[Content] RenameNicknames instance not found");
            }
        }
        catch (error) {
            console.error("[Content] Error in disableBlocking:", error);
        }
    }
    window.enableBlocking = enableBlocking;
    window.disableBlocking = disableBlocking;
    console.log("[UI] blocker__emotes module initialized");
})();
//# sourceMappingURL=enable__disableBlocking.js.map