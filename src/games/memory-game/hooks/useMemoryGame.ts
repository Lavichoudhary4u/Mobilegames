import { useEffect, useRef, useState } from "react";
import { GameLevel, GameState } from "../types";
import { savePlayerProgress } from "../utils/firebaseService";
import {
    calculateScore,
    checkMatch,
    createDeck,
    LEVEL_CONFIGS,
} from "../utils/gameLogic";

export const useMemoryGame = (
  initialLevel: GameLevel = "easy",
  userId?: string | null,
  playerName?: string,
) => {
  const [gameState, setGameState] = useState<GameState>({
    cards: createDeck(initialLevel),
    flippedCards: [],
    moves: 0,
    matches: 0,
    isGameComplete: false,
    level: initialLevel,
    score: 0,
    timeRemaining: LEVEL_CONFIGS[initialLevel].timeLimit,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (
      gameState.timeRemaining !== undefined &&
      gameState.timeRemaining > 0 &&
      !gameState.isGameComplete
    ) {
      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeRemaining !== undefined && prev.timeRemaining > 0) {
            return { ...prev, timeRemaining: prev.timeRemaining - 1 };
          }
          return prev;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.timeRemaining, gameState.isGameComplete]);

  const handleCardPress = (cardId: number) => {
    if (gameState.flippedCards.length === 2) return;
    if (gameState.timeRemaining === 0) return;

    const card = gameState.cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...gameState.flippedCards, cardId];
    const updatedCards = gameState.cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c,
    );

    setGameState((prev) => ({
      ...prev,
      cards: updatedCards,
      flippedCards: newFlippedCards,
    }));
  };

  useEffect(() => {
    if (gameState.flippedCards.length === 2) {
      const [firstId, secondId] = gameState.flippedCards;
      const firstCard = gameState.cards.find((c) => c.id === firstId);
      const secondCard = gameState.cards.find((c) => c.id === secondId);

      if (firstCard && secondCard) {
        const isMatch = checkMatch(firstCard, secondCard);

        setTimeout(() => {
          setGameState((prev) => {
            const updatedCards = prev.cards.map((card) => {
              if (card.id === firstId || card.id === secondId) {
                return isMatch
                  ? { ...card, isMatched: true }
                  : { ...card, isFlipped: false };
              }
              return card;
            });

            const newMatches = isMatch ? prev.matches + 1 : prev.matches;
            const totalPairs = LEVEL_CONFIGS[prev.level].pairs;
            const isComplete = newMatches === totalPairs;
            const newMoves = prev.moves + 1;
            const finalScore = isComplete
              ? calculateScore(newMoves, prev.timeRemaining)
              : prev.score;

            if (isComplete && userId && playerName) {
              savePlayerProgress(
                userId,
                playerName,
                prev.level,
                finalScore,
                true,
              ).catch(console.error);
            }

            return {
              cards: updatedCards,
              flippedCards: [],
              moves: newMoves,
              matches: newMatches,
              isGameComplete: isComplete,
              level: prev.level,
              score: finalScore,
              timeRemaining: prev.timeRemaining,
            };
          });
        }, 1000);
      }
    }
  }, [gameState.flippedCards, userId, playerName]);

  const resetGame = (newLevel?: GameLevel) => {
    const level = newLevel || gameState.level;
    if (timerRef.current) clearInterval(timerRef.current);

    setGameState({
      cards: createDeck(level),
      flippedCards: [],
      moves: 0,
      matches: 0,
      isGameComplete: false,
      level,
      score: 0,
      timeRemaining: LEVEL_CONFIGS[level].timeLimit,
    });
  };

  return {
    cards: gameState.cards,
    moves: gameState.moves,
    matches: gameState.matches,
    isGameComplete: gameState.isGameComplete,
    level: gameState.level,
    score: gameState.score,
    timeRemaining: gameState.timeRemaining,
    handleCardPress,
    resetGame,
  };
};
