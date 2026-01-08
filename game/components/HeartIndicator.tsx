'use client';

import React from 'react';
import { useGame } from '@/lib/GameContext';
import Image from 'next/image';

export default function HeartIndicator() {
  const { gameState } = useGame();

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg border-2 border-gray-600">
      <div className="text-white font-bold text-lg">
        {gameState.language === 'en' ? 'Hearts' : '心情'}
      </div>
      <div className="flex items-center gap-3">
        {/* Display heart icons */}
        <div className="flex items-center gap-1">
          {Array.from({ length: gameState.maxHearts }).map((_, index) => (
            <Image
              key={index}
              src="/sprites/Heart.png"
              alt="heart"
              width={16}
              height={16}
              className={`pixel-art transition-opacity duration-200 ${
                index < gameState.hearts ? 'opacity-100' : 'opacity-20'
              }`}
            />
          ))}
        </div>
        <span className="text-white font-bold text-sm min-w-[3rem] text-center">
          {gameState.hearts} / {gameState.maxHearts}
        </span>
      </div>
    </div>
  );
}
