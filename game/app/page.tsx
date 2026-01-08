'use client';

import React from 'react';
import { useGame } from '@/lib/GameContext';
import MenuScreen from '@/components/MenuScreen';
import GameScreen from '@/components/GameScreen';
import EndScreen from '@/components/EndScreen';

export default function Home() {
  const { gameState } = useGame();

  if (gameState.gameStatus === 'menu') {
    return <MenuScreen />;
  }

  if (gameState.gameStatus === 'playing') {
    return <GameScreen />;
  }

  if (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') {
    return <EndScreen />;
  }

  return null;
}
