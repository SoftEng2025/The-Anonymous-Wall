import React from 'react';
import { Link } from 'react-router-dom';
import './FloatingSubmitButton.css';

const FloatingSubmitButton = () => {
    return (
        <Link to="/submit" className="floating-submit-button" title="Submit a post">
            <span className="plus-icon">+</span>
            <span className="submit-text">Submit</span>
        </Link>
    );
};

export default FloatingSubmitButton;