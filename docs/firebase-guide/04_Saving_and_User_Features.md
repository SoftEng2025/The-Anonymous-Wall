# User Features & Persistence

## 4. Saving Posts & User Profiles

### User Profiles (`users` collection)
Even though Authentication is handled by Firebase Auth, the app maintains a parallel `users` collection in Firestore to store application-specific data.

-   **Document ID**: Matches the Firebase Auth `uid`.
-   **Fields**:
    -   `username`: Randomly generated pseudonym (e.g., "Anonymous Turtle").
    -   `role`: 'user' or 'admin' (determined by hardcoded email list in environment variables).
    -   `savedPosts`: Array of strings (Post IDs).

### Saving Posts Logic
Saving a post does **not** duplicate the post. It only stores a reference (ID) in the user's profile.

1.  **Action**: User allows "Save Post".
2.  **Controller**: `userController.toggleSavedPost(uid, postId, shouldSave)`.
3.  **Firestore Operation**:
    -   Uses `arrayUnion` to add the ID (prevents duplicates).
    -   Uses `arrayRemove` to delete the ID.
    ```javascript
    await updateDoc(userRef, {
        savedPosts: shouldSave ? arrayUnion(postId) : arrayRemove(postId)
    });
    ```
4.  **Frontend State**: `AuthContext` provides an optimistic update (updates UI immediately before server confirms) for a snappy experience.

### Identity & Avatars
-   Users have a persistent "Identity" per session/login.
-   **Avatar Seed**: A string stored in the user profile helps generate consistent avatars (using DiceBear or similar).
-   **Renaming**: If a user regenerates their identity (`updateUserProfile`), the app performs a **Batch Update** (`updatePostsAuthor` / `updateRepliesAuthor`) to update their name on all historical posts.
