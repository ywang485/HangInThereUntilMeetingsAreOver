'use client';

import React from 'react';
import { useGame } from '@/lib/GameContext';
import { NPCType } from '@/lib/gameLogic';
import Image from 'next/image';

// Schedule icon sprite positions based on Unity's ResourceLibrary
// NPCIconIDs = { [1, 0], [3, 2], [4, 5] } for [Cat, Duck, Squirrel] x [Regular, Important]
// BreakIconID = 6
const getScheduleIconPosition = (isBreak: boolean, npcType?: NPCType, npcImportance?: number): { x: number; y: number } => {
  if (isBreak) {
    return { x: 6 * 32, y: 0 }; // Break icon at position 6
  }

  if (npcType !== undefined && npcImportance !== undefined) {
    // Map to Unity's icon IDs: [Cat, Duck, Squirrel] x [Important, Regular]
    const iconIds = [
      [0, 1], // Cat: [Important, Regular]
      [2, 3], // Duck: [Important, Regular]
      [5, 4], // Squirrel: [Important, Regular]
    ];
    const iconId = iconIds[npcType][npcImportance];
    return { x: iconId * 32, y: 0 }; // Each icon is 32px wide
  }

  return { x: 0, y: 0 };
};

export default function SchedulePanel() {
  const { gameState } = useGame();
  const lang = gameState.language;

  // Get next 10 meetings to display
  const upcomingMeetings = gameState.meetingQueue.slice(
    gameState.currentMeetingIndex,
    gameState.currentMeetingIndex + 10
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Title */}
      <div className="text-white font-bold text-center text-sm mb-2">
        {lang === 'en' ? 'Schedule' : '日程'}
      </div>

      {/* Schedule Panel Background */}
      <div
        className="relative w-32 pixel-art overflow-hidden rounded border-2 border-gray-600"
        style={{
          backgroundImage: 'url(/sprites/SchedulePanelBg.png)',
          backgroundSize: 'cover',
          minHeight: '300px',
        }}
      >
        {/* Meeting Blocks */}
        <div className="p-2 space-y-1">
          {upcomingMeetings.map((meeting, index) => {
            const iconPos = getScheduleIconPosition(
              meeting.isBreak,
              meeting.npc?.type,
              meeting.npc?.importance
            );

            return (
              <div
                key={meeting.id}
                className={`transition-all duration-500 ease-in-out ${
                  index === 0 ? 'animate-pulse' : ''
                }`}
                style={{
                  opacity: 1 - (index * 0.08),
                  transform: `translateY(${index * 0}px)`,
                }}
              >
                <div
                  className="w-full h-11 pixel-art"
                  style={{
                    backgroundImage: 'url(/sprites/ScheduleIcons.png)',
                    backgroundPosition: `-${iconPos.x}px ${iconPos.y}px`,
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'pixelated',
                    transform: 'scale(2)',
                    transformOrigin: 'top left',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Remaining count */}
      <div className="text-white text-center text-xs mt-1">
        {gameState.meetingQueue.length - gameState.currentMeetingIndex} {lang === 'en' ? 'left' : '剩余'}
      </div>
    </div>
  );
}
