import React from 'react';
import { useStats } from '../hooks/useStats';
import './Stats.css';

export default function Stats() {
    const { postCount, messageCount, replyCount, totalCount, loading } = useStats();

    if (loading) {
        return <div className="stats-container" aria-busy="true">Loading stats...</div>;
    }

    return (
        <div className="stats-container" aria-label="Community Statistics">
            <div className="stat-item mint">
                <span className="stat-number">{postCount}</span>
                <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item peach">
                <span className="stat-number">{messageCount}</span>
                <span className="stat-label">Messages</span>
            </div>
            <div className="stat-item coral">
                <span className="stat-number">{replyCount}</span>
                <span className="stat-label">Replies</span>
            </div>
            <div className="stat-item blue">
                <span className="stat-number">{totalCount}</span>
                <span className="stat-label">Total</span>
            </div>
        </div>
    );
}
