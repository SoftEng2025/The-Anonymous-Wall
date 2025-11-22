import React, { useState } from 'react'
import { useMessages } from '../contexts/MessageContext'
import './Browse.css'

const MOOD_ICONS = {
    'happy': 'fa-regular fa-face-smile',
    'sad': 'fa-regular fa-face-frown',
    'in-love': 'fa-regular fa-face-grin-hearts',
    'angry': 'fa-regular fa-face-angry',
    'confused': 'fa-regular fa-face-flushed'
}

export default function Browse() {
    const { messages } = useMessages()
    const [searchTerm, setSearchTerm] = useState('')

    const filteredMessages = messages.filter(msg =>
        msg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="browse-container">
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Enter recipient name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button">
                    <i className="fa-solid fa-magnifying-glass"></i> Search
                </button>
            </div>

            <div className="messages-grid">
                {filteredMessages.map((msg) => (
                    <div key={msg.id} className="message-card">
                        <div className="message-header">
                            <span className="message-to">to: {msg.recipient}</span>
                            <i className={`message-mood ${MOOD_ICONS[msg.mood] || 'fa-regular fa-face-smile'}`}></i>
                        </div>
                        <div className="message-content-wrapper">
                            <div
                                className="message-bubble"
                                style={{ backgroundColor: `var(--${msg.theme})` }}
                            >
                                {msg.message}
                            </div>
                        </div>
                        <div className="message-footer">
                            <div className="reply-input-container">
                                <input type="text" placeholder="Aa" className="reply-input" />
                                <i className="fa-regular fa-face-smile reply-emoji"></i>
                            </div>
                            <button className="reply-send-button">
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
