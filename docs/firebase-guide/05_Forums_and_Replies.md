# Forums & Replies

## 5. Forums (Replies System)

### Architecture: Sub-collections
Unlike a flat SQL structure where comments might be in a separate table linked by Foreign Key, this app uses Firestore **Sub-collections**.

-   **Path**: `posts/{postId}/replies/{replyId}`
-   **Benefit**:
    -   Scalability: You don't load all comments when loading the feed.
    -   Organization: Comments are strictly strictly parented to their post.

### Communication Flow
1.  **Posting a Reply**:
    -   `replyController.addReply(postId, replyData)` is called.
    -   **Step A**: Adds document to the sub-collection `posts/ID/replies`.
    -   **Step B**: Atomically increments the `comments` counter on the **parent post** document.
        ```javascript
        // Update comment count on parent
        await updateDoc(postRef, {
            comments: increment(1)
        });
        ```
    -   This allows the "Comment Count" badge on the feed to remain accurate without counting documents every time.

2.  **Reading Replies**:
    -   `getReplies(postId)` fetches only the sub-collection for that specific post.
    -   Ordered by timestamp ascending (Linear conversation).

3.  **Cross-Collection Queries**:
    -   When updating an author's name, we need to find *all* their replies across *all* posts.
    -   This uses a **Collection Group Query**:
        ```javascript
        const q = query(collectionGroup(db, 'replies'), where('uid', '==', uid));
        ```
    -   *Note*: This requires a specific index to be enabled in the Firebase Console.
