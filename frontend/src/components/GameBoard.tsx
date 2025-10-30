import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { NakamaContext } from '../context/NakamaContext';

const GameBoard: React.FC = () => {
  const gameContext = useContext(GameContext);
  const nakamaContext = useContext(NakamaContext);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);

  if (!gameContext || !nakamaContext) {
    return null;
  }

  const { gameState, makeMove } = gameContext;
  const { session } = nakamaContext;

  // Get current player's symbol
  const getCurrentPlayerSymbol = (): number | null => {
    if (!session || !gameState?.players) return null;
    
    const currentPlayer = gameState.players.find(
      (p) => p.user_id === session.user_id
    );
    return currentPlayer ? currentPlayer.symbol : null;
  };

  const currentPlayerSymbol = getCurrentPlayerSymbol();
  const isMyTurn = gameState?.current_turn === currentPlayerSymbol;
  const canPlay = isMyTurn && !gameState?.game_over && gameState?.players?.length === 2;

  // Handle cell click
  const handleCellClick = (index: number) => {
    if (!canPlay) return;
    if (gameState?.board[index] !== 0) return;

    setSelectedCell(index);
    setTimeout(() => setSelectedCell(null), 300);
    
    makeMove(index);
  };

  // Get symbol display (X or O)
  const getSymbolDisplay = (value: number) => {
    if (value === 1) return 'X';
    if (value === 2) return 'O';
    return '';
  };

  // Get symbol color
  const getSymbolColor = (value: number) => {
    if (value === 1) return 'text-blue-600';
    if (value === 2) return 'text-pink-600';
    return '';
  };

  // Check if cell is part of winning line
  const isWinningCell = (index: number): boolean => {
    if (!gameState?.game_over || !gameState?.winner || gameState.winner === 'draw') {
      return false;
    }

    const board = gameState.board;
    const winner = gameState.winner;

    const winningLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const line of winningLines) {
      if (line.includes(index) && 
          board[line[0]] === winner && 
          board[line[1]] === winner && 
          board[line[2]] === winner) {
        return true;
      }
    }

    return false;
  };

  // Get cell styling
  const getCellClassName = (index: number) => {
    const baseClasses = 'aspect-square flex items-center justify-center text-5xl md:text-6xl font-bold rounded-xl transition-all duration-200 cursor-pointer';
    
    let classes = baseClasses;

    // Winning cell highlight
    if (isWinningCell(index)) {
      classes += ' bg-gradient-to-br from-yellow-300 to-yellow-400 shadow-lg scale-105';
    }
    // Empty cell states
    else if (gameState?.board[index] === 0) {
      if (canPlay) {
        classes += ' bg-white hover:bg-gradient-to-br hover:from-purple-100 hover:to-blue-100 hover:shadow-md hover:scale-105 border-2 border-gray-200';
      } else {
        classes += ' bg-gray-100 border-2 border-gray-200 cursor-not-allowed';
      }
    }
    // Filled cell
    else {
      classes += ' bg-white border-2 border-gray-300 shadow-sm';
    }

    // Selected animation
    if (selectedCell === index) {
      classes += ' animate-pulse';
    }

    return classes;
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Game Board Grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 bg-gradient-to-br from-gray-200 to-gray-300 p-3 md:p-4 rounded-2xl shadow-xl">
        {gameState?.board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={!canPlay || cell !== 0}
            className={getCellClassName(index)}
            aria-label={`Cell ${index + 1}`}
          >
            {cell !== 0 && (
              <span 
                className={`${getSymbolColor(cell)} ${
                  isWinningCell(index) ? 'animate-bounce' : ''
                }`}
              >
                {getSymbolDisplay(cell)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Turn Indicator */}
      {!gameState?.game_over && gameState?.players?.length === 2 && (
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center px-6 py-3 rounded-full font-semibold text-lg ${
            isMyTurn 
              ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg animate-pulse' 
              : 'bg-gray-200 text-gray-700'
          }`}>
            {isMyTurn ? (
              <>
                <svg 
                  className="w-5 h-5 mr-2 animate-spin" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Your Turn
              </>
            ) : (
              <>
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Opponent's Turn
              </>
            )}
          </div>
        </div>
      )}

      {/* Game Instructions for Empty State */}
      {!gameState?.game_over && gameState?.players?.length === 2 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {canPlay 
              ? 'Tap any empty cell to make your move' 
              : 'Wait for your opponent to make their move'
            }
          </p>
        </div>
      )}

      {/* Player Info Cards */}
      {gameState?.players && gameState.players.length > 0 && (
        <div className="mt-6 space-y-3">
          {gameState.players.map((player) => {
            const isCurrentUser = session?.user_id === player.user_id;
            const isPlayerTurn = gameState.current_turn === player.symbol;
            
            return (
              <div
                key={player.user_id}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                  isPlayerTurn && !gameState.game_over
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-800 shadow-md'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl ${
                    player.symbol === 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-pink-500 text-white'
                  }`}>
                    {getSymbolDisplay(player.symbol)}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {player.username}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs font-normal opacity-75">
                          (You)
                        </span>
                      )}
                    </p>
                    {isPlayerTurn && !gameState.game_over && (
                      <p className="text-xs opacity-90">
                        Making move...
                      </p>
                    )}
                  </div>
                </div>
                {isPlayerTurn && !gameState.game_over && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GameBoard;