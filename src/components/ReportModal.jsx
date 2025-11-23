import React, { useState } from 'react';
import './ReportModal.css';

const REPORT_REASONS = [
    "Spam or misleading",
    "Harassment or hate speech",
    "Inappropriate content",
    "Violence or harmful behavior",
    "Other"
];

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        const reason = selectedReason === 'Other' ? otherReason : selectedReason;
        if (reason.trim()) {
            onSubmit(reason);
            // Reset state
            setSelectedReason('');
            setOtherReason('');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content report-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Report Post</h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="modal-body">
                    <p className="report-instruction">Why are you reporting this post?</p>
                    <div className="report-options">
                        {REPORT_REASONS.map(reason => (
                            <label key={reason} className="report-option">
                                <input
                                    type="radio"
                                    name="reportReason"
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                />
                                <span className="radio-label">{reason}</span>
                            </label>
                        ))}
                    </div>
                    {selectedReason === 'Other' && (
                        <textarea
                            className="other-reason-input"
                            placeholder="Please specify..."
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                        ></textarea>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button
                        className="btn-submit-report"
                        onClick={handleSubmit}
                        disabled={!selectedReason || (selectedReason === 'Other' && !otherReason.trim())}
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
