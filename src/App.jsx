import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import './components/Header.css'
import { useAuth } from './contexts/AuthContext'
import { getAvatarUrl } from './backend/api/avatar'
import { NAV_LINKS } from './utils/constants'
import Home from './pages/Home'
import About from './pages/About'
import Submit from './pages/Submit'
import Browse from './pages/Browse'
import Forum from './pages/Forum'
import ForumPost from './pages/ForumPost';
import Profile from './pages/Profile';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import { useState } from 'react';

function AppContent() {
    const { currentUser, logout } = useAuth()
    const location = useLocation()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    return (
        <div className="page">
            <header className="site-header">
                <div className="logo">
                    <Link to="/" className="logo-link">
                        <span className="logo-primary">Anony</span>
                        <span className="logo-accent">Wall</span>
                    </Link>
                </div>
                <nav className="nav-links" aria-label="Primary navigation">
                    {NAV_LINKS.map((label) => {
                        const slug = label.toLowerCase().replace(/\s+/g, '-')

                        const path = `/${slug}`
                        // Check if it's one of the known pages
                        if (['/about', '/submit', '/browse', '/forum'].includes(path)) {
                            return (
                                <Link
                                    key={label}
                                    to={path}
                                    className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                                >
                                    {label}
                                </Link>
                            )
                        }

                        return (
                            <a key={label} className="nav-link" href={`/#${slug}`}>
                                {label}
                            </a>
                        )
                    })}
                </nav>
                <div className="auth-container">
                    {currentUser ? (
                        <div className="user-menu">
                            <Link to="/profile">
                                <img
                                    src={getAvatarUrl(currentUser.uid)}
                                    alt={currentUser.displayName || 'User'}
                                    className="user-avatar"
                                    title="Go to Profile"
                                />
                            </Link>
                        </div>
                    ) : (
                        <button className="login-button" onClick={() => setIsLoginModalOpen(true)}>
                            Login
                        </button>
                    )}
                </div>
            </header>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/submit" element={<Submit />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/forum/:postId" element={<ForumPost />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>

            <Footer />
        </div>
    )
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    )
}

export default App
