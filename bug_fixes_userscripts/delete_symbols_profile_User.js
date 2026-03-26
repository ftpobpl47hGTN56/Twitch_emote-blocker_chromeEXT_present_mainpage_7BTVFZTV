// delete_symbols_profile_User.js удаляет символы из профиля карточка юзера //


(function() {
    // Функция дебаунс (debounce) для предотвращения частых вызовов
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Функция обработки имени в профиле зрителя (как в исходном)
    function processViewerName() {
        const linkElement = document.querySelector('.viewer-card-header__display-name h4 a');
        if (linkElement) {
            const originalText = linkElement.textContent.trim();
            console.log('[_Remover_symbols_profile_] Исходный текст в профиле зрителя:', originalText); // Лог для отладки

            // Регулярное выражение для извлечения логина из скобок в конце
            const match = originalText.match(/\(([^)]+)\)$/);
            if (match && match[1]) {
                const login = match[1].trim();
                console.log('[_Remover_symbols_profile_] Извлечённый логин из профиля зрителя:', login); // Лог для отладки

                // Замена текста на чистый логин
                linkElement.textContent = login;
                console.log('[_Remover_symbols_profile_] Текст после замены в профиле зрителя:', linkElement.textContent); // Лог для отладки
            } else {
                console.log('[_Remover_symbols_profile_] Ошибка: Логин в скобках не найден в профиле зрителя:', originalText); // Лог для отладки
            }
        } else {
            console.log('[_Remover_symbols_profile_] Элемент профиля зрителя не найден.'); // Лог для отладки
        }
    }

    // Новая функция обработки заголовка канала (удаление символов и замена на логин из href)
    function processChannelName() {
        const channelLinkElement = document.querySelector('a[href^="/"] h1.CoreText-sc-1txzju1-0.ScTitleText-sc-d9mj2s-0');
        if (channelLinkElement) {
            const originalText = channelLinkElement.textContent.trim();
            const href = channelLinkElement.parentElement.getAttribute('href'); // href из <a>
            console.log('[_Remover_symbols_profile_] Исходный текст в заголовке канала:', originalText); // Лог для отладки
            console.log('[_Remover_symbols_profile_] Href элемента канала:', href); // Лог для отладки

            // Извлечение логина из href (часть после /)
            const loginMatch = href.match(/^\/([^/]+)$/);
            if (loginMatch && loginMatch[1]) {
                const login = loginMatch[1].trim();
                console.log('[_Remover_symbols_profile_] Извлечённый логин из href канала:', login); // Лог для отладки

                // Замена текста на чистый логин (удаляем все не-латинские символы автоматически)
                channelLinkElement.textContent = login;
                console.log('[_Remover_symbols_profile_] Текст после замены в заголовке канала:', channelLinkElement.textContent); // Лог для отладки
            } else {
                console.log('[_Remover_symbols_profile_] Ошибка: Логин не найден в href канала:', href); // Лог для отладки
            }
        } else {
            console.log('[_Remover_symbols_profile_] Элемент заголовка канала не найден.'); // Лог для отладки
        }
    }

    // Общая функция обработки (вызывает обе подфункции)
    function processNames() {
        processViewerName();
        processChannelName();
    }

    // Дебаунсированная версия общей функции
    const debouncedProcess = debounce(processNames, 100);

    // MutationObserver для наблюдения за появлением элементов
    const observer = new MutationObserver(debouncedProcess);
    observer.observe(document.body, { childList: true, subtree: true });

    // Начальный вызов для случая, если элементы уже присутствуют
    processNames();

    console.log('[_Remover_symbols_profile_] Модифицированный скрипт IIFE запущен и наблюдает за DOM.'); // Лог для отладки
})();