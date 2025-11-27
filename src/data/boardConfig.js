/**
 * Board Configuration
 * Defines the available boards for forum posts
 */

export const BOARDS = [
    {
        id: 'academics',
        name: 'Academics',
        icon: 'fa-graduation-cap',
        color: '#a3e635', // Green
        description: 'Academic-related posts and questions',
        rules: [
            'Be respectful to others.',
            'No sharing of personal or identifying information.',
            'Keep content relevant to academics.'
        ]
    },
    {
        id: 'anime-manga',
        name: 'Anime & Manga',
        icon: 'fa-book',
        color: '#f59e0b', // Amber
        description: 'Discuss anime, manga, and related topics',
        rules: [
            'No piracy links or requests.',
            'Be courteous when discussing opinions.',
            'Use spoilers tags where appropriate.'
        ]
    },
    {
        id: 'career-work',
        name: 'Career & Work',
        icon: 'fa-briefcase',
        color: '#8b5cf6', // Purple
        description: 'Career advice and work-related discussions',
        rules: [
            'No solicitation or job postings without permission.',
            'Respect privacy when sharing workplace details.',
            'Keep discussions constructive and on-topic.'
        ]
    },
    {
        id: 'confessions',
        name: 'Confessions',
        icon: 'fa-heart',
        color: '#ec4899', // Pink
        description: 'Share your secrets and confessions anonymously',
        rules: [
            'Do not post identifying details about others.',
            'No requests for illegal activity.',
            'Be mindful—this is a public forum.'
        ]
    },
    {
        id: 'dreams-aspirations',
        name: 'Dreams & Aspirations',
        icon: 'fa-star',
        color: '#fbbf24', // Yellow
        description: 'Share your goals and aspirations',
        rules: [
            'Be supportive and encouraging.',
            'No harassment or belittling of others.',
            'Keep feedback constructive.'
        ]
    },
    {
        id: 'general',
        name: 'General',
        icon: 'fa-comments',
        color: '#60a5fa', // Blue
        description: 'General discussions and miscellaneous topics',
        rules: [
            'Keep it civil and respectful.',
            'No doxxing or sharing private information.',
            'Stay on topic where possible.'
        ]
    },
    {
        id: 'gaming',
        name: 'Gaming',
        icon: 'fa-gamepad',
        color: '#06b6d4', // Cyan
        description: 'Gaming discussions and recommendations',
        rules: [
            'No cheating or sharing hacks.',
            'Be respectful of differing opinions.',
            'Use spoiler tags for plot-heavy discussion.'
        ]
    },
    {
        id: 'love-relationships',
        name: 'Love & Relationships',
        icon: 'fa-handshake',
        color: '#f472b6', // Light Pink
        description: 'Relationship advice and discussions',
        rules: [
            'No explicit sexual content.',
            'Be empathetic and avoid victim-blaming.',
            'Respect boundaries and privacy.'
        ]
    },
    {
        id: 'mental-health',
        name: 'Mental Health',
        icon: 'fa-brain',
        color: '#10b981', // Emerald
        description: 'Mental health support and discussions',
        rules: [
            'This is not a substitute for professional help.',
            'Be compassionate and non-judgmental.',
            'Do not encourage self-harm or dangerous behavior.'
        ]
    },
    {
        id: 'need-advice',
        name: 'Need Advice',
        icon: 'fa-lightbulb',
        color: '#f97316', // Orange
        description: 'Ask for advice from the community',
        rules: [
            'Provide clear context for better answers.',
            'No medical/legal advice—seek professionals.',
            'Be respectful in feedback.'
        ]
    },
    {
        id: 'rants',
        name: 'Rants',
        icon: 'fa-fire',
        color: '#ff6b6b', // Red
        description: 'Rant about anything on your mind',
        rules: [
            'No targeted harassment or threats.',
            'Keep profanity in check if possible.',
            'Do not post personal info about others.'
        ]
    },
    {
        id: 'secrets',
        name: 'Secrets',
        icon: 'fa-mask',
        color: '#64748b', // Slate
        description: 'Share your secrets anonymously',
        rules: [
            'Do not post illegal content.',
            'Avoid identifying other people.',
            'Be mindful of sensitive topics.'
        ]
    },
    {
        id: 'social-issues',
        name: 'Social Issues',
        icon: 'fa-people-group',
        color: '#14b8a6', // Teal
        description: 'Discuss social and political issues',
        rules: [
            'Respect different viewpoints.',
            'No hate speech or violent threats.',
            'Support claims with sources where possible.'
        ]
    },
    {
        id: 'travel',
        name: 'Travel',
        icon: 'fa-plane',
        color: '#06b6d4', // Cyan
        description: 'Travel stories and recommendations',
        rules: [
            'No illegal travel advice or document sharing.',
            'Share honest, respectful recommendations.',
            'Protect privacy when posting photos.'
        ]
    },
    {
        id: 'what-if',
        name: 'What If?',
        icon: 'fa-question',
        color: '#d946ef', // Fuchsia
        description: 'Explore hypothetical scenarios',
        rules: [
            'Keep discussions hypothetical and respectful.',
            'No harmful or actionable instructions.',
            'Avoid extreme or graphic content.'
        ]
    }
];

const BOARD_MAP = BOARDS.reduce((acc, board) => {
    acc[board.id] = board;
    return acc;
}, {});

/**
 * Get board by ID
 * @param {string} boardId 
 * @returns {Object|null} Board object or null if not found
 */
export const getBoardById = (boardId) => {
    return BOARD_MAP[boardId] || null;
};

/**
 * Get board color by ID
 * @param {string} boardId 
 * @returns {string} Board color or default color
 */
export const getBoardColor = (boardId) => {
    const board = getBoardById(boardId);
    return board ? board.color : '#60a5fa';
};

/**
 * Get board name by ID
 * @param {string} boardId 
 * @returns {string} Board name or 'Unknown'
 */
export const getBoardName = (boardId) => {
    const board = getBoardById(boardId);
    return board ? board.name : 'Unknown';
};
