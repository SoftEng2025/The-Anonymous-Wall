# User Authentication & Anonymity Defense Documentation

## 1. Architecture Overview

**Stack:** React (Vite) + Firebase (Authentication, Firestore, Storage).

The authentication system is built on a **"Dual-Identity" Architecture**:
1.  **Private Identity (Auth Layer)**: Handled by Firebase Auth. Stores real credentials (email, provider data) securely and privately. This is NEVER exposed to other users.
2.  **Public Identity (Application Layer)**: Handled by our custom backend logic. Consists of a generated pseudonym (e.g., "BraveTiger492") and a deterministic avatar. This is the ONLY identity visible on the public feed.

---

## 2. File Structure Reference

Key files involved in the Authentication and Anonymity modules:

| Module | File Path | Role |
| :--- | :--- | :--- |
| **Auth Context** | `src/contexts/AuthContext.jsx` | Manages global auth state (`currentUser`), handles login/logout, and fetches the public profile. |
| **User Controller** | `src/backend/controllers/userController.js` | Backend logic for creating profiles, assigning roles, and generating pseudonyms. |
| **Post Controller** | `src/backend/controllers/postController.js` | Handles post creation, ensuring posts are tagged with the pseudonym (`author`) rather than the real name. |
| **Name Generator** | `src/utils/nameGenerator.js` | Utility that produces random Adjective + Noun + Number combinations. |
| **Data Model** | `src/backend/models/PostModel.js` | Defines the schema for posts, enforcing the separation of `uid` (hidden reference) and `author` (visible name).|

---

## 3. The Logic: Student Verification & Anonymity

### How do we verify a user without revealing them?

We use a **Token-Based Verification** strategy relying on Firebase's secure sessions.

1.  **Authentication (The "Gatekeeper")**:
    *   When a student logs in via Google Sign-In, Firebase verifies their credentials and issues a securely signed **JWT (JSON Web Token)**.
    *   This ensures the user is a valid entity with a verified email address.
    *   *Defense Point:* We do not store passwords. We rely on the OAuth provider (Google) for proof of identity.

2.  **Separation of Concerns (The "Mask")**:
    *   Once verified, the application checks `Firestore/users/{uid}`.
    *   If no profile exists, `userController.createUserProfile` is called.
    *   **CRITICAL STEP**: Instead of saving `user.displayName` (Real Name) as the public username, the system calls `generateRandomName()` (e.g., returns "CalmHawk88").
    *   This pseudonym is saved to the public profile.

### Anonymity Implementation

**1. Pseudonym Generation**
*   **Algorithm**: Random selection from predefined arrays.
*   **Format**: `[Random Adjective] + [Random Noun] + [Random Number (100-999)]`
*   **Collision Handling**: Low probability due to combinations ($20 \times 20 \times 900 = 360,000$ variations). If needed, simple checks can be added, but currently, we allow overlapping pseudonyms as true uniqueness isn't strictly required for this semi-anonymous context.

**2. Data decoupling in Posts**
When a user posts, the `postController.createPost` function constructs the data packet:

```javascript
// src/backend/models/PostModel.js
export const createPostModel = (data) => {
    return {
        author: data.author || 'Anonymous', // <--- PUBLIC PSEUDONYM
        uid: data.uid,                      // <--- PRIVATE REFERENCE (Hidden in UI)
        avatarSeed: data.uid,               // <--- DETERMINISTIC VISUAL SEED
        content: data.content,
        // ... other fields
    };
};
```

*   **UI Layer**: The frontend *never* displays `post.uid`. It only renders `post.author` and generates an avatar using `post.avatarSeed`.
*   **Database Layer**: The `uid` is kept in the document to allow:
    *   The author to delete their own post (Authorization check).
    *   Admins to ban users in case of abuse (Accountability).

---

## 4. Step-by-Step Code Trace

### Scenario: A new student logs in and creates a post.

#### Step 1: Login & Identity Assignment
1.  **User Action**: Clicks "Login" button.
2.  **`AuthContext.jsx`**: Calls `signInWithPopup(auth, googleProvider)`.
3.  **Firebase**: Validates credentials, returns `user` object (contains `uid`, `email`, `displayName`).
4.  **`AuthContext.jsx`**:
    *   Calls `userController.getUserProfile(user.uid)`.
    *   *Result*: `null` (First time user).
    *   Calls `userController.createUserProfile(user.uid, { ... })`.
5.  **`userController.js`**:
    *   Detects no username provided.
    *   Calls `import('../../utils/nameGenerator').generateRandomName()`.
    *   Saves `{ username: "HappyLion123", role: "user", ... }` to Firestore.

#### Step 2: Creating a Post
1.  **User Action**: Opens "Create Post" modal in `Forum.jsx`.
2.  **`Forum.jsx`**:
    *   Reads `userProfile.username` (Context) -> "HappyLion123".
    *   Passes this as `author` to the submit handler.
3.  **Controller Call**:
    *   Calls `postController.createPost({ author: "HappyLion123", uid: "xyz123...", ... })`.
4.  **Model Construction**:
    *   `PostModel.js` formats the data.
5.  **Persistence**:
    *   `addDoc(collection(db, 'posts'), model)` saves it to Firestore.

#### Step 3: Viewing the Feed
1.  **Reader Action**: Loads the Forum.
2.  **`ForumPostCard.jsx`**:
    *   Receives post data.
    *   Renders `post.author` ("HappyLion123").
    *   **CRITICAL**: Does NOT have access to or display the user's real email or photo.

---

## 5. Summary for Q&A

*   **Q: Can valid students start trolling immediately?**
    *   **A:** Yes, but they can be tracked via their `uid` by admins. Anonymity is for *peers*, not for *impunity* from administration.
*   **Q: Is the real name stored anywhere?**
    *   **A:** Yes, in the `users` collection, accessible only to Admins via Firestore Rules and the Admin Dashboard. It is never sent to the frontend public feed.
*   **Q: What prevents non-students from logging in?**
    *   **A:** Currently, any Google account can login. To restrict this to students, we would simply add a domain check (e.g., `if (!email.endsWith('@school.edu')) throw Error`) in the `AuthContext` login function.
