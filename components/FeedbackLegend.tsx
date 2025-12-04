"use client";

import { motion } from "framer-motion";

export function FeedbackLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm border border-celo-yellow rounded-lg p-2 sm:p-3 shadow-sm"
    >
      <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs">
        <span className="font-semibold text-gray-900 mr-1">Feedback:</span>

        {/* Black Peg Explanation */}
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2" style={{
            backgroundColor: '#1f2937',
            borderColor: '#111827'
          }} />
          <span className="text-gray-700 whitespace-nowrap">= Right color, right position</span>
        </div>

        <span className="text-gray-400 hidden sm:inline">|</span>

        {/* White Peg Explanation */}
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2" style={{
            backgroundColor: '#f3f4f6',
            borderColor: '#9ca3af'
          }} />
          <span className="text-gray-700 whitespace-nowrap">= Right color, wrong position</span>
        </div>
      </div>
    </motion.div>
  );
}
