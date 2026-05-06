import { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { MemoryGameScreen } from "./src/games/memory-game";
import { HomeScreen } from "./src/screens/HomeScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const handleWelcomeFinish = () => {
    setShowWelcome(false);
  };

  const handleGameSelect = (gameId: string) => {
    setCurrentGame(gameId);
  };

  const handleBackToHome = () => {
    setCurrentGame(null);
  };

  const renderGame = () => {
    switch (currentGame) {
      case "memory-game":
        return <MemoryGameScreen />;
      default:
        return null;
    }
  };

  if (showWelcome) {
    return <WelcomeScreen onFinish={handleWelcomeFinish} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {currentGame ? (
        <View style={styles.gameWrapper}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToHome}
          >
            <Text style={styles.backButtonText}>← Back to Games</Text>
          </TouchableOpacity>
          {renderGame()}
        </View>
      ) : (
        <HomeScreen onGameSelect={handleGameSelect} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  gameWrapper: {
    flex: 1,
  },
  backButton: {
    backgroundColor: "#34495e",
    paddingHorizontal: 20,
    paddingVertical: 12,
    margin: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
