


( function() {
    'use strict';

    // Функция debounce для предотвращения множественных вызовов
    function debounce( func, delay ) {
        let timeoutId;
        return function( ...args ) {
            clearTimeout( timeoutId );
            timeoutId = setTimeout( () => func.apply( this, args ), delay );
        };
    }

    // Функция для установки качества видео
    function setVideoQuality() {
        const key = 'video-quality';
        const desiredValue = { default: '1080p60' };
        let currentValue = localStorage.getItem( key );

        if ( currentValue ) {
            try {
                const parsed = JSON.parse( currentValue );
                if ( parsed.default !== '1080p60' ) {
                    localStorage.setItem( key, JSON.stringify( desiredValue ) );
                    console.log( 'Качество видео установлено на 1080p60' );
                } else {
                    console.log( 'Качество видео уже 1080p60' );
                }
            } catch ( e ) {
                // Если не JSON, перезаписываем
                localStorage.setItem( key, JSON.stringify( desiredValue ) );
                console.log( 'Значение перезаписано на 1080p60 (невалидный формат)' );
            }
        } else {
            localStorage.setItem( key, JSON.stringify( desiredValue ) );
            console.log( 'Значение установлено на 1080p60 (было отсутствующим)' );
        }
    }

    // Debounced версия
    const debouncedSetQuality = debounce( setVideoQuality, 500 );

    // Выполняем сразу и при загрузке DOM
    debouncedSetQuality();

    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', debouncedSetQuality );
    } else {
        debouncedSetQuality();
    }

    // Для перезапуска на новой странице: этот IIFE можно добавить как bookmarklet или в userscript для Twitch.
    // В userscript укажите @match https://www.twitch.tv/*

} )();






