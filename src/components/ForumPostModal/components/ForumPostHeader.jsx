import React from 'react';

const ForumPostHeader = ({ authorName, onClose }) => {
    return (
        <div className="modal-header-bar">
            <h2 className="modal-header-title">{authorName}'s Post</h2>
            <button className="modal-close-btn" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
};

export default ForumPostHeader;
