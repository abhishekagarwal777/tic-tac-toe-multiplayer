Project README-
The project is a Server-Authoritative Tic-Tac-Toe game designed as a production-ready, full-stack solution utilizing React (Vite + TypeScript) for a responsive, mobile-optimized frontend and Nakama as the real-time backend platform. The core of the design is the Server-Authoritative architecture, where the entire game state is managed exclusively by a Lua runtime module on the Nakama server. This server is responsible for validating every player move, checking for win/draw conditions, and then broadcasting the validated state back to both clients via a persistent WebSocket connection, effectively preventing cheating. Nakama's Matchmaking API handles pairing players automatically when they click "Find Match," and the system includes logic for handling graceful disconnections, ensuring a forfeit is declared if a player leaves mid-game. The deployment strategy involves running the Nakama server on a cloud VM (like AWS or DigitalOcean) and deploying the React client on Vercel, with crucial steps including opening firewall ports (7350, 7352) and updating Vercel's environment variables to point to the public Nakama host. To test, users open the game's deployed URL in two separate browser tabs, log in with unique nicknames, and initiate the match.

Key Deliverables and Setup Steps (Point Form)
1. Architecture and Core Requirements
Server-Authoritative Model: Game state (board, current_player) is managed only on the Lua backend.

Validation: Server strictly checks if a move is valid (correct turn, empty cell) before applying it.

State Broadcasting: Only validated state updates are sent from the server to clients via dispatcher:broadcast_message().

Matchmaking: Uses socket.matchFind() to pair players automatically and instantly creates a new isolated game room upon pairing.

Disconnection Handling: Lua backend logic detects player leaves (match_leave) and automatically awards a forfeit victory to the remaining player.

2. Local Setup and Installation
Backend (Nakama):

Requires Docker Desktop to be installed.

Run docker-compose -f backend/docker-compose.yml up -d from the project root.

Verify the Nakama Client API is available at http://localhost:7350.

Frontend (React):

Navigate to the frontend directory and run npm install.

Ensure frontend/.env is set to VITE_NAKAMA_HOST=localhost.

Start the app with npm run dev.

3. Deployment Steps
Nakama Server:

Provision a cloud VM (AWS/DigitalOcean) and install Docker.

Transfer code and run docker-compose -f backend/docker-compose.yml up -d on the VM.

Crucially, open firewall ports 7350 and 7352 for public access.

Frontend (Vercel):

Vercel uses the root-level vercel.json to deploy the frontend/ subdirectory.

Connect the GitHub repository to Vercel.

Update Vercel's Environment Variables (specifically VITE_NAKAMA_HOST) to point to the public IP/Hostname of the deployed Nakama server.

4. Testing Multiplayer
Open the Deployed Game URL in two separate browser tabs.

In each tab, enter a unique nickname (e.g., "P1" and "P2").

Click "Find Match" simultaneously in both tabs.

The server will pair the users, and the game board will appear, allowing "X" and "O" to play in real-time.
