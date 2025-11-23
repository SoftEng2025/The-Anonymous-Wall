import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPage.css';

const Contact = () => {
    return (
        <div className="info-page-container">
            <h1>Contact Us</h1>

            <div className="info-page-section">
                <h2>Email Address</h2>
                <p>This is the most professional standard. It shows where users could submit questions or report issues.</p>
                <p>
                    <strong>Email:</strong> <a href="mailto:project.anonywall@gmail.com">project.anonywall@gmail.com</a>
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
