import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const USERS_COLLECTION = 'users';

// Get admin emails from environment variable
const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS
    ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map(email => email.trim())
    : [];

export const userController = {
    /**
     * Retrieves a user's profile.
     * @param {string} uid 
     * @returns {Promise<Object>} User profile data.
     */
    getUserProfile: async (uid) => {
        try {
            const docRef = doc(db, USERS_COLLECTION, uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    },

    /**
     * Creates or updates a user's profile.
     * @param {string} uid 
     * @param {Object} data 
     */
    createUserProfile: async (uid, data) => {
        try {
            const docRef = doc(db, USERS_COLLECTION, uid);

            // Generate a random username if not provided
            let username = data.username;
            if (!username) {
                // Simple uniqueness check could be added here, but for now we rely on the random space
                const { generateRandomName } = await import('../../utils/nameGenerator');
                username = generateRandomName();
            }

            // Check if user should be admin
            const role = ADMIN_EMAILS.includes(data.email) ? 'admin' : 'user';

            await setDoc(docRef, {
                username: username,
                // isAnonymous is no longer needed as everyone has a pseudonym
                createdAt: new Date().toISOString(),
                role: role,
                ...data
            }, { merge: true });

            return { username };
        } catch (error) {
            console.error("Error creating user profile:", error);
            throw error;
        }
    },

    /**
     * Checks if a user has admin privileges.
     * @param {string} uid 
     * @returns {Promise<boolean>}
     */
    isAdmin: async (uid) => {
        try {
            const docRef = doc(db, USERS_COLLECTION, uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data().role === 'admin';
            }
            return false;
        } catch (error) {
            console.error("Error checking admin status:", error);
            return false;
        }
    },

    /**
     * Updates a user's profile settings.
     * @param {string} uid 
     * @param {Object} data 
     */
    updateUserProfile: async (uid, data) => {
        try {
            const docRef = doc(db, USERS_COLLECTION, uid);
            await updateDoc(docRef, data);
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    }
};
