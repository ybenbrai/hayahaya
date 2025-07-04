# Football Streaming App

A modern full-stack football streaming web application built with Next.js 14 frontend and Kotlin (Ktor) backend.

## Features

- **Live Match Streaming**: Real-time football match streaming with live scores
- **Match Details**: Individual match pages with live updates, lineups, and chat
- **Real-time Updates**: WebSocket integration for live score updates and chat
- **Responsive Design**: Modern UI with dark mode support
- **Multiple Leagues**: Support for various football leagues and competitions
- **Live Chat**: Real-time chat during live matches
- **Lineup Information**: Team lineups and player information

## Tech Stack

### Frontend

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **TanStack Query** for data fetching
- **React Query DevTools** for debugging
- **Lucide React** for icons
- **Zod** for validation

### Backend

- **Kotlin** with **Ktor** framework
- **Gradle** for build management
- **WebSocket** support for real-time communication
- **CORS** enabled for cross-origin requests
- **Serialization** with kotlinx.serialization
- **HTTP Client** for external API integration

## Project Structure

```
foot/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── components/      # React components
│   │   │   ├── lib/            # Utilities and API client
│   │   │   └── types/          # TypeScript type definitions
│   │   └── public/             # Static assets
│   └── public/             # Static assets
├── backend/                 # Kotlin backend application
│   ├── src/main/kotlin/
│   │   ├── com/football/
│   │   │   ├── models/     # Data models and DTOs
│   │   │   ├── plugins/    # Ktor plugins
│   │   │   ├── routes/     # API routes
│   │   │   └── services/   # Business logic
│   │   └── resources/      # Configuration files
│   └── gradle/             # Gradle wrapper
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Java** 17+ and **Gradle**
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd foot
   ```

2. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env.local in frontend directory
   echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local
   ```

4. **Install backend dependencies**
   ```bash
   cd ../backend
   ./gradlew build
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   ./gradlew run
   ```

   The backend will start on `http://localhost:8080`

2. **Start the frontend development server**

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will start on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000` to see the application

## API Endpoints

### REST API

- `GET /games/live` - Get live matches
- `GET /games/upcoming` - Get upcoming matches
- `GET /game/{id}` - Get specific match details
- `GET /lineup/{gameId}` - Get match lineup
- `GET /chat/{gameId}` - Get chat messages
- `POST /chat/{gameId}` - Send chat message

### WebSocket

- `ws://localhost:8080/ws/game/{gameId}` - Real-time game updates
- `ws://localhost:8080/ws/chat/{gameId}` - Real-time chat

## Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend Development

```bash
cd backend
./gradlew run        # Start development server
./gradlew build      # Build the project
./gradlew test       # Run tests
```

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

### Backend (application.conf)

```hocon
ktor {
  deployment {
    port = 8080
  }
  application {
    modules = [ com.football.ApplicationKt.module ]
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository.
