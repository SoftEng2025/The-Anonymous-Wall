import React from 'react';
import './PrivacyConfirmationModal.css';

const PrivacyConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content privacy-confirmation-modal" onClick={e => e.stopPropagation()}>
                <div className="privacy-confirmation-body">
                    <p className="privacy-warning-text">
                        Are you sure you want to make your profile Public?
                    </p>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel-privacy" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn-confirm-privacy" onClick={onConfirm}>
                        <i className="fa-solid fa-globe"></i> Go Public
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyConfirmationModal;
