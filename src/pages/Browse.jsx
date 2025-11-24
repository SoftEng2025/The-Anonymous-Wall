import React, { useState, useEffect } from 'react'
import { useMessages } from '../contexts/MessageContext'
import { messageController } from '../backend/controllers/messageController'
import './Browse.css'

const MOOD_ICONS = {
    'happy': 'fa-regular fa-face-smile',
    'sad': 'fa-regular fa-face-frown',
    'in-love': 'fa-regular fa-face-grin-hearts',
    'angry': 'fa-regular fa-face-angry',
    'confused': 'fa-regular fa-face-flushed'
}

export default function Browse() {
    const { messages: contextMessages } = useMessages()
    const [searchTerm, setSearchTerm] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

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
                <button className="search-button">
                    <i className="fa-solid fa-magnifying-glass"></i> Search
                </button>
            </div>

            <div className="messages-grid">
                {filteredMessages.map((msg) => (
                    <article key={msg.id} className="card">
                        <header className="card-header">
                            <span className="card-to">to: {msg.recipient}</span>
                            <i className={`message-mood ${MOOD_ICONS[msg.mood] || 'fa-regular fa-face-smile'}`}></i>
                        </header>
                        <div className="card-body">
                            <p
                                className="card-message"
                                style={{ backgroundColor: `var(--${msg.theme})` }}
                            >
                                {msg.message}
                            </p>
                        </div>
                        <footer className="card-footer">
                            <div className="input-shell">
                                <input type="text" placeholder="Aa" className="reply-input-transparent" />
                            </div>
                            <button className="send-button">
                                <span className="send-icon">
                                    <i className="fa-solid fa-paper-plane"></i>
                                </span>
                            </button>
                        </footer>
                    </article>
                ))}
            </div>
        </div>
    )
}
