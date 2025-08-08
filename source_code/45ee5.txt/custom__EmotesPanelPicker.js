// custom__EmotesPanelPicker.js
console.log("[CustomEmotePicker] Initializing Custom Emote Picker module...");
export function setupCustomEmotePicker(controlPanel) {
    const emotePicker = document.getElementById('custom-emote-picker');
    const favoriteEmotesList = document.getElementById('favorite-emotes-list');
    const channelEmotesList = document.getElementById('channel-emotes-list');
    const emotePickerButton = document.getElementById('custom-emote-picker-button');
    if (!emotePicker || !favoriteEmotesList || !channelEmotesList || !emotePickerButton) {
        console.error("[CustomEmotePicker] Required DOM elements not found");
        return;
    }
    // Функция для получения текущего channel_id из URL или DOM
    function getCurrentChannelId() {
        const url = window.location.href;
        const match = url.match(/twitch\.tv\/([^\/]+)/);
        return match ? match[1] : null;
    }
    // Функция для загрузки смайлов для канала
    async function loadEmotesForChannel(channelId) {
        try {
            // Пример: Загружаем метаданные смайлов из локального JSON файла в папке расширения
            const emotesData = await fetch(chrome.runtime.getURL(`emotes/emotes7tvffzbttv_${channelId}/emotes.json`))
                .then(res => res.json());
            // Очищаем списки
            favoriteEmotesList.innerHTML = '';
            channelEmotesList.innerHTML = '';
            // Заполняем списки смайлов
            emotesData.forEach(emote => {
                const emoteHtml = `
          <div class="emote-wrapper">
            <img class="emote-picker__emote-image" 
                 src="${chrome.runtime.getURL(`emotes/emotes7tvffzbttv_${channelId}/${emote.id}/1x.webp`)}" 
                 srcset="${chrome.runtime.getURL(`emotes/emotes7tvffzbttv_${channelId}/${emote.id}/1x.webp`)} 1x, 
                         ${chrome.runtime.getURL(`emotes/emotes7tvffzbttv_${channelId}/${emote.id}/2x.webp`)} 2x, 
                         ${chrome.runtime.getURL(`emotes/emotes7tvffzbttv_${channelId}/${emote.id}/4x.webp`)} 4x" 
                 alt="${emote.name}" 
                 title="${emote.name}"
                 data-emote-id="${emote.id}">
            <button class="favorite-button" data-emote-id="${emote.id}">${emote.isFavorite ? '★' : '☆'}</button>
          </div>
        `;
                if (emote.isFavorite) {
                    favoriteEmotesList.insertAdjacentHTML('beforeend', emoteHtml);
                }
                else {
                    channelEmotesList.insertAdjacentHTML('beforeend', emoteHtml);
                }
            });
            console.log(`[CustomEmotePicker] Loaded emotes for channel ${channelId}`);
        }
        catch (error) {
            console.error(`[CustomEmotePicker] Error loading emotes for channel ${channelId}:`, error);
            window.Notifications?.showIsolatedNotification('Failed to load emotes', 5000);
        }
    }
    // Функция для скачивания и сохранения смайлов (вызывается один раз для канала)
    async function downloadEmotesForChannel(channelId) {
        try {
            // Пример: Запрос к API 7TV (замените на реальные API для BTTV, FFZ)
            const response = await fetch(`https://api.7tv.app/v3/users/twitch/${channelId}`);
            const data = await response.json();
            const emotes = data.emote_set.emotes;
            // Формируем JSON с метаданными смайлов
            const emotesData = emotes.map(emote => ({
                id: emote.id,
                name: emote.name,
                isFavorite: false, // По умолчанию не избранное
            }));
            // Сохраняем метаданные в JSON (в реальной реализации это может быть сложнее)
            console.log(`[CustomEmotePicker] Emotes metadata for ${channelId}:`, emotesData);
            // Скачиваем изображения смайлов
            for (const emote of emotes) {
                const sizes = ['1x', '2x', '4x'];
                for (const size of sizes) {
                    const url = `https://cdn.7tv.app/emote/${emote.id}/${size}.webp`;
                    // Здесь нужен механизм сохранения файлов в папку расширения
                    // Например, через Blob и сохранение в IndexedDB или временное хранилище
                    console.log(`[CustomEmotePicker] Downloading ${url}`);
                }
            }
            // Сохраняем метаданные (в реальной реализации это может быть в IndexedDB)
            localStorage.setItem(`emotes_${channelId}`, JSON.stringify(emotesData));
        }
        catch (error) {
            console.error(`[CustomEmotePicker] Error downloading emotes for ${channelId}:`, error);
        }
    }
    // Функция для обновления панели смайлов
    function updateEmotePicker() {
        const channelId = getCurrentChannelId();
        if (!channelId) {
            console.warn("[CustomEmotePicker] Channel ID not found");
            return;
        }
        // Проверяем, есть ли уже загруженные смайлы
        if (localStorage.getItem(`emotes_${channelId}`)) {
            loadEmotesForChannel(channelId);
        }
        else {
            downloadEmotesForChannel(channelId).then(() => loadEmotesForChannel(channelId));
        }
    }
    // Обработчик клика по смайлу
    favoriteEmotesList.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (img) {
            const emoteName = img.getAttribute('alt');
            insertEmoteIntoChat(emoteName);
        }
    });
    channelEmotesList.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (img) {
            const emoteName = img.getAttribute('alt');
            insertEmoteIntoChat(emoteName);
        }
    });
    // Обработчик для кнопки избранного
    emotePicker.addEventListener('click', (e) => {
        const button = e.target.closest('.favorite-button');
        if (button) {
            const emoteId = button.dataset.emoteId;
            const channelId = getCurrentChannelId();
            const emotesData = JSON.parse(localStorage.getItem(`emotes_${channelId}`)) || [];
            const emote = emotesData.find(e => e.id === emoteId);
            if (emote) {
                emote.isFavorite = !emote.isFavorite;
                localStorage.setItem(`emotes_${channelId}`, JSON.stringify(emotesData));
                updateEmotePicker();
            }
        }
    });
    // Функция для вставки смайла в чат
    function insertEmoteIntoChat(emoteName) {
        const chatInput = document.querySelector('[data-a-target="chat-input"]');
        if (chatInput) {
            const currentValue = chatInput.textContent;
            chatInput.textContent = `${currentValue} ${emoteName} `;
            chatInput.focus();
            console.log(`[CustomEmotePicker] Inserted emote: ${emoteName}`);
        }
        else {
            console.warn("[CustomEmotePicker] Chat input not found");
        }
    }
    // Инициализация панели
    emotePickerButton.addEventListener('click', () => {
        const isVisible = emotePicker.style.display === 'block';
        emotePicker.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            updateEmotePicker();
            const rect = emotePickerButton.getBoundingClientRect();
            emotePicker.style.top = `${rect.bottom + window.scrollY}px`;
            emotePicker.style.left = `${rect.left + window.scrollX}px`;
        }
        console.log(`[CustomEmotePicker] Emote picker ${isVisible ? 'hidden' : 'shown'}`);
    });
    // Отслеживание смены канала
    const observer = new MutationObserver(() => {
        const newChannelId = getCurrentChannelId();
        if (newChannelId !== window.currentChannelId) {
            window.currentChannelId = newChannelId;
            updateEmotePicker();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("[CustomEmotePicker] Custom Emote Picker initialized");
}
//# sourceMappingURL=custom__EmotesPanelPicker.js.map