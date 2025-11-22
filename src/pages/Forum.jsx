import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarUrl } from '../api/avatar';
import './Forum.css';

// Mock Data for initial display
const MOCK_POSTS = [
    {
        id: 1,
        author: 'deeZnuxcz',
        avatarSeed: 'deeZnuxcz',
        timeAgo: '2 days ago',
        title: 'I caught my boyfriend kissing another man',
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries ...',
        likes: 110,
        comments: 54,
        tags: ['#cheating', '#gay']
    },
    {
        id: 2,
        author: 'femboienjoyer',
        avatarSeed: 'femboienjoyer',
        timeAgo: '3 days ago',
        title: 'OA lang ba ako or assuming lang talaga',
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries ...',
        likes: 101,
        comments: 34,
        tags: ['#relationship', '#advice']
    },
    {
        id: 3,
        author: 'w_speed',
        avatarSeed: 'w_speed',
        timeAgo: '4 days ago',
        title: 'How do i have the courage to confess to her?',
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries ...',
        likes: 45,
        comments: 12,
        tags: ['#crush', '#confession']
    }
];

const TAG_COLORS = ['green', 'pink', 'blue', 'yellow'];

const Forum = () => {
    const { currentUser, login } = useAuth();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [posts, setPosts] = useState(MOCK_POSTS);
    const [filteredPosts, setFilteredPosts] = useState(MOCK_POSTS);

    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('latest'); // latest, likes, comments
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    // Form State
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostTags, setNewPostTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // Filter Logic
    useEffect(() => {
        let result = [...posts];

        // Filter by Search (Tags)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(post =>
                post.tags.some(tag => tag.toLowerCase().includes(query))
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
                // Assuming MOCK_POSTS are already roughly sorted by date or we'd need real dates
                // For now, we'll just keep them as is or reverse if needed. 
                // Since new posts are added to top, default array order is usually 'latest'
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

    const handlePostSubmit = () => {
        if (!newPostTitle.trim() || !newPostContent.trim()) return;

        const newPost = {
            id: Date.now(),
            author: currentUser.displayName || 'Anonymous',
            avatarSeed: currentUser.uid,
            timeAgo: 'Just now',
            title: newPostTitle,
            content: newPostContent,
            likes: 0,
            comments: 0,
            tags: newPostTags
        };

        setPosts([newPost, ...posts]);

        // Reset Form
        setNewPostTitle('');
        setNewPostContent('');
        setNewPostTags([]);
        setTagInput('');
        setIsCreatePostOpen(false);
    };

    const getTagColor = (tag) => {
        // Simple hash to pick a consistent color
        let hash = 0;
        for (let i = 0; i < tag.length; i++) {
            hash = tag.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % TAG_COLORS.length;
        return TAG_COLORS[index];
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
                    <div key={post.id} className="post-card">
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
                            <button className="action-btn">
                                <i className="fa-regular fa-heart"></i> {post.likes}
                            </button>
                            <button className="action-btn">
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
