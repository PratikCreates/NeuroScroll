/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/**
 * Content script for YouTube Shorts behavior tracking
 * Injected into YouTube Shorts pages to monitor user interactions
 */
console.log('🔥 NeuroScroll content script loaded on:', window.location.href);
// Check if extension context is valid before proceeding
if (!chrome.runtime?.id) {
    console.warn('Extension context invalidated, content script will not initialize');
}
else {
    // Test storage immediately to verify it works
    chrome.storage.local.set({ 'neuroscroll-test': 'Content script loaded at ' + new Date().toISOString() }, () => {
        console.log('✅ Test data written to storage');
    });
}
// Tracking state
let currentSessionId = '';
let currentVideoId = '';
let videoEnterTime = 0;
let videoOrder = 0;
// Removed unused lastScrollTime variable
let lastActivityTime = Date.now();
let isTracking = false;
let replayCount = new Map();
// Throttling and performance
const SCROLL_THROTTLE_MS = 100;
const IDLE_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes
const MESSAGE_RETRY_ATTEMPTS = 3;
const MESSAGE_RETRY_DELAY = 1000;
// Initialize tracking when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTracking);
}
else {
    initializeTracking();
}
function initializeTracking() {
    // Check if extension context is still valid
    if (!chrome.runtime?.id) {
        console.warn('Extension context invalidated, cannot initialize tracking');
        return;
    }
    console.log('Initializing YouTube Shorts tracking...');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    // Check if we're on a YouTube Shorts page
    if (!isYouTubeShortsPage()) {
        console.log('Not on YouTube Shorts page, tracking disabled');
        console.log('Will monitor for navigation to Shorts...');
        // Still set up navigation tracking to detect when user goes to Shorts
        setupNavigationTracking();
        return;
    }
    console.log('YouTube Shorts page detected, tracking enabled');
    // Test extension context with a simple ping
    testExtensionContext().then((contextValid) => {
        if (contextValid) {
            // Initialize session
            initializeSession();
            // Set up observers and listeners
            setupVideoDetection();
            setupScrollTracking();
            setupIdleDetection();
            setupNavigationTracking();
            isTracking = true;
        }
        else {
            console.warn('Extension context test failed, tracking disabled');
        }
    });
}
async function testExtensionContext() {
    try {
        if (!chrome.runtime?.id) {
            return false;
        }
        const response = await new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: 'PING' }, (response) => {
                if (chrome.runtime.lastError) {
                    resolve(null);
                }
                else {
                    resolve(response);
                }
            });
        });
        return response?.status === 'pong';
    }
    catch (error) {
        console.error('Extension context test failed:', error);
        return false;
    }
}
function isYouTubeShortsPage() {
    return window.location.pathname.startsWith('/shorts/') ||
        window.location.href.includes('youtube.com/shorts/');
}
function initializeSession() {
    currentSessionId = generateSessionId();
    lastActivityTime = Date.now();
    sendMessageToBackground({
        type: 'SESSION_START',
        sessionId: currentSessionId,
        timestamp: Date.now()
    });
}
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function generateInteractionId() {
    return `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function setupVideoDetection() {
    // Use MutationObserver to detect video changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                checkForVideoChange();
            }
        });
    });
    // Observe the main content area
    const targetNode = document.querySelector('#shorts-container') ||
        document.querySelector('#primary') ||
        document.body;
    if (targetNode) {
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }
    // Use IntersectionObserver for precise video visibility tracking
    setupIntersectionObserver();
    // Initial video detection
    setTimeout(() => checkForVideoChange(), 1000);
}
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const videoElement = entry.target;
            const videoId = extractVideoId(videoElement);
            if (!videoId)
                return;
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                // Video entered view
                handleVideoEnter(videoId);
            }
            else if (!entry.isIntersecting && currentVideoId === videoId) {
                // Video left view
                handleVideoLeave(videoId);
            }
        });
    }, {
        threshold: [0, 0.5, 1.0]
    });
    // Observe video elements
    const observeVideos = () => {
        const videoElements = document.querySelectorAll('video, [data-video-id]');
        videoElements.forEach((video) => {
            observer.observe(video);
        });
    };
    observeVideos();
    // Re-observe when new videos are added
    setInterval(observeVideos, 2000);
}
function checkForVideoChange() {
    const newVideoId = getCurrentVideoId();
    if (newVideoId && newVideoId !== currentVideoId) {
        if (currentVideoId) {
            handleVideoLeave(currentVideoId);
        }
        handleVideoEnter(newVideoId);
    }
}
function getCurrentVideoId() {
    // Try multiple methods to get video ID
    const url = window.location.href;
    const urlMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (urlMatch) {
        return urlMatch[1];
    }
    // Try various selectors for video containers
    const selectors = [
        '[data-video-id]',
        'ytd-shorts-video-renderer',
        'ytd-reel-video-renderer',
        '#shorts-player',
        '.html5-video-container'
    ];
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            const videoId = element.getAttribute('data-video-id') ||
                element.getAttribute('data-context-item-id') ||
                element.getAttribute('video-id');
            if (videoId) {
                return videoId;
            }
        }
    }
    // Try to extract from video element or its container
    const video = document.querySelector('video');
    if (video) {
        // Check parent containers for video ID
        let parent = video.parentElement;
        while (parent && parent !== document.body) {
            const videoId = parent.getAttribute('data-video-id') ||
                parent.getAttribute('data-context-item-id');
            if (videoId) {
                return videoId;
            }
            parent = parent.parentElement;
        }
        // Try video src
        if (video.src) {
            const srcMatch = video.src.match(/\/([a-zA-Z0-9_-]+)\./);
            if (srcMatch) {
                return srcMatch[1];
            }
        }
    }
    // Fallback: try to extract from any element with video ID pattern
    const allElements = document.querySelectorAll('*[data-video-id], *[data-context-item-id]');
    for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        const videoId = element.getAttribute('data-video-id') ||
            element.getAttribute('data-context-item-id');
        if (videoId && videoId.match(/^[a-zA-Z0-9_-]{11}$/)) {
            return videoId;
        }
    }
    return '';
}
function extractVideoId(element) {
    // Try data attribute first
    const dataId = element.getAttribute('data-video-id');
    if (dataId)
        return dataId;
    // Try to find video ID from nearby elements
    const container = element.closest('[data-video-id]');
    if (container) {
        return container.getAttribute('data-video-id') || '';
    }
    return getCurrentVideoId();
}
function handleVideoEnter(videoId) {
    if (!videoId || videoId === currentVideoId)
        return;
    updateActivity();
    // Check for replay
    const isReplay = currentVideoId === videoId;
    if (isReplay) {
        const count = replayCount.get(videoId) || 0;
        replayCount.set(videoId, count + 1);
        recordInteraction({
            id: generateInteractionId(),
            videoId,
            sessionId: currentSessionId,
            timestamp: Date.now(),
            action: 'replay',
            metadata: {}
        });
    }
    currentVideoId = videoId;
    videoEnterTime = Date.now();
    videoOrder++;
    recordInteraction({
        id: generateInteractionId(),
        videoId,
        sessionId: currentSessionId,
        timestamp: Date.now(),
        action: 'enter',
        metadata: {
            videoOrder
        }
    });
}
function handleVideoLeave(videoId) {
    if (!videoId || !videoEnterTime)
        return;
    const dwellTime = Date.now() - videoEnterTime;
    recordInteraction({
        id: generateInteractionId(),
        videoId,
        sessionId: currentSessionId,
        timestamp: Date.now(),
        action: 'leave',
        metadata: {
            dwellTime,
            videoOrder
        }
    });
    videoEnterTime = 0;
}
function setupScrollTracking() {
    let lastScrollY = window.scrollY;
    let scrollStartTime = Date.now();
    let isScrolling = false;
    const throttledScrollHandler = throttle(() => {
        if (!isTracking || !currentVideoId)
            return;
        const currentScrollY = window.scrollY;
        const currentTime = Date.now();
        const timeDelta = currentTime - scrollStartTime;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        // Only record significant scroll movements
        if (timeDelta > 0 && scrollDelta > 10) {
            const scrollSpeed = scrollDelta / timeDelta; // pixels per ms
            recordInteraction({
                id: generateInteractionId(),
                videoId: currentVideoId,
                sessionId: currentSessionId,
                timestamp: currentTime,
                action: 'scroll',
                metadata: {
                    scrollSpeed: scrollSpeed * 1000, // convert to pixels per second
                    scrollDirection: currentScrollY > lastScrollY ? 'down' : 'up',
                    scrollDistance: scrollDelta,
                    videoOrder
                }
            });
        }
        lastScrollY = currentScrollY;
        scrollStartTime = currentTime;
        updateActivity();
    }, SCROLL_THROTTLE_MS);
    const handleScrollStart = () => {
        if (!isScrolling) {
            isScrolling = true;
            scrollStartTime = Date.now();
            lastScrollY = window.scrollY;
        }
    };
    const handleScrollEnd = throttle(() => {
        isScrolling = false;
    }, 150);
    // Listen for scroll events
    window.addEventListener('scroll', () => {
        handleScrollStart();
        throttledScrollHandler();
        handleScrollEnd();
    }, { passive: true });
    // Also track touch events for mobile scrolling
    window.addEventListener('touchstart', () => {
        handleScrollStart();
        updateActivity();
    }, { passive: true });
    window.addEventListener('touchmove', throttledScrollHandler, { passive: true });
    window.addEventListener('touchend', handleScrollEnd, { passive: true });
    // Track wheel events for desktop scrolling
    window.addEventListener('wheel', () => {
        handleScrollStart();
        throttledScrollHandler();
        handleScrollEnd();
    }, { passive: true });
    console.log('Scroll tracking initialized');
}
function setupIdleDetection() {
    // Track various activity events
    const activityEvents = ['scroll', 'click', 'keydown', 'mousemove', 'touchstart', 'touchmove'];
    activityEvents.forEach(event => {
        document.addEventListener(event, updateActivity, { passive: true });
    });
    // Check for idle state and extension context every 30 seconds
    const idleCheckInterval = setInterval(async () => {
        // Check if extension context is still valid
        if (!chrome.runtime?.id) {
            console.warn('Extension context invalidated, stopping tracking');
            clearInterval(idleCheckInterval);
            endSession();
            return;
        }
        // Test extension context periodically
        const contextValid = await testExtensionContext();
        if (!contextValid) {
            console.warn('Extension context test failed, stopping tracking');
            clearInterval(idleCheckInterval);
            endSession();
            return;
        }
        checkIdleState();
    }, 30000);
}
function setupNavigationTracking() {
    // Handle navigation changes (SPA routing)
    let lastUrl = window.location.href;
    const checkUrlChange = () => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            if (!isYouTubeShortsPage()) {
                endSession();
            }
            else if (!isTracking) {
                initializeTracking();
            }
        }
    };
    // Use both popstate and a polling mechanism for SPA navigation
    window.addEventListener('popstate', checkUrlChange);
    setInterval(checkUrlChange, 1000);
}
function updateActivity() {
    lastActivityTime = Date.now();
}
function checkIdleState() {
    const idleTime = Date.now() - lastActivityTime;
    if (idleTime > IDLE_THRESHOLD_MS && isTracking) {
        console.log('User idle detected, ending session');
        endSession();
    }
}
function endSession() {
    if (!isTracking)
        return;
    if (currentVideoId && videoEnterTime) {
        handleVideoLeave(currentVideoId);
    }
    sendMessageToBackground({
        type: 'SESSION_END',
        sessionId: currentSessionId,
        timestamp: Date.now()
    });
    isTracking = false;
    currentVideoId = '';
    videoEnterTime = 0;
    videoOrder = 0;
    replayCount.clear();
}
function recordInteraction(interaction) {
    sendMessageToBackground({
        type: 'INTERACTION',
        interaction
    });
}
async function sendMessageToBackground(message, retryCount = 0) {
    try {
        // Check if extension context is still valid
        if (!chrome.runtime?.id) {
            console.warn('Extension context invalidated, skipping message:', message);
            return;
        }
        await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (_response) => {
                if (chrome.runtime.lastError) {
                    const error = chrome.runtime.lastError.message || 'Unknown error';
                    // Handle extension context invalidated error
                    if (error.includes('Extension context invalidated') ||
                        error.includes('message port closed') ||
                        error.includes('receiving end does not exist')) {
                        console.warn('Extension context invalidated, stopping message attempts');
                        resolve(); // Don't retry for context invalidation
                        return;
                    }
                    reject(new Error(error));
                }
                else {
                    resolve();
                }
            });
        });
    }
    catch (error) {
        console.error('Failed to send message to background:', error);
        // Don't retry if extension context is invalidated
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('Extension context invalidated') ||
            errorMessage.includes('message port closed') ||
            errorMessage.includes('receiving end does not exist')) {
            console.warn('Extension context invalidated, stopping retries');
            return;
        }
        if (retryCount < MESSAGE_RETRY_ATTEMPTS) {
            console.log(`Retrying message send (attempt ${retryCount + 1}/${MESSAGE_RETRY_ATTEMPTS})`);
            setTimeout(() => {
                sendMessageToBackground(message, retryCount + 1);
            }, MESSAGE_RETRY_DELAY * (retryCount + 1));
        }
        else {
            console.error('Max retry attempts reached, message lost:', message);
        }
    }
}
function throttle(func, delay) {
    let timeoutId = null;
    let lastExecTime = 0;
    return ((...args) => {
        const currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
            func(...args);
            lastExecTime = currentTime;
        }
        else {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func(...args);
                lastExecTime = Date.now();
                timeoutId = null;
            }, delay - (currentTime - lastExecTime));
        }
    });
}
// Handle messages from background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'SESSION_CREATED') {
        console.log('Background created session, syncing content script:', message.sessionId);
        // End current session if active
        if (isTracking) {
            endSession();
        }
        // Sync with background-created session
        currentSessionId = message.sessionId;
        lastActivityTime = message.timestamp;
        // Start tracking if on YouTube Shorts
        if (isYouTubeShortsPage()) {
            // Set up observers and listeners without creating a new session
            setupVideoDetection();
            setupScrollTracking();
            setupIdleDetection();
            setupNavigationTracking();
            isTracking = true;
            console.log('Content script synced with background session:', currentSessionId);
            sendResponse({ status: 'success', message: 'Content script synced' });
        }
        else {
            sendResponse({ status: 'error', message: 'Not on YouTube Shorts page' });
        }
        return true; // Keep message channel open for async response
    }
    return false; // Don't keep channel open for other messages
});
// Handle page unload
window.addEventListener('beforeunload', () => {
    if (isTracking) {
        endSession();
    }
});
// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        updateActivity();
    }
    else {
        updateActivity();
        // Re-check video state when tab becomes visible
        setTimeout(() => checkForVideoChange(), 500);
    }
});


/******/ })()
;
//# sourceMappingURL=content-script.js.map