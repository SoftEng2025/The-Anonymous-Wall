import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Check for chunk load error
        if (error.message && (
            error.message.includes('Failed to fetch dynamically imported module') ||
            error.message.includes('Importing a module script failed')
        )) {
            // Prevent infinite reload loop
            const lastReload = sessionStorage.getItem('chunk_reload_ts');
            const now = Date.now();

            if (!lastReload || now - parseInt(lastReload) > 10000) {
                sessionStorage.setItem('chunk_reload_ts', String(now));
                window.location.reload();
                return { hasError: false }; // Don't show error UI yet, just reload
            }
        }

        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-container">
                    <div className="error-boundary-content">
                        <i className="fa-solid fa-triangle-exclamation error-icon"></i>
                        <h2>Something went wrong</h2>
                        <p>We couldn't load this part of the application.</p>
                        {this.state.error && (
                            <details className="error-details">
                                <summary>Error Details</summary>
                                <p>{this.state.error.toString()}</p>
                            </details>
                        )}
                        <button className="retry-btn" onClick={this.handleRetry}>
                            <i className="fa-solid fa-rotate-right"></i>
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
