import { useEffect, useRef, useState } from 'react'
import './MessageCard.css'

const MessageCard = ({ to, tone, lines }) => {
    const [isSent, setIsSent] = useState(false)
    const timerRef = useRef(null)

    useEffect(() => {
        return () => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current)
            }
        }
    }, [])

    const handleSend = () => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current)
        }
        setIsSent(true)
        timerRef.current = window.setTimeout(() => setIsSent(false), 400)
    }

    const className = ['home-message-card-text', tone].filter(Boolean).join(' ')

    return (
        <article className="home-message-card">
            <header className="home-message-card-header">
                <span className="card-to">to: {to}</span>
            </header>
            <div className="home-message-card-body">
                <p className={className}>
                    {lines.map((line, index) => (
                        <span key={`${to}-${index}`}>
                            {line}
                            {index < lines.length - 1 && <br />}
                        </span>
                    ))}
                </p>
            </div>
            <footer className="home-message-card-footer">
                <div className="input-shell">
                    <span className="input-placeholder">Aa</span>
                </div>
                <button
                    type="button"
                    className={`send-button${isSent ? ' sent' : ''}`}
                    aria-label="Send message"
                    onClick={handleSend}
                >
                    <span className="send-icon" aria-hidden="true">
                        <i className="fa-solid fa-paper-plane"></i>
                    </span>
                </button>
            </footer>
        </article>
    )
}

export default MessageCard
