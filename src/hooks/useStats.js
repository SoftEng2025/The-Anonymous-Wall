import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../backend/config/firebase';

export const useStats = () => {
    const [stats, setStats] = useState({
        postCount: 0,
        messageCount: 0,
        totalCount: 0,
        loading: true
    });

    useEffect(() => {
        const postsQuery = query(collection(db, 'posts'));
        const messagesQuery = query(collection(db, 'messages'));

        let postCount = 0;
        let messageCount = 0;

        const updateStats = () => {
            setStats({
                postCount,
                messageCount,
                totalCount: postCount + messageCount,
                loading: false
            });
        };

        const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
            postCount = snapshot.size;
            updateStats();
        }, (error) => {
            console.error("Error listening to posts:", error);
        });

        const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
            messageCount = snapshot.size;
            updateStats();
        }, (error) => {
            console.error("Error listening to messages:", error);
        });

        return () => {
            unsubscribePosts();
            unsubscribeMessages();
        };
    }, []);

    return stats;
};
