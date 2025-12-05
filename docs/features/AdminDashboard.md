# Admin Dashboard Documentation

## Overview
The Admin Dashboard (`/admin`) is a restricted area for platform moderators to review reported content and manage the community.

### Access Control
- **Role-Based Access**: Only users with the `role: 'admin'` in their Firestore profile can access this page.
- **Security**: The page checks the user's role on load and redirects unauthorized users to the home page.

## Features

### Flagged Content Management
The dashboard displays a list of all **pending reports**.
- **Content Preview**: Admins can see the reported post or message, the reason for the report, and the reporter's ID.
- **Batch Fetching**: The dashboard efficiently fetches the actual content for all reported items in a single batch request to minimize database reads.
- **Actions**:
    - **Keep Post**: Dismisses the report without removing the content. The report status is updated to 'dismissed'.
    - **Delete Post**: Permanently deletes the content (post or message) and marks the report as 'resolved'. This action requires confirmation via a modal.

### Moderation Logs
A history of all administrative actions is maintained for accountability.
- **Logged Data**: Time, Admin ID, Action Type (e.g., `DELETE_CONTENT`, `KEEP_CONTENT`), Target ID, and Details.
- **Visibility**: Admins can view these logs to track moderation activity.

## Backend Logic (`reportController` & `moderationController`)
- **Reports Collection**: Stores report metadata (postId, reason, reporterId, status).
- **Status Workflow**: Reports start as `pending`. Admin actions move them to `resolved` (if action taken) or `dismissed` (if ignored).
- **Logging**: The `moderationController` records every action to the `moderation_logs` collection.
