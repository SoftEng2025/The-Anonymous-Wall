# Home & Static Pages Documentation

## Home Page (`/`)
The Home page serves as the landing page for The Anonymous Wall, designed to immediately engage users and convey the platform's purpose.

### Key Features
- **Dynamic Hero Section**: Features a typing effect animation (`useTypedLyrics` hook) that cycles through meaningful lyrics/phrases to set the emotional tone.
- **Quick Actions**: Prominent buttons (`HeroButton`) to guide users to key actions like "Browse Wall" or "Submit Confession".
- **Live Statistics**: Displays real-time (or mock) stats about the community using the `Stats` component.
- **Sample Wall**: A grid layout (`HomeGrid.css`) showcasing sample anonymous messages (`MessageCard`) to give new users an idea of the content.

### Components Used
- `HeroButton`: Reusable button component for the hero section.
- `MessageCard`: Displays individual anonymous posts.
- `Stats`: Shows platform statistics.

## About Page (`/about`)
A static informational page that explains the mission and values of The Anonymous Wall.

### Content
- **Mission**: To provide a safe space for free expression without identity.
- **Values**: Emphasizes respect, kindness, and constructive conversation.
- **Privacy Assurance**: Reassures users that their identity remains anonymous and personal info is not shared.

## Contact Page (`/contact`)
Provides channels for users to get help or report issues.

### Features
- **GitHub Issues**: Directs users to the GitHub repository for bug reports and feature requests.
- **Support Info**: Placeholder for support information and a link to the FAQ page.
