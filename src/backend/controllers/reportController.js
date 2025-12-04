import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS } from '../../utils/firebaseCollections';

const REPORTS_COLLECTION = COLLECTIONS.REPORTS;

export const reportController = {
    /**
     * Creates a new report for a post.
     * @param {string} postId - ID of the reported post
     * @param {string} reason - Reason for reporting
     * @param {string} reporterId - ID of the user reporting
     * @returns {Promise<string>} - The ID of the created report
     */
    createReport: async (postId, reason, reporterId, type = 'post') => {
        try {
            const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
                postId,
                reason,
                reporterId,
                type, // 'post' or 'message'
                status: 'pending', // pending, resolved, dismissed
                timestamp: serverTimestamp(),
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating report:", error);
            throw error;
        }
    },

    /**
     * Retrieves all pending reports.
     * @returns {Promise<Array>} - List of pending reports
     */
    getPendingReports: async () => {
        try {
            const q = query(
                collection(db, REPORTS_COLLECTION),
                where('status', '==', 'pending'),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching pending reports:", error);
            throw error;
        }
    },

    /**
     * Resolves a report (approves or dismisses it).
     * @param {string} reportId - ID of the report
     * @param {string} status - New status ('resolved' or 'dismissed')
     * @param {string} adminId - ID of the admin resolving it
     */
    resolveReport: async (reportId, status, adminId) => {
        try {
            const reportRef = doc(db, REPORTS_COLLECTION, reportId);
            await updateDoc(reportRef, {
                status,
                resolvedBy: adminId,
                resolvedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error resolving report:", error);
            throw error;
        }
    }
};
