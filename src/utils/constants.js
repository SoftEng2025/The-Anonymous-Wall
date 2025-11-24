const toMs = (seconds) => Math.round(seconds * 1000)

export const HERO_BUTTONS = [
    { label: 'Freedom Wall', variant: 'outlined', iconClass: 'fa-regular fa-comment-dots', path: '/freedom-wall' },
    { label: 'Message', variant: 'filled', iconClass: 'fa-solid fa-paper-plane', path: '/submit' },
]

export const CARD_MESSAGES = [
    { to: 'Everyone', tone: 'mint', lines: ['Speak freely.', 'Stay anonymous.'] },
    { to: 'You', tone: 'peach', lines: ['You are stronger', 'than you think.', "Don't give up!"] },
    {
        to: 'Future Me',
        tone: 'coral',
        lines: ["I hope you're proud", 'of who you become.', 'Keep going!'],
    },
    {
        to: 'My Ex',
        tone: 'mint',
        lines: ['I forgive you.', 'Not for you,', 'but for me.'],
    },
    {
        to: 'Mom',
        tone: 'peach',
        lines: ['I miss your cooking.', 'And your hugs.', 'Love you.'],
    },
    {
        to: 'Stranger',
        tone: 'coral',
        lines: ['Your smile made', 'my day better.', 'Thank you.'],
    },
]

export const NAV_LINKS = ['Freedom Wall', 'Forum', 'Submit']

export const TYPING_CONFIG = { baseTypeSpeed: 60, minimumHold: 300 }

export const LYRICS_TIMELINE = [
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
]
