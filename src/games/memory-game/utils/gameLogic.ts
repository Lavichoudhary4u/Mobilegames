import { Card, GameLevel, LevelConfig } from "../types";

const CARD_VALUES = [
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🍉",
  "🍒",
  "🥝",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
];

export const LEVEL_CONFIGS: Record<GameLevel, LevelConfig> = {
  easy: { pairs: 6, name: "Easy", timeLimit: undefined },
  medium: { pairs: 8, name: "Medium", timeLimit: 120 },
  hard: { pairs: 12, name: "Hard", timeLimit: 180 },
};

export const createDeck = (level: GameLevel): Card[] => {
  const config = LEVEL_CONFIGS[level];
  const cards: Card[] = [];
  let id = 0;

  const selectedValues = CARD_VALUES.slice(0, config.pairs);

  selectedValues.forEach((value) => {
    cards.push(
      { id: id++, value, isFlipped: false, isMatched: false },
      { id: id++, value, isFlipped: false, isMatched: false },
    );
  });

  return shuffleCards(cards);
};

export const shuffleCards = (cards: Card[]): Card[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const checkMatch = (card1: Card, card2: Card): boolean => {
  return card1.value === card2.value;
};

export const calculateScore = (
  moves: number,
  timeRemaining?: number,
): number => {
  const baseScore = Math.max(1000 - moves * 10, 0);
  const timeBonus = timeRemaining ? timeRemaining * 5 : 0;
  return baseScore + timeBonus;
};

export type { GameLevel };
