(function () {
    function limitMentionSpam() {
        // Находим все контейнеры сообщений
        const messageContainers = document.querySelectorAll('.chat-line__message-container');

        messageContainers.forEach(container => {
            // Находим все элементы упоминаний внутри контейнера
            const mentions = container.querySelectorAll('.chat-line__message-mention');
            
            // Условие для определения спама (например, более 1 упоминания)
            if (mentions.length > 1) { // Уменьшил с 5 до 1 для теста
                // Применяем стили с большей специфичностью
                container.style.maxHeight = '150px';
                container.style.overflowY = 'auto'; 
                container.style.background = 'linear-gradient(180deg, rgb(46, 22, 51), rgb(24, 57, 80)';
                container.style.border = '2px solid #3d958c';
                container.style.borderRadius = '8px'; 
                container.style.position = 'absolute'; 
                container.style.top = '10px';  
                container.style.right = '8px';
                container.style.width = '100%'; 
            }
        });
    }

    // Запускаем функцию сразу для существующих сообщений
    limitMentionSpam();

    // Наблюдаем за новыми сообщениями в чате
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                limitMentionSpam();
            }
        });
    });

    // Настраиваем наблюдатель за DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();