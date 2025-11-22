import React, { useState } from 'react'
import { useMessages } from '../contexts/MessageContext'
import { useNavigate } from 'react-router-dom'
import { messageController } from '../backend/controllers/messageController'
import './Submit.css'

const THEMES = [
    { id: 'coral', color: 'var(--coral)' },
    { id: 'peach', color: 'var(--peach)' },
    { id: 'mint', color: 'var(--mint)' },
    { id: 'sage', color: 'var(--sage)' },
    { id: 'lime', color: 'var(--lime)' },
    { id: 'lavender', color: 'var(--lavender)' },
]

const MOODS = [
    { id: 'happy', label: 'Happy', icon: 'fa-regular fa-face-smile' },
    { id: 'sad', label: 'Sad', icon: 'fa-regular fa-face-frown' },
    { id: 'in-love', label: 'In love', icon: 'fa-regular fa-face-grin-hearts' },
    { id: 'angry', label: 'Angry', icon: 'fa-regular fa-face-angry' },
    { id: 'confused', label: 'Confused', icon: 'fa-regular fa-face-flushed' },
]

export default function Submit() {
    const [recipient, setRecipient] = useState('')
    const [message, setMessage] = useState('')
    const [selectedTheme, setSelectedTheme] = useState(THEMES[2]) // Default to mint
    const [selectedMood, setSelectedMood] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { addMessage } = useMessages()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (!recipient || !message || !selectedMood) {
            alert('Please fill in all fields and select a mood')
            return
        }

        setIsSubmitting(true)

        try {
            const messageData = {
                recipient,
                message,
                theme: selectedTheme.id,
                mood: selectedMood
            }

            // Save to Firebase
            await messageController.createMessage(messageData)

            // Also add to local context for immediate UI update
            addMessage(messageData)

            // Navigate to freedom wall page
            navigate('/freedom-wall')
        } catch (error) {
            console.error("Failed to submit message:", error)
            alert("Failed to send message. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="submit-container">
            <div className="submit-card">
                <div className="submit-header">
                    <h2 className="submit-title">Send a Message to Someone</h2>
                </div>

                <div className="submit-body">
                    <input
                        type="text"
                        className="submit-input"
                        placeholder="Enter recipient's name"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />

                    <textarea
                        className="submit-textarea"
                        placeholder="Write your message here"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ backgroundColor: selectedTheme.color }}
                    />

                    <div className="theme-selector">
                        <label className="selector-label">Theme</label>
                        <div className="theme-options">
                            {THEMES.map((theme) => (
                                <button
                                    key={theme.id}
                                    className={`theme-option ${selectedTheme.id === theme.id ? 'selected' : ''}`}
                                    style={{ backgroundColor: theme.color }}
                                    onClick={() => setSelectedTheme(theme)}
                                    aria-label={`Select ${theme.id} theme`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mood-selector">
                        <label className="selector-label">Mood</label>
                        <div className="mood-options">
                            {MOODS.map((mood) => (
                                <button
                                    key={mood.id}
                                    className={`mood-option ${mood.id} ${selectedMood === mood.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedMood(mood.id)}
                                >
                                    <i className={`mood-icon ${mood.icon}`} />
                                    <span className="mood-label">{mood.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        className="submit-send-button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send'} <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}
