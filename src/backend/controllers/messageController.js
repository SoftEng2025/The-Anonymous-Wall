import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, deleteDoc, where, documentId } from 'firebase/firestore';
import { createMessageModel } from '../models/MessageModel';
import { COLLECTIONS } from '../../utils/firebaseCollections';

const MESSAGES_COLLECTION = COLLECTIONS.MESSAGES;
const FIRESTORE_IN_QUERY_LIMIT = 30;

export const messageController = {
    /**
     * Creates a new message in Firestore.
     * @param {Object} messageData 
     * @returns {Promise<string>} The ID of the created message.
     */
    createMessage: async (messageData) => {
        try {
            const model = createMessageModel(messageData);
            const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), model);
            return docRef.id;
        } catch (error) {
            console.error("Error creating message:", error);
            throw error;
        }
    },

    /**
     * Retrieves all messages, ordered by timestamp descending.
     * @returns {Promise<Array>} List of messages.
     */
    getAllMessages: async () => {
        try {
            const q = query(collection(db, MESSAGES_COLLECTION), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw error;
        }
    },

    /**
     * Retrieves a single message by ID.
     * @param {string} id - The ID of the message to retrieve.
     * @returns {Promise<Object|null>} The message data or null if not found.
     */
    getMessageById: async (id) => {
        try {
            const docRef = doc(db, MESSAGES_COLLECTION, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching message:", error);
            throw error;
        }
    },

    /**
     * Retrieves multiple messages by their IDs.
     * Handles chunking to respect Firestore's 'in' query limit of 30.
     * @param {Array<string>} ids 
     * @returns {Promise<Array>} List of messages.
     */
    getMessagesByIds: async (ids) => {
        try {
            if (!ids || ids.length === 0) return [];

            // Filter out invalid IDs
            ids = ids.filter(id => typeof id === 'string' && id.trim().length > 0);

            if (ids.length === 0) return [];

            const chunks = [];
            const chunkSize = FIRESTORE_IN_QUERY_LIMIT;

            for (let i = 0; i < ids.length; i += chunkSize) {
                chunks.push(ids.slice(i, i + chunkSize));
            }

            const promises = chunks.map(async (chunk) => {
                const q = query(
                    collection(db, MESSAGES_COLLECTION),
                    where(documentId(), 'in', chunk)
                );
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            });

            const results = await Promise.all(promises);
            return results.flat();
        } catch (error) {
            console.error("Error fetching messages by IDs:", error);
            throw error;
        }
    },

    /**
     * Deletes a message by ID.
     * @param {string} id - The ID of the message to delete.
     */
    deleteMessage: async (id) => {
        try {
            const docRef = doc(db, MESSAGES_COLLECTION, String(id));
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting message:", error);
            throw error;
        }
    }
};
