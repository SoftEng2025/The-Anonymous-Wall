import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS } from '../../utils/firebaseCollections';

const MODERATION_LOGS_COLLECTION = COLLECTIONS.MODERATION_LOGS;

export const moderationController = {
    /**
     * Logs a moderation action.
     * @param {string} adminId - ID of the admin performing the action
     * @param {string} action - Action type (e.g., 'DELETE_POST', 'RESOLVE_REPORT')
     * @param {string} targetId - ID of the target object (post or report)
     * @param {string} details - Additional details about the action
     */
    logAction: async (adminId, action, targetId, details = '') => {
        try {
            await addDoc(collection(db, MODERATION_LOGS_COLLECTION), {
                adminId,
                action,
                targetId,
                details,
                timestamp: serverTimestamp(),
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error logging moderation action:", error);
            // We don't throw here to avoid blocking the main action if logging fails
        }
    },

    /**
     * Retrieves moderation logs.
     * @returns {Promise<Array>} - List of moderation logs
     */
    getModerationLogs: async () => {
        try {
            const q = query(
                collection(db, MODERATION_LOGS_COLLECTION),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching moderation logs:", error);
            throw error;
        }
    }
};
