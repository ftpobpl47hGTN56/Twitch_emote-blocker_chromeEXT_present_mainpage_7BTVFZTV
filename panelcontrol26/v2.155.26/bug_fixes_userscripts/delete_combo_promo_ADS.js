

/*

 (function () {
  'use strict';

  ////
   // Настройки поиска:
   // - VIDEO_SRC_PART — часть URL видео из вашего HTML; надёжно находит именно этот баннер.
   // - TEXT_MARKER — текстовый маркер в содержимом баннера (будет использован как backup).
   // - CLOSE_BTN_ARIA — aria-label кнопки закрытия (ещё один надёжный индикатор).
   ///
  const VIDEO_SRC_PART = 'combos-are-here.webm';
  const TEXT_MARKER = 'Combos'; // можно поменять на 'Support with Combos' или другой текст
  const CLOSE_BTN_ARIA = 'Close Combos tutorial';

  // Функция, удаляющая конкретный найденный узел (удаляем ближайший "popper" контейнер)
  function removeNodeAndLog(foundNode, reason) {
  if (!foundNode) return false;

  // Поднимаемся вверх до контейнера с data-popper-// или до первого крупного дива
  const container =
    foundNode.closest('[data-popper-reference-hidden], [data-popper-placement], .ScFTUEDialogPopperArrow-sc-rvo3p6-0') ||
    foundNode.closest('div') ||
    foundNode;

  // Проверяем, не является ли контейнер частью попапа настроек
  if (container && (
    container.classList.contains('chat-settings__popover') ||
    container.classList.contains('chat-settings__content') ||
    container.classList.contains('ScBalloonWrapper-sc-14jr088-0') ||
    container.classList.contains('Layout-sc-1xcs6mc-0') ||
    container.querySelector('.chat-settings__popover, .chat-settings__content, .ScBalloonWrapper-sc-14jr088-0, .Layout-sc-1xcs6mc-0')
  )) {
    console.debug('[combo-banner-remover] skipped element — reason: settings popup detected', container);
    return false;
  }

  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
    console.debug('[combo-banner-remover] removed element — reason:', reason, container);
    return true;
  }
  return false;
}

  // Основная проверка/удаление: несколько стратегий для надёжности
  function removeCombosBanner() {
    let removed = false;

    // 1) По видео src (самый надёжный)
    try {
      const vids = document.querySelectorAll('video[src]');
      vids.forEach(v => {
        try {
          if (v.src && v.src.indexOf(VIDEO_SRC_PART) !== -1) {
            if (removeNodeAndLog(v, 'video-src')) removed = true;
          }
        } catch (e) {  }
      });
    } catch (e) {   }

    // 2) По aria-label кнопки закрытия (если кнопка есть — удаляем её контейнер)
    try {
      const closeBtn = document.querySelector(`button[aria-label="${CLOSE_BTN_ARIA}"]`);
      if (closeBtn) {
        if (removeNodeAndLog(closeBtn, 'close-btn-aria')) removed = true;
      }
    } catch (e) {  }

    // 3) По текстовому маркеру внутри (backup — ищем элементы с текстом)
    try {
      if (TEXT_MARKER) {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
          acceptNode(node) {
            if (node.textContent && node.textContent.indexOf(TEXT_MARKER) !== -1) return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_REJECT;
          }
        });
        let n;
        while ((n = walker.nextNode())) {
          // не трогаем большие части сайта — ограничим по классам/размерам: если в найденном элементе есть видео/специфические классы — удаляем
          if (n.querySelector && (n.querySelector('video') || n.querySelector('a[href//="combos"]') || /ScFTUEDialogPopperArrow-sc-/.test(n.className || ''))) {
            if (removeNodeAndLog(n, 'text-marker')) removed = true;
            break;
          } else {
            // если элемент маленький, поднимаемся к родителю и проверяем наличие data-popper-атрибутов
            const parentWithPopper = n.closest('[data-popper-reference-hidden], [data-popper-placement]');
            if (parentWithPopper) {
              if (removeNodeAndLog(parentWithPopper, 'text-marker-parent')) removed = true;
              break;
            }
          }
        }
      }
    } catch (e) {  }

    return removed;
  }

  // Не только единоразово — ставим наблюдатель, чтобы ловить динамически добавляемые баннеры
  const observer = new MutationObserver((mutations) => {
    // при любых изменениях вызываем попытку удаления
    // можно оптимизировать: проверять только добавленные узлы — но для простоты вызываем основную функцию
    removeCombosBanner();
  });

  // Запуск: моментально и наблюдатель
  function start() {
    // первичная попытка удаления (если уже на странице)
    removeCombosBanner();

    // наблюдаем body (если не готово — наблюдаем документ)
    const target = document.body || document.documentElement;
    try {
      observer.observe(target, { childList: true, subtree: true });
      console.debug('[combo-banner-remover] observer started');
    } catch (e) {
      console.warn('[combo-banner-remover] observer failed to start', e);
    }

    // на всякий случай: периодическая попытка (защищённый запас), можно отключить
    const interval = setInterval(() => {
      const did = removeCombosBanner();
      // если долго нет баннера — не отключаем (безопаснее оставить), но можно остановить через таймаут
    }, 2000);

    // если хотите — можно остановить observer через N секунд:
    // setTimeout(()=>{ observer.disconnect(); clearInterval(interval); console.debug('stopped'); }, 60_000);
  }

  start();

})();  

*/