"use client";

import { motion } from "framer-motion";

type GamePhase = 'playing' | 'won' | 'lost';

interface GameControlsProps {
  onNewGame: () => void;
  onSubmitScore?: () => void;
  onPlayOnChain?: () => void;
  onAbandonGame?: () => void;
  gamePhase: GamePhase;
  mode: 'free' | 'onchain';
  disabled: boolean;
  isConnected?: boolean;
  hasActiveOnChainGame?: boolean;
}

export function GameControls({
  onNewGame,
  onSubmitScore,
  onPlayOnChain,
  onAbandonGame,
  gamePhase,
  mode,
  disabled,
  isConnected,
  hasActiveOnChainGame,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* New Game Button (free mode or after game ends) */}
      {(mode === 'free' || gamePhase !== 'playing') && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNewGame}
          disabled={disabled}
          className="w-full bg-gradient-to-r from-celo-yellow to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          style={{
            boxShadow: "0 0 0 2px #FCFF52, 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}
        >
          {gamePhase === 'playing' ? 'NEW GAME' : 'PLAY AGAIN'}
        </motion.button>
      )}

      {/* Submit Score (on-chain mode, game over) */}
      {mode === 'onchain' && gamePhase !== 'playing' && onSubmitScore && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSubmitScore}
          disabled={disabled}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
        >
          {disabled ? 'SUBMITTING...' : 'SUBMIT SCORE'}
        </motion.button>
      )}

      {/* Instructions */}
      {gamePhase === 'playing' && (
        <p className="text-center text-gray-600 text-xs mt-1">
          Select 4 colors to make your guess
        </p>
      )}
    </div>
  );
}
