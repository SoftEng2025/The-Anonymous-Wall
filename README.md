# The Anonymous Wall (AnonyWall)

A modern, secure, and interactive web application built with React and Vite that allows users to share thoughts, engage in discussions, and connect with a community while maintaining privacy.

## 🚀 Features

### Core Functionality
-   **Freedom Wall**: An anonymous space to share thoughts and feelings with customizable mood indicators and themes.
-   **Community Forum**: A structured discussion board with categorized topics (General, Technology, Gaming, etc.).
-   **Interactive Posts**: Like, comment, and reply to posts to foster conversation.
-   **User Profiles**: Customize your username and track your activity if youre logged in with Google.

### Security & Moderation
-   **Secure Authentication**: Google Sign-In and Anonymous Guest Login powered by Firebase.
-   **Content Moderation**: Robust reporting system for posts and messages.
-   **Admin Dashboard**: Dedicated interface for administrators to manage content and users.

### User Experience
-   **Responsive Design**: Fully optimized for desktop, tablet, and soon for mobile devices.
-   **Modern UI**: Sleek, intuitive interface with smooth animations and dark mode aesthetics.
-   **Real-time Updates**: Instant feedback for interactions like likes and comments.

## 🛠️ Tech Stack

-   **Frontend Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Routing**: [React Router v7](https://reactrouter.com/)
-   **Backend & Auth**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
-   **Styling**: Vanilla CSS3 with CSS Variables for theming
-   **Icons**: [FontAwesome](https://fontawesome.com/)

## 📚 Documentation
> **[View Full Documentation](./docs/ProjectOverview.md)**

We have prepared comprehensive documentation for the project defense:
- **[Features & User Guide](./docs/ProjectOverview.md#%F0%9F%93%9A-features--functionality)**
- **[Technical Architecture](./docs/ProjectOverview.md#%E2%9A%99%EF%B8%8F-technical-architecture)**
- **[Security & Privacy](./docs/features/SecurityAndPrivacy.md)**
- **[Future Roadmap](./docs/FutureRoadmap.md)**

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)

## ⚙️ Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/SoftEng2025/The-Anonymous-Wall
    cd The-Anonymous-Wall
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

## 🔧 Configuration

This project uses Firebase for authentication and backend services. You need to set up a Firebase project and configure the environment variables.

1.  **Create a Firebase Project**: Follow the detailed instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).
2.  **Set up Environment Variables**:
    -   Create a `.env` file in the root directory.
    -   Add your Firebase configuration keys:
        ```env
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        ```

## 🏃‍♂️ Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

## 📦 Building for Production

To create a production-ready build:

```bash
npm run build
```

The build artifacts will be stored in the `dist` directory. You can preview the production build locally using:

```bash
npm run preview
```

## 📂 Project Structure

```
The-Anonymous-Wall/
├── public/              # Static assets (logos, icons)
├── src/
│   ├── api/             # API utility functions
│   ├── backend/         # Firebase controllers and config
│   ├── components/      # Reusable UI components (Header, Modals, etc.)
│   ├── contexts/        # React Contexts (AuthContext, MessageContext)
│   ├── data/            # Static data and configurations
│   ├── pages/           # Application pages (Home, Browse, Forum, Profile)
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Main application component with routing
│   └── main.jsx         # Entry point
├── .env                 # Environment variables
├── FIREBASE_SETUP.md    # Detailed Firebase setup guide
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
