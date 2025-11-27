import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({ location }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <span className="footer-logo-primary">Anony</span>
                    <span className="footer-logo-accent">Wall</span>
                    <span className="footer-copyright">© {currentYear}</span>
                </div>
                <nav className="footer-links">
                    <Link to="/about" className={`footer-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
                    <Link to="/contact" className={`footer-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
                    <Link to="/terms" className={`footer-link ${location.pathname === '/terms' ? 'active' : ''}`}>Terms</Link>
                    <Link to="/privacy" className={`footer-link ${location.pathname === '/privacy' ? 'active' : ''}`}>Privacy</Link>
                    <Link to="/security" className={`footer-link ${location.pathname === '/security' ? 'active' : ''}`}>Security</Link>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
