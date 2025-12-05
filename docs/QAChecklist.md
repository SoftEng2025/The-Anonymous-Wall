# QA Checklist & Defense Prep

Use this checklist to verify the application is 100% ready for your defense.

## 🚨 Critical Functionality (Must Work)
- [ ] **Google Login**: Can log in with a Google account?
- [ ] **Guest Login**: Can log in anonymously?
- [ ] **Logout**: Does logout redirect to Home and clear session?
- [ ] **Freedom Wall Post**:
    - [ ] Can submit a message?
    - [ ] Does it appear immediately (Optimistic UI)?
    - [ ] Do theme colors and mood icons render correctly?
- [ ] **Forum Post**:
    - [ ] Can create a new thread with a Title and Board?
    - [ ] Does it appear in the correct Board feed?
- [ ] **Interactions**:
    - [ ] Can Like a post? (Count increases)
    - [ ] Can Reply to a post? (Reply appears in list)
    - [ ] Can Save a post? (Appears in Profile > Saved)

## 🎨 UI/UX & Responsiveness
- [ ] **Mobile View**:
    - [ ] Does the Hamburger menu work?
    - [ ] Are grids (Freedom Wall) stacking correctly (1 column)?
    - [ ] Are modals (Login, Submit) usable on small screens?
- [ ] **Animations**:
    - [ ] Is the Home page typing effect working?
    - [ ] Do stats numbers count up smoothly?
- [ ] **Empty States**:
    - [ ] Does Profile > Saved Posts show a message if empty?
    - [ ] Does Admin Dashboard show "No pending reports" if empty?

## 🛡️ Security & Moderation
- [ ] **Reporting**:
    - [ ] Can a user report a post?
    - [ ] Does the report appear in the Admin Dashboard?
- [ ] **Admin Access**:
    - [ ] Can an Admin user access `/admin`?
    - [ ] Is a non-admin user redirected away from `/admin`?
- [ ] **Moderation Actions**:
    - [ ] Can Admin **Keep** a post (dismiss report)?
    - [ ] Can Admin **Delete** a post (removes content)?

## 📱 PWA & Performance
- [ ] **Installability**:
    - [ ] Does the "Install App" icon appear in the browser?
    - [ ] Can you install it to the desktop/home screen?
- [ ] **Offline**:
    - [ ] Does the app load (shell) when offline?
- [ ] **Assets**:
    - [ ] Do the correct icons (AnonyWall logo) appear on the splash screen/taskbar?

## 👤 User System
- [ ] **Profile**:
    - [ ] Does the username display correctly?
    - [ ] Does the Avatar render?
- [ ] **Identity Change**:
    - [ ] Click "Regenerate Identity". Does the avatar change?
    - [ ] Check an OLD post by this user. Did the avatar update there too? (Retroactive update check)
