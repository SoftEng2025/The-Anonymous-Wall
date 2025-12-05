# Testing Strategy

## Overview
Given the project's scope and timeline, we adopted a **Manual Testing Strategy** focused on critical user flows and edge cases.

## Test Environment
- **Devices**: Desktop (Chrome, Firefox), Mobile (Chrome on Android, Safari on iOS).
- **Network**: Tested on high-speed WiFi and simulated slow 3G (via Chrome DevTools).

## Test Cases

### 1. Authentication
| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| A1 | Login with Google | User is redirected to dashboard; profile created in Firestore. | ✅ Pass |
| A2 | Login as Guest | User gets "Anonymous" session; data persists for session. | ✅ Pass |
| A3 | Logout | User is redirected to Home; session cleared. | ✅ Pass |

### 2. Freedom Wall
| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| F1 | Submit Message | Message appears in grid immediately (optimistic UI). | ✅ Pass |
| F2 | Validation | Cannot submit empty message or >95 chars. | ✅ Pass |
| F3 | Theme Selection | Card background matches selected theme. | ✅ Pass |

### 3. Forum
| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| B1 | Create Post | Post appears in feed; author name is correct. | ✅ Pass |
| B2 | Filter by Board | Only posts from selected board are shown. | ✅ Pass |
| B3 | Like Post | Like count increments; heart icon turns red. | ✅ Pass |
| B4 | Reply to Post | Reply appears in thread; nested replies work. | ✅ Pass |

### 4. Moderation (Admin)
| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| M1 | Report Content | Content disappears for user? (No, just flagged). Admin sees it. | ✅ Pass |
| M2 | Delete Content | Post removed from global feed; report marked resolved. | ✅ Pass |
| M3 | Access Control | Non-admin users redirected from `/admin`. | ✅ Pass |

## Cross-Browser Compatibility
- **Chrome**: Fully functional.
- **Firefox**: Fully functional.
- **Safari**: Minor layout adjustments made for flexbox gaps.
