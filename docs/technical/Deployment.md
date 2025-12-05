# Deployment & Configuration

## Environment Variables
The application relies on environment variables for Firebase configuration and admin access control. These must be set in your `.env` file (local) or your deployment platform's environment settings.

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_ADMIN_EMAILS` | Comma-separated list of emails authorized for Admin Dashboard access |

## Build Scripts (`package.json`)
- **`npm run dev`**: Starts the local development server using Vite.
- **`npm run build`**: Compiles the application for production.
    - Output directory: `dist/`
    - Assets directory: `dist/assets/`
- **`npm run preview`**: Locally previews the production build.
- **`npm run lint`**: Runs ESLint to check for code quality issues.

## Vite Configuration (`vite.config.js`)
- **Framework**: React (via `@vitejs/plugin-react`).
- **Bundler**: Vite (using Rollup under the hood).
- **Plugins**: React plugin enabled.

## Deployment (Vercel)
The project is configured for deployment on Vercel.

### Configuration (`vercel.json`)
- **Rewrites**: All routes (`/(.*)`) are rewritten to `/index.html`.
- **Purpose**: This is required for Single Page Applications (SPAs) using client-side routing (React Router). It ensures that when a user refreshes a page like `/about`, the server returns the main HTML file instead of a 404 error, allowing React Router to handle the URL.
