import React, { useState, useContext, useEffect } from 'react';
import { NakamaProvider, NakamaContext } from './context/NakamaContext';
import { GameProvider, GameContext } from './context/GameContext';
import AuthScreen from './components/AuthScreen';
import Layout from './components/Layout';
import MatchStatus from './components/MatchStatus';
import GameBoard from './components/GameBoard';

const AppContent: React.FC = () => {
  const nakamaContext = useContext(NakamaContext);
  const gameContext = useContext(GameContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Watch for login state from NakamaContext
  useEffect(() => {
    if (nakamaContext?.session && nakamaContext?.isConnected) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [nakamaContext?.session, nakamaContext?.isConnected]);

  // ✅ Show authentication screen before login
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <AuthScreen onAuthSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  // ✅ After login, show gameplay or match status
  const renderContent = () => {
    const { gameState, matchmaking } = gameContext || {};

    if (matchmaking) {
      return <MatchStatus />;
    }

    if (gameState && !gameState.game_over && gameState.players?.length === 2) {
      return <GameBoard />;
    }

    return <MatchStatus />;
  };

  return <Layout>{renderContent()}</Layout>;
};

// ✅ Wrap everything in providers
const App: React.FC = () => {
  return (
    <NakamaProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </NakamaProvider>
  );
};

export default App;
