import React from 'react';
import BoardBadge from '../../../components/BoardBadge';
import { getAvatarUrl } from '../../../backend/api/avatar';
import { getBoardById } from '../../../data/boardConfig';

const ForumFeed = ({
    posts,
    loading,
    onLike,
    onComment,
    onReport,
    onPostClick,
    hasMore,
    onLoadMore,
    loadingMore
}) => {
    return (
        <div className="posts-feed">
            {loading ? (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', padding: '2rem' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
                    Loading posts...
                </div>
            ) : (
                <>
                    {posts.map(post => (
                        <div
                            key={post.id}
                            className="post-card clickable"
                            onClick={() => onPostClick(post.id)}
                        >
                            <div className="post-header">
                                <img
                                    src={getAvatarUrl(post.avatarSeed)}
                                    alt={post.author}
                                    className="user-avatar"
                                />
                                <div className="header-content">
                                    <div className="post-info">
                                        <span className="username">{post.author}</span>
                                        <span>•</span>
                                        <span className="time">{post.timeAgo}</span>
                                    </div>
                                    {post.board && (
                                        <div className="post-board">
                                            <BoardBadge board={getBoardById(post.board)} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h3 className="post-title">{post.title}</h3>
                            <p className="post-content">{post.content}</p>
                            <div className="post-actions">
                                <button
                                    className={`action-btn ${post.isLikedByCurrentUser ? 'liked' : ''}`}
                                    onClick={(e) => onLike(e, post)}
                                >
                                    <i className={`fa-${post.isLikedByCurrentUser ? 'solid' : 'regular'} fa-heart`}></i> {post.likes}
                                </button>
                                <button className="action-btn" onClick={(e) => onComment(e, post.id)}>
                                    <i className="fa-regular fa-comment"></i> {post.comments}
                                </button>
                                <button className="action-btn report-btn" onClick={(e) => { e.stopPropagation(); onReport(post); }}>
                                    <i className="fa-regular fa-flag"></i> Report
                                </button>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '2rem' }}>
                            No posts found matching your criteria.
                        </div>
                    )}
                    {hasMore && posts.length > 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <button
                                className="load-more-btn"
                                onClick={onLoadMore}
                                disabled={loadingMore}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    cursor: 'pointer'
                                }}
                            >
                                {loadingMore ? (
                                    <><i className="fa-solid fa-spinner fa-spin"></i> Loading...</>
                                ) : (
                                    'Load More'
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ForumFeed;
