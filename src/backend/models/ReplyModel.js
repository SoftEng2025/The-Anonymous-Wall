/**
 * Creates a Reply object structure.
 * @param {Object} data - The raw data for the reply.
 * @param {string} data.author - The username of the author.
 * @param {string} data.uid - The user ID of the author.
 * @param {string} data.content - The content of the reply.
 * @returns {Object} A structured Reply object.
 */
export const createReplyModel = (data) => {
    return {
        author: data.author || 'Anonymous',
        uid: data.uid,
        avatarSeed: data.uid,
        content: data.content,
        likes: 0,
        likedBy: [],
        replyTo: data.replyTo || null,
        createdAt: new Date().toISOString(),
        timestamp: Date.now()
    };
};
