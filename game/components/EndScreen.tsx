'use client';

import React from 'react';
import { useGame } from '@/lib/GameContext';
import { getCommunityName } from '@/lib/gameLogic';

export default function EndScreen() {
  const { gameState, resetGame } = useGame();
  const lang = gameState.language;
  const isWon = gameState.gameStatus === 'won';

  const title = isWon
    ? lang === 'en'
      ? '🎉 You Won!'
      : '🎉 你赢了！'
    : lang === 'en'
    ? '😞 Game Over'
    : '😞 游戏结束';

  const getMessage = () => {
    if (isWon && gameState.winningParty !== undefined) {
      const communityName = getCommunityName(gameState.winningParty, lang);
      return lang === 'en'
        ? `You've successfully built a strong relationship with the ${communityName} community! They love working with you.`
        : `你成功与${communityName}社区建立了良好关系！他们喜欢与你合作。`;
    }

    // Check why they lost
    if (gameState.hearts <= 0) {
      return lang === 'en'
        ? "You've burned out completely. Take care of yourself!"
        : '你已经完全精疲力竭了。要照顾好自己！';
    }

    for (const [type, value] of Object.entries(gameState.relationships)) {
      if (value <= 0) {
        const communityName = getCommunityName(parseInt(type), lang);
        return lang === 'en'
          ? `The ${communityName} community no longer wants to work with you.`
          : `${communityName}社区不再愿意与你合作了。`;
      }
    }

    return lang === 'en'
      ? 'You ran out of meetings without building strong enough relationships.'
      : '你的会议用完了，但没有建立足够强的关系。';
  };

  const playAgainText = lang === 'en' ? 'Play Again' : '再玩一次';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-2xl w-full flex flex-col gap-8 p-8 bg-gray-800 rounded-xl border-4 border-gray-600 shadow-2xl">
        {/* Title */}
        <h1
          className={`text-4xl md:text-5xl font-bold text-center leading-tight ${
            isWon ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {title}
        </h1>

        {/* Message */}
        <p className="text-xl text-center text-gray-300">{getMessage()}</p>

        {/* Final Stats */}
        <div className="bg-gray-900 p-6 rounded-lg border-2 border-gray-600">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            {lang === 'en' ? 'Final Stats' : '最终统计'}
          </h2>
          <div className="space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span>{lang === 'en' ? 'Hearts:' : '心情：'}</span>
              <span className="font-bold">{gameState.hearts}</span>
            </div>
            <div className="flex justify-between">
              <span>
                {lang === 'en' ? 'Cat Relationship:' : '猫社区关系：'}
              </span>
              <span className="font-bold">{gameState.relationships[0]}</span>
            </div>
            <div className="flex justify-between">
              <span>
                {lang === 'en' ? 'Duck Relationship:' : '鸭社区关系：'}
              </span>
              <span className="font-bold">{gameState.relationships[1]}</span>
            </div>
            <div className="flex justify-between">
              <span>
                {lang === 'en' ? 'Squirrel Relationship:' : '松鼠社区关系：'}
              </span>
              <span className="font-bold">{gameState.relationships[2]}</span>
            </div>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={resetGame}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-lg transition-colors shadow-lg"
        >
          {playAgainText}
        </button>
      </div>
    </div>
  );
}
