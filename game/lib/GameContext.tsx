'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { GameState, NPCType, DialogResponse } from '@/types';
import {
  getInitialGameState,
  createMeetingQueue,
  calculateRelationshipChange,
  checkWinCondition,
  checkLoseCondition,
  HEARTS_RESTORED_ON_BREAK,
  MAX_HEARTS,
} from './gameLogic';
import { useSound } from './useSound';

interface GameContextType {
  gameState: GameState;
  startGame: () => void;
  selectResponse: (responseIndex: number) => void;
  nextMeeting: () => void;
  resetGame: () => void;
  toggleLanguage: () => void;
  currentMeeting: () => any;
  playSound: (type: 'click' | 'heartRestored' | 'relationIncreased' | 'relationDecreased') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const { playSound } = useSound();

  const startGame = useCallback(() => {
    const meetingQueue = createMeetingQueue();
    setGameState({
      ...getInitialGameState(),
      meetingQueue,
      currentMeetingIndex: 0,
      gameStatus: 'playing',
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(getInitialGameState());
  }, []);

  const toggleLanguage = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      language: prev.language === 'en' ? 'zh' : 'en',
    }));
  }, []);

  const currentMeeting = useCallback(() => {
    if (
      gameState.currentMeetingIndex >= 0 &&
      gameState.currentMeetingIndex < gameState.meetingQueue.length
    ) {
      return gameState.meetingQueue[gameState.currentMeetingIndex];
    }
    return null;
  }, [gameState.currentMeetingIndex, gameState.meetingQueue]);

  const selectResponse = useCallback(
    (responseIndex: number) => {
      const meeting = currentMeeting();
      if (!meeting || meeting.isBreak || !meeting.npc || !meeting.dialog) {
        return;
      }

      const response = meeting.dialog.responses[responseIndex];
      const newHearts = Math.min(
        gameState.hearts + response.heartCost,
        MAX_HEARTS
      );

      const relationshipChange = calculateRelationshipChange(
        response.relationshipChange,
        meeting.npc.importance
      );

      const newRelationships = { ...gameState.relationships };
      newRelationships[meeting.npc.type] += relationshipChange;

      setGameState((prev) => ({
        ...prev,
        hearts: newHearts,
        relationships: newRelationships,
      }));

      // Play sound effects
      if (relationshipChange > 0) {
        playSound('relationIncreased');
      } else if (relationshipChange < 0) {
        playSound('relationDecreased');
      }

      // Check win/lose conditions
      setTimeout(() => {
        const { won, winningParty } = checkWinCondition(newRelationships);
        const lost = checkLoseCondition(
          newRelationships,
          newHearts,
          gameState.currentMeetingIndex,
          gameState.meetingQueue.length
        );

        if (won) {
          setGameState((prev) => ({
            ...prev,
            gameStatus: 'won',
            winningParty,
          }));
        } else if (lost) {
          setGameState((prev) => ({
            ...prev,
            gameStatus: 'lost',
          }));
        }
      }, 100);
    },
    [gameState, currentMeeting, playSound]
  );

  const nextMeeting = useCallback(() => {
    const meeting = currentMeeting();

    // Handle break meeting
    if (meeting && meeting.isBreak) {
      const newHearts = Math.min(
        gameState.hearts + HEARTS_RESTORED_ON_BREAK,
        MAX_HEARTS
      );
      setGameState((prev) => ({
        ...prev,
        hearts: newHearts,
      }));
      playSound('heartRestored');
    }

    // Move to next meeting
    const nextIndex = gameState.currentMeetingIndex + 1;

    if (nextIndex >= gameState.meetingQueue.length) {
      // Game over - check if won or lost
      const { won, winningParty } = checkWinCondition(gameState.relationships);
      setGameState((prev) => ({
        ...prev,
        currentMeetingIndex: nextIndex,
        gameStatus: won ? 'won' : 'lost',
        winningParty,
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        currentMeetingIndex: nextIndex,
      }));
    }
  }, [gameState, currentMeeting, playSound]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        startGame,
        selectResponse,
        nextMeeting,
        resetGame,
        toggleLanguage,
        currentMeeting,
        playSound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
