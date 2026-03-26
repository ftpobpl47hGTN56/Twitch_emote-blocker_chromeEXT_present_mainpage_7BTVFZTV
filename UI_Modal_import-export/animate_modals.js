

// ================= Функция для анимации открытия и закрытия модального окна ======================= //
function animateModalOpen(modal, callback) {
    console.log("[UI] Opening modal with animation...");
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
        modal.classList.add('active');
        if (callback)
            callback();
    });
}
function animateModalClose(modal, callback) {
    console.log("[UI] Animating modal close...");
    modal.style.transition = 'opacity 0.3s';
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        if (callback)
            callback();
        //---------- Убрали вызов updateCounter, так как он вызывается в importData или importBlockedItems
        console.log("[UI] Modal closed");
    }, 300);
}
// ========================= end of animateModalOpen/Close ================================= //
// ================================================================================ //


// ================================================================================ //
// ================= Функция для анимации открытия модального окна charts js ========================= //
function animateModalOpen(modal, callback) {
    modal.style.display = 'flex'; // Показываем окно
    modal.style.opacity = '0'; // Начальная прозрачность
    modal.style.transform = 'translateY(-100%)'; // Начальное положение выше экрана
    const duration = 300; // Длительность анимации в миллисекундах
    const startTime = performance.now();
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Прогресс от 0 до 1
        //------------- Используем функцию ease-in-out для плавности
        const ease = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        modal.style.opacity = ease; // Прозрачность от 0 до 1
        modal.style.transform = `translateY(${(1 - ease) * -100}%)`; // Движение сверху вниз
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
        else {
            modal.style.opacity = '1';
            modal.style.transform = 'translateY(0)';
            modal.classList.add('visible');
            if (callback)
                callback(); // Вызываем callback (например, для рендера графика)
        }
    }
    requestAnimationFrame(animate);
}
// ================================================================================== //
// ====================== анимация chart js модального окна animateModalOpen ======================= //


// ================================================================================== //
// Функция для анимации закрытия модального окна
function animateModalClose(modal, callback) {
    modal.style.opacity = '1'; // Начальная прозрачность
    modal.style.transform = 'translateY(0)'; // Начальное положение
    const duration = 300; // Длительность анимации в миллисекундах
    const startTime = performance.now();
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Прогресс от 0 до 1
        // Используем функцию ease-in-out для плавности
        const ease = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        modal.style.opacity = 1 - ease; // Прозрачность от 1 до 0
        modal.style.transform = `translateY(${ease * -100}%)`; // Движение вверх
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
        else {
            modal.style.display = 'none'; // Скрываем после анимации
            modal.classList.remove('visible');
            if (callback)
                callback();
        }
    }
    requestAnimationFrame(animate);
}
// ================= end of анимация chart js модального окна animateModalClose ====================== //
