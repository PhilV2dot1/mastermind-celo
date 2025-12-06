"use client";

import { useMastermind } from "@/hooks/useMastermind";
import { ColorPalette } from "@/components/ColorPalette";
import { CurrentGuess } from "@/components/CurrentGuess";
import { GameHistory } from "@/components/GameHistory";
import { GameControls } from "@/components/GameControls";
import { GameStats } from "@/components/GameStats";
import { ModeToggle } from "@/components/ModeToggle";
import { WalletConnect } from "@/components/WalletConnect";
import { FarcasterShare } from "@/components/FarcasterShare";
import { FeedbackLegend } from "@/components/FeedbackLegend";
import { MAX_ATTEMPTS } from "@/lib/game-logic";

export default function MastermindGame() {
  const {
    mode,
    gamePhase,
    currentGuess,
    history,
    attempts,
    message,
    stats,
    hasActiveOnChainGame,
    isConnected,
    isPending,
    updateGuess,
    submitGuess,
    newGame,
    playOnChain,
    submitScoreOnChain,
    switchMode,
    abandonGame,
  } = useMastermind();

  // Find first empty position in guess
  const firstEmptyPosition = currentGuess.findIndex(c => c === null);

  // Calculate score for display
  const calculateDisplayScore = () => {
    if (gamePhase === 'won') {
      return Math.max(0, 100 - (attempts * 10));
    }
    return 0;
  };

  return (
    <div className="min-h-screen p-2 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header - Compact for mobile */}
        <header className="text-center mb-2 sm:mb-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 drop-shadow-sm">
            🎯 Mastermind on Celo
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Crack the 4-color code in {MAX_ATTEMPTS} attempts!
          </p>
        </header>

        {/* Mode Toggle - Centered */}
        <div className="flex justify-center mb-2 sm:mb-4">
          <ModeToggle mode={mode} onToggle={switchMode} />
        </div>

        {/* Wallet Connection (On-Chain Mode Only) */}
        {mode === 'onchain' && (
          <div className="mb-3">
            <WalletConnect
              mode={mode}
              hasActiveOnChainGame={hasActiveOnChainGame}
              onPlayOnChain={playOnChain}
              onAbandonGame={abandonGame}
              gameIsPending={isPending}
              abandonPending={isPending}
            />
          </div>
        )}

        {/* Message */}
        {message && (
          <div className="mb-2 p-2 sm:p-3 bg-white/90 backdrop-blur-sm border border-celo-yellow rounded-lg text-center font-semibold text-xs sm:text-sm text-gray-900 shadow-sm">
            {message}
          </div>
        )}

        {/* Main Game Area - Compact for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-3">
          {/* Game Board (spans 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-1.5 sm:space-y-3">
            {/* Attempts Counter */}
            <div className="text-center text-sm sm:text-base font-bold text-gray-900 bg-white/60 backdrop-blur-sm py-2 rounded-lg">
              Attempt: {attempts} / {MAX_ATTEMPTS}
            </div>

            {/* Feedback Legend */}
            <FeedbackLegend />

            {/* Game History */}
            <GameHistory history={history} maxAttempts={MAX_ATTEMPTS} />

            {/* Current Guess & Color Palette (only during play) */}
            {gamePhase === 'playing' && (
              <>
                <CurrentGuess
                  guess={currentGuess}
                  onClearPosition={(pos) => updateGuess(pos, null)}
                  disabled={isPending}
                />

                {/* Color Palette */}
                <ColorPalette
                  onSelectColor={(color) => {
                    if (firstEmptyPosition !== -1) {
                      updateGuess(firstEmptyPosition, color);
                    }
                  }}
                  disabled={isPending || firstEmptyPosition === -1}
                />

                {/* Submit Guess Button */}
                <button
                  onClick={submitGuess}
                  disabled={isPending || currentGuess.some(c => c === null)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                >
                  SUBMIT GUESS
                </button>
              </>
            )}

            {/* Game Controls */}
            <GameControls
              onNewGame={newGame}
              onSubmitScore={mode === 'onchain' ? submitScoreOnChain : undefined}
              onPlayOnChain={mode === 'onchain' ? playOnChain : undefined}
              onAbandonGame={mode === 'onchain' ? abandonGame : undefined}
              gamePhase={gamePhase}
              mode={mode}
              disabled={isPending}
              isConnected={isConnected}
              hasActiveOnChainGame={hasActiveOnChainGame}
            />
          </div>

          {/* Stats Sidebar - Hidden on mobile when game is active */}
          <div className={`${gamePhase === 'playing' ? 'hidden lg:block' : ''}`}>
            <GameStats stats={stats} mode={mode} />
          </div>
        </div>

        {/* Share Button (after game ends) - Compact */}
        {gamePhase !== 'playing' && (
          <div className="mb-3">
            <FarcasterShare
              gamePhase={gamePhase}
              score={calculateDisplayScore()}
              attempts={attempts}
              stats={stats}
            />
          </div>
        )}

        {/* Footer - Smaller on mobile */}
        <footer className="text-center text-gray-500 text-xs mt-4 sm:mt-8 pb-4">
          <p className="hidden sm:block">
            Built with ❤️ on{" "}
            <a
              href="https://celo.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 font-semibold hover:text-celo-yellow transition-colors"
            >
              Celo
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
