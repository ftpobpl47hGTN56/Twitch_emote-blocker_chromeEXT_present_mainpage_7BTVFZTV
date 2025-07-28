// panel__Settings.js
function makeModalResizable(modal) {
    const resizeHandle = modal.querySelector('.modal-resize-handle');
    const modalContent = modal.querySelector('.modal-content');

    if (!resizeHandle || !modalContent) {
        console.error("[UI] Modal resize handle or content not found", { resizeHandle, modalContent });
        return;
    }

    let isResizing = false;
    let initialX, initialY, initialWidth, initialHeight;

    resizeHandle.addEventListener('mousedown', startResizing);

    function startResizing(e) {
        if (e.button !== 0) return; // Только левая кнопка мыши
        e.stopPropagation(); // Предотвращаем запуск других обработчиков
        e.preventDefault(); // Предотвращаем выделение текста
        isResizing = true;
        initialX = e.clientX;
        initialY = e.clientY;
        const rect = modalContent.getBoundingClientRect();
        initialWidth = rect.width;
        initialHeight = rect.height;
        document.body.style.userSelect = 'none'; // Отключаем выделение текста
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
        console.log("[UI] Resizing started for settings modal");
    }

    function resize(e) {
        if (isResizing) {
            e.preventDefault();
            const newWidth = initialWidth + (e.clientX - initialX);
            const newHeight = initialHeight + (e.clientY - initialY);

            // Минимальные и максимальные размеры
            const minWidth = 300;
            const minHeight = 200;
            const maxWidth = window.innerWidth - 20;
            const maxHeight = window.innerHeight - 20;

            // Ограничиваем размеры
            modalContent.style.width = `${Math.max(minWidth, Math.min(newWidth, maxWidth))}px`;
            modalContent.style.height = `${Math.max(minHeight, Math.min(newHeight, maxHeight))}px`;

            console.log("[UI] Resizing settings modal: ", { width: newWidth, height: newHeight });
        }
    }

    function stopResizing() {
        isResizing = false;
        document.body.style.userSelect = ''; // Восстанавливаем выделение текста
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResizing);
        console.log("[UI] Resizing stopped for settings modal");
    }
}
 
