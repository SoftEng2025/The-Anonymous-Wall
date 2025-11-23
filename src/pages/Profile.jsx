import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarUrl } from '../backend/api/avatar';
import { userController } from '../backend/controllers/userController';
import { postController } from '../backend/controllers/postController';
import { replyController } from '../backend/controllers/replyController';
import { useNavigate } from 'react-router-dom';
import { getBoardById, getBoardColor, getBoardName } from '../data/boardConfig';
import BoardBadge from '../components/BoardBadge';
import './Profile.css';

function Profile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [historyPosts, setHistoryPosts] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (currentUser) {
                try {
                    const profile = await userController.getUserProfile(currentUser.uid);
                    if (profile) {
                        setUsername(profile.username || '');
                    } else {
                        // Initialize profile if it doesn't exist
                        // userController will generate a random name
                        const newProfile = await userController.createUserProfile(currentUser.uid, {});
                        setUsername(newProfile.username);
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    setMessage({ type: 'error', text: 'Failed to load profile.' });
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProfile();
    }, [currentUser]);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            // 1. Update User Profile
            await userController.updateUserProfile(currentUser.uid, {
                username: username
            });

            // 2. Retroactive Update: Update all past posts and replies
            await Promise.all([
                postController.updatePostsAuthor(currentUser.uid, username),
                replyController.updateRepliesAuthor(currentUser.uid, username)
            ]);

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

    const handleViewHistory = async () => {
        if (!showHistory) {
            // Fetch history when opening
            setLoadingHistory(true);
            try {
                const posts = await postController.getPostsByUserId(currentUser.uid);
                setHistoryPosts(posts);
            } catch (error) {
                console.error("Error fetching post history:", error);
                setMessage({ type: 'error', text: 'Failed to load post history.' });
            } finally {
                setLoadingHistory(false);
            }
        }
        setShowHistory(!showHistory);
    };

    const handleLogout = async () => {
        try {
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

    if (loading) {
        return <div className="profile-container">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img
                    src={getAvatarUrl(currentUser?.uid)}
                    alt="Profile"
                    className="profile-avatar"
                />
                <h1 className="profile-title">Profile Settings</h1>
                <p className="user-email">{currentUser?.email}</p>
            </div>

            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="profile-section">
                <h2 className="section-title">Identity Settings</h2>

                <div className="form-group">
                    <label>Username</label>
                    <p className="help-text" style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem' }}>
                        This is your public identity on the forum. You can change it at any time.
                    </p>
                    <input
                        type="text"
                        className="form-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>

                <button
                    className="save-button"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="profile-section">
                <h2 className="section-title">Post History</h2>
                <button
                    className="save-button"
                    onClick={handleViewHistory}
                    disabled={loadingHistory}
                >
                    {loadingHistory ? 'Loading...' : showHistory ? 'Hide History' : 'View History'}
                </button>

                {showHistory && (
                    <div className="history-posts">
                        {historyPosts.length === 0 ? (
                            <p className="no-posts">You haven't created any posts yet.</p>
                        ) : (
                            historyPosts.map(post => (
                                <div
                                    key={post.id}
                                    className="history-post-card"
                                    onClick={() => navigate(`/forum/${post.id}`)}
                                >
                                    <div className="history-post-header">
                                        <div className="history-post-info">
                                            <span className="history-time">{formatTimeAgo(post.timestamp)}</span>
                                        </div>
                                        {post.board && (
                                            <div className="history-post-board">
                                                <BoardBadge board={getBoardById(post.board)} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="history-post-title">{post.title}</h3>
                                    <p className="history-post-content">{post.content}</p>
                                    <div className="history-post-stats">
                                        <span><i className="fa-regular fa-heart"></i> {post.likes || 0}</span>
                                        <span><i className="fa-regular fa-comment"></i> {post.comments || 0}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <div className="logout-section">
                <button className="logout-button-large" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div >
    );
}

export default Profile;
