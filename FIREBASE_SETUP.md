# Firebase Setup Guide

To complete the setup, you need to create a Firebase project and configure the environment variables.

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the setup steps.
3. You can disable Google Analytics for this project if you want to keep it simple.

## 2. Register Your App
1. In the project overview, click the **Web** icon (`</>`) to add a web app.
2. Give it a nickname (e.g., "Anonymous Wall").
3. Click **Register app**.
4. You will see your `firebaseConfig` object. Keep this page open or copy the values.

## 3. Enable Authentication
1. Go to **Build > Authentication** in the left sidebar.
2. Click **Get Started**.
3. Select **Google** from the Sign-in method list.
4. Click **Enable**.
5. Select a **Project support email**.
6. Click **Save**.

## 4. Configure Environment Variables
1. Create a file named `.env` in the root directory of your project (next to `package.json`).
2. Copy the contents of `.env.example` into `.env`.
3. Replace the values with the keys from your Firebase config (step 2).

Example `.env` file:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 5. Restart the Development Server
After creating the `.env` file, you need to restart the Vite server for the changes to take effect.
1. Stop the running server (Ctrl+C).
2. Run `npm run dev` again.

## 6. Test Login
1. Open the app in your browser.
2. Click the **Login** button in the top right.
3. Sign in with your Google account.
4. You should see your avatar and a **Logout** button.
