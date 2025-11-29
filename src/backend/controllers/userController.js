import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

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
            const docSnap = await getDoc(docRef);
            const existingData = docSnap.exists() ? docSnap.data() : {};

            // Generate a random username if not provided
            let username = data.username;
            
            // If username is not provided in data, check if it exists in DB
            if (!username && existingData.username) {
                username = existingData.username;
            }

            if (!username) {
                // Simple uniqueness check could be added here, but for now we rely on the random space
                const { generateRandomName } = await import('../../utils/nameGenerator');
                username = generateRandomName();
            }

            // Check if user should be admin
            // SECURITY: Role assignment must be done on the backend. 
            // Client-side role assignment is insecure.
            // However, for DEVELOPMENT convenience, we allow it if running locally.
            let role = 'user';
            if (import.meta.env.DEV && ADMIN_EMAILS.includes(data.email)) {
                console.warn("Assigning ADMIN role based on client-side check (DEV MODE ONLY)");
                role = 'admin';
            }

            // Only set createdAt if it doesn't exist or if we are creating a new user
            const createdAt = existingData.createdAt || new Date().toISOString();

            await setDoc(docRef, {
                ...data,
                username: username,
                // isAnonymous is no longer needed as everyone has a pseudonym
                createdAt: createdAt,
                role: role
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
    },

    /**
     * Subscribes to the user's admin status.
     * @param {string} uid 
     * @param {function} callback 
     * @returns {function} Unsubscribe function
     */
    subscribeToAdminStatus: (uid, callback) => {
        const docRef = doc(db, USERS_COLLECTION, uid);
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                callback(docSnap.data().role === 'admin');
            } else {
                callback(false);
            }
        }, (error) => {
            console.error("Error subscribing to admin status:", error);
            callback(false);
        });
    }
};
