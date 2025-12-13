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

/**
 * Formats the remaining time until a timestamp.
 * @param {number} expiresAt - The expiration timestamp in milliseconds.
 * @returns {string} formatted time string (e.g., "1h 30m left").
 */
export const formatTimeLeft = (expiresAt) => {
    if (!expiresAt) return null;
    const now = Date.now();
    const diff = expiresAt - now;

    if (diff <= 0) return "Expired";

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d left`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m left`;
    } else {
        return `${minutes}m left`;
    }
};
