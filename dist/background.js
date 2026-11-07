/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd define */
/******/ 	(() => {
/******/ 		__webpack_require__.amdD = function () {
/******/ 			throw new Error('define cannot be used indirect');
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			471: 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkneuroscroll_youtube_analyzer"] = self["webpackChunkneuroscroll_youtube_analyzer"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// ./src/utils/storage.ts
/**
 * Chrome storage wrapper utilities with data validation and retention management
 * Implements requirements 2.1, 2.2, 2.5 for local storage and data management
 */
class StorageManager {
    /**
     * Get data from Chrome storage with type safety
     */
    static async get(key) {
        try {
            // Check if chrome storage is available
            if (!chrome?.storage?.local) {
                console.warn('Chrome storage not available');
                return null;
            }
            const result = await chrome.storage.local.get(key);
            return result[key] || null;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            // Handle specific Service Worker context errors
            if (errorMessage.includes('No SW Context') ||
                errorMessage.includes('Extension context invalidated') ||
                errorMessage.includes('message port closed')) {
                console.warn(`Service Worker context unavailable for storage key ${key}. This is normal during extension reload.`);
                return null;
            }
            console.error(`Failed to get storage key ${key}:`, error);
            return null;
        }
    }
    /**
     * Set data in Chrome storage with validation
     */
    static async set(key, value) {
        try {
            // Check if chrome storage is available
            if (!chrome?.storage?.local) {
                console.warn('Chrome storage not available');
                return false;
            }
            // Validate data before storing
            if (!this.validateData(key, value)) {
                console.error(`Invalid data for storage key ${key}`);
                return false;
            }
            await chrome.storage.local.set({ [key]: value });
            return true;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            // Handle specific Service Worker context errors
            if (errorMessage.includes('No SW Context') ||
                errorMessage.includes('Extension context invalidated') ||
                errorMessage.includes('message port closed')) {
                console.warn(`Service Worker context unavailable for storage key ${key}. Data will be lost. This is normal during extension reload.`);
                return false;
            }
            console.error(`Failed to set storage key ${key}:`, error);
            return false;
        }
    }
    /**
     * Add a new session to storage with automatic cleanup
     */
    static async addSession(session) {
        try {
            const sessions = await this.get('neuroscroll-sessions') || [];
            // Add new session
            sessions.push(session);
            // Apply retention policy
            const cleanedSessions = this.applyRetentionPolicy(sessions);
            return await this.set('neuroscroll-sessions', cleanedSessions);
        }
        catch (error) {
            console.error('Failed to add session:', error);
            return false;
        }
    }
    /**
     * Save a session (add new or update existing)
     */
    async saveSession(session) {
        try {
            // Validate session data
            if (!session || !session.id || typeof session.id !== 'string') {
                console.error('Invalid session data for saving:', session);
                return false;
            }
            if (!Array.isArray(session.interactions)) {
                console.error('Invalid interactions array in session:', session.id);
                return false;
            }
            const sessions = await StorageManager.get('neuroscroll-sessions') || [];
            if (!Array.isArray(sessions)) {
                console.error('Stored sessions data is corrupted, reinitializing');
                await StorageManager.set('neuroscroll-sessions', []);
                return await this.saveSession(session); // Retry with clean storage
            }
            const existingIndex = sessions.findIndex(s => s && s.id === session.id);
            if (existingIndex >= 0) {
                // Update existing session
                sessions[existingIndex] = { ...session };
            }
            else {
                // Add new session
                sessions.push({ ...session });
            }
            // Apply retention policy
            const cleanedSessions = StorageManager.applyRetentionPolicy(sessions);
            return await StorageManager.set('neuroscroll-sessions', cleanedSessions);
        }
        catch (error) {
            console.error('Failed to save session:', session?.id, error);
            return false;
        }
    }
    /**
     * Update an existing session
     */
    static async updateSession(sessionId, updates) {
        try {
            const sessions = await this.get('neuroscroll-sessions') || [];
            const sessionIndex = sessions.findIndex(s => s.id === sessionId);
            if (sessionIndex === -1) {
                console.error(`Session ${sessionId} not found`);
                return false;
            }
            sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates };
            return await this.set('neuroscroll-sessions', sessions);
        }
        catch (error) {
            console.error('Failed to update session:', error);
            return false;
        }
    }
    /**
     * Get user settings with defaults
     */
    static async getSettings() {
        const settings = await this.get('neuroscroll-settings');
        return settings || this.getDefaultSettings();
    }
    /**
     * Save user settings
     */
    static async saveSettings(settings) {
        return await this.set('neuroscroll-settings', settings);
    }
    /**
     * Clear all stored data (for reset functionality)
     */
    static async clearAllData() {
        try {
            await chrome.storage.local.clear();
            return true;
        }
        catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    }
    /**
     * Export data as CSV format
     */
    static async exportAsCSV() {
        const sessions = await this.get('neuroscroll-sessions') || [];
        // Manual CSV export to avoid dynamic import issues in background script
        const headers = [
            'Session ID',
            'Start Time',
            'End Time',
            'Duration (min)',
            'Video Count',
            'Total Dwell Time (s)',
            'Dopamine Spike Index',
            'Attention Span (s)',
            'Replay Sensitivity',
            'Circadian Drift',
            'Health Classification',
            'Confidence'
        ];
        const rows = sessions.map(session => [
            session.id,
            new Date(session.startTime).toISOString(),
            session.endTime ? new Date(session.endTime).toISOString() : 'Active',
            session.endTime ?
                ((session.endTime - session.startTime) / 60000).toFixed(2) :
                ((Date.now() - session.startTime) / 60000).toFixed(2),
            session.videoCount.toString(),
            (session.totalDwellTime / 1000).toFixed(2),
            session.computedMetrics?.dopamineSpikeIndex?.toFixed(2) || 'N/A',
            session.computedMetrics?.attentionSpan?.toFixed(2) || 'N/A',
            session.computedMetrics?.replaySensitivity?.toString() || 'N/A',
            session.computedMetrics?.circadianDrift ? 'Yes' : 'No',
            session.computedMetrics?.healthClassification || 'Unknown',
            session.computedMetrics?.confidence?.toFixed(2) || 'N/A'
        ]);
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }
    /**
     * Apply data retention policy based on user settings
     */
    static applyRetentionPolicy(sessions) {
        const settings = this.getDefaultSettings(); // Will be replaced with actual settings
        const retentionMs = settings.dataRetentionDays * 24 * 60 * 60 * 1000;
        const cutoffTime = Date.now() - retentionMs;
        // Remove old sessions
        let filteredSessions = sessions.filter(session => session.startTime > cutoffTime);
        // Limit total number of sessions
        if (filteredSessions.length > this.MAX_SESSIONS) {
            filteredSessions = filteredSessions
                .sort((a, b) => b.startTime - a.startTime)
                .slice(0, this.MAX_SESSIONS);
        }
        return filteredSessions;
    }
    /**
     * Validate data before storing
     */
    static validateData(key, value) {
        switch (key) {
            case 'neuroscroll-sessions':
                return Array.isArray(value) && value.every(this.validateSession);
            case 'neuroscroll-settings':
                return this.validateSettings(value);
            case 'neuroscroll-ai-model':
                return value instanceof ArrayBuffer;
            default:
                return false;
        }
    }
    /**
     * Validate session data structure
     */
    static validateSession(session) {
        return (typeof session.id === 'string' &&
            typeof session.startTime === 'number' &&
            typeof session.isActive === 'boolean' &&
            typeof session.videoCount === 'number' &&
            typeof session.totalDwellTime === 'number' &&
            Array.isArray(session.interactions));
    }
    /**
     * Validate settings data structure
     */
    static validateSettings(settings) {
        return (typeof settings.enableAI === 'boolean' &&
            typeof settings.enableGeminiInsights === 'boolean' &&
            typeof settings.dataRetentionDays === 'number' &&
            ['csv', 'json'].includes(settings.exportFormat) &&
            typeof settings.accessibilityMode === 'boolean' &&
            typeof settings.serviceEnabled === 'boolean');
    }
    /**
     * Get default user settings
     */
    static getDefaultSettings() {
        return {
            enableAI: true,
            enableGeminiInsights: false,
            dataRetentionDays: this.DEFAULT_RETENTION_DAYS,
            exportFormat: 'csv',
            accessibilityMode: false,
            serviceEnabled: true
        };
    }
}
StorageManager.DEFAULT_RETENTION_DAYS = 30;
StorageManager.MAX_SESSIONS = 1000;

;// ./src/utils/metrics-engine.ts
/**
 * Metrics computation engine for NeuroScroll
 * Implements neuroscience-based behavioral analysis
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */
class MetricsEngine {
    /**
     * Compute all metrics for a viewing session
     */
    static computeMetrics(session) {
        try {
            if (!session || !Array.isArray(session.interactions)) {
                throw new Error('Invalid session data');
            }
            const interactions = session.interactions;
            const sessionLength = this.calculateSessionLength(session);
            const fatiguePoints = this.generateFatiguePoints(interactions);
            const dwellTimes = this.extractDwellTimes(interactions);
            const metrics = {
                dopamineSpikeIndex: this.calculateDopamineSpikeIndex(interactions),
                attentionSpan: this.calculateAttentionSpan(interactions),
                replaySensitivity: this.calculateReplaySensitivity(interactions),
                sessionLength,
                fatiguePoints,
                circadianDrift: this.detectCircadianDrift(session.startTime, sessionLength),
                healthClassification: 'unknown', // Will be set by AI classifier
                confidence: 0.8, // Default confidence
                timestamp: Date.now(),
                // Advanced behavioral metrics
                scrollMomentum: this.calculateScrollMomentum(interactions),
                rewardVariability: this.calculateRewardVariability(dwellTimes),
                bingeBursts: this.detectBingeBursts(interactions),
                engagementHalfLife: this.calculateEngagementHalfLife(fatiguePoints),
                cognitiveLoad: this.calculateCognitiveLoad(interactions),
                habitStrength: this.calculateHabitStrength(interactions),
                noveltyBias: this.calculateNoveltyBias(interactions),
                sessionArchetype: 'unknown' // Will be determined after all metrics
            };
            // Apply health classification and session archetype
            metrics.healthClassification = this.analyzeSessionHealth(metrics);
            metrics.sessionArchetype = this.classifySessionArchetype(metrics);
            return metrics;
        }
        catch (error) {
            console.error('Error computing metrics:', error);
            // Return safe default metrics
            return {
                dopamineSpikeIndex: 0,
                attentionSpan: 0,
                replaySensitivity: 0,
                sessionLength: 0,
                fatiguePoints: [],
                circadianDrift: false,
                healthClassification: 'unknown',
                confidence: 0,
                timestamp: Date.now(),
                scrollMomentum: 0,
                rewardVariability: 0,
                bingeBursts: [],
                engagementHalfLife: 0,
                cognitiveLoad: 0,
                habitStrength: 0,
                noveltyBias: 0,
                sessionArchetype: 'unknown'
            };
        }
    }
    /**
     * Calculate Dopamine Spike Index
     * Formula: number of shorts viewed ÷ average dwell time
     * Higher values indicate rapid content consumption
     */
    static calculateDopamineSpikeIndex(interactions) {
        try {
            if (!Array.isArray(interactions) || interactions.length === 0) {
                return 0;
            }
            const enterEvents = interactions.filter(i => i && i.action === 'enter');
            const leaveEvents = interactions.filter(i => i && i.action === 'leave' && i.metadata?.dwellTime);
            if (enterEvents.length === 0 || leaveEvents.length === 0) {
                return 0;
            }
            const totalDwellTime = leaveEvents.reduce((sum, interaction) => {
                const dwellTime = interaction.metadata?.dwellTime || 0;
                return sum + (typeof dwellTime === 'number' && dwellTime > 0 ? dwellTime : 0);
            }, 0);
            const averageDwellTime = totalDwellTime / leaveEvents.length;
            if (averageDwellTime === 0 || !isFinite(averageDwellTime)) {
                return 0;
            }
            const result = enterEvents.length / (averageDwellTime / 1000); // Convert to seconds
            return isFinite(result) ? Math.max(0, result) : 0;
        }
        catch (error) {
            console.error('Error calculating dopamine spike index:', error);
            return 0;
        }
    }
    /**
     * Calculate Attention Span
     * Moving average of dwell times with exponential decay
     */
    static calculateAttentionSpan(interactions) {
        try {
            if (!Array.isArray(interactions) || interactions.length === 0) {
                return 0;
            }
            const dwellTimes = interactions
                .filter(i => i && i.action === 'leave' && i.metadata?.dwellTime)
                .map(i => i.metadata.dwellTime)
                .filter(time => typeof time === 'number' && time > 0 && isFinite(time));
            if (dwellTimes.length === 0) {
                return 0;
            }
            // Calculate exponentially weighted moving average
            const alpha = 0.3; // Smoothing factor
            let ewma = dwellTimes[0];
            for (let i = 1; i < dwellTimes.length; i++) {
                ewma = alpha * dwellTimes[i] + (1 - alpha) * ewma;
                if (!isFinite(ewma)) {
                    console.error('Non-finite EWMA value detected');
                    return 0;
                }
            }
            const result = ewma / 1000; // Convert to seconds
            return isFinite(result) ? Math.max(0, result) : 0;
        }
        catch (error) {
            console.error('Error calculating attention span:', error);
            return 0;
        }
    }
    /**
     * Calculate Replay Sensitivity
     * Total number of replay events
     */
    static calculateReplaySensitivity(interactions) {
        return interactions.filter(i => i.action === 'replay').length;
    }
    /**
     * Calculate session length in minutes
     */
    static calculateSessionLength(session) {
        if (!session.endTime) {
            return (Date.now() - session.startTime) / 60000;
        }
        return (session.endTime - session.startTime) / 60000;
    }
    /**
     * Generate fatigue curve points
     * Shows dwell time progression over video order
     */
    static generateFatiguePoints(interactions) {
        const videoSequence = new Map();
        let videoOrder = 0;
        // Track video order
        interactions
            .filter(i => i.action === 'enter')
            .forEach(interaction => {
            if (!videoSequence.has(interaction.videoId)) {
                videoSequence.set(interaction.videoId, videoOrder++);
            }
        });
        // Generate fatigue points from leave events
        const fatiguePoints = [];
        interactions
            .filter(i => i.action === 'leave' && i.metadata.dwellTime)
            .forEach(interaction => {
            const order = videoSequence.get(interaction.videoId);
            if (order !== undefined) {
                fatiguePoints.push({
                    videoOrder: order,
                    dwellTime: interaction.metadata.dwellTime / 1000, // Convert to seconds
                    timestamp: interaction.timestamp
                });
            }
        });
        return fatiguePoints.sort((a, b) => a.videoOrder - b.videoOrder);
    }
    /**
     * Detect circadian drift (late-night bingeing)
     * Flags sessions between 11 PM and 6 AM
     */
    static detectCircadianDrift(startTime, sessionLengthMinutes) {
        const startDate = new Date(startTime);
        const endDate = new Date(startTime + sessionLengthMinutes * 60000);
        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        // Check if session starts or ends in circadian drift window (11 PM - 6 AM)
        const isStartInDriftWindow = startHour >= 23 || startHour < 6;
        const isEndInDriftWindow = endHour >= 23 || endHour < 6;
        // Also check if session spans midnight
        const spansCircadianWindow = startHour >= 23 && endHour < 6;
        return isStartInDriftWindow || isEndInDriftWindow || spansCircadianWindow;
    }
    /**
     * Calculate fatigue slope for trend analysis
     * Negative slope indicates increasing fatigue (decreasing dwell time)
     */
    static calculateFatigueSlope(fatiguePoints) {
        if (fatiguePoints.length < 2) {
            return 0;
        }
        // Linear regression to find slope
        const n = fatiguePoints.length;
        const sumX = fatiguePoints.reduce((sum, point) => sum + point.videoOrder, 0);
        const sumY = fatiguePoints.reduce((sum, point) => sum + point.dwellTime, 0);
        const sumXY = fatiguePoints.reduce((sum, point) => sum + point.videoOrder * point.dwellTime, 0);
        const sumXX = fatiguePoints.reduce((sum, point) => sum + point.videoOrder * point.videoOrder, 0);
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return isNaN(slope) ? 0 : slope;
    }
    /**
     * Analyze session health based on metrics
     * Provides preliminary classification before AI analysis
     */
    static analyzeSessionHealth(metrics) {
        // Healthy session indicators
        const hasModerateAttentionSpan = metrics.attentionSpan > 10 && metrics.attentionSpan < 120; // 10s - 2min
        const hasLowDopamineSpike = metrics.dopamineSpikeIndex < 2;
        const hasLowReplayRate = metrics.replaySensitivity < 5;
        const hasReasonableLength = metrics.sessionLength < 60; // Less than 1 hour
        const noCircadianDrift = !metrics.circadianDrift;
        const healthyIndicators = [
            hasModerateAttentionSpan,
            hasLowDopamineSpike,
            hasLowReplayRate,
            hasReasonableLength,
            noCircadianDrift
        ].filter(Boolean).length;
        // Doomscroll indicators
        const hasShortAttentionSpan = metrics.attentionSpan < 5; // Less than 5 seconds
        const hasHighDopamineSpike = metrics.dopamineSpikeIndex > 5;
        const hasHighReplayRate = metrics.replaySensitivity > 10;
        const hasLongSession = metrics.sessionLength > 120; // More than 2 hours
        const hasCircadianDrift = metrics.circadianDrift;
        const doomscrollIndicators = [
            hasShortAttentionSpan,
            hasHighDopamineSpike,
            hasHighReplayRate,
            hasLongSession,
            hasCircadianDrift
        ].filter(Boolean).length;
        if (healthyIndicators >= 3) {
            return 'healthy';
        }
        else if (doomscrollIndicators >= 3) {
            return 'doomscroll';
        }
        return 'unknown';
    }
    /**
     * Extract dwell times from interactions for analysis
     */
    static extractDwellTimes(interactions) {
        return interactions
            .filter(i => i && i.action === 'leave' && i.metadata?.dwellTime)
            .map(i => i.metadata.dwellTime / 1000) // Convert to seconds
            .filter(time => typeof time === 'number' && time > 0 && isFinite(time));
    }
    /**
     * Calculate Scroll Momentum (Impulse Index) ⚡🌀
     * Formula: # of Shorts skipped in < 3s / total Shorts viewed
     * High momentum = dopamine-seeking impulse scrolling
     */
    static calculateScrollMomentum(interactions) {
        try {
            const dwellTimes = this.extractDwellTimes(interactions);
            if (dwellTimes.length === 0) {
                return 0;
            }
            const quickSkips = dwellTimes.filter(time => time < 3).length;
            const momentum = quickSkips / dwellTimes.length;
            return isFinite(momentum) ? Math.max(0, Math.min(1, momentum)) : 0;
        }
        catch (error) {
            console.error('Error calculating scroll momentum:', error);
            return 0;
        }
    }
    /**
     * Calculate Reward Variability Score 🎢
     * Formula: Standard deviation of dwell times
     * High variability = inconsistent dopamine rewards → addictive reinforcement
     */
    static calculateRewardVariability(dwellTimes) {
        try {
            if (dwellTimes.length < 2) {
                return 0;
            }
            const mean = dwellTimes.reduce((sum, time) => sum + time, 0) / dwellTimes.length;
            const variance = dwellTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / dwellTimes.length;
            const standardDeviation = Math.sqrt(variance);
            return isFinite(standardDeviation) ? standardDeviation : 0;
        }
        catch (error) {
            console.error('Error calculating reward variability:', error);
            return 0;
        }
    }
    /**
     * Detect Binge Burst patterns 🔥
     * Count consecutive videos watched with dwell < 5s
     * Each streak ≥ 5 videos = Binge Burst
     */
    static detectBingeBursts(interactions) {
        try {
            const dwellTimes = interactions
                .filter(i => i && i.action === 'leave' && i.metadata?.dwellTime)
                .map((i, index) => ({
                index,
                dwellTime: i.metadata.dwellTime / 1000,
                timestamp: i.timestamp
            }));
            const bursts = [];
            let burstStart = -1;
            let burstDwellTimes = [];
            let burstTimestamps = [];
            for (let i = 0; i < dwellTimes.length; i++) {
                const item = dwellTimes[i];
                if (item.dwellTime < 5) {
                    // Start or continue a burst
                    if (burstStart === -1) {
                        burstStart = i;
                        burstDwellTimes = [item.dwellTime];
                        burstTimestamps = [item.timestamp];
                    }
                    else {
                        burstDwellTimes.push(item.dwellTime);
                        burstTimestamps.push(item.timestamp);
                    }
                }
                else {
                    // End current burst if it exists and meets minimum length
                    if (burstStart !== -1 && burstDwellTimes.length >= 5) {
                        const averageDwellTime = burstDwellTimes.reduce((sum, time) => sum + time, 0) / burstDwellTimes.length;
                        bursts.push({
                            startIndex: burstStart,
                            endIndex: burstStart + burstDwellTimes.length - 1,
                            length: burstDwellTimes.length,
                            averageDwellTime,
                            timestamp: burstTimestamps[0]
                        });
                    }
                    // Reset burst tracking
                    burstStart = -1;
                    burstDwellTimes = [];
                    burstTimestamps = [];
                }
            }
            // Handle burst that continues to the end
            if (burstStart !== -1 && burstDwellTimes.length >= 5) {
                const averageDwellTime = burstDwellTimes.reduce((sum, time) => sum + time, 0) / burstDwellTimes.length;
                bursts.push({
                    startIndex: burstStart,
                    endIndex: burstStart + burstDwellTimes.length - 1,
                    length: burstDwellTimes.length,
                    averageDwellTime,
                    timestamp: burstTimestamps[0]
                });
            }
            return bursts;
        }
        catch (error) {
            console.error('Error detecting binge bursts:', error);
            return [];
        }
    }
    /**
     * Calculate Engagement Decay Half-Life ⏳
     * Find the video index where attention span drops to half its initial value
     */
    static calculateEngagementHalfLife(fatiguePoints) {
        try {
            if (fatiguePoints.length < 3) {
                return 0;
            }
            // Sort by video order to ensure proper sequence
            const sortedPoints = [...fatiguePoints].sort((a, b) => a.videoOrder - b.videoOrder);
            // Calculate initial attention (average of first 3 videos)
            const initialAttention = sortedPoints.slice(0, 3).reduce((sum, point) => sum + point.dwellTime, 0) / 3;
            const halfAttention = initialAttention / 2;
            // Find where attention drops to half
            for (let i = 3; i < sortedPoints.length; i++) {
                // Use moving average to smooth out noise
                const windowSize = Math.min(3, i + 1);
                const windowStart = Math.max(0, i - windowSize + 1);
                const currentAttention = sortedPoints.slice(windowStart, i + 1)
                    .reduce((sum, point) => sum + point.dwellTime, 0) / windowSize;
                if (currentAttention <= halfAttention) {
                    return sortedPoints[i].videoOrder;
                }
            }
            // If attention never drops to half, return the total video count
            return sortedPoints[sortedPoints.length - 1].videoOrder;
        }
        catch (error) {
            console.error('Error calculating engagement half-life:', error);
            return 0;
        }
    }
    /**
     * Classify Session Archetype 🤖
     * Explorer: high dwell, low skip momentum
     * Sampler: moderate dwell, moderate skips
     * Doomscroller: low dwell, high skips, many bursts
     */
    static classifySessionArchetype(metrics) {
        try {
            const { attentionSpan, scrollMomentum, bingeBursts, sessionLength } = metrics;
            // Insufficient data
            if (sessionLength < 0.5 || attentionSpan === 0) { // Reduced minimum session length to 30 seconds
                return 'unknown';
            }
            const highAttention = attentionSpan > 15; // > 15 seconds average
            const moderateAttention = attentionSpan > 8 && attentionSpan <= 15; // 8-15 seconds
            const lowAttention = attentionSpan <= 8; // <= 8 seconds
            const lowMomentum = scrollMomentum < 0.3; // < 30% quick skips
            const moderateMomentum = scrollMomentum >= 0.3 && scrollMomentum < 0.6; // 30-60%
            const highMomentum = scrollMomentum >= 0.6; // >= 60%
            const manyBursts = bingeBursts.length >= 2;
            // Classification logic
            if (highAttention && lowMomentum) {
                return 'explorer';
            }
            else if (lowAttention && (highMomentum || manyBursts)) {
                return 'doomscroller';
            }
            else if (moderateAttention && moderateMomentum) {
                return 'sampler';
            }
            else {
                // Edge cases - use dominant characteristic
                if (highMomentum || manyBursts) {
                    return 'doomscroller';
                }
                else if (highAttention) {
                    return 'explorer';
                }
                else {
                    return 'sampler';
                }
            }
        }
        catch (error) {
            console.error('Error classifying session archetype:', error);
            return 'unknown';
        }
    }
    /**
     * Calculate Cognitive Load 🧠
     * Measures mental processing demand from content switching patterns
     * Formula: (scroll events + rapid transitions) / total interactions
     */
    static calculateCognitiveLoad(interactions) {
        try {
            if (interactions.length === 0) {
                return 0;
            }
            const scrollEvents = interactions.filter(i => i.action === 'scroll').length;
            const rapidTransitions = interactions.filter(i => i.action === 'leave' && i.metadata?.dwellTime && i.metadata.dwellTime < 2000).length;
            const cognitiveStressors = scrollEvents + rapidTransitions;
            const cognitiveLoad = cognitiveStressors / interactions.length;
            return isFinite(cognitiveLoad) ? Math.max(0, Math.min(1, cognitiveLoad)) : 0;
        }
        catch (error) {
            console.error('Error calculating cognitive load:', error);
            return 0;
        }
    }
    /**
     * Calculate Habit Strength 🔄
     * Measures consistency of viewing patterns over time
     * Formula: 1 - (variance in dwell times / mean dwell time)
     */
    static calculateHabitStrength(interactions) {
        try {
            const dwellTimes = this.extractDwellTimes(interactions);
            if (dwellTimes.length < 3) {
                return 0;
            }
            const mean = dwellTimes.reduce((sum, time) => sum + time, 0) / dwellTimes.length;
            const variance = dwellTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / dwellTimes.length;
            if (mean === 0) {
                return 0;
            }
            const coefficientOfVariation = Math.sqrt(variance) / mean;
            const habitStrength = Math.max(0, 1 - coefficientOfVariation);
            return isFinite(habitStrength) ? Math.min(1, habitStrength) : 0;
        }
        catch (error) {
            console.error('Error calculating habit strength:', error);
            return 0;
        }
    }
    /**
     * Calculate Novelty Bias ✨
     * Measures preference for new content over familiar patterns
     * Formula: unique videos / total video interactions
     */
    static calculateNoveltyBias(interactions) {
        try {
            const videoInteractions = interactions.filter(i => i.action === 'enter');
            if (videoInteractions.length === 0) {
                return 0;
            }
            const uniqueVideos = new Set(videoInteractions.map(i => i.videoId)).size;
            const noveltyBias = uniqueVideos / videoInteractions.length;
            return isFinite(noveltyBias) ? Math.max(0, Math.min(1, noveltyBias)) : 0;
        }
        catch (error) {
            console.error('Error calculating novelty bias:', error);
            return 0;
        }
    }
    /**
     * Update metrics in real-time during active session
     */
    static updateRealTimeMetrics(session) {
        const metrics = this.computeMetrics(session);
        // Add real-time specific adjustments
        if (session.isActive) {
            // Adjust session length for active session
            metrics.sessionLength = (Date.now() - session.startTime) / 60000;
            // Lower confidence for incomplete sessions
            metrics.confidence = Math.max(0.3, metrics.confidence - 0.2);
        }
        // Apply preliminary health classification and archetype
        metrics.healthClassification = this.analyzeSessionHealth(metrics);
        metrics.sessionArchetype = this.classifySessionArchetype(metrics);
        return metrics;
    }
}

;// ./src/utils/ai-classifier.ts
/**
 * TensorFlow.js AI Classification System for NeuroScroll
 * Implements neural network for healthy vs doomscroll session classification
 * Requirements: 5.1, 5.2, 5.4, 7.4
 *
 * Uses lazy loading to reduce initial bundle size
 */

// Lazy load TensorFlow.js to reduce bundle size
let tfPromise = null;
async function loadTensorFlow() {
    if (!tfPromise) {
        tfPromise = Promise.all(/* import() */[__webpack_require__.e(951), __webpack_require__.e(209)]).then(__webpack_require__.bind(__webpack_require__, 951));
        const tf = await tfPromise;
        // Set backend to CPU or WebGL based on environment
        // In Service Worker, WebGL might not be available or might try to access document
        try {
            // Try to set backend to cpu for safety in background script
            await tf.setBackend('cpu');
            console.log('TensorFlow.js backend set to: cpu');
        }
        catch (e) {
            console.warn('Failed to set TensorFlow backend:', e);
        }
    }
    return tfPromise;
}
class AIClassifier {
    /**
     * Initialize the AI classifier
     */
    static async initialize() {
        if (this.model || this.isLoading) {
            return;
        }
        this.isLoading = true;
        try {
            // Lazy load TensorFlow.js
            this.tf = await loadTensorFlow();
            // Try to load existing model from IndexedDB
            await this.loadModel();
            if (!this.model) {
                // Create and train a new model if none exists
                await this.createAndTrainModel();
            }
        }
        catch (error) {
            console.error('Failed to initialize AI classifier:', error instanceof Error ? error.message : String(error));
            // Create a simple fallback model
            await this.createFallbackModel();
        }
        finally {
            this.isLoading = false;
        }
    }
    /**
     * Load existing model from storage
     */
    static async loadModel() {
        try {
            if (!this.tf) {
                this.tf = await loadTensorFlow();
            }
            this.model = await this.tf.loadLayersModel(this.MODEL_URL);
            console.log('AI model loaded successfully');
        }
        catch (error) {
            console.log('No existing model found, will create new one');
        }
    }
    /**
     * Create and train a new neural network model
     */
    static async createAndTrainModel() {
        console.log('Creating new AI classification model...');
        if (!this.tf) {
            this.tf = await loadTensorFlow();
        }
        // Create model architecture
        this.model = this.tf.sequential({
            layers: [
                this.tf.layers.dense({
                    inputShape: [12], // 12 input features (expanded)
                    units: 24,
                    activation: 'relu',
                    name: 'hidden1'
                }),
                this.tf.layers.dropout({ rate: 0.3 }),
                this.tf.layers.dense({
                    units: 12,
                    activation: 'relu',
                    name: 'hidden2'
                }),
                this.tf.layers.dropout({ rate: 0.1 }),
                this.tf.layers.dense({
                    units: 1,
                    activation: 'sigmoid',
                    name: 'output'
                })
            ]
        });
        // Compile model
        this.model.compile({
            optimizer: this.tf.train.adam(0.001),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });
        // Generate synthetic training data based on behavioral research
        const { features, labels } = this.generateTrainingData();
        // Train the model
        await this.model.fit(features, labels, {
            epochs: 50,
            batchSize: 32,
            validationSplit: 0.2,
            shuffle: true,
            verbose: 0
        });
        // Save model to IndexedDB
        await this.model.save(this.MODEL_URL);
        console.log('AI model trained and saved successfully');
        // Clean up training data
        features.dispose();
        labels.dispose();
    }
    /**
     * Create a simple fallback model for error cases
     */
    static async createFallbackModel() {
        console.log('Creating fallback AI model...');
        if (!this.tf) {
            this.tf = await loadTensorFlow();
        }
        this.model = this.tf.sequential({
            layers: [
                this.tf.layers.dense({
                    inputShape: [12],
                    units: 1,
                    activation: 'sigmoid'
                })
            ]
        });
        this.model.compile({
            optimizer: 'sgd',
            loss: 'binaryCrossentropy'
        });
    }
    /**
     * Generate synthetic training data based on behavioral research patterns
     */
    static generateTrainingData() {
        const numSamples = 1000;
        const featuresData = [];
        const labelsData = [];
        for (let i = 0; i < numSamples; i++) {
            const isHealthy = Math.random() > 0.4; // 60% doomscroll, 40% healthy (realistic distribution)
            let sessionLength, attentionSpan, dopamineSpikeIndex, replaySensitivity;
            let fatigueSlope, circadianDrift, videoCount, timeOfDay;
            let scrollMomentum, rewardVariability, bingeBursts, engagementHalfLife;
            if (isHealthy) {
                // Healthy session patterns
                sessionLength = Math.random() * 45 + 5; // 5-50 minutes
                attentionSpan = Math.random() * 60 + 15; // 15-75 seconds
                dopamineSpikeIndex = Math.random() * 2 + 0.5; // 0.5-2.5
                replaySensitivity = Math.floor(Math.random() * 3); // 0-2 replays
                fatigueSlope = (Math.random() - 0.5) * 0.5; // Slight positive or negative
                circadianDrift = Math.random() > 0.8 ? 1 : 0; // 20% chance
                videoCount = Math.floor(sessionLength * (1 + Math.random())); // Reasonable video count
                timeOfDay = Math.random() > 0.3 ? Math.floor(Math.random() * 17) + 7 : Math.floor(Math.random() * 24); // Mostly daytime
                scrollMomentum = Math.random() * 0.3; // Low momentum (0-30%)
                rewardVariability = Math.random() * 8 + 2; // Low variability (2-10s)
                bingeBursts = Math.floor(Math.random() * 2); // 0-1 bursts
                engagementHalfLife = Math.floor(Math.random() * 20) + 10; // 10-30 videos
            }
            else {
                // Doomscroll session patterns
                sessionLength = Math.random() * 180 + 30; // 30-210 minutes
                attentionSpan = Math.random() * 10 + 2; // 2-12 seconds
                dopamineSpikeIndex = Math.random() * 8 + 3; // 3-11
                replaySensitivity = Math.floor(Math.random() * 15 + 5); // 5-19 replays
                fatigueSlope = -Math.random() * 2; // Negative slope (increasing fatigue)
                circadianDrift = Math.random() > 0.4 ? 1 : 0; // 60% chance
                videoCount = Math.floor(sessionLength * (2 + Math.random() * 2)); // High video count
                timeOfDay = Math.random() > 0.6 ? Math.floor(Math.random() * 6) + 22 : Math.floor(Math.random() * 24); // Often late night
                if (timeOfDay > 24)
                    timeOfDay -= 24;
                scrollMomentum = Math.random() * 0.5 + 0.4; // High momentum (40-90%)
                rewardVariability = Math.random() * 25 + 10; // High variability (10-35s)
                bingeBursts = Math.floor(Math.random() * 5) + 2; // 2-6 bursts
                engagementHalfLife = Math.floor(Math.random() * 8) + 2; // 2-10 videos
            }
            featuresData.push([
                sessionLength / 200, // Normalize to 0-1
                attentionSpan / 100,
                dopamineSpikeIndex / 10,
                replaySensitivity / 20,
                (fatigueSlope + 2) / 4, // Normalize -2 to 2 -> 0 to 1
                circadianDrift,
                videoCount / 400,
                timeOfDay / 24,
                scrollMomentum, // Already 0-1
                rewardVariability / 40, // Normalize to 0-1
                bingeBursts / 10, // Normalize to 0-1
                engagementHalfLife / 50 // Normalize to 0-1
            ]);
            labelsData.push([isHealthy ? 0 : 1]); // 0 = healthy, 1 = doomscroll
        }
        if (!this.tf) {
            throw new Error('TensorFlow.js not loaded');
        }
        return {
            features: this.tf.tensor2d(featuresData),
            labels: this.tf.tensor2d(labelsData)
        };
    }
    /**
     * Extract features from session data for AI analysis
     */
    static extractFeatures(session, metrics) {
        const startDate = new Date(session.startTime);
        const fatigueSlope = MetricsEngine.calculateFatigueSlope(metrics.fatiguePoints);
        return {
            sessionLength: metrics.sessionLength,
            attentionSpan: metrics.attentionSpan,
            dopamineSpikeIndex: metrics.dopamineSpikeIndex,
            replaySensitivity: metrics.replaySensitivity,
            fatigueSlope,
            circadianDrift: metrics.circadianDrift ? 1 : 0,
            videoCount: session.videoCount,
            timeOfDay: startDate.getHours(),
            scrollMomentum: metrics.scrollMomentum || 0,
            rewardVariability: metrics.rewardVariability || 0,
            bingeBursts: metrics.bingeBursts?.length || 0,
            engagementHalfLife: metrics.engagementHalfLife || 0
        };
    }
    /**
     * Normalize features for model input
     */
    static normalizeFeatures(features) {
        return [
            Math.min(features.sessionLength / 200, 1), // Cap at 200 minutes
            Math.min(features.attentionSpan / 100, 1), // Cap at 100 seconds
            Math.min(features.dopamineSpikeIndex / 10, 1), // Cap at 10
            Math.min(features.replaySensitivity / 20, 1), // Cap at 20
            Math.max(0, Math.min((features.fatigueSlope + 2) / 4, 1)), // Normalize -2 to 2 -> 0 to 1
            features.circadianDrift,
            Math.min(features.videoCount / 400, 1), // Cap at 400 videos
            features.timeOfDay / 24,
            Math.min(features.scrollMomentum, 1), // Already 0-1 but ensure cap
            Math.min(features.rewardVariability / 40, 1), // Cap at 40 seconds
            Math.min(features.bingeBursts / 10, 1), // Cap at 10 bursts
            Math.min(features.engagementHalfLife / 50, 1) // Cap at 50 videos
        ];
    }
    /**
     * Classify a session using the trained model
     */
    static async classifySession(session, metrics) {
        try {
            // Ensure model is initialized
            if (!this.model) {
                await this.initialize();
            }
            if (!this.model) {
                throw new Error('Model not available');
            }
            // Extract and normalize features
            const features = this.extractFeatures(session, metrics);
            const normalizedFeatures = this.normalizeFeatures(features);
            if (!this.tf) {
                throw new Error('TensorFlow.js not loaded');
            }
            // Make prediction
            const prediction = this.model.predict(this.tf.tensor2d([normalizedFeatures]));
            const predictionData = await prediction.data();
            const confidence = predictionData[0];
            // Clean up tensors
            prediction.dispose();
            // Determine classification
            let classification;
            if (confidence > 0.7) {
                classification = 'doomscroll';
            }
            else if (confidence < 0.3) {
                classification = 'healthy';
            }
            else {
                classification = 'unknown';
            }
            return {
                classification,
                confidence: classification === 'unknown' ? 0.5 : Math.abs(confidence - 0.5) * 2,
                features,
                modelVersion: this.modelVersion
            };
        }
        catch (error) {
            console.error('Error in AI classification:', error);
            // Fallback to rule-based classification
            return {
                classification: metrics.healthClassification,
                confidence: 0.3, // Low confidence for fallback
                features: this.extractFeatures(session, metrics),
                modelVersion: 'fallback'
            };
        }
    }
    /**
     * Batch classify multiple sessions for efficiency
     */
    static async classifySessions(sessions) {
        if (!this.model) {
            await this.initialize();
        }
        if (!this.model || sessions.length === 0) {
            return sessions.map(({ session, metrics }) => ({
                classification: metrics.healthClassification,
                confidence: 0.3,
                features: this.extractFeatures(session, metrics),
                modelVersion: 'fallback'
            }));
        }
        try {
            // Extract and normalize all features
            const allFeatures = sessions.map(({ session, metrics }) => {
                const features = this.extractFeatures(session, metrics);
                return this.normalizeFeatures(features);
            });
            if (!this.tf) {
                throw new Error('TensorFlow.js not loaded');
            }
            // Make batch prediction
            const predictions = this.model.predict(this.tf.tensor2d(allFeatures));
            const predictionData = await predictions.data();
            // Clean up tensors
            predictions.dispose();
            // Process results
            return sessions.map(({ session, metrics }, index) => {
                const confidence = predictionData[index];
                let classification;
                if (confidence > 0.7) {
                    classification = 'doomscroll';
                }
                else if (confidence < 0.3) {
                    classification = 'healthy';
                }
                else {
                    classification = 'unknown';
                }
                return {
                    classification,
                    confidence: classification === 'unknown' ? 0.5 : Math.abs(confidence - 0.5) * 2,
                    features: this.extractFeatures(session, metrics),
                    modelVersion: this.modelVersion
                };
            });
        }
        catch (error) {
            console.error('Error in batch AI classification:', error);
            // Fallback to rule-based classification
            return sessions.map(({ session, metrics }) => ({
                classification: metrics.healthClassification,
                confidence: 0.3,
                features: this.extractFeatures(session, metrics),
                modelVersion: 'fallback'
            }));
        }
    }
    /**
     * Get model information and status
     */
    static getModelInfo() {
        return {
            isLoaded: !!this.model,
            version: this.modelVersion,
            isLoading: this.isLoading
        };
    }
    /**
     * Dispose of the model to free memory
     */
    static dispose() {
        if (this.model) {
            this.model.dispose();
            this.model = null;
        }
    }
    /**
     * Retrain model with new data (for future enhancement)
     */
    static async retrainModel() {
        this.dispose();
        await this.createAndTrainModel();
    }
}
AIClassifier.model = null; // tf.LayersModel type will be available after lazy load
AIClassifier.isLoading = false;
AIClassifier.modelVersion = '1.0.0';
AIClassifier.MODEL_URL = 'indexeddb://neuroscroll-ai-model';
AIClassifier.tf = null;

;// ./src/utils/ai-scheduler.ts
/**
 * AI Analysis Scheduler for NeuroScroll
 * Manages efficient scheduling and error handling for AI inference
 * Requirements: 5.4 - Real-time AI analysis with efficient scheduling
 */

class AIScheduler {
    constructor() {
        this.analysisQueue = [];
        this.isProcessing = false;
        this.processingInterval = null;
        this.maxRetries = 3;
        this.batchSize = 5;
        this.processingDelay = 1000; // 1 second between batches
        this.callbacks = new Map();
        this.startProcessing();
    }
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new AIScheduler();
        }
        return this.instance;
    }
    /**
     * Schedule a session for AI analysis
     */
    scheduleAnalysis(session, metrics, priority = 'normal', callback) {
        const analysis = {
            sessionId: session.id,
            session,
            metrics,
            priority,
            timestamp: Date.now(),
            retryCount: 0
        };
        // Remove any existing analysis for this session
        this.analysisQueue = this.analysisQueue.filter(a => a.sessionId !== session.id);
        // Add new analysis to queue
        this.analysisQueue.push(analysis);
        // Sort queue by priority and timestamp
        this.sortQueue();
        // Register callback if provided
        if (callback) {
            this.callbacks.set(session.id, callback);
        }
        console.log(`Scheduled AI analysis for session ${session.id} with priority ${priority}`);
    }
    /**
     * Schedule real-time analysis for active session
     */
    scheduleRealTimeAnalysis(session, metrics, callback) {
        // Real-time analysis gets high priority
        this.scheduleAnalysis(session, metrics, 'high', callback);
    }
    /**
     * Sort queue by priority and timestamp
     */
    sortQueue() {
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        this.analysisQueue.sort((a, b) => {
            // First sort by priority
            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityDiff !== 0) {
                return priorityDiff;
            }
            // Then by timestamp (older first)
            return a.timestamp - b.timestamp;
        });
    }
    /**
     * Start the processing loop
     */
    startProcessing() {
        if (this.processingInterval) {
            return;
        }
        this.processingInterval = setInterval(() => {
            this.processQueue();
        }, this.processingDelay);
    }
    /**
     * Stop the processing loop
     */
    stopProcessing() {
        if (this.processingInterval) {
            clearInterval(this.processingInterval);
            this.processingInterval = null;
        }
    }
    /**
     * Process the analysis queue
     */
    async processQueue() {
        if (this.isProcessing || this.analysisQueue.length === 0) {
            return;
        }
        this.isProcessing = true;
        try {
            // Get next batch of analyses
            const batch = this.analysisQueue.splice(0, this.batchSize);
            if (batch.length === 0) {
                return;
            }
            console.log(`Processing AI analysis batch of ${batch.length} sessions`);
            // Process batch
            const startTime = performance.now();
            const results = await this.processBatch(batch);
            const processingTime = performance.now() - startTime;
            // Handle results
            results.forEach((result, index) => {
                const analysis = batch[index];
                if (result.success) {
                    // Success - notify callback
                    const callback = this.callbacks.get(analysis.sessionId);
                    if (callback) {
                        callback({
                            sessionId: analysis.sessionId,
                            result: result.result,
                            processingTime: result.processingTime,
                            success: true
                        });
                        this.callbacks.delete(analysis.sessionId);
                    }
                }
                else {
                    // Failure - retry if possible
                    this.handleFailure(analysis, result.error);
                }
            });
            console.log(`Batch processing completed in ${processingTime.toFixed(2)}ms`);
        }
        catch (error) {
            console.error('Error processing AI analysis queue:', error);
        }
        finally {
            this.isProcessing = false;
        }
    }
    /**
     * Process a batch of analyses
     */
    async processBatch(batch) {
        const results = [];
        try {
            // Prepare data for batch processing
            const sessionData = batch.map(analysis => ({
                session: analysis.session,
                metrics: analysis.metrics
            }));
            // Perform batch classification
            const startTime = performance.now();
            const classifications = await AIClassifier.classifySessions(sessionData);
            const totalProcessingTime = performance.now() - startTime;
            const avgProcessingTime = totalProcessingTime / batch.length;
            // Map results
            classifications.forEach((classification) => {
                results.push({
                    success: true,
                    result: classification,
                    processingTime: avgProcessingTime
                });
            });
        }
        catch (error) {
            console.error('Batch AI classification failed:', error);
            // Fall back to individual processing
            for (const analysis of batch) {
                try {
                    const startTime = performance.now();
                    const result = await AIClassifier.classifySession(analysis.session, analysis.metrics);
                    const processingTime = performance.now() - startTime;
                    results.push({
                        success: true,
                        result,
                        processingTime
                    });
                }
                catch (individualError) {
                    results.push({
                        success: false,
                        processingTime: 0,
                        error: individualError instanceof Error ? individualError.message : 'Unknown error'
                    });
                }
            }
        }
        return results;
    }
    /**
     * Handle analysis failure with retry logic
     */
    handleFailure(analysis, error) {
        analysis.retryCount++;
        if (analysis.retryCount <= this.maxRetries) {
            // Retry with lower priority and exponential backoff
            analysis.priority = 'low';
            analysis.timestamp = Date.now() + (analysis.retryCount * 2000); // 2s, 4s, 6s delays
            this.analysisQueue.push(analysis);
            this.sortQueue();
            console.log(`Retrying AI analysis for session ${analysis.sessionId} (attempt ${analysis.retryCount}/${this.maxRetries})`);
        }
        else {
            // Max retries reached - notify callback with failure
            const callback = this.callbacks.get(analysis.sessionId);
            if (callback) {
                callback({
                    sessionId: analysis.sessionId,
                    result: {
                        classification: 'unknown',
                        confidence: 0,
                        features: AIClassifier.extractFeatures(analysis.session, analysis.metrics),
                        modelVersion: 'failed'
                    },
                    processingTime: 0,
                    success: false,
                    error: error || 'Max retries exceeded'
                });
                this.callbacks.delete(analysis.sessionId);
            }
            console.error(`AI analysis failed for session ${analysis.sessionId} after ${this.maxRetries} retries:`, error);
        }
    }
    /**
     * Get queue status
     */
    getQueueStatus() {
        const counts = this.analysisQueue.reduce((acc, analysis) => {
            acc[analysis.priority]++;
            return acc;
        }, { high: 0, normal: 0, low: 0 });
        return {
            queueLength: this.analysisQueue.length,
            isProcessing: this.isProcessing,
            highPriorityCount: counts.high,
            normalPriorityCount: counts.normal,
            lowPriorityCount: counts.low
        };
    }
    /**
     * Clear all pending analyses
     */
    clearQueue() {
        this.analysisQueue = [];
        this.callbacks.clear();
        console.log('AI analysis queue cleared');
    }
    /**
     * Clear analyses for a specific session
     */
    clearSessionAnalysis(sessionId) {
        this.analysisQueue = this.analysisQueue.filter(a => a.sessionId !== sessionId);
        this.callbacks.delete(sessionId);
    }
    /**
     * Dispose of the scheduler
     */
    dispose() {
        this.stopProcessing();
        this.clearQueue();
        AIScheduler.instance = null;
    }
}
AIScheduler.instance = null;

;// ./src/background/background.ts
/**
 * Background service worker for NeuroScroll extension
 * Handles message passing, data processing, and metrics computation
 * Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */




console.log('NeuroScroll background service worker loaded');
// Service Worker health monitoring
let serviceWorkerHealthy = true;
// Test storage access immediately to detect SW context issues
(async () => {
    try {
        await chrome.storage.local.set({ 'neuroscroll-sw-health': Date.now() });
        console.log('✅ Service Worker storage access confirmed');
        serviceWorkerHealthy = true;
    }
    catch (error) {
        console.error('❌ Service Worker storage access failed:', error);
        serviceWorkerHealthy = false;
    }
})();
// Periodic health check
setInterval(async () => {
    try {
        await chrome.storage.local.set({ 'neuroscroll-sw-health': Date.now() });
        if (!serviceWorkerHealthy) {
            console.log('✅ Service Worker recovered');
            serviceWorkerHealthy = true;
        }
    }
    catch (error) {
        if (serviceWorkerHealthy) {
            console.warn('⚠️ Service Worker health check failed:', error);
            serviceWorkerHealthy = false;
        }
    }
}, 30000); // Check every 30 seconds
const storageManager = new StorageManager();
const activeSessions = new Map();
const aiScheduler = AIScheduler.getInstance();
// Real-time metrics update interval (30 seconds)
const METRICS_UPDATE_INTERVAL = 30000;
// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log('Background received message:', message);
    // Validate message structure
    if (!message || typeof message.type !== 'string') {
        console.warn('Invalid message format:', message);
        sendResponse({ status: 'error', error: 'Invalid message format' });
        return true;
    }
    // Handle different message types
    switch (message.type) {
        case 'PING':
            sendResponse({ status: 'pong' });
            break;
        case 'SESSION_START':
            handleSessionStart(message, sendResponse);
            break;
        case 'SESSION_END':
            handleSessionEnd(message, sendResponse);
            break;
        case 'INTERACTION':
            handleInteraction(message, sendResponse);
            break;
        case 'GET_METRICS':
            handleGetMetrics(message, sendResponse);
            break;
        case 'GET_CURRENT_METRICS':
            handleGetCurrentMetrics(message, sendResponse);
            break;
        case 'GET_SESSIONS':
            handleGetSessions(message, sendResponse);
            break;
        case 'EXPORT_DATA':
            handleExportData(message, sendResponse);
            break;
        case 'CLEAR_DATA':
            handleClearData(message, sendResponse);
            break;
        case 'GET_ACTIVE_SESSION':
            handleGetActiveSession(message, sendResponse);
            break;
        case 'DEBUG_STATUS':
            handleDebugStatus(message, sendResponse);
            break;
        case 'RESTART_CONTENT_SCRIPT':
            handleRestartContentScript(message, sendResponse);
            break;
        case 'FORCE_START_SESSION':
            handleForceStartSession(message, sendResponse);
            break;
        case 'START_SESSION':
            handleSessionStart(message, sendResponse);
            break;
        case 'STOP_SESSION':
            handleStopSession(message, sendResponse);
            break;
        case 'ENABLE_SERVICE':
            handleEnableService(message, sendResponse);
            break;
        case 'DISABLE_SERVICE':
            handleDisableService(message, sendResponse);
            break;
        case 'GET_AI_STATUS':
            handleGetAIStatus(message, sendResponse);
            break;
        case 'CLASSIFY_SESSION':
            handleClassifySession(message, sendResponse);
            break;
        default:
            console.warn('Unknown message type:', message.type);
            sendResponse({ status: 'error', error: 'Unknown message type' });
    }
    return true; // Keep message channel open for async response
});
async function handleSessionStart(message, sendResponse) {
    try {
        // Handle both content script format (with sessionId, timestamp) and popup format (without)
        let sessionId = message.sessionId;
        let timestamp = message.timestamp;
        if (!sessionId) {
            // Create new session for popup request
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            timestamp = Date.now();
        }
        const session = {
            id: sessionId,
            startTime: timestamp,
            isActive: true,
            videoCount: 0,
            totalDwellTime: 0,
            interactions: []
        };
        activeSessions.set(sessionId, session);
        // Start real-time metrics updates for this session
        startRealTimeMetricsUpdates(sessionId);
        console.log('Session started:', sessionId);
        sendResponse({ status: 'success', sessionId });
    }
    catch (error) {
        console.error('Error starting session:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
async function handleSessionEnd(message, sendResponse) {
    try {
        const { sessionId, timestamp } = message;
        if (!sessionId || !timestamp) {
            throw new Error('Missing required fields: sessionId, timestamp');
        }
        const session = activeSessions.get(sessionId);
        if (!session) {
            throw new Error('Session not found: ' + sessionId);
        }
        // Finalize session
        session.endTime = timestamp;
        session.isActive = false;
        // Compute final metrics
        session.computedMetrics = MetricsEngine.computeMetrics(session);
        // Schedule AI classification for completed session
        scheduleAIAnalysis(session, session.computedMetrics, 'normal');
        // Save session to storage
        await storageManager.saveSession(session);
        // Stop real-time updates
        stopRealTimeMetricsUpdates(sessionId);
        // Remove from active sessions
        activeSessions.delete(sessionId);
        console.log('Session ended and saved:', sessionId, 'Metrics:', session.computedMetrics);
        sendResponse({
            status: 'success',
            metrics: session.computedMetrics
        });
    }
    catch (error) {
        console.error('Error ending session:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
async function handleInteraction(message, sendResponse) {
    try {
        const { interaction } = message;
        if (!interaction || !isValidInteraction(interaction)) {
            throw new Error('Invalid interaction data');
        }
        let session = activeSessions.get(interaction.sessionId);
        // Auto-create session if it doesn't exist (recovery mechanism)
        if (!session) {
            console.warn('Session not found, creating new session:', interaction.sessionId);
            session = {
                id: interaction.sessionId,
                startTime: interaction.timestamp - 1000, // Start slightly before first interaction
                isActive: true,
                videoCount: 0,
                totalDwellTime: 0,
                interactions: []
            };
            activeSessions.set(interaction.sessionId, session);
            startRealTimeMetricsUpdates(interaction.sessionId);
        }
        // Add interaction to session
        session.interactions.push(interaction);
        // Update session statistics
        updateSessionStats(session, interaction);
        // Update real-time metrics if significant interaction
        if (interaction.action === 'leave' || interaction.action === 'replay') {
            session.computedMetrics = MetricsEngine.updateRealTimeMetrics(session);
            // Schedule real-time AI analysis for active sessions with sufficient data
            if (session.interactions.length >= 5 && session.interactions.length % 10 === 0) {
                scheduleAIAnalysis(session, session.computedMetrics, 'high');
            }
        }
        // Auto-save session periodically to prevent data loss
        await autoSaveSession(session);
        console.log('Interaction recorded:', interaction.action, interaction.videoId, 'Session:', interaction.sessionId);
        sendResponse({
            status: 'success',
            metrics: session.computedMetrics
        });
    }
    catch (error) {
        console.error('Error handling interaction:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
function isValidInteraction(interaction) {
    try {
        // Check if interaction exists
        if (!interaction) {
            console.error('Interaction is null or undefined');
            return false;
        }
        // Validate required string fields
        if (typeof interaction.id !== 'string' || interaction.id.length === 0) {
            console.error('Invalid interaction.id:', interaction.id);
            return false;
        }
        if (typeof interaction.videoId !== 'string' || interaction.videoId.length === 0) {
            console.error('Invalid interaction.videoId:', interaction.videoId);
            return false;
        }
        if (typeof interaction.sessionId !== 'string' || interaction.sessionId.length === 0) {
            console.error('Invalid interaction.sessionId:', interaction.sessionId);
            return false;
        }
        // Validate timestamp
        if (typeof interaction.timestamp !== 'number' || interaction.timestamp <= 0) {
            console.error('Invalid interaction.timestamp:', interaction.timestamp);
            return false;
        }
        // Validate action
        if (!['enter', 'leave', 'replay', 'scroll'].includes(interaction.action)) {
            console.error('Invalid interaction.action:', interaction.action);
            return false;
        }
        // Validate metadata (can be empty object but must exist)
        if (typeof interaction.metadata !== 'object' || interaction.metadata === null) {
            console.error('Invalid interaction.metadata:', interaction.metadata);
            return false;
        }
        return true;
    }
    catch (error) {
        console.error('Error validating interaction:', error, 'Interaction data:', interaction);
        return false;
    }
}
async function handleGetMetrics(message, sendResponse) {
    try {
        const { sessionId } = message;
        if (sessionId) {
            // Get metrics for specific session
            const session = activeSessions.get(sessionId);
            if (session) {
                const metrics = MetricsEngine.updateRealTimeMetrics(session);
                sendResponse({ status: 'success', metrics });
            }
            else {
                // Check stored sessions
                const sessions = await StorageManager.get('neuroscroll-sessions') || [];
                const storedSession = sessions.find(s => s.id === sessionId);
                if (storedSession?.computedMetrics) {
                    sendResponse({ status: 'success', metrics: storedSession.computedMetrics });
                }
                else {
                    throw new Error('Session not found: ' + sessionId);
                }
            }
        }
        else {
            // Get metrics for all active sessions
            const allMetrics = {};
            for (const [id, session] of activeSessions) {
                allMetrics[id] = MetricsEngine.updateRealTimeMetrics(session);
            }
            sendResponse({ status: 'success', metrics: allMetrics });
        }
    }
    catch (error) {
        console.error('Error getting metrics:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
async function handleGetCurrentMetrics(_message, sendResponse) {
    try {
        const storedSessions = await StorageManager.get('neuroscroll-sessions') || [];
        const activeSessionsArray = Array.from(activeSessions.values());
        const settings = await StorageManager.getSettings();
        const serviceEnabled = settings.serviceEnabled !== false; // Default to true
        // Get the most recent active session or create default metrics
        let currentMetrics = {
            sessionActive: activeSessionsArray.length > 0,
            serviceEnabled: serviceEnabled,
            videoCount: 0,
            interactionCount: 0,
            attentionSpan: 0,
            dopamineIndex: 0,
            replaySensitivity: 0,
            sessionLength: 0,
            circadianDrift: 0,
            activeSessions: activeSessionsArray.length,
            storedSessions: storedSessions.length,
            lastUpdate: new Date().toLocaleTimeString(),
            scrollMomentum: 0,
            rewardVariability: 0,
            bingeBursts: 0,
            engagementHalfLife: 0,
            cognitiveLoad: 0,
            habitStrength: 0,
            noveltyBias: 0,
            sessionArchetype: 'unknown',
            aiClassification: 'unknown',
            aiConfidence: 0
        };
        if (activeSessionsArray.length > 0) {
            // Get metrics from the most recent active session
            const mostRecentSession = activeSessionsArray.sort((a, b) => b.startTime - a.startTime)[0];
            const metrics = MetricsEngine.updateRealTimeMetrics(mostRecentSession);
            if (metrics) {
                currentMetrics = {
                    sessionActive: true,
                    serviceEnabled: serviceEnabled,
                    videoCount: mostRecentSession.videoCount || 0,
                    interactionCount: mostRecentSession.interactions.length || 0,
                    attentionSpan: metrics.attentionSpan || 0,
                    dopamineIndex: metrics.dopamineSpikeIndex || 0,
                    replaySensitivity: metrics.replaySensitivity || 0,
                    sessionLength: Math.floor((Date.now() - mostRecentSession.startTime) / 1000) || 0,
                    circadianDrift: metrics.circadianDrift ? 100 : 0,
                    activeSessions: activeSessionsArray.length,
                    storedSessions: storedSessions.length,
                    lastUpdate: new Date().toLocaleTimeString(),
                    scrollMomentum: metrics.scrollMomentum || 0,
                    rewardVariability: metrics.rewardVariability || 0,
                    bingeBursts: metrics.bingeBursts?.length || 0,
                    engagementHalfLife: metrics.engagementHalfLife || 0,
                    cognitiveLoad: metrics.cognitiveLoad || 0,
                    habitStrength: metrics.habitStrength || 0,
                    noveltyBias: metrics.noveltyBias || 0,
                    sessionArchetype: (metrics.sessionArchetype || 'unknown'),
                    aiClassification: (metrics.healthClassification || 'unknown'),
                    aiConfidence: metrics.confidence || 0
                };
            }
        }
        sendResponse(currentMetrics);
    }
    catch (error) {
        console.error('Error getting current metrics:', error);
        sendResponse({
            error: error instanceof Error ? error.message : 'Unknown error',
            sessionActive: false,
            serviceEnabled: true,
            videoCount: 0,
            interactionCount: 0,
            attentionSpan: 0,
            dopamineIndex: 0,
            replaySensitivity: 0,
            sessionLength: 0,
            circadianDrift: 0,
            activeSessions: 0,
            storedSessions: 0,
            lastUpdate: new Date().toLocaleTimeString(),
            scrollMomentum: 0,
            rewardVariability: 0,
            bingeBursts: 0,
            engagementHalfLife: 0,
            sessionArchetype: 'unknown',
            aiClassification: 'unknown',
            aiConfidence: 0
        });
    }
}
async function handleGetSessions(message, sendResponse) {
    try {
        const { includeActive = true, limit } = message;
        // Get stored sessions
        const storedSessions = await StorageManager.get('neuroscroll-sessions') || [];
        let allSessions = [...storedSessions];
        // Add active sessions if requested
        if (includeActive) {
            const activeSessArray = Array.from(activeSessions.values()).map(session => ({
                ...session,
                computedMetrics: MetricsEngine.updateRealTimeMetrics(session)
            }));
            allSessions = [...allSessions, ...activeSessArray];
        }
        // Sort by start time (newest first)
        allSessions.sort((a, b) => b.startTime - a.startTime);
        // Apply limit if specified
        if (limit && limit > 0) {
            allSessions = allSessions.slice(0, limit);
        }
        sendResponse({ status: 'success', sessions: allSessions });
    }
    catch (error) {
        console.error('Error getting sessions:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
async function handleExportData(message, sendResponse) {
    try {
        const { format = 'csv' } = message;
        if (format === 'csv') {
            const csvData = await StorageManager.exportAsCSV();
            sendResponse({ status: 'success', data: csvData, format: 'csv' });
        }
        else if (format === 'json') {
            const sessions = await StorageManager.get('neuroscroll-sessions') || [];
            const jsonData = JSON.stringify(sessions, null, 2);
            sendResponse({ status: 'success', data: jsonData, format: 'json' });
        }
        else {
            throw new Error('Unsupported export format: ' + format);
        }
    }
    catch (error) {
        console.error('Error exporting data:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
async function handleClearData(message, sendResponse) {
    try {
        // For popup requests, auto-confirm (user already clicked the button)
        const confirmed = message.confirmed !== undefined ? message.confirmed : true;
        if (!confirmed) {
            sendResponse({ status: 'error', error: 'Data clearing requires confirmation' });
            return;
        }
        // Clear stored data
        const success = await StorageManager.clearAllData();
        // Clear active sessions
        activeSessions.clear();
        // Stop all real-time updates
        clearAllRealTimeUpdates();
        if (success) {
            console.log('All data cleared successfully');
            sendResponse({ status: 'success' });
        }
        else {
            throw new Error('Failed to clear storage');
        }
    }
    catch (error) {
        console.error('Error clearing data:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
async function handleGetActiveSession(_message, sendResponse) {
    try {
        const activeSessArray = Array.from(activeSessions.values()).map(session => ({
            ...session,
            computedMetrics: MetricsEngine.updateRealTimeMetrics(session)
        }));
        // Return the most recent active session
        const mostRecentSession = activeSessArray.sort((a, b) => b.startTime - a.startTime)[0] || null;
        sendResponse({ status: 'success', session: mostRecentSession });
    }
    catch (error) {
        console.error('Error getting active session:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
async function handleDebugStatus(_message, sendResponse) {
    try {
        const storedSessions = await StorageManager.get('neuroscroll-sessions') || [];
        const activeSessionsArray = Array.from(activeSessions.values());
        // Get service status from settings
        const settings = await StorageManager.getSettings();
        const debugInfo = {
            activeSessionsCount: activeSessions.size,
            storedSessionsCount: storedSessions.length,
            serviceEnabled: settings.serviceEnabled !== false, // Default to enabled
            activeSessions: activeSessionsArray.map(s => ({
                id: s.id,
                startTime: new Date(s.startTime).toISOString(),
                interactionCount: s.interactions.length,
                videoCount: s.videoCount,
                isActive: s.isActive
            })),
            recentStoredSessions: storedSessions.slice(-5).map(s => ({
                id: s.id,
                startTime: new Date(s.startTime).toISOString(),
                endTime: s.endTime ? new Date(s.endTime).toISOString() : 'Active',
                interactionCount: s.interactions.length,
                videoCount: s.videoCount,
                isActive: s.isActive
            })),
            lastSaveTimes: Object.fromEntries(lastSaveTime.entries())
        };
        console.log('Debug status:', debugInfo);
        sendResponse({ status: 'success', debug: debugInfo });
    }
    catch (error) {
        console.error('Error getting debug status:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
async function handleRestartContentScript(_message, sendResponse) {
    try {
        // Get current active tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length === 0) {
            throw new Error('No active tab found');
        }
        const tab = tabs[0];
        if (!tab.id) {
            throw new Error('Tab ID not available');
        }
        if (!tab.url || !tab.url.includes('youtube.com')) {
            throw new Error('Current tab is not YouTube');
        }
        // Reload the content script
        await chrome.tabs.reload(tab.id);
        sendResponse({ status: 'success', message: 'Content script restarted' });
    }
    catch (error) {
        console.error('Error restarting content script:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
async function handleForceStartSession(message, sendResponse) {
    try {
        const { tabId, url } = message;
        // Validate that we're on YouTube Shorts
        if (!url || !url.includes('youtube.com')) {
            throw new Error('Not on YouTube - please navigate to YouTube Shorts first');
        }
        // Create a new session directly in the background
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = Date.now();
        const session = {
            id: sessionId,
            startTime: timestamp,
            isActive: true,
            videoCount: 0,
            totalDwellTime: 0,
            interactions: []
        };
        // Add to active sessions
        activeSessions.set(sessionId, session);
        // Start real-time metrics updates
        startRealTimeMetricsUpdates(sessionId);
        // Try to notify content script (if it exists)
        try {
            await chrome.tabs.sendMessage(tabId, {
                type: 'SESSION_CREATED',
                sessionId: sessionId,
                timestamp: timestamp
            });
        }
        catch (contentScriptError) {
            // Content script might not be loaded, that's okay
            console.log('Content script not available, session created in background only');
        }
        console.log('Force started session:', sessionId);
        sendResponse({
            status: 'success',
            sessionId: sessionId,
            message: 'Session started successfully'
        });
    }
    catch (error) {
        console.error('Error force starting session:', error);
        sendResponse({
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
async function handleStopSession(_message, sendResponse) {
    try {
        const activeSessionsArray = Array.from(activeSessions.values());
        if (activeSessionsArray.length === 0) {
            throw new Error('No active sessions to stop');
        }
        // Stop all active sessions
        const stoppedSessions = [];
        for (const session of activeSessionsArray) {
            try {
                // Finalize session
                session.endTime = Date.now();
                session.isActive = false;
                // Compute final metrics
                session.computedMetrics = MetricsEngine.computeMetrics(session);
                // Save session to storage
                await storageManager.saveSession(session);
                // Stop real-time updates
                stopRealTimeMetricsUpdates(session.id);
                // Remove from active sessions
                activeSessions.delete(session.id);
                stoppedSessions.push(session.id);
                console.log('Session stopped:', session.id);
            }
            catch (error) {
                console.error('Error stopping session:', session.id, error);
            }
        }
        sendResponse({
            status: 'success',
            message: `Stopped ${stoppedSessions.length} session(s)`,
            stoppedSessions
        });
    }
    catch (error) {
        console.error('Error stopping sessions:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
async function handleEnableService(_message, sendResponse) {
    try {
        const settings = await StorageManager.getSettings();
        settings.serviceEnabled = true;
        await StorageManager.saveSettings(settings);
        console.log('NeuroScroll service enabled');
        sendResponse({ status: 'success', message: 'Service enabled successfully' });
    }
    catch (error) {
        console.error('Error enabling service:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
async function handleDisableService(_message, sendResponse) {
    try {
        const settings = await StorageManager.getSettings();
        settings.serviceEnabled = false;
        await StorageManager.saveSettings(settings);
        // Stop all active sessions when disabling service
        const activeSessionsArray = Array.from(activeSessions.values());
        for (const session of activeSessionsArray) {
            try {
                session.endTime = Date.now();
                session.isActive = false;
                session.computedMetrics = MetricsEngine.computeMetrics(session);
                await storageManager.saveSession(session);
                stopRealTimeMetricsUpdates(session.id);
                activeSessions.delete(session.id);
            }
            catch (error) {
                console.error('Error stopping session during service disable:', session.id, error);
            }
        }
        console.log('NeuroScroll service disabled');
        sendResponse({ status: 'success', message: 'Service disabled successfully' });
    }
    catch (error) {
        console.error('Error disabling service:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
function updateSessionStats(session, interaction) {
    switch (interaction.action) {
        case 'enter': {
            // Track unique videos
            const uniqueVideos = new Set(session.interactions
                .filter(i => i.action === 'enter')
                .map(i => i.videoId));
            session.videoCount = uniqueVideos.size;
            break;
        }
        case 'leave':
            // Add dwell time to total
            if (interaction.metadata.dwellTime) {
                session.totalDwellTime += interaction.metadata.dwellTime;
            }
            break;
    }
}
// Initialize extension on install
chrome.runtime.onInstalled.addListener(async () => {
    console.log('NeuroScroll extension installed');
    await recoverActiveSessions();
});
// Handle extension startup
chrome.runtime.onStartup.addListener(async () => {
    console.log('NeuroScroll extension started');
    await recoverActiveSessions();
});
// Recover sessions when service worker starts
recoverActiveSessions();
// Real-time metrics update system
const metricsUpdateIntervals = new Map();
// Auto-save tracking
const lastSaveTime = new Map();
const AUTO_SAVE_INTERVAL = 10000; // Save every 10 seconds
/**
 * Auto-save session to prevent data loss
 */
async function autoSaveSession(session) {
    if (!session || !session.id) {
        console.error('Invalid session for auto-save:', session);
        return;
    }
    const now = Date.now();
    const lastSave = lastSaveTime.get(session.id) || 0;
    // Only save if enough time has passed or if this is the first save
    if (now - lastSave > AUTO_SAVE_INTERVAL || lastSave === 0) {
        try {
            // Validate session data before saving
            if (!Array.isArray(session.interactions)) {
                console.error('Invalid interactions array in session:', session.id);
                return;
            }
            // Create a copy for saving (don't mark as ended)
            const sessionCopy = {
                ...session,
                interactions: [...session.interactions] // Deep copy interactions array
            };
            // Only compute metrics if we have interactions
            if (session.interactions.length > 0) {
                sessionCopy.computedMetrics = MetricsEngine.updateRealTimeMetrics(session);
            }
            await storageManager.saveSession(sessionCopy);
            lastSaveTime.set(session.id, now);
            console.log('Auto-saved session:', session.id, 'Interactions:', session.interactions.length);
        }
        catch (error) {
            console.error('Error auto-saving session:', session.id, error);
            // Don't update lastSaveTime on error so we'll retry next time
        }
    }
}
/**
 * Recover active sessions from storage on startup
 */
async function recoverActiveSessions() {
    try {
        console.log('Attempting to recover active sessions...');
        const storedSessions = await StorageManager.get('neuroscroll-sessions') || [];
        if (!Array.isArray(storedSessions)) {
            console.error('Invalid stored sessions data:', storedSessions);
            return;
        }
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        const recentSessions = storedSessions.filter(session => {
            try {
                // Validate session structure
                return (session &&
                    typeof session.id === 'string' &&
                    typeof session.startTime === 'number' &&
                    typeof session.isActive === 'boolean' &&
                    Array.isArray(session.interactions) &&
                    session.isActive &&
                    session.startTime > fiveMinutesAgo);
            }
            catch (error) {
                console.error('Error validating session for recovery:', session, error);
                return false;
            }
        });
        let recoveredCount = 0;
        for (const session of recentSessions) {
            try {
                activeSessions.set(session.id, session);
                startRealTimeMetricsUpdates(session.id);
                recoveredCount++;
                console.log('Recovered active session:', session.id, 'Interactions:', session.interactions.length);
            }
            catch (error) {
                console.error('Error recovering individual session:', session.id, error);
            }
        }
        if (recoveredCount > 0) {
            console.log(`Successfully recovered ${recoveredCount} active sessions`);
        }
        else {
            console.log('No active sessions to recover');
        }
    }
    catch (error) {
        console.error('Error recovering active sessions:', error);
    }
}
function startRealTimeMetricsUpdates(sessionId) {
    // Clear existing interval if any
    stopRealTimeMetricsUpdates(sessionId);
    const interval = setInterval(() => {
        const session = activeSessions.get(sessionId);
        if (session && session.isActive) {
            // Update metrics
            session.computedMetrics = MetricsEngine.updateRealTimeMetrics(session);
            // Broadcast updated metrics to popup if open
            chrome.runtime.sendMessage({
                type: 'METRICS_UPDATE',
                sessionId,
                metrics: session.computedMetrics
            }).catch(() => {
                // Popup might not be open, ignore error
            });
        }
        else {
            // Session no longer active, stop updates
            stopRealTimeMetricsUpdates(sessionId);
        }
    }, METRICS_UPDATE_INTERVAL);
    metricsUpdateIntervals.set(sessionId, interval);
}
function stopRealTimeMetricsUpdates(sessionId) {
    const interval = metricsUpdateIntervals.get(sessionId);
    if (interval) {
        clearInterval(interval);
        metricsUpdateIntervals.delete(sessionId);
    }
}
function clearAllRealTimeUpdates() {
    for (const [sessionId] of metricsUpdateIntervals) {
        stopRealTimeMetricsUpdates(sessionId);
    }
}
// Periodic auto-save of all active sessions (every 30 seconds)
setInterval(async () => {
    for (const [sessionId, session] of activeSessions) {
        try {
            await autoSaveSession(session);
        }
        catch (error) {
            console.error('Error in periodic auto-save for session:', sessionId, error);
        }
    }
}, 30000); // 30 seconds
// Initialize AI system on startup
initializeAISystem();
/**
 * Initialize the AI classification system
 */
async function initializeAISystem() {
    try {
        console.log('Initializing AI classification system...');
        await AIClassifier.initialize();
        console.log('AI classification system initialized successfully');
    }
    catch (error) {
        console.error('Failed to initialize AI system:', error);
    }
}
/**
 * Schedule AI analysis for a session
 */
function scheduleAIAnalysis(session, metrics, priority = 'normal') {
    try {
        aiScheduler.scheduleAnalysis(session, metrics, priority, (result) => {
            if (result.success) {
                // Update session with AI classification
                const updatedMetrics = {
                    ...metrics,
                    healthClassification: result.result.classification,
                    confidence: result.result.confidence
                };
                // Update active session if it exists
                const activeSession = activeSessions.get(session.id);
                if (activeSession) {
                    activeSession.computedMetrics = updatedMetrics;
                }
                // Save updated session to storage
                storageManager.saveSession({
                    ...session,
                    computedMetrics: updatedMetrics
                }).catch(error => {
                    console.error('Error saving AI-updated session:', error);
                });
                console.log(`AI analysis completed for session ${session.id}: ${result.result.classification} (${(result.result.confidence * 100).toFixed(1)}%)`);
            }
            else {
                console.error(`AI analysis failed for session ${session.id}:`, result.error);
            }
        });
    }
    catch (error) {
        console.error('Error scheduling AI analysis:', error);
    }
}
/**
 * Handle AI status request
 */
async function handleGetAIStatus(_message, sendResponse) {
    try {
        const modelInfo = AIClassifier.getModelInfo();
        const queueStatus = aiScheduler.getQueueStatus();
        const settings = await StorageManager.getSettings();
        const aiStatus = {
            enabled: settings.enableAI !== false, // Default to enabled
            modelLoaded: modelInfo.isLoaded,
            modelVersion: modelInfo.version,
            isLoading: modelInfo.isLoading,
            queueLength: queueStatus.queueLength,
            isProcessing: queueStatus.isProcessing,
            highPriorityCount: queueStatus.highPriorityCount,
            normalPriorityCount: queueStatus.normalPriorityCount,
            lowPriorityCount: queueStatus.lowPriorityCount
        };
        sendResponse({ status: 'success', aiStatus });
    }
    catch (error) {
        console.error('Error getting AI status:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
/**
 * Handle manual session classification request
 */
async function handleClassifySession(message, sendResponse) {
    try {
        const { sessionId } = message;
        if (!sessionId) {
            throw new Error('Session ID is required');
        }
        // Find session (active or stored)
        let session = activeSessions.get(sessionId);
        let metrics;
        if (session) {
            metrics = MetricsEngine.updateRealTimeMetrics(session);
        }
        else {
            // Check stored sessions
            const storedSessions = await StorageManager.get('neuroscroll-sessions') || [];
            const storedSession = storedSessions.find(s => s.id === sessionId);
            if (!storedSession) {
                throw new Error('Session not found: ' + sessionId);
            }
            session = storedSession;
            metrics = storedSession.computedMetrics || MetricsEngine.computeMetrics(storedSession);
        }
        // Perform immediate AI classification
        const result = await AIClassifier.classifySession(session, metrics);
        // Update session with AI results
        const updatedMetrics = {
            ...metrics,
            healthClassification: result.classification,
            confidence: result.confidence
        };
        // Update active session if it exists
        if (activeSessions.has(sessionId)) {
            activeSessions.get(sessionId).computedMetrics = updatedMetrics;
        }
        // Save updated session
        await storageManager.saveSession({
            ...session,
            computedMetrics: updatedMetrics
        });
        sendResponse({
            status: 'success',
            classification: result,
            metrics: updatedMetrics
        });
    }
    catch (error) {
        console.error('Error classifying session:', error);
        sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
// Periodic cleanup of old data (runs every hour)
setInterval(async () => {
    try {
        const sessions = await StorageManager.get('neuroscroll-sessions') || [];
        const settings = await StorageManager.getSettings();
        const retentionMs = settings.dataRetentionDays * 24 * 60 * 60 * 1000;
        const cutoffTime = Date.now() - retentionMs;
        const filteredSessions = sessions.filter(session => session.startTime > cutoffTime);
        if (filteredSessions.length !== sessions.length) {
            await StorageManager.set('neuroscroll-sessions', filteredSessions);
            console.log(`Cleaned up ${sessions.length - filteredSessions.length} old sessions`);
        }
    }
    catch (error) {
        console.error('Error cleaning up old data:', error);
    }
}, 60 * 60 * 1000); // 1 hour
// Cleanup on extension shutdown
chrome.runtime.onSuspend.addListener(() => {
    console.log('Extension suspending, cleaning up AI resources...');
    aiScheduler.dispose();
    AIClassifier.dispose();
});
chrome.runtime.onSuspend.addListener(async () => {
    console.log('Extension suspending, saving active sessions...');
    // Stop all real-time updates
    clearAllRealTimeUpdates();
    for (const [sessionId, session] of activeSessions) {
        try {
            session.endTime = Date.now();
            session.isActive = false;
            // Compute final metrics
            session.computedMetrics = MetricsEngine.computeMetrics(session);
            await storageManager.saveSession(session);
            console.log('Saved session on suspend:', sessionId);
        }
        catch (error) {
            console.error('Error saving session on suspend:', error);
        }
    }
    activeSessions.clear();
});

/******/ })()
;