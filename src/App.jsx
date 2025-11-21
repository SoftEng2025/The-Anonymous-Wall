import './App.css'
import { useAuth } from './contexts/AuthContext'
import HeroButton from './components/HeroButton'
import MessageCard from './components/MessageCard'
import { useTypedLyrics } from './hooks/useTypedLyrics'
import { getAvatarUrl } from './api/avatar'
import {
    HERO_BUTTONS,
    CARD_MESSAGES,
    NAV_LINKS,
    TYPING_CONFIG,
    LYRICS_TIMELINE
} from './utils/constants'

function App() {
    const { currentUser, login, logout } = useAuth()
    const typedText = useTypedLyrics(LYRICS_TIMELINE, TYPING_CONFIG)

    return (
        <div className="page">
            <header className="site-header">
                <div className="logo">
                    <span className="logo-primary">Anony</span>
                    <span className="logo-accent">Wall</span>
                </div>
                <nav className="nav-links" aria-label="Primary navigation">
                    {NAV_LINKS.map((label) => {
                        const slug = label.toLowerCase().replace(/\s+/g, '-')
                        return (
                            <a key={label} className="nav-link" href={`#${slug}`}>
                                {label}
                            </a>
                        )
                    })}
                </nav>
                <div className="auth-container">
                    {currentUser ? (
                        <div className="user-menu">
                            <img
                                src={getAvatarUrl(currentUser.uid)}
                                alt={currentUser.displayName || 'User'}
                                className="user-avatar"
                            />
                            <button className="login-button" onClick={() => logout()}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button className="login-button" onClick={() => login()}>
                            Login
                        </button>
                    )}
                </div>
            </header>

            <main className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="typed-text" aria-live="polite" aria-atomic="true">
                            {typedText}
                        </span>
                        <span className="hero-cursor" aria-hidden="true"></span>
                    </h1>
                    <p className="hero-subtitle">A safe space to express what you can't say out loud.</p>
                    <div className="hero-actions">
                        {HERO_BUTTONS.map((button) => (
                            <HeroButton key={button.label} {...button} />
                        ))}
                    </div>
                </div>

                <section className="cards" aria-label="Anonymous notes">
                    {CARD_MESSAGES.map((card) => (
                        <MessageCard key={card.to} {...card} />
                    ))}
                </section>
            </main>
        </div>
    )
}

export default App
