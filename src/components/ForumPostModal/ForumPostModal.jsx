import React, { useState, useEffect, useRef } from 'react';
import { getAvatarUrl } from '../../backend/api/avatar';
import { postController } from '../../backend/controllers/postController';
import { replyController } from '../../backend/controllers/replyController';
import { userController } from '../../backend/controllers/userController';
import { useAuth } from '../../contexts/AuthContext';
import { formatTimeAgo } from '../../utils/timeUtils';
import './ForumPostModal.css';

const ForumPostModal = ({ postId, onClose, onPostUpdate, focusCommentInput }) => {
    const { currentUser } = useAuth();
    const [post, setPost] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const replyInputRef = useRef(null);

    // Edit State
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editPostTitle, setEditPostTitle] = useState('');
    const [editPostContent, setEditPostContent] = useState('');
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editReplyContent, setEditReplyContent] = useState('');

    useEffect(() => {
        const fetchPostAndReplies = async () => {
            try {
                setLoading(true);
                const fetchedPost = await postController.getPostById(postId);
                if (fetchedPost) {
                    fetchedPost.timeAgo = formatTimeAgo(fetchedPost.timestamp);
                    setPost(fetchedPost);
                    setLikes(fetchedPost.likes || 0);
                    if (currentUser && fetchedPost.likedBy) {
                        setIsLiked(fetchedPost.likedBy.includes(currentUser.uid));
                    } else {
                        setIsLiked(false);
                    }

                    const fetchedReplies = await replyController.getReplies(postId);
                    const processedReplies = fetchedReplies.map(reply => ({
                        ...reply,
                        timeAgo: formatTimeAgo(reply.timestamp),
                        isLikedByCurrentUser: currentUser ? (reply.likedBy || []).includes(currentUser.uid) : false
                    }));
                    setReplies(processedReplies);

                    // Sync latest stats to parent
                    if (onPostUpdate) {
                        onPostUpdate({
                            id: postId,
                            comments: processedReplies.length,
                            likes: fetchedPost.likes || 0,
                            likedBy: fetchedPost.likedBy || []
                        });
                    }
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
    }, [postId, currentUser]);

    // Focus input when requested
    useEffect(() => {
        if (!loading && focusCommentInput && replyInputRef.current) {
            // Small timeout to ensure modal transition is done or DOM is ready
            setTimeout(() => {
                replyInputRef.current.focus();
            }, 100);
        }
    }, [focusCommentInput, loading]);

    const handleLike = async () => {
        if (!currentUser) {
            alert("Please login to like posts.");
            return;
        }

        const newIsLiked = !isLiked;
        const newLikes = newIsLiked ? likes + 1 : likes - 1;

        setIsLiked(newIsLiked);
        setLikes(newLikes);

        // Notify parent immediately for UI sync
        if (onPostUpdate && post) {
            onPostUpdate({
                id: postId,
                likes: newLikes,
                isLikedByCurrentUser: newIsLiked,
                likedBy: newIsLiked
                    ? [...(post.likedBy || []), currentUser.uid]
                    : (post.likedBy || []).filter(id => id !== currentUser.uid)
            });
        }

        try {
            await postController.toggleLikePost(postId, currentUser.uid, newIsLiked);
        } catch (error) {
            console.error("Error toggling like:", error);
            // Revert on error
            setIsLiked(!newIsLiked);
            setLikes(likes);
            if (onPostUpdate && post) {
                onPostUpdate({
                    id: postId,
                    likes: likes,
                    isLikedByCurrentUser: !newIsLiked,
                    likedBy: post.likedBy // Revert to original
                });
            }
        }
    };

    const handleReplyLike = async (replyId, reply) => {
        if (!currentUser) {
            alert("Please login to like comments.");
            return;
        }

        const isCurrentlyLiked = reply.isLikedByCurrentUser;
        const shouldLike = !isCurrentlyLiked;

        // Optimistic update
        const updatedReplies = replies.map(r => {
            if (r.id === replyId) {
                return {
                    ...r,
                    likes: shouldLike ? (r.likes || 0) + 1 : (r.likes || 0) - 1,
                    isLikedByCurrentUser: shouldLike,
                    likedBy: shouldLike
                        ? [...(r.likedBy || []), currentUser.uid]
                        : (r.likedBy || []).filter(id => id !== currentUser.uid)
                };
            }
            return r;
        });

        setReplies(updatedReplies);

        try {
            await replyController.toggleLikeReply(postId, replyId, currentUser.uid, shouldLike);
        } catch (error) {
            console.error("Error liking comment:", error);
            // Revert on error
            const revertedReplies = replies.map(r => {
                if (r.id === replyId) {
                    return reply;
                }
                return r;
            });
            setReplies(revertedReplies);
        }
    };

    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;

        if (!currentUser) {
            alert("Please login to reply.");
            return;
        }

        try {
            let profile = await userController.getUserProfile(currentUser.uid);

            if (!profile) {
                profile = await userController.createUserProfile(currentUser.uid, {});
            }

            const authorName = profile.username;

            const replyData = {
                author: authorName,
                uid: currentUser.uid,
                content: replyContent,
                replyTo: replyingTo ? replyingTo.author : null
            };

            const newReply = await replyController.addReply(postId, replyData);

            const displayReply = {
                ...newReply,
                timeAgo: 'Just now',
                avatarSeed: currentUser.uid,
                isLikedByCurrentUser: false
            };

            const newReplies = [...replies, displayReply];
            setReplies(newReplies);
            setReplyContent('');
            setReplyingTo(null);

            // Notify parent about new comment count
            if (onPostUpdate) {
                onPostUpdate({
                    id: postId,
                    comments: newReplies.length
                });
            }

        } catch (error) {
            console.error("Error adding reply:", error);
            alert("Failed to add reply.");
        }
    };

    const handleReplyClick = (reply) => {
        setReplyingTo(reply);
        if (replyInputRef.current) {
            replyInputRef.current.focus();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleEditPostClick = () => {
        setEditPostTitle(post.title);
        setEditPostContent(post.content);
        setIsEditingPost(true);
    };

    const handleSavePost = async () => {
        if (!editPostContent.trim()) return;
        try {
            await postController.updatePost(postId, {
                content: editPostContent,
                editedAt: Date.now()
            });
            setPost(prev => ({ ...prev, content: editPostContent, editedAt: Date.now() }));
            setIsEditingPost(false);
            if (onPostUpdate) {
                onPostUpdate({ id: postId, title: post.title, content: editPostContent });
            }
        } catch (error) {
            console.error("Failed to update post:", error);
            alert("Failed to update post.");
        }
    };

    const handleEditReplyClick = (reply) => {
        setEditReplyContent(reply.content);
        setEditingReplyId(reply.id);
    };

    const handleSaveReply = async (replyId) => {
        if (!editReplyContent.trim()) return;
        try {
            await replyController.updateReply(postId, replyId, {
                content: editReplyContent,
                editedAt: Date.now()
            });
            setReplies(prev => prev.map(r => r.id === replyId ? { ...r, content: editReplyContent, editedAt: Date.now() } : r));
            setEditingReplyId(null);
        } catch (error) {
            console.error("Failed to update reply:", error);
            alert("Failed to update reply.");
        }
    };

    if (loading) {
        return (
            <div className="forum-post-modal-overlay" onClick={handleOverlayClick}>
                <div className="forum-post-modal">
                    <div className="modal-loading">Loading...</div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="forum-post-modal-overlay" onClick={handleOverlayClick}>
                <div className="forum-post-modal">
                    <div className="modal-error">Post not found.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="forum-post-modal-overlay" onClick={handleOverlayClick}>
            <div className="forum-post-modal" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header-bar">
                    <h2 className="modal-header-title">{post.author}'s Post</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="modal-body-content">
                    {/* Main Post */}
                    <div className="modal-main-post">
                        <div className="modal-post-header">
                            <img
                                src={getAvatarUrl(post.avatarSeed)}
                                alt={post.author}
                                className="modal-user-avatar"
                            />
                            <div className="modal-post-info">
                                <span className="modal-username">{post.author}</span>
                                <span className="modal-separator">•</span>
                                <span className="modal-time">
                                    {post.timeAgo || 'Recently'}
                                    {post.editedAt && <span className="modal-edited-indicator"> (edited)</span>}
                                </span>
                            </div>
                        </div>

                        {isEditingPost ? (
                            <div className="modal-edit-form">
                                <h1 className="modal-post-title">{post.title}</h1>
                                <textarea
                                    className="modal-edit-textarea"
                                    value={editPostContent}
                                    onChange={(e) => setEditPostContent(e.target.value)}
                                    placeholder="Post Content"
                                />
                                <div className="modal-edit-actions">
                                    <button className="modal-edit-btn-cancel" onClick={() => setIsEditingPost(false)}>Cancel</button>
                                    <button className="modal-edit-btn-save" onClick={handleSavePost}>Save</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="modal-post-title">{post.title}</h1>
                                <p className="modal-post-content">{post.content}</p>

                                <div className="modal-post-stats">
                                    <button
                                        className={`modal-stat-btn ${isLiked ? 'liked' : ''}`}
                                        onClick={handleLike}
                                    >
                                        <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
                                        <span>{likes}</span>
                                    </button>
                                    <button
                                        className="modal-stat-btn"
                                        onClick={() => replyInputRef.current?.focus()}
                                    >
                                        <i className="fa-regular fa-comment"></i>
                                        <span>{replies.length}</span>
                                    </button>
                                    {currentUser && !currentUser.isAnonymous && post.uid === currentUser.uid && (
                                        <button className="modal-stat-btn" onClick={handleEditPostClick}>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                            <span>Edit</span>
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Replies Section */}
                    <div className="modal-replies-section">
                        {replies.map(reply => (
                            <div key={reply.id} className="modal-reply-card">
                                <img
                                    src={getAvatarUrl(reply.avatarSeed)}
                                    alt={reply.author}
                                    className="modal-reply-avatar"
                                />
                                <div className="modal-reply-content-wrapper">
                                    <div className="modal-reply-bubble">
                                        <div className="modal-reply-header">
                                            <span className="modal-reply-username">{reply.author}</span>
                                            {reply.replyTo && (
                                                <>
                                                    <span className="modal-reply-arrow">▸</span>
                                                    <span className="modal-reply-target">{reply.replyTo}</span>
                                                </>
                                            )}
                                            <span className="modal-separator">•</span>
                                            <span className="modal-reply-time">
                                                {reply.timeAgo || 'Recently'}
                                                {reply.editedAt && <span className="modal-edited-indicator"> (edited)</span>}
                                            </span>
                                        </div>

                                        {editingReplyId === reply.id ? (
                                            <div className="modal-edit-form">
                                                <textarea
                                                    className="modal-edit-textarea"
                                                    value={editReplyContent}
                                                    onChange={(e) => setEditReplyContent(e.target.value)}
                                                    placeholder="Reply Content"
                                                />
                                                <div className="modal-edit-actions">
                                                    <button className="modal-edit-btn-cancel" onClick={() => setEditingReplyId(null)}>Cancel</button>
                                                    <button className="modal-edit-btn-save" onClick={() => handleSaveReply(reply.id)}>Save</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="modal-reply-text">{reply.content}</p>
                                        )}
                                    </div>

                                    {!editingReplyId && (
                                        <div className="modal-reply-actions">
                                            <button
                                                className={`modal-reply-action-btn ${reply.isLikedByCurrentUser ? 'liked' : ''}`}
                                                onClick={() => handleReplyLike(reply.id, reply)}
                                            >
                                                <i className={`fa-${reply.isLikedByCurrentUser ? 'solid' : 'regular'} fa-heart`}></i>
                                                <span>{reply.likes || 0}</span>
                                            </button>
                                            <button
                                                className="modal-reply-action-btn"
                                                onClick={() => handleReplyClick(reply)}
                                            >
                                                <i className="fa-solid fa-reply"></i>
                                                <span>Reply</span>
                                            </button>
                                            {currentUser && !currentUser.isAnonymous && reply.uid === currentUser.uid && (
                                                <button
                                                    className="modal-reply-action-btn"
                                                    onClick={() => handleEditReplyClick(reply)}
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                    <span>Edit</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Reply Input - Sticky at Bottom */}
                <div className="modal-reply-input-section">
                    <img
                        src={currentUser ? getAvatarUrl(currentUser.uid) : getAvatarUrl(null)}
                        alt="Your avatar"
                        className="modal-input-avatar"
                    />
                    <div className="modal-input-wrapper">
                        {replyingTo && (
                            <div className="modal-replying-indicator">
                                <span>Replying to <strong>{replyingTo.author}</strong></span>
                                <button onClick={() => setReplyingTo(null)}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        )}
                        <input
                            ref={replyInputRef}
                            type="text"
                            className="modal-reply-input"
                            placeholder={currentUser ? (replyingTo ? `Reply to ${replyingTo.author}...` : "Add a reply") : "Login to reply"}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleReplySubmit();
                                }
                            }}
                            disabled={!currentUser}
                        />
                    </div>
                    <button
                        className="modal-send-btn"
                        onClick={handleReplySubmit}
                        disabled={!currentUser || !replyContent.trim()}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>

    );
};

export default ForumPostModal;
