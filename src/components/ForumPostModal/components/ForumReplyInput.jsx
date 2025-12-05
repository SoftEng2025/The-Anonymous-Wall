import React from 'react';
import { getAvatarUrl } from '../../../backend/api/avatar';

const ForumReplyInput = ({
    currentUser,
    replyingTo,
    replyContent,
    inputRef,
    onCancelReplyTo,
    onChange,
    onSubmit
}) => {
    return (
        <div className="modal-reply-input-section">
            <img
                src={currentUser ? getAvatarUrl(currentUser.uid) : getAvatarUrl(null)}
                alt="Your avatar"
                className="modal-input-avatar"
            />
            <div className="modal-input-wrapper">
                {replyingTo && (
                    <div className="modal-replying-indicator">
                        <span>Replying to <strong>{replyingTo.author}</strong></span>
                        <button onClick={onCancelReplyTo}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="text"
                    className="modal-reply-input"
                    placeholder={currentUser ? (replyingTo ? `Reply to ${replyingTo.author}...` : "Add a reply") : "Login to reply"}
                    value={replyContent}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSubmit();
                        }
                    }}
                    disabled={!currentUser}
                />
            </div>
            <button
                className="modal-send-btn"
                onClick={onSubmit}
                disabled={!currentUser || !replyContent.trim()}
            >
                <i className="fa-solid fa-paper-plane"></i>
            </button>
        </div>
    );
};

export default ForumReplyInput;
