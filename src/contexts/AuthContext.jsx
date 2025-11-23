import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signInAnonymously,
    signOut
} from 'firebase/auth';
import { auth, googleProvider } from '../backend/config/firebase';
import { userController } from '../backend/controllers/userController';

const AuthContext = createContext(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);



    const login = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Sync user profile (this will update role if email matches admin list)
            await userController.createUserProfile(user.uid, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            });

            return result;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const loginAnonymous = () => {
        return signInAnonymously(auth);
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        login,
        loginAnonymous,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
