import React from 'react';
import '../TermsOfService/LegalPages.css';

const SecurityPolicy = () => {
    return (
        <div className="legal-page-container">
            <h1>Security Policy</h1>
            <p>Last updated: November 27, 2025</p>

            <h2>1. Secure Authentication</h2>
            <p>
                We use Google Firebase Authentication to ensure secure and reliable user login. We do not store your passwords on our servers. All authentication traffic is encrypted using SSL/TLS.
            </p>

            <h2>2. Data Protection</h2>
            <p>
                Your data is stored securely in Google Cloud Firestore. We implement strict access controls to ensure that only authorized services can access the database.
            </p>

            <h2>3. Reporting Vulnerabilities</h2>
            <p>
                We take security seriously. If you discover a security vulnerability in The Anonymous Wall, please report it to us immediately via our Contact page. We will investigate all reports and take appropriate action to fix the issue.
            </p>

            <h2>4. User Responsibility</h2>
            <p>
                You are responsible for maintaining the security of your Google account. Do not share your login credentials with anyone. If you suspect unauthorized access to your account, please contact Google support and notify us.
            </p>
        </div>
    );
};

export default SecurityPolicy;
