# Component Library

## Overview
The application is built using a set of reusable, modular components to ensure consistency and maintainability.

## Core Components

### `HeroButton`
- **Path**: `src/components/HeroButton`
- **Purpose**: A primary call-to-action button used in the Home page hero section.
- **Props**: `label`, `path`, `icon`, `primary` (boolean for styling).

### `MessageCard`
- **Path**: `src/components/MessageCard`
- **Purpose**: Displays a single anonymous message in the grid layout.
- **Features**:
    - Dynamic background color based on `theme`.
    - Mood icon display.
    - "To" recipient field.

### `BoardBadge`
- **Path**: `src/components/BoardBadge`
- **Purpose**: A small pill-shaped badge indicating the board (category) of a post.
- **Features**: Automatically applies the board's specific color and icon based on the `boardConfig`.

### `Stats`
- **Path**: `src/components/Stats`
- **Purpose**: Displays platform statistics (e.g., "1,234 Voices Heard").
- **Logic**: Uses the `useStats` hook to animate the numbers.

## Modals
The application uses a consistent modal pattern for user interactions.

### `LoginModal`
- **Purpose**: Handles user authentication (Google & Guest).
- **Features**:
    - Google Sign-In button.
    - Guest Login button.
    - Admin mode support.

### `SubmitModal`
- **Purpose**: Form for submitting new Freedom Wall messages.
- **Features**:
    - Character count validation (max 95 chars).
    - Theme (color) selector.
    - Mood selector.

### `ReportModal`
- **Purpose**: Allows users to flag inappropriate content.
- **Features**: Pre-defined reasons for reporting.

### `DeleteConfirmationModal`
- **Purpose**: A safety check before admins delete content.
- **Features**: Shows a preview of the item being deleted.

## Layout Components

### `Header`
- **Purpose**: Main navigation bar.
- **Features**: Responsive design, user profile dropdown.

### `Footer`
- **Purpose**: Site footer with links and copyright.

### `ErrorBoundary`
- **Purpose**: Catches JavaScript errors anywhere in the child component tree and displays a fallback UI instead of crashing the app.
