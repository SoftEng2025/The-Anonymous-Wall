import React from 'react';
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onClose, onConfirm, isGuest }) => {
    if (!isOpen) return null;

    return (
        <div className="logout-modal-overlay" onClick={onClose}>
            <div className="logout-modal-content" onClick={e => e.stopPropagation()}>
                <div className="logout-modal-header">
                    <h2 className="logout-modal-title">
                        {isGuest ? 'Warning: Guest Account' : 'Confirm Logout'}
                    </h2>
                    <button className="logout-modal-close" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="logout-modal-body">
                    {isGuest ? (
                        <div className="guest-warning">
                            <div className="warning-icon">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <p>
                                You are currently using a <strong>Guest Account</strong>.
                                Logging out will <strong>permanently delete</strong> your identity,
                                post history, and saved items. You will not be able to recover this account.
                            </p>
                        </div>
                    ) : (
                        <p>Are you sure you want to log out?</p>
                    )}
                </div>

                <div className="logout-modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button
                        className={`btn-confirm ${isGuest ? 'btn-danger' : ''}`}
                        onClick={onConfirm}
                    >
                        {isGuest ? 'Delete & Logout' : 'Logout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
