 
// ======== get_FfzTooltipEmotes.js ============ // 
// ======== Функции для блокировщика  ============ // 

// ========= функция получения эмодзи из тултипа getFfzTooltipEmotes ================ //
 
function getFfzTooltipEmotes() {
    const tooltip = document.querySelector('.ffz__tooltip');
    if (!tooltip)
        return [];
    const imgs = Array.from(tooltip.querySelectorAll('img')).filter(img => img.classList.contains('chat-image') ||
        img.classList.contains('chat-line__message--emote') ||
        img.classList.contains('ffz-emote') ||
        img.classList.contains('seventv-emote') ||
        img.classList.contains('bttv-emote') ||
        img.classList.contains('twitch-emote') ||
        img.getAttribute('data-provider'));
    // Дедупликация по data-id+src
    const seen = new Set();
    const uniqueImgs = imgs.filter(img => {
        const key = (img.getAttribute('data-id') || '') + (img.src || '');
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
    return uniqueImgs.map(img => ({
        src: img.src,
        alt: img.getAttribute('alt') || img.getAttribute('data-emote-name') || '',
        platform: img.getAttribute('data-provider') || '',
        element: img,
        id: img.getAttribute('data-id') || ''
    }));
}

// ========================================================================================== //
// ========================================================================================== //
// ============= функция для поиска контейнера и эмодзи findEmoteContainerAndEmotes ========= // 

// ================= в сообщении Twitch, SevenTV, BTTV и FFZ ================================ //

function findEmoteContainerAndEmotes(clickedImg) {
    const messageContainer = clickedImg.closest('.message, .chat-line__message, .chat-line__message-container, .ffz--inline, .modified-emote, .scaled-modified-emote, [class*="modified-emote"]') || clickedImg.parentElement || clickedImg;
    if (!messageContainer) {
        return [{
                src: clickedImg.src,
                alt: clickedImg.getAttribute('alt') || clickedImg.getAttribute('data-emote-name') || '',
                platform: clickedImg.getAttribute('data-provider') || '',
                element: clickedImg,
                id: clickedImg.getAttribute('data-id') || ''
            }];
    }
    // 1. Получаем основной смайл
    const mainEmote = getMainEmoteFromContainer(messageContainer);
    // 2. Получаем остальные смайлы (без основного)
    const otherImgs = Array.from(messageContainer.querySelectorAll('img')).filter(img => img !== mainEmote);
    // 3. Собираем итоговый список: сначала основной, потом остальные
    const allImgs = mainEmote ? [mainEmote, ...otherImgs] : otherImgs;
    // Дальше фильтруем по твоей логике (по видимости и нужным классам)
    const filtered = allImgs.filter(img => {
        const style = window.getComputedStyle(img);
        const isVisible = style.display !== 'none' && style.opacity !== '0' && img.offsetWidth > 0 && img.offsetHeight > 0;
        const isEmote = img.classList.contains('chat-image') ||
            img.classList.contains('chat-line__message--emote') ||
            img.classList.contains('ffz-emote') ||
            img.classList.contains('seventv-emote') ||
            img.classList.contains('bttv-emote') ||
            img.classList.contains('twitch-emote') ||
            img.classList.contains('modified-emote') ||
            img.classList.contains('scaled-modified-emote') ||
            img.getAttribute('data-provider');
        const isValidElement = img.isConnected; // Проверяем, что элемент всё ещё в DOM
        return img.src && isVisible && isEmote && isValidElement;
    });
    return filtered.map(img => ({
        src: img.src,
        alt: img.getAttribute('alt') || img.getAttribute('data-emote-name') || '',
        platform: img.getAttribute('data-provider') || '',
        element: img,
        id: img.getAttribute('data-id') || ''
    }));
}