import { db } from '../config/firebase';
import { collection, addDoc, getDocs, getDoc, query, orderBy, doc, updateDoc, increment, collectionGroup, where, writeBatch } from 'firebase/firestore';
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
    },

    /**
     * Updates the author name for all replies by a specific user.
     * @param {string} uid 
     * @param {string} newName 
     */
    updateRepliesAuthor: async (uid, newName) => {
        try {
            // Use collectionGroup to query all 'replies' subcollections
            const q = query(collectionGroup(db, REPLIES_SUBCOLLECTION), where('uid', '==', uid));
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.update(doc.ref, { author: newName });
            });

            await batch.commit();
        } catch (error) {
            console.error("Error updating replies author:", error);
            if (error.code === 'failed-precondition' && error.message.includes('index')) {
                console.error("MISSING INDEX: Please create the required index using the link in the error message above.");
            }
            throw error;
        }
    },

    /**
     * Updates the avatar seed for all replies by a specific user.
     * @param {string} uid 
     * @param {string} newSeed 
     */
    updateRepliesAvatar: async (uid, newSeed) => {
        try {
            const q = query(collectionGroup(db, REPLIES_SUBCOLLECTION), where('uid', '==', uid));
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.update(doc.ref, { avatarSeed: newSeed });
            });

            await batch.commit();
        } catch (error) {
            console.error("Error updating replies avatar:", error);
            throw error;
        }
    },

    /**
     * Toggles like on a reply.
     * @param {string} postId 
     * @param {string} replyId 
     * @param {string} userId 
     * @param {boolean} shouldLike 
     */
    toggleLikeReply: async (postId, replyId, userId, shouldLike) => {
        try {
            const replyRef = doc(db, POSTS_COLLECTION, postId, REPLIES_SUBCOLLECTION, replyId);
            const replySnap = await getDoc(replyRef);

            if (replySnap.exists()) {
                const currentLikedBy = replySnap.data().likedBy || [];

                if (shouldLike) {
                    await updateDoc(replyRef, {
                        likes: increment(1),
                        likedBy: [...currentLikedBy, userId]
                    });
                } else {
                    await updateDoc(replyRef, {
                        likes: increment(-1),
                        likedBy: currentLikedBy.filter(id => id !== userId)
                    });
                }
            }
        } catch (error) {
            console.error("Error toggling reply like:", error);
            throw error;
        }
    },

    /**
     * Updates a reply by ID.
     * @param {string} postId
     * @param {string} replyId
     * @param {Object} updateData
     */
    updateReply: async (postId, replyId, updateData) => {
        try {
            const replyRef = doc(db, POSTS_COLLECTION, postId, REPLIES_SUBCOLLECTION, replyId);
            await updateDoc(replyRef, updateData);
        } catch (error) {
            console.error("Error updating reply:", error);
            throw error;
        }
    }
};
