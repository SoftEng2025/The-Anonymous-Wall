import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MessageProvider } from './contexts/MessageContext'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <MessageProvider>
                <App />
            </MessageProvider>
        </AuthProvider>
    </StrictMode>,
)
