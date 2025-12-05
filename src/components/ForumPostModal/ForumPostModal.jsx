import React, { useState, useEffect, useRef } from 'react';
import { getAvatarUrl } from '../../backend/api/avatar';
import { postController } from '../../backend/controllers/postController';
import { replyController } from '../../backend/controllers/replyController';
import { userController } from '../../backend/controllers/userController';
import { useAuth } from '../../contexts/AuthContext';
import { formatTimeAgo } from '../../utils/timeUtils';
import GuestRestrictionModal from '../GuestRestrictionModal';
import ReportModal from '../ReportModal/ReportModal';
import './ForumPostModal.css';

const ForumPostModal = ({ postId, onClose, onPostUpdate, focusCommentInput }) => {
    const { currentUser, userProfile, toggleSave } = useAuth();
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
    const [editPostContent, setEditPostContent] = useState('');
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editReplyContent, setEditReplyContent] = useState('');
    const [editError, setEditError] = useState(null);

    const [isSaved, setIsSaved] = useState(false);
    const [isGuestRestrictionModalOpen, setIsGuestRestrictionModalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setIsAdmin(userProfile.role === 'admin');
        }
    }, [userProfile]);

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

    useEffect(() => {
        if (currentUser && userProfile && postId) {
            setIsSaved((userProfile.savedPosts || []).map(String).includes(String(postId)));
        }
    }, [currentUser, userProfile, postId]);

    // Focus input when requested
    useEffect(() => {
        if (!loading && focusCommentInput && replyInputRef.current) {
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
            setIsLiked(!newIsLiked);
            setLikes(likes);
        }
    };

    const handleReplyLike = async (replyId, reply) => {
        if (!currentUser) {
            alert("Please login to like comments.");
            return;
        }

        const isCurrentlyLiked = reply.isLikedByCurrentUser;
        const shouldLike = !isCurrentlyLiked;

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
            setReplies(replies); // Revert
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
        setEditPostContent(post.content);
        setIsEditingPost(true);
    };

    const handleDeleteReply = async (replyId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await replyController.deleteReply(postId, replyId);
            setReplies(prev => prev.map(r =>
                r.id === replyId ? { ...r, content: "[Deleted by Moderator]", isDeleted: true } : r
            ));
        } catch (error) {
            console.error("Failed to delete reply:", error);
            alert("Failed to delete comment.");
        }
    };

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [replyToReport, setReplyToReport] = useState(null);
    const [isReportSuccessModalOpen, setIsReportSuccessModalOpen] = useState(false);

    const handleReportReply = (reply) => {
        setReplyToReport(reply);
        setIsReportModalOpen(true);
    };

    const handleReportSubmit = async (reason) => {
        if (!replyToReport) return;

        try {
            await replyController.reportReply(postId, replyToReport.id, reason, currentUser?.uid);
            setIsReportModalOpen(false);
            setReplyToReport(null);
            setIsReportSuccessModalOpen(true);
        } catch (error) {
            console.error("Error reporting reply:", error);
            alert("Failed to report comment.");
        }
    };

    const handleToggleSave = async () => {
        if (!currentUser) {
            alert("Please login to save posts.");
            return;
        }

        if (currentUser.isAnonymous) {
            setIsGuestRestrictionModalOpen(true);
            return;
        }

        try {
            await toggleSave(postId);
        } catch (error) {
            console.error("Error toggling save:", error);
        }
    };

    const handleSavePostContent = async () => {
        if (!editPostContent.trim()) return;
        try {
            const editedTimestamp = Date.now();
            await postController.updatePost(postId, {
                content: editPostContent,
                editedAt: editedTimestamp
            });
            setPost(prev => ({ ...prev, content: editPostContent, editedAt: editedTimestamp }));
            setIsEditingPost(false);
            setEditError(null);
            if (onPostUpdate) {
                onPostUpdate({ id: postId, title: post.title, content: editPostContent, editedAt: editedTimestamp });
            }
        } catch (error) {
            console.error("Failed to update post:", error);
            setEditError("Failed to save your changes. Please try again.");
        }
    };

    const handleEditReplyClick = (reply) => {
        setEditReplyContent(reply.content);
        setEditingReplyId(reply.id);
    };

    const handleSaveReply = async (replyId) => {
        if (!editReplyContent.trim()) return;
        try {
            const editedTimestamp = Date.now();
            await replyController.updateReply(postId, replyId, {
                content: editReplyContent,
                editedAt: editedTimestamp
            });
            setReplies(prev => prev.map(r => r.id === replyId ? { ...r, content: editReplyContent, editedAt: editedTimestamp } : r));
            setEditingReplyId(null);
            setEditError(null);
        } catch (error) {
            console.error("Failed to update reply:", error);
            setEditError("Failed to save your changes. Please try again.");
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
                                {editError && <div className="modal-error-message">{editError}</div>}
                                <div className="modal-edit-actions">
                                    <button className="modal-edit-btn-cancel" onClick={() => setIsEditingPost(false)}>Cancel</button>
                                    <button className="modal-edit-btn-save" onClick={handleSavePostContent}>Save</button>
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
                                        title={isLiked ? "Unlike" : "Like"}
                                    >
                                        <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
                                        <span>{likes}</span>
                                    </button>
                                    <button
                                        className="modal-stat-btn"
                                        onClick={() => replyInputRef.current?.focus()}
                                        title="Comment"
                                    >
                                        <i className="fa-regular fa-comment"></i>
                                        <span>{replies.length}</span>
                                    </button>
                                    <button
                                        className={`modal-stat-btn ${isSaved ? 'saved' : ''}`}
                                        onClick={handleToggleSave}
                                        title={isSaved ? "Unsave" : "Save"}
                                    >
                                        <i className={`fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`}></i>
                                        <span>{isSaved ? 'Saved' : 'Save'}</span>
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
                                            <div className="comment-header">
                                                <div className="comment-header-left">
                                                    <span className="modal-reply-username" style={{ color: reply.isDeleted ? '#999' : 'inherit' }}>
                                                        {reply.author}
                                                    </span>
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
                                            </div>
                                        </div>

                                        {editingReplyId === reply.id ? (
                                            <div className="modal-edit-form">
                                                <textarea
                                                    className="modal-edit-textarea"
                                                    value={editReplyContent}
                                                    onChange={(e) => setEditReplyContent(e.target.value)}
                                                    placeholder="Reply Content"
                                                />
                                                {editError && <div className="modal-error-message">{editError}</div>}
                                                <div className="modal-edit-actions">
                                                    <button className="modal-edit-btn-cancel" onClick={() => setEditingReplyId(null)}>Cancel</button>
                                                    <button className="modal-edit-btn-save" onClick={() => handleSaveReply(reply.id)}>Save</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="modal-reply-text" style={{ fontStyle: reply.isDeleted ? 'italic' : 'normal', color: reply.isDeleted ? '#aaa' : 'inherit' }}>
                                                {reply.content}
                                            </p>
                                        )}
                                    </div>

                                    {editingReplyId !== reply.id && (
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
                                            {isAdmin && !reply.isDeleted && (
                                                <button
                                                    className="modal-reply-action-btn delete-btn"
                                                    onClick={() => handleDeleteReply(reply.id)}
                                                    title="Delete Comment"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            )}
                                            {!reply.isDeleted && currentUser && currentUser.uid !== reply.uid && (
                                                <button
                                                    className="modal-reply-action-btn report-btn"
                                                    onClick={() => handleReportReply(reply)}
                                                    title="Report Comment"
                                                >
                                                    <i className="fa-regular fa-flag"></i>
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

            <GuestRestrictionModal
                isOpen={isGuestRestrictionModalOpen}
                onClose={() => setIsGuestRestrictionModalOpen(false)}
                onLogin={() => {
                    setIsGuestRestrictionModalOpen(false);
                    alert("Please use the main login button to sign in.");
                }}
                title="Guest Restriction"
                message="Guests cannot save posts."
                subMessage="To save posts to your profile, please log in to a permanent account."
                actionLabel="Login to Save"
                icon="fa-bookmark"
            />

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => {
                    setIsReportModalOpen(false);
                    setReplyToReport(null);
                }}
                onSubmit={handleReportSubmit}
            />

            <GuestRestrictionModal
                isOpen={isReportSuccessModalOpen}
                onClose={() => setIsReportSuccessModalOpen(false)}
                onLogin={() => setIsReportSuccessModalOpen(false)}
                title="Report Submitted"
                message="Thank you for your report."
                subMessage="We will review the content shortly to ensure it adheres to our community guidelines."
                actionLabel="Close"
                icon="fa-check-circle"
                showCancel={false}
            />
        </div>
    );
};

export default ForumPostModal;
