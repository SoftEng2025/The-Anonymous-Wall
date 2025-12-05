# Docker Deployment Guide

This guide explains how to deploy and manage **The Anonymous Wall** using Docker.

## Prerequisites

*   **Docker Desktop** installed on your machine.
*   **Git** (to clone the repository).

## Quick Start

The easiest way to get the application running is using Docker Compose.

1.  **Open Terminal**: Open your terminal or command prompt in the project root directory.
2.  **Run Command**: Execute the following command to build and start the application:

    ```bash
    docker-compose up --build -d
    ```

    *   `--build`: Forces a rebuild of the Docker image.
    *   `-d`: Runs the container in detached mode (in the background).

3.  **Access App**: Open your browser and navigate to:
    **[http://localhost:8080](http://localhost:8080)**

---

## Managing with Docker Desktop

Once the application is running, you can easily manage it using the Docker Desktop UI.

### 1. View Running Containers
1.  Open **Docker Desktop**.
2.  Click on the **"Containers"** tab in the left sidebar.
3.  Look for a group named `the-anonymous-wall` (or similar).
4.  Expand it to see the `anonywall-web` container running (indicated by a green icon).

### 2. Open in Browser
*   Hover over the `anonywall-web` container.
*   Click the **"Open in browser"** button (square with an arrow icon).

### 3. View Logs
*   Click on the container name `anonywall-web`.
*   This opens the **Logs** view, where you can see server output and debug errors.

### 4. Stop/Restart
*   **Stop**: Click the **Stop** button (square icon) next to the container group to stop the application.
*   **Start**: Click the **Start** button (play icon) to resume it.

---

## Technical Details

### Project Structure

The Docker setup consists of the following files:

*   **`Dockerfile`**: Defines the multi-stage build process.
    *   **Stage 1 (Build)**: Uses `node:22-alpine` to install dependencies and build the React app.
    *   **Stage 2 (Serve)**: Uses `nginx:alpine` to serve the static files.
*   **`nginx.conf`**: Custom Nginx configuration to handle React Router (Single Page Application routing).
*   **`docker-compose.yml`**: Orchestrates the container, mapping port `8080` on your host to port `80` in the container.
*   **`.dockerignore`**: Excludes unnecessary files (like `node_modules`) from the build context to improve performance.

### Environment Variables

The application relies on environment variables for configuration (Firebase, reCAPTCHA, etc.).

*   **Build-Time Injection**: Vite embeds environment variables into the static JavaScript files **during the build process**.
*   **`.env` File**: The `Dockerfile` is configured to copy your local `.env` file into the build container.
*   **Important**: Ensure your `.env` file exists in the root directory **before** running the build command. If you change environment variables, you must rebuild the container:
    ```bash
    docker-compose up --build -d
    ```

## Troubleshooting

*   **Port Conflicts**: If port `8080` is already in use, modify `docker-compose.yml` and change the port mapping (e.g., `"3000:80"`).
*   **Build Errors**: If the build fails due to Node.js version issues, ensure the `Dockerfile` is using a compatible Node version (e.g., `node:22-alpine`).
*   **Missing Features**: If features like Firebase or reCAPTCHA don't work, verify that your `.env` file was present during the build and contains the correct keys.
