# Football Streaming Web Application

A modern full-stack football streaming web application built with Next.js 14 and Kotlin/Ktor.

## Features

- 🏈 Live football match streaming
- 📊 Real-time scores and statistics
- 💬 Live match chat
- 📱 Responsive design for mobile and desktop
- 🌙 Dark mode support
- 🔐 JWT authentication
- 👨‍💼 Admin panel for game management
- ⚡ Real-time updates via WebSocket

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- TanStack Query
- Zod validation
- Lucide icons

### Backend

- Kotlin
- Ktor framework
- WebSocket support
- JWT authentication
- kotlinx.serialization

## Project Structure

```
football-streaming-app/
├── frontend/          # Next.js 14 application
├── backend/           # Kotlin/Ktor application
├── package.json       # Root package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Java 17+
- Gradle

### Installation

1. Install dependencies:

```bash
npm run install:all
```

2. Start development servers:

```bash
npm run dev
```

This will start both frontend (http://localhost:3000) and backend (http://localhost:8080).

### Environment Variables

Create `.env.local` in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

## API Endpoints

- `GET /games/live` - Get live games
- `GET /games/upcoming` - Get upcoming games
- `GET /game/{id}` - Get specific game details
- `GET /score/live/{gameId}` - Get live score updates
- `GET /lineup/{gameId}` - Get team lineups
- `WS /ws/game/{gameId}` - WebSocket for real-time updates

## Authentication

- Viewer role: Can view games and chat
- Admin role: Can manage games and schedules
