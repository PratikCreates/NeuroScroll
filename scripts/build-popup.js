const fs = require('fs');
const path = require('path');

// Create popup-dist directory if it doesn't exist
const distDir = path.join(__dirname, '../popup-dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create a static HTML file without inline scripts
const staticHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NeuroScroll Dashboard</title>
    <style>
        /* Chrome extension specific styles */
        html, body {
            width: 450px;
            height: 700px;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            overflow-y: auto;
            font-family: 'Inter', system-ui, sans-serif;
            /* Prevent zoom from closing extension */
            transform-origin: top left;
            position: relative;
        }

        /* Prevent extension from closing on zoom */
        html {
            zoom: 1 !important;
            transform: scale(1) !important;
        }

        .popup-container {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            box-sizing: border-box;
        }

        .metrics-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .metric-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .metric-item:last-child {
            border-bottom: none;
        }

        .metric-label {
            font-size: 14px;
            opacity: 0.9;
        }

        .metric-value {
            font-size: 18px;
            font-weight: 600;
        }

        .debug-section {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 16px;
            margin-top: 20px;
        }

        .btn-primary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
            flex: 1;
        }

        .btn-primary:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.3);
        }

        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .btn-success {
            background: rgba(34, 197, 94, 0.3);
        }

        .btn-success:hover:not(:disabled) {
            background: rgba(34, 197, 94, 0.4);
        }

        .brain-mascot {
            text-align: center;
            margin-bottom: 20px;
        }

        .brain-emoji {
            font-size: 48px;
            margin-bottom: 10px;
            display: block;
            transition: all 0.3s ease;
        }

        .text-green-400 { color: #4ade80; }
        .text-red-400 { color: #f87171; }
        .text-yellow-400 { color: #facc15; }
        .text-white { color: white; }
        .text-center { text-align: center; }
        .text-xl { font-size: 1.25rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .mb-1 { margin-bottom: 0.25rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-5 { margin-bottom: 1.25rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-3 { margin-top: 0.75rem; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .w-full { width: 100%; }
        .flex-1 { flex: 1; }
        .opacity-70 { opacity: 0.7; }
        .opacity-80 { opacity: 0.8; }
        .opacity-90 { opacity: 0.9; }
        .uppercase { text-transform: uppercase; }
        .leading-relaxed { line-height: 1.625; }

        /* Fullscreen mode */
        .fullscreen-mode {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            padding: 2rem !important;
            overflow-y: auto !important;
        }
    </style>
</head>
<body>
    <div class="popup-container">
        <div class="text-center mb-6">
            <div class="brain-mascot">
                <div class="brain-emoji" id="brain-emoji">🧠</div>
                <div class="text-center">
                    <div class="text-sm font-medium mb-1" style="color:#f97316" id="brain-status">Scattered</div>
                    <div class="text-xs text-white opacity-70" id="brain-description">Low attention span</div>
                </div>
                <div class="mt-3 text-xs text-white opacity-70 text-center">
                    <div>Fatigue: <span id="fatigue-percent">0</span>%</div>
                    <div>Focus: <span id="focus-time">0.0</span>s</div>
                    <div>Stimulation: <span id="stimulation-level">0.0</span></div>
                </div>
            </div>
            <h1 class="text-xl font-bold mb-1 mt-3">NeuroScroll</h1>
            <p class="text-xs opacity-90">YouTube Shorts behavior analyzer</p>
        </div>
        
        <div class="metrics-card">
            <div class="metric-item" title="Current tracking session state">
                <div class="flex items-center gap-3">
                    <span class="text-xl">🔄</span>
                    <div>
                        <div class="metric-label">Session Status</div>
                    </div>
                </div>
                <span class="metric-value text-red-400" id="session-status">Loading...</span>
            </div>
            
            <div class="metric-item" title="Whether the NeuroScroll tracking service is enabled">
                <div class="flex items-center gap-3">
                    <span class="text-xl">⚙️</span>
                    <div>
                        <div class="metric-label">Service Status</div>
                    </div>
                </div>
                <span class="metric-value text-green-400" id="service-status">Loading...</span>
            </div>
            
            <div class="metric-item" title="Total number of YouTube Shorts viewed in this session">
                <div class="flex items-center gap-3">
                    <span class="text-xl">📺</span>
                    <div>
                        <div class="metric-label">Videos Watched</div>
                    </div>
                </div>
                <span class="metric-value text-white" id="video-count">-</span>
            </div>
            
            <div class="metric-item" title="Total user interactions (scrolls, enters, leaves, replays)">
                <div class="flex items-center gap-3">
                    <span class="text-xl">👆</span>
                    <div>
                        <div class="metric-label">Interactions</div>
                    </div>
                </div>
                <span class="metric-value text-white" id="interaction-count">-</span>
            </div>
            
            <div class="metric-item" title="Average time spent watching each video - indicates focus level">
                <div class="flex items-center gap-3">
                    <span class="text-xl">🧠</span>
                    <div>
                        <div class="metric-label">Attention Span</div>
                    </div>
                </div>
                <span class="metric-value text-white" id="attention-span">-</span>
            </div>
            
            <div class="metric-item" title="Rapid content consumption rate - higher values may indicate dopamine-seeking behavior">
                <div class="flex items-center gap-3">
                    <span class="text-xl">⚡</span>
                    <div>
                        <div class="metric-label">Dopamine Spike Index</div>
                    </div>
                </div>
                <span class="metric-value text-white" id="dopamine-index">-</span>
            </div>
            
            <div class="metric-item" title="Number of video replays - indicates content engagement or compulsive behavior">
                <div class="flex items-center gap-3">
                    <span class="text-xl">🔁</span>
                    <div>
                        <div class="metric-label">Replay Sensitivity</div>
                    </div>
                </div>
                <span class="metric-value text-white" id="replay-sensitivity">-</span>
            </div>
            
            <div class="metric-item" title="Total session duration - longer sessions may indicate binge behavior">
                <div class="flex items-center gap-3">
                    <span class="text-xl">⏱️</span>
                    <div>
                        <div class="metric-label">Session Length</div>
                    </div>
                </div>
                <span class="metric-value text-white" id="session-length">-</span>
            </div>
            
            <div class="metric-item" title="Late-night usage (11 PM - 6 AM) can disrupt circadian rhythms">
                <div class="flex items-center gap-3">
                    <span class="text-xl">🌙</span>
                    <div>
                        <div class="metric-label">Circadian Drift</div>
                    </div>
                </div>
                <span class="metric-value text-white" id="circadian-drift">-</span>
            </div>
        </div>
        
        <div class="debug-section">
            <div class="text-xs font-semibold mb-3 opacity-80 uppercase">Debug Information</div>
            <div class="text-xs opacity-70 mb-1">Active Sessions: <span id="debug-active-sessions">0</span></div>
            <div class="text-xs opacity-70 mb-1">Stored Sessions: <span id="debug-stored-sessions">0</span></div>
            <div class="text-xs opacity-70 mb-4">Last Update: <span id="debug-last-update">Never</span></div>
            
            <!-- Service Control -->
            <div class="flex gap-2 mb-2">
                <button class="btn-primary flex-1" id="service-toggle-btn" disabled>Enable Service</button>
                <button class="btn-primary flex-1" id="fullscreen-btn" disabled>🔼 Expand</button>
            </div>

            <!-- Session Control -->
            <div class="flex gap-2 mb-2">
                <button class="btn-primary btn-success flex-1" id="start-session-btn" disabled>▶️ Start Session</button>
                <button class="btn-primary flex-1" id="stop-session-btn" disabled style="background: rgba(239, 68, 68, 0.3);">⏹️ Stop Session</button>
            </div>

            <!-- Data Management -->
            <div class="flex gap-2 mb-2">
                <button class="btn-primary flex-1" id="refresh-btn" disabled>🔄 Refresh</button>
                <button class="btn-primary flex-1" id="export-btn" disabled>📊 Export</button>
                <button class="btn-primary flex-1" id="clear-btn" disabled>🗑️ Clear</button>
            </div>
        </div>
        
        <div id="error-message" style="display: none;" class="mt-3 p-2 bg-red-500/20 rounded text-xs text-red-200">
            Error: <span id="error-text"></span>
        </div>
    </div>
    
    <script src="popup.js"></script>
</body>
</html>`;

// Write the static HTML file
fs.writeFileSync(path.join(__dirname, '../popup-dist/index.html'), staticHtml);

console.log('✅ Static popup HTML generated successfully');