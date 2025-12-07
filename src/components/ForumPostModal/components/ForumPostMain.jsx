import React from 'react';
import { getAvatarUrl } from '../../../backend/api/avatar';

const ForumPostMain = ({
    post,
    currentUser,
    isLiked,
    likes,
    commentsCount,
    isSaved,
    isEditing,
    editContent,
    editError,
    onEditClick,
    onLike,
    onSave,
    onEditCancel,
    onEditSave,
    setEditContent,
    focusReplyInput,
    onUserClick,
    isPinned,
    onTogglePin
}) => {
    return (
        <div className="modal-main-post">
            <div className="modal-post-header">
                <img
                    src={getAvatarUrl(post.avatarSeed)}
                    alt={post.author}
                    className="modal-user-avatar clickable-avatar"
                    onClick={(e) => onUserClick(e, post.uid)}
                />
                <div className="modal-post-info">
                    <span 
                        className="modal-username clickable-username"
                        onClick={(e) => onUserClick(e, post.uid)}
                    >
                        {post.author}
                    </span>
                    <span className="modal-separator">•</span>
                    <span className="modal-time">
                        {post.timeAgo || 'Recently'}
                        {post.editedAt && <span className="modal-edited-indicator"> (edited)</span>}
                    </span>
                </div>
            </div>

            {isEditing ? (
                <div className="modal-edit-form">
                    <h1 className="modal-post-title">{post.title}</h1>
                    <textarea
                        className="modal-edit-textarea"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Post Content"
                    />
                    {editError && <div className="modal-error-message">{editError}</div>}
                    <div className="modal-edit-actions">
                        <button className="modal-edit-btn-cancel" onClick={onEditCancel}>Cancel</button>
                        <button className="modal-edit-btn-save" onClick={onEditSave}>Save</button>
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="modal-post-title">{post.title}</h1>
                    <p className="modal-post-content">{post.content}</p>

                    <div className="modal-post-stats">
                        <button
                            className={`modal-stat-btn ${isLiked ? 'liked' : ''}`}
                            onClick={onLike}
                            title={isLiked ? "Unlike" : "Like"}
                        >
                            <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
                            <span>{likes}</span>
                        </button>
                        <button
                            className="modal-stat-btn"
                            onClick={focusReplyInput}
                            title="Comment"
                        >
                            <i className="fa-regular fa-comment"></i>
                            <span>{commentsCount}</span>
                        </button>
                        <button
                            className={`modal-stat-btn ${isSaved ? 'saved' : ''}`}
                            onClick={onSave}
                            title={isSaved ? "Unsave" : "Save"}
                        >
                            <i className={`fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`}></i>
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                        {currentUser && !currentUser.isAnonymous && post.uid === currentUser.uid && (
                            <button className="modal-stat-btn" onClick={onEditClick}>
                                <i className="fa-solid fa-pen-to-square"></i>
                                <span>Edit</span>
                            </button>
                        )}
                        {currentUser && !currentUser.isAnonymous && post.uid === currentUser.uid && (
                            <button 
                                className={`modal-stat-btn ${isPinned ? 'pinned' : ''}`} 
                                onClick={onTogglePin}
                                title={isPinned ? "Unpin from Profile" : "Pin to Profile"}
                            >
                                <i className={`fa-solid fa-thumbtack`}></i>
                                <span>{isPinned ? 'Pinned' : 'Pin'}</span>
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ForumPostMain;
