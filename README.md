# The Anonymous Wall (AnonyWall)

A modern web application built with React and Vite that allows users to share thoughts and ideas on a digital wall.

## 🚀 Features

-   **Browse Posts**: Explore a collection of posts on the "Wall".
-   **Submit Posts**: Share your own thoughts with the community.
-   **User Authentication**: Secure login using Google Sign-In via Firebase.
-   **Responsive Design**: Optimized for both desktop and mobile devices.
-   **Modern UI**: Clean and intuitive interface with smooth navigation.

## 🛠️ Tech Stack

-   **Frontend Framework**: [React](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Routing**: [React Router v7](https://reactrouter.com/)
-   **Backend & Auth**: [Firebase](https://firebase.google.com/)
-   **Styling**: CSS3
-   **Linting**: ESLint

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)

## ⚙️ Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/The-Anonymous-Wall.git
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
    -   Add your Firebase configuration keys as described in the setup guide.

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
├── public/              # Static assets
├── src/
│   ├── api/             # API utility functions
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React Contexts (e.g., AuthContext)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application pages (Home, About, Browse, Submit)
│   ├── utils/           # Helper functions and constants
│   ├── App.jsx          # Main application component with routing
│   └── main.jsx         # Entry point
├── .env                 # Environment variables (do not commit)
├── FIREBASE_SETUP.md    # Detailed Firebase setup guide
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
