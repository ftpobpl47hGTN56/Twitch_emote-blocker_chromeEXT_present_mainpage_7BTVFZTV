 
// ==================== Функция для отображения графика статистики (без Chart.js) ========================= //

function showStatsChart(canvas) {
    console.log("[Stats_chart] showStatsChart called with canvas:", canvas);
    // console.log("[Stats_chart] blockedEmotes:", blockedEmotes);
    // console.log("[Stats_chart] blockedChannels:", blockedChannels);
    if (!canvas) {
        console.warn("[Stats_chart] Stats chart canvas not found");
        return;
    }

    const currentTheme = uiElements?.themeSelect?.value || 'default';
    const isLightTheme = currentTheme === 'lightMode';

    // Цвета для платформ (без изменений)
    const platformColors = {
        TwitchChannel: {
            background: isLightTheme ? 'rgba(145, 70, 255, 0.8)' : 'rgba(145, 70, 255, 0.6)',
            border: 'rgb(227, 218, 240)' 
        },
        '7tv': {
            background: isLightTheme ? '#477592' : '#477592',
            border: 'rgb(92, 189, 184)' 
        },
        bttTV: {
            background: isLightTheme ? 'rgba(255, 87, 51, 0.8)' : 'rgba(255, 87, 51, 0.6)',
            border: 'rgb(233, 156, 69)',
        },
        ffz: {
            background: isLightTheme ? ' #364040' : ' #364040',
            border: ' #749292' 
        }
    };

    // Данные для графика (без изменений)
    const platforms = ['TwitchChannel', '7tv', 'bttTV', 'ffz'];
    const emoteCounts = platforms.map(platform => blockedEmotes.filter(e => e.platform === platform).length +
        blockedChannels.filter(c => c.platform === platform).length);

    // Цвета текста в зависимости от темы
    const textColor = isLightTheme ? ' #333333' : ' #FFFFFF';

    // Уничтожаем существующий график (если был)
    if (canvas.chart) {
        canvas.chart.destroy();
        canvas.chart = null;
    }

    // ИСПРАВЛЕНИЕ: Очистка предыдущих элементов перед созданием новых
    // Удаляем старый контейнер, если он существует (предотвращает дублирование)
    let existingContainer = document.getElementById('stats-bars-container');
    if (existingContainer) {
        existingContainer.remove();
        console.log("[Stats_chart] Removed existing stats-bars-container to prevent duplication");
    }
    // Удаляем старый заголовок, если он существует (по ID)
    let existingTitle = document.getElementById('stats-title-7btvfz-h35he5-hweshrhrs');
    if (existingTitle) {
        existingTitle.remove();
        console.log("[Stats_chart] Removed existing stats-title to prevent duplication");
    }

    // Очищаем canvas (делаем его невидимым, чтобы использовать место для баров)
    canvas.style.display = 'none';

    // Создаём контейнер для баров (вставляем после canvas)
    const container = document.createElement('div');
    container.id = 'stats-bars-container';
    container.style.cssText = `
        position: relative;
        top: 330px;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 300px; /* Фиксированная высота для графика */
        font-family: Arial, sans-serif;
    `;
    canvas.parentNode.insertBefore(container, canvas.nextSibling);

    // Заголовок (аналог title из Chart.js)
    const title = document.createElement('h3');
    title.id = 'stats-title-7btvfz-h35he5-hweshrhrs';  // ID для лёгкой очистки
    title.textContent = 'Blocked Emotes and Channels by Platform';
    title.style.cssText = `margin: 0 0 10px 0;
    position: relative;
    top: -325px;
    font-size: 16px; 
    font-weight: bold;
    text-align: center;`;
    container.appendChild(title);

    // Максимальное значение для масштабирования
    const maxValue = Math.max(...emoteCounts, 1); // Минимум 1, чтобы избежать деления на 0

    // Контейнер для осей и баров
    const chartWrapper = document.createElement('div');
    chartWrapper.style.cssText = `
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        width: 100%;
        height: 100%;
        position: relative;
    `;
    container.appendChild(chartWrapper);

    // Ось Y (метка)
    const yAxisLabel = document.createElement('div');
     yAxisLabel.id = 'count-text-title-bcb4ex5ybrd';
    yAxisLabel.textContent = 'Количество';
    yAxisLabel.style.cssText = `
        writing-mode: vertical-rl;
        text-orientation: mixed;
        margin-right: 10px;
        font-weight: bold;
        align-self: flex-end;
    `;
    chartWrapper.appendChild(yAxisLabel);

    // Генерация вертикальных баров
    platforms.forEach((platform, index) => {
        const count = emoteCounts[index];
        const color = platformColors[platform];

        const barWrapper = document.createElement('div');
        barWrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 15px;
            min-width: 60px;
        `;

        // Подпись платформы (аналог labels)
        const label = document.createElement('div');
         label.id = 'platform-title-xy7g4fgn8-he5';
        label.textContent = platform;
        label.style.cssText = `
        margin-bottom: 5px; 
        font-weight: bold; 
        text-align: center; 
        font-size: 16px;
        `;

        // Бар
        const bar = document.createElement('div');
        bar.style.cssText = `
            width: 130px;
            height: ${(count / maxValue) * 435}px; /* Масштаб до 435px */
            background: ${color.background};
            border: 2px solid ${color.border};
            border-radius: 4px 4px 0 0;
            transition: height 0.3s ease;
            position: relative;
        `;

        // Значение на вершине бара
        const topValue = document.createElement('div');
        topValue.id = 'stats-value-text-cntr';
        topValue.textContent = count;
        topValue.style.cssText = `
            position: absolute;
            top: -70px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 20px;
            font-weight: bold;
            background: rgba(87, 64, 100, 0.8);
            padding: 2px 4px;
            border-radius: 2px;
        `;
        bar.appendChild(topValue);

        barWrapper.appendChild(label);
        barWrapper.appendChild(bar);
        chartWrapper.appendChild(barWrapper);
    });

    // Ось X (пустая для симметрии)
    const xAxisPlaceholder = document.createElement('div');
    xAxisPlaceholder.style.cssText = 'margin-left: 10px;';
    chartWrapper.appendChild(xAxisPlaceholder);

    console.log("[Stats_chart] Stats bars rendered with data:", emoteCounts);
}
    
 