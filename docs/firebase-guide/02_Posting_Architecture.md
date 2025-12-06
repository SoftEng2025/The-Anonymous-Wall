# Posting Architecture

## 2. Posting System

### Overview
The posting system is the core feature of the application. It creates public records in the `posts` collection in Firestore.

### Collection Structure
-   **Collection Name**: `posts` (Defined in `COLLECTIONS.POSTS`)
-   **Document Structure**:
    -   `uid`: ID of the creator.
    -   `content`: The text body.
    -   `board`: Category/Board ID (e.g., 'general', 'confessions').
    -   `timestamp`: Server timestamp for ordering.
    -   `likes`: Number (Counter).
    -   `comments`: Number (Counter).
    -   `author`: Display name (pseudonym).
    -   `avatarSeed`: For deterministic avatar generation.

### How Posting Works
1.  **Trigger**: User clicks "Post" in the UI.
2.  **Controller Action**: `postController.createPost(postData)` is called.
3.  **Validation**: Checks for `postData` and `uid`.
4.  **Model Creation**: `createPostModel(postData)` sanitizes and structures the object.
5.  **Firestore Write**: `addDoc` creates a new document with an auto-generated ID.

```javascript
// Simplified Logic
export const createPost = async (postData) => {
    const model = createPostModel(postData);
    const docRef = await addDoc(collection(db, 'posts'), model);
    return docRef.id;
};
```

### Retrieving Posts
-   **Standard Fetch**: `getAllPosts` queries the collection ordered by `timestamp` (descending).
-   **Pagination**: `getPostsPaginated` uses Firestore cursors.
    -   It accepts `lastDoc` from the previous query.
    -   Uses `startAfter(lastDoc)` and `limit(N)` to fetch chunks.
    -   This ensures performance even with thousands of posts.

### "In" Query Workaround
When fetching specific posts (e.g., Favorites), Firestore limits `in` queries to 30 items. The `getPostsByIds` function implements a chunking strategy:
1.  Splits the array of IDs into chunks of 30.
2.  Run parallel queries for each chunk.
3.  Flattens the results into a single array.
