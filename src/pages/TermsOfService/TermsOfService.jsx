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
        </div>
    );
};

export default TermsOfService;