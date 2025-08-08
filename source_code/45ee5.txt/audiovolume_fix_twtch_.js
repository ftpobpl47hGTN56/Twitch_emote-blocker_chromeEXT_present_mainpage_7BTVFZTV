 
(function () {
    // Предотвращаем многократное выполнение скрипта
    let internalVolumeUpdate = false;
    if (window.customVolumeScriptLoaded) {
        console.log('Скрипт уже загружен, пропускаем повторный запуск');
        return;
    }
    window.customVolumeScriptLoaded = true;
    // Кастомный ключ для chrome.storage.sync
    const VOLUME_KEY = 'twitch__Player____7BTVFZ___Volume';
    // Функция для поиска слайдера
    function getVolumeSlider() {
        console.log('Поиск слайдера громкости...');
        let slider = document.querySelector('[data-a-target="player-volume-slider"]');
        if (slider) {
            console.log('Слайдер найден в обычном DOM:', slider);
            // Проверяем, не скрыт ли слайдер из-за aria-hidden
            if (slider.closest('[aria-hidden="true"]')) {
                console.warn('Слайдер найден, но находится в элементе с aria-hidden="true", возможны проблемы с доступом');
            }
            return slider;
        }
        console.log('Слайдер не найден в обычном DOM, ищем в Shadow DOM...');
        const shadowHosts = document.querySelectorAll('*');
        for (let host of shadowHosts) {
            if (host.shadowRoot) {
                slider = host.shadowRoot.querySelector('[data-a-target="player-volume-slider"]');
                if (slider) {
                    console.log('Слайдер найден в Shadow DOM:', slider);
                    return slider;
                }
            }
        }
        console.log('Слайдер не найден в Shadow DOM, ищем в iframe...');
        const iframes = document.querySelectorAll('iframe');
        for (let iframe of iframes) {
            try {
                slider = iframe.contentDocument?.querySelector('[data-a-target="player-volume-slider"]');
                if (slider) {
                    console.log('Слайдер найден в iframe:', slider);
                    return slider;
                }
            }
            catch (e) {
                console.warn('Ошибка доступа к iframe:', e);
            }
        }
        console.warn('Слайдер громкости не найден ни в DOM, ни в Shadow DOM, ни в iframe');
        return null;
    }
    // Функция для обновления атрибутов слайдера
    function updateSliderAttributes(slider, value) {
        console.log(`Обновление атрибутов слайдера: value=${value}`);
        internalVolumeUpdate = true; // <-- Флаг, что это внутреннее обновление
        slider.setAttribute('aria-valuenow', Math.round(value * 100));
        slider.setAttribute('aria-valuetext', `${Math.round(value * 100)}%`);
        slider.value = value;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
        internalVolumeUpdate = false; // Сброс флага
        const fillElement = slider.parentElement.querySelector('[data-test-selector="tw-range__fill-value-selector"]');
        if (fillElement) {
            fillElement.style.width = `${Math.round(value * 100)}%`;
        }
    }
    // Загрузка сохраненного значения громкости
    function loadVolume(slider) {
        chrome.storage.sync.get([VOLUME_KEY], (result) => {
            const savedVolume = result[VOLUME_KEY];
            console.log(`Загрузка значения из chrome.storage.sync: ${savedVolume}`);
            if (savedVolume !== undefined) {
                const volume = parseFloat(savedVolume);
                const currentVolume = parseFloat(slider.value);
                console.log(`Текущая громкость: ${currentVolume}, сохраненная: ${volume}`);
                if (volume !== currentVolume) {
                    console.log(`Обновляем слайдер до сохраненной громкости: ${volume}`);
                    updateSliderAttributes(slider, volume);
                }
                else {
                    console.log('Текущая громкость совпадает с сохраненной');
                }
            }
            else {
                console.log(`Нет сохраненной громкости, сохраняем текущую: ${slider.value}`);
                saveVolume(slider.value);
            }
        });
    }
    // Сохранение значения громкости
    function saveVolume(value) {
        console.log(`Сохранение громкости: ${value} в ключ ${VOLUME_KEY}`);
        chrome.storage.sync.set({ [VOLUME_KEY]: value }, () => {
            console.log(`Громкость сохранена: ${value}`);
            chrome.storage.sync.get([VOLUME_KEY], (result) => {
                console.log(`Подтверждение сохранения: ${result[VOLUME_KEY]}`);
            });
        });
    }
    // Проверка и исправление бага с громкостью 100%
    function checkAndFixVolumeBug(slider) {
        console.log('Проверка бага с громкостью 100%...');
        const currentVolume = parseFloat(slider.value);
        console.log(`Текущая громкость слайдера: ${currentVolume}`);
        if (currentVolume === 1.0) {
            console.log('Обнаружена громкость 100%, проверяем сохраненное значение...');
            chrome.storage.sync.get([VOLUME_KEY], (result) => {
                const savedVolume = result[VOLUME_KEY];
                if (savedVolume !== undefined) {
                    const volume = parseFloat(savedVolume);
                    if (volume !== 1.0) {
                        console.log(`Баг Twitch: громкость 100%, но сохранено ${volume}. Восстанавливаем...`);
                        updateSliderAttributes(slider, volume);
                    }
                    else {
                        console.log('Громкость 100% соответствует сохраненному значению');
                    }
                }
                else {
                    console.log('Нет сохраненного значения, устанавливаем значение по умолчанию (0.5)');
                    const defaultVolume = 0.05;
                    updateSliderAttributes(slider, defaultVolume);
                    saveVolume(defaultVolume);
                }
            });
        }
        else {
            console.log('Громкость не 100%, баг не обнаружен');
        }
    }
    // Инициализация слайдера
    function initializeSlider(attempt = 1, maxAttempts = 65) {
        console.log(`Попытка инициализации слайдера #${attempt}`);
        const volumeSlider = getVolumeSlider();
        if (!volumeSlider) {
            if (attempt < maxAttempts) {
                console.warn(`Слайдер не найден, повторная попытка через 1 секунду (попытка ${attempt}/${maxAttempts})`);
                setTimeout(() => initializeSlider(attempt + 1, maxAttempts), 1000);
            }
            else {
                console.error('Слайдер не найден после максимального количества попыток');
            }
            return;
        }
        checkAndFixVolumeBug(volumeSlider);
        loadVolume(volumeSlider);
        volumeSlider.addEventListener('input', (event) => {
            if (internalVolumeUpdate) {
                console.log('Пропускаем input из-за внутреннего обновления');
                return;
            }
            const volume = event.target.value;
            console.log(`Слайдер изменен пользователем: новое значение=${volume}`);
            saveVolume(volume);
            updateSliderAttributes(volumeSlider, volume); // Обновляем отображение
        });
        console.log('Обработчик input добавлен к слайдеру');
    }
    // Наблюдатель за изменениями в DOM
    function observeDOM() {
        console.log('Запуск наблюдателя DOM...');
        const observer = new MutationObserver(() => {
            console.log('Обнаружены изменения в DOM, проверка слайдера...');
            const volumeSlider = getVolumeSlider();
            if (volumeSlider) {
                console.log('Слайдер найден через MutationObserver');
                initializeSlider();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    // Обработка смены канала
    function handleChannelChange() {
        console.log('Обработка смены канала...');
        const volumeSlider = getVolumeSlider();
        if (volumeSlider) {
            checkAndFixVolumeBug(volumeSlider);
            loadVolume(volumeSlider);
        }
        else {
            console.warn('Слайдер не найден при смене канала');
        }
    }
    // Запуск скрипта
    function startScript() {
        console.log('Запуск скрипта...');
        if (!chrome.storage) {
            console.error('chrome.storage не поддерживается, требуется расширение Chrome');
            return;
        }
        console.log('chrome.storage поддерживается');
        // Очищаем старые ключи из localStorage
        if (localStorage.getItem('twitch__Player____7BTVFZ___Volume')) {
            console.log('Удаляем старый ключ twitch__Player____7BTVFZ___Volume из localStorage');
            localStorage.removeItem('twitch__Player____7BTVFZ___Volume');
        }
        if (localStorage.getItem(VOLUME_KEY)) {
            console.log(`Удаляем ключ ${VOLUME_KEY} из localStorage`);
            localStorage.removeItem(VOLUME_KEY);
        }
        // Запускаем инициализацию с задержкой 500 в пол секунды
        // применяется сохраненный уровень громкости
        setTimeout(() => {
            console.log('Запуск инициализации слайдера с задержкой...');
            initializeSlider();
            observeDOM();
        }, 500);
        // Отслеживаем изменения URL для смены канала
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                console.log('URL изменился, предполагается смена канала:', currentUrl);
                lastUrl = currentUrl;
                handleChannelChange();
            }
        }).observe(document, { subtree: true, childList: true });
        // Проверяем Twitch API для смены канала
        if (window.Twitch && window.Twitch.Player) {
            console.log('Twitch Player API обнаружен, добавляем обработчик смены канала');
            try {
                const player = new Twitch.Player();
                player.addEventListener(Twitch.Player.CHANNEL_CHANGE, handleChannelChange);
            }
            catch (e) {
                console.warn('Ошибка инициализации Twitch Player:', e);
            }
        }
        else {
            console.log('Twitch API не обнаружен, используем fallback для смены канала');
            document.addEventListener('channelChange', handleChannelChange);
        }
    }
    // Запуск скрипта
    startScript();
})();
//# sourceMappingURL=audiovolume_fix_twtch_.js.map