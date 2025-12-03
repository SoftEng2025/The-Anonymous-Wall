import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, increment, where, writeBatch, arrayUnion, arrayRemove, startAfter, limit } from 'firebase/firestore';
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
     * Retrieves posts with pagination.
     * @param {Object} lastDoc - The last document from the previous batch (for startAfter).
     * @param {number} limitCount - Number of posts to fetch.
     * @param {string} boardId - Optional board ID to filter by.
     * @returns {Promise<Object>} Object containing posts and the last document.
     */
    getPostsPaginated: async (lastDoc = null, limitCount = 10, boardId = null) => {
        try {
            let constraints = [
                orderBy('timestamp', 'desc'),
                limit(limitCount)
            ];

            if (boardId) {
                constraints.unshift(where('board', '==', boardId));
            }

            if (lastDoc) {
                constraints.push(startAfter(lastDoc));
            }

            const q = query(collection(db, POSTS_COLLECTION), ...constraints);
            const querySnapshot = await getDocs(q);

            const posts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return {
                posts,
                lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
            };
        } catch (error) {
            console.error("Error fetching paginated posts:", error);
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
     * @param {string} postId 
     * @param {string} uid - The user ID of the person liking/unliking.
     * @param {boolean} shouldLike - If true, we are liking (increment). If false, we are un-liking (decrement).
     */
    toggleLikePost: async (postId, uid, shouldLike) => {
        try {
            const docRef = doc(db, POSTS_COLLECTION, postId);
            await updateDoc(docRef, {
                likes: increment(shouldLike ? 1 : -1),
                likedBy: shouldLike ? arrayUnion(uid) : arrayRemove(uid)
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
    },

    /**
     * Retrieves all posts created by a specific user, ordered by timestamp descending.
     * @param {string} uid 
     * @returns {Promise<Array>} List of user's posts.
     */
    getPostsByUserId: async (uid) => {
        try {
            const q = query(
                collection(db, POSTS_COLLECTION),
                where('uid', '==', uid),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching user posts:", error);
            throw error;
        }
    },

    /**
     * Retrieves all posts for a specific board, ordered by timestamp descending.
     * @param {string} boardId - The board ID to filter by
     * @returns {Promise<Array>} List of posts for the board.
     */
    getPostsByBoard: async (boardId) => {
        try {
            const q = query(
                collection(db, POSTS_COLLECTION),
                where('board', '==', boardId),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching posts by board:", error);
            throw error;
        }
    },
    /**
     * Deletes a post by ID.
     * @param {string} postId 
     */
    deletePost: async (postId) => {
        try {
            const docRef = doc(db, POSTS_COLLECTION, postId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    },

    /**
     * Updates a post by ID.
     * @param {string} postId 
     * @param {Object} updateData 
     */
    updatePost: async (postId, updateData) => {
        try {
            const docRef = doc(db, POSTS_COLLECTION, postId);
            await updateDoc(docRef, updateData);
        } catch (error) {
            console.error("Error updating post:", error);
            throw error;
        }
    }
};
