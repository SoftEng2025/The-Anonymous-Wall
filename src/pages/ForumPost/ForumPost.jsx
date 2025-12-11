import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAvatarUrl } from '../../backend/api/avatar';
import { postController } from '../../backend/controllers/postController';
import { replyController } from '../../backend/controllers/replyController';
import { userController } from '../../backend/controllers/userController';
import { reportController } from '../../backend/controllers/reportController';
import ReportModal from '../../components/ReportModal';
import ReportSuccessModal from '../../components/ReportSuccessModal/ReportSuccessModal';
import LoginModal from '../../components/LoginModal';
import GuestRestrictionModal from '../../components/GuestRestrictionModal';
import { useAuth } from '../../contexts/AuthContext';
import { formatTimeAgo } from '../../utils/timeUtils';
import './ForumPost.css';
import ForumReplyInput from '../../components/ForumPostModal/components/ForumReplyInput';

const ForumPost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { currentUser, toggleSave, userProfile } = useAuth();
    const [post, setPost] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [replyAttachment, setReplyAttachment] = useState('');
    const replyInputRef = React.useRef(null);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);

    // Report State
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isReportSuccessModalOpen, setIsReportSuccessModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isGuestRestrictionModalOpen, setIsGuestRestrictionModalOpen] = useState(false);

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
                        timeAgo: formatTimeAgo(reply.timestamp)
                    }));
                    setReplies(processedReplies);
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

    // Sync isSaved with userProfile
    useEffect(() => {
        if (currentUser && userProfile && postId) {
            setIsSaved((userProfile.savedPosts || []).map(String).includes(String(postId)));
        }
    }, [currentUser, userProfile, postId]);

    const handleLike = async () => {
        if (!currentUser) {
            alert("Please login to like posts.");
            return;
        }

        // Optimistic update
        const newIsLiked = !isLiked;
        const newLikes = newIsLiked ? likes + 1 : likes - 1;

        setIsLiked(newIsLiked);
        setLikes(newLikes);

        try {
            await postController.toggleLikePost(postId, currentUser.uid, newIsLiked);
        } catch (error) {
            console.error("Error toggling like:", error);
            // Revert on error
            setIsLiked(!newIsLiked);
            setLikes(likes);
        }
    };

    const handleSave = async () => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
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

    const handleReplySubmit = async (e) => {
        // e is optional now since we might call it from button click
        if (e && e.key && e.key !== 'Enter') return;

        if (replyContent.trim() || replyAttachment) {
            if (!currentUser) {
                alert("Please login to reply.");
                return;
            }

            try {
                // Fetch user profile to get the correct username
                let profile = await userController.getUserProfile(currentUser.uid);

                // If profile doesn't exist (edge case), create one with random name
                if (!profile) {
                    profile = await userController.createUserProfile(currentUser.uid, {});
                }

                const authorName = profile.username;

                let attachmentUrl = null;
                if (replyAttachment) {
                    if (typeof replyAttachment === 'object') {
                        // It's a file, upload it
                        attachmentUrl = await postController.uploadImage(replyAttachment);
                    } else if (typeof replyAttachment === 'string') {
                        // It's a URL string
                        attachmentUrl = replyAttachment.trim();
                    }
                }

                const attachments = attachmentUrl ? [{ url: attachmentUrl, type: 'image' }] : [];

                const replyData = {
                    author: authorName,
                    uid: currentUser.uid,
                    content: replyContent,
                    replyTo: replyingTo ? replyingTo.author : null,
                    attachments
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
                setReplyAttachment('');
                setReplyingTo(null);
            } catch (error) {
                console.error("Error adding reply:", error);
                alert("Failed to add reply.");
            }
        }
    };

    const handleReplyClick = (reply) => {
        setReplyingTo(reply);
        if (replyInputRef.current) {
            replyInputRef.current.focus();
        }
    };

    const handleReportClick = () => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }
        setIsReportModalOpen(true);
    };

    const handleReportSubmit = async (reason) => {
        if (post && currentUser) {
            try {
                await reportController.createReport(post.id, reason, currentUser.uid, 'post');
                setIsReportSuccessModalOpen(true);
            } catch (error) {
                console.error("Failed to submit report:", error);
                alert("Failed to submit report. Please try again.");
            }
            setIsReportModalOpen(false);
        }
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
                            <button
                                className={`stat-item action-btn ${isSaved ? 'saved' : ''}`}
                                onClick={handleSave}
                                title={isSaved ? "Unsave Post" : "Save Post"}
                            >
                                <i className={`fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`}></i> {isSaved ? 'Saved' : 'Save'}
                            </button>
                            <button className="stat-item action-btn report-btn" onClick={handleReportClick}>
                                <i className="fa-regular fa-flag"></i> Report
                            </button>
                        </div>

                        <div className="reply-input-section">
                            <ForumReplyInput
                                currentUser={currentUser}
                                replyingTo={replyingTo}
                                replyContent={replyContent}
                                replyAttachment={replyAttachment}
                                inputRef={replyInputRef}
                                onCancelReplyTo={() => setReplyingTo(null)}
                                onChange={(e) => setReplyContent(e.target.value)}
                                onAttachmentChange={(value) => setReplyAttachment(value)}
                                onEmojiAdd={(emoji) => setReplyContent(prev => `${prev}${emoji}`)}
                                onSubmit={() => handleReplySubmit()}
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
                                        {reply.replyTo && (
                                            <>
                                                <span className="reply-arrow">▸</span>
                                                <span className="reply-target">{reply.replyTo}</span>
                                            </>
                                        )}
                                        <span>•</span>
                                        <span className="reply-time">{reply.timeAgo || 'Recently'}</span>
                                    </div>
                                </div>
                                <p className="reply-content">{reply.content}</p>
                                {reply.attachments && reply.attachments.length > 0 && reply.attachments[0].url && (
                                    <div className="reply-attachments" style={{ marginTop: '0.5rem' }}>
                                        <a href={reply.attachments[0].url} target="_blank" rel="noreferrer">
                                            <img
                                                src={reply.attachments[0].url}
                                                alt="Attachment"
                                                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                                            />
                                        </a>
                                    </div>
                                )}
                                <div className="reply-actions">
                                    <button className="reply-action-btn">
                                        <i className="fa-regular fa-heart"></i> {reply.likes || 0}
                                    </button>
                                    <button className="reply-action-btn" onClick={() => handleReplyClick(reply)}>
                                        <i className="fa-solid fa-reply"></i> Reply
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onSubmit={handleReportSubmit}
            />

            <ReportSuccessModal
                isOpen={isReportSuccessModalOpen}
                onClose={() => setIsReportSuccessModalOpen(false)}
            />

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />

            <GuestRestrictionModal
                isOpen={isGuestRestrictionModalOpen}
                onClose={() => setIsGuestRestrictionModalOpen(false)}
                onLogin={() => setIsLoginModalOpen(true)}
                title="Guest Restriction"
                message="Guests cannot save posts."
                subMessage="To save posts to your profile, please log in to a permanent account."
                actionLabel="Login to Save"
                icon="fa-bookmark"
            />
        </div>
    );
};

export default ForumPost;
