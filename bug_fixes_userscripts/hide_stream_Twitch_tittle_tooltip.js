// ==UserScript==
// @name          hide_stream_title_tooltip 
// @description   Скрывает тултипы заголовков стримов при ховере на сайдбар, с фиксом состояний и debounce
// @match         *://*/*
// @run-at        document-end
// ==/UserScript==
 
(function() {
    const TOOLTIP_SELECTOR = '.tw-balloon';
  const CONTAINER_SELECTOR = '.side-nav__scrollable_content';
  const SETTINGS_POPUP_SELECTOR = '.ScBalloonWrapper-sc-14jr088-0.kwRewi.InjectLayout-sc-1i43xsx-0.kCsLVM.tw-balloon';
  const HIDDEN_CLASS = 'tooltip-hidden';
  const EXCLUSION_SELECTORS = [
    '.ScBalloonWrapper-sc-14jr088-0.kwRewi.InjectLayout-sc-1i43xsx-0.kCsLVM.tw-balloon', // исключение для настроек
    '.tw-balloon:has(.reward-center__content)',
    '.tw-balloon:has([data-test-selector="chat-rules-close-button"])', // "Правила чата" Новое исключение для чата  
    '.ScBalloonWrapper-sc-14jr088-0.PjurZ.InjectLayout-sc-1i43xsx-0.bAWxnr.tw-balloon', 
    '.ScBalloonWrapper-sc-14jr088-0.kpgZBi.InjectLayout-sc-1i43xsx-0.dduVcl.tw-balloon', // точный для попапа языков (по   HTML)
    '.tw-balloon:has([data-a-target="message-limit-selector"])', // основной для кнопки лимита
    '.tw-balloon:has(#message-limit-j6rtk6rur5-section)', // по ID секции (если ID не меняется)
    '.tw-balloon:has(input[type="number"][min="1"]) ~ .Layout-sc-1xcs6mc-0', // для контейнера инпута
    '[data-a-target="dropdown-language-selection"]', // прямой по data-a-target (не только в .tw-balloon)
  ];  

  const style = document.createElement('style');
  style.textContent = `${TOOLTIP_SELECTOR}.${HIDDEN_CLASS} { display: none !important; }`;
  document.head.appendChild(style);
  
  let hideTimer = null;
  let isCollapsed = false;
  let debounceTimer = null;
  let isMouseInSidebar = false; // ИЗМЕНЕНИЕ: флаг для отслеживания положения мыши

  function isExcluded(element) {
    return EXCLUSION_SELECTORS.some(selector => element.closest(selector));
  }
  
  function debounce(func, delay) {
    return function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(func, delay);
    };
  }
  
  function hideTooltips() {
    document.querySelectorAll(TOOLTIP_SELECTOR).forEach(el => {
      if (!isExcluded(el)) {
        el.classList.add(HIDDEN_CLASS);
      }
    });
  }
  
  function showTooltips() {
    if (isCollapsed || isMouseInSidebar) return; // ИЗМЕНЕНИЕ: не показывать, если сайдбар свёрнут или мышь в нём
    document.querySelectorAll(TOOLTIP_SELECTOR).forEach(el => {
      if (!isExcluded(el)) {
        el.classList.remove(HIDDEN_CLASS);
      }
    });
  }
  
  function setupHoverLogic() {
    const container = document.querySelector(CONTAINER_SELECTOR);
    if (!container) return;
    
    container.removeEventListener('mouseenter', handleMouseEnter);
    container.removeEventListener('mouseleave', handleMouseLeave);
    
    // ИЗМЕНЕНИЕ: убираем debounce для hide, вызываем сразу
    function handleMouseEnter() {
      isMouseInSidebar = true; // ИЗМЕНЕНИЕ: устанавливаем флаг
      clearTimeout(hideTimer);
      hideTooltips(); // Немедленное скрытие
    }
    
    // ИЗМЕНЕНИЕ: упрощаем debouncedShow, убираем дублирующую задержку
    const debouncedShow = debounce(() => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        isMouseInSidebar = false; // ИЗМЕНЕНИЕ: сбрасываем флаг при показе
        showTooltips();
   },3600000); // ============= 1 час
    }, 100); // Короткий debounce для избежания спама вызовов
    
    function handleMouseLeave() {
      isMouseInSidebar = false; // ИЗМЕНЕНИЕ: сбрасываем флаг
      debouncedShow();
    }
    
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    setupToggleListeners();
    setupGlobalClickListener();
  }
  
  function setupToggleListeners() {
    const showLessBtn = document.querySelector('[data-test-selector="ShowLess"]');
    if (showLessBtn) {
      showLessBtn.removeEventListener('click', handleShowLess);
      function handleShowLess() {
        isCollapsed = true;
        clearTimeout(hideTimer);
        hideTooltips();
      }
      showLessBtn.addEventListener('click', handleShowLess);
    }
    
    const showMoreBtn = document.querySelector('[data-test-selector="ShowMore"]');
    if (showMoreBtn) {
      showMoreBtn.removeEventListener('click', handleShowMore);
      function handleShowMore() {
        isCollapsed = false;
      }
      showMoreBtn.addEventListener('click', handleShowMore);
    }
  }
  
  function setupGlobalClickListener() {
    document.removeEventListener('click', handleGlobalClick);
    function handleGlobalClick(e) {
      if (isCollapsed) {
        hideTooltips();
        return;
      }
      const isClickInSidebar = e.target.closest(CONTAINER_SELECTOR);
      const isClickInExcluded = EXCLUSION_SELECTORS.some(selector => e.target.closest(selector));

      if (!isClickInSidebar && !isClickInExcluded) {
        clearTimeout(hideTimer);
        hideTooltips();
        // ИЗМЕНЕНИЕ: сбрасываем флаг мыши и таймер показа после клика
        isMouseInSidebar = false;
      }
    }
    document.addEventListener('click', handleGlobalClick, true);
  }
  
  function initObserver() {
    let lastUrl = location.href;
    
    new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(setupHoverLogic, 1000);
      }
    }).observe(document, { subtree: true, childList: true });
    
    setupHoverLogic();
    
    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(CONTAINER_SELECTOR) && !document.querySelector(`${TOOLTIP_SELECTOR}.${HIDDEN_CLASS}`)) {
        observer.disconnect();
        setupHoverLogic();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ИЗМЕНЕНИЕ: новый observer для динамически появляющихся тултипов
    const tooltipObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && (node.matches && node.matches(TOOLTIP_SELECTOR) || node.querySelector(TOOLTIP_SELECTOR))) {
            const tooltip = node.matches(TOOLTIP_SELECTOR) ? node : node.querySelector(TOOLTIP_SELECTOR);
            if (tooltip && !isExcluded(tooltip) && (isCollapsed || isMouseInSidebar)) {
              hideTooltips(); // Сразу скрываем новые тултипы в нужном состоянии
            }
          }
        });
      });
    });
    tooltipObserver.observe(document.body, { childList: true, subtree: true });
  }
  
  // start //
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }
})();