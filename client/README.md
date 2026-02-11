# Task Management System - Client

This is the new frontend application for the Task Management System, built with **Vite**, **React**, and **TypeScript**.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```
  Runs at `http://localhost:5173`

- **Build**:
  ```bash
  npm run build
  ```

- **Preview**:
  ```bash
  npm run preview
  ```

### Testing

- **Unit/Integration Tests** (Vitest):
  ```bash
  npm test
  ```

- **E2E Tests** (Playwright):
  ```bash
  npm run test:e2e
  ```

## Project Structure

- `src/api` - API service layer (deprecated, moved to `src/services`)
- `src/components` - Reusable UI components
- `src/constants` - Global constants and configuration
- `src/context` - React Context providers
- `src/hooks` - Custom React hooks
- `src/pages` - Page components
- `src/services` - Business logic and API interaction
- `src/styles` - Global styles and CSS modules
- `src/types` - TypeScript type definitions
- `src/utils` - Utility functions
- `tests` - Test setup and E2E tests

## Technologies

- React 18
- TypeScript 5
- Vite 5
- Vitest
- Playwright
- Axios
- React Router 6
