import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, increment, where, writeBatch, arrayUnion, arrayRemove, startAfter, limit, documentId } from 'firebase/firestore';
import { createPostModel } from '../models/PostModel';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { COLLECTIONS } from '../../utils/firebaseCollections';

const POSTS_COLLECTION = COLLECTIONS.POSTS;
const FIRESTORE_IN_QUERY_LIMIT = 30;
const FIRESTORE_BATCH_LIMIT = 500;

const storage = getStorage();

export const postController = {
    /**
     * Creates a new post in Firestore.
     * @param {Object} postData 
     * @returns {Promise<string>} The ID of the created post.
     */
    /**
     * Uploads an image to Firebase Storage and returns the URL.
     * @param {File} file 
     * @returns {Promise<string>}
     */
    uploadImage: async (file) => {
        try {
            if (!file) return null;
            // Changed back to 'posts/' as 'uploads/' might be blocked by security rules
            const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
            console.log("Starting image upload to:", storageRef.fullPath);
            const snapshot = await uploadBytes(storageRef, file);
            console.log("Image uploaded successfully");
            return await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error("Error uploading image detailed:", error);
            throw error;
        }
    },

    /**
     * Creates a new post in Firestore.
     * @param {Object} postData 
     * @returns {Promise<string>} The ID of the created post.
     */
    createPost: async (postData) => {
        try {
            if (!postData) throw new Error("Post data is required");
            if (!postData.uid) throw new Error("User ID is required");

            let imageUrl = null;

            // Handle image upload if an image is provided
            // Check if 'image' is a File object (upload needed) or string (already URL)
            if (postData.image) {
                if (typeof postData.image === 'object') {
                    // Upload file
                    imageUrl = await postController.uploadImage(postData.image);
                } else {
                    // Use URL directly
                    imageUrl = postData.image;
                }
            }

            const model = createPostModel({ ...postData, imageUrl });
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
     * Retrieves multiple posts by their IDs.
     * Handles chunking to respect Firestore's 'in' query limit of 30.
     * @param {Array<string>} postIds 
     * @returns {Promise<Array>} List of posts.
     */
    getPostsByIds: async (postIds) => {
        try {
            if (!postIds || postIds.length === 0) return [];

            // Filter out invalid IDs
            postIds = postIds.filter(id => typeof id === 'string' && id.trim().length > 0);

            if (postIds.length === 0) return [];

            const chunks = [];
            const chunkSize = FIRESTORE_IN_QUERY_LIMIT;

            for (let i = 0; i < postIds.length; i += chunkSize) {
                chunks.push(postIds.slice(i, i + chunkSize));
            }

            const promises = chunks.map(async (chunk) => {
                const q = query(
                    collection(db, POSTS_COLLECTION),
                    where(documentId(), 'in', chunk)
                );
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            });

            const results = await Promise.all(promises);
            // Flatten the array of arrays
            return results.flat();
        } catch (error) {
            console.error("Error fetching posts by IDs:", error);
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
     * Handles batch limits by chunking updates.
     * @param {string} uid 
     * @param {string} newName 
     */
    updatePostsAuthor: async (uid, newName) => {
        try {
            const q = query(collection(db, POSTS_COLLECTION), where('uid', '==', uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) return;

            const docs = querySnapshot.docs;
            const chunks = [];

            for (let i = 0; i < docs.length; i += FIRESTORE_BATCH_LIMIT) {
                chunks.push(docs.slice(i, i + FIRESTORE_BATCH_LIMIT));
            }

            for (const chunk of chunks) {
                const batch = writeBatch(db);
                chunk.forEach((doc) => {
                    batch.update(doc.ref, { author: newName });
                });
                await batch.commit();
            }
        } catch (error) {
            console.error("Error updating posts author:", error);
            throw error;
        }
    },

    /**
     * Updates the avatar seed for all posts by a specific user.
     * Handles batch limits by chunking updates.
     * @param {string} uid 
     * @param {string} newSeed 
     */
    updatePostsAvatar: async (uid, newSeed) => {
        try {
            const q = query(collection(db, POSTS_COLLECTION), where('uid', '==', uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) return;

            const docs = querySnapshot.docs;
            const chunks = [];

            for (let i = 0; i < docs.length; i += FIRESTORE_BATCH_LIMIT) {
                chunks.push(docs.slice(i, i + FIRESTORE_BATCH_LIMIT));
            }

            for (const chunk of chunks) {
                const batch = writeBatch(db);
                chunk.forEach((doc) => {
                    batch.update(doc.ref, { avatarSeed: newSeed });
                });
                await batch.commit();
            }
        } catch (error) {
            console.error("Error updating posts avatar:", error);
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
            const docRef = doc(db, POSTS_COLLECTION, String(postId));
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
