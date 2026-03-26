// emote_preview_.js //

// ====== оригинал модуля отделен от update_List и оптимизирован  ====== // 
// ====== 24.10.2025   ====== //

(function() {
    'use strict';
    
    // Глобальный контейнер превью (если не существует)
    let previewContainer = document.querySelector('.emote-preview-container');
    if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.className = 'emote-preview-container';
        Object.assign(previewContainer.style, {
            position: 'absolute',
            display: 'none',
            background: 'rgb(16, 79, 83)',
            padding: '5px',
            borderRadius: '4px',
            pointerEvents: 'none',
            maxWidth: '150px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        });
        document.body.appendChild(previewContainer);
    }
    
    // Кэш для загруженных изображений (WeakMap для автоматической GC)
    const imageCache = new WeakMap();
    
    // Дебаунс для обновления позиции (используем requestAnimationFrame для синхронизации с рендерингом)
    let rafId = null;
    function updatePosition(x, y) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const boundedX = Math.min(x + 10, window.innerWidth - 150);
            const boundedY = Math.min(y + 10, window.innerHeight - 150);
            previewContainer.style.left = `${boundedX}px`;
            previewContainer.style.top = `${boundedY}px`;
            rafId = null;
        });
    }
    
    function addEmotePreviewHandlers(item, emoteLink) {
        if (!item.emoteUrl || item.platform === 'TwitchChannel') {
            return;
        }
        
        // Удаляем старые обработчики, если они есть (избегаем дублей)
        emoteLink.removeEventListener('mouseover', handleMouseOver);
        emoteLink.removeEventListener('mouseout', handleMouseOut);
        emoteLink.removeEventListener('mousemove', handleMouseMove);
        
        function handleMouseOver(e) {
            const url = item.emoteUrl;
            if (!url) return;
            
            // Проверяем кэш
            let img = imageCache.get(url);
            if (!img) {
                img = new Image();
                img.src = url;
                img.alt = 'Emote Preview';
                img.style.maxWidth = '100px';
                img.style.maxHeight = '100px';
                img.onerror = () => {
                    previewContainer.innerHTML = '<span style="color: white; font-size: 12px;">Не удалось загрузить изображение</span>';
                    previewContainer.style.display = 'block';
                };
                img.onload = () => {
                    // Очищаем контейнер и добавляем новое изображение
                    previewContainer.innerHTML = '';
                    previewContainer.appendChild(img);
                    previewContainer.style.display = 'block';
                    updatePosition(e.clientX, e.clientY);
                };
                // Сохраняем в кэш только после успешной загрузки
                imageCache.set(url, img);
            } else {
                // Из кэша: сразу показываем
                previewContainer.innerHTML = '';
                previewContainer.appendChild(img.cloneNode(true)); // Клонируем, чтобы не перемещать оригинал
                previewContainer.style.display = 'block';
                updatePosition(e.clientX, e.clientY);
            }
        }
        
        function handleMouseOut() {
            previewContainer.style.display = 'none';
            // Очищаем контейнер: удаляем дочерние элементы явно
            while (previewContainer.firstChild) {
                previewContainer.removeChild(previewContainer.firstChild);
            }
        }
        
        function handleMouseMove(e) {
            if (previewContainer.style.display === 'block') {
                updatePosition(e.clientX, e.clientY);
            }
        }
        
        // Навешиваем обработчики
        emoteLink.addEventListener('mouseover', handleMouseOver);
        emoteLink.addEventListener('mouseout', handleMouseOut);
        emoteLink.addEventListener('mousemove', handleMouseMove);
    }
    
    // Экспорт в глобальную область
    window.addEmotePreviewHandlers = addEmotePreviewHandlers;
    
})();