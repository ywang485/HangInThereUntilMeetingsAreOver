// NPC Types
export enum NPCType {
  Cat = 0,
  Duck = 1,
  Squirrel = 2,
}

export enum NPCImportance {
  Regular = 0,
  Important = 1,
}

export interface NPC {
  type: NPCType;
  importance: NPCImportance;
}

// Dialog Types
export interface Dialog {
  id: number;
  opening: {
    en: string;
    zh: string;
  };
  responses: DialogResponse[];
}

export interface DialogResponse {
  heartCost: number; // 0, 1, or 2
  playerText: {
    en: string;
    zh: string;
  };
  npcReaction: {
    en: string;
    zh: string;
  };
  relationshipChange: number; // -20 to +10
}

// Meeting Types
export interface MeetingBlock {
  id: string;
  isBreak: boolean;
  npc?: NPC;
  dialog?: Dialog;
}

// Game State Types
export interface GameState {
  hearts: number;
  maxHearts: number;
  relationships: {
    [NPCType.Cat]: number;
    [NPCType.Duck]: number;
    [NPCType.Squirrel]: number;
  };
  meetingQueue: MeetingBlock[];
  currentMeetingIndex: number;
  currentDialog?: Dialog;
  currentNPC?: NPC;
  gameStatus: 'menu' | 'playing' | 'won' | 'lost';
  winningParty?: NPCType;
  language: 'en' | 'zh';
}

// Sound Types
export type SoundEffect = 'click' | 'heartRestored' | 'relationIncreased' | 'relationDecreased';
