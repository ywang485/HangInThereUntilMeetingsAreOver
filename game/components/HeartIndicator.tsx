'use client';

import React from 'react';
import { useGame } from '@/lib/GameContext';

export default function HeartIndicator() {
  const { gameState } = useGame();

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg border-2 border-gray-600">
      <div className="text-white font-bold text-lg">Hearts</div>
      <div className="flex items-center gap-2">
        {/* Heart bar background */}
        <div className="relative w-32 h-4 bg-gray-700 border-2 border-gray-500 rounded">
          {/* Heart bar fill */}
          <div
            className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-300"
            style={{ width: `${(gameState.hearts / gameState.maxHearts) * 100}%` }}
          />
        </div>
        <span className="text-white font-bold text-sm min-w-[3rem] text-center">
          {gameState.hearts} / {gameState.maxHearts}
        </span>
      </div>
    </div>
  );
}
