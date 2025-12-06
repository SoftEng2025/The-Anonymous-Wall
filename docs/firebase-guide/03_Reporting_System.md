# Reporting System

## 3. Reporting Mechanism

### Overview
The reporting system allows users to flag content (Posts or Replies) for moderator review. It separates reports from the content itself to ensure efficient querying for admins.

### Collection Structure
-   **Collection Name**: `reports`
-   **Document Structure**:
    -   `postId`: ID of the target content.
    -   `parentPostId`: (Optional) If reporting a reply, this links to the parent.
    -   `reason`: Text reason for the report.
    -   `reporterId`: UID of the user reporting.
    -   `type`: 'post' or 'reply'.
    -   `status`: 'pending', 'resolved', or 'dismissed'.
    -   `timestamp`: Time of report.

### Workflow
1.  **Creation**:
    -   User selects a reason and submits.
    -   `reportController.createReport` adds a document to `reports` collection.
    -   Status is set to `pending` by default.

2.  **Admin Review**:
    -   Admins fetch reports using `getPendingReports`.
    -   Query: `where('status', '==', 'pending'), orderBy('timestamp', 'desc')`.

3.  **Resolution**:
    -   Admin chooses to "Dismiss" (Start Ignore) or "Delete" (Action Taken).
    -   `reportController.resolveReport` updates the report document:
        ```javascript
        await updateDoc(reportRef, {
            status: 'resolved', // or 'dismissed'
            resolvedBy: adminId,
            resolvedAt: serverTimestamp()
        });
        ```
    -   **Note**: Deleting the actual content is a separate action called via `postController.deletePost` or `replyController.deleteReply`.
