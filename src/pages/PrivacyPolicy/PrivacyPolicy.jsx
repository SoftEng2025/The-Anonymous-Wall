import React from 'react';
import '../TermsOfService/LegalPages.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page-container">
            <h1>Privacy Policy</h1>
            <p>Last updated: November 27, 2025</p>

            <h2>1. Information We Collect</h2>
            <p>
                We collect information you provide when you create an account, which includes your Google account UID. We do not store your email address directly, but it is associated with your Google login. We also collect content you create, such as posts and comments.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
                We use the information we collect to operate and maintain our service, to authenticate users, and to prevent abuse. Your UID is used to link you to your content and for avatar generation.
            </p>

            <h2>3. Data Handling and Sharing</h2>
            <p>
                We do not sell or rent your personal data to third parties. Your username is public, but we take measures to protect the link to your Google account. All user-generated content should be considered public.
            </p>

            <h2>4. Your Rights</h2>
            <p>
                You have the right to access and delete your account and associated content. Please contact us if you wish to exercise these rights.
            </p>

            <h2>5. Changes to This Policy</h2>
            <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
        </div>
    );
};

export default PrivacyPolicy;
