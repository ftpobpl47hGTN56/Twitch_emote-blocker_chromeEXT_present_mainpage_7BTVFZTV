// js/entry.js
(function () {
    // Используем нативный console — до перехвата логгером
    const _log   = Function.prototype.bind.call(console.log,   console);
    const _error = Function.prototype.bind.call(console.error, console);

    _log('[Entry] entry.js started');
    _log('[Entry] typeof init:', typeof init);
    _log('[Entry] typeof initializeStorage:', typeof initializeStorage);
    _log('[Entry] typeof createUI:', typeof createUI);

    if (typeof init !== 'function') {
        _error('[Entry] FATAL: init() not found — check JS load order');
        return;
    }
    if (typeof initializeStorage !== 'function') {
        _error('[Entry] FATAL: initializeStorage() not found');
        return;
    }

    _log('[Entry] Calling init()...');
    init();
})();