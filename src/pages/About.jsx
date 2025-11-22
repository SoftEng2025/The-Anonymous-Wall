import React from 'react'
import './About.css'

export default function About() {
    return (
        <div className="about-container">
            <div className="about-content">
                <h1 className="about-title">About Us</h1>
                <h2 className="about-subtitle">Speak Freely. Stay Anonymous.</h2>

                <div className="about-text">
                    <p>
                        Anonywall is your space to freely express your thoughts, share ideas, and connect with others – all without revealing your identity. Whether you want to start meaningful discussions, or simply share what’s on your mind, this is your place to do so openly and honestly.
                    </p>
                    <p>
                        We value respect, kindness, and constructive conversations. Let’s work together to keep Anonywall a safe and welcoming space for everyone.
                    </p>
                    <p>
                        Your privacy is fully protected with us. We never share your personal information, and your identity always remains anonymous. Speak your mind – safely, securely, and freely.
                    </p>
                </div>
            </div>
        </div>
    )
}
