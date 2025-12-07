import React from 'react';
import { getAvatarUrl } from '../../../backend/api/avatar';

const ForumReplyItem = ({
    reply,
    currentUser,
    isAdmin,
    isEditing,
    editContent,
    editError,
    onLike,
    onReply,
    onEditClick,
    onDelete,
    onReport,
    onEditCancel,
    onEditSave,
    setEditContent,
    onUserClick
}) => {
    return (
        <div className="modal-reply-card">
            <img
                src={getAvatarUrl(reply.avatarSeed)}
                alt={reply.author}
                className="modal-reply-avatar clickable-avatar"
                onClick={(e) => onUserClick(e, reply.uid)}
            />
            <div className="modal-reply-content-wrapper">
                <div className="modal-reply-bubble">
                    <div className="modal-reply-header">
                        <div className="comment-header">
                            <div className="comment-header-left">
                                <span 
                                    className="modal-reply-username clickable-username" 
                                    style={{ color: reply.isDeleted ? '#999' : 'inherit' }}
                                    onClick={(e) => !reply.isDeleted && onUserClick(e, reply.uid)}
                                >
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

                    {isEditing ? (
                        <div className="modal-edit-form">
                            <textarea
                                className="modal-edit-textarea"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="Reply Content"
                            />
                            {editError && <div className="modal-error-message">{editError}</div>}
                            <div className="modal-edit-actions">
                                <button className="modal-edit-btn-cancel" onClick={onEditCancel}>Cancel</button>
                                <button className="modal-edit-btn-save" onClick={() => onEditSave(reply.id)}>Save</button>
                            </div>
                        </div>
                    ) : (
                        <p className="modal-reply-text" style={{ fontStyle: reply.isDeleted ? 'italic' : 'normal', color: reply.isDeleted ? '#aaa' : 'inherit' }}>
                            {reply.content}
                        </p>
                    )}
                </div>

                {!isEditing && (
                    <div className="modal-reply-actions">
                        <button
                            className={`modal-reply-action-btn ${reply.isLikedByCurrentUser ? 'liked' : ''}`}
                            onClick={() => onLike(reply.id, reply)}
                        >
                            <i className={`fa-${reply.isLikedByCurrentUser ? 'solid' : 'regular'} fa-heart`}></i>
                            <span>{reply.likes || 0}</span>
                        </button>
                        <button
                            className="modal-reply-action-btn"
                            onClick={() => onReply(reply)}
                        >
                            <i className="fa-solid fa-reply"></i>
                            <span>Reply</span>
                        </button>
                        {currentUser && !currentUser.isAnonymous && reply.uid === currentUser.uid && (
                            <button
                                className="modal-reply-action-btn"
                                onClick={() => onEditClick(reply)}
                            >
                                <i className="fa-solid fa-pen-to-square"></i>
                                <span>Edit</span>
                            </button>
                        )}
                        {isAdmin && !reply.isDeleted && (
                            <button
                                className="modal-reply-action-btn delete-btn"
                                onClick={() => onDelete(reply.id)}
                                title="Delete Comment"
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        )}
                        {!reply.isDeleted && currentUser && currentUser.uid !== reply.uid && (
                            <button
                                className="modal-reply-action-btn report-btn"
                                onClick={() => onReport(reply)}
                                title="Report Comment"
                            >
                                <i className="fa-regular fa-flag"></i>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumReplyItem;
