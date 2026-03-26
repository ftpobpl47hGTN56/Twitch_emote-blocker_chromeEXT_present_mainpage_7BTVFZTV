


// ffz_compressor_range_css_fix.js //

(function() {

// content.js
window.addEventListener('load', () => {
    const style = document.createElement('style');
    style.textContent = `
       .tw-border-radius-large.ffz-range__fill-value.ffz--gain-value {
    background: rgb(75, 255, 195) !important;
    height: 3px !important;
}

  .ffz-range__fill {  
     height: 17px !important;  
  }
      

.ffz--player-gain
.volume-slider__slider-container
.tw-relative
.ffz-il-tooltip__container { 
    height: 2px; /* Толщина полоски */
    border-radius: 3px; /* Уберите скругление, если нужна четкая линия */
    position: relative !important;
    z-index: 100000 !important;
    left: 130px !important;
} 
 .ffz-range::-webkit-slider-runnable-track {
    cursor: pointer;
    height: .2rem;  
    height: 2px!important;
    border-radius: 3px!important;
      
}
/*------------- compressor button player-gain. вызов ------------------*/
.ffz--player-comp
.tw-inline-flex
.tw-relative
.ffz-il-tooltip__container {
    position: relative!important;
    z-index: 100000!important;
    left: 125px!important;
     
}


    `;
    document.head.appendChild(style);
});

})(); 
