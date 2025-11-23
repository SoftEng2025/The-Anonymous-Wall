import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarUrl } from '../backend/api/avatar';
import { postController } from '../backend/controllers/postController';
import { userController } from '../backend/controllers/userController';
import { MOCK_POSTS } from '../data/mockForumData';
import { BOARDS, getBoardById, getBoardColor, getBoardName } from '../data/boardConfig';
import LoginModal from '../components/LoginModal';
import BoardBadge from '../components/BoardBadge';
import './Forum.css';

const Forum = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    // Board and Filter State
    const [selectedBoard, setSelectedBoard] = useState(null); // null = all boards
    const [filterType, setFilterType] = useState('latest'); // latest, likes, comments
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    // Form State
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostBoard, setNewPostBoard] = useState(''); // Selected board for new post
    const [error, setError] = useState('');

    // Fetch Posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const fetchedPosts = await postController.getAllPosts();
                // Use mock data if Firebase is empty
                if (fetchedPosts.length === 0) {
                    console.log("Using mock data - Firebase is empty");
                    setPosts(MOCK_POSTS);
                    setFilteredPosts(MOCK_POSTS);
                } else {
                    setPosts(fetchedPosts);
                    setFilteredPosts(fetchedPosts);
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                // Use mock data on error
                console.log("Using mock data due to error");
                setPosts(MOCK_POSTS);
                setFilteredPosts(MOCK_POSTS);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Fetch user profile to get username
    useEffect(() => {
        const fetchUsername = async () => {
            if (currentUser) {
                try {
                    const profile = await userController.getUserProfile(currentUser.uid);
                    if (profile && profile.username) {
                        setUsername(profile.username);
                    } else {
                        // Create profile if it doesn't exist
                        const newProfile = await userController.createUserProfile(currentUser.uid, {});
                        setUsername(newProfile.username);
                    }
                } catch (error) {
                    console.error("Error fetching username:", error);
                    setUsername('Anonymous');
                }
            }
        };

        fetchUsername();
    }, [currentUser]);

    // Filter Logic
    useEffect(() => {
        let result = [...posts];

        // Filter by Board
        if (selectedBoard) {
            result = result.filter(post => post.board === selectedBoard);
        }

        // Sort by Filter Type
        switch (filterType) {
            case 'likes':
                result.sort((a, b) => b.likes - a.likes);
                break;
            case 'comments':
                result.sort((a, b) => b.comments - a.comments);
                break;
            case 'latest':
            default:
                result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                break;
        }

        setFilteredPosts(result);
    }, [posts, selectedBoard, filterType]);

    const handleCreatePostClick = () => {
        if (currentUser) {
            setIsCreatePostOpen(true);
        } else {
            setIsLoginModalOpen(true);
        }
    };

    // Tag handlers removed - using boards now

    const handlePostSubmit = async () => {
        setError('');
        if (!newPostTitle.trim() || !newPostContent.trim()) {
            setError("Please fill in both title and content before posting.");
            return;
        }

        if (!newPostBoard) {
            setError("Please select a board for your post.");
            return;
        }

        if (!currentUser) {
            setError("You must be logged in to create a post.");
            return;
        }

        try {
            const newPostData = {
                author: username || 'Anonymous',
                uid: currentUser.uid,
                title: newPostTitle,
                content: newPostContent,
                board: newPostBoard
            };

            const newPostId = await postController.createPost(newPostData);

            // Optimistic update or refetch
            const createdPost = {
                id: newPostId,
                ...newPostData,
                likes: 0,
                comments: 0,
                timeAgo: 'Just now',
                avatarSeed: currentUser.uid,
                timestamp: Date.now()
            };

            setPosts([createdPost, ...posts]);

            // Reset Form
            setNewPostTitle('');
            setNewPostContent('');
            setNewPostBoard('');
            setError('');
            setIsCreatePostOpen(false);
        } catch (error) {
            console.error("Failed to create post:", error);
            setError("Failed to create post. Please try again.");
        }
    };

    return (
        <div className="forum-page">
            {/* Board Navigation */}
            <div className="board-navigation">
                <button
                    className={`board-tab ${selectedBoard === null ? 'active' : ''}`}
                    onClick={() => setSelectedBoard(null)}
                >
                    <i className="fa-solid fa-border-all"></i>
                    All Boards
                </button>
                {BOARDS.map(board => (
                    <button
                        key={board.id}
                        className={`board-tab ${selectedBoard === board.id ? 'active' : ''}`}
                        onClick={() => setSelectedBoard(board.id)}
                        style={{ '--board-color': board.color }}
                    >
                        <i className={`fa-solid ${board.icon}`}></i>
                        {board.name}
                    </button>
                ))}
            </div>

            <div className="forum-controls">
                <div className="filter-container">
                    <button
                        className={`filter-btn ${isFilterMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    >
                        <i className="fa-solid fa-sliders"></i>
                        Sort
                    </button>

                    {isFilterMenuOpen && (
                        <div className="filter-menu">
                            <button
                                className={`filter-option ${filterType === 'latest' ? 'active' : ''}`}
                                onClick={() => { setFilterType('latest'); setIsFilterMenuOpen(false); }}
                            >
                                <i className="fa-regular fa-clock"></i> Latest
                            </button>
                            <button
                                className={`filter-option ${filterType === 'likes' ? 'active' : ''}`}
                                onClick={() => { setFilterType('likes'); setIsFilterMenuOpen(false); }}
                            >
                                <i className="fa-regular fa-heart"></i> Most Liked
                            </button>
                            <button
                                className={`filter-option ${filterType === 'comments' ? 'active' : ''}`}
                                onClick={() => { setFilterType('comments'); setIsFilterMenuOpen(false); }}
                            >
                                <i className="fa-regular fa-comment"></i> Most Discussed
                            </button>
                        </div>
                    )}
                </div >
                <button className="create-post-btn" onClick={handleCreatePostClick}>
                    <i className="fa-solid fa-plus"></i> Create Post
                </button>
            </div >

            <div className="posts-feed">
                {filteredPosts.map(post => (
                    <div
                        key={post.id}
                        className="post-card clickable"
                        onClick={() => navigate(`/forum/${post.id}`)}
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
                            <button className="action-btn" onClick={(e) => e.stopPropagation()}>
                                <i className="fa-regular fa-heart"></i> {post.likes}
                            </button>
                            <button className="action-btn" onClick={(e) => e.stopPropagation()}>
                                <i className="fa-regular fa-comment"></i> {post.comments}
                            </button>
                        </div>
                    </div>
                ))}
                {filteredPosts.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '2rem' }}>
                        No posts found matching your criteria.
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            {
                isCreatePostOpen && (
                    <div className="modal-overlay" onClick={() => setIsCreatePostOpen(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Create post</h2>
                            </div>
                            <div className="modal-body">
                                {error && <div className="error-message">{error}</div>}
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className="modal-input"
                                    value={newPostTitle}
                                    onChange={e => setNewPostTitle(e.target.value)}
                                />

                                <div className="board-selector">
                                    <label className="board-label">Select Board *</label>
                                    <div className="board-options">
                                        {BOARDS.map(board => (
                                            <button
                                                key={board.id}
                                                type="button"
                                                className={`board-option ${newPostBoard === board.id ? 'selected' : ''}`}
                                                onClick={() => setNewPostBoard(board.id)}
                                                style={{ '--board-color': board.color }}
                                            >
                                                <i className={`fa-solid ${board.icon}`}></i>
                                                <span>{board.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <textarea
                                    placeholder="Share your message here"
                                    className="modal-textarea"
                                    value={newPostContent}
                                    onChange={e => setNewPostContent(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-cancel" onClick={() => setIsCreatePostOpen(false)}>
                                    Cancel <i className="fa-solid fa-circle-xmark"></i>
                                </button>
                                <button className="btn-post" onClick={handlePostSubmit}>
                                    Post <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLoginSuccess={() => setIsCreatePostOpen(true)}
            />
        </div >
    );
};

export default Forum;
