# The Anonymous Wall (AnonyWall)

## What this project is
AnonyWall is a privacy-first community app that lets people:
- Post short, themed Freedom Wall messages with moods.
- Join longer-form forum discussions across topic boards.
- Log in with Google or browse/post anonymously.
- Report problematic content and let admins review and act.

Built with React 19 + Vite on the front end and Firebase (Auth + Firestore) for identity and data.

## Architecture at a glance
- **Routing**: React Router v7 in `src/App.jsx` wires pages for Home, Freedom Wall (`/browse` or `/freedom-wall`), Forum, Forum Post detail, Profile, Admin, and policy/contact pages.
- **State**:
  - `AuthContext` manages Firebase auth (Google + anonymous) and syncs user profiles/roles.
  - `MessageContext` seeds demo Freedom Wall posts if Firestore is empty for a better first-load experience.
- **Backend services** (`src/backend/controllers`):
  - `messageController`: CRUD for Freedom Wall messages (`messages` collection).
  - `postController`: CRUD + likes + board filtering for forum posts (`posts`).
  - `replyController`: CRUD + like toggles for replies (`posts/{id}/replies`).
  - `reportController`: create/resolve reports on posts or messages (`reports`).
  - `moderationController`: admin audit trail (`moderation_logs`).
  - `userController`: profile CRUD, admin role resolution via `VITE_ADMIN_EMAILS`, username generation.
- **Models** (`src/backend/models`): Builders (Message, Post, Reply) enforce consistent fields, timestamps, and avatar seeds.
- **Config/data**:
  - `src/backend/config/firebase.js` initializes Auth/Firestore from `.env`.
  - `src/data/boardConfig.js` defines forum boards, colors, icons, and rules.
  - `src/utils` holds UI copy constants, typing animation settings, random name generation, and helper APIs (e.g., avatars).
- **UI components**: Modals for login/report/submit, forum post modal, stats blocks, theme/mood pickers, dicebear avatars, back-to-top, footer, and header navigation.

## Key flows
- **Freedom Wall**: Users pick a theme color and mood, enter recipient + message, and submit via `SubmitModal`. Data saves to Firestore (`messages`) and is mirrored locally via `MessageContext` for instant UI updates.
- **Forum**: Posts belong to boards defined in `boardConfig`. Users can like, comment (replies), and view board-specific feeds or details (`/forum/:postId`).
- **Auth**: Google Sign-In or anonymous login (Firebase Auth). Admins are determined by email match against `VITE_ADMIN_EMAILS` and see the Admin navigation link.
- **Reporting & moderation**: Users can report posts/messages. Admins review pending reports, resolve or dismiss, and actions are logged for auditability.
- **Profiles**: User profiles live in Firestore; avatar seeds derive from UID. Updating username triggers backfill on owned posts/replies.

## Data model cheatsheet
- **Message** (`messages`):
  - `recipient`, `message`, `theme`, `mood`
  - `createdAt` (ISO), `timestamp` (ms)
- **Post** (`posts`):
  - `author`, `uid`, `avatarSeed`
  - `title`, `content`, `board`, `tags` (array)
  - `likes` (count), `likedBy` (uids), `comments` (count)
  - `createdAt` (ISO), `timestamp` (ms)
- **Reply** (`posts/{postId}/replies`):
  - `author`, `uid`, `avatarSeed`
  - `content`, `likes`, `likedBy`, `replyTo` (optional)
  - `createdAt` (ISO), `timestamp` (ms)
- **Report** (`reports`):
  - `postId`, `reason`, `reporterId`, `type` (`post` or `message`)
  - `status` (`pending`, `resolved`, `dismissed`)
  - `timestamp` (server), `createdAt` (ISO), `resolvedBy`, `resolvedAt`
- **User profile** (`users`):
  - `username`, `role` (`admin` when email matches `VITE_ADMIN_EMAILS`, else `user`)
  - `email`, `displayName`, `photoURL`, other profile data

## Environment setup
Create `.env` in the project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
# Optional: comma-separated admin emails to unlock Admin Dashboard
VITE_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

## Install, run, and build
Prerequisites: Node.js 16+ and npm.
```bash
npm install          # install deps
npm run dev          # start Vite dev server (http://localhost:5173)
npm run lint         # run ESLint
npm run build        # production bundle -> dist/
npm run preview      # serve the built bundle locally
```

## Project structure (high level)
- `src/App.jsx` – routing + layout shell (header/footer/back-to-top/auth)
- `src/pages/` – Home, About, Browse/Freedom Wall, Forum, ForumPost, Profile, AdminDashboard, policy/contact pages
- `src/components/` – modal dialogs (login, submit, report), forum UI, footer/header, helpers
- `src/contexts/` – `AuthContext`, `MessageContext`
- `src/backend/` – firebase config, controllers, and Firestore models
- `src/data/` – board definitions and metadata
- `src/utils/` – constants, name generator, avatar helpers, formatting utilities

## Roles and access
- **Users**: can browse, post messages, and participate in forum threads.
- **Admins**: add emails to `VITE_ADMIN_EMAILS` to expose the Admin Dashboard and allow report resolution/moderation actions.

## Deployment notes
- Vite static build in `dist/`.
- `vercel.json` is included for SPA rewrites (`/*` -> `index.html`), making Vercel deployment turnkey.

## UI/UX behavior highlights
- Theme + mood pickers colorize Freedom Wall cards and the message composer background.
- Responsive layout; modals adapt for mobile with slide-up animation.
- FontAwesome provides icons for moods, boards, and actions.

## License
MIT License (see `LICENSE`).
