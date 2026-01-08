'use client';

import React from 'react';
import { useGame } from '@/lib/GameContext';

export default function MenuScreen() {
  const { startGame, gameState, toggleLanguage } = useGame();

  const title = {
    en: 'Hang In There Until Meetings Are Over',
    zh: '坚持到会议结束',
  };

  const instructions = {
    en: 'Maintain relationships with three animal communities to keep your job. Choose your responses wisely!',
    zh: '与三个动物社区保持良好关系以保住工作。明智地选择你的回应！',
  };

  const startButton = {
    en: 'Start Game',
    zh: '开始游戏',
  };

  const howToPlay = {
    en: [
      '• Each meeting, choose how to respond',
      '• Being nice costs hearts but improves relationships',
      '• Being honest gains hearts but hurts relationships',
      '• Win by reaching 100 relationship with any community',
      '• Lose if any relationship drops to 0 or you run out of hearts',
    ],
    zh: [
      '• 每次会议，选择如何回应',
      '• 友善会消耗心情但改善关系',
      '• 诚实会增加心情但损害关系',
      '• 与任何社区达到100关系值即可获胜',
      '• 如果任何关系降至0或心情耗尽则失败',
    ],
  };

  const lang = gameState.language;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-2xl w-full flex flex-col gap-8 p-8 bg-gray-800 rounded-xl border-4 border-blue-500 shadow-2xl">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-400 leading-tight">
          {title[lang]}
        </h1>

        {/* Instructions */}
        <p className="text-lg text-center text-gray-300">{instructions[lang]}</p>

        {/* How to Play */}
        <div className="bg-gray-900 p-6 rounded-lg border-2 border-gray-600">
          <h2 className="text-2xl font-bold text-white mb-4">
            {lang === 'en' ? 'How to Play' : '游戏方法'}
          </h2>
          <ul className="text-gray-300 space-y-2">
            {howToPlay[lang].map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={startGame}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-lg transition-colors shadow-lg"
          >
            {startButton[lang]}
          </button>

          <button
            onClick={toggleLanguage}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
          >
            {lang === 'en' ? '中文' : 'English'}
          </button>
        </div>

        {/* Credits */}
        <p className="text-center text-gray-500 text-sm">
          {lang === 'en'
            ? 'Original game made with Unity, ported to Next.js'
            : '原版Unity游戏，移植至Next.js'}
        </p>
      </div>
    </div>
  );
}
