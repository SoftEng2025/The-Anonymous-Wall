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
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (uid) => {
        try {
            const profile = await userController.getUserProfile(uid);
            setUserProfile(profile);
        } catch (error) {
            console.error("Error fetching user profile in context:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await fetchUserProfile(user.uid);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const refreshProfile = async () => {
        if (currentUser) {
            await fetchUserProfile(currentUser.uid);
        }
    };

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

            await fetchUserProfile(user.uid); // Fetch immediately after login

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
        userProfile,
        refreshProfile,
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
