(function () {
    'use strict';
    function setupAutoScroll(container) {
        // Проверяем, инициализирован ли SimpleBar
        if (!container.simplebar) {
            console.warn('SimpleBar not initialized for container:', container);
        }
        // Получаем прокручиваемый элемент
        const scrollElement = container.simplebar
            ? container.simplebar.getScrollElement()
            : container.querySelector('.simplebar-content-wrapper') || container;
        if (!scrollElement) {
            console.error('Scroll element not found for container:', container);
            return;
        }
        let isUserScrolledUp = false;
        // Отслеживаем пользовательскую прокрутку
        scrollElement.addEventListener('scroll', () => {
            const isAtBottom = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight < 50;
            isUserScrolledUp = !isAtBottom;
            console.log('Scroll event: isAtBottom=', isAtBottom, 'scrollTop=', scrollElement.scrollTop);
        });
        // Наблюдаем за изменениями в контейнере
        const observer = new MutationObserver(() => {
            if (!isUserScrolledUp) {
                console.log('Auto-scrolling to bottom');
                scrollElement.scrollTop = scrollElement.scrollHeight;
            }
            else {
                console.log('Auto-scroll skipped: user scrolled up');
            }
        });
        // Наблюдаем за добавлением дочерних элементов
        observer.observe(container, {
            childList: true,
            subtree: true
        });
        console.log('Auto-scroll initialized for container:', container);
    }
    // Селектор для контейнера
    const selector = '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--top';
    // Проверяем наличие контейнера
    const container = document.querySelector(selector);
    if (container) {
        setupAutoScroll(container);
        return;
    }
    // Если контейнер не найден, ждём его появления
    console.log('Container not found, starting observer for:', selector);
    const parentObserver = new MutationObserver(() => {
        const container = document.querySelector(selector);
        if (container) {
            console.log('Container found:', container);
            parentObserver.disconnect();
            setupAutoScroll(container);
        }
    });
    // Ограничиваем наблюдение родительским элементом, если возможно
    const parent = document.querySelector('.chat-room') || document.body;
    parentObserver.observe(parent, {
        childList: true,
        subtree: true
    });
})();
//# sourceMappingURL=pratleNot__autoscroll.js.map