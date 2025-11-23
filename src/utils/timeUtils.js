/**
 * Formats a timestamp into a short relative time string.
 * @param {number} timestamp - The timestamp in milliseconds.
 * @returns {string} formatted time string (e.g., "1 sec ago", "1 min ago", "1 hr ago", "1 d ago").
 */
export const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';

    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
        return `${Math.max(1, seconds)} sec ago`;
    } else if (minutes < 60) {
        return `${minutes} min ago`;
    } else if (hours < 24) {
        return `${hours} hr ago`;
    } else {
        return `${days} d ago`;
    }
};
