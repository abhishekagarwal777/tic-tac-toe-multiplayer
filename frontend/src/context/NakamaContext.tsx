import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Client, Session, Socket, WebSocketAdapter, Match } from '@heroiclabs/nakama-js';
import { GameState, GameUpdate } from '../types/game'; // Assuming we'll define these types later

// --- Configuration ---
// These variables must be set in Vercel environment settings
const NAKAMA_HOST = import.meta.env.VITE_NAKAMA_HOST || 'localhost';
const NAKAMA_PORT = import.meta.env.VITE_NAKAMA_PORT || '7350';
const NAKAMA_KEY = import.meta.env.VITE_NAKAMA_SERVER_KEY || 'defaultkey';

// Determines if we use 'http' or 'https' and 'ws' or 'wss'
const USE_SSL = NAKAMA_HOST !== 'localhost'; 

// --- Context Types ---
interface NakamaContextType {
  client: Client | null;
  session: Session | null;
  socket: Socket | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  match: Match | null;
  matchState: GameState | null;
  connectAndAuthenticate: (nickname: string) => void;
  findMatch: (min: number, max: number) => void;
  leaveMatch: () => void;
  sendMatchData: (opCode: number, data: any) => void;
}

const NakamaContext = createContext<NakamaContextType | undefined>(undefined);

export const NakamaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Real-time Game State
  const [match, setMatch] = useState<Match | null>(null);
  const [matchState, setMatchState] = useState<GameState | null>(null);

  // 1. Initialize Client on Mount
  useEffect(() => {
    try {
      // Create a new Nakama client instance
      const protocol = USE_SSL ? 'https' : 'http';
      const runtimeClient = new Client(NAKAMA_KEY, NAKAMA_HOST, NAKAMA_PORT, USE_SSL, protocol);
      setClient(runtimeClient);
      setIsLoading(false);
    } catch (e) {
      setError("Nakama Client initialization failed.");
      setIsLoading(false);
    }
  }, []);

  // 2. Authentication (Anonymous Login)
  const connectAndAuthenticate = async (nickname: string) => {
    if (!client) return;
    setIsLoading(true);
    setError(null);
    try {
      // 1. Authenticate (using a device ID for simplicity, ideal for mobile-first)
      let currentSession: Session;
      
      // Use Nickname as the Device ID for simple testing and clarity
      currentSession = await client.authenticateDevice(nickname, true, nickname); 
      setSession(currentSession);
      setUserId(currentSession.user_id);

      // 2. Connect the Realtime Socket
      const socketProtocol = USE_SSL ? 'wss' : 'ws';
      const runtimeSocket = client.createSocket(USE_SSL, socketProtocol, new WebSocketAdapter(USE_SSL));
      
      await runtimeSocket.connect(currentSession, true);
      setSocket(runtimeSocket);
      
      // 3. Setup Socket Listeners
      runtimeSocket.onmatchdata = (matchData: Match) => {
        // Parse the game state payload received from the server (Lua)
        const update: GameUpdate = JSON.parse(new TextDecoder().decode(matchData.data));
        setMatchState(update.state); // Update the board, status, etc.
      };

      runtimeSocket.onmatchpresence = (presence) => {
        // Handle players joining or leaving the match
        if (presence.leaves.length > 0) {
          setError("Opponent disconnected!");
          setMatch(null);
          setMatchState(null);
        }
      };

      runtimeSocket.onmatchmakermatched = (matchmakerMatched) => {
        // A match was found, now join the match
        runtimeSocket.joinMatch(matchmakerMatched.match_id).then(match => {
            setMatch(match);
            setError(null);
        });
      };

    } catch (e: any) {
      console.error("Authentication or Socket connection failed:", e);
      // The "Failed to fetch" error usually surfaces here
      setError(`Connection Error: Check NAKAMA_HOST and ensure ports 7350 and 7352 are open. Original error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Matchmaking and Game Actions
  const findMatch = (minPlayers: number = 2, maxPlayers: number = 2) => {
    if (!socket || !session) return setError("Not connected to server.");
    setError("Finding a random player...");
    // 1. Add player to the matchmaker pool
    socket.addMatchmaker(session.username, minPlayers, maxPlayers);
  };
  
  const leaveMatch = () => {
    if (socket && match) {
        socket.leaveMatch(match.match_id);
    }
    setMatch(null);
    setMatchState(null);
    setError("Match left.");
  };

  const sendMatchData = (opCode: number, data: any) => {
    if (!socket || !match) return setError("No active match to send data to.");
    
    // Convert data to JSON string and then to a Uint8Array (required by Nakama)
    const payload = JSON.stringify(data);
    const dataBuffer = new TextEncoder().encode(payload);
    
    // Send the move to the server (Lua runtime)
    socket.sendMatchData(match.match_id, opCode, dataBuffer);
  };

  const contextValue = useMemo(() => ({
    client,
    session,
    socket,
    userId,
    isAuthenticated: !!session,
    isLoading,
    error,
    match,
    matchState,
    connectAndAuthenticate,
    findMatch,
    leaveMatch,
    sendMatchData,
  }), [client, session, socket, userId, isLoading, error, match, matchState]);

  return (
    <NakamaContext.Provider value={contextValue}>
      {children}
    </NakamaContext.Provider>
  );
};

export const useNakama = () => {
  const context = useContext(NakamaContext);
  if (!context) {
    throw new Error('useNakama must be used within a NakamaProvider');
  }
  return context;
};

// Next files to create: frontend/src/types/game.ts and frontend/src/App.tsx
