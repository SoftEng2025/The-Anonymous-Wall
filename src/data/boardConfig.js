/**
 * Board Configuration
 * Defines the available boards for forum posts
 */

export const BOARDS = [
    {
        id: 'general',
        name: 'General',
        icon: 'fa-comments',
        color: '#60a5fa', // Blue
        description: 'General discussions and miscellaneous topics'
    },
    {
        id: 'academics',
        name: 'Academics',
        icon: 'fa-graduation-cap',
        color: '#a3e635', // Green
        description: 'Academic-related posts and questions'
    },
    {
        id: 'events',
        name: 'Events',
        icon: 'fa-calendar-days',
        color: '#f472b6', // Pink
        description: 'Event announcements and discussions'
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
