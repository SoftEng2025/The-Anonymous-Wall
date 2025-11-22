import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
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
                    <Link to="/about" className="footer-link">About</Link>
                    <Link to="/contact" className="footer-link">Contact</Link>
                    <Link to="/terms" className="footer-link">Terms & Privacy</Link>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
