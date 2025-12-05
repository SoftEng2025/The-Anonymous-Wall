import React, { useState, useEffect, useRef } from 'react';
import { postController } from '../../backend/controllers/postController';
import { replyController } from '../../backend/controllers/replyController';
import { userController } from '../../backend/controllers/userController';
import { useAuth } from '../../contexts/AuthContext';
import { formatTimeAgo } from '../../utils/timeUtils';
import GuestRestrictionModal from '../GuestRestrictionModal';
import ReportModal from '../ReportModal/ReportModal';
import './ForumPostModal.css';

// Sub-components
import ForumPostHeader from './components/ForumPostHeader';
import ForumPostMain from './components/ForumPostMain';
import ForumReplyList from './components/ForumReplyList';
import ForumReplyInput from './components/ForumReplyInput';

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

    // Report State
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [replyToReport, setReplyToReport] = useState(null);
    const [isReportSuccessModalOpen, setIsReportSuccessModalOpen] = useState(false);

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
                <ForumPostHeader
                    authorName={post.author}
                    onClose={onClose}
                />

                <div className="modal-body-content">
                    <ForumPostMain
                        post={post}
                        currentUser={currentUser}
                        isLiked={isLiked}
                        likes={likes}
                        commentsCount={replies.length}
                        isSaved={isSaved}
                        isEditing={isEditingPost}
                        editContent={editPostContent}
                        editError={editError}
                        onEditClick={handleEditPostClick}
                        onLike={handleLike}
                        onSave={handleToggleSave}
                        onEditCancel={() => setIsEditingPost(false)}
                        onEditSave={handleSavePostContent}
                        setEditContent={setEditPostContent}
                        focusReplyInput={() => replyInputRef.current?.focus()}
                    />

                    <ForumReplyList
                        replies={replies}
                        currentUser={currentUser}
                        isAdmin={isAdmin}
                        editingReplyId={editingReplyId}
                        editReplyContent={editReplyContent}
                        editError={editError}
                        onReplyLike={handleReplyLike}
                        onReplyClick={handleReplyClick}
                        onEditReplyClick={handleEditReplyClick}
                        onDeleteReply={handleDeleteReply}
                        onReportReply={handleReportReply}
                        onEditReplyCancel={() => setEditingReplyId(null)}
                        onEditReplySave={handleSaveReply}
                        setEditReplyContent={setEditReplyContent}
                    />
                </div>

                <ForumReplyInput
                    currentUser={currentUser}
                    replyingTo={replyingTo}
                    replyContent={replyContent}
                    inputRef={replyInputRef}
                    onCancelReplyTo={() => setReplyingTo(null)}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onSubmit={handleReplySubmit}
                />
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
