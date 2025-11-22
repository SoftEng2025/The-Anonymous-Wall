import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarUrl } from '../backend/api/avatar';
import { postController } from '../backend/controllers/postController';
import { MOCK_POSTS, TAG_COLORS, getTagColor } from '../data/mockForumData';
import './Forum.css';

const Forum = () => {
    const { currentUser, login } = useAuth();
    const navigate = useNavigate();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('latest'); // latest, likes, comments
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    // Form State
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostTags, setNewPostTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

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

    // Filter Logic
    useEffect(() => {
        let result = [...posts];

        // Filter by Search (Tags)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(post =>
                post.tags && post.tags.some(tag => tag.toLowerCase().includes(query))
            );
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
    }, [posts, searchQuery, filterType]);

    const handleCreatePostClick = () => {
        if (currentUser) {
            setIsCreatePostOpen(true);
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const handleLoginContinue = async () => {
        try {
            await login();
            setIsLoginModalOpen(false);
            setIsCreatePostOpen(true);
        } catch (error) {
            console.error("Failed to login", error);
        }
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = tagInput.trim();
            if (!value) return;

            let tag = value;
            if (!tag.startsWith('#')) {
                tag = '#' + tag;
            }

            if (!newPostTags.includes(tag)) {
                setNewPostTags([...newPostTags, tag]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setNewPostTags(newPostTags.filter(tag => tag !== tagToRemove));
    };

    const handlePostSubmit = async () => {
        if (!newPostTitle.trim() || !newPostContent.trim()) {
            alert("Please fill in both title and content before posting.");
            return;
        }

        if (!currentUser) {
            alert("You must be logged in to create a post.");
            return;
        }

        try {
            const newPostData = {
                author: currentUser.displayName || 'Anonymous',
                uid: currentUser.uid,
                title: newPostTitle,
                content: newPostContent,
                tags: newPostTags
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
            setNewPostTags([]);
            setTagInput(' ');
            setIsCreatePostOpen(false);
        } catch (error) {
            console.error("Failed to create post:", error);
            alert("Failed to create post. Please try again.");
        }
    };

    return (
        <div className="forum-page">
            <div className="forum-controls">
                <div className="search-container">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input
                        type="text"
                        placeholder="Search by tags"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className={`filter-btn ${isFilterMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    >
                        <i className="fa-solid fa-sliders"></i>
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
                </div>
                <button className="create-post-btn" onClick={handleCreatePostClick}>
                    <i className="fa-solid fa-plus"></i> Create Post
                </button>
            </div>

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
                                {post.tags && post.tags.length > 0 && (
                                    <div className="post-tags">
                                        {post.tags.map(tag => (
                                            <span key={tag} className={`tag-pill ${getTagColor(tag)}`}>
                                                {tag}
                                            </span>
                                        ))}
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
            {isCreatePostOpen && (
                <div className="modal-overlay" onClick={() => setIsCreatePostOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Create post</h2>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                placeholder="Title"
                                className="modal-input"
                                value={newPostTitle}
                                onChange={e => setNewPostTitle(e.target.value)}
                            />

                            <div className="tags-input-container">
                                {newPostTags.map(tag => (
                                    <span key={tag} className="modal-tag-chip">
                                        {tag}
                                        <button className="remove-tag-btn" onClick={() => removeTag(tag)}>
                                            <i className="fa-solid fa-times"></i>
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder="Tags (Press Enter to add)"
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={handleTagInputKeyDown}
                                />
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
            )}

            {/* Login Modal */}
            {isLoginModalOpen && (
                <div className="modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
                    <div className="modal-content login-modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="login-modal-title">Log In to Continue</h2>
                        <button className="google-login-btn" onClick={handleLoginContinue}>
                            <i className="fa-brands fa-google google-icon"></i>
                            Continue with Google
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Forum;
