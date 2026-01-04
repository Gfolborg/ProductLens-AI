# Gemini Code Assistant Context

This document provides context for the Gemini Code Assistant to understand the project codebase.

## Project Overview

This is a full-stack application that helps users create professional product photos for Amazon listings. The application consists of a mobile and web app (client) and a backend server. Users can upload a product image, and the backend will use the Gemini AI to automatically remove the background, center the product, and place it on a pure white background, as required for Amazon main listing images.

## Tech Stack

- **Frontend (Client):**
  - React Native (with Expo)
  - TypeScript
  - React Navigation for routing
  - TanStack Query for data fetching

- **Backend (Server):**
  - Node.js with Express
  - TypeScript
  - Drizzle ORM for database access
  - PostgreSQL database

- **AI & Image Processing:**
  - Google Gemini (`gemini-2.5-flash-image` model) for AI-powered image editing.
  - `sharp` for image processing.

- **Tooling:**
  - `prettier` for code formatting.
  - `eslint` for linting.
  - `drizzle-kit` for database migrations.

## Project Structure

- `client/`: Contains the React Native (Expo) mobile and web application.
  - `client/screens/`: Contains the different screens of the app (e.g., `CameraScreen.tsx`, `PreviewScreen.tsx`).
  - `client/navigation/`: Contains the navigation logic for the app.
- `server/`: Contains the Node.js backend.
  - `server/index.ts`: The entry point for the Express server.
  - `server/routes.ts`: Defines the API routes and the core AI logic.
- `shared/`: Contains code shared between the client and server.
  - `shared/schema.ts`: The Drizzle ORM database schema.
- `assets/`: Static assets like images.
- `drizzle.config.ts`: Configuration file for Drizzle ORM.
- `package.json`: Lists project dependencies and available scripts.

## How to Run the Project

1.  **Install dependencies:**
    ```bash
    bun install
    ```

2.  **Run the backend server:**
    ```bash
    bun run server:dev
    ```
    The server will run on port 5000.

3.  **Run the client application:**
    ```bash
    bun run expo:dev
    ```
    This will start the Expo development server, and you can open the app on a mobile device using the Expo Go app or in a web browser.

## Available Scripts

- `npm run expo:dev`: Starts the Expo development server for the client.
- `npm run server:dev`: Starts the backend development server using `tsx`.
- `npm run db:push`: Pushes database schema changes to the PostgreSQL database using Drizzle Kit.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run check:types`: Runs the TypeScript compiler to check for type errors.
- `npm run format`: Formats the code using Prettier.

## Core Functionality & API

The core functionality is provided by the backend through a single API endpoint:

- **`POST /api/amazon-main`**
  - **Description:** Accepts an image file, processes it using the Gemini AI to create an Amazon-compliant product photo, and returns the resulting image.
  - **Request:** `multipart/form-data` with a single file field named `file`.
  - **Response:** The processed image as a JPEG file.
