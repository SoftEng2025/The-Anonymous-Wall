import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import { useAuth } from './contexts/AuthContext'
import { getAvatarUrl } from './api/avatar'
import { NAV_LINKS } from './utils/constants'
import Home from './pages/Home'
import About from './pages/About'
import Submit from './pages/Submit'

function AppContent() {
    const { currentUser, login, logout } = useAuth()
    const location = useLocation()

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
                        // Handle "About" specifically to route to the page
                        if (label === 'About') {
                            return (
                                <Link
                                    key={label}
                                    to="/about"
                                    className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                                >
                                    {label}
                                </Link>
                            )
                        }
                        // Handle "Submit" specifically to route to the page
                        if (label === 'Submit') {
                            return (
                                <Link
                                    key={label}
                                    to="/submit"
                                    className={`nav-link ${location.pathname === '/submit' ? 'active' : ''}`}
                                >
                                    {label}
                                </Link>
                            )
                        }
                        // For other links, keep them as anchors for now or update as needed
                        // Assuming "Browse", "Forum", "Submit" might be sections on Home or future pages
                        // For now, let's route them to home with hash if they are sections, or just placeholders
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
                            <img
                                src={getAvatarUrl(currentUser.uid)}
                                alt={currentUser.displayName || 'User'}
                                className="user-avatar"
                            />
                            <button className="login-button" onClick={() => logout()}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button className="login-button" onClick={() => login()}>
                            Login
                        </button>
                    )}
                </div>
            </header>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/submit" element={<Submit />} />
            </Routes>
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
