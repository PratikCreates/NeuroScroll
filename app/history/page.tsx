'use client'

import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'

export default function HistoryPage() {
    const [sessions, setSessions] = useState<any[]>([])
    const [loadingSessions, setLoadingSessions] = useState(true)

    useEffect(() => {
        const fetchSessions = async () => {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
                try {
                    const response = await chrome.runtime.sendMessage({
                        type: 'GET_SESSIONS',
                        limit: 10
                    })

                    if (response && response.status === 'success') {
                        setSessions(response.sessions || [])
                    }
                } catch (err) {
                    console.error('Failed to fetch sessions:', err)
                } finally {
                    setLoadingSessions(false)
                }
            } else {
                // Mock data for development
                setSessions([
                    {
                        id: 'session_1',
                        startTime: Date.now() - 86400000,
                        endTime: Date.now() - 82800000,
                        videoCount: 45,
                        computedMetrics: {
                            attentionSpan: 12.5,
                            dopamineSpikeIndex: 7.2,
                            sessionLength: 3600
                        }
                    },
                    {
                        id: 'session_2',
                        startTime: Date.now() - 172800000,
                        endTime: Date.now() - 171000000,
                        videoCount: 22,
                        computedMetrics: {
                            attentionSpan: 15.8,
                            dopamineSpikeIndex: 4.5,
                            sessionLength: 1800
                        }
                    }
                ])
                setLoadingSessions(false)
            }
        }

        fetchSessions()
    }, [])

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        return `${mins}m`
    }

    return (
        <div className="popup-container pb-20">
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold mb-1 mt-3">Session History</h1>
                <p className="text-xs opacity-90">
                    Your recent viewing patterns
                </p>
            </div>

            {loadingSessions ? (
                <div className="text-center p-4 opacity-70">Loading history...</div>
            ) : sessions.length === 0 ? (
                <div className="text-center p-8 opacity-60 bg-white/5 rounded-lg mx-4">
                    <div className="text-2xl mb-2">📝</div>
                    <div>No sessions recorded yet</div>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session) => (
                        <div key={session.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mx-2 border border-white/5">
                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
                                <div className="text-xs font-medium opacity-80">
                                    {formatDate(session.startTime)}
                                </div>
                                <div className="text-xs bg-white/10 px-2 py-1 rounded">
                                    {formatDuration(session.computedMetrics?.sessionLength || 0)}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center">
                                    <div className="text-[10px] opacity-60 mb-1">Videos</div>
                                    <div className="font-semibold">{session.videoCount || 0}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] opacity-60 mb-1">Attention</div>
                                    <div className="font-semibold">{(session.computedMetrics?.attentionSpan || 0).toFixed(1)}s</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] opacity-60 mb-1">Dopamine</div>
                                    <div className={`font-semibold ${(session.computedMetrics?.dopamineSpikeIndex || 0) > 8 ? 'text-red-300' : 'text-green-300'
                                        }`}>
                                        {(session.computedMetrics?.dopamineSpikeIndex || 0).toFixed(1)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <NavBar />
        </div>
    )
}
