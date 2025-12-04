import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext'
import { getAvatarUrl } from './backend/api/avatar'
import { NAV_LINKS } from './utils/constants'
import { useState, useEffect, Suspense, lazy } from 'react';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Browse = lazy(() => import('./pages/Browse'));
const Forum = lazy(() => import('./pages/Forum'));
const ForumPost = lazy(() => import('./pages/ForumPost'));
const Profile = lazy(() => import('./pages/Profile'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'));
const SecurityPolicy = lazy(() => import('./pages/SecurityPolicy/SecurityPolicy'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

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

            <Suspense fallback={<div className="loading-screen">Loading...</div>}>
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
            </Suspense>

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
