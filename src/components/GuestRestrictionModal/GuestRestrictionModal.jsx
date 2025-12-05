import React from 'react';
import './GuestRestrictionModal.css';

const GuestRestrictionModal = ({
    isOpen,
    onClose,
    onLogin,
    title = "Guest Restriction",
    message = "Guests cannot create new discussion threads.",
    subMessage = "To start your own topic, please log in to a permanent account.",
    actionLabel = "Login to Post",
    icon = "fa-user-lock"
}) => {
    if (!isOpen) return null;

    return (
        <div className="guest-restriction-modal-overlay" onClick={onClose}>
            <div className="guest-restriction-modal-content" onClick={e => e.stopPropagation()}>
                <div className="guest-restriction-modal-header">
                    <h2 className="guest-restriction-modal-title">{title}</h2>
                    <button className="guest-restriction-modal-close" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="guest-restriction-modal-body">
                    <div className="restriction-icon-wrapper">
                        <i className={`fa-solid ${icon}`}></i>
                    </div>
                    <p className="restriction-message">
                        {message}
                        <br />
                        {message.includes("create") && (
                            <>You are welcome to <strong>reply</strong> to existing posts!</>
                        )}
                    </p>
                    <p className="restriction-submessage">
                        {subMessage}
                    </p>
                </div>

                <div className="guest-restriction-modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-login" onClick={() => { onClose(); onLogin(); }}>
                        {actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuestRestrictionModal;
