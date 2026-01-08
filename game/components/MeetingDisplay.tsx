'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useGame } from '@/lib/GameContext';
import { NPCType, getCommunityName, HEARTS_RESTORED_ON_BREAK } from '@/lib/gameLogic';
import type { DialogResponse, NPC } from '@/types';

// NPC sprite mapping based on Unity's ResourceLibrary
// NPCSpriteIDs = { [0, 1], [2, 3], [4, 5] } for [Cat, Duck, Squirrel] x [Regular, Important]
const getNPCSpritePosition = (npc: NPC): { x: number; y: number } => {
  const spriteId = npc.type * 2 + npc.importance;
  // NPCs.png is a horizontal sprite sheet with 6 sprites (96px each for a 576px wide image)
  return {
    x: spriteId * 96, // Each sprite is 96px wide
    y: 0,
  };
};

export default function MeetingDisplay() {
  const { gameState, currentMeeting, selectResponse, nextMeeting, playSound } = useGame();
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
            playSound('click');
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

    playSound('click');
    setSelectedResponse(index);
    selectResponse(index);
    setShowingNPCResponse(true);
  };

  const handleNext = () => {
    playSound('click');
    setSelectedResponse(null);
    setShowingNPCResponse(false);
    nextMeeting();
  };

  const communityName = getCommunityName(npc.type, lang);
  const spritePos = getNPCSpritePosition(npc);

  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-800 rounded-lg border-4 border-gray-600">
      {/* NPC Display */}
      <div className="flex flex-col items-center gap-4">
        {/* NPC Sprite */}
        <div className="relative w-24 h-24 pixel-art">
          <div
            className="w-full h-full bg-contain bg-no-repeat"
            style={{
              backgroundImage: 'url(/sprites/NPCs.png)',
              backgroundPosition: `-${spritePos.x}px ${spritePos.y}px`,
              imageRendering: 'pixelated',
            }}
          />
        </div>
        {/* NPC Name */}
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
                  <div className="flex justify-between items-start gap-3">
                    <p className="text-white flex-1">{response.playerText[lang]}</p>
                    <div className="flex items-center gap-1">
                      {response.heartCost === -2 && (
                        <Image
                          src="/sprites/TwoHearts.png"
                          alt="2 hearts"
                          width={32}
                          height={16}
                          className="pixel-art"
                        />
                      )}
                      {response.heartCost === -1 && (
                        <Image
                          src="/sprites/OneHeart.png"
                          alt="1 heart"
                          width={16}
                          height={16}
                          className="pixel-art"
                        />
                      )}
                      {response.heartCost === 1 && (
                        <>
                          <span className="text-green-400 font-bold">+</span>
                          <Image
                            src="/sprites/Heart.png"
                            alt="1 heart"
                            width={16}
                            height={16}
                            className="pixel-art"
                          />
                        </>
                      )}
                    </div>
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
