"use client";

import { motion } from "framer-motion";

interface ModeToggleProps {
  mode: 'free' | 'onchain';
  onToggle: (mode: 'free' | 'onchain') => void;
}

export function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1 border border-celo-yellow shadow-sm inline-flex gap-1">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onToggle("free")}
        className={`px-4 sm:px-6 py-2 rounded-md font-bold text-xs sm:text-sm transition-all touch-target ${
          mode === "free"
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm"
            : "bg-transparent text-gray-600 hover:text-gray-900"
        }`}
      >
        Free Play
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onToggle("onchain")}
        className={`px-4 sm:px-6 py-2 rounded-md font-bold text-xs sm:text-sm transition-all touch-target ${
          mode === "onchain"
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm"
            : "bg-transparent text-gray-600 hover:text-gray-900"
        }`}
      >
        On-Chain
      </motion.button>
    </div>
  );
}
