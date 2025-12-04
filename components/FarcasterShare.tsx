"use client";

import { motion } from "framer-motion";
import { shareMastermindResult } from "@/lib/farcaster";

interface FarcasterShareProps {
  gamePhase: 'won' | 'lost';
  score: number;
  attempts: number;
  stats: {
    wins: number;
    losses: number;
    totalGames: number;
    averageAttempts: number;
    bestScore: number;
  };
}

export function FarcasterShare({ gamePhase, score, attempts, stats }: FarcasterShareProps) {
  const handleShare = () => {
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    shareMastermindResult(gamePhase, score, attempts, stats, appUrl);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
    >
      📤 Share to Farcaster
    </motion.button>
  );
}
