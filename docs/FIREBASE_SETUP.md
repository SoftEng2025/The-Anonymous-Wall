# Firebase Setup Guide

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"**.
3. Enter a project name (e.g., `anonymous-wall`).
4. Disable Google Analytics (optional, for simplicity) and click **"Create project"**.

## 2. Enable Authentication
1. In the left sidebar, click **Build** > **Authentication**.
2. Click **"Get started"**.
3. Select **Google** from the Sign-in method list.
    - Click **Enable**.
    - Select a support email.
    - Click **Save**.
4. Click **"Add new provider"** and select **Anonymous**.
    - Click **Enable**.
    - Click **Save**.

## 3. Create Firestore Database
1. In the left sidebar, click **Build** > **Firestore Database**.
2. Click **"Create database"**.
3. Choose a location (e.g., `asia-southeast1` or `us-central1`).
4. Select **"Start in test mode"** (for development) or **"Start in production mode"**.
    - *Note: You will need to update Security Rules later.*

## 4. Get Configuration Keys
1. Click the **Gear icon** (Project settings) next to "Project Overview".
2. Scroll down to the **"Your apps"** section.
3. Click the **Web icon** (`</>`).
4. Register the app (nickname: `AnonyWall Web`).
5. You will see a `firebaseConfig` object. Copy the values to your `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 5. Set Security Rules
Go to **Firestore Database** > **Rules** and paste the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
*Warning: These rules are basic. See `docs/features/SecurityAndPrivacy.md` for production rules.*
