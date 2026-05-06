import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Game } from "../shared/types";

interface HomeScreenProps {
  onGameSelect: (gameId: string) => void;
}

const AVAILABLE_GAMES: Game[] = [
  {
    id: "memory-game",
    name: "Memory Game",
    description: "Match pairs of cards",
    icon: "🧠",
    color: "#3498db",
  },
  // Add more games here later
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onGameSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Game Hub</Text>
      <Text style={styles.subtitle}>Choose a game to play</Text>

      <ScrollView contentContainerStyle={styles.gamesContainer}>
        {AVAILABLE_GAMES.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={[styles.gameCard, { borderColor: game.color }]}
            onPress={() => onGameSelect(game.id)}
          >
            <Text style={styles.gameIcon}>{game.icon}</Text>
            <Text style={styles.gameName}>{game.name}</Text>
            <Text style={styles.gameDescription}>{game.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.footer}>More games coming soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 30,
  },
  gamesContainer: {
    paddingBottom: 20,
  },
  gameCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 3,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gameIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  gameName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
  footer: {
    fontSize: 14,
    color: "#95a5a6",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
  },
});
