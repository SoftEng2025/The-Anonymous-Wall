import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
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
    }
};
