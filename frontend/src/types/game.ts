// Game constants
export const EMPTY = 0;
export const PLAYER_X = 1;
export const PLAYER_O = 2;

// Player type
export interface Player {
  user_id: string;
  username: string;
  symbol: number; // 1 for X, 2 for O
  session_id?: string;
}

// Game state interface
export interface GameState {
  board: number[]; // Array of 9 numbers (0=empty, 1=X, 2=O)
  current_turn: number; // 1 for X, 2 for O
  game_over: boolean;
  winner: number | string | null; // 1, 2, 'draw', 'opponent_left', or null
  move_count: number;
  players?: Player[];
  turn_start_time?: number | null;
  turn_duration?: number;
  timer_enabled?: boolean;
  reason?: string; // Additional info like 'timeout'
}

// Match data from Nakama socket
export interface MatchData {
  match_id: string;
  op_code: number;
  data: string; // JSON string that needs to be parsed
  presence?: MatchPresence;
}

// Match presence information
export interface MatchPresence {
  user_id: string;
  session_id: string;
  username: string;
  node: string;
}

// Matchmaker matched response
export interface MatchmakerMatched {
  match_id: string;
  token: string;
  users: MatchmakerUser[];
  self: MatchmakerUser;
}

// Matchmaker user
export interface MatchmakerUser {
  presence: MatchPresence;
  string_properties?: Record<string, string>;
  numeric_properties?: Record<string, number>;
}

// Operation codes for client-server communication
export enum OpCode {
  MAKE_MOVE = 1,
  GAME_STATE = 2,
  GAME_OVER = 3,
  PLAYER_JOINED = 4,
  PLAYER_LEFT = 5
}

// Move data sent to server
export interface MoveData {
  op_code: OpCode.MAKE_MOVE;
  position: number; // 1-9 (Lua uses 1-indexed arrays)
}

// Game state data received from server
export interface GameStateData {
  op_code: OpCode.GAME_STATE;
  board: number[];
  current_turn: number;
  game_over: boolean;
  winner: number | string | null;
  move_count: number;
  players: Player[];
  turn_start_time?: number | null;
  turn_duration?: number;
  timer_enabled?: boolean;
}

// Game over data received from server
export interface GameOverData {
  op_code: OpCode.GAME_OVER;
  winner: number | string;
  reason?: string;
}

// Player joined data received from server
export interface PlayerJoinedData {
  op_code: OpCode.PLAYER_JOINED;
  player: Player;
  player_count: number;
}

// Player left data received from server
export interface PlayerLeftData {
  op_code: OpCode.PLAYER_LEFT;
  user_id: string;
}

// Union type for all possible server messages
export type ServerMessage =
  | GameStateData
  | GameOverData
  | PlayerJoinedData
  | PlayerLeftData;

// Leaderboard record
export interface LeaderboardRecord {
  leaderboard_id: string;
  owner_id: string;
  username: string;
  score: number;
  subscore: number;
  num_score: number;
  metadata?: string;
  create_time: string;
  update_time: string;
  expiry_time?: string;
  rank: number;
}

// Leaderboard list response
export interface LeaderboardList {
  records: LeaderboardRecord[];
  owner_records: LeaderboardRecord[];
  next_cursor?: string;
  prev_cursor?: string;
}

// Match metadata
export interface MatchMetadata {
  open: boolean;
  game_mode: 'classic' | 'timed';
}

// Helper type guards
export const isGameStateData = (data: any): data is GameStateData => {
  return data && data.op_code === OpCode.GAME_STATE;
};

export const isGameOverData = (data: any): data is GameOverData => {
  return data && data.op_code === OpCode.GAME_OVER;
};

export const isPlayerJoinedData = (data: any): data is PlayerJoinedData => {
  return data && data.op_code === OpCode.PLAYER_JOINED;
};

export const isPlayerLeftData = (data: any): data is PlayerLeftData => {
  return data && data.op_code === OpCode.PLAYER_LEFT;
};

// Utility function to get symbol display
export const getSymbolDisplay = (symbol: number): string => {
  switch (symbol) {
    case PLAYER_X:
      return 'X';
    case PLAYER_O:
      return 'O';
    default:
      return '';
  }
};

// Utility function to check if board position is valid
export const isValidPosition = (position: number): boolean => {
  return position >= 0 && position < 9;
};

// Utility function to check if cell is empty
export const isCellEmpty = (board: number[], position: number): boolean => {
  return isValidPosition(position) && board[position] === EMPTY;
};

// Winning line combinations
export const WINNING_LINES = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6]  // Diagonal top-right to bottom-left
];

// Check if a line is a winning line
export const checkWinningLine = (
  board: number[],
  line: number[]
): number | null => {
  const [a, b, c] = line;
  if (board[a] !== EMPTY && board[a] === board[b] && board[a] === board[c]) {
    return board[a];
  }
  return null;
};

// Find winning line on the board
export const findWinningLine = (board: number[]): number[] | null => {
  for (const line of WINNING_LINES) {
    if (checkWinningLine(board, line) !== null) {
      return line;
    }
  }
  return null;
};