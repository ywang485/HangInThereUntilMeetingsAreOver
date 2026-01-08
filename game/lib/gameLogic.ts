import { NPCType, NPCImportance, NPC, MeetingBlock, Dialog, GameState } from '@/types';
import dialogsData from '@/data/dialogs.json';

// Re-export types for convenience
export { NPCType, NPCImportance, type NPC, type Dialog };

// Constants
export const INITIAL_HEARTS = 10;
export const MAX_HEARTS = 10;
export const INITIAL_RELATIONSHIP = 30;
export const WIN_RELATIONSHIP = 100;
export const LOSE_RELATIONSHIP = 0;
export const HEARTS_RESTORED_ON_BREAK = 5;
export const NUM_IMPORTANT_NPC_EACH_TYPE = 7;
export const NUM_REGULAR_NPC_EACH_TYPE = 10;
export const NUM_BREAK_MEETINGS = 9;

// Load dialogs from JSON
export const dialogs: Dialog[] = dialogsData as Dialog[];

/**
 * Create a random NPC
 */
export function createRandomNPC(type: NPCType, importance: NPCImportance): NPC {
  return { type, importance };
}

/**
 * Get a random dialog from the dialogs array
 */
export function getRandomDialog(): Dialog {
  const randomIndex = Math.floor(Math.random() * dialogs.length);
  return dialogs[randomIndex];
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Create the initial meeting queue
 */
export function createMeetingQueue(): MeetingBlock[] {
  const meetings: MeetingBlock[] = [];
  let meetingId = 0;

  // Add break meetings
  for (let i = 0; i < NUM_BREAK_MEETINGS; i++) {
    meetings.push({
      id: `break-${meetingId++}`,
      isBreak: true,
    });
  }

  // Add NPC meetings for each type (Cat, Duck, Squirrel)
  for (let type = 0; type < 3; type++) {
    const npcType = type as NPCType;

    // Important NPCs
    for (let i = 0; i < NUM_IMPORTANT_NPC_EACH_TYPE; i++) {
      const npc = createRandomNPC(npcType, NPCImportance.Important);
      const dialog = getRandomDialog();
      meetings.push({
        id: `meeting-${meetingId++}`,
        isBreak: false,
        npc,
        dialog,
      });
    }

    // Regular NPCs
    for (let i = 0; i < NUM_REGULAR_NPC_EACH_TYPE; i++) {
      const npc = createRandomNPC(npcType, NPCImportance.Regular);
      const dialog = getRandomDialog();
      meetings.push({
        id: `meeting-${meetingId++}`,
        isBreak: false,
        npc,
        dialog,
      });
    }
  }

  return shuffleArray(meetings);
}

/**
 * Get the initial game state
 */
export function getInitialGameState(): GameState {
  return {
    hearts: INITIAL_HEARTS,
    maxHearts: MAX_HEARTS,
    relationships: {
      [NPCType.Cat]: INITIAL_RELATIONSHIP,
      [NPCType.Duck]: INITIAL_RELATIONSHIP,
      [NPCType.Squirrel]: INITIAL_RELATIONSHIP,
    },
    meetingQueue: [],
    currentMeetingIndex: -1,
    gameStatus: 'menu',
    language: 'en',
  };
}

/**
 * Get the community name for display
 */
export function getCommunityName(npcType: NPCType, language: 'en' | 'zh'): string {
  const names = {
    en: {
      [NPCType.Cat]: 'Cat',
      [NPCType.Duck]: 'Duck',
      [NPCType.Squirrel]: 'Squirrel',
    },
    zh: {
      [NPCType.Cat]: '猫',
      [NPCType.Duck]: '鸭',
      [NPCType.Squirrel]: '松鼠',
    },
  };
  return names[language][npcType];
}

/**
 * Calculate actual relationship change based on NPC importance
 */
export function calculateRelationshipChange(
  baseChange: number,
  importance: NPCImportance
): number {
  return baseChange * (importance + 1);
}

/**
 * Check if the game is won
 */
export function checkWinCondition(relationships: GameState['relationships']): {
  won: boolean;
  winningParty?: NPCType;
} {
  for (const [type, value] of Object.entries(relationships)) {
    if (value >= WIN_RELATIONSHIP) {
      return { won: true, winningParty: parseInt(type) as NPCType };
    }
  }
  return { won: false };
}

/**
 * Check if the game is lost
 */
export function checkLoseCondition(
  relationships: GameState['relationships'],
  hearts: number,
  currentMeetingIndex: number,
  totalMeetings: number
): boolean {
  // Lost if any relationship drops to 0 or below
  for (const value of Object.values(relationships)) {
    if (value <= LOSE_RELATIONSHIP) {
      return true;
    }
  }

  // Lost if hearts drop below 0
  if (hearts < 0) {
    return true;
  }

  // Lost if all meetings are done without winning
  if (currentMeetingIndex >= totalMeetings) {
    const { won } = checkWinCondition(relationships);
    return !won;
  }

  return false;
}
