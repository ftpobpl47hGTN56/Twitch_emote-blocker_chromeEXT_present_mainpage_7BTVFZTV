// Скрипт для изменения цвета логинов в чате Twitch colorizer_username_twichchat.js //


// Функция для генерации случайного цвета, исключая rgb(131, 128, 128)
// Функция для генерации случайного светлого цвета в формате RGB

(function () {
  let logBuffer = [];
  const LOG_FLUSH_INTERVAL = 1 * 60 * 1000;

  function bufferedLog(message) {
    logBuffer.push(`[${new Date().toLocaleTimeString()}] ${message}`);
  }

  function flushLogs() {
    if (logBuffer.length > 0) {
      console.log(logBuffer.join('\n'));
      logBuffer = [];
    }
  }

  setInterval(flushLogs, LOG_FLUSH_INTERVAL);

  function normalizeColor(color) {
    if (!color) return null;
    if (color === 'white') return 'rgb(255, 255, 255)';
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return color;
  }
// чтобы генератор не создавал чёрный (хотя он и невозможен из-за диапазона 150–255),
  function isNeutral(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max - min < 30;
}

  function generateRandomLightColor(excludeColor) {
    let r, g, b;
   do {
  r = Math.floor(Math.random() * 106) + 150;
  g = Math.floor(Math.random() * 106) + 150;
  b = Math.floor(Math.random() * 106) + 150;
} while (`rgb(${r}, ${g}, ${b})` === excludeColor || isNeutral(r, g, b));
    bufferedLog(`Сгенерирован светлый цвет: rgb(${r}, ${g}, ${b})`);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function isDarkColor(rgb) {
    const match = rgb?.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return false;
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance < 100;
  }

  function brightenColor(rgb) {
    const match = rgb?.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return rgb;
    let r = parseInt(match[1], 10);
    let g = parseInt(match[2], 10);
    let b = parseInt(match[3], 10);
    r = Math.max(150, Math.min(255, Math.floor(r * 1.3)));
    g = Math.max(150, Math.min(255, Math.floor(g * 1.3)));
    b = Math.max(150, Math.min(255, Math.floor(b * 1.3)));
    const newColor = `rgb(${r}, ${g}, ${b})`;
    bufferedLog(`Осветлен цвет с ${rgb} до ${newColor}`);
    return newColor;
  }

  function updateUsernameColors() {
   const targetColors = ['rgb(128, 128, 128)', 'rgb(255, 255, 255)', 'rgb(255, 253, 253)'];
    const excludeColor = 'rgb(131, 128, 128)';
    const selectors = [
      'span[style*="color:"]',
      'div[style*="color:"]',
      '[style*="color: rgb(255, 255, 255)"]',
      '[style*="color: white"]'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    bufferedLog(`Запуск обновления цветов. Найдено ${elements.length} элементов.`);

    elements.forEach((element, index) => {
      const currentColor = normalizeColor(element.style.color);
      if (!currentColor) {
        bufferedLog(`Элемент ${index + 1} (${element.className}): Цвет не определен`);
        return;
      }

      if (targetColors.includes(currentColor)) {
        const newColor = generateRandomLightColor(excludeColor);
        element.style.color = newColor;
        bufferedLog(`Элемент ${index + 1} (${element.className}): Цвет изменен с ${currentColor} на ${newColor}`);
      } else if (isDarkColor(currentColor)) {
        const newColor = brightenColor(currentColor);
        element.style.color = newColor;
      } else {
        bufferedLog(`Элемент ${index + 1} (${element.className}): Цвет ${currentColor} не изменен`);
      }
    });
  }

  updateUsernameColors();
  const observer = new MutationObserver(updateUsernameColors);
  observer.observe(document.body, { childList: true, subtree: true });
})();