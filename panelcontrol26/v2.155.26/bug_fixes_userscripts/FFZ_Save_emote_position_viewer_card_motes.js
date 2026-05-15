// FFZ_Save_emote_position_viewer_card_motes.js //
// FFZ_Save_emote_position_viewer_card_motes.js //
// FFZ_Save_emote_position_viewer_card_motes.js //
// FFZ_Save_emote_position_viewer_card_motes.js //
// FFZ_Save_emote_position_viewer_card_motes.js //
// FFZ_Save_emote_position_viewer_card_motes.js //

// FFZ_Save_emote_position_viewer_card_motes.js //
(function() {
    // Храним последние ручные координаты
    let customPosition = {
        left: null,
        top: null,
        wasMoved: false
    };

    // Функция установки позиции
    function setCardPosition(card) {
        if (customPosition.wasMoved && customPosition.left) {
            // Если карточку двигали - ставим на последнее известное положение
            card.style.left = customPosition.left + 'px';
            if (customPosition.top) {
                card.style.top = customPosition.top + 'px';
            }
        } else {
            // Иначе - на дефолтное (1085px)
            card.style.left = '1085px';
        }
    }

    // Отслеживаем перемещения
    function trackMovement(card) {
        let startX, startY;
        
        card.addEventListener('mousedown', function(e) {
            startX = e.clientX;
            startY = e.clientY;
            
            const moveHandler = function(e) {
                customPosition = {
                    left: parseInt(card.style.left) || 1085,
                    top: parseInt(card.style.top) || 666,
                    wasMoved: true
                };
            };
            
            const upHandler = function() {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            };
            
            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
        });
    }

    // Наблюдатель за появлением карточки
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                    const card = node.nodeType === 1 ? 
                        (node.matches('.ffz-viewer-card') ? node : node.querySelector('.ffz-viewer-card')) :
                        null;
                    
                    if (card) {
                        setTimeout(() => {
                            setCardPosition(card);
                            trackMovement(card);
                        }, 50);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Проверка при загрузке
    function init() {
        const card = document.querySelector('.ffz-viewer-card');
        if (card) {
            setCardPosition(card);
            trackMovement(card);
        }
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();







/*
(function() {
    // Храним последние ручные координаты
    let customPosition = {
        left: null,
        top: null,
        wasMoved: false
    };

    // Функция установки позиции
    function setCardPosition(card) {
        if (customPosition.wasMoved && customPosition.left) {
            // Если карточку двигали - ставим на последнее известное положение
            card.style.left = customPosition.left + 'px';
            if (customPosition.top) {
                card.style.top = customPosition.top + 'px';
            }
        } else {
            // Иначе - на дефолтное (1085px)
            card.style.left = '1085px';
        }
    }

    // Отслеживаем перемещения
    function trackMovement(card) {
        let startX, startY;
        
        card.addEventListener('mousedown', function(e) {
            startX = e.clientX;
            startY = e.clientY;
            
            const moveHandler = function(e) {
                customPosition = {
                    left: parseInt(card.style.left) || 1085,
                    top: parseInt(card.style.top) || 666,
                    wasMoved: true
                };
            };
            
            const upHandler = function() {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            };
            
            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
        });
    }

    // Наблюдатель за появлением карточки
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                    const card = node.nodeType === 1 ? 
                        (node.matches('.ffz-viewer-card') ? node : node.querySelector('.ffz-viewer-card')) :
                        null;
                    
                    if (card) {
                        setTimeout(() => {
                            setCardPosition(card);
                            trackMovement(card);
                        }, 50);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Проверка при загрузке
    function init() {
        const card = document.querySelector('.ffz-viewer-card');
        if (card) {
            setCardPosition(card);
            trackMovement(card);
        }
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})(); */