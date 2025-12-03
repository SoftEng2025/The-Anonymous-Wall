import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext'
import { getAvatarUrl } from './backend/api/avatar'
import { NAV_LINKS } from './utils/constants'
import Home from './pages/Home'
import About from './pages/About'
import Browse from './pages/Browse'
import Forum from './pages/Forum'
import ForumPost from './pages/ForumPost';
import Profile from './pages/Profile';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import SecurityPolicy from './pages/SecurityPolicy/SecurityPolicy';
import LoginModal from './components/LoginModal';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound/NotFound';

import { useState, useEffect } from 'react';

function AppContent() {
    const { currentUser, logout } = useAuth()
    const location = useLocation()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)



    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);



    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };



    return (
        <div className="page">
            <Header onLoginClick={() => setIsLoginModalOpen(true)} />

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={handleCloseLoginModal}
            />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/freedom-wall" element={<Browse />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/forum/:postId" element={<ForumPost />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/security" element={<SecurityPolicy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

            <BackToTop />
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
