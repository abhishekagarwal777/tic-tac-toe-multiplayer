import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Client, Session, Socket } from '@heroiclabs/nakama-js';

interface NakamaContextType {
  client: Client | null;
  session: Session | null;
  socket: Socket | null;
  isConnected: boolean;
  authenticate: (username: string) => Promise<boolean>;
  disconnect: () => void;
}

export const NakamaContext = createContext<NakamaContextType | null>(null);

interface NakamaProviderProps {
  children: React.ReactNode;
}

export const NakamaProvider: React.FC<NakamaProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize Nakama client
  useEffect(() => {
    try {
      // Get server configuration from environment variables
      const serverKey = import.meta.env.VITE_NAKAMA_SERVER_KEY || 'defaultkey';
      const host = import.meta.env.VITE_NAKAMA_HOST || 'localhost';
      const port = import.meta.env.VITE_NAKAMA_PORT || '7350';
      const useSSL = import.meta.env.VITE_NAKAMA_USE_SSL === 'true';

      console.log('Initializing Nakama client with:', {
        host,
        port,
        useSSL,
        serverKey: serverKey.substring(0, 5) + '...'
      });

      // Create Nakama client
      const nakamaClient = new Client(serverKey, host, port, useSSL);
      setClient(nakamaClient);

      console.log('Nakama client initialized successfully');
    } catch (error) {
      console.error('Error initializing Nakama client:', error);
    }
  }, []);

  // Authenticate with Nakama
  const authenticate = useCallback(
    async (username: string): Promise<boolean> => {
      if (!client) {
        console.error('Client not initialized');
        return false;
      }

      try {
        console.log('Authenticating user:', username);

        // Generate a unique device ID based on username and timestamp
        const deviceId = `device_${username}_${Date.now()}`;

        // Authenticate using device authentication
        const newSession = await client.authenticateDevice(deviceId, true, username);
        console.log('Authentication successful:', {
          userId: newSession.user_id,
          username: newSession.username,
          token: newSession.token?.substring(0, 20) + '...'
        });

        setSession(newSession);

        // Store session in localStorage for persistence
        localStorage.setItem('nakama_session', JSON.stringify({
          token: newSession.token,
          refresh_token: newSession.refresh_token,
          created_at: newSession.created_at,
          expires_at: newSession.expires_at,
          username: newSession.username,
          user_id: newSession.user_id
        }));

        // Create socket connection
        await connectSocket(newSession);

        return true;
      } catch (error: any) {
        console.error('Authentication error:', error);
        throw new Error(error.message || 'Failed to authenticate');
      }
    },
    [client]
  );

  // Connect socket
  const connectSocket = async (sessionToUse: Session) => {
    if (!client) {
      console.error('Client not initialized');
      return;
    }

    try {
      console.log('Creating socket connection...');

      // Create socket with configuration
      const useSSL = import.meta.env.VITE_NAKAMA_USE_SSL === 'true';
      const newSocket = client.createSocket(useSSL, false);

      // Setup socket event listeners
      newSocket.ondisconnect = (event) => {
        console.log('Socket disconnected:', event);
        setIsConnected(false);
      };

      newSocket.onerror = (error) => {
        console.error('Socket error:', error);
        setIsConnected(false);
      };

      newSocket.onnotification = (notification) => {
        console.log('Notification received:', notification);
      };

      // Connect socket
      await newSocket.connect(sessionToUse, true);
      console.log('Socket connected successfully');

      setSocket(newSocket);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting socket:', error);
      setIsConnected(false);
      throw error;
    }
  };

  // Disconnect from Nakama
  const disconnect = useCallback(() => {
    console.log('Disconnecting from Nakama...');

    if (socket) {
      try {
        socket.disconnect(true);
      } catch (error) {
        console.error('Error disconnecting socket:', error);
      }
    }

    setSocket(null);
    setSession(null);
    setIsConnected(false);

    // Clear stored session
    localStorage.removeItem('nakama_session');

    console.log('Disconnected successfully');
  }, [socket]);

  // Try to restore session from localStorage
  useEffect(() => {
    const restoreSession = async () => {
      if (!client || session) return;

      try {
        const storedSession = localStorage.getItem('nakama_session');
        if (!storedSession) return;

        console.log('Found stored session, attempting to restore...');
        const sessionData = JSON.parse(storedSession);

        // Check if session is expired
        const now = Date.now() / 1000;
        if (sessionData.expires_at && sessionData.expires_at < now) {
          console.log('Stored session expired');
          localStorage.removeItem('nakama_session');
          return;
        }

        // Recreate session object
        const restoredSession = Session.restore(
          sessionData.token,
          sessionData.refresh_token
        );

        console.log('Session restored successfully');
        setSession(restoredSession);

        // Reconnect socket
        await connectSocket(restoredSession);
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('nakama_session');
      }
    };

    restoreSession();
  }, [client, session]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        try {
          socket.disconnect(true);
        } catch (error) {
          console.error('Error disconnecting on unmount:', error);
        }
      }
    };
  }, [socket]);

  // Monitor connection status
  useEffect(() => {
    if (!socket) {
      setIsConnected(false);
      return;
    }

    // Check if socket is connected
    const checkConnection = setInterval(() => {
      const connected = socket !== null;
      setIsConnected(connected);
    }, 5000);

    return () => clearInterval(checkConnection);
  }, [socket]);

  const value: NakamaContextType = {
    client,
    session,
    socket,
    isConnected,
    authenticate,
    disconnect
  };

  return (
    <NakamaContext.Provider value={value}>
      {children}
    </NakamaContext.Provider>
  );
};

export default NakamaProvider;