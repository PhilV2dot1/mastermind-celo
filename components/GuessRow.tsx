"use client";

import { Code, Feedback } from "@/lib/game-logic";
import { ColorPeg } from "./ColorPeg";
import { FeedbackPegs } from "./FeedbackPegs";

interface GuessRowProps {
  guess: Code;
  feedback?: Feedback;
  isActive?: boolean;
}

export function GuessRow({ guess, feedback, isActive }: GuessRowProps) {
  return (
    <div className={`flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${
      isActive ? 'bg-white/90 border border-celo-yellow' : 'bg-white/60 border border-gray-200'
    }`}>
      {/* Guess pegs */}
      <div className="flex gap-2">
        {guess.map((color, i) => (
          <ColorPeg key={i} color={color} size="medium" />
        ))}
      </div>

      {/* Feedback */}
      {feedback && <FeedbackPegs feedback={feedback} />}
    </div>
  );
}
