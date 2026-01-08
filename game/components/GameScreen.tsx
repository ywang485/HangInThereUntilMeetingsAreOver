'use client';

import React from 'react';
import { useGame } from '@/lib/GameContext';
import HeartIndicator from './HeartIndicator';
import RelationshipIndicator from './RelationshipIndicator';
import MeetingCounter from './MeetingCounter';
import MeetingDisplay from './MeetingDisplay';
import SchedulePanel from './SchedulePanel';

export default function GameScreen() {
  const { gameState, toggleLanguage, playSound } = useGame();

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-400">
            {gameState.language === 'en'
              ? 'Hang In There!'
              : '坚持住！'}
          </h1>
          <button
            onClick={() => {
              playSound('click');
              toggleLanguage();
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 active:scale-95 text-white font-bold rounded-lg transition-all"
          >
            {gameState.language === 'en' ? '中文' : 'English'}
          </button>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Schedule */}
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <SchedulePanel />
          </div>

          {/* Main content - Meeting */}
          <div className="lg:col-span-2">
            <MeetingDisplay />
          </div>

          {/* Right sidebar - Stats */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <HeartIndicator />
            <RelationshipIndicator />
            <MeetingCounter />
          </div>
        </div>
      </div>
    </div>
  );
}
