'use client'

import { useState, useEffect } from 'react'
import { useChromeStorage } from '../../hooks/useChromeStorage'
import NavBar from '../components/NavBar'

export default function SettingsPage() {
    const { clearData, exportData } = useChromeStorage()
    const [serviceEnabled, setServiceEnabled] = useState(true)
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [confirmClear, setConfirmClear] = useState(false)

    useEffect(() => {
        // Load initial settings
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['settings'], (result) => {
                if (result.settings) {
                    setServiceEnabled(result.settings.serviceEnabled !== false)
                    setNotificationsEnabled(result.settings.notificationsEnabled !== false)
                }
            })
        }
    }, [])

    const toggleService = () => {
        const newState = !serviceEnabled
        setServiceEnabled(newState)

        if (typeof chrome !== 'undefined' && chrome.runtime?.id) {
            chrome.runtime.sendMessage({
                type: newState ? 'ENABLE_SERVICE' : 'DISABLE_SERVICE'
            })
        }
    }

    const handleClearData = () => {
        if (confirmClear) {
            clearData()
            setConfirmClear(false)
        } else {
            setConfirmClear(true)
            setTimeout(() => setConfirmClear(false), 3000)
        }
    }

    return (
        <div className="popup-container pb-20">
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold mb-1 mt-3">Settings</h1>
                <p className="text-xs opacity-90">
                    Configure NeuroScroll
                </p>
            </div>

            <div className="space-y-4 px-2">
                {/* General Settings */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                    <h2 className="text-sm font-semibold mb-3 opacity-90 uppercase tracking-wider">General</h2>

                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <div className="font-medium">Tracking Service</div>
                            <div className="text-xs opacity-60">Enable/disable background analysis</div>
                        </div>
                        <button
                            onClick={toggleService}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${serviceEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${serviceEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <div className="font-medium">Notifications</div>
                            <div className="text-xs opacity-60">Get alerts for high fatigue</div>
                        </div>
                        <button
                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                {/* Data Management */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                    <h2 className="text-sm font-semibold mb-3 opacity-90 uppercase tracking-wider">Data Management</h2>

                    <button
                        onClick={exportData}
                        className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg mb-3 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>📊</span> Export Data (CSV)
                    </button>

                    <button
                        onClick={handleClearData}
                        className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${confirmClear
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-200'
                            }`}
                    >
                        <span>🗑️</span> {confirmClear ? 'Click to Confirm' : 'Clear All Data'}
                    </button>
                </div>

                {/* About */}
                <div className="text-center mt-8 opacity-50 text-xs">
                    <p>NeuroScroll v1.0.0</p>
                    <p>Privacy-first YouTube Shorts Analyzer</p>
                </div>
            </div>

            <NavBar />
        </div>
    )
}
