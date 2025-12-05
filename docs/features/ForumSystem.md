# Forum & Freedom Wall Documentation

## Forum (`/forum`)
The Forum is the central hub for community discussions, organized by "Boards" (categories).

### Key Features
- **Board System**: Posts are categorized into boards (e.g., "Love", "Rant", "Advice"). Users can filter posts by selecting a specific board.
- **Feed View**: Displays a list of posts with infinite scrolling (pagination).
- **Sorting**: Users can sort posts by "Latest", "Most Liked", or "Most Commented".
- **Interactions**:
    - **Create Post**: Authenticated users can create new posts with a title, content, and board selection.
    - **Like**: Users can like posts.
    - **Save**: Users can save posts to their profile for later.
    - **Report**: Users can report inappropriate content.
- **Anonymous Identity**: Users are identified by a generated username (or "Anonymous") and a unique avatar seed.

### Components
- `ForumHeader`: Navigation header for the forum.
- `ForumFilters`: Controls for sorting and filtering posts.
- `ForumFeed`: The main list of posts.
- `BoardBadge`: Visual indicator of a post's board.

## Freedom Wall / Browse (`/browse`)
Also known as the "Freedom Wall", this page displays short, anonymous messages or "confessions" in a card grid layout.

### Key Features
- **Message Cards**: Colorful cards displaying the message, recipient, mood icon, and timestamp.
- **Search**: Users can search for messages by recipient name or content.
- **Create Message**: Users can submit new messages via the `SubmitModal`.
- **Interactions**: Users can report messages.

### Submit Modal
A specialized modal for creating Freedom Wall messages.
- **Inputs**: Recipient name, Message (max 95 chars), Theme (color), Mood (icon).
- **Validation**: Prevents submission of empty or overly long messages.

## Forum Post Detail (`/forum/:postId`)
A dedicated page for viewing a single post and its discussion.

### Key Features
- **Full Content**: Displays the complete post content.
- **Comments/Replies**: Users can view and add replies to the post.
- **Nested Replies**: Supports replying to specific comments.
- **Stats**: Shows total likes, comments, and save status.
