# Firebase Architecture Guide

## 1. Introduction & Configuration

### Overview
The application uses **Firebase v9 (Modular SDK)** for its backend-as-a-service, handling Authentication, Firestore Database, and basic configuration management. The implementation is designed to be serverless, relying on client-side SDKs with secured rules (implied) and organized controller logic.

### Configuration
The Firebase connection is established in `src/backend/config/firebase.js`. It utilizes environment variables for security and flexibility across environments.

```javascript
// src/backend/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
```

### Core Services Used
1.  **Authentication**: Handled via `firebase/auth`. Supports Google Sign-In and Anonymous Sign-In.
2.  **Firestore**: NoSQL database for creating and retrieving data.
3.  **Storage**: (Configured but currently not heavily utilized in the analyzed controllers).

### Project Structure
All Firebase-related logic is encapuslated in `src/backend/`.
-   **Config**: `src/backend/config/` (Initialization)
-   **Controllers**: `src/backend/controllers/` (Business logic and direct DB calls)
-   **Models**: `src/backend/models/` (Data structure validation/creation)
