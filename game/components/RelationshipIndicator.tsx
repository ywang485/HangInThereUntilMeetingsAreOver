'use client';

import React from 'react';
import { useGame } from '@/lib/GameContext';
import { NPCType, getCommunityName } from '@/lib/gameLogic';

interface RelationshipBarProps {
  npcType: NPCType;
}

function RelationshipBar({ npcType }: RelationshipBarProps) {
  const { gameState } = useGame();
  const relationship = gameState.relationships[npcType];
  const communityName = getCommunityName(npcType, gameState.language);
  const isDangerous = relationship < 20;

  // Icon colors based on NPC type
  const colors = {
    [NPCType.Cat]: 'bg-orange-400',
    [NPCType.Duck]: 'bg-yellow-400',
    [NPCType.Squirrel]: 'bg-green-400',
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="text-white font-bold text-sm">{communityName}</div>
      <div className="flex items-center gap-2">
        {/* Icon */}
        <div className={`w-4 h-4 ${colors[npcType]} rounded`} />
        {/* Relationship bar */}
        <div className="relative w-24 h-3 bg-gray-700 border border-gray-500 rounded">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-300 ${
              isDangerous ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.max(0, Math.min(100, relationship))}%` }}
          />
        </div>
        <span
          className={`font-bold text-xs min-w-[2rem] ${
            isDangerous ? 'text-red-500' : 'text-white'
          }`}
        >
          {relationship}
        </span>
      </div>
    </div>
  );
}

export default function RelationshipIndicator() {
  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-800 rounded-lg border-2 border-gray-600">
      <div className="text-white font-bold text-lg">Relationships</div>
      <RelationshipBar npcType={NPCType.Cat} />
      <RelationshipBar npcType={NPCType.Duck} />
      <RelationshipBar npcType={NPCType.Squirrel} />
    </div>
  );
}
