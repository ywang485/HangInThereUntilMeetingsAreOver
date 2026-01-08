'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGame } from '@/lib/GameContext';
import { NPCType, getCommunityName, HEARTS_RESTORED_ON_BREAK } from '@/lib/gameLogic';
import type { DialogResponse, NPC } from '@/types';

// NPC sprite mapping based on Unity's ResourceLibrary
const getNPCSpritePosition = (npc: NPC): { x: number; y: number } => {
  const spriteId = npc.type * 2 + npc.importance;
  return {
    x: spriteId * 96,
    y: 0,
  };
};

export default function MeetingDisplay() {
  const { gameState, currentMeeting, selectResponse, nextMeeting, playSound } = useGame();
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const [showingNPCResponse, setShowingNPCResponse] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const meeting = currentMeeting();

  // Trigger fade-in animation when meeting changes
  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [gameState.currentMeetingIndex]);

  // Reset response state when meeting changes
  useEffect(() => {
    setSelectedResponse(null);
    setShowingNPCResponse(false);
  }, [gameState.currentMeetingIndex]);

  if (!meeting) {
    return null;
  }

  // Handle break meetings
  if (meeting.isBreak) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-6 p-8 rounded-lg transition-opacity duration-500 ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: 'url(/sprites/MeetingPanelBg.png)',
          backgroundSize: 'cover',
          border: '4px solid #3b82f6',
          minHeight: '400px',
        }}
      >
        <h2 className="text-4xl font-bold text-blue-300 drop-shadow-lg">
          {gameState.language === 'en' ? '☕ Break Time!' : '☕ 休息时间！'}
        </h2>
        <p className="text-white text-2xl text-center drop-shadow-md">
          {gameState.language === 'en'
            ? `You restored ${HEARTS_RESTORED_ON_BREAK} hearts!`
            : `你恢复了 ${HEARTS_RESTORED_ON_BREAK} 点心情！`}
        </p>
        <button
          onClick={() => {
            playSound('click');
            nextMeeting();
          }}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-lg rounded-lg transition-all shadow-lg hover:shadow-xl"
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
    <div
      className={`flex flex-col gap-6 p-8 transition-opacity duration-500 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundImage: 'url(/sprites/MeetingPanelBg.png)',
        backgroundSize: 'cover',
        borderRadius: '12px',
        border: '4px solid #4b5563',
        minHeight: '500px',
      }}
    >
      {/* NPC Display with fade-in */}
      <div className={`flex flex-col items-center gap-4 transition-all duration-700 ${
        fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* NPC Sprite */}
        <div className="relative pixel-art" style={{ width: '192px', height: '192px' }}>
          <div
            className="w-full h-full bg-contain bg-no-repeat"
            style={{
              backgroundImage: 'url(/sprites/NPCs.png)',
              backgroundPosition: `-${spritePos.x * 2}px ${spritePos.y}px`,
              imageRendering: 'pixelated',
              transform: 'scale(2)',
              transformOrigin: 'top center',
            }}
          />
        </div>
        {/* NPC Name */}
        <h3 className="text-2xl font-bold text-white drop-shadow-md">
          {communityName} {npc.importance === 1 ? '⭐' : ''}
        </h3>
      </div>

      {/* Dialog Section */}
      <div className={`flex flex-col gap-4 transition-all duration-500 delay-200 ${
        fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {!showingNPCResponse ? (
          <>
            {/* NPC Opening with dialog box background */}
            <div
              className="relative p-6 pixel-art"
              style={{
                backgroundImage: 'url(/sprites/NPCDialogBox.png)',
                backgroundSize: '100% 100%',
                imageRendering: 'pixelated',
                minHeight: '80px',
              }}
            >
              <p className="text-white text-lg leading-relaxed">{dialog.opening[lang]}</p>
            </div>

            {/* Choose Response Prompt */}
            <div className="text-center text-yellow-300 font-bold text-sm animate-pulse">
              {lang === 'en' ? '▼ Choose your response ▼' : '▼ 选择你的回应 ▼'}
            </div>

            {/* Player Response Options */}
            <div className="flex flex-col gap-3">
              {dialog.responses.map((response: DialogResponse, index: number) => {
                const canAfford =
                  response.heartCost >= 0 || gameState.hearts + response.heartCost >= 0;

                return (
                  <button
                    key={index}
                    onClick={() => handleResponseClick(index)}
                    disabled={!canAfford}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      canAfford
                        ? 'bg-green-900/80 border-green-600 hover:bg-green-800 hover:scale-102 hover:shadow-lg cursor-pointer active:scale-95'
                        : 'bg-gray-800/50 border-gray-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <p className="text-white flex-1 leading-relaxed">{response.playerText[lang]}</p>
                      <div className="flex items-center gap-1 flex-shrink-0">
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
            {/* Player response with dialog box background */}
            {selectedResponse !== null && (
              <div
                className="relative p-6 pixel-art animate-fadeIn"
                style={{
                  backgroundImage: 'url(/sprites/PlayerDialogBox.png)',
                  backgroundSize: '100% 100%',
                  imageRendering: 'pixelated',
                  minHeight: '80px',
                }}
              >
                <p className="text-white text-lg leading-relaxed">
                  {dialog.responses[selectedResponse].playerText[lang]}
                </p>
              </div>
            )}

            {/* NPC Reaction with dialog box background */}
            {selectedResponse !== null && (
              <div
                className="relative p-6 pixel-art animate-fadeIn animation-delay-300"
                style={{
                  backgroundImage: 'url(/sprites/NPCDialogBox.png)',
                  backgroundSize: '100% 100%',
                  imageRendering: 'pixelated',
                  minHeight: '80px',
                }}
              >
                <p className="text-white text-lg leading-relaxed">
                  {dialog.responses[selectedResponse].npcReaction[lang]}
                </p>
              </div>
            )}

            {/* Next button */}
            <button
              onClick={handleNext}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-lg rounded-lg transition-all self-center shadow-lg hover:shadow-xl mt-4"
            >
              {lang === 'en' ? 'Next Meeting ▶' : '下一个会议 ▶'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
