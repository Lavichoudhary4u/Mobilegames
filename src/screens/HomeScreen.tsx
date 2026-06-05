import React, { useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Game } from "../shared/types";

interface HomeScreenProps {
  onGameSelect: (gameId: string) => void;
}

export const AVAILABLE_GAMES: Game[] = [
  {
    id: "memory-game",
    name: "Memory Game",
    icon: "🧠",
    description: "Match pairs of cards",
    color: "#3498db",
    category: "card",
  },
  {
    id: "tic-tac-toe",
    name: "Tic Tac Toe",
    icon: "❌",
    description: "Classic X and O battle",
    color: "#e74c3c",
    category: "puzzle",
  },
  {
    id: "snake-game",
    name: "Snake",
    icon: "🐍",
    description: "Eat and grow without crashing",
    color: "#27ae60",
    category: "arcade",
  },
  {
    id: "number-guess",
    name: "Number Guess",
    icon: "🔢",
    description: "Guess the secret number",
    color: "#9b59b6",
    category: "number",
  },
  {
    id: "rock-paper-scissors",
    name: "Rock Paper Scissors",
    icon: "✊",
    description: "Beat the computer",
    color: "#e67e22",
    category: "arcade",
  },
  {
    id: "word-scramble",
    name: "Word Scramble",
    icon: "📝",
    description: "Unscramble the letters",
    color: "#1abc9c",
    category: "word",
  },
  {
    id: "math-quiz",
    name: "Math Quiz",
    icon: "➕",
    description: "Solve math problems fast",
    color: "#f39c12",
    category: "number",
  },
  {
    id: "color-match",
    name: "Color Match",
    icon: "🎨",
    description: "Match colors under pressure",
    color: "#e91e63",
    category: "arcade",
  },
  {
    id: "simon-says",
    name: "Simon Says",
    icon: "🔴",
    description: "Repeat the color sequence",
    color: "#2196f3",
    category: "arcade",
  },
  {
    id: "hangman",
    name: "Hangman",
    icon: "🪢",
    description: "Guess the word letter by letter",
    color: "#795548",
    category: "word",
  },
  {
    id: "sudoku",
    name: "Sudoku",
    icon: "🔲",
    description: "Fill the 9x9 number grid",
    color: "#607d8b",
    category: "number",
  },
  {
    id: "whack-a-mole",
    name: "Whack-a-Mole",
    icon: "🔨",
    description: "Tap moles before they hide",
    color: "#ff5722",
    category: "arcade",
  },
  {
    id: "typing-speed",
    name: "Typing Speed",
    icon: "⌨️",
    description: "Type as fast as possible",
    color: "#00bcd4",
    category: "word",
  },
  {
    id: "reaction-time",
    name: "Reaction Time",
    icon: "⚡",
    description: "Test your reaction speed",
    color: "#ffeb3b",
    category: "arcade",
  },
  {
    id: "quiz-trivia",
    name: "Trivia Quiz",
    icon: "🏆",
    description: "Answer trivia questions",
    color: "#8bc34a",
    category: "word",
  },
  {
    id: "2048",
    name: "2048",
    icon: "🃏",
    description: "Merge tiles to reach 2048",
    color: "#3d5a80",
    category: "puzzle",
  },
  {
    id: "coin-flip",
    name: "Coin Flip",
    icon: "🪙",
    description: "Heads or tails — pick your luck",
    color: "#f39c12",
    category: "arcade",
  },
  {
    id: "dice-roller",
    name: "Dice Roller",
    icon: "🎲",
    description: "Roll the dice and track results",
    color: "#e67e22",
    category: "arcade",
  },
  {
    id: "bubble-pop",
    name: "Bubble Pop",
    icon: "🫧",
    description: "Pop bubbles before time runs out",
    color: "#e74c3c",
    category: "arcade",
  },
];

const CATEGORIES = ["all", "arcade", "puzzle", "card", "word", "number"];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onGameSelect }) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = AVAILABLE_GAMES.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "all" || g.category === activeCategory;
    return matchSearch && matchCat;
  });

  const renderGame = ({ item }: { item: Game }) => (
    <TouchableOpacity
      style={[styles.card, { borderColor: item.color + "88" }]}
      onPress={() => onGameSelect(item.id)}
      activeOpacity={0.75}
    >
      <View style={[styles.iconBg, { backgroundColor: item.color + "22" }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={styles.gameName}>{item.name}</Text>
      <Text style={styles.gameDesc}>{item.description}</Text>
      <View style={[styles.playBtn, { backgroundColor: item.color }]}>
        <Text style={styles.playText}>PLAY</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎮 Game Hub</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>{AVAILABLE_GAMES.length} Games</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.search}
          placeholder="Search games..."
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Text style={styles.clearTxt}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category tabs */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c}
        showsHorizontalScrollIndicator={false}
        style={styles.catList}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.catBtn,
              activeCategory === item && styles.catBtnActive,
            ]}
            onPress={() => setActiveCategory(item)}
          >
            <Text
              style={[
                styles.catText,
                activeCategory === item && styles.catTextActive,
              ]}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Game grid */}
      <FlatList
        data={filtered}
        keyExtractor={(g) => g.id}
        numColumns={2}
        renderItem={renderGame}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTxt}>No games found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: { fontSize: 28, fontWeight: "900", color: "#fff", letterSpacing: 0.5 },
  badge: {
    backgroundColor: "#e94560",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTxt: { color: "#fff", fontSize: 12, fontWeight: "700" },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16213e",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  searchIcon: { fontSize: 16, marginRight: 6 },
  search: { flex: 1, color: "#fff", paddingVertical: 10, fontSize: 14 },
  clearTxt: { color: "#555", fontSize: 16, paddingLeft: 8 },
  catList: { maxHeight: 42, marginBottom: 10 },
  catBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#16213e",
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  catBtnActive: { backgroundColor: "#e94560", borderColor: "#e94560" },
  catText: { color: "#666", fontSize: 13, fontWeight: "600" },
  catTextActive: { color: "#fff" },
  grid: { paddingHorizontal: 10, paddingBottom: 24 },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: "#16213e",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    borderWidth: 1.5,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconBg: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: { fontSize: 32 },
  gameName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 3,
  },
  gameDesc: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 14,
  },
  playBtn: { paddingHorizontal: 18, paddingVertical: 5, borderRadius: 20 },
  playText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  emptyBox: { alignItems: "center", marginTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 10 },
  emptyTxt: { color: "#555", fontSize: 16 },
});
