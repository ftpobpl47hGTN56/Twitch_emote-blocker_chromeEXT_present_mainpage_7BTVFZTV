function makePanelResizable(panel) {
    console.log("[UI] Setting up resizable panel...");
    const handles = panel.querySelectorAll('.resize-handle');
    let isResizing = false;
    let currentHandle = null;
    let startX, startY, startWidth, startHeight, startLeft;
    //------------- Функция для обновления позиций и размеров элементов
    function updateChildElements() {
        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;
        //------------- Устанавливаем CSS-переменные для адаптивности
        panel.style.setProperty('--panel-width', `${panelWidth}px`);
        panel.style.setProperty('--panel-height', `${panelHeight}px`);
        //------------- Проверяем ширину панели для скрытия/показа инпутов
        const isNarrow = panelWidth <= 200; // Панель сжата до 200px или меньше
        //------------- Обновляем ширину #sortContainer
        const sortContainer = document.getElementById('sortContainer');
        if (sortContainer) {
            sortContainer.style.width = `${panelWidth - 225}px`; // Совпадает с #blocked-emotes-list
        }
        //------------- Обновляем ширину #sortchatbanneditemsContainer
        //------------- Обновляем размеры #blocked-emotes-list ----------------- //
        const blockedList = document.getElementById('blocked-emotes-list');
        if (blockedList) {
            const reservedHeight = 250; // Пространство для заголовка, сортировщика, кнопок и отступов
            blockedList.style.width = `${panelWidth - 225}px`; // Учитываем кнопки справа
            blockedList.style.height = `${Math.max(30, panelHeight - reservedHeight)}px`; // Минимум 30px
        }
        //------------- Синхронизированные параметры для всех контейнеров
        const baseBottom = 130 - 30 - 8; // 92px
        const minBottom = 90 - 8; // 82px
        const verticalGap = 10; // Отступ между контейнерами (10px)
        //------------- Обновляем позицию и ширину .theme-selector-container
        const themeSelectorContainer = panel.querySelector('.theme-selector-container');
        if (themeSelectorContainer) {
            themeSelectorContainer.style.bottom = `${Math.max(minBottom, baseBottom * (panelHeight / 735)) + 31}px`; // Поднимаем на 31px
            themeSelectorContainer.style.left = `10px`;
            themeSelectorContainer.style.width = `150px`;
            themeSelectorContainer.classList.toggle('hidden', isNarrow);
            const themeSelect = themeSelectorContainer.querySelector('#theme-select');
            if (themeSelect) {
                const selectWidth = 145;
                themeSelect.style.width = `${selectWidth}px`;
            }
        }
        //------------- Обновляем позицию и ширину .search-input  ----------------- //
        const searchInput = panel.querySelector('.search-input');
        if (searchInput) {
            searchInput.style.bottom = `${Math.max(minBottom, baseBottom * (panelHeight / 735)) + 31}px`; // Поднимаем на 31px
            searchInput.style.left = `165px`; // Отступ от левого края
            searchInput.style.width = `${Math.max(100, panelWidth - 377)}px`; // Минимальная ширина 100px
            searchInput.classList.toggle('hidden', isNarrow);
            const searchInputField = searchInput.querySelector('#search-input');
            const searchButton = searchInput.querySelector('#search-button');
            if (searchInputField && searchButton) {
                const buttonWidth = 80;
                const gap = 10;
                searchInputField.style.width = `${Math.max(50, panelWidth - 290 - buttonWidth - gap)}px`; // Минимальная ширина 50px
                searchButton.style.width = `${buttonWidth}px`;
                searchButton.style.flexShrink = `0`; // Запрещаем сжатие
                searchButton.style.boxSizing = `border-box`; // Учитываем padding и border
            }
        }
        //------------- Обновляем позицию и ширину .input-container  ----------------- //
        const inputContainer = panel.querySelector('.input-container');
        if (inputContainer) {
            inputContainer.style.bottom = `${Math.max(minBottom - verticalGap, (baseBottom - verticalGap) * (panelHeight / 735)) + 31}px`; // Поднимаем на 31px
            inputContainer.style.left = `10px`;
            inputContainer.style.width = `${Math.max(200, panelWidth - 222)}px`; // Минимальная ширина 200px
            inputContainer.classList.toggle('hidden', isNarrow);
            const platformSelect = inputContainer.querySelector('#platform-select');
            const addInput = inputContainer.querySelector('#add-input');
            const addButton = inputContainer.querySelector('#add-button');
            if (platformSelect && addInput && addButton) {
                const selectWidth = 150;
                const buttonWidth = 80;
                const gap = 10;
                platformSelect.style.width = `${selectWidth}px`;
                addButton.style.width = `${buttonWidth}px`;
                addButton.style.flexShrink = `0`; // Запрещаем сжатие
                addButton.style.boxSizing = `border-box`; // Учитываем padding и border
                addInput.style.width = `${Math.max(50, panelWidth - 180 - selectWidth - buttonWidth - 2 * gap)}px`; // Минимальная ширина 50px
            }
        }
        //------------- Обновляем позицию и ширину .hue-rotate-container
        const hueRotateContainer = panel.querySelector('.hue-rotate-container');
        if (hueRotateContainer) {
            inputContainer.style.bottom = `${Math.max(minBottom - 2 * verticalGap, (baseBottom - 2 * verticalGap) * (panelHeight / 735)) + 10}px`; // Ниже на 20px
            hueRotateContainer.style.left = `155px`;
            hueRotateContainer.style.width = `200px`;
            hueRotateContainer.classList.toggle('hidden', isNarrow);
        }
        //------------- Обновляем позицию и размеры .button-container ----------------- //
        const buttonContainer = panel.querySelector('.button-container');
        if (buttonContainer) {
            const reservedHeight = 250; // Синхронизируем с #blocked-emotes-list
            const maxButtonContainerWidth = 180; // 185 - 10px (right) - 10px (отступ от #blocked-emotes-list)
            buttonContainer.style.width = `${Math.max(180, Math.min(maxButtonContainerWidth, panelWidth * 0.25))}px`; // Ограничиваем ширину
            buttonContainer.style.height = `${Math.max(30, panelHeight - reservedHeight)}px`; // Такая же высота, как у #blocked-emotes-list
            buttonContainer.style.maxHeight = `calc(${panelHeight}px - 100px)`; // Сохраняем maxHeight
            buttonContainer.style.bottom = `${Math.max(100, 155 * (panelHeight / 735))}px`; // Сохраняем bottom
            buttonContainer.style.right = `10px`; // Позиционируем справа
            buttonContainer.style.top = `61px`; // Синхронизируем с #blocked-emotes-list
            buttonContainer.style.display = `flex`;
            buttonContainer.style.flexDirection = `column`;
            buttonContainer.style.gap = `30px`; // Сохраняем расстояние между кнопками
        }
        //------------- Обновляем позицию и ширину счетчика #counter ----------------- //
        const counter = panel.querySelector('#counter');
        if (counter) {
            counter.style.maxWidth = `${Math.min(660, 700 * (panelWidth / 750))}px`; // Увеличиваем на 35px
            counter.style.right = `10px`; // Позиция в правом углу
            counter.style.top = `10px`; // Позиция в верхнем углу
        }
        //------------- Обновляем размеры dragHandle ----------------- //
        const dragHandle = panel.querySelector('.drag-handle');
        if (dragHandle) {
            dragHandle.style.width = `${panelWidth - 6}px`; // Учитываем left: 3px
            dragHandle.style.height = `${panelHeight}px`; // Полная высота панели
        }
    }
    handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Предотвращаем перехват другими обработчиками
            isResizing = true;
            currentHandle = handle;
            startX = e.clientX;
            startY = e.clientY;
            const rect = panel.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            startLeft = rect.left;
            document.body.style.userSelect = 'none'; // Отключаем выделение текста
            console.log("[UI] Resizing started with handle:", handle.className);
        });
    });
    document.addEventListener('mousemove', (e) => {
        if (!isResizing)
            return;
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        const minWidth = 200;
        const minHeight = 200;
        const maxWidth = window.innerWidth - 20;
        const maxHeight = window.innerHeight - 20;
        // ------------------------------ Обработка изменения ширины ---------------------------------- //
        if (currentHandle.classList.contains('right')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + (e.clientX - startX)));
        }
        else if (currentHandle.classList.contains('left')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth - (e.clientX - startX)));
            newLeft = startLeft + (e.clientX - startX);
        }
        // ------------------------------ Обработка изменения высоты ---------------------------------- //
        if (currentHandle.classList.contains('bottom')) {
            newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + (e.clientY - startY)));
        }
        else if (currentHandle.classList.contains('top')) {
            newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight - (e.clientY - startY)));
            //------------- Не изменяем top панели
        }
        // ------------------------------ Обработка угловых ручек ---------------------------------- //
        if (currentHandle.classList.contains('top-left')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth - (e.clientX - startX)));
            newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight - (e.clientY - startY)));
            newLeft = startLeft + (e.clientX - startX);
        }
        else if (currentHandle.classList.contains('top-right')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + (e.clientX - startX)));
            newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight - (e.clientY - startY)));
        }
        else if (currentHandle.classList.contains('bottom-left')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth - (e.clientX - startX)));
            newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + (e.clientY - startY)));
            newLeft = startLeft + (e.clientX - startX);
        }
        else if (currentHandle.classList.contains('bottom-right')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + (e.clientX - startX)));
            newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + (e.clientY - startY)));
        }
        //------------- Ограничиваем позицию, чтобы панель не выходила за экран
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - newWidth));
        //------------- Применяем новые размеры и позицию
        panel.style.width = `${newWidth}px`;
        panel.style.height = `${newHeight}px`;
        panel.style.left = `${newLeft}px`;
        //------------- Не трогаем panel.style.top
        //------------- Обновляем размеры и позиции элементов
        updateChildElements();
        //------------- Сохраняем размеры и позицию
        setStorage('panelSize', { width: newWidth, height: newHeight });
        setStorage('panelPosition', { left: newLeft });
    });
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            currentHandle = null;
            document.body.style.userSelect = ''; //---- Восстанавливаем выделение текста
            console.log("[UI] Resizing stopped");
        }
    });
    //------------- Вызываем при инициализации, чтобы синхронизировать размеры и позиции
    updateChildElements();
}
// =============================== end of  makePanelResizable ============================== // 
// ========================================================================================= //
// ========================================================================================== //
// =========== функция и контейнер для перетаскивания панели makePanelDraggable ============= //
function makePanelDraggable(panel) {
    console.log("[UI] Setting up draggable panel...");
    let offsetX = 0, offsetY = 0, isDragging = false;
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.style.cssText = `
        width: ${panel.offsetWidth - 6}px;
        height: ${panel.offsetHeight}px;
        background: transparent;
        cursor: grab;
        position: absolute;
        top: 0px;
        left: 3px;
        z-index: -1;
        border-radius: 8px 8px 0px 0px;

        
 #control-panel,
.modal-content {
        position: fixed;
        background: #1f1f23;
        border-radius: 8px;
        z-index: 10000;
        min-width: 200px; /* Минимальная ширина */
        min-height: 100px; /* Минимальная высота */
        width: 750px; /* Начальная ширина */
        height: 730px; /* Начальная высота */
    }
    `;
    panel.appendChild(dragHandle);
    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
        dragHandle.style.cursor = 'grabbing';
        console.log("[UI] Dragging started");
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging)
            return;
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;
        panel.style.left = `${newLeft}px`;
        panel.style.top = `${newTop}px`;
        setStorage('panelPosition', { left: newLeft, top: newTop });
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            dragHandle.style.cursor = 'grab';
            console.log("[UI] Dragging stopped");
        }
    });
}
//# sourceMappingURL=Draggable_and_Resizable_Panel.js.map