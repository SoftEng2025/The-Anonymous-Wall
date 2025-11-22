import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAvatarUrl } from '../backend/api/avatar';
import { postController } from '../backend/controllers/postController';
import { replyController } from '../backend/controllers/replyController';
import { useAuth } from '../contexts/AuthContext';
import './ForumPost.css';

const ForumPost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [post, setPost] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostAndReplies = async () => {
            try {
                setLoading(true);
                const fetchedPost = await postController.getPostById(postId);
                if (fetchedPost) {
                    setPost(fetchedPost);
                    setLikes(fetchedPost.likes || 0);

                    const fetchedReplies = await replyController.getReplies(postId);
                    setReplies(fetchedReplies);
                }
            } catch (error) {
                console.error("Error fetching post details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPostAndReplies();
        }
    }, [postId]);

    const handleLike = async () => {
        // Optimistic update
        const newIsLiked = !isLiked;
        const newLikes = newIsLiked ? likes + 1 : likes - 1;

        setIsLiked(newIsLiked);
        setLikes(newLikes);

        try {
            await postController.toggleLikePost(postId, !newIsLiked);
        } catch (error) {
            console.error("Error toggling like:", error);
            // Revert on error
            setIsLiked(!newIsLiked);
            setLikes(likes);
        }
    };

    const handleReplySubmit = async (e) => {
        if (e.key === 'Enter' && replyContent.trim()) {
            if (!currentUser) {
                alert("Please login to reply.");
                return;
            }

            try {
                const replyData = {
                    author: currentUser.displayName || 'Anonymous',
                    uid: currentUser.uid,
                    content: replyContent
                };

                const newReply = await replyController.addReply(postId, replyData);

                // Optimistic update
                const displayReply = {
                    ...newReply,
                    timeAgo: 'Just now',
                    avatarSeed: currentUser.uid
                };

                setReplies([...replies, displayReply]);
                setReplyContent('');
            } catch (error) {
                console.error("Error adding reply:", error);
                alert("Failed to add reply.");
            }
        }
    };

    const handleReplyClick = () => {
        document.querySelector('.reply-main-input').focus();
    };

    if (loading) {
        return <div className="forum-post-page loading">Loading...</div>;
    }

    if (!post) {
        return <div className="forum-post-page">Post not found.</div>;
    }

    return (
        <div className="forum-post-page">
            <div className="post-container">
                <button className="back-btn" onClick={() => navigate('/forum')}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>

                <div className="forum-post-card">
                    <div className="main-post">
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
                                    <span className="time">{post.timeAgo || 'Recently'}</span>
                                </div>
                            </div>
                        </div>

                        <h1 className="post-title-large">{post.title}</h1>
                        <p className="post-content-large">{post.content}</p>

                        <div className="post-stats">
                            <button
                                className={`stat-item action-btn ${isLiked ? 'liked' : ''}`}
                                onClick={handleLike}
                            >
                                <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i> {likes}
                            </button>
                            <div className="stat-item">
                                <i className="fa-regular fa-comment"></i> {replies.length}
                            </div>
                        </div>

                        <div className="reply-input-section">
                            <input
                                type="text"
                                className="reply-main-input"
                                placeholder={currentUser ? "Add a reply" : "Login to reply"}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                onKeyDown={handleReplySubmit}
                                disabled={!currentUser}
                            />
                        </div>
                    </div>

                    <div className="replies-section">
                        {replies.map(reply => (
                            <div key={reply.id} className="reply-card">
                                <div className="reply-header">
                                    <img
                                        src={getAvatarUrl(reply.avatarSeed)}
                                        alt={reply.author}
                                        className="reply-avatar"
                                    />
                                    <div className="reply-info">
                                        <span className="reply-username">{reply.author}</span>
                                        <span>•</span>
                                        <span className="reply-time">{reply.timeAgo || 'Recently'}</span>
                                    </div>
                                </div>
                                <p className="reply-content">{reply.content}</p>
                                <div className="reply-actions">
                                    <button className="reply-action-btn">
                                        <i className="fa-regular fa-heart"></i> {reply.likes || 0}
                                    </button>
                                    <button className="reply-action-btn" onClick={handleReplyClick}>
                                        <i className="fa-solid fa-reply"></i> Reply
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForumPost;
