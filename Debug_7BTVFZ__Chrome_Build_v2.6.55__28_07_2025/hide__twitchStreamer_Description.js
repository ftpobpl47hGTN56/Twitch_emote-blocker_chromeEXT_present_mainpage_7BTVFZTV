// Добавляем стили для кнопки и управления видимостью описания
const styles = `
    .Layout-sc-1xcs6mc-0.kXkNAX {
        background: #7fffd400 !important;
    }
   .Layout-sc-1xcs6mc-0.hxpxxi {
    background: #f7000000 !important;
}
    .Layout-sc-1xcs6mc-0.hisUmW { 
        display: none;
        overflow: hidden;
        transition: height 0.3s ease-out;
    }
    .Layout-sc-1xcs6mc-0.hisUmW.expanded {
        display: block; 
        transition: background 0.2s ease;
    }
    .toggle-description-btn {
         background: #9147ff !important;
        color: white;
        border: none;
        padding: 8px 16px;
        margin-left: 8px;
        cursor: pointer;
        border-radius: 4px;
        font-size: var(--deprecated-font-size-6);
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        transition: background 0.2s ease;
    }
    .toggle-description-btn:hover {
         background:rgba(77, 40, 121, 0.64) !important;
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Функция для добавления кнопки
function addToggleButton() {
    // Выбираем контейнер, содержащий кнопку Follow
    const followButtonContainer = document.querySelector('.Layout-sc-1xcs6mc-0.hxpxxi');
    const descriptionContainer = document.querySelector('.Layout-sc-1xcs6mc-0.hisUmW');

    // Проверяем, что контейнеры существуют и кнопка еще не добавлена
    if (followButtonContainer && descriptionContainer && !document.querySelector('.toggle-description-btn')) {
        // Создаем кнопку "Развернуть"
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-description-btn';
        toggleButton.textContent = 'Show description';

        // Добавляем кнопку в контейнер с кнопкой Follow
        followButtonContainer.appendChild(toggleButton);

        // Обработчик клика по кнопке
        toggleButton.addEventListener('click', () => {
            const isExpanded = descriptionContainer.classList.contains('expanded');
            descriptionContainer.classList.toggle('expanded');
            toggleButton.textContent = isExpanded ? 'Show description' : 'Hide description';
        });

        return true; // Успешно добавлено
    }
    return false;
}

// Пробуем добавить кнопку сразу
if (!addToggleButton()) {
    // Если не удалось, используем MutationObserver для отслеживания изменений в DOM
    const observer = new MutationObserver(() => {
        if (addToggleButton()) {
            observer.disconnect(); // Отключаем наблюдатель после успешного добавления
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

export { addToggleButton }; // Экспортируем функцию для использования в других модулях
console.log("[Content] hide__twitchStreamer_Description module initialized");