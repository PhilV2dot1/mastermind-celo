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
      {/* Abandon Game Button (on-chain mode, has active game) */}
      {mode === 'onchain' && isConnected && hasActiveOnChainGame && onAbandonGame && (
        <div className="bg-white/90 backdrop-blur-sm border border-orange-400 rounded-lg p-3 shadow-sm">
          <p className="text-orange-800 text-xs font-semibold mb-1">
            ⚠️ Active on-chain game detected
          </p>
          <p className="text-orange-700 text-xs mb-2">
            Abandon incomplete game to start fresh.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onAbandonGame}
            disabled={disabled}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 sm:py-3 px-4 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm touch-target"
          >
            {disabled ? 'ABANDONING...' : 'ABANDON GAME'}
          </motion.button>
        </div>
      )}

      {/* Start On-Chain Game Button (on-chain mode, connected, at start, NO active game) */}
      {mode === 'onchain' && isConnected && onPlayOnChain && gamePhase === 'playing' && !hasActiveOnChainGame && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onPlayOnChain}
          disabled={disabled}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm touch-target"
        >
          {disabled ? 'STARTING...' : 'START GAME (0.01 CELO)'}
        </motion.button>
      )}

      {/* New Game Button (free mode or after game ends) */}
      {(mode === 'free' || gamePhase !== 'playing') && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNewGame}
          disabled={disabled}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm touch-target"
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
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm touch-target"
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
