# Multiplayer Tic-Tac-Toe Game

A production-ready, real-time multiplayer Tic-Tac-Toe game built with React, TypeScript, and Nakama server.

## 🎮 Features

### Core Features
- ✅ **Real-time Multiplayer** - Play against opponents worldwide
- ✅ **Server-Authoritative** - All game logic runs on the server to prevent cheating
- ✅ **Automatic Matchmaking** - Find opponents automatically
- ✅ **Responsive Design** - Works seamlessly on mobile and desktop
- ✅ **Modern UI** - Beautiful gradient design with smooth animations

### Technical Features
- ✅ **WebSocket Communication** - Real-time bidirectional communication
- ✅ **State Management** - React Context API for global state
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Server Validation** - All moves validated server-side
- ✅ **Graceful Disconnection Handling** - Handles player disconnections

### Bonus Features
- ✅ **Concurrent Game Support** - Multiple games can run simultaneously
- ✅ **Leaderboard System** - Track wins, losses, and win streaks
- ✅ **Timer-Based Mode** - Optional 30-second turn timer
- ✅ **Game History** - Persistent player statistics

---

## 📋 Table of Contents

1. [Architecture](#-architecture)
2. [Prerequisites](#-prerequisites)
3. [Installation](#-installation)
4. [Local Development](#-local-development)
5. [Project Structure](#-project-structure)
6. [API Documentation](#-api-documentation)
7. [Deployment](#-deployment)
8. [Testing](#-testing)
9. [Troubleshooting](#-troubleshooting)
10. [Contributing](#-contributing)

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────┐         WebSocket          ┌─────────────┐
│             │◄──────────────────────────►│             │
│  React App  │     (Real-time Comm)       │   Nakama    │
│  (Frontend) │                            │   Server    │
│             │◄──────────────────────────►│             │
└─────────────┘      HTTP/HTTPS            └──────┬──────┘
                                                   │
                                                   │
                                            ┌──────▼──────┐
                                            │             │
                                            │ PostgreSQL  │
                                            │  Database   │
                                            │             │
                                            └─────────────┘
```

### Technology Stack

#### Frontend
- **React 18.3** - UI library
- **TypeScript 5.5** - Type safety
- **Vite 5.3** - Build tool and dev server
- **Tailwind CSS 3.4** - Styling
- **Nakama JS SDK 2.7** - Client library

#### Backend
- **Nakama 3.22** - Game server
- **Lua** - Server-side game logic
- **PostgreSQL 12.2** - Database
- **Docker** - Containerization

### Game Flow

```
1. User Authentication
   └─► Device ID authentication
       └─► Session created

2. Matchmaking
   └─► Player creates matchmaker ticket
       └─► Server finds opponent
           └─► Both players join match

3. Gameplay
   └─► Players take turns
       └─► Server validates each move
           └─► Server broadcasts game state
               └─► UI updates in real-time

4. Game End
   └─► Winner determined or draw
       └─► Leaderboard updated
           └─► Players can rematch or leave
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** >= 20.10.0
- **Docker Compose** >= 2.0.0
- **Git**

### Verify Installation

```bash
node --version    # Should be >= v18.0.0
npm --version     # Should be >= 9.0.0
docker --version  # Should be >= 20.10.0
docker-compose --version  # Should be >= 2.0.0
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/abhishekagarwal777/tic-tac-toe-multiplayer.git
cd tic-tac-toe-multiplayer
```

### 2. Backend Setup

#### Step 2.1: Navigate to Backend Directory

```bash
cd backend
```

#### Step 2.2: Start Nakama Server with Docker

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- Nakama server (ports 7349, 7350, 7351)

#### Step 2.3: Verify Backend is Running

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f nakama
```

You should see:
```
nakama    | {"level":"info","ts":"...","msg":"Startup done"}
```

#### Step 2.4: Access Nakama Console

Open your browser and navigate to:
```
http://localhost:7351
```

Login with:
- **Username**: `admin`
- **Password**: `password`

### 3. Frontend Setup

#### Step 3.1: Navigate to Frontend Directory

```bash
cd ../frontend
```

#### Step 3.2: Install Dependencies

```bash
npm install
```

#### Step 3.3: Configure Environment Variables

Create `.env` file in the `frontend` directory:

```bash
# For local development
VITE_NAKAMA_SERVER_KEY=defaultkey
VITE_NAKAMA_HOST=localhost
VITE_NAKAMA_PORT=7350
VITE_NAKAMA_USE_SSL=false
```

#### Step 3.4: Start Development Server

```bash
npm run dev
```

The app should open automatically at `http://localhost:3000`

---

## 🔧 Local Development

### Running the Full Stack

#### Terminal 1: Backend
```bash
cd backend
docker-compose up
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Development Workflow

1. **Make changes** to your code
2. **Hot reload** happens automatically for frontend
3. **For Lua changes**, restart the Nakama container:
   ```bash
   docker-compose restart nakama
   ```

### Useful Commands

#### Frontend Commands
```bash
npm run dev          # Start development server
npm run bui