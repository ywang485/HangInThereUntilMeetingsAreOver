'use client';

import React, { useState } from 'react';
import { useGame } from '@/lib/GameContext';
import { NPCType, getCommunityName, HEARTS_RESTORED_ON_BREAK } from '@/lib/gameLogic';
import type { DialogResponse } from '@/types';

export default function MeetingDisplay() {
  const { gameState, currentMeeting, selectResponse, nextMeeting } = useGame();
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const [showingNPCResponse, setShowingNPCResponse] = useState(false);

  const meeting = currentMeeting();

  if (!meeting) {
    return null;
  }

  // Handle break meetings
  if (meeting.isBreak) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8 bg-gray-800 rounded-lg border-4 border-blue-500">
        <h2 className="text-3xl font-bold text-blue-400">
          {gameState.language === 'en' ? '☕ Break Time!' : '☕ 休息时间！'}
        </h2>
        <p className="text-white text-xl text-center">
          {gameState.language === 'en'
            ? `You restored ${HEARTS_RESTORED_ON_BREAK} hearts!`
            : `你恢复了 ${HEARTS_RESTORED_ON_BREAK} 点心情！`}
        </p>
        <button
          onClick={() => {
            nextMeeting();
          }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
        >
          {gameState.language === 'en' ? 'Continue' : '继续'}
        </button>
      </div>
    );
  }

  // Handle NPC meetings
  if (!meeting.npc || !meeting.dialog) {
    return null;
  }

  const npc = meeting.npc;
  const dialog = meeting.dialog;
  const lang = gameState.language;

  const handleResponseClick = (index: number) => {
    const response = dialog.responses[index];

    // Check if player has enough hearts
    if (response.heartCost < 0 && gameState.hearts + response.heartCost < 0) {
      return;
    }

    setSelectedResponse(index);
    selectResponse(index);
    setShowingNPCResponse(true);
  };

  const handleNext = () => {
    setSelectedResponse(null);
    setShowingNPCResponse(false);
    nextMeeting();
  };

  const communityName = getCommunityName(npc.type, lang);

  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-800 rounded-lg border-4 border-gray-600">
      {/* NPC Info */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white">
          {communityName} {npc.importance === 1 ? '⭐' : ''}
        </h3>
      </div>

      {/* Dialog */}
      {!showingNPCResponse ? (
        <>
          {/* NPC Opening */}
          <div className="p-4 bg-blue-900 rounded-lg border-2 border-blue-600">
            <p className="text-white text-lg">{dialog.opening[lang]}</p>
          </div>

          {/* Player Response Options */}
          <div className="flex flex-col gap-3">
            {dialog.responses.map((response: DialogResponse, index: number) => {
              const canAfford =
                response.heartCost >= 0 || gameState.hearts + response.heartCost >= 0;
              const heartCostDisplay = response.heartCost > 0 ? '+' : '';

              return (
                <button
                  key={index}
                  onClick={() => handleResponseClick(index)}
                  disabled={!canAfford}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    canAfford
                      ? 'bg-green-900 border-green-600 hover:bg-green-800 cursor-pointer'
                      : 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-white flex-1">{response.playerText[lang]}</p>
                    <span
                      className={`ml-2 font-bold ${
                        response.heartCost > 0
                          ? 'text-green-400'
                          : response.heartCost < 0
                          ? 'text-red-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {heartCostDisplay}
                      {response.heartCost} ❤️
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Show selected player response */}
          {selectedResponse !== null && (
            <div className="p-4 bg-green-900 rounded-lg border-2 border-green-600">
              <p className="text-white text-lg">
                {dialog.responses[selectedResponse].playerText[lang]}
              </p>
            </div>
          )}

          {/* NPC Reaction */}
          {selectedResponse !== null && (
            <div className="p-4 bg-blue-900 rounded-lg border-2 border-blue-600">
              <p className="text-white text-lg">
                {dialog.responses[selectedResponse].npcReaction[lang]}
              </p>
            </div>
          )}

          {/* Next button */}
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors self-center"
          >
            {lang === 'en' ? 'Next Meeting' : '下一个会议'}
          </button>
        </>
      )}
    </div>
  );
}
