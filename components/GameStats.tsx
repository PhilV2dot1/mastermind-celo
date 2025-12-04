"use client";

interface GameStatsProps {
  stats: {
    wins: number;
    losses: number;
    totalGames: number;
    averageAttempts: number;
    bestScore: number;
  };
  mode: 'free' | 'onchain';
}

export function GameStats({ stats, mode }: GameStatsProps) {
  const winRate = stats.totalGames > 0
    ? ((stats.wins / stats.totalGames) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-celo-yellow rounded-lg p-3 sm:p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-3 text-center">
        {mode === 'onchain' ? '📊 On-Chain Stats' : '📊 Free Play Stats'}
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 text-center lg:text-left">
        <div className="flex justify-between items-center py-1">
          <span className="text-xs text-gray-600 font-medium">Games</span>
          <span className="text-base font-bold text-gray-900">{stats.totalGames}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-xs text-gray-600 font-medium">Wins</span>
          <span className="text-base font-bold text-green-600">{stats.wins}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-xs text-gray-600 font-medium">Losses</span>
          <span className="text-base font-bold text-red-600">{stats.losses}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-xs text-gray-600 font-medium">Win Rate</span>
          <span className="text-base font-bold text-blue-600">{winRate}%</span>
        </div>
        <div className="flex justify-between items-center py-1 col-span-2 lg:col-span-1">
          <span className="text-xs text-gray-600 font-medium">Best Score</span>
          <span className="text-base font-bold text-purple-600">{stats.bestScore}</span>
        </div>
      </div>
    </div>
  );
}
