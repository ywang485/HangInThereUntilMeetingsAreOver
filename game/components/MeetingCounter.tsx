'use client';

import React from 'react';
import { useGame } from '@/lib/GameContext';

export default function MeetingCounter() {
  const { gameState } = useGame();
  const remaining = gameState.meetingQueue.length - gameState.currentMeetingIndex;

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg border-2 border-gray-600">
      <div className="text-white font-bold text-lg">
        {gameState.language === 'en' ? 'Meetings Left' : '剩余会议'}
      </div>
      <div className="text-white font-bold text-3xl">{Math.max(0, remaining)}</div>
    </div>
  );
}
