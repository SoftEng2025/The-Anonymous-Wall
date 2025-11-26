import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import './components/Header.css'
import { useAuth } from './contexts/AuthContext'
import { getAvatarUrl } from './backend/api/avatar'
import Home from './pages/Home';
import About from './pages/About';
import Submit from './pages/Submit';
import Browse from './pages/Browse';
import Forum from './pages/Forum';
import ForumPost from './pages/ForumPost';
import Profile from './pages/Profile';
import TermsOfService from './pages/TermsOfService';
import LoginModal from './components/LoginModal';
import Contact from './pages/Contact.jsx';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { useState, useEffect } from 'react'

function AppContent() {
    const { currentUser } = useAuth()
    const location = useLocation()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

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
                    <Link to="/freedom-wall" className={`nav-link ${location.pathname === '/freedom-wall' || location.pathname === '/browse' ? 'active' : ''}`}>
                        Freedom Wall
                    </Link>
                    <Link to="/forum" className={`nav-link ${location.pathname === '/forum' ? 'active' : ''}`}>
                        Forum
                    </Link>
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
                onClose={handleCloseLoginModal}
            />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/freedom-wall" element={<Browse />} />
                <Route path="/submit" element={<Submit />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/forum/:postId" element={<ForumPost />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>

            <BackToTop className={(location.pathname === '/freedom-wall' || location.pathname === '/browse') ? 'back-to-top-on-freedom-wall' : ''} />
            <Footer location={location} />
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
