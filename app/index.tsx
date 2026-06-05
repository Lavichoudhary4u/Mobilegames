import { useState } from "react";
import { StatusBar } from "react-native";

import { Game2048Screen } from "../src/games/2048";
import { BubblePopScreen } from "../src/games/bubble-pop";
import { CoinFlipScreen } from "../src/games/coin-flip";
import { ColorMatchScreen } from "../src/games/color-match";
import { DiceRollerScreen } from "../src/games/dice-roller";
import { HangmanScreen } from "../src/games/hangman";
import { MathQuizScreen } from "../src/games/math-quiz";
import { MemoryGameScreen } from "../src/games/memory-game";
import { NumberGuessScreen } from "../src/games/number-guess";
import { QuizTriviaScreen } from "../src/games/quiz-trivia";
import { ReactionTimeScreen } from "../src/games/reaction-time";
import { RockPaperScissorsScreen } from "../src/games/rock-paper-scissors";
import { SimonSaysScreen } from "../src/games/simon-says";
import { SnakeGameScreen } from "../src/games/snake-game";
import { SudokuScreen } from "../src/games/sudoku";
import { TicTacToeScreen } from "../src/games/tic-tac-toe";
import { TypingSpeedScreen } from "../src/games/typing-speed";
import { WhackAMoleScreen } from "../src/games/whack-a-mole";
import { WordScrambleScreen } from "../src/games/word-scramble";
import { HomeScreen } from "../src/screens/HomeScreen";
import { WelcomeScreen } from "../src/screens/WelcomeScreen";

export default function Page() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const goBack = () => setCurrentGame(null);

  if (showWelcome) {
    return <WelcomeScreen onFinish={() => setShowWelcome(false)} />;
  }

  if (currentGame) {
    switch (currentGame) {
      case "memory-game":
        return <MemoryGameScreen onBack={goBack} />;
      case "tic-tac-toe":
        return <TicTacToeScreen onBack={goBack} />;
      case "snake-game":
        return <SnakeGameScreen onBack={goBack} />;
      case "number-guess":
        return <NumberGuessScreen onBack={goBack} />;
      case "rock-paper-scissors":
        return <RockPaperScissorsScreen onBack={goBack} />;
      case "word-scramble":
        return <WordScrambleScreen onBack={goBack} />;
      case "math-quiz":
        return <MathQuizScreen onBack={goBack} />;
      case "color-match":
        return <ColorMatchScreen onBack={goBack} />;
      case "simon-says":
        return <SimonSaysScreen onBack={goBack} />;
      case "hangman":
        return <HangmanScreen onBack={goBack} />;
      case "sudoku":
        return <SudokuScreen onBack={goBack} />;
      case "whack-a-mole":
        return <WhackAMoleScreen onBack={goBack} />;
      case "typing-speed":
        return <TypingSpeedScreen onBack={goBack} />;
      case "reaction-time":
        return <ReactionTimeScreen onBack={goBack} />;
      case "quiz-trivia":
        return <QuizTriviaScreen onBack={goBack} />;
      case "2048":
        return <Game2048Screen onBack={goBack} />;
      case "coin-flip":
        return <CoinFlipScreen onBack={goBack} />;
      case "dice-roller":
        return <DiceRollerScreen onBack={goBack} />;
      case "bubble-pop":
        return <BubblePopScreen onBack={goBack} />;
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <HomeScreen onGameSelect={setCurrentGame} />
    </>
  );
}
