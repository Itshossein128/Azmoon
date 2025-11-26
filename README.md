
# Online Exam Platform

This is a full-stack web application for taking exams, built with React, Vite, TypeScript, and a Node.js backend.

## Project Structure

-   `src/`: Contains the frontend source code (React, Vite, TypeScript).
-   `backend/`: Contains the backend source code (Node.js, Express, TypeScript).
-   `shared/`: Contains shared types and interfaces used by both the frontend and backend.

## Prerequisites

-   Node.js (v18 or higher recommended)
-   npm

## Getting Started

To run the application, you need to start both the frontend development server and the backend API server.

### 1. Running the Backend Server

The backend provides the API and serves the data.

1.  Navigate to the `backend` directory.
2.  Follow the instructions in the [backend/README.md](./backend/README.md) file to install dependencies and start the server.

The backend server will be running on `http://localhost:3000`.

### 2. Running the Frontend Server

The frontend is a React application built with Vite.

1.  From the root of the project, install the dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```

The frontend application will be available at `http://localhost:5173`.
