import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { createMessageModel } from '../models/MessageModel';

const MESSAGES_COLLECTION = 'messages';

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
     * Deletes a message by ID.
     * @param {string} id - The ID of the message to delete.
     */
    deleteMessage: async (id) => {
        try {
            const docRef = doc(db, MESSAGES_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting message:", error);
            throw error;
        }
    }
};
