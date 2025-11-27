import React from 'react';
import './ReportSuccessModal.css';

const ReportSuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content report-success-modal" onClick={e => e.stopPropagation()}>
                <div className="success-icon-container">
                    <i className="fa-solid fa-circle-check success-icon"></i>
                </div>
                <h2 className="success-title">Thank You!</h2>
                <p className="success-message">
                    Your report has been submitted. We appreciate your help in keeping our community safe.
                </p>
                <button className="btn-close-success" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ReportSuccessModal;
