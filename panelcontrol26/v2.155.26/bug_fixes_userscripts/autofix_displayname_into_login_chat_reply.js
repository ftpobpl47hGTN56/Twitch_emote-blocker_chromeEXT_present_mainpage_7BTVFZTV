
/*


(function () {
  
  // Кэш для не латинских ников
  const pendingLogins = new Map(); // Map<nonLatinLogin, [{message, mentionElement}]>

  // Проверка на не латинские символы
  function isNonLatin(text) {
    return /[^a-zA-Z0-9_]/.test(text);
  }

  // Нормализация текста (удаление невидимых символов и пробелов)
  function normalizeText(text) {
    return text?.trim().replace(/[\u200B-\u200D\uFEFF]/g, '') || '';
  }

  // Поиск реального логина
  function findRealLogin(nonLatinLogin) {
    const normalizedNonLatinLogin = normalizeText(nonLatinLogin);
    console.log(`[findRealLogin] Поиск логина для "${normalizedNonLatinLogin}" (оригинал: "${nonLatinLogin}")`);

    // Проверяем обе структуры: Chrome и Firefox
    const usernameContainers = document.querySelectorAll('.chat-line__username');
    console.log(`[findRealLogin] Найдено контейнеров .chat-line__username: ${usernameContainers.length}`);

    for (const container of usernameContainers) {
      // Chrome: .chat-author__display-name и .chat-author__intl-login
      const displayNameElement = container.querySelector('.chat-author__display-name');
      const intlLoginElement = container.querySelector('.chat-author__intl-login');
      const displayName = normalizeText(displayNameElement?.textContent);
      const intlLogin = intlLoginElement ? normalizeText(intlLoginElement.textContent).replace(/[\(\)\s]/g, '') : null;

      // Firefox: .custom-nickname-container и .original-nickname
      const customNicknameContainer = container.querySelector('.custom-nickname-container');
      const originalNickname = customNicknameContainer?.querySelector('.original-nickname')?.textContent?.trim();
      const customNickname = customNicknameContainer?.dataset?.originalUsername || displayName;

      console.log(`[findRealLogin] Проверяем: displayName="${displayName}", intlLogin="${intlLogin || 'не найден'}", customNickname="${customNickname || 'не найден'}", originalNickname="${originalNickname || 'не найден'}"`);

      // Проверяем Chrome-структуру
      if (displayName && displayName === normalizedNonLatinLogin && intlLogin) {
        console.log(`[findRealLogin] Найден реальный логин (Chrome) для "${normalizedNonLatinLogin}": "${intlLogin}"`);
        return intlLogin;
      }
      // Проверяем Firefox-структуру
      if (customNickname && customNickname === normalizedNonLatinLogin && originalNickname) {
        console.log(`[findRealLogin] Найден реальный логин (Firefox) для "${normalizedNonLatinLogin}": "${originalNickname}"`);
        return originalNickname;
      }
    }
    console.log(`[findRealLogin] Реальный логин для "${normalizedNonLatinLogin}" не найден`);
    return null;
  }

  // Обработка одного сообщения
  function processMessage(message, index) {
    try {
      console.log(`[processMessage=login=fix] Обработка сообщения ${index + 1}...`);

      // Логин отправителя (для логов)
      const displayNameElement = message.querySelector('.chat-author__display-name');
      const intlLoginElement = message.querySelector('.chat-author__intl-login');
      const customNicknameContainer = message.querySelector('.custom-nickname-container');
      const displayName = normalizeText(displayNameElement?.textContent);
      const senderLogin = intlLoginElement
        ? normalizeText(intlLoginElement.textContent).replace(/[\(\)\s]/g, '')
        : customNicknameContainer?.querySelector('.original-nickname')?.textContent?.trim() || displayName;
      console.log(`[processMessage=login=fix] Сообщение ${index + 1}: Логин отправителя - "${senderLogin || 'не найден'}"`);

      // Проверяем упоминание
      const mentionElement = message.querySelector('.chat-line__message-mention[data-login]');
      if (mentionElement) {
        const mentionedLogin = normalizeText(mentionElement.textContent?.slice(1));
        const dataLogin = normalizeText(mentionElement.dataset.login);
        console.log(`[processMessage=login=fix] Сообщение ${index + 1}: Упоминание - @${mentionedLogin}, data-login - "${dataLogin}"`);

        if (isNonLatin(mentionedLogin) || isNonLatin(dataLogin)) {
          const realLogin = findRealLogin(dataLogin || mentionedLogin);
          if (realLogin) {
            console.log(`[processMessage=login=fix] Сообщение ${index + 1}: Заменяем @${mentionedLogin} и data-login="${dataLogin}" на @${realLogin}`);
            mentionElement.textContent = `@${realLogin}`;
            mentionElement.dataset.login = realLogin;
          } else {
            console.log(`[processMessage=login=fix] Сообщение ${index + 1}: Реальный логин для @${mentionedLogin} не найден, добавляем в ожидание`);
            if (!pendingLogins.has(dataLogin || mentionedLogin)) {
              pendingLogins.set(dataLogin || mentionedLogin, []);
            }
            pendingLogins.get(dataLogin || mentionedLogin).push({ message, mentionElement });
          }
        } else {
          console.log(`[processMessage=login=fix] Сообщение ${index + 1}: Упоминание и data-login латинские`);
        }
      } else {
        console.log(`[processMessage=login=fix] Сообщение ${index + 1}: Упоминание не найдено`);
      }
    } catch (error) {
      console.error(`[processMessage=login=fix] Ошибка в сообщении ${index + 1}:`, error);
    }
  }

  // Проверка новых сообщений для обновления кэша
  function checkPendingLogins(newMessage) {
    const usernameContainer = newMessage.querySelector('.chat-line__username');
    if (!usernameContainer) return;

    const displayNameElement = usernameContainer.querySelector('.chat-author__display-name');
    const intlLoginElement = usernameContainer.querySelector('.chat-author__intl-login');
    const customNicknameContainer = usernameContainer.querySelector('.custom-nickname-container');
    const displayName = normalizeText(displayNameElement?.textContent);
    const originalLogin = intlLoginElement
      ? normalizeText(intlLoginElement.textContent).replace(/[\(\)\s]/g, '')
      : customNicknameContainer?.querySelector('.original-nickname')?.textContent?.trim();
    if (!displayName || !originalLogin) return;

    console.log(`[checkPendingLogins] Новое сообщение: displayName="${displayName}", originalLogin="${originalLogin}"`);
    if (pendingLogins.has(displayName)) {
      console.log(`[checkPendingLogins] Найден реальный логин "${originalLogin}" для "${displayName}"`);
      const pendingItems = pendingLogins.get(displayName);
      pendingItems.forEach(({ message, mentionElement }, index) => {
        console.log(`[checkPendingLogins] Обновление ожидающего сообщения ${index + 1}...`);
        if (mentionElement) {
          console.log(`[checkPendingLogins] Обновляем упоминание @${normalizeText(mentionElement.textContent.slice(1))} на @${originalLogin}`);
          mentionElement.textContent = `@${originalLogin}`;
          mentionElement.dataset.login = originalLogin;
        }
      });
      pendingLogins.delete(displayName);
      console.log(`[checkPendingLogins] Удалён "${displayName}" из ожидающих, осталось: ${pendingLogins.size}`);
    }
  }

  // Обработка всех сообщений
  function replaceNonLatinLogins() {
    console.log('[replaceNonLatinLogins] Запуск обработки сообщений...');
    const messages = document.querySelectorAll('.chat-line__message.tw-relative');
    console.log(`[replaceNonLatinLogins] Найдено сообщений: ${messages.length}`);
    if (messages.length === 0) {
      console.log('[replaceNonLatinLogins] Контейнер чата:', document.querySelector('[data-test-selector="chat-scrollable-area__message-container"]')?.outerHTML);
    }
    messages.forEach((message, index) => {
      processMessage(message, index);
      checkPendingLogins(message);
    });
    // Повторная проверка через 2 секунды для асинхронного DOM
    setTimeout(replaceNonLatinLogins, 2000);
  }

  // Дебансинг для MutationObserver
  let debounceTimeout;
  function debouncedReplaceNonLatinLogins(mutations) {
    console.log('[debouncedReplaceNonLatinLogins] MutationObserver сработал, мутации:', mutations.length);
    mutations.forEach((mutation, index) => {
      console.log(`[debouncedReplaceNonLatinLogins] Мутация ${index + 1}:`, {
        addedNodes: Array.from(mutation.addedNodes).map(node => node.outerHTML || node.textContent)
      });
    });
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      console.log('[debouncedReplaceNonLatinLogins] Дебансированный вызов replaceNonLatinLogins');
      replaceNonLatinLogins();
    }, 200);
  }

  // Инициализация наблюдателя
  function initChatObserver() {
    const chatContainer = document.querySelector('[data-test-selector="chat-scrollable-area__message-container"]');
    if (chatContainer) {
      console.log('[initChatObserver] Найден контейнер чата, начинаем наблюдение');
      const observer = new MutationObserver(debouncedReplaceNonLatinLogins);
      observer.observe(chatContainer, { childList: true, subtree: true });
      replaceNonLatinLogins(); // Немедленный запуск
      return true;
    } else {
      console.log('[initChatObserver] Контейнер чата не найден, пробуем снова через 1 сек');
      return false;
    }
  }

  // Ждём контейнер чата
  let attempts = 0;
  const maxAttempts = 30;
  const checkChatContainer = setInterval(() => {
    attempts++;
    if (initChatObserver() || attempts >= maxAttempts) {
      clearInterval(checkChatContainer);
      if (attempts >= maxAttempts) {
        console.warn('[checkChatContainer] Контейнер чата не найден после 30 попыток');
      }
    }
  }, 1000);

  // Старт при загрузке страницы
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[DOMContentLoaded] Страница загружена, ищем контейнер чата');
    initChatObserver();
  });
})();

 
*/