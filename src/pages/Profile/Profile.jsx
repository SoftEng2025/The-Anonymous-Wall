import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../backend/api/avatar';
import { userController } from '../../backend/controllers/userController';
import { postController } from '../../backend/controllers/postController';
import { replyController } from '../../backend/controllers/replyController';
import { useNavigate, useParams } from 'react-router-dom';
import { getBoardById, getBoardColor, getBoardName } from '../../data/boardConfig';
import BoardBadge from '../../components/BoardBadge';
import ForumPostModal from '../../components/ForumPostModal';
import LogoutModal from '../../components/LogoutModal';
import LoginModal from '../../components/LoginModal';
import './Profile.css';

function Profile() {
    const { currentUser, logout, refreshProfile, userProfile } = useAuth();
    const navigate = useNavigate();
    const { userId } = useParams();
    const isPublicView = userId && (!currentUser || currentUser.uid !== userId);
    const [publicProfile, setPublicProfile] = useState(null);
    const [username, setUsername] = useState('');
    const [tempUsername, setTempUsername] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('my-posts'); // 'my-posts', 'Saved-posts', or 'Pinned'
    const [savedPosts, setSavedPosts] = useState([]);
    const [pinnedPosts, setPinnedPosts] = useState([]);
    const [historyPosts, setHistoryPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [regenerating, setRegenerating] = useState(false);
    const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        if (isPublicView) {
            setLoading(true);
            userController.getUserProfile(userId).then(profile => {
                setPublicProfile(profile);
                if (profile) {
                    setUsername(profile.username || '');
                    setIsAdmin(profile.role === 'admin');
                }
                setLoading(false);
            }).catch(err => {
                console.error("Error fetching public profile:", err);
                setLoading(false);
            });
        } else if (userProfile) {
            setUsername(userProfile.username || '');
            setIsAdmin(userProfile.role === 'admin');
            setLoading(false);
        } else if (currentUser === null) {
            // No logged-in user, so stop loading.
            setLoading(false);
        }
        // If currentUser exists but userProfile is null, we wait for AuthContext.
        // We do NOT depend on 'loading' here to avoid loops.
    }, [currentUser, userProfile, isPublicView, userId]);

    // Fetch posts based on active tab
    useEffect(() => {
        const fetchPosts = async () => {
            if (!isPublicView && !currentUser) return;

            setLoadingPosts(true);
            try {
                if (activeTab === 'my-posts') {
                    const targetUid = isPublicView ? userId : currentUser.uid;
                    const posts = await postController.getPostsByUserId(targetUid);
                    setHistoryPosts(posts);
                } else if (activeTab === 'saved-posts') {
                    if (isPublicView) {
                        // In public view, "Pinned" tab shows PINNED posts
                        if (publicProfile && publicProfile.pinnedPosts && publicProfile.pinnedPosts.length > 0) {
                            const posts = await postController.getPostsByIds(publicProfile.pinnedPosts);
                            // Sort by latest pinned
                            const sortedPosts = posts.sort((a, b) => {
                                const indexA = publicProfile.pinnedPosts.indexOf(a.id);
                                const indexB = publicProfile.pinnedPosts.indexOf(b.id);
                                return indexB - indexA;
                            });
                            setPinnedPosts(sortedPosts);
                        } else {
                            setPinnedPosts([]);
                        }
                    } else {
                        // In private view, "Saved Posts" tab shows SAVED posts
                        if (userProfile && userProfile.savedPosts && userProfile.savedPosts.length > 0) {
                            const posts = await postController.getPostsByIds(userProfile.savedPosts);
                            setSavedPosts(posts);
                        } else {
                            setSavedPosts([]);
                        }
                    }
                } else if (activeTab === 'pinned-posts' && !isPublicView) {
                    // Owner's "Pinned" tab (Pinned Posts)
                    if (userProfile && userProfile.pinnedPosts && userProfile.pinnedPosts.length > 0) {
                        const posts = await postController.getPostsByIds(userProfile.pinnedPosts);
                        // Sort by latest pinned (reverse order of pinnedPosts array)
                        // pinnedPosts is [oldest, ..., newest]
                        // We want [newest, ..., oldest]
                        const sortedPosts = posts.sort((a, b) => {
                            const indexA = userProfile.pinnedPosts.indexOf(a.id);
                            const indexB = userProfile.pinnedPosts.indexOf(b.id);
                            return indexB - indexA;
                        });
                        setPinnedPosts(sortedPosts);
                    } else {
                        setPinnedPosts([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                setMessage({ type: 'error', text: 'Failed to load posts.' });
            } finally {
                setLoadingPosts(false);
            }
        };

        if (!loading) {
            fetchPosts();
        }
    }, [currentUser, activeTab, loading, userProfile, isPublicView, userId, publicProfile]);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            // 1. Update User Profile
            await userController.updateUserProfile(currentUser.uid, {
                username: tempUsername
            });

            // 2. Retroactive Update: Update all past posts and replies
            await Promise.all([
                postController.updatePostsAuthor(currentUser.uid, tempUsername),
                replyController.updateRepliesAuthor(currentUser.uid, tempUsername)
            ]);

            setUsername(tempUsername);
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error("Error saving profile:", error);
            if (error.message && error.message.includes('index')) {
                setMessage({
                    type: 'error',
                    text: 'Database setup incomplete. Please check the browser console and click the link to create the required index.'
                });
            } else {
                setMessage({ type: 'error', text: 'Failed to save changes.' });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEditClick = () => {
        setTempUsername(username);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setTempUsername('');
        setIsEditing(false);
    };

    const handleRegenerateIdentity = async () => {
        setRegenerating(true);
        try {
            const newSeed = Math.random().toString(36).substring(7);

            // 1. Update User Profile
            await userController.updateUserProfile(currentUser.uid, { avatarSeed: newSeed });

            // 2. Retroactive Update: Update all past posts and replies
            await Promise.all([
                postController.updatePostsAvatar(currentUser.uid, newSeed),
                replyController.updateRepliesAvatar(currentUser.uid, newSeed)
            ]);

            // Refresh global profile to update header and this page
            await refreshProfile();

            setMessage({ type: 'success', text: 'Identity regenerated successfully!' });
        } catch (error) {
            console.error("Error regenerating identity:", error);
            setMessage({ type: 'error', text: 'Failed to regenerate identity.' });
        } finally {
            setRegenerating(false);
        }
    };

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = async () => {
        try {
            if (currentUser?.isAnonymous) {
                // Rename guest to "Deleted User" before logout
                await userController.updateUserProfile(currentUser.uid, {
                    username: 'Deleted User',
                    isDeleted: true,
                    avatarSeed: 'deleted' // Optional: set a specific avatar for deleted users
                });

                // Propagate name change to posts and replies
                await Promise.all([
                    postController.updatePostsAuthor(currentUser.uid, 'Deleted User'),
                    replyController.updateRepliesAuthor(currentUser.uid, 'Deleted User')
                ]);
            }

            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return 'Unknown';
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const handleTogglePin = async (e, postId) => {
        e.stopPropagation();
        if (!currentUser) return;

        const isPinned = (userProfile.pinnedPosts || []).includes(postId);
        const newIsPinned = !isPinned;

        try {
            await userController.togglePinPost(currentUser.uid, postId, newIsPinned);
            await refreshProfile(); 
            
            
        } catch (error) {
            console.error("Error toggling pin:", error);
            setMessage({ type: 'error', text: 'Failed to update pin status.' });
        }
    };

    if (loading) {
        return <div className="profile-container">Loading...</div>;
    }

    // Helper to render post list
    const renderPostList = (posts) => {
        if (loadingPosts) {
            return <div className="loading-posts">Loading posts...</div>;
        }
        if (posts.length === 0) {
            return <div className="no-posts">No posts found.</div>;
        }
        return posts.map(post => {
            const isPinned = !isPublicView && userProfile?.pinnedPosts?.includes(post.id);
            
            return (
                <div
                    key={post.id}
                    className="history-post-card"
                    onClick={() => setSelectedPostId(post.id)}
                >
                    <div className="history-post-header">
                        <div className="history-post-info">
                            <span className="history-time">{formatTimeAgo(post.timestamp)}</span>
                        </div>
                        <div className="history-header-right">

                            {post.board && (
                                <div className="history-post-board">
                                    <BoardBadge board={getBoardById(post.board)} />
                                </div>
                            )}
                        </div>
                    </div>
                    <h3 className="history-post-title">{post.title}</h3>
                    <p className="history-post-content">{post.content}</p>
                    <div className="history-post-stats">
                        <span><i className="fa-regular fa-heart"></i> {post.likes || 0}</span>
                        <span><i className="fa-regular fa-comment"></i> {post.comments || 0}</span>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="profile-page-container">
            <div className="profile-sidebar">
                <div className="profile-card">
                    <div className="profile-avatar-container">
                        <img
                            src={getAvatarUrl((isPublicView ? publicProfile?.avatarSeed : userProfile?.avatarSeed) || (isPublicView ? userId : currentUser?.uid))}
                            alt="Profile"
                            className="profile-avatar-large"
                        />
                        {!isPublicView && (
                            <button
                                className="regenerate-btn"
                                onClick={handleRegenerateIdentity}
                                disabled={regenerating}
                                title="Regenerate Identity"
                            >
                                <i className={`fa-solid fa-arrows-rotate ${regenerating ? 'fa-spin' : ''}`}></i>
                            </button>
                        )}
                    </div>

                    <div className="profile-info">
                        {isEditing ? (
                            <div className="edit-username-container">
                                <input
                                    type="text"
                                    className="username-input"
                                    value={tempUsername}
                                    onChange={(e) => setTempUsername(e.target.value)}
                                    placeholder="Enter new username"
                                />
                                <div className="edit-buttons-row">
                                    <button className="cancel-button-small" onClick={handleCancelEdit}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <button className="save-button-small" onClick={handleSave} disabled={saving}>
                                        <i className="fa-solid fa-check"></i>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="username-display-container">
                                <h2 className="profile-username">{username}</h2>
                                {!isPublicView && (
                                    <button className="edit-icon-btn" onClick={handleEditClick}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                )}
                            </div>
                        )}
                        {!isPublicView && (
                            <p className="profile-handle">@{currentUser?.email?.split('@')[0] || 'anonymous'}</p>
                        )}
                        {!isPublicView && isAdmin && <span className="admin-badge">ADMIN</span>}
                    </div>

                    <div className="profile-stats-summary">
                        <div className="stat-pill">
                            <span className="stat-value">{historyPosts.length}</span>
                            <span className="stat-label">Posts</span>
                        </div>
                        <div className="stat-pill">
                            <span className="stat-value">{isPublicView ? (publicProfile?.pinnedPosts?.length || 0) : (userProfile?.savedPosts?.length || 0)}</span>
                            <span className="stat-label">{isPublicView ? "Pinned" : "Saved"}</span>
                        </div>
                        {!isPublicView && (
                            <div className="stat-pill">
                                <span className="stat-value">{userProfile?.pinnedPosts?.length || 0}</span>
                                <span className="stat-label">Pinned</span>
                            </div>
                        )}
                    </div>

                    {!isPublicView && (
                        <button className="logout-button-full" onClick={handleLogoutClick}>
                            <i className="fa-solid fa-right-from-bracket"></i> Logout
                        </button>
                    )}
                </div>
            </div>

            <div className="profile-main-content">
                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'my-posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my-posts')}
                    >
                        {isPublicView ? "User's Posts" : "My Posts"}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'saved-posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('saved-posts')}
                    >
                        {isPublicView ? "Pinned" : "Saved Posts"}
                    </button>
                    {!isPublicView && (
                        <button
                            className={`tab-btn ${activeTab === 'pinned-posts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('pinned-posts')}
                        >
                            Pinned
                        </button>
                    )}
                </div>

                <div className="profile-content-area">
                    {!isPublicView && currentUser?.isAnonymous ? (
                        <div className="guest-restriction-container">
                            <div className="guest-restriction-card">
                                <div className="guest-restriction-icon">
                                    <i className={`fa-solid ${activeTab === 'my-posts' ? 'fa-pen-to-square' : 'fa-bookmark'}`}></i>
                                </div>
                                <h3>{activeTab === 'my-posts' ? 'Posting Restricted' : 'Saving Restricted'}</h3>
                                <p>
                                    {activeTab === 'my-posts'
                                        ? "Guest accounts cannot create posts. Create a permanent account to start sharing your thoughts!"
                                        : "Guest accounts cannot save posts. Create a permanent account to build your personal collection!"}
                                </p>
                                <button className="btn-login-profile" onClick={() => setIsLoginModalOpen(true)}>
                                    Login or Sign Up
                                </button>
                            </div>
                        </div>
                    ) : (
                        activeTab === 'my-posts' ? (
                            <div className="posts-grid">
                                {renderPostList(historyPosts)}
                            </div>
                        ) : activeTab === 'saved-posts' ? (
                            <div className="posts-grid">
                                {renderPostList(isPublicView ? pinnedPosts : savedPosts)}
                            </div>
                        ) : (
                            <div className="posts-grid">
                                {renderPostList(pinnedPosts)}
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* ForumPostModal */}
            {selectedPostId && (
                <ForumPostModal
                    postId={selectedPostId}
                    onClose={() => setSelectedPostId(null)}
                />
            )}

            {/* Logout Confirmation Modal */}
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
                isGuest={currentUser?.isAnonymous}
            />

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </div>
    );
}

export default Profile;
