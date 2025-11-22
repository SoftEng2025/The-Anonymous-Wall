import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
    const { login, loginAnonymous } = useAuth();

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        try {
            await login();
            onClose();
        } catch (error) {
            console.error("Google login failed", error);
        }
    };

    const handleGuestLogin = async () => {
        try {
            await loginAnonymous();
            onClose();
        } catch (error) {
            console.error("Guest login failed", error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="modal-header">
                    <h2 className="modal-title">Welcome to <span className="text-accent">AnonyWall</span></h2>
                    <p className="modal-subtitle">Join the conversation freely and securely.</p>
                </div>

                <div className="modal-actions">
                    <button className="modal-btn google-btn" onClick={handleGoogleLogin}>
                        <i className="fa-brands fa-google"></i>
                        Continue with Google
                    </button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <button className="modal-btn guest-btn" onClick={handleGuestLogin}>
                        <i className="fa-solid fa-user-secret"></i>
                        Continue as Guest
                    </button>
                </div>

                <p className="modal-footer-text">
                    Guest accounts are temporary and tied to this device.
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
