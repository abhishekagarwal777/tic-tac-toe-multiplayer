import React, { useContext, useState } from 'react';
import { NakamaContext } from '../context/NakamaContext';
import { GameContext } from '../context/GameContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const nakamaContext = useContext(NakamaContext);
  const gameContext = useContext(GameContext);
  const [showMenu, setShowMenu] = useState(false);

  const handleDisconnect = () => {
    nakamaContext?.disconnect();
    window.location.reload();
  };

  const handleLeaveMatch = () => {
    gameContext?.leaveMatch();
    setShowMenu(false);
  };

  const username = nakamaContext?.session?.username || 'Player';
  const isInMatch = gameContext?.gameState !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Tic-Tac-Toe
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Multiplayer Game
                </p>
              </div>
            </div>

            {/* User Info and Menu */}
            <div className="flex items-center space-x-4">
              {/* User Badge */}
              <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-md">
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span className="font-semibold text-sm">{username}</span>
              </div>

              {/* Mobile User Info */}
              <div className="sm:hidden flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-full shadow-md">
                <svg 
                  className="w-4 h-4" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span className="font-semibold text-xs">{username}</span>
              </div>

              {/* Menu Button */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <svg 
                  className="w-6 h-6 text-gray-700" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-4 top-16 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="py-2">
              {/* User Info in Menu */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{username}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {isInMatch ? 'In Game' : 'In Lobby'}
                </p>
              </div>

              {/* Leave Match Option */}
              {isInMatch && (
                <button
                  onClick={handleLeaveMatch}
                  className="w-full px-4 py-3 text-left text-sm text-orange-600 hover:bg-orange-50 transition-colors flex items-center space-x-2"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  <span>Leave Match</span>
                </button>
              )}

              {/* Disconnect Option */}
              <button
                onClick={handleDisconnect}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white bg-opacity-10 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                nakamaContext?.isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span className="text-white text-xs font-medium">
                {nakamaContext?.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {/* App Info */}
            <div className="text-white text-xs text-center sm:text-right">
              <p>Powered by Nakama</p>
              <p className="opacity-75">© 2024 Multiplayer Tic-Tac-Toe</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;