# Security & Privacy

## Overview
The Anonymous Wall is designed with a "Privacy First" approach. We prioritize user anonymity while maintaining a safe and respectful community through robust security and moderation measures.

## Authentication & Identity
- **Anonymous by Default**: Users are not required to provide real names. Identities are protected by pseudonyms (e.g., "SilentWatcher") and generated avatars.
- **Secure Login**: We use **Firebase Authentication** to handle user sessions securely.
    - **Google Sign-In**: Uses OAuth 2.0 for secure, password-less authentication.
    - **Guest Access**: Allows users to interact without linking any personal credentials.
- **Data Minimization**: We only store the minimum necessary data (UID, email for admins, display name) and do not track IP addresses or physical locations.

## Content Moderation
To prevent abuse while allowing free expression, we implement a multi-layered moderation system.

### Reporting System
- **User-Driven**: Any user can flag inappropriate posts or messages.
- **Reasons**: Reports must include a reason (e.g., "Harassment", "Spam").
- **Immediate Action**: Reported content is flagged for admin review.

### Admin Dashboard
- **Restricted Access**: Only verified administrators (whitelisted via `VITE_ADMIN_EMAILS`) can access the dashboard.
- **Review Process**: Admins review flagged content and can:
    - **Dismiss**: If the report is invalid.
    - **Delete**: If the content violates community guidelines.
- **Audit Logs**: All administrative actions are logged in the `moderation_logs` collection to ensure accountability.

## Data Protection
- **Firestore Security Rules**: Database access is strictly controlled.
    - **Read**: Publicly readable (for forums/wall).
    - **Write**: Only authenticated users can create posts.
    - **Update/Delete**: Users can only modify their own data. Admins can delete any content.
- **Client-Side Validation**: Input fields have character limits and validation to prevent injection attacks and spam.

## Privacy Policy
For more details, please refer to our [Privacy Policy](/privacy) and [Terms of Service](/terms) pages within the application.
