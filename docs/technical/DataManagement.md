# Data Management & Backend

## Controller Layer
The application uses a "Controller" pattern to abstract Firebase logic from the UI components. All database interactions go through these controllers.

### `userController`
- **Purpose**: Manages user profiles and settings.
- **Key Methods**:
    - `getUserProfile(uid)`: Fetches user data.
    - `createUserProfile(uid, data)`: Initializes a new user.
    - `isAdmin(uid)`: Checks for admin privileges.
    - `toggleSavedPost(uid, postId, shouldSave)`: Updates the user's saved posts list.

### `postController`
- **Purpose**: Manages Forum posts.
- **Key Methods**:
    - `createPost(data)`: Creates a new post.
    - `getPostsPaginated(lastDoc, limit, boardId)`: Fetches posts with infinite scroll support.
    - `toggleLikePost(postId, uid, shouldLike)`: Handles post likes.

### `messageController`
- **Purpose**: Manages Freedom Wall messages.
- **Key Methods**:
    - `createMessage(data)`: Submits a new confession/message.
    - `getAllMessages()`: Fetches all messages.

### `reportController`
- **Purpose**: Handles the reporting system.
- **Key Methods**:
    - `createReport(postId, reason, reporterId, type)`: Flags content.
    - `getPendingReports()`: Fetches unresolved reports for admins.
    - `resolveReport(reportId, status, adminId)`: Updates report status.

## Database Schema (Firestore)

### `users` Collection
Stores user profiles.
```json
{
  "username": "Anonymous",
  "role": "user", // or "admin"
  "avatarSeed": "random-string",
  "savedPosts": ["post_id_1", "post_id_2"],
  "createdAt": "timestamp"
}
```

### `posts` Collection
Stores Forum posts.
```json
{
  "title": "Post Title",
  "content": "Post Content",
  "board": "board_id",
  "author": "Username",
  "uid": "user_id",
  "likes": 0,
  "likedBy": ["user_id_1"],
  "timestamp": "timestamp"
}
```

### `messages` Collection
Stores Freedom Wall messages.
```json
{
  "recipient": "Target Name",
  "message": "The message content",
  "theme": "color-theme-id",
  "mood": "mood-id",
  "timestamp": "timestamp"
}
```

### `reports` Collection
Stores flagged content reports.
```json
{
  "postId": "target_id",
  "type": "post", // or "message"
  "reason": "Reason for reporting",
  "reporterId": "user_id",
  "status": "pending", // "resolved", "dismissed"
  "timestamp": "timestamp"
}
```
