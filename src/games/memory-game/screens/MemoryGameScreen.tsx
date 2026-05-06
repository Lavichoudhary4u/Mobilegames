import React, { useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GameCard } from "../components/GameCard";
import { useMemoryGame } from "../hooks/useMemoryGame";
import { GameLevel, LEVEL_CONFIGS } from "../utils/gameLogic";

export const MemoryGameScreen: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<GameLevel>("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [userId] = useState<string | null>(null); // null = not logged in, saves locally
  const [playerName] = useState("Guest Player");

  const {
    cards,
    moves,
    matches,
    isGameComplete,
    level,
    score,
    timeRemaining,
    handleCardPress,
    resetGame,
  } = useMemoryGame(selectedLevel, userId, playerName);

  const handleLevelSelect = (newLevel: GameLevel) => {
    setSelectedLevel(newLevel);
    setGameStarted(false);
  };

  const handleStartGame = () => {
    resetGame(selectedLevel);
    setGameStarted(true);
  };

  const handleNewGame = () => {
    setGameStarted(false);
  };

  const totalPairs = LEVEL_CONFIGS[level].pairs;
  const numColumns = level === "hard" ? 4 : 4;

  if (!gameStarted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎮 Memory Game</Text>
        <Text style={styles.subtitle}>Select Level</Text>

        <View style={styles.levelContainer}>
          <TouchableOpacity
            style={[
              styles.levelButton,
              selectedLevel === "easy" && styles.levelButtonSelected,
            ]}
            onPress={() => handleLevelSelect("easy")}
          >
            <Text style={styles.levelButtonText}>🟢 Easy</Text>
            <Text style={styles.levelDescription}>6 pairs • No time limit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.levelButton,
              selectedLevel === "medium" && styles.levelButtonSelected,
            ]}
            onPress={() => handleLevelSelect("medium")}
          >
            <Text style={styles.levelButtonText}>🟡 Medium</Text>
            <Text style={styles.levelDescription}>8 pairs • 2 min timer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.levelButton,
              selectedLevel === "hard" && styles.levelButtonSelected,
            ]}
            onPress={() => handleLevelSelect("hard")}
          >
            <Text style={styles.levelButtonText}>🔴 Hard</Text>
            <Text style={styles.levelDescription}>12 pairs • 3 min timer</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.gameContainer}>
      <Text style={styles.title}>Memory Game</Text>
      <Text style={styles.levelBadge}>{LEVEL_CONFIGS[level].name} Level</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statsLabel}>Moves</Text>
          <Text style={styles.statsText}>{moves}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statsLabel}>Matches</Text>
          <Text style={styles.statsText}>
            {matches}/{totalPairs}
          </Text>
        </View>
        {timeRemaining !== undefined && (
          <View style={styles.statBox}>
            <Text style={styles.statsLabel}>Time</Text>
            <Text
              style={[
                styles.statsText,
                timeRemaining < 30 && styles.timeWarning,
              ]}
            >
              {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, "0")}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={cards}
        numColumns={numColumns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GameCard card={item} onPress={handleCardPress} />
        )}
        contentContainerStyle={styles.grid}
        scrollEnabled={false}
      />

      {isGameComplete && (
        <View style={styles.winContainer}>
          <Text style={styles.winText}>🎉 You Won! 🎉</Text>
          <Text style={styles.winSubText}>Score: {score}</Text>
          <Text style={styles.winSubText}>Moves: {moves}</Text>
          {timeRemaining !== undefined && (
            <Text style={styles.winSubText}>
              Time Bonus: {timeRemaining * 5}
            </Text>
          )}
        </View>
      )}

      {timeRemaining === 0 && !isGameComplete && (
        <View style={styles.loseContainer}>
          <Text style={styles.loseText}>⏰ Time&apos;s Up!</Text>
          <Text style={styles.loseSubText}>Try again!</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => resetGame()}
        >
          <Text style={styles.resetButtonText}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={handleNewGame}>
          <Text style={styles.backButtonText}>Change Level</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  gameContainer: {
    backgroundColor: "#ecf0f1",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#34495e",
    marginBottom: 30,
  },
  levelBadge: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7f8c8d",
    marginBottom: 15,
  },
  levelContainer: {
    width: "100%",
    marginBottom: 30,
  },
  levelButton: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#bdc3c7",
    alignItems: "center",
  },
  levelButtonSelected: {
    borderColor: "#3498db",
    backgroundColor: "#ebf5fb",
  },
  levelButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  levelDescription: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  startButton: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 15,
    elevation: 3,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 80,
    elevation: 2,
  },
  statsLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  statsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  timeWarning: {
    color: "#e74c3c",
  },
  grid: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  winContainer: {
    position: "absolute",
    top: "35%",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
    borderWidth: 3,
    borderColor: "#27ae60",
  },
  winText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 15,
  },
  winSubText: {
    fontSize: 18,
    color: "#2c3e50",
    marginBottom: 5,
  },
  loseContainer: {
    position: "absolute",
    top: "35%",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
    borderWidth: 3,
    borderColor: "#e74c3c",
  },
  loseText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 10,
  },
  loseSubText: {
    fontSize: 18,
    color: "#7f8c8d",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  resetButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#95a5a6",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
