import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemType = 'post' }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content delete-confirmation-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="delete-icon-wrapper">
                        <i className="fa-solid fa-trash-can"></i>
                    </div>
                    <h2 className="modal-title">Delete {itemType}?</h2>
                </div>

                <div className="delete-confirmation-body">
                    <p className="delete-warning-text">
                        Are you sure you want to delete this {itemType}?
                        <br />
                        <strong>This action cannot be undone.</strong>
                    </p>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel-delete" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn-confirm-delete" onClick={onConfirm}>
                        <i className="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
