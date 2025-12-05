import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../backend/api/avatar';
import { postController } from '../../backend/controllers/postController';
import { userController } from '../../backend/controllers/userController';
import { reportController } from '../../backend/controllers/reportController';
import { BOARDS, getBoardById, getBoardColor, getBoardName } from '../../data/boardConfig';
import { formatTimeAgo } from '../../utils/timeUtils';

// Components
import LoginModal from '../../components/LoginModal';
import ReportModal from '../../components/ReportModal';
import ReportSuccessModal from '../../components/ReportSuccessModal/ReportSuccessModal';
import ForumPostModal from '../../components/ForumPostModal';
import GuestRestrictionModal from '../../components/GuestRestrictionModal';
import BoardBadge from '../../components/BoardBadge'; // Used in Grid View
import ForumHeader from './components/ForumHeader';
import ForumFilters from './components/ForumFilters';
import ForumFeed from './components/ForumFeed';

import './Forum.css';

const Forum = () => {
    const { currentUser, userProfile, toggleSave } = useAuth();
    const navigate = useNavigate();

    // UI State
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [isGuestRestrictionModalOpen, setIsGuestRestrictionModalOpen] = useState(false);
    const [guestModalConfig, setGuestModalConfig] = useState({
        title: "Guest Restriction",
        message: "Guests cannot create new discussion threads.",
        subMessage: "To start your own topic, please log in to a permanent account.",
        actionLabel: "Login to Post",
        icon: "fa-user-lock"
    });

    // Data State
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    // Pagination State
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Filter State
    const [selectedBoard, setSelectedBoard] = useState(null); // null = all boards
    const [filterType, setFilterType] = useState('latest'); // latest, likes, comments
    const [boardSearch, setBoardSearch] = useState('');

    // Form State
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostBoard, setNewPostBoard] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Report State
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isReportSuccessModalOpen, setIsReportSuccessModalOpen] = useState(false);
    const [postToReport, setPostToReport] = useState(null);

    // Forum Post Modal State
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [focusCommentInput, setFocusCommentInput] = useState(false);

    // Fetch Username
    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                try {
                    const profile = await userController.getUserProfile(currentUser.uid);
                    if (profile) {
                        setUsername(profile.username || 'Anonymous');
                    } else {
                        const newProfile = await userController.createUserProfile(currentUser.uid, {});
                        setUsername(newProfile.username);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUsername('Anonymous');
                }
            }
        };
        fetchUserData();
    }, [currentUser]);

    // Sync posts with savedPosts from userProfile (Context)
    useEffect(() => {
        if (userProfile && userProfile.savedPosts) {
            setPosts(prevPosts => prevPosts.map(post => ({
                ...post,
                isSavedByCurrentUser: userProfile.savedPosts.map(String).includes(String(post.id))
            })));
        }
    }, [userProfile]);

    // Fetch Posts (Pagination)
    const fetchPosts = async (isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const currentLastDoc = isLoadMore ? lastDoc : null;
            // Pass selectedBoard to filter server-side
            const { posts: newPosts, lastDoc: newLastDoc } = await postController.getPostsPaginated(
                currentLastDoc,
                10,
                selectedBoard
            );

            const processedPosts = newPosts.map(post => ({
                ...post,
                timeAgo: formatTimeAgo(post.timestamp),
                isLikedByCurrentUser: currentUser ? (post.likedBy || []).includes(currentUser.uid) : false,
                isSavedByCurrentUser: userProfile && userProfile.savedPosts
                    ? userProfile.savedPosts.map(String).includes(String(post.id))
                    : false
            }));

            if (isLoadMore) {
                setPosts(prev => [...prev, ...processedPosts]);
            } else {
                setPosts(processedPosts);
            }

            setLastDoc(newLastDoc);
            // If we got fewer posts than requested, we reached the end
            setHasMore(newPosts.length === 10);

        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Reset and fetch when board changes
    useEffect(() => {
        setPosts([]);
        setLastDoc(null);
        setHasMore(true);
        fetchPosts(false);
    }, [selectedBoard]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchPosts(true);
        }
    };

    // Handlers
    const handleCreatePostClick = () => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }

        if (currentUser.isAnonymous) {
            setGuestModalConfig({
                title: "Guest Restriction",
                message: "Guests cannot create new discussion threads.",
                subMessage: "To start your own topic, please log in to a permanent account.",
                actionLabel: "Login to Post",
                icon: "fa-user-lock"
            });
            setIsGuestRestrictionModalOpen(true);
            return;
        }

        if (selectedBoard) {
            setNewPostBoard(selectedBoard);
        }
        setIsCreatePostOpen(true);
    };

    const handleReportClick = (post) => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }
        setPostToReport(post);
        setIsReportModalOpen(true);
    };

    const handleReportSubmit = async (reason) => {
        if (postToReport && currentUser) {
            try {
                await reportController.createReport(postToReport.id, reason, currentUser.uid, 'post');
                setIsReportSuccessModalOpen(true);
            } catch (error) {
                console.error("Failed to submit report:", error);
                alert("Failed to submit report. Please try again.");
            }
            setIsReportModalOpen(false);
            setPostToReport(null);
        }
    };

    const handleLikePost = async (e, post) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }

        const isCurrentlyLiked = post.isLikedByCurrentUser;
        const shouldLike = !isCurrentlyLiked;

        // Optimistic update
        setPosts(prevPosts => prevPosts.map(p => {
            if (p.id === post.id) {
                return {
                    ...p,
                    likes: shouldLike ? p.likes + 1 : p.likes - 1,
                    isLikedByCurrentUser: shouldLike,
                    likedBy: shouldLike
                        ? [...(p.likedBy || []), currentUser.uid]
                        : (p.likedBy || []).filter(id => id !== currentUser.uid)
                };
            }
            return p;
        }));

        try {
            await postController.toggleLikePost(post.id, currentUser.uid, shouldLike);
        } catch (error) {
            console.error("Error liking post:", error);
        }

    };

    const handleSavePost = async (e, post) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }

        if (currentUser.isAnonymous) {
            setGuestModalConfig({
                title: "Guest Restriction",
                message: "Guests cannot save posts.",
                subMessage: "To save posts to your profile, please log in to a permanent account.",
                actionLabel: "Login to Save",
                icon: "fa-bookmark"
            });
            setIsGuestRestrictionModalOpen(true);
            return;
        }

        try {
            await toggleSave(post.id);
        } catch (error) {
            console.error("Error saving post:", error);
        }
    };

    const handleCommentClick = (e, postId) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedPostId(postId);
        setFocusCommentInput(true);
    };

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

        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            const newPostData = {
                author: username || 'Anonymous',
                uid: currentUser.uid,
                title: newPostTitle,
                content: newPostContent,
                board: newPostBoard
            };

            const newPostId = await postController.createPost(newPostData);

            // Add new post to top of list if it matches current board filter
            if (!selectedBoard || selectedBoard === newPostBoard) {
                const createdPost = {
                    id: newPostId,
                    ...newPostData,
                    likes: 0,
                    comments: 0,
                    timeAgo: formatTimeAgo(Date.now()),
                    avatarSeed: currentUser.uid,
                    timestamp: Date.now(),
                    isLikedByCurrentUser: false
                };
                setPosts([createdPost, ...posts]);
            }

            // Reset Form
            setNewPostTitle('');
            setNewPostContent('');
            setNewPostBoard('');
            setError('');
            setIsCreatePostOpen(false);
        } catch (error) {
            console.error("Failed to create post:", error);
            setError(`Failed to create post: ${error.message || "Unknown error"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePostUpdate = (updatedData) => {
        setPosts(prevPosts => prevPosts.map(p => p.id === updatedData.id ? { ...p, ...updatedData } : p));
    };

    // Derived state for sorting (client-side sort of loaded posts)
    const getSortedPosts = () => {
        let sorted = [...posts];
        switch (filterType) {
            case 'likes':
                sorted.sort((a, b) => b.likes - a.likes);
                break;
            case 'comments':
                sorted.sort((a, b) => b.comments - a.comments);
                break;
            case 'latest':
            default:
                sorted.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                break;
        }
        return sorted;
    };

    const displayedPosts = getSortedPosts();

    return (
        <div className="forum-page">
            {selectedBoard === null ? (
                // Board Selection Grid View
                <div className="board-grid-container">
                    <div className="board-grid-header">
                        <h2 className="board-grid-title">All Boards</h2>
                        <div className="board-search">
                            <div className="search-input-wrapper">
                                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Search boards"
                                    value={boardSearch}
                                    onChange={(e) => setBoardSearch(e.target.value)}
                                    aria-label="Search boards"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="boards-grid">
                        {BOARDS.filter(b => b.name.toLowerCase().includes(boardSearch.toLowerCase())).map(board => (
                            <button
                                key={board.id}
                                className="board-card"
                                onClick={() => setSelectedBoard(board.id)}
                                style={{ '--board-color': board.color }}
                                title={board.description}
                            >
                                <div className="board-card-icon">
                                    <i className={`fa-solid ${board.icon}`}></i>
                                </div>
                                <h3 className="board-card-name">{board.name}</h3>
                            </button>
                        ))}
                    </div>

                    {/* Latest posts below boards - filtered by board search */}
                    <div className="latest-posts">
                        <h3 className="latest-posts-title">Latest Posts</h3>
                        <div className="posts-feed">
                            {loading ? (
                                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', padding: '2rem' }}>
                                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
                                    Loading posts...
                                </div>
                            ) : (
                                <>
                                    {
                                        // Filter posts to only those whose board is visible in the board search
                                        (() => {
                                            const visibleBoardIds = BOARDS
                                                .filter(b => b.name.toLowerCase().includes(boardSearch.toLowerCase()))
                                                .map(b => b.id);

                                            const postsToShow = posts
                                                .filter(p => visibleBoardIds.length === 0 || visibleBoardIds.includes(p.board))
                                                .slice(0, 5); // show only 5 most recent posts

                                            return postsToShow.map(post => (
                                                <div
                                                    key={post.id}
                                                    className="post-card clickable"
                                                    onClick={() => setSelectedPostId(post.id)}
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
                                                        <button
                                                            className={`action-btn ${post.isLikedByCurrentUser ? 'liked' : ''}`}
                                                            onClick={(e) => handleLikePost(e, post)}
                                                        >
                                                            <i className={`fa-${post.isLikedByCurrentUser ? 'solid' : 'regular'} fa-heart`}></i> {post.likes}
                                                        </button>
                                                        <button className="action-btn" onClick={(e) => handleCommentClick(e, post.id)}>
                                                            <i className="fa-regular fa-comment"></i> {post.comments}
                                                        </button>
                                                        <button
                                                            className={`action-btn ${post.isSavedByCurrentUser ? 'saved' : ''}`}
                                                            onClick={(e) => handleSavePost(e, post)}
                                                            title={post.isSavedByCurrentUser ? "Unsave" : "Save"}
                                                        >
                                                            <i className={`fa-${post.isSavedByCurrentUser ? 'solid' : 'regular'} fa-bookmark`}></i>
                                                        </button>
                                                        <button className="action-btn report-btn" onClick={(e) => { e.stopPropagation(); handleReportClick(post); }}>
                                                            <i className="fa-regular fa-flag"></i> Report
                                                        </button>
                                                    </div>
                                                </div>
                                            ));
                                        })()
                                    }
                                    {posts.length === 0 && (
                                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '2rem' }}>
                                            No posts found.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                // Posts Feed View
                <>
                    <ForumHeader
                        selectedBoard={selectedBoard}
                        onBackToBoards={() => setSelectedBoard(null)}
                    />

                    <ForumFilters
                        isFilterMenuOpen={isFilterMenuOpen}
                        setIsFilterMenuOpen={setIsFilterMenuOpen}
                        filterType={filterType}
                        setFilterType={setFilterType}
                        onCreatePost={handleCreatePostClick}
                    />

                    <ForumFeed
                        posts={displayedPosts}
                        loading={loading}
                        onLike={handleLikePost}
                        onComment={handleCommentClick}
                        onReport={handleReportClick}
                        onSave={handleSavePost}
                        onPostClick={(id) => setSelectedPostId(id)}
                        hasMore={hasMore}
                        onLoadMore={handleLoadMore}
                        loadingMore={loadingMore}
                    />
                </>
            )}

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

                                {selectedBoard ? (
                                    <div className="board-selector board-fixed">
                                        <label className="board-label">Board</label>
                                        <div className="board-fixed-value" style={{ '--board-color': getBoardColor(selectedBoard) }}>
                                            <i className={`fa-solid ${getBoardById(selectedBoard)?.icon}`}></i>
                                            <span>{getBoardName(selectedBoard)}</span>
                                        </div>
                                    </div>
                                ) : (
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
                                )}

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
                                <button
                                    className="btn-post"
                                    onClick={handlePostSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Posting...' : 'Post'} <i className="fa-solid fa-paper-plane"></i>
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

            {/* Report Modal */}
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onSubmit={handleReportSubmit}
            />

            <ReportSuccessModal
                isOpen={isReportSuccessModalOpen}
                onClose={() => setIsReportSuccessModalOpen(false)}
            />

            {/* Forum Post Modal */}
            {selectedPostId && (
                <ForumPostModal
                    postId={selectedPostId}
                    onClose={() => {
                        setSelectedPostId(null);
                        setFocusCommentInput(false);
                    }}
                    onPostUpdate={handlePostUpdate}
                    focusCommentInput={focusCommentInput}
                />
            )}

            {/* Guest Restriction Modal */}
            <GuestRestrictionModal
                isOpen={isGuestRestrictionModalOpen}
                onClose={() => setIsGuestRestrictionModalOpen(false)}
                onLogin={() => setIsLoginModalOpen(true)}
                title={guestModalConfig.title}
                message={guestModalConfig.message}
                subMessage={guestModalConfig.subMessage}
                actionLabel={guestModalConfig.actionLabel}
                icon={guestModalConfig.icon}
            />
        </div >
    );
};

export default Forum;
