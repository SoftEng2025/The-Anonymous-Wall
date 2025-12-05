# Technology Stack & Justification

## Frontend: React 19 + Vite
We chose **React** as our frontend library for its component-based architecture, which allows for reusable UI elements and a modular codebase.
- **Why React?**: Huge ecosystem, declarative UI, and excellent performance for interactive SPAs.
- **Why Vite?**: It offers significantly faster build times and hot module replacement (HMR) compared to Create React App (Webpack), improving developer productivity.

## Backend: Firebase (BaaS)
We utilized **Firebase** as a Backend-as-a-Service solution.
- **Why Firebase?**:
    - **Speed of Development**: It provides ready-to-use Authentication and Database services, allowing us to focus on frontend features.
    - **Real-time Capabilities**: Firestore's real-time listeners enable instant updates for the Freedom Wall and Forum without complex WebSocket setup.
    - **Authentication**: Secure, compliant, and easy-to-integrate auth providers (Google, Anonymous).
    - **Serverless**: No need to manage server infrastructure, reducing operational overhead.

## Styling: Vanilla CSS + Variables
Instead of a heavy framework like Tailwind or Bootstrap, we used **Vanilla CSS** with CSS Variables.
- **Justification**:
    - **Performance**: Zero runtime overhead.
    - **Control**: Full control over the design system without fighting framework defaults.
    - **Theming**: CSS variables make implementing dynamic themes (like the message card colors) trivial.

## Routing: React Router v7
- **Justification**: The standard for React routing. It handles client-side navigation seamlessly, enabling a true Single Page Application experience.

## External APIs: DiceBear
- **Justification**: We needed a way to generate unique, consistent identities for anonymous users without requiring them to upload photos. DiceBear provides high-quality SVG avatars deterministically based on a seed string (the user's UID).
