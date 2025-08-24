/**
 * Popup script for NeuroScroll extension
 * Displays real-time metrics and debug information
 */

let currentData = null;
let isFullscreen = false;

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're in a standalone window (fullscreen mode)
  checkIfStandaloneWindow();
  
  refreshData();
  
  // Auto-refresh every 5 seconds
  setInterval(refreshData, 5000);
  
  // Attach event listeners to buttons
  document.getElementById('refresh-btn').addEventListener('click', refreshData);
  document.getElementById('export-btn').addEventListener('click', exportData);
  document.getElementById('clear-btn').addEventListener('click', clearData);
  document.getElementById('start-session-btn').addEventListener('click', startSession);
  document.getElementById('stop-session-btn').addEventListener('click', stopSession);
  document.getElementById('service-toggle-btn').addEventListener('click', toggleService);
  document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);
});

// Check if popup is opened in standalone window
function checkIfStandaloneWindow() {
  // If we're in a standalone window, adjust the UI
  if (window.location.search.includes('standalone') || window.outerWidth > 500) {
    isFullscreen = true;
    
    // Add fullscreen class to html and body
    document.documentElement.classList.add('fullscreen-mode');
    document.body.classList.add('fullscreen-mode');
    
    const btn = document.getElementById('fullscreen-btn');
    if (btn) {
      btn.textContent = '🔽 Close Window';
      // Change the function to close window instead
      btn.onclick = function() {
        window.close();
      };
    }
  }
}

// Refresh all data from background script
async function refreshData() {
  try {
    // Show loading state
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.textContent = 'Loading...';
      refreshBtn.disabled = true;
    }
    
    // Always enable buttons first, regardless of background script status
    enableAllButtons();
    
    // Try to get data from background script
    let debugResponse, activeSessionResponse, allSessionsResponse;
    
    try {
      debugResponse = await chrome.runtime.sendMessage({ type: 'DEBUG_STATUS' });
      activeSessionResponse = await chrome.runtime.sendMessage({ type: 'GET_ACTIVE_SESSION' });
      allSessionsResponse = await chrome.runtime.sendMessage({ type: 'GET_SESSIONS', limit: 10 });
    } catch (bgError) {
      console.warn('Background script not responding, using fallback data:', bgError);
      // Use fallback data when background script is not available
      debugResponse = { debug: { activeSessionsCount: 0, storedSessionsCount: 0 } };
      activeSessionResponse = { session: null };
      allSessionsResponse = { sessions: [] };
    }
    
    currentData = {
      debug: debugResponse.debug,
      activeSession: activeSessionResponse.session,
      allSessions: allSessionsResponse.sessions || []
    };
    
    updateUI();
    
    // Reset button state
    if (refreshBtn) {
      refreshBtn.textContent = '🔄 Refresh';
      refreshBtn.disabled = false;
    }
    
  } catch (error) {
    console.error('Error refreshing data:', error);
    
    // Still enable buttons even on error
    enableAllButtons();
    updateUIError();
    
    // Reset button state
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.textContent = '🔄 Refresh';
      refreshBtn.disabled = false;
    }
  }
}

// Update UI with current data
function updateUI() {
  if (!currentData) return;
  
  const { debug, activeSession, allSessions } = currentData;
  
  // Update session status
  const sessionStatusEl = document.getElementById('session-status');
  if (activeSession) {
    sessionStatusEl.textContent = 'Active';
    sessionStatusEl.className = 'metric-value text-green-400';
  } else {
    sessionStatusEl.textContent = 'Inactive';
    sessionStatusEl.className = 'metric-value text-red-400';
  }
  
  // Update service status from actual backend data
  const serviceStatusEl = document.getElementById('service-status');
  const serviceBtn = document.getElementById('service-toggle-btn');
  
  // Try to get service status from debug data or assume enabled
  const serviceEnabled = debug?.serviceEnabled !== false; // Default to enabled if not specified
  
  if (serviceStatusEl) {
    serviceStatusEl.textContent = serviceEnabled ? 'Enabled' : 'Disabled';
    serviceStatusEl.className = `metric-value ${serviceEnabled ? 'text-green-400' : 'text-yellow-400'}`;
  }
  
  // Update service button text and styling
  if (serviceBtn) {
    serviceBtn.textContent = serviceEnabled ? '⚙️ Disable Service' : '⚙️ Enable Service';
    serviceBtn.classList.remove('btn-service-enabled', 'btn-service-disabled');
    serviceBtn.classList.add(serviceEnabled ? 'btn-service-enabled' : 'btn-service-disabled');
  }
  
  // Enable all buttons
  enableAllButtons();
  
  // Update button states based on session status
  updateButtonStates(!!activeSession);
  
  // Update metrics
  if (activeSession) {
    document.getElementById('video-count').textContent = activeSession.videoCount || 0;
    document.getElementById('interaction-count').textContent = activeSession.interactions?.length || 0;
    
    if (activeSession.computedMetrics) {
      const metrics = activeSession.computedMetrics;
      
      // Attention span
      const attentionSpan = metrics.attentionSpan;
      document.getElementById('attention-span').textContent = 
        attentionSpan ? `${attentionSpan.toFixed(1)}s` : '-';
      
      // Dopamine spike index
      const dopamineIndex = metrics.dopamineSpikeIndex;
      document.getElementById('dopamine-index').textContent = 
        dopamineIndex ? dopamineIndex.toFixed(1) : '-';
      
      // Replay sensitivity
      const replayCount = activeSession.interactions?.filter(i => i.type === 'replay').length || 0;
      document.getElementById('replay-sensitivity').textContent = replayCount;
      
      // Session length
      const sessionLength = (Date.now() - activeSession.startTime) / (1000 * 60);
      document.getElementById('session-length').textContent = `${sessionLength.toFixed(1)}m`;
      
      // Circadian drift
      const circadianDrift = metrics.circadianDrift;
      document.getElementById('circadian-drift').textContent = 
        circadianDrift ? `${(circadianDrift * 100).toFixed(1)}%` : '-';
    } else {
      document.getElementById('attention-span').textContent = '-';
      document.getElementById('dopamine-index').textContent = '-';
      document.getElementById('replay-sensitivity').textContent = '-';
      document.getElementById('session-length').textContent = '-';
      document.getElementById('circadian-drift').textContent = '-';
    }
  } else {
    // Show data from most recent session
    const recentSession = allSessions[0];
    if (recentSession) {
      document.getElementById('video-count').textContent = recentSession.videoCount || 0;
      document.getElementById('interaction-count').textContent = recentSession.interactions?.length || 0;
      
      if (recentSession.computedMetrics) {
        const metrics = recentSession.computedMetrics;
        
        const attentionSpan = metrics.attentionSpan;
        document.getElementById('attention-span').textContent = 
          attentionSpan ? `${attentionSpan.toFixed(1)}s` : '-';
        
        const dopamineIndex = metrics.dopamineSpikeIndex;
        document.getElementById('dopamine-index').textContent = 
          dopamineIndex ? dopamineIndex.toFixed(1) : '-';
        
        const replayCount = recentSession.interactions?.filter(i => i.type === 'replay').length || 0;
        document.getElementById('replay-sensitivity').textContent = replayCount;
        
        const sessionLength = (recentSession.endTime - recentSession.startTime) / (1000 * 60);
        document.getElementById('session-length').textContent = `${sessionLength.toFixed(1)}m`;
        
        const circadianDrift = metrics.circadianDrift;
        document.getElementById('circadian-drift').textContent = 
          circadianDrift ? `${(circadianDrift * 100).toFixed(1)}%` : '-';
      } else {
        document.getElementById('attention-span').textContent = '-';
        document.getElementById('dopamine-index').textContent = '-';
        document.getElementById('replay-sensitivity').textContent = '-';
        document.getElementById('session-length').textContent = '-';
        document.getElementById('circadian-drift').textContent = '-';
      }
    } else {
      document.getElementById('video-count').textContent = '0';
      document.getElementById('interaction-count').textContent = '0';
      document.getElementById('attention-span').textContent = '-';
      document.getElementById('dopamine-index').textContent = '-';
      document.getElementById('replay-sensitivity').textContent = '-';
      document.getElementById('session-length').textContent = '-';
      document.getElementById('circadian-drift').textContent = '-';
    }
  }
  
  // Update debug information
  if (debug) {
    document.getElementById('debug-active-sessions').textContent = debug.activeSessionsCount || 0;
    document.getElementById('debug-stored-sessions').textContent = debug.storedSessionsCount || 0;
    document.getElementById('debug-last-update').textContent = new Date().toLocaleTimeString();
  }
}

// Update UI with error state
function updateUIError() {
  document.getElementById('session-status').textContent = 'Error';
  document.getElementById('session-status').className = 'metric-value text-red-400';
  
  // Update service status to show error
  const serviceStatusEl = document.getElementById('service-status');
  if (serviceStatusEl) {
    serviceStatusEl.textContent = 'Error';
    serviceStatusEl.className = 'metric-value text-red-400';
  }
  
  document.getElementById('debug-last-update').textContent = 
    `Error at: ${new Date().toLocaleTimeString()}`;
    
  // Still enable buttons so user can try to fix issues
  enableAllButtons();
  
  // Show error message
  const errorMsg = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  if (errorMsg && errorText) {
    errorText.textContent = 'Extension context lost. Try reloading the extension.';
    errorMsg.style.display = 'block';
  }
}

// Export data as CSV
async function exportData() {
  try {
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.textContent = 'Exporting...';
      exportBtn.disabled = true;
    }
    
    const response = await chrome.runtime.sendMessage({ 
      type: 'EXPORT_DATA', 
      format: 'csv' 
    });
    
    if (response && response.status === 'success') {
      // Create and download CSV file
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neuroscroll-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('Data exported successfully');
      
      // Show success feedback
      if (exportBtn) {
        exportBtn.textContent = 'Exported!';
        setTimeout(() => {
          exportBtn.textContent = 'Export';
        }, 2000);
      }
    } else {
      console.error('Export failed:', response?.error || 'Unknown error');
      if (exportBtn) {
        exportBtn.textContent = 'Export Failed';
        setTimeout(() => {
          exportBtn.textContent = 'Export';
        }, 2000);
      }
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.textContent = 'Export Failed';
      setTimeout(() => {
        exportBtn.textContent = 'Export';
      }, 2000);
    }
  } finally {
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.disabled = false;
    }
  }
}

// Clear all data
async function clearData() {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    try {
      const clearBtn = document.getElementById('clear-btn');
      if (clearBtn) {
        clearBtn.textContent = 'Clearing...';
        clearBtn.disabled = true;
      }
      
      const response = await chrome.runtime.sendMessage({ 
        type: 'CLEAR_DATA', 
        confirmed: true 
      });
      
      if (response && response.status === 'success') {
        console.log('Data cleared successfully');
        
        // Show success feedback
        if (clearBtn) {
          clearBtn.textContent = 'Cleared!';
          setTimeout(() => {
            clearBtn.textContent = 'Clear';
          }, 2000);
        }
        
        // Refresh UI after a short delay
        setTimeout(() => {
          refreshData();
        }, 500);
      } else {
        console.error('Clear failed:', response?.error || 'Unknown error');
        if (clearBtn) {
          clearBtn.textContent = 'Clear Failed';
          setTimeout(() => {
            clearBtn.textContent = 'Clear';
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      const clearBtn = document.getElementById('clear-btn');
      if (clearBtn) {
        clearBtn.textContent = 'Clear Failed';
        setTimeout(() => {
          clearBtn.textContent = 'Clear';
        }, 2000);
      }
    } finally {
      const clearBtn = document.getElementById('clear-btn');
      if (clearBtn) {
        clearBtn.disabled = false;
      }
    }
  }
}

// Start a new session manually
async function startSession() {
  try {
    const startBtn = document.getElementById('start-session-btn');
    if (startBtn) {
      startBtn.textContent = 'Starting...';
      startBtn.disabled = true;
    }
    
    // If we're in fullscreen mode, we need to get tabs from all windows
    let tabs;
    if (isFullscreen) {
      // Get all tabs from all windows
      tabs = await chrome.tabs.query({ url: '*://www.youtube.com/*' });
      // Find a YouTube Shorts tab
      const shortsTab = tabs.find(tab => 
        tab.url && (tab.url.includes('/shorts/') || tab.url.includes('youtube.com'))
      );
      if (shortsTab) {
        tabs = [shortsTab];
      }
    } else {
      // Normal popup mode - get current active tab
      tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    }
    
    const tab = tabs[0];
    if (!tab || !tab.url || !tab.url.includes('youtube.com')) {
      // Try to open YouTube in a new tab
      const youtubeTab = await chrome.tabs.create({ 
        url: 'https://www.youtube.com/shorts',
        active: true 
      });
      
      // Wait a moment for the tab to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use the new YouTube tab
      if (youtubeTab && youtubeTab.id) {
        const response = await chrome.runtime.sendMessage({ 
          type: 'FORCE_START_SESSION',
          tabId: youtubeTab.id,
          url: youtubeTab.url || 'https://www.youtube.com/shorts'
        });
        
        if (response?.status === 'success') {
          return response;
        }
      }
      
      throw new Error('Opened YouTube Shorts for you. Please try starting the session again.');
    }
    
    // Send message to background script to create a new session
    const response = await chrome.runtime.sendMessage({ 
      type: 'FORCE_START_SESSION',
      tabId: tab.id,
      url: tab.url
    });
    
    if (response && response.status === 'success') {
      // Show success feedback
      if (startBtn) {
        startBtn.textContent = '✅ Started!';
        setTimeout(() => {
          startBtn.textContent = '▶️ Start Session';
        }, 2000);
      }
      
      // Refresh data after a short delay
      setTimeout(() => {
        refreshData();
      }, 1000);
    } else {
      throw new Error(response?.error || 'Failed to start session');
    }
    
  } catch (error) {
    console.error('Error starting session:', error);
    const startBtn = document.getElementById('start-session-btn');
    if (startBtn) {
      startBtn.textContent = '❌ Failed';
      setTimeout(() => {
        startBtn.textContent = '▶️ Start Session';
      }, 3000);
    }
    
    // Show error in UI
    const errorMsg = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    if (errorMsg && errorText) {
      errorText.textContent = error.message;
      errorMsg.style.display = 'block';
      setTimeout(() => {
        errorMsg.style.display = 'none';
      }, 5000);
    }
  } finally {
    const startBtn = document.getElementById('start-session-btn');
    if (startBtn) {
      startBtn.disabled = false;
    }
  }
}

// Stop current session
async function stopSession() {
  try {
    const stopBtn = document.getElementById('stop-session-btn');
    if (stopBtn) {
      stopBtn.textContent = 'Stopping...';
      stopBtn.disabled = true;
    }
    
    const response = await chrome.runtime.sendMessage({ 
      type: 'STOP_SESSION'
    });
    
    if (response && response.status === 'success') {
      // Show success feedback
      if (stopBtn) {
        stopBtn.textContent = 'Stopped!';
        setTimeout(() => {
          stopBtn.textContent = '⏹️ Stop Session';
        }, 2000);
      }
      
      // Refresh data after a short delay
      setTimeout(() => {
        refreshData();
      }, 1000);
    } else {
      throw new Error(response?.error || 'Failed to stop session');
    }
    
  } catch (error) {
    console.error('Error stopping session:', error);
    const stopBtn = document.getElementById('stop-session-btn');
    if (stopBtn) {
      stopBtn.textContent = 'Stop Failed';
      setTimeout(() => {
        stopBtn.textContent = '⏹️ Stop Session';
      }, 2000);
    }
  } finally {
    const stopBtn = document.getElementById('stop-session-btn');
    if (stopBtn) {
      stopBtn.disabled = false;
    }
  }
}

// Toggle service on/off
async function toggleService() {
  try {
    const serviceBtn = document.getElementById('service-toggle-btn');
    if (serviceBtn) {
      serviceBtn.textContent = 'Toggling...';
      serviceBtn.disabled = true;
    }
    
    // Determine current state and target action
    const isCurrentlyEnabled = serviceBtn.textContent.includes('Disable');
    const messageType = isCurrentlyEnabled ? 'DISABLE_SERVICE' : 'ENABLE_SERVICE';
    
    // Send message to background script
    const response = await chrome.runtime.sendMessage({ 
      type: messageType 
    });
    
    if (response && response.status === 'success') {
      // Update UI based on new state
      const newState = !isCurrentlyEnabled;
      
      if (serviceBtn) {
        serviceBtn.textContent = newState ? '⚙️ Disable Service' : '⚙️ Enable Service';
        
        // Use CSS classes instead of inline styles
        serviceBtn.classList.remove('btn-service-enabled', 'btn-service-disabled');
        serviceBtn.classList.add(newState ? 'btn-service-enabled' : 'btn-service-disabled');
      }
      
      // Update service status
      const serviceStatus = document.getElementById('service-status');
      if (serviceStatus) {
        serviceStatus.textContent = newState ? 'Enabled' : 'Disabled';
        serviceStatus.className = `metric-value ${newState ? 'text-green-400' : 'text-yellow-400'}`;
      }
      
      // Show success feedback
      if (serviceBtn) {
        const originalText = serviceBtn.textContent;
        serviceBtn.textContent = newState ? '✅ Enabled!' : '⏹️ Disabled!';
        setTimeout(() => {
          serviceBtn.textContent = originalText;
        }, 2000);
      }
      
      // Refresh data to reflect changes
      setTimeout(() => {
        refreshData();
      }, 1000);
      
    } else {
      throw new Error(response?.error || 'Failed to toggle service');
    }
    
  } catch (error) {
    console.error('Error toggling service:', error);
    
    const serviceBtn = document.getElementById('service-toggle-btn');
    if (serviceBtn) {
      serviceBtn.textContent = '❌ Failed';
      setTimeout(() => {
        serviceBtn.textContent = serviceBtn.textContent.includes('Disable') ? '⚙️ Disable Service' : '⚙️ Enable Service';
      }, 3000);
    }
    
    // Show error in UI
    const errorMsg = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    if (errorMsg && errorText) {
      errorText.textContent = error.message;
      errorMsg.style.display = 'block';
      setTimeout(() => {
        errorMsg.style.display = 'none';
      }, 5000);
    }
  } finally {
    const serviceBtn = document.getElementById('service-toggle-btn');
    if (serviceBtn) {
      serviceBtn.disabled = false;
    }
  }
}

// Toggle fullscreen mode - opens extension in a new window
async function toggleFullscreen() {
  const btn = document.getElementById('fullscreen-btn');
  
  try {
    if (isFullscreen) {
      // This shouldn't happen in popup context, but handle it
      btn.textContent = '🔼 Expand';
      isFullscreen = false;
      return;
    }
    
    btn.textContent = 'Opening...';
    btn.disabled = true;
    
    // Create a new window with the extension popup
    const extensionUrl = chrome.runtime.getURL('popup/index.html?standalone=true');
    
    await chrome.windows.create({
      url: extensionUrl,
      type: 'popup',
      width: 800,
      height: 900,
      focused: true
    });
    
    // Close the current popup
    window.close();
    
  } catch (error) {
    console.error('Error opening fullscreen:', error);
    btn.textContent = 'Failed';
    setTimeout(() => {
      btn.textContent = '🔼 Expand';
      btn.disabled = false;
    }, 2000);
  }
}

// Enable all buttons
function enableAllButtons() {
  const buttons = [
    'refresh-btn', 'export-btn', 'clear-btn', 
    'start-session-btn', 'stop-session-btn', 
    'service-toggle-btn', 'fullscreen-btn'
  ];
  
  buttons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.disabled = false;
    }
  });
}

// Update button states based on session status
function updateButtonStates(sessionActive) {
  const startBtn = document.getElementById('start-session-btn');
  const stopBtn = document.getElementById('stop-session-btn');
  const serviceBtn = document.getElementById('service-toggle-btn');
  
  if (startBtn) {
    startBtn.disabled = sessionActive;
    startBtn.classList.toggle('btn-disabled', sessionActive);
  }
  
  if (stopBtn) {
    stopBtn.disabled = !sessionActive;
    stopBtn.classList.toggle('btn-disabled', !sessionActive);
  }
  
  // Initialize service button text and styling
  if (serviceBtn && serviceBtn.textContent === 'Enable Service') {
    serviceBtn.textContent = '⚙️ Disable Service';
    serviceBtn.classList.add('btn-service-enabled');
  }
}

// Handle background script messages
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === 'METRICS_UPDATE') {
    // Real-time metrics update from background
    refreshData();
  }
});