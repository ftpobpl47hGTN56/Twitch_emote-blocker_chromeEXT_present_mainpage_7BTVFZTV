(function() {
    const css = `

 /*-------- twitch_main_Styles_but_Better.css ---------*/

/*--------- Twitch Main color button -------------- */ 
.ffz__tooltip {
    background: linear-gradient(205deg, rgb(64, 111, 118), rgb(59, 29, 71)) !important;
    color: #59d3c3 !important;
    font-size: 16px !important;
} 
 
button.ScCoreButton-sc-ocjdkq-0 {
    border: 1px solid  rgb(155 220 173 / 50%) !important;
    border-radius: 35px !important;
    color: rgb(155 220 173) !important;
    background: #152b2c !important;
} 
a.ScCoreButton-sc-ocjdkq-0  {
   border: 1px solid  rgb(155 220 173 / 50%) !important;
    border-radius: 35px !important;
    color: rgb(155 220 173) !important;
    background: #152b2c !important;
}

 

a.ScCoreButton-sc-ocjdkq-0:hover {
    border: 1px solid  rgb(208 211 179) !important;
    border-radius: 35px !important;
    color:  rgb(208 211 179) !important;
    background: #041213 !important;
} 

/*--------- Twitch "show less/more" text color button -------------- */ 

span.CoreText-sc-1txzju1-0.fomEUL {
    color: rgb(155 220 173) !important;
}

.Layout-sc-1xcs6mc-0.ljigeK {
    color: #c3becb !important;
}
 

span.ScAnimatedNumber-sc-1iib0w9-0 {
    color: rgb(155 220 173) !important;
}

.Layout-sc-1xcs6mc-0.lghjmR {
    color: rgb(155 220 173) !important;
}

 

 span.ScAnimatedNumber-sc-1iib0w9-0 {
    color: rgb(155 220 173) !important;
}

.Layout-sc-1xcs6mc-0.lghjmR {
    color: rgb(155 220 173) !important;
}

p.CoreText-sc-1txzju1-0.ScTitleText-sc-d9mj2s-0.bqyYtA.lbYztg.InjectLayout-sc-1i43xsx-0.irzZLq.tw-title {
    span.ScAnimatedNumber-sc-1iib0w9-0 {
    color: rgb(155 220 173) !important;
}

.Layout-sc-1xcs6mc-0.lghjmR {
    color: rgb(155 220 173) !important;
  } 
}

span.CoreText-sc-1txzju1-0.iYHgOf {
    color: rgb(165 181 169) !important;
}

strong.CoreText-sc-1txzju1-0.iYHgOf {
    color: #a893c8 !important;
}

.ButtonIconFigure-sc-1emm8lf-0.lnTwMD {
    color: rgb(155 220 173) !important;
}

 
svg {
    color: rgb(155 220 173) !important;
} 

.side-nav__overlay-wrapper {
    background: linear-gradient(180deg, rgb(36, 20, 46), rgb(11, 39, 40)) !important;
}
 

.channel-info-content {
    background: linear-gradient(180deg, rgb(36, 20, 46), rgb(11, 39, 40)) !important;
}
 
div#community-tab-content {
    background: linear-gradient(0deg, rgb(36, 20, 46), rgb(11, 39, 40)) !important;
}

.ScRangeFillContainer-sc-q01wc3-2.diueRz {
    background: #8768b4 !important;
}

 
.ScRangeFillValue-sc-q01wc3-3.isXtHy {
    background: #69be80 !important;
}
 
a.ScCoreButton-sc-ocjdkq-0.kJMgAB {
    color: rgb(155, 220, 173) !important;
    border-width: 1px !important;
    border-style: solid !important;
    border-color: rgba(155, 220, 173, 0.5) !important;
    border-image: initial !important;
    border-radius: 35px !important;
    background: rgb(24 44 59) !important;
}

.tw-root--theme-dark .side-nav-card__link:hover {
     background-color: rgb(49 80 44) !important;
     border: 2px solid #cdb4e2 !important;
     color: #cdb4e2 !important;
     border-radius: 25px  !important;
}
/*----------------------  Ш И Р И Н А CHAT-LIST --------------------------*/
/*----------------------  СОКРЩАЕМ ШИРИНУ ЧАТ КОНТЕЙНЕРА --------------------------*/

/* .chat-list--default {
    width: 350px  !important;
    max-width: 360px !important;
} 

/*----------------------  СОКРЩАЕМ ШИРИНУ ЧАТ КОНТЕЙНЕРА --------------------------*/
/*----------------------  Ш И Р И Н А CHAT-LIST --------------------------*/

.scrollable-area::-webkit-scrollbar  {
    width: 0px !important; 
} 

 .tw-root--theme-dark .side-nav-card__link:focus-visible,
.tw-root--theme-dark .side-nav-card__link:hover {
    background-color: rgb(60, 44, 80) !important;
    border: 2px solid #cdb4e2 !important;
    color: #cdb4e2 !important;
      border-radius: 25px  !important;
}

.tw-root--theme-light .side-nav-card__link:focus-visible,
.tw-root--theme-light .side-nav-card__link:hover {
    background-color: rgb(60, 44, 80) !important;
    border: 2px solid #cdb4e2 !important;
    color: #cdb4e2 !important;
      border-radius: 25px  !important;
}
 

      
.chat-input-tray__open:hover {
  animation: fadeIn 0.5s cubic-bezier(0.33, 0, 0, 1) forwards;
}
/*----------- Для сообщений реплай ------------*/ 


 /*------- сообщения внутри ------*/ 
.chat-replies-list__container {
    max-height: 980px !important;
    height: 480px !important; 
}

 
 .chat-input-tray__open--persistent {
     opacity: 0.1;
     will-change: opacity;
}

 /*------- анимируем скрытие с помощью опасити Followers-Only Chat ------*/
 /*------- анимируем скрытие с помощью опасити Followers-Only Chat ------*/ 

        .chat-input-tray__open--persistent:hover {
        animation: fadeIn 0.5s cubic-bezier(0.33, 0, 0, 1) forwards;
        }

        .chat-input-tray__open--persistent:not(:hover) {
        animation: fadeOut 0.5s cubic-bezier(0.33, 0, 0, 1) forwards;
        }

        @keyframes fadeIn {
        from {
            opacity: 0.1;
        }
        to {
            opacity: 1;
        }
        }

        @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0.1;
        }
        }

 /*------- анимируем скрытие с помощью опасити Followers-Only Chat ------*/
 /*------- анимируем скрытие с помощью опасити Followers-Only Chat ------*/


/* --------- кнопка "  Chat Paused Due to Scroll" ---------- */
/* --------- кнопка "  Chat Paused Due to Scroll" ---------- */

.tw-absolute.tw-border-radius-medium.tw-bottom-0.tw-c-background-overlay.tw-c-text-overlay.tw-mg-b-1 {
    position: relative !important;
    z-index: 999999999 !important;
    background-color: rgb(14 32 25) !important;
    border: 2px solid #65a29b !important; 
      border-radius: 25px  !important;
}

.tw-absolute.tw-border-radius-medium.tw-bottom-0.tw-c-background-overlay.tw-c-text-overlay.tw-mg-b-1:hover {
    position: relative !important;
    z-index: 999999999 !important;
    background-color: rgb(37 22 43) !important;
    border: 2px solid #65a29b !important; 
      border-radius: 25px  !important;
}

.tw-flex-grow-0:hover { 
    color: #c2b2d9 !important;
}
.tw-flex-grow-0 {
    color: #e0bd7a !important;
}
    
/*--- поднимаем чуть чуть выше кнопку chat-paused-footer*/
 
        .chat-scrollable-area__message-container {
            position: relative !important;
            top: -40px !important;
            padding-bottom: 1rem !important;
        }
 

        .chat-paused-footer {
            position: relative !important;
            width: 200px !important;
            height: 45px !important;
            top: -45px !important;
            opacity: 0.5 !important;
            background: rgb(60, 39, 82) !important;
        }

        button.ScCoreButton-sc-ocjdkq-0:hover {
            border: 1px solid  rgb(155 220 173 / 50%) !important;
            border-radius: 35px !important;
            color: rgb(208 211 179) !important;
            background: #041213 !important;
            height: 45px !important;
        }

        p.CoreText-sc-1txzju1-0.irZUBM {
            font-size: 16px  !important;
        }

/* --------- кнопка "  Chat Paused Due to Scroll" ---------- */
/* --------- кнопка "  Chat Paused Due to Scroll" ---------- */

 /*--- опускаем весь контейнер чата чуть чуть ниже  для кнопки chat-paused-footer*/
    .chat-list--default {
        position: relative  !important;
        top: 45px  !important;
    }
        

/*--- chat-reply-ffz-fix-reply-line-message.css -------- */

/*======== разворот при наведении и сворачивание для реплай сообщения что бы не засорять чат==========*/
 
.ffz--fix-reply-line {
    max-height: 43px !important; /* Высота по умолчанию для свёрнутого состояния */
    overflow: hidden !important; /* Скрываем содержимое, превышающее max-height */
    transition: max-height 0.3s ease !important; /* Плавная анимация раскрытия */
}

.ffz--fix-reply-line:hover {
    max-height: 200px !important; 
    /* Максимальная высота при раскрытии (достаточно большая, чтобы вместить весь контент) */
}
/*---- полупрозрачность маска для реплаев --------*/
.ffz--fix-reply-line {
    mask-image: linear-gradient(to bottom, black 60%, #ad282800 100%) !important;
    -webkit-mask-image: linear-gradient(to bottom, black 60%, #cb202000 100%) !important;
}
/*------- FFZ FIX REPLY Реплай стиль контейнер раскрывается при навдении ------*/
p.CoreText-sc-1txzju1-0.iWlGez {
    max-width: 280px !important;
    width: 270px !important;
}
p.CoreText-sc-1txzju1-0.iWlGez {
    white-space: normal !important;
    word-break: break-word !important;
    overflow: visible !important;
    background: #1a413d !important;  
    border: solid 2px !important;  
    border-radius: 12px !important;  
    padding: 5px !important;  
}

/*============= .ffz--fix-reply button ==============*/
.ffz--hover-actions.ffz-action-data.tw-mg-r-05 {
    z-index: 555555 !important;
} 
/*============= .ffz--fix-reply button ==============*/

strong.chat-line__message-mention.ffz--pointer-events {
    color: #9575a9   !important;
    background: #0d201e   !important;
    border-radius: 7px   !important;
    padding: 4px   !important;
    border: 1px solid   !important;
}

span.text-fragment {
    color: #cacaca   !important;
}

/*--- chat-reply-ffz-fix-reply-line-message.css -------- */



/*-------- twitch_main_Styles_but_Better.css ---------*/

/*--------- Twitch Main color button -------------- */ 


 /*---chat-room фон чата -----*/
    .tw-root--theme-dark .clmgr-table__row, 
    .tw-root--theme-dark .sunlight-expanded-nav-drop-down-menu-layout__scrollable-area, 
    .tw-root--theme-dark .stream-manager--page-view .mosaic-window-body, 
    .tw-root--theme-dark .emote-grid-section__header-title, 
    .tw-root--theme-dark .ach-card, 
    .tw-root--theme-dark .ach-card--expanded .ach-card__inner, 
    .tw-root--theme-dark .room-upsell, 
    .tw-root--theme-dark .chat-room, 
    .tw-root--theme-dark .video-chat, 
    .tw-root--theme-dark .qa-vod-chat, 
    .tw-root--theme-dark .extensions-popover-view-layout, 
    .tw-root--theme-dark .modview-dock-widget__preview__body>div, 
    .tw-root--theme-dark .carousel-metadata, 
    .tw-root--theme-dark .video-card, 
        html .clmgr-table__row, 
        html .sunlight-expanded-nav-drop-down-menu-layout__scrollable-area, 
        html .stream-manager--page-view .mosaic-window-body, 
        html .emote-grid-section__header-title, 
        html .ach-card, 
        html .ach-card--expanded .ach-card__inner, 
        html .room-upsell, 
        html .chat-room, 
        html .video-chat, 
        html .qa-vod-chat, 
        html .extensions-popover-view-layout, 
        html .modview-dock-widget__preview__body>div, 
        html .carousel-metadata, 
        html .video-card {
            background: #0b1617 !important;
    }
/*---chat-room фон чата -----*/ 

button.ScCoreButton-sc-ocjdkq-0 {
    border: 1px solid  rgb(155 220 173 / 50%) !important;
    border-radius: 35px !important;
    color: rgb(155 220 173) !important;
    background: #152b2c !important;
}



a.ScCoreButton-sc-ocjdkq-0  {
   border: 1px solid  rgb(155 220 173 / 50%) !important;
    border-radius: 35px !important;
    color: rgb(155 220 173) !important;
    background: #152b2c !important;
}

 

a.ScCoreButton-sc-ocjdkq-0:hover {
    border: 1px solid  rgb(208 211 179) !important;
    border-radius: 35px !important;
    color:  rgb(208 211 179) !important;
    background: #041213 !important;
} 

/*--------- Twitch "show less/more" text color button -------------- */ 

span.CoreText-sc-1txzju1-0.fomEUL {
    color: rgb(155 220 173) !important;
}

.Layout-sc-1xcs6mc-0.ljigeK {
    color: #c3becb !important;
}
 

span.ScAnimatedNumber-sc-1iib0w9-0 {
    color: rgb(155 220 173) !important;
}

.Layout-sc-1xcs6mc-0.lghjmR {
    color: rgb(155 220 173) !important;
}

 

 span.ScAnimatedNumber-sc-1iib0w9-0 {
    color: rgb(155 220 173) !important;
}

.Layout-sc-1xcs6mc-0.lghjmR {
    color: rgb(155 220 173) !important;
}

p.CoreText-sc-1txzju1-0.ScTitleText-sc-d9mj2s-0.bqyYtA.lbYztg.InjectLayout-sc-1i43xsx-0.irzZLq.tw-title {
    span.ScAnimatedNumber-sc-1iib0w9-0 {
    color: rgb(155 220 173) !important;
}

.Layout-sc-1xcs6mc-0.lghjmR {
    color: rgb(155 220 173) !important;
  } 
}

span.CoreText-sc-1txzju1-0.iYHgOf {
    color: rgb(165 181 169) !important;
}

strong.CoreText-sc-1txzju1-0.iYHgOf {
    color: #a893c8 !important;
}

.ButtonIconFigure-sc-1emm8lf-0.lnTwMD {
    color: rgb(155 220 173) !important;
}

 
svg {
    color: rgb(155 220 173) !important;
} 

.side-nav__overlay-wrapper {
    background: linear-gradient(180deg, rgb(36, 20, 46), rgb(11, 39, 40)) !important;
}
 

.channel-info-content {
    background: linear-gradient(180deg, rgb(36, 20, 46), rgb(11, 39, 40)) !important;
}
 
div#community-tab-content {
    background: linear-gradient(0deg, rgb(36, 20, 46), rgb(11, 39, 40)) !important;
}

.ScRangeFillContainer-sc-q01wc3-2.diueRz {
    background: #8768b4 !important;
}

 
.ScRangeFillValue-sc-q01wc3-3.isXtHy {
    background: #69be80 !important;
}
 
a.ScCoreButton-sc-ocjdkq-0.kJMgAB {
    color: rgb(155, 220, 173) !important;
    border-width: 1px !important;
    border-style: solid !important;
    border-color: rgba(155, 220, 173, 0.5) !important;
    border-image: initial !important;
    border-radius: 35px !important;
    background: rgb(24 44 59) !important;
}

.tw-root--theme-dark .side-nav-card__link:hover {
     background-color: rgb(49 80 44) !important;
     border: 2px solid #cdb4e2 !important;
     color: #cdb4e2 !important;
     border-radius: 25px  !important;
}
/*----------------------  Ш И Р И Н А CHAT-LIST --------------------------*/
/*----------------------  СОКРЩАЕМ ШИРИНУ ЧАТ КОНТЕЙНЕРА --------------------------*/

/* .chat-list--default {
    width: 350px  !important;
    max-width: 360px !important;
} 

/*----------------------  СОКРЩАЕМ ШИРИНУ ЧАТ КОНТЕЙНЕРА --------------------------*/
/*----------------------  Ш И Р И Н А CHAT-LIST --------------------------*/

.scrollable-area::-webkit-scrollbar  {
    width: 0px !important; 
} 



/*-------------- video player-settings ------------------*/
 
.Layout-sc-1xcs6mc-0.dUABLR {
    background: #0e1a1a !important;
    border: 1px solid  !important;
    border-radius: 6px !important;
    color: #7cc5a8 !important;
}

  

button.ScInteractableBase-sc-ofisyf-0:hover {
   background: #261c38 !important;
    border: 1px solid  !important;
    border-radius: 6px !important;
    color: #7cc5a8 !important;
}
/*-------------- video player-settings ------------------*/


/*-------------------- hide sub gifted SPAM IN CHAT ------------*/

 /* Скрываем контейнер user-notice-line */
        div[data-test-selector="user-notice-line"] {
            display: none !important;
        }
                
    .ffz--subscribe-line.ffz-notice-line.user-notice-line.tw-pd-y-05 {
        display: none!important;
    }

    
    .ffz--subscribe-line.ffz-notice-line.user-notice-line.tw-pd-y-05 {
        display: none !important;
    }

    .gift-highlight-gradient-container {
        display: none !important;
    }

    
    .community-highlight {
        display: none !important;
    } 
    .Layout-sc-1xcs6mc-0.eynKOr {
        display: none !important;
    }

    .ffz--points-line.tw-pd-l-1.tw-pd-r-2.ffz-custom-color.ffz--points-highlight.ffz-notice-line.user-notice-line.tw-pd-y-05 {
        display: none !important;
    }
    a.ffz-tooltip.link-fragment {
        word-break: break-word !important;
    }  
    .channelLeaderboardHeaderRotating__users--eqqYb {
        display: none !important;
    }
        
 /*-------------------- hide sub gifted SPAM IN CHAT ------------*/

    `;
    
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);


})();



 