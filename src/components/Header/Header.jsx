import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../backend/api/avatar';
import { userController } from '../../backend/controllers/userController';
import './Header.css';

export default function Header({ onLoginClick }) {
    const { currentUser, userProfile } = useAuth();
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Scroll to top on route change & close mobile menu
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (userProfile) {
            setIsAdmin(userProfile.role === 'admin');
        } else {
            setIsAdmin(false);
        }
    }, [userProfile]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="site-header">
            <div className="header-content-wrapper">
                <div className="logo">
                    <Link to="/" className="logo-link">
                        <img src="/AnonyWallLogo.svg" alt="AnonyWall Logo" className="logo-image" />
                        <span>
                            <span className="logo-primary">Anony</span>
                            <span className="logo-accent">Wall</span>
                        </span>
                    </Link>
                </div>

                <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
                    <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </button>

                <div className={`nav-container ${isMobileMenuOpen ? 'open' : ''}`}>
                    <nav className="nav-links" aria-label="Primary navigation">
                        <Link to="/freedom-wall" className={`nav-link ${location.pathname === '/freedom-wall' || location.pathname === '/browse' ? 'active' : ''}`}>
                            Freedom Wall
                        </Link>

                        <Link to="/forum" className={`nav-link ${location.pathname === '/forum' ? 'active' : ''}`}>
                            Forum
                        </Link>
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                            >
                                Admin
                            </Link>
                        )}

                    </nav>
                    <div className="auth-container">
                        {currentUser ? (
                            <div className="user-menu">
                                <Link to="/profile">
                                    <img
                                        src={getAvatarUrl(userProfile?.avatarSeed || currentUser.uid)}
                                        alt={currentUser.displayName || 'User'}
                                        className="user-avatar"
                                        title="Go to Profile"
                                    />
                                </Link>
                            </div>
                        ) : (
                            <button className="login-button" onClick={onLoginClick}>
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
