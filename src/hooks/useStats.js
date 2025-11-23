import { useState, useEffect } from 'react';
import { collection, collectionGroup, onSnapshot, query } from 'firebase/firestore';
import { db } from '../backend/config/firebase';

export const useStats = () => {
    const [stats, setStats] = useState({
        postCount: 0,
        messageCount: 0,
        replyCount: 0,
        totalCount: 0,
        loading: true
    });

    useEffect(() => {
        const postsQuery = query(collection(db, 'posts'));
        const messagesQuery = query(collection(db, 'messages'));
        const repliesQuery = query(collectionGroup(db, 'replies'));

        let postCount = 0;
        let messageCount = 0;
        let replyCount = 0;

        const updateStats = () => {
            setStats({
                postCount,
                messageCount,
                replyCount,
                totalCount: postCount + messageCount + replyCount,
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

        const unsubscribeReplies = onSnapshot(repliesQuery, (snapshot) => {
            replyCount = snapshot.size;
            updateStats();
        }, (error) => {
            console.error("Error listening to replies:", error);
        });

        return () => {
            unsubscribePosts();
            unsubscribeMessages();
            unsubscribeReplies();
        };
    }, []);

    return stats;
};
