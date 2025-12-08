/**
 * Creates a Message object structure.
 * @param {Object} data - The raw data for the message.
 * @param {string} data.recipient - The name of the recipient.
 * @param {string} data.message - The message content.
 * @param {string} data.theme - The theme color.
 * @param {string} data.mood - The mood selection.
 * @param {string} [data.spotifyEmbedUrl] - Optional Spotify embed URL.
 * @returns {Object} A structured Message object.
 */
export const createMessageModel = (data) => {
    return {
        recipient: data.recipient,
        message: data.message,
        theme: data.theme,
        mood: data.mood,
        spotifyEmbedUrl: data.spotifyEmbedUrl || '',
        createdAt: new Date().toISOString(),
        timestamp: Date.now()
    };
};
