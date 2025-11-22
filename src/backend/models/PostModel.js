/**
 * Creates a Post object structure.
 * @param {Object} data - The raw data for the post.
 * @param {string} data.author - The username of the author.
 * @param {string} data.uid - The user ID of the author.
 * @param {string} data.title - The title of the post.
 * @param {string} data.content - The content of the post.
 * @param {Array<string>} data.tags - Array of tags.
 * @returns {Object} A structured Post object.
 */
export const createPostModel = (data) => {
    return {
        author: data.author || 'Anonymous',
        uid: data.uid,
        avatarSeed: data.uid, // Using UID as seed for avatar
        title: data.title,
        content: data.content,
        tags: data.tags || [],
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        // We'll store a timestamp for sorting
        timestamp: Date.now()
    };
};
