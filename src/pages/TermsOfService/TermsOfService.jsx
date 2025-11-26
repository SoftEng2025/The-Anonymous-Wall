import React from 'react';
import './LegalPages.css';

const TermsOfService = () => {
    return (
        <div className="legal-page-container">
            <h1>Terms of Service</h1>
            <p>Last updated: November 23, 2025</p>

            <h2>1. Introduction</h2>
            <p>
                Welcome to The Anonymous Wall! These Terms of Service ("Terms") govern your use of our forum and services. By accessing or using the service, you agree to be bound by these Terms.
            </p>

            <h2>2. User Conduct</h2>
            <p>
                You agree not to use the service to post content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable. We reserve the right to remove any content and terminate accounts that violate these rules.
            </p>

            <h2>3. Anonymity and Accounts</h2>
            <p>
                While we are "The Anonymous Wall," creating an account is required for certain features like posting. Your account is tied to your Google login, but your display name can be customized. True anonymity is complex, and we handle your data as described in our Privacy Policy.
            </p>

            <h2>4. Limitation of Liability</h2>
            <p>
                The service is provided "as is." We are not liable for any damages or losses arising from your use of the service.
            </p>

            <h2>5. Changes to Terms</h2>
            <p>
                We may modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page.
            </p>

            <h1 style={{ marginTop: '4rem' }}>Privacy Policy</h1>
            <p>Last updated: November 23, 2025</p>

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

export default TermsOfService;