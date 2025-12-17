# User Authentication & Anonymity

## 1. Architecture Overview (The Dual-Identity System)

To ensure student verification without compromising privacy, the system employs a **"Dual-Identity" Architecture**:

1.  **Private Identity (Auth Layer)**:
    *   **Technology**: Firebase Authentication.
    *   **Data**: Real email (`student@school.edu`), `uid`, and provider tokens.
    *   **Visibility**: Hidden. Strictly confined to the backend authentication context. *Zero* exposure to the public forum.

2.  **Public Identity (Application Layer)**:
    *   **Technology**: Firestore Custom Profile.
    *   **Data**: Pseudonym (e.g., "CalmHawk88") and deterministic Avatar.
    *   **Visibility**: Public. This is the only identity attached to content.

---

## 2. The Logic: Verification & Anonymity

### A. Student Verification (The "Gatekeeper")
How do we know they are a student?
We rely on **OAuth 2.0 / OpenID Connect** via Google Sign-In.

*   **Process**: The user logs in with their Google account.
*   **Validation**: Firebase verifies the cryptographic signature of the identity provider's token.
*   **Security Barrier**: Access to the application (making API calls) is restricted by Firestore Security Rules which require `request.auth != null`.
*   **Result**: We verify *validity* without creating a public link to that validity.

### B. Anonymity Implementation (The "Mask")
How is the real identity hidden?

*   **Pseudonym Generation**: Upon first login, the system detects a missing profile and triggers `generateRandomName()`.
*   **Strict Decoupling**: The system creates a user profile document where `username` is a random string (Adjective + Noun + Number).
*   **No Cross-Pollination**: The frontend logic explicitly uses `userProfile.username` for display. The `auth.currentUser.displayName` (Real Name) is never fetched or rendered in the feed components.

---

## 3. Code Trace: The Login Flow

This trace follows a user from hitting "Login" to having an anonymous identity ready.

**1. `src/contexts/AuthContext.jsx`**
*   **Function**: `login()`
*   **Action**: Calls `signInWithPopup(auth, googleProvider)`.
*   **Outcome**: Returns a verified `user` object from Firebase.

**2. `src/contexts/AuthContext.jsx` (Effect Hook)**
*   **Function**: `useEffect` monitoring `onAuthStateChanged`.
*   **Logic**:
    *   Detects a logged-in user.
    *   Calls `userController.getUserProfile(user.uid)`.
    *   **Decision Point**: If `profile` is `null` (New User), it calls `userController.createUserProfile`.

**3. `src/backend/controllers/userController.js`**
*   **Function**: `createUserProfile(uid, data)`
*   **Logic**:
    *   Checks if a `username` was passed. (It is usually empty for initial login).
    *   **CRITICAL CALL**: Invokes `import('../../utils/nameGenerator').generateRandomName()`.
    *   *Example Output*: "SilentPanda492".

**4. `src/utils/nameGenerator.js`**
*   **Logic**:
    *   Selects random Adjective (e.g., "Silent").
    *   Selects random Noun (e.g., "Panda").
    *   Generates random Number (e.g., 492).
    *   Combines them: "SilentPanda492".

**5. Database Persistence**
*   The controller writes to `Firestore/users/{uid}`:
    ```json
    {
      "username": "SilentPanda492",
      "role": "user",
      "createdAt": "2024-12-17T..."
    }
    ```
*   **Conclusion**: The user now has a persistent anonymous identity. Future posts will simply reference "SilentPanda492".
