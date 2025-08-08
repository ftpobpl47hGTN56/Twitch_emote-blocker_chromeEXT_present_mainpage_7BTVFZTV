// ========== Глобальная функция для отображения уведомлений об ошибках ========== //
// Глобальные флаги для управления уведомлениями
let isGlobalNotificationsEnabled = false;
let isIsolatedNotificationsEnabled = false;
// ================================================================================ //
// notifications.js
const MAX_NOTIFICATIONS = 5; // Максимум 3 уведомления
const NOTIFICATION_HEIGHT = 25; // Фиксированная высота уведомления (из вашего кода)
const NOTIFICATION_GAP = 35; // Отступ между уведомлениями
const NOTIFICATION_INTERVAL = 1000; // Интервал 5 секунд между отображением уведомлений
// Очередь для уведомлений
let notificationQueue = [];
let isProcessingQueue = false;
// Функция для отображения уведомления
const showNotification = (message, duration = 1000, isSuccess = true) => {
    if (!isGlobalNotificationsEnabled) {
        console.log('[Notifications] Глобальные уведомления отключены, пропускаем отображение');
        return;
    }
    // Добавляем уведомление в очередь
    notificationQueue.push({ message, duration, isSuccess });
    console.log('[Notifications] Added to queue:', { message, duration, isSuccess, queueLength: notificationQueue.length });
    // Запускаем обработку очереди, если она не активна
    if (!isProcessingQueue) {
        processNotificationQueue();
    }
};
// Функция для обработки очереди уведомлений
function processNotificationQueue() {
    if (notificationQueue.length === 0) {
        isProcessingQueue = false;
        return;
    }
    isProcessingQueue = true;
    const { message, duration, isSuccess } = notificationQueue[0]; // Берём первое уведомление из очереди
    //Получаем существующие уведомления
    const existingNotifications = document.querySelectorAll('.global-notification');
    // Если достигнуто максимальное количество уведомлений, удаляем самое старое
    if (existingNotifications.length >= MAX_NOTIFICATIONS) {
        const oldestNotification = existingNotifications[0];
        oldestNotification.style.opacity = '0';
        oldestNotification.style.transform = 'scale(0.8)';
        setTimeout(() => {
            oldestNotification.remove();
            console.log('[Notifications] Removed oldest notification:', oldestNotification.innerText);
            // После удаления обновляем позиции оставшихся уведомлений
            updateNotificationPositions();
        }, 300);
    }
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.innerText = message;
    notification.className = `notification global-notification ${isSuccess ? 'success' : 'error'}`;
    notification.style.position = 'fixed';
    notification.style.right = '320px';
    notification.style.backgroundColor = isSuccess ? ' #341d41' : ' #4b1d1d';
    notification.style.color = isSuccess ? ' #30aa54' : ' #ff5555';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    notification.style.zIndex = '10000';
    notification.style.fontSize = '14px';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    notification.style.opacity = '0';
    notification.style.transform = 'scale(0.8)';
    notification.style.maxWidth = '300px';
    // Добавляем уведомление в DOM
    document.body.appendChild(notification);
    // Вычисляем позицию для нового уведомления (сверху вниз)
    const offsetBottom = 10 + (existingNotifications.length * (NOTIFICATION_HEIGHT + NOTIFICATION_GAP));
    notification.style.bottom = `${offsetBottom}px`;
    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'scale(1)';
    }, 10);
    // Анимация исчезновения и удаление
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'scale(0.8)';
        setTimeout(() => {
            notification.remove();
            console.log('[Notifications] Notification removed:', message);
            // После удаления обновляем позиции оставшихся уведомлений
            updateNotificationPositions();
        }, 300);
    }, duration);
    // Удаляем обработанное уведомление из очереди
    notificationQueue.shift();
    // Запускаем следующее уведомление через 5 секунд
    setTimeout(processNotificationQueue, NOTIFICATION_INTERVAL);
}
// Функция для обновления позиций всех уведомлений после удаления
function updateNotificationPositions() {
    const notifications = document.querySelectorAll('.global-notification');
    notifications.forEach((notif, index) => {
        const newBottom = 10 + (index * (NOTIFICATION_HEIGHT + NOTIFICATION_GAP));
        notif.style.transition = 'bottom 0.3s ease, opacity 0.3s ease, transform 0.3s ease';
        notif.style.bottom = `${newBottom}px`;
    });
}
const showPanelNotification = (message, duration = 10000, isSuccess = true) => {
    if (!isGlobalNotificationsEnabled) {
        console.log('[Notifications] Панельные уведомления отключены, пропускаем отображение');
        return;
    }
    console.log('[Notifications] Displaying panel notification:', { message, duration, isSuccess });
    const controlPanel = document.getElementById('control-panel');
    if (!controlPanel) {
        console.error('[Notifications] Control panel not found, falling back to global notification');
        showNotification(message, duration, isSuccess);
        return;
    }
    const notification = document.createElement('div');
    notification.innerText = message;
    notification.className = `notification panel-notification ${isSuccess ? 'success' : 'error'}`;
    notification.style.position = 'absolute';
    notification.style.right = '320px';
    notification.style.backgroundColor = isSuccess ? ' #341d41' : ' #4b1d1d';
    notification.style.color = isSuccess ? 'rgb(54, 192, 96)' : ' #ff5555';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    notification.style.zIndex = '10000';
    notification.style.fontSize = '14px';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    notification.style.opacity = '0';
    notification.style.transform = 'scale(0.8)';
    controlPanel.appendChild(notification);
    const existingNotifications = controlPanel.querySelectorAll('.panel-notification');
    let offsetTop = 10;
    existingNotifications.forEach((notif) => {
        if (notif !== notification) {
            offsetTop += notif.offsetHeight + 10;
        }
    });
    notification.style.top = `${offsetTop}px`;
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'scale(1)';
    }, 10);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'scale(0.8)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
};
const showIsolatedNotification = (message, duration = 900000) => {
    try {
        console.log('[showIsolatedNotification] Вызвана с сообщением:', message);
        if (!isIsolatedNotificationsEnabled) {
            console.log('[showIsolatedNotification] Изолированные уведомления отключены, пропускаем отображение');
            return;
        }
        if (!document.body) {
            console.warn('[showIsolatedNotification] document.body недоступен');
            return;
        }
        const notification = document.createElement('div');
        notification.className = 'isolated-notification';
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '60px';
        notification.style.right = '520px';
        notification.style.backgroundColor = 'rgb(114, 24, 24)';
        notification.style.color = 'rgb(255, 234, 203)';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        notification.style.zIndex = '10000';
        notification.style.fontSize = '14px';
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.opacity = '0';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    catch (error) {
        console.error('[showIsolatedNotification] Ошибка:', error);
    }
};
// ========== Функции для сохранения состояний в chrome.storage.local и  управления уведомлениями
function setGlobalNotificationsEnabled(state) {
    isGlobalNotificationsEnabled = !!state;
    chrome.storage.local.set({ globalNotificationsEnabled: state }, () => {
        console.log(`[Notifications] Global notifications ${state ? 'enabled' : 'disabled'} and saved to storage`);
    });
}
function setIsolatedNotificationsEnabled(state) {
    isIsolatedNotificationsEnabled = !!state;
    chrome.storage.local.set({ isolatedNotificationsEnabled: state }, () => {
        console.log(`[Notifications] Isolated notifications ${state ? 'enabled' : 'disabled'} and saved to storage`);
    });
}
// Функции для получения текущего состояния
function getGlobalNotificationsEnabled() {
    return isGlobalNotificationsEnabled;
}
function getIsolatedNotificationsEnabled() {
    return isIsolatedNotificationsEnabled;
}
// Инициализация состояний из chrome.storage.local
chrome.storage.local.get(['globalNotificationsEnabled', 'isolatedNotificationsEnabled'], (result) => {
    isGlobalNotificationsEnabled = result.globalNotificationsEnabled !== undefined ? result.globalNotificationsEnabled : false;
    isIsolatedNotificationsEnabled = result.isolatedNotificationsEnabled !== undefined ? result.isolatedNotificationsEnabled : false;
    console.log('[Notifications] Initial states loaded from chrome.storage.local:', {
        globalNotificationsEnabled: isGlobalNotificationsEnabled,
        isolatedNotificationsEnabled: isIsolatedNotificationsEnabled
    });
});
// Прикрепляем функции и состояния к глобальному объекту
window.Notifications = {
    showNotification,
    showPanelNotification,
    showIsolatedNotification,
    setGlobalNotificationsEnabled,
    setIsolatedNotificationsEnabled,
    isGlobalNotificationsEnabled: getGlobalNotificationsEnabled,
    isIsolatedNotificationsEnabled: getIsolatedNotificationsEnabled
};
// ========== end of Глобальная функция для отображения уведомлений об ошибках ========== //
//# sourceMappingURL=notifications.js.map