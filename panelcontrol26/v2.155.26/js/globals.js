
// js/globals.js — глобальные переменные из combined.js

    var rootObserver = null;
     var connectionObserver = null;
    var iframeObserver = null;


var chatFilter = null;
var uiElements = null;
var currentSearchTerm = '';
var storage = null;
var notifications = null;
var observerIsActive = true;
var isStorageInitialized = false;
var isTextBlockingEnabled = false;
var isEmoteBlockingEnabled = true;
var bannedKeywords = [];
var bannedUsers = [];
var lastChannel = window.location.pathname.split('/')[1] || null;
var removedItem = null;
var updated = false;
var isRendering = false;
var keywordObserverIsActive = false;
var keywordObserver = null;
var restartAttempts = 10;
var lastKeywordCheckTime = 0;
var keywordLastFailureTime = 0;
var keywordRetryCount = 0;
var blockedEmotes = [];
var blockedChannels = [];
var blockedEmoteIDs = new Set();
var blockedChannelIDs = new Set();
var newlyAddedIds = new Set();
var isObservingChat = false;
var retryCount = 0;
var mutationCount = 0;
var keywordFilterObserver = null;
var isBlockingEnabled = false;
var processedEmotes = new WeakMap();
var isRestarting = false;
var lastKnownBlockedCount = 0;
var lastCheckTime = Date.now();
var observer = new MutationObserver(() => {});
var keywordObserver = null;
var filteredMessages = new Map();
var maxKeywordRetries = 20;
var maxRetries = 20;
var keywordFilterObserver = null;
var currentList = 'blockedEmotes';
