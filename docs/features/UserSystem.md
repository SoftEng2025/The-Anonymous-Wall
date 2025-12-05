# User System Documentation

## Authentication
The application uses **Firebase Authentication** to manage user sessions.

### Login Methods
- **Google Sign-In**: Users can sign in with their Google account. This provides a persistent identity across devices.
- **Guest (Anonymous) Login**: Users can sign in anonymously. This creates a temporary account tied to the current session/device.

### AuthContext
The `AuthContext` provides the authentication state (`currentUser`, `userProfile`) to the entire application. It handles:
- Monitoring authentication state changes.
- Fetching and syncing the user's profile from Firestore.
- Providing `login`, `logout`, and `toggleSave` functions.

## User Profile (`/profile`)
The Profile page allows users to manage their anonymous identity and view their activity.

### Key Features
- **Anonymous Identity**:
    - **Avatar**: Generated procedurally based on a "seed".
    - **Username**: A random username is assigned initially (e.g., "Anonymous").
    - **Handle**: Derived from the email (or "anonymous" for guests).
- **Identity Management**:
    - **Regenerate Identity**: Users can click the refresh icon on their avatar to generate a new avatar seed. This action **retroactively updates** all their past posts and replies to reflect the new look.
    - **Edit Username**: Users can change their display name. This also updates all past content.
- **Activity History**:
    - **My Posts**: A list of all posts created by the user.
    - **Saved Posts**: A collection of posts the user has bookmarked.
- **Admin Status**: If the user is an admin, an "ADMIN" badge is displayed.

## Backend Logic (`userController`)
- **Profile Creation**: When a user logs in for the first time, a profile document is created in the `users` collection.
- **Role Management**: Admin roles are assigned based on a whitelist of emails defined in the environment variables (`VITE_ADMIN_EMAILS`).
- **Saved Posts**: Saved posts are stored as an array of post IDs in the user's profile document.
