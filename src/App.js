import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

const HERO_BUTTONS = [
  { label: 'Browse', variant: 'outlined', iconClass: 'fa-regular fa-comment-dots' },
  { label: 'Message', variant: 'filled', iconClass: 'fa-solid fa-paper-plane' },
];

const CARD_MESSAGES = [
  { to: 'Everyone', tone: 'mint', lines: ['Speak freely.', 'Stay anonymous.'] },
  { to: 'You', tone: 'peach', lines: ['You are stronger', 'than you think.', "Don't give up!"] },
  {
    to: 'Future Me',
    tone: 'coral',
    lines: ["I hope you're proud", 'of who you become.', 'Keep going!'],
  },
];

const NAV_LINKS = ['Browse', 'Forum', 'Submit', 'About'];

const TYPING_CONFIG = { baseTypeSpeed: 60, minimumHold: 300 };

const toMs = (seconds) => Math.round(seconds * 1000);

const LYRICS_TIMELINE = [
  { text: "Maybe I'd change", durationMs: toMs(4.3) },
  { text: 'For you someday', durationMs: toMs(3.6) },
  { text: "But I can't help", durationMs: toMs(1.6) },
  { text: 'The way I feel', durationMs: toMs(3.7) },
  { text: 'Wish I was good', durationMs: toMs(3.7) },
  { text: 'Wish that I could', durationMs: toMs(3.4) },
  { text: 'Give you my love now', durationMs: toMs(2.9) },
  { text: 'But I need to', durationMs: toMs(4.2) },
  { text: 'Tell you', durationMs: toMs(2.5) },
  { text: 'Something', durationMs: toMs(2.5) },
  { text: "My heart just can't", durationMs: toMs(3.1) },
  { text: 'Be faithful', durationMs: toMs(4.3) },
  { text: 'For long', durationMs: toMs(2.5) },
  { text: 'I swear', durationMs: toMs(3.5) },
  { text: "I'll only make you cry", durationMs: toMs(5) },
];

const prepareTimeline = (timeline, config = {}) => {
  const { baseTypeSpeed = 60, minimumHold = 300 } = config;

  return timeline.map((lyric) => {
    const charCount = Math.max(lyric.text.length, 1);
    const totalDuration = lyric.durationMs ?? 3000;
    const baseDelay = lyric.typeSpeed ?? baseTypeSpeed;
    const minDisplay = lyric.minimumHold ?? minimumHold;
    const availableForTyping = Math.max(0, totalDuration - minDisplay);

    let typeDelay = baseDelay;
    if (availableForTyping > 0 && charCount * baseDelay > availableForTyping) {
      typeDelay = Math.max(20, availableForTyping / charCount);
    }

    const typedDuration = charCount * typeDelay;
    const holdDelay = Math.max(minDisplay, totalDuration - typedDuration);

    return {
      ...lyric,
      typeDelay,
      holdDelay,
      typedDuration,
      fullDuration: typedDuration + holdDelay,
    };
  });
};

const useTypedLyrics = (timeline, config) => {
  const preparedTimeline = useMemo(() => prepareTimeline(timeline, config), [timeline, config]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!preparedTimeline.length) {
      setText('');
      return undefined;
    }

    setText('');
    let lyricIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId;

    const schedule = (delay) => {
      timeoutId = window.setTimeout(step, Math.max(20, delay));
    };

    const step = () => {
      const lyric = preparedTimeline[lyricIndex];
      if (!lyric) {
        return;
      }

      if (deleting) {
        setText('');
        charIndex = 0;
        deleting = false;
        lyricIndex = (lyricIndex + 1) % preparedTimeline.length;
        schedule(320);
        return;
      }

      charIndex = Math.min(lyric.text.length, charIndex + 1);
      setText(lyric.text.slice(0, charIndex));

      if (charIndex === lyric.text.length) {
        deleting = true;
        schedule(lyric.holdDelay);
        return;
      }

      schedule(lyric.typeDelay);
    };

    schedule(650);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [preparedTimeline]);

  return text;
};

const HeroButton = ({ label, variant, iconClass }) => {
  const [isPressed, setIsPressed] = useState(false);

  const className = ['hero-button', variant, isPressed ? 'pressed' : '']
    .filter(Boolean)
    .join(' ');

  const handlePressStart = () => setIsPressed(true);
  const handlePressEnd = () => setIsPressed(false);

  return (
    <button
      type="button"
      className={className}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
      aria-label={label}
    >
      <span className="icon" aria-hidden="true">
        <i className={iconClass}></i>
      </span>
      {label}
    </button>
  );
};

const MessageCard = ({ to, tone, lines }) => {
  const [isSent, setIsSent] = useState(false);
  const timerRef = useRef();

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleSend = () => {
    window.clearTimeout(timerRef.current);
    setIsSent(true);
    timerRef.current = window.setTimeout(() => setIsSent(false), 400);
  };

  const className = ['card-message', tone].filter(Boolean).join(' ');

  return (
    <article className="card">
      <header className="card-header">
        <span className="card-to">to: {to}</span>
      </header>
      <div className="card-body">
        <p className={className}>
          {lines.map((line, index) => (
            <span key={`${to}-${index}`}>
              {line}
              {index < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
      <footer className="card-footer">
        <div className="input-shell">
          <span className="input-placeholder">Aa</span>
        </div>
        <button
          type="button"
          className={`send-button${isSent ? ' sent' : ''}`}
          aria-label="Send message"
          onClick={handleSend}
        >
          <ion-icon name="send" aria-hidden="true"></ion-icon>
        </button>
      </footer>
    </article>
  );
};

function App() {
  const typedText = useTypedLyrics(LYRICS_TIMELINE, TYPING_CONFIG);

  return (
    <div className="page">
      <header className="site-header">
        <div className="logo">
          <span className="logo-primary">Anony</span>
          <span className="logo-accent">Wall</span>
        </div>
        <nav className="nav-links" aria-label="Primary navigation">
          {NAV_LINKS.map((label) => {
            const slug = label.toLowerCase().replace(/\s+/g, '-');
            return (
              <a key={label} className="nav-link" href={`#${slug}`}>
                {label}
              </a>
            );
          })}
        </nav>
        <a className="login-button" href="#login">
          Login
        </a>
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
  );
}

export default App;
