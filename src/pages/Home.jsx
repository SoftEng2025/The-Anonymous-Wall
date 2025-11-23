import HeroButton from '../components/HeroButton'
import MessageCard from '../components/MessageCard'
import Stats from '../components/Stats'
import './Home.css'
import { useTypedLyrics } from '../hooks/useTypedLyrics'
import {
    HERO_BUTTONS,
    CARD_MESSAGES,
    TYPING_CONFIG,
    LYRICS_TIMELINE
} from '../utils/constants'

export default function Home() {
    const typedText = useTypedLyrics(LYRICS_TIMELINE, TYPING_CONFIG)

    return (
        <main className="hero">
            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="typed-text" aria-live="polite" aria-atomic="true">
                        {typedText}
                    </span>
                    <span className="hero-cursor" aria-hidden="true"></span>
                </h1>
                <p className="hero-subtitle">A safe space to express what you can't say out loud.</p>
                <div className="hero-stats-wrapper">
                    <Stats />
                </div>
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
    )
}
