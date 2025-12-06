"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain } from "wagmi";
import { celo } from "wagmi/chains";
import {
  Code,
  Guess,
  Feedback,
  GameHistory,
  generateSecretCode,
  evaluateGuess,
  isValidGuess,
  hasWon,
  calculateScore,
  Color,
} from "@/lib/game-logic";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract-abi";

type GamePhase = 'playing' | 'won' | 'lost';
type GameMode = 'free' | 'onchain';

interface GameStats {
  wins: number;
  losses: number;
  totalGames: number;
  averageAttempts: number;
  bestScore: number;
}

const STORAGE_KEYS = {
  FREE_STATS: 'mastermind_free_stats',
};

export function useMastermind() {
  // Game state
  const [mode, setMode] = useState<GameMode>('free');
  const [gamePhase, setGamePhase] = useState<GamePhase>('playing');
  const [secretCode, setSecretCode] = useState<Code>(() => generateSecretCode());
  const [currentGuess, setCurrentGuess] = useState<Guess>([null, null, null, null]);
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');

  // Stats (for display)
  const [freeStats, setFreeStats] = useState<GameStats>({
    wins: 0,
    losses: 0,
    totalGames: 0,
    averageAttempts: 0,
    bestScore: 0,
  });

  // Wagmi hooks
  const { address, isConnected, chain } = useAccount();
  const { writeContract, data: hash, isPending, error: writeError, reset: resetWrite } = useWriteContract();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();

  // Read on-chain stats
  const { data: onchainStats, refetch: refetchStats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getStats',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && mode === 'onchain' && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  // Check if user has an active on-chain game
  const { data: activeGameData, refetch: refetchActiveGame } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hasActiveGame',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && mode === 'onchain' && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedStats = localStorage.getItem(STORAGE_KEYS.FREE_STATS);
    if (savedStats) {
      try {
        setFreeStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Failed to parse saved stats:', e);
      }
    }
  }, []);

  // Check if user has an active on-chain game (compute early)
  const hasActiveOnChainGame = activeGameData ? activeGameData[0] : false;

  // Debug logging for active game state
  useEffect(() => {
    if (mode === 'onchain' && isConnected) {
      console.log('🎮 Active game state:', { hasActiveOnChainGame, activeGameData });
    }
  }, [hasActiveOnChainGame, activeGameData, mode, isConnected]);

  // Refetch active game state when wallet connects or address changes
  useEffect(() => {
    if (isConnected && address && mode === 'onchain') {
      console.log('🔄 Wallet connected, refetching active game state...');
      const timer = setTimeout(() => {
        refetchActiveGame();
        refetchStats();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, address, mode, refetchActiveGame, refetchStats]);

  // Handle transaction receipt
  useEffect(() => {
    if (receipt) {
      console.log('✅ Transaction receipt received:', receipt.transactionHash);

      // Show success message
      setMessage('✅ Transaction completed successfully!');

      // Refetch active game state and stats
      const refetchData = async () => {
        console.log('🔄 Refetching active game and stats...');
        await refetchActiveGame();
        await refetchStats();
        console.log('✅ Refetch completed');

        // Small delay to ensure state updates, then reset game
        setTimeout(() => {
          console.log('🎮 Resetting game state');
          newGame();
        }, 500);
      };

      refetchData();

      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  }, [receipt, refetchStats, refetchActiveGame]);

  // Handle write contract errors
  useEffect(() => {
    if (writeError) {
      console.error('❌ Write contract error:', writeError);

      // Extract user-friendly error message
      const errorMessage = writeError.message || 'Unknown error';

      if (errorMessage.includes('User rejected') || errorMessage.includes('User denied')) {
        setMessage('❌ Transaction cancelled by user');
      } else if (errorMessage.includes('insufficient funds')) {
        setMessage('❌ Insufficient funds for transaction');
      } else if (errorMessage.includes('already has an active game')) {
        setMessage('❌ You already have an active game. Abandon it first.');
      } else {
        setMessage(`❌ Transaction failed: ${errorMessage.slice(0, 50)}...`);
      }

      // Clear error message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  }, [writeError]);

  // Update stats when game ends (free mode only)
  const updateStatsOnGameEnd = useCallback((won: boolean, attemptsUsed: number) => {
    if (mode !== 'free' || typeof window === 'undefined') return;

    const score = calculateScore(won, attemptsUsed);
    const newStats = { ...freeStats };
    newStats.totalGames++;

    if (won) {
      newStats.wins++;
      // Calculate new average attempts
      const totalAttempts = (freeStats.averageAttempts * freeStats.wins) + attemptsUsed;
      newStats.averageAttempts = Math.round(totalAttempts / newStats.wins);
      if (score > newStats.bestScore) {
        newStats.bestScore = score;
      }
    } else {
      newStats.losses++;
    }

    setFreeStats(newStats);
    localStorage.setItem(STORAGE_KEYS.FREE_STATS, JSON.stringify(newStats));
  }, [mode, freeStats]);

  // Update current guess at specific position
  const updateGuess = useCallback((position: number, color: Color | null) => {
    const newGuess = [...currentGuess] as Guess;
    newGuess[position] = color;
    setCurrentGuess(newGuess);
  }, [currentGuess]);

  // Submit guess
  const submitGuess = useCallback(() => {
    if (!isValidGuess(currentGuess)) {
      setMessage('❌ Please select all 4 colors');
      return;
    }

    if (gamePhase !== 'playing') return;

    const feedback = evaluateGuess(secretCode, currentGuess);
    const newAttempts = attempts + 1;

    setHistory([...history, { guess: currentGuess as Code, feedback }]);
    setAttempts(newAttempts);
    setCurrentGuess([null, null, null, null]);

    // Check win
    if (hasWon(feedback)) {
      setGamePhase('won');
      const score = calculateScore(true, newAttempts);
      const msg = mode === 'onchain'
        ? `🎉 You cracked the code in ${newAttempts} attempts! Score: ${score}. Submit on-chain!`
        : `🎉 You cracked the code in ${newAttempts} attempts! Score: ${score}`;
      setMessage(msg);
      updateStatsOnGameEnd(true, newAttempts);
      return;
    }

    // Check lose
    if (newAttempts >= 10) {
      setGamePhase('lost');
      const msg = mode === 'onchain'
        ? '😢 Game Over! You can still submit your score.'
        : '😢 Game Over! The code was too tough.';
      setMessage(msg);
      updateStatsOnGameEnd(false, newAttempts);
    }
  }, [currentGuess, secretCode, attempts, history, gamePhase, mode, updateStatsOnGameEnd]);

  // New game
  const newGame = useCallback(() => {
    setSecretCode(generateSecretCode());
    setCurrentGuess([null, null, null, null]);
    setHistory([]);
    setAttempts(0);
    setGamePhase('playing');
    setMessage('');
  }, []);

  // Switch mode
  const switchMode = useCallback((newMode: GameMode) => {
    setMode(newMode);
    if (newMode === 'onchain') {
      setMessage('🎮 On-Chain Mode: Play and submit your score to the blockchain!');
      setTimeout(() => setMessage(''), 3000);
      // Refetch active game state when switching to onchain mode
      setTimeout(() => {
        refetchActiveGame();
        refetchStats();
      }, 100);
    }
    newGame();
  }, [newGame, refetchActiveGame, refetchStats]);

  // Start on-chain game
  const playOnChain = useCallback(async () => {
    if (!isConnected) {
      setMessage('❌ Please connect your wallet first');
      return;
    }

    if (!address) {
      setMessage('❌ Wallet address not found');
      return;
    }

    try {
      // Reset previous transaction state
      resetWrite?.();

      // Check if we're on the correct chain (Celo)
      if (chain?.id !== celo.id) {
        setMessage('⚡ Switching to Celo network...');
        try {
          await switchChain?.({ chainId: celo.id });
          // Give wallet time to switch
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (switchError) {
          console.error('Chain switch error:', switchError);
          setMessage('❌ Please switch to Celo network in your wallet');
          return;
        }
      }

      setMessage('🎲 Starting your on-chain game...');
      console.log('📤 Sending startGame transaction...');

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'startGame',
        chainId: celo.id,
        gas: BigInt(200000),
        value: BigInt("10000000000000000"), // 0.01 CELO in wei
      });

    } catch (error) {
      console.error('❌ Transaction error:', error);
      setMessage('❌ Transaction failed - Please try again');
    }
  }, [isConnected, address, chain, switchChain, writeContract, resetWrite]);

  // Submit score on-chain
  const submitScoreOnChain = useCallback(async () => {
    console.log('🎯 submitScoreOnChain called');
    console.log('State:', { isConnected, address, mode, gamePhase, attempts });

    if (!isConnected) {
      console.log('❌ Not connected');
      setMessage('❌ Please connect your wallet first');
      return;
    }

    if (!address) {
      console.log('❌ No address');
      setMessage('❌ Wallet address not found');
      return;
    }

    if (mode !== 'onchain') {
      console.log('❌ Wrong mode:', mode);
      setMessage('❌ Switch to On-Chain mode first');
      return;
    }

    if (gamePhase === 'playing') {
      console.log('❌ Game still playing');
      setMessage('❌ Finish the game first');
      return;
    }

    const won = gamePhase === 'won';
    const score = calculateScore(won, attempts);

    try {
      console.log('✅ All checks passed. Resetting write state...');
      // Reset previous transaction state
      resetWrite?.();

      // Check if we're on the correct chain (Celo)
      console.log('Current chain:', chain?.id, 'Expected:', celo.id);
      if (chain?.id !== celo.id) {
        setMessage('⚡ Switching to Celo network...');
        console.log('🔄 Switching to Celo network...');
        try {
          await switchChain?.({ chainId: celo.id });
          // Give wallet time to switch
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log('✅ Switched to Celo network');
        } catch (switchError) {
          console.error('❌ Chain switch error:', switchError);
          setMessage('❌ Please switch to Celo network in your wallet');
          return;
        }
      }

      setMessage('⏳ Submitting score on-chain...');
      console.log('📤 Calling writeContract with:', {
        address: CONTRACT_ADDRESS,
        functionName: 'submitScore',
        args: [BigInt(score), won, BigInt(attempts)],
        chainId: celo.id,
        gas: BigInt(200000),
      });

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'submitScore',
        args: [BigInt(score), won, BigInt(attempts)],
        chainId: celo.id,
        gas: BigInt(200000),
      });

      console.log('✅ writeContract called successfully');
    } catch (error) {
      console.error('❌ Failed to submit score:', error);
      setMessage('❌ Failed to submit score - Please try again');
    }
  }, [isConnected, address, mode, gamePhase, attempts, chain, switchChain, writeContract, resetWrite]);

  // Abandon current on-chain game
  const abandonGame = useCallback(async () => {
    if (!isConnected) {
      setMessage('❌ Please connect your wallet first');
      return;
    }

    if (!address) {
      setMessage('❌ Wallet address not found');
      return;
    }

    if (mode !== 'onchain') {
      setMessage('❌ Only for On-Chain mode');
      return;
    }

    try {
      // Reset previous transaction state
      resetWrite?.();

      // Check if we're on the correct chain (Celo)
      if (chain?.id !== celo.id) {
        setMessage('⚡ Switching to Celo network...');
        try {
          await switchChain?.({ chainId: celo.id });
          // Give wallet time to switch
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (switchError) {
          console.error('Chain switch error:', switchError);
          setMessage('❌ Please switch to Celo network in your wallet');
          return;
        }
      }

      setMessage('⏳ Abandoning game on-chain...');
      console.log('📤 Submitting score 0 to reset game state');

      // Submit score of 0 to reset the game state
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'submitScore',
        args: [BigInt(0), false, BigInt(0)],
        chainId: celo.id,
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error('❌ Failed to abandon game:', error);
      setMessage('❌ Failed to abandon game - Please try again');
    }
  }, [isConnected, address, mode, chain, switchChain, writeContract, resetWrite]);

  // Get current stats (free or on-chain)
  const stats: GameStats = mode === 'onchain' && onchainStats
    ? {
        wins: Number(onchainStats[0]),
        losses: Number(onchainStats[1]),
        totalGames: Number(onchainStats[2]),
        averageAttempts: Number(onchainStats[3]),
        bestScore: Number(onchainStats[4]),
      }
    : freeStats;

  return {
    // Game state
    mode,
    gamePhase,
    secretCode,
    currentGuess,
    history,
    attempts,
    message,
    stats,
    hasActiveOnChainGame,

    // Wallet state
    address,
    isConnected,
    isPending: isPending || isConfirming,

    // Actions
    updateGuess,
    submitGuess,
    newGame,
    playOnChain,
    submitScoreOnChain,
    switchMode,
    abandonGame,
    refetchActiveGame,
  };
}
