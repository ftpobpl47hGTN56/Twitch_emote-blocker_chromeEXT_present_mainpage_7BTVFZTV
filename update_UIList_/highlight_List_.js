// highlight_List_.js //
(function() {
    'use strict';
 
 const highlightCache = new Map();
function highlightText(text, term) {
    if (!term)
        return text;
    const cacheKey = `${text}:${term}`;
    if (highlightCache.has(cacheKey))
        return highlightCache.get(cacheKey);
    const lowerText = text.toLowerCase();
    const lowerTerm = term.toLowerCase();
    const index = lowerText.indexOf(lowerTerm);
    if (index === -1) {
        highlightCache.set(cacheKey, text);
        return text;
    }
    const before = text.slice(0, index);
    const match = text.slice(index, index + term.length);
    const after = text.slice(index + term.length);
      const result = `${before}<span class="item-highlight-7btvfzkguthtdhr57h">${match}</span>${after}`;
    highlightCache.set(cacheKey, result);
    return result;
}
 
    // Экспорт в глобальную область
    window.highlightText = highlightText;
 
})();