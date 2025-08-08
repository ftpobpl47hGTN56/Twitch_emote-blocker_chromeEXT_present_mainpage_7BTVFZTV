// ============== js/emotePickerHandler.js ============ //
function handleEmotePickerInteraction(controlPanel, openPanelButton, openPanelLabel, openPanelContainer) {
    console.log("[UI] Setting up Emote Picker interaction handler...");
    let emotePickerButton = document.querySelector('[data-a-target="emote-picker-button"]');
    function setupEmotePickerListener() {
        if (!emotePickerButton) {
            console.warn("[UI] Emote Picker button not found initially, setting up observer...");
            const observer = new MutationObserver((mutations, obs) => {
                emotePickerButton = document.querySelector('[data-a-target="emote-picker-button"]');
                if (emotePickerButton) {
                    console.log("[UI] Emote Picker button found dynamically:", emotePickerButton);
                    obs.disconnect();
                    attachListeners();
                }
                else {
                    console.log("[UI] Still searching for Emote Picker button...");
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            return;
        }
        console.log("[UI] Emote Picker button found immediately:", emotePickerButton);
        attachListeners();
        function attachListeners() {
            emotePickerButton.addEventListener('click', () => {
                const isPanelVisible = controlPanel.classList.contains('visible');
                console.log("[UI] Emote Picker button clicked, panel visible:", isPanelVisible);
                if (isPanelVisible) {
                    controlPanel.style.display = 'none';
                    openPanelButton.classList.remove('active');
                    openPanelLabel.textContent = 'Open Panel';
                    openPanelContainer.setAttribute('aria-label', 'Open control panel');
                    openPanelContainer.title = 'Open control panel';
                    setStorage('panelVisible', false);
                    console.log("[UI] Control panel hidden due to Emote Picker opening");
                }
            });
            document.addEventListener('click', (e) => {
                const emotePicker = document.querySelector('.ffz--emote-picker') || document.querySelector('.tw-block[data-a-target="emote-picker"]');
                if (!emotePickerButton.contains(e.target) && (!emotePicker || !emotePicker.contains(e.target))) {
                    const wasHidden = controlPanel.style.display === 'none';
                    if (wasHidden) {
                        controlPanel.style.display = 'block';
                        controlPanel.classList.add('visible');
                        openPanelButton.classList.add('active');
                        openPanelLabel.textContent = 'Close Panel';
                        openPanelContainer.setAttribute('aria-label', 'Close control panel');
                        openPanelContainer.title = 'Close control panel';
                        setStorage('panelVisible', true);
                        console.log("[UI] Control panel restored after Emote Picker closed");
                    }
                }
            });
        }
    }
    setupEmotePickerListener();
}
//==================== Вызываем обработчик перед return ===================================== //
handleEmotePickerInteraction(controlPanel, openPanelButton, openPanelLabel, openPanelContainer);
//# sourceMappingURL=emotePickerHandler.js.map