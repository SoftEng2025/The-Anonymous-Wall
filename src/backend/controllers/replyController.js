import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { createReplyModel } from '../models/ReplyModel';

const POSTS_COLLECTION = 'posts';
const REPLIES_SUBCOLLECTION = 'replies';

export const replyController = {
    /**
     * Adds a reply to a specific post.
     * @param {string} postId 
     * @param {Object} replyData 
     * @returns {Promise<Object>} The created reply with ID.
     */
    addReply: async (postId, replyData) => {
        try {
            const model = createReplyModel(replyData);
            const repliesRef = collection(db, POSTS_COLLECTION, postId, REPLIES_SUBCOLLECTION);
            const docRef = await addDoc(repliesRef, model);

            // Update comment count on the post
            const postRef = doc(db, POSTS_COLLECTION, postId);
            await updateDoc(postRef, {
                comments: increment(1)
            });

            return { id: docRef.id, ...model };
        } catch (error) {
            console.error("Error adding reply:", error);
            throw error;
        }
    },

    /**
     * Fetches all replies for a post.
     * @param {string} postId 
     * @returns {Promise<Array>} List of replies.
     */
    getReplies: async (postId) => {
        try {
            const repliesRef = collection(db, POSTS_COLLECTION, postId, REPLIES_SUBCOLLECTION);
            const q = query(repliesRef, orderBy('timestamp', 'asc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching replies:", error);
            throw error;
        }
    }
};
