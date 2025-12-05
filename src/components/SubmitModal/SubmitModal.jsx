import React, { useState, useRef } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { useMessages } from '../../contexts/MessageContext'
import { messageController } from '../../backend/controllers/messageController'
import './styles/layout.css'
import './styles/form.css'
import './styles/selectors.css'

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

const MAX_MESSAGE_LENGTH = 95

export default function SubmitModal({ isOpen, onClose }) {

    const [recipient, setRecipient] = useState('')
    const [message, setMessage] = useState('')
    const [selectedTheme, setSelectedTheme] = useState(THEMES[2]) // Default to mint
    const [selectedMood, setSelectedMood] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [captchaToken, setCaptchaToken] = useState(null)
    const recaptchaRef = useRef(null)

    const { addMessage } = useMessages()

    if (!isOpen) return null

    const handleRecipientChange = (e) => {
        setRecipient(e.target.value)
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value)
    }

    const remainingChars = MAX_MESSAGE_LENGTH - message.length
    const isOverLimit = message.length > MAX_MESSAGE_LENGTH
    const isRecipientMissing = recipient.trim().length === 0

    const handleSubmit = async () => {
        if (isRecipientMissing || !message || !selectedMood) {
            setSubmitError('Please add a recipient, write a message, and select a mood')
            return
        }

        if (message.length > MAX_MESSAGE_LENGTH) {
            setSubmitError(`Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`)
            return
        }

        if (!captchaToken) {
            setSubmitError("Please complete the captcha verification.")
            return
        }

        setSubmitError('')
        setIsSubmitting(true)

        try {
            const trimmedRecipient = recipient.trim()

            const messageData = {
                recipient: trimmedRecipient || 'Anonymous',
                message,
                theme: selectedTheme.id,
                mood: selectedMood
            }

            // Save to Firebase
            await messageController.createMessage(messageData)

            // Also add to local context for immediate UI update
            addMessage(messageData)

            // Close modal and reset form
            onClose()

            setRecipient('')
            setMessage('')
            setSelectedTheme(THEMES[2])
            setSelectedMood(null)
            setCaptchaToken(null)
        } catch (error) {
            console.error("Failed to submit message:", error)
            setSubmitError("Failed to send message. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="submit-modal-card" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="submit-header">
                    <h2 className="submit-title">Send a Message to Someone</h2>
                </div>

                <div className="submit-body">
                    {submitError && (
                        <div className="submit-error-message">
                            <span>{submitError}</span>
                        </div>
                    )}

                    <div className="recipient-input">
                        <label className="selector-label">Recipient</label>
                        <input
                            type="text"
                            className="submit-input"
                            placeholder="Who is this message for?"
                            value={recipient}
                            maxLength={40}
                            onChange={handleRecipientChange}
                        />
                    </div>

                    <div className="message-input-wrapper">
                        <textarea
                            className="submit-textarea"
                            placeholder="Write your message here"
                            value={message}
                            onChange={handleMessageChange}
                            style={{ backgroundColor: selectedTheme.color }}
                        />
                        <div className={`char-counter ${remainingChars < 20 ? 'warning' : ''} ${isOverLimit ? 'error' : ''}`}>
                            {remainingChars} / {MAX_MESSAGE_LENGTH}
                        </div>
                    </div>

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

                    <div className="captcha-container" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                            onChange={(token) => setCaptchaToken(token)}
                            theme="dark"
                        />
                    </div>

                    <button
                        className="submit-send-button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isOverLimit || isRecipientMissing}
                    >
                        {isSubmitting ? 'Sending...' : 'Send'} <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}
