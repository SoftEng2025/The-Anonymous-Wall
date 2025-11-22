import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, orderBy, increment, where, writeBatch } from 'firebase/firestore';
import { createPostModel } from '../models/PostModel';

const POSTS_COLLECTION = 'posts';

export const postController = {
    /**
     * Creates a new post in Firestore.
     * @param {Object} postData 
     * @returns {Promise<string>} The ID of the created post.
     */
    createPost: async (postData) => {
        try {
            const model = createPostModel(postData);
            const docRef = await addDoc(collection(db, POSTS_COLLECTION), model);
            return docRef.id;
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    },

    /**
     * Retrieves all posts, ordered by timestamp descending.
     * @returns {Promise<Array>} List of posts.
     */
    getAllPosts: async () => {
        try {
            const q = query(collection(db, POSTS_COLLECTION), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }
    },

    /**
     * Retrieves a single post by ID.
     * @param {string} postId 
     * @returns {Promise<Object>} The post data.
     */
    getPostById: async (postId) => {
        try {
            const docRef = doc(db, POSTS_COLLECTION, postId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching post:", error);
            throw error;
        }
    },

    /**
     * Toggles a like on a post.
     * Note: This is a simplified implementation. In a real app, you'd track *who* liked it to prevent duplicates.
     * @param {string} postId 
     * @param {boolean} isLiked - If true, we are un-liking (decrement). If false, we are liking (increment).
     */
    toggleLikePost: async (postId, isLiked) => {
        try {
            const docRef = doc(db, POSTS_COLLECTION, postId);
            await updateDoc(docRef, {
                likes: increment(isLiked ? -1 : 1)
            });
        } catch (error) {
            console.error("Error updating like:", error);
            throw error;
        }
    },

    /**
     * Updates the author name for all posts by a specific user.
     * @param {string} uid 
     * @param {string} newName 
     */
    updatePostsAuthor: async (uid, newName) => {
        try {
            const q = query(collection(db, POSTS_COLLECTION), where('uid', '==', uid));
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.update(doc.ref, { author: newName });
            });

            await batch.commit();
        } catch (error) {
            console.error("Error updating posts author:", error);
            throw error;
        }
    }
};
