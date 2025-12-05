# Utilities & Hooks

## Custom Hooks
Custom React hooks used to encapsulate reusable logic.

### `useTypedLyrics`
- **Path**: `src/hooks/useTypedLyrics.js`
- **Purpose**: Implements the typewriter effect seen on the Home page hero section.
- **Logic**:
    - Takes an array of strings (lyrics) and typing configuration (speed, pause duration).
    - Manages the state of the currently displayed text, handling typing forward, pausing, and deleting backward.
    - Cycles through the provided lyrics infinitely.

### `useStats`
- **Path**: `src/hooks/useStats.js`
- **Purpose**: Manages the counting animation for the statistics section.
- **Logic**:
    - Increments a number from 0 to a target value over a specified duration.
    - Uses `requestAnimationFrame` for smooth performance.

## Utility Functions

### `boardConfig.js`
- **Path**: `src/data/boardConfig.js`
- **Purpose**: Central configuration for the Forum Boards.
- **Content**:
    - `BOARDS`: Array of board objects (id, name, icon, color, description).
    - Helpers: `getBoardById`, `getBoardColor`, `getBoardName`.

### `constants.js`
- **Path**: `src/utils/constants.js`
- **Purpose**: Stores application-wide constants.
- **Content**:
    - `NAV_LINKS`: Navigation menu items.
    - `HERO_BUTTONS`: Configuration for home page buttons.
    - `LYRICS_TIMELINE`: The text used in the typing effect.

### `timeUtils.js`
- **Path**: `src/utils/timeUtils.js`
- **Purpose**: Helper for formatting timestamps.
- **Key Function**: `formatTimeAgo(timestamp)` - Converts a timestamp into a human-readable relative time (e.g., "5m ago", "2d ago").

### `nameGenerator.js`
- **Path**: `src/utils/nameGenerator.js`
- **Purpose**: Generates random anonymous usernames.
- **Logic**: Combines random adjectives and nouns (e.g., "SilentWatcher", "HiddenVoice").
