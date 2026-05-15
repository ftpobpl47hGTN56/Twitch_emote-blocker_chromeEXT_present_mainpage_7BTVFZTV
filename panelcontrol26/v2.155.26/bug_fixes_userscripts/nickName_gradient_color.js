 
// === nickName_gradient_color.js ========== //
// обновлен 08 02 2026 теперь у каждоо юзера свой случайный цвет на несколько сообщений

(function () {
    'use strict';

    // ===== Настройки =====
    //   частота обновления градиента у всех никнеймов (мс) — 10 минут
    const UPDATE_INTERVAL = 600000;  // ← Замените старую строку const UPDATE_INTERVAL = 540000; на эту

    // ===== Кэш градиентов по пользователям =====
    const usernameToGradient = new Map();  // ← Добавьте эту строку сразу после настроек

    // ===== Генератор случайного цвета (без белого и чёрного) =====
    function randomColor() {
        const channel = () => Math.floor(Math.random() * 175) + 75;
        return `rgb(${channel()}, ${channel()}, ${channel()})`;
    }

    // ===== Создание градиента из двух случайных цветов =====
    function makeGradient() {
        const c1 = randomColor();
        const c2 = randomColor();
        return `linear-gradient(90deg, ${c1}, ${c2})`;
    }

    // ===== Применение градиента к одному элементу ника =====
    function applyGradientToNickname(el) {
        // Находим контейнер с data-original-username
        const container = el.closest('.custom-nickname-container');
        if (!container || !container.dataset.originalUsername) return;

        const username = container.dataset.originalUsername.toLowerCase();  // ← нормализуем для надёжности

        // Проверяем, есть ли уже градиент для этого пользователя
        let gradient = usernameToGradient.get(username);
        if (!gradient) {
            gradient = makeGradient();
            usernameToGradient.set(username, gradient);
        }

        // Применяем сохранённый (или только что сгенерированный) градиент
        el.style.color = '';
        el.style.backgroundImage = gradient;
        el.style.webkitBackgroundClip = 'text';
        el.style.backgroundClip = 'text';
        el.style.webkitTextFillColor = 'transparent';
    }  // ← Полностью замените старую функцию applyGradientToNickname на эту версию

    // ===== Поиск всех никнеймов =====
    function getAllNickElements() {
        return document.querySelectorAll(
            '.chat-line__username .custom-nickname-container .original-nickname, ' +
            '.chat-line__username .custom-nickname-container .custom-nickname'
        );
    }

    // ===== Применить градиент ко всем найденным никнеймам =====
    function applyAll() {
        const nicknameElements = getAllNickElements();
        nicknameElements.forEach(el => applyGradientToNickname(el));
    }

    // ===== Обновление каждые 10 минут =====
    // Удалите старую строку:
    // setInterval(applyAll, UPDATE_INTERVAL);

    // Добавьте вместо неё этот блок:
    setInterval(() => {
        usernameToGradient.clear();  // Очищаем кэш — все пользователи получат новые цвета
        applyAll();                  // Применяем новые градиенты ко всем видимым никнеймам
    }, UPDATE_INTERVAL);

    // ===== MutationObserver для обработки новых сообщений =====
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (!m.addedNodes) continue;

            m.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;

                const found = node.querySelectorAll(
                    '.chat-line__username .custom-nickname-container .original-nickname, ' +
                    '.chat-line__username .custom-nickname-container .custom-nickname'
                );

                if (found && found.length) {
                    found.forEach(el => applyGradientToNickname(el));
                }
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Первичное применение
    applyAll();
})();

 