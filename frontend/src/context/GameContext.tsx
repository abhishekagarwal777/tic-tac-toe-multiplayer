import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { NakamaContext } from './NakamaContext';
import { GameState, MatchData, Player } from '../types/game';

interface GameContextType {
  gameState: GameState | null;
  matchmaking: boolean;
  findMatch: () => Promise<void>;
  makeMove: (position: number) => void;
  leaveMatch: () => void;
}

export const GameContext = createContext<GameContextType | null>(null);

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const nakamaContext = useContext(NakamaContext);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [matchmaking, setMatchmaking] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);

  // OpCodes matching the Lua server
  const OpCodes = {
    MAKE_MOVE: 1,
    GAME_STATE: 2,
    GAME_OVER: 3,
    PLAYER_JOINED: 4,
    PLAYER_LEFT: 5
  };

  // Handle match data messages from server
  const handleMatchData = useCallback((matchData: MatchData) => {
    console.log('Received match data:', matchData);

    try {
      const data = JSON.parse(matchData.data);
      
      switch (data.op_code) {
        case OpCodes.GAME_STATE:
          setGameState({
            board: data.board,
            current_turn: data.current_turn,
            game_over: data.game_over,
            winner: data.winner,
            move_count: data.move_count,
            players: data.players,
            turn_start_time: data.turn_start_time,
            turn_duration: data.turn_duration,
            timer_enabled: data.timer_enabled
          });
          setMatchmaking(false);
          break;

        case OpCodes.PLAYER_JOINED:
          console.log('Player joined:', data.player);
          // Update player list when a new player joins
          if (gameState) {
            setGameState((prev) => {
              if (!prev) return prev;
              const playerExists = prev.players?.some(p => p.user_id === data.player.user_id);
              if (playerExists) return prev;
              
              return {
                ...prev,
                players: [...(prev.players || []), data.player]
              };
            });
          }
          break;

        case OpCodes.PLAYER_LEFT:
          console.log('Player left:', data.user_id);
          // Handle player leaving
          if (gameState && !gameState.game_over) {
            setGameState((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                game_over: true,
                winner: 'opponent_left'
              };
            });
          }
          break;

        case OpCodes.GAME_OVER:
          console.log('Game over:', data);
          setGameState((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              game_over: true,
              winner: data.winner,
              reason: data.reason
            };
          });
          break;

        default:
          console.log('Unknown op_code:', data.op_code);
      }
    } catch (error) {
      console.error('Error parsing match data:', error);
    }
  }, [gameState, OpCodes]);

  // Handle match presence changes
  const handleMatchPresence = useCallback((presence: any) => {
    console.log('Match presence event:', presence);

    // Handle players leaving
    if (presence.leaves && presence.leaves.length > 0) {
      console.log('Players left:', presence.leaves);
      if (gameState && !gameState.game_over) {
        setGameState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            game_over: true,
            winner: 'opponent_left'
          };
        });
      }
    }

    // Handle players joining
    if (presence.joins && presence.joins.length > 0) {
      console.log('Players joined:', presence.joins);
    }
  }, [gameState]);

  // Setup socket listeners
  useEffect(() => {
    if (!nakamaContext?.socket) return;

    const socket = nakamaContext.socket;

    // Listen for match data
    socket.onmatchdata = (matchData: MatchData) => {
      handleMatchData(matchData);
    };

    // Listen for match presence events
    socket.onmatchpresence = (presence: any) => {
      handleMatchPresence(presence);
    };

    return () => {
      // Cleanup listeners
      socket.onmatchdata = () => {};
      socket.onmatchpresence = () => {};
    };
  }, [nakamaContext?.socket, handleMatchData, handleMatchPresence]);

  // Find a match
  const findMatch = async () => {
    if (!nakamaContext?.socket || !nakamaContext?.session) {
      console.error('Socket or session not available');
      return;
    }

    setMatchmaking(true);
    setGameState(null);

    try {
      console.log('Starting matchmaking...');

      // Create matchmaking ticket
      const matchmakerTicket = await nakamaContext.socket.addMatchmaker(
        2, // min players
        2, // max players
        '*', // query
        {}, // string properties
        {}, // numeric properties
        undefined // count multiple (optional)
      );

      console.log('Matchmaker ticket created:', matchmakerTicket);

      // Listen for matchmaker matched event
      nakamaContext.socket.onmatchmakermatched = async (matched) => {
        console.log('Matchmaker matched:', matched);

        try {
          // Join the match
          const match = await nakamaContext.socket!.joinMatch(matched.match_id);
          console.log('Joined match:', match);
          
          setCurrentMatchId(match.match_id);
          setMatchmaking(false);

          // Initialize game state with empty board
          setGameState({
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            current_turn: 1, // X goes first
            game_over: false,
            winner: null,
            move_count: 0,
            players: [],
            turn_start_time: null,
            turn_duration: 30,
            timer_enabled: false
          });
        } catch (error) {
          console.error('Error joining match:', error);
          setMatchmaking(false);
        }
      };
    } catch (error) {
      console.error('Error finding match:', error);
      setMatchmaking(false);
    }
  };

  // Make a move
  const makeMove = (position: number) => {
    if (!nakamaContext?.socket || !currentMatchId) {
      console.error('Socket or match ID not available');
      return;
    }

    if (!gameState || gameState.game_over) {
      console.error('Game is over or not started');
      return;
    }

    // Validate it's the player's turn
    const currentPlayer = gameState.players?.find(
      (p) => p.user_id === nakamaContext.session?.user_id
    );

    if (!currentPlayer || currentPlayer.symbol !== gameState.current_turn) {
      console.error('Not your turn');
      return;
    }

    // Validate cell is empty
    if (gameState.board[position] !== 0) {
      console.error('Cell is not empty');
      return;
    }

    console.log('Making move at position:', position);

    try {
      // Send move to server
      const moveData = JSON.stringify({
        op_code: OpCodes.MAKE_MOVE,
        position: position + 1 // Lua arrays are 1-indexed
      });

      nakamaContext.socket.sendMatchState(
        currentMatchId,
        OpCodes.MAKE_MOVE,
        moveData
      );
    } catch (error) {
      console.error('Error making move:', error);
    }
  };

  // Leave match
  const leaveMatch = () => {
    if (!nakamaContext?.socket || !currentMatchId) {
      console.log('No active match to leave');
      setGameState(null);
      setMatchmaking(false);
      setCurrentMatchId(null);
      return;
    }

    try {
      console.log('Leaving match:', currentMatchId);
      nakamaContext.socket.leaveMatch(currentMatchId);
      setGameState(null);
      setMatchmaking(false);
      setCurrentMatchId(null);
    } catch (error) {
      console.error('Error leaving match:', error);
      setGameState(null);
      setMatchmaking(false);
      setCurrentMatchId(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentMatchId && nakamaContext?.socket) {
        try {
          nakamaContext.socket.leaveMatch(currentMatchId);
        } catch (error) {
          console.error('Error leaving match on unmount:', error);
        }
      }
    };
  }, [currentMatchId, nakamaContext?.socket]);

  const value: GameContextType = {
    gameState,
    matchmaking,
    findMatch,
    makeMove,
    leaveMatch
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameProvider;