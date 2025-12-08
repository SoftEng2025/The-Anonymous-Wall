import React, { useState } from 'react';
import { getAvatarUrl } from '../../../backend/api/avatar';

const ForumReplyInput = ({
    currentUser,
    replyingTo,
    replyContent,
    replyAttachment,
    inputRef,
    onCancelReplyTo,
    onChange,
    onSubmit,
    onAttachmentChange,
    onEmojiAdd
}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachmentInput, setShowAttachmentInput] = useState(false);
    // Basic emoji palette
    const emojis = ['❤️', '😍', '😔', '😢', '😠'];

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
                    placeholder={currentUser ? (replyingTo ? `Reply to ${replyingTo.author}...` : "Write a reply") : "Login to reply"}
                    value={replyContent}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSubmit();
                        }
                    }}
                    disabled={!currentUser}
                />
                <div className="modal-input-toolbar">
                    <button
                        type="button"
                        className="modal-toolbar-btn"
                        onClick={() => setShowEmojiPicker(prev => !prev)}
                        disabled={!currentUser}
                        title="Add emoji"
                    >
                        <i className="fa-regular fa-face-smile"></i>
                    </button>

                    <button
                        type="button"
                        className={`modal-toolbar-btn ${showAttachmentInput ? 'active' : ''}`}
                        onClick={() => setShowAttachmentInput(prev => !prev)}
                        disabled={!currentUser}
                        title="Attach image URL"
                    >
                        <i className="fa-solid fa-link"></i>
                    </button>

                    {showAttachmentInput && currentUser && (
                        <input
                            type="text"
                            className="modal-reply-attachment-inline"
                            placeholder="Attachment image URL"
                            value={replyAttachment}
                            onChange={(e) => onAttachmentChange(e.target.value)}
                        />
                    )}

                    <button
                        className="modal-send-btn"
                        onClick={onSubmit}
                        disabled={!currentUser || !replyContent.trim()}
                        title="Send reply"
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>

                    {showEmojiPicker && currentUser && (
                        <div className="modal-emoji-picker">
                            {emojis.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    className="modal-emoji-btn"
                                    onClick={() => {
                                        onEmojiAdd(emoji);
                                        setShowEmojiPicker(false);
                                    }}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForumReplyInput;
