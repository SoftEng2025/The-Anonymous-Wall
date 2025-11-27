import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPage.css';

const Contact = () => {
    return (
        <div className="info-page-container">
            <h1>Contact Us</h1>

            <div className="info-page-section">
                <h2>Report Issues & Feedback</h2>
                <p>Found a bug or have a suggestion? Please report it on our GitHub repository.</p>
                <p>
                    <strong>GitHub Issues:</strong> <a href="https://github.com/SoftEng2025/The-Anonymous-Wall/issues" target="_blank" rel="noopener noreferrer">SoftEng2025/The-Anonymous-Wall/issues</a>
                </p>
            </div>

            <div className="info-page-section">
                <h2>Support</h2>
                <p>This shows you thought about how users would get help beyond just sending an email.</p>
                <p>
                    Have a common question? Check out our <Link to="/faq">FAQ page</Link>.
                </p>
            </div>
        </div>
    );
};

export default Contact;
