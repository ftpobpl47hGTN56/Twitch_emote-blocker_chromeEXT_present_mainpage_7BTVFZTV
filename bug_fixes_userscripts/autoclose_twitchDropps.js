
(function() {
    'use strict';

    // Обновлённая функция для имитации клика на нескольких кнопках
function imitateClickMultiple(selector) {
    const buttons = document.querySelectorAll(selector);
    if (buttons.length === 0) {
        console.error('Элементы не найдены по селектору:', selector);
        return;
    }

    // Массив промисов для параллельного выполнения (если обработчики асинхронные)
    const promises = Array.from(buttons).map(button => {
        return new Promise((resolve) => {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            button.dispatchEvent(clickEvent);
            console.log('Клик имитирован для элемента:', button);
            resolve(); // Разрешаем промис сразу после dispatch
        });
    });

    // Выполняем все клики параллельно
    Promise.all(promises).then(() => {
        console.log(`Имитировано кликов: ${buttons.length}`);
    }).catch(error => {
        console.error('Ошибка при имитации кликов:', error);
    });
}

// Пример вызова: для всех кнопок удаления уведомлений
imitateClickMultiple('button[aria-label="delete-notification"]');

// Альтернатива, если селектор на data-атрибут: 
// imitateClickMultiple('[data-test-selector="persistent-notification__delete"] button');
})();