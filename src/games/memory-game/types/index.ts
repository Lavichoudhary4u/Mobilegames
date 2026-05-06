export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type GameLevel = "easy" | "medium" | "hard";

export interface LevelConfig {
  pairs: number;
  timeLimit?: number;
  name: string;
}

export interface GameState {
  cards: Card[];
  flippedCards: number[];
  moves: number;
  matches: number;
  isGameComplete: boolean;
  level: GameLevel;
  score: number;
  timeRemaining?: number;
}

export interface PlayerProgress {
  userId: string;
  playerName: string;
  easyBestScore: number;
  mediumBestScore: number;
  hardBestScore: number;
  easyCompleted: boolean;
  mediumCompleted: boolean;
  hardCompleted: boolean;
  totalGamesPlayed: number;
  lastPlayed: Date;
}
