# Task Management System

A comprehensive task management system with roles for Authors (task creators) and Solvers (task executors).

## Project Structure

- `api/` - Backend Node.js/Express API
- `client/` - **NEW** Frontend React/TypeScript application (Vite)

- `web-archive/` - Future location for archived legacy frontend

## Getting Started

### Backend (API)

```bash
cd api
npm install
npm run dev
```

### Frontend (New Client)

```bash
cd client
npm install
npm run dev
```

### Legacy Frontend (Deprecated)

```bash
cd web
npm install
npm start
```


## Development

You can run both client and legacy web in parallel using the root package.json scripts (if configured, or manually in separate terminals).

```bash
# Run new client
npm run dev:new

# Run legacy web
npm run dev:old
```
