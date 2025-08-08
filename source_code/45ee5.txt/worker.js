// worker.js 
// Этот Web Worker предотвращает скрытие элементов эмодзи в интерфейсе Chat twitch,
//  (например, в чате или окне выбора эмодзи), восстанавливая их видимость,
//  если они были скрыты (через display: none). 
// Обработчик события получения сообщения от основного потока
self.onmessage = function (e) {
    const { emotePickerElements, viewerCardSelector } = e.data;
    let restoredCount = 0;
    let viewerCardRestored = false;
    // Восстановление эмодзи
    if (emotePickerElements && emotePickerElements.length > 0) {
        emotePickerElements.forEach(emote => {
            if (emote.style && emote.style.display === 'none') {
                emote.style.display = '';
                restoredCount++;
            }
        });
    }
    else {
        self.postMessage({ status: 'skipped', message: 'No emote picker elements provided' });
    }
    // Восстановление карточки зрителя
    if (viewerCardSelector) {
        const viewerCard = document.querySelector(viewerCardSelector);
        if (viewerCard && viewerCard.style.display === 'none') {
            viewerCard.style.display = '';
            viewerCardRestored = true;
            self.postMessage({
                status: 'viewerCardRestored',
                message: `Restored visibility of viewer card with selector: ${viewerCardSelector}`
            });
        }
    }
    // Отправка результата
    self.postMessage({
        status: 'completed',
        message: `Prevented hiding ${restoredCount} emotes, viewer card restored: ${viewerCardRestored}`,
        restoredCount,
        viewerCardRestored
    });
};
//# sourceMappingURL=worker.js.map