import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import { NakamaContext } from '../context/NakamaContext';

const MatchStatus: React.FC = () => {
  const gameContext = useContext(GameContext);
  const nakamaContext = useContext(NakamaContext);
  const [dots, setDots] = useState('');

  // Animated dots for loading states
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!gameContext || !nakamaContext) {
    return null;
  }

  const { gameState, matchmaking, findMatch, leaveMatch } = gameContext;
  const { session } = nakamaContext;

  // Finding Match State
  if (matchmaking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          {/* Animated Search Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <svg 
                  className="w-12 h-12 text-white animate-spin" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
              <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Status Text */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Finding Match{dots}
          </h2>
          <p className="text-gray-600 mb-6">
            Searching for an opponent
          </p>

          {/* Loading Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left rounded">
            <p className="text-sm text-blue-800 font-semibold mb-1">
              💡 Quick Tip
            </p>
            <p className="text-xs text-blue-700">
              X always goes first. Be ready to make your move!
            </p>
          </div>

          {/* Cancel Button */}
          <button
            onClick={leaveMatch}
            className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
          >
            Cancel Search
          </button>
        </div>
      </div>
    );
  }

  // Waiting for Second Player
  if (gameState && gameState.players && gameState.players.length === 1) {
    const currentPlayer = gameState.players[0];
    const isCurrentUser = session?.user_id === currentPlayer.user_id;

    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          {/* Waiting Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Waiting for Opponent{dots}
          </h2>
          <p className="text-gray-600 mb-6">
            Another player will join soon
          </p>

          {/* Player Info */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl mb-6">
            <p className="text-sm opacity-90 mb-1">You are</p>
            <p className="text-2xl font-bold">
              {currentPlayer.symbol === 1 ? 'X' : 'O'}
            </p>
          </div>

          {/* Leave Button */}
          <button
            onClick={leaveMatch}
            className="w-full py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
          >
            Leave Match
          </button>
        </div>
      </div>
    );
  }

  // Game Over State
  if (gameState && gameState.game_over) {
    const currentPlayer = gameState.players?.find(
      (p) => p.user_id === session?.user_id
    );
    const winner = gameState.winner;
    
    let resultMessage = '';
    let resultIcon = null;
    let resultColor = '';

    if (winner === 'draw') {
      resultMessage = "It's a Draw!";
      resultColor = 'from-yellow-400 to-orange-500';
      resultIcon = (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (winner === 'opponent_left') {
      resultMessage = 'Opponent Left';
      resultColor = 'from-gray-400 to-gray-600';
      resultIcon = (
        <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg>
      );
    } else if (winner === currentPlayer?.symbol) {
      resultMessage = 'You Win! 🎉';
      resultColor = 'from-green-400 to-green-600';
      resultIcon = (
        <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    } else {
      resultMessage = 'You Lose';
      resultColor = 'from-red-400 to-red-600';
      resultIcon = (
        <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }

    return (
      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto text-center">
          {/* Result Icon */}
          <div className="mb-6 flex justify-center">
            <div className={`w-24 h-24 bg-gradient-to-br ${resultColor} rounded-full flex items-center justify-center shadow-lg`}>
              {resultIcon}
            </div>
          </div>

          {/* Result Message */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {resultMessage}
          </h2>

          {/* Winner Info */}
          {winner !== 'draw' && winner !== 'opponent_left' && gameState.players && (
            <div className="mb-6">
              {gameState.players.map((player) => {
                if (player.symbol === winner) {
                  return (
                    <p key={player.user_id} className="text-gray-600">
                      <span className="font-semibold text-purple-600">
                        {player.username}
                      </span>
                      {' '}won the game!
                    </p>
                  );
                }
                return null;
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                leaveMatch();
                setTimeout(() => findMatch(), 500);
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
            <button
              onClick={leaveMatch}
              className="w-full py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No Match State (Lobby)
  if (!gameState) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          {/* Welcome Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>

          {/* Welcome Message */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Ready to Play?
          </h2>
          <p className="text-gray-600 mb-8">
            Find a match and challenge players worldwide!
          </p>

          {/* Game Rules */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-8 text-left">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              How to Play
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Get 3 in a row (horizontal, vertical, or diagonal) to win</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>X always goes first</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Take turns placing your symbol</span>
              </li>
            </ul>
          </div>

          {/* Start Button */}
          <button
            onClick={findMatch}
            disabled={matchmaking}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg rounded-lg transition duration-200 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Find Match
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MatchStatus;