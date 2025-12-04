"use client";

import { COLORS, Color } from "@/lib/game-logic";
import { ColorPeg } from "./ColorPeg";

interface ColorPaletteProps {
  onSelectColor: (color: Color) => void;
  disabled?: boolean;
}

export function ColorPalette({ onSelectColor, disabled }: ColorPaletteProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-lg border border-celo-yellow shadow-sm">
      {COLORS.map(color => (
        <ColorPeg
          key={color}
          color={color}
          size="large"
          onClick={() => !disabled && onSelectColor(color)}
        />
      ))}
    </div>
  );
}
