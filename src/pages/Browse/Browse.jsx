import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useMessages } from '../../contexts/MessageContext'
import { useAuth } from '../../contexts/AuthContext'
import { messageController } from '../../backend/controllers/messageController'
import { reportController } from '../../backend/controllers/reportController'
import { getSpotifyEmbedUrl } from '../../utils/spotify'
import ReportModal from '../../components/ReportModal'
import ReportSuccessModal from '../../components/ReportSuccessModal/ReportSuccessModal'
import LoginModal from '../../components/LoginModal'
import SubmitModal from '../../components/SubmitModal/SubmitModal'
import SpotifyPreview from '../../components/SpotifyPreview'
import './Browse.css'

const MOOD_ICONS = {
    'happy': 'fa-regular fa-face-smile',
    'sad': 'fa-regular fa-face-frown',
    'in-love': 'fa-regular fa-face-grin-hearts',
    'angry': 'fa-regular fa-face-angry',
    'confused': 'fa-regular fa-face-flushed'
}

const MOOD_COLORS = {
    'happy': '#ffd700',
    'sad': '#4fc3f7',
    'in-love': '#f187c8',
    'angry': '#ff5252',
    'confused': '#e040fb'
}

export default function Browse() {
    const { messages: contextMessages } = useMessages()
    const { currentUser } = useAuth()
    const location = useLocation()
    const [searchTerm, setSearchTerm] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [isReportSuccessModalOpen, setIsReportSuccessModalOpen] = useState(false)
    const [postToReport, setPostToReport] = useState(null)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)

    useEffect(() => {
        if (location.state?.openSubmitModal) {
            setIsSubmitModalOpen(true)
            // Clear the state so it doesn't reopen on refresh/navigation back
            window.history.replaceState({}, document.title)
        }
    }, [location])

    // Fetch messages from Firebase
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true)
                const fetchedMessages = await messageController.getAllMessages()
                // Use Firebase messages if available, otherwise use context messages
                if (fetchedMessages.length > 0) {
                    setMessages(fetchedMessages)
                } else {
                    setMessages(contextMessages)
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error)
                // Fallback to context messages on error
                setMessages(contextMessages)
            } finally {
                setLoading(false)
            }
        }

        fetchMessages()
    }, [contextMessages])

    const filteredMessages = messages.filter(msg =>
        msg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleReportClick = (msg) => {
        if (!currentUser) {
            setIsLoginModalOpen(true)
            return
        }
        setPostToReport(msg)
        setIsReportModalOpen(true)
    }

    const handleReportSubmit = async (reason) => {
        if (postToReport && currentUser) {
            try {
                await reportController.createReport(postToReport.id, reason, currentUser.uid, 'message')
                setIsReportSuccessModalOpen(true)
            } catch (error) {
                console.error("Failed to submit report:", error)
                alert("Failed to submit report. Please try again.")
            }
            setIsReportModalOpen(false)
            setPostToReport(null)
        }
    }

    const handleCreatePostClick = () => {
        setIsSubmitModalOpen(true)
    }

    return (
        <div className="browse-container">
            <div className="search-container">
                <div className="search-input-wrapper">
                    <i className="fa-regular fa-user search-icon"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Enter recipient name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="create-post-button" onClick={handleCreatePostClick}>
                    <i className="fa-solid fa-plus"></i> Create Post
                </button>
            </div>

            <div className="messages-grid">
                {filteredMessages.map((msg) => {
                    const embedUrl = msg.spotifyEmbedUrl || getSpotifyEmbedUrl(msg.spotifyUrl || msg.spotifyLink || '')
                    return (
                        <article key={msg.id} className="card">
                            <header className="card-header">
                                <div className="header-content">
                                    <span className="card-to">to: {msg.recipient}</span>
                                    <span className="card-date">
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true
                                        }) : ''}
                                    </span>
                                </div>
                                <div className="header-actions">
                                    <i
                                        className={`message-mood ${MOOD_ICONS[msg.mood] || 'fa-regular fa-face-smile'}`}
                                        style={{ color: MOOD_COLORS[msg.mood] || '#fff' }}
                                    ></i>
                                    <button
                                        className="report-icon-btn"
                                        onClick={(e) => { e.stopPropagation(); handleReportClick(msg); }}
                                        title="Report"
                                    >
                                        <i className="fa-regular fa-flag"></i>
                                    </button>
                                </div>
                            </header>
                            <div className="card-body">
                                <p
                                    className="card-message"
                                    style={{ backgroundColor: `var(--${msg.theme})` }}
                                >
                                    {msg.message}
                                </p>
                            </div>
                            <footer className={`card-footer ${embedUrl ? 'has-spotify' : ''}`}>
                                {embedUrl ? (
                                    <SpotifyPreview embedUrl={embedUrl} />
                                ) : (
                                    <>
                                        <div className="input-shell">
                                            <input
                                                type="text"
                                                placeholder="Aa"
                                                className="reply-input-transparent"
                                                disabled
                                                aria-disabled="true"
                                            />
                                        </div>
                                        <button className="send-button" disabled aria-disabled="true" tabIndex="-1">
                                            <span className="send-icon">
                                                <i className="fa-solid fa-paper-plane"></i>
                                            </span>
                                        </button>
                                    </>
                                )}
                            </footer>
                        </article>
                    )
                })}
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onSubmit={handleReportSubmit}
            />

            <ReportSuccessModal
                isOpen={isReportSuccessModalOpen}
                onClose={() => setIsReportSuccessModalOpen(false)}
            />

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />

            <SubmitModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
            />
        </div >
    )
}
