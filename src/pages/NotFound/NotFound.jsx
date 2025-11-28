import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <img
                src="/404_NOT_FOUND.png"
                alt="404 Not Found"
                className="not-found-image"
            />
            <Link to="/" className="not-found-home-btn">
                <i className="fa-solid fa-house"></i>
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
