const ADJECTIVES = [
    'Happy', 'Brave', 'Calm', 'Eager', 'Fancy', 'Gentle', 'Jolly', 'Kind', 'Lively', 'Nice',
    'Proud', 'Silly', 'Thankful', 'Witty', 'Zealous', 'Ancient', 'Blue', 'Crimson', 'Daring', 'Electric'
];

const NOUNS = [
    'Eagle', 'Tiger', 'Panda', 'Wolf', 'Bear', 'Lion', 'Hawk', 'Fox', 'Otter', 'Dolphin',
    'Falcon', 'Badger', 'Owl', 'Raven', 'Swan', 'Dragon', 'Phoenix', 'Titan', 'Ranger', 'Knight'
];

/**
 * Generates a random username (e.g., "BlueTiger392").
 * @returns {string} The generated username.
 */
export const generateRandomName = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 900) + 100; // 100-999
    return `${adj}${noun}${num}`;
};
