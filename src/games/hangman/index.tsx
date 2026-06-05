import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

const WORDS = [
  "ASTRONAUT",
  "JAVASCRIPT",
  "ELEPHANT",
  "MOUNTAIN",
  "KEYBOARD",
  "DINOSAUR",
  "UNIVERSE",
  "CHOCOLATE",
  "ADVENTURE",
  "HURRICANE",
  "PROGRAMMING",
  "ALGORITHM",
  "SUBMARINE",
  "BUTTERFLY",
  "FIREWORKS",
  "DEVELOPER",
  "FRAMEWORK",
  "DATABASE",
];
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_WRONG = 6;
const HANG = ["😊", "😟", "😨", "😰", "😱", "💀", "☠️"];

function pick() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export const HangmanScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [word, setWord] = useState(pick);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);

  const wrong = [...guessed].filter((l) => !word.includes(l)).length;
  const won = word.split("").every((l) => guessed.has(l));
  const lost = wrong >= MAX_WRONG;
  const lives = MAX_WRONG - wrong;
  const pct = wrong / MAX_WRONG;

  const guess = (l: string) => {
    if (guessed.has(l) || won || lost) return;
    const ng = new Set(guessed);
    ng.add(l);
    setGuessed(ng);
    if (word.includes(l)) {
      const fullyWon = word.split("").every((c) => ng.has(c));
      if (fullyWon) setScore((s) => s + word.length * 10);
    }
  };

  const restart = () => {
    setWord(pick());
    setGuessed(new Set());
  };

  return (
    <GameWrapper title="Hangman" onBack={onBack}>
      <ScrollView
        contentContainerStyle={s.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top stats */}
        <View style={s.topRow}>
          <View style={s.statBox}>
            <Text style={s.statL}>Score</Text>
            <Text style={s.statN}>{score}</Text>
          </View>
          <View style={s.figureBox}>
            <Text style={s.face}>{HANG[Math.min(wrong, HANG.length - 1)]}</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statL}>Lives</Text>
            <Text
              style={[
                s.statN,
                {
                  color:
                    pct >= 0.66
                      ? "#e74c3c"
                      : pct >= 0.33
                        ? "#f39c12"
                        : "#27ae60",
                },
              ]}
            >
              {lives}/{MAX_WRONG}
            </Text>
          </View>
        </View>

        {/* Health bar */}
        <View style={s.lifeBarBg}>
          <View
            style={[
              s.lifeBarFill,
              {
                width: `${(lives / MAX_WRONG) * 100}%` as any,
                backgroundColor:
                  pct >= 0.66 ? "#e74c3c" : pct >= 0.33 ? "#f39c12" : "#27ae60",
              },
            ]}
          />
        </View>

        {/* Word display */}
        <View style={s.wordRow}>
          {word.split("").map((l, i) => (
            <View key={i} style={s.letterBox}>
              <Text
                style={[
                  s.letterTxt,
                  !guessed.has(l) && !lost && { color: "transparent" },
                ]}
              >
                {guessed.has(l) || lost ? l : "_"}
              </Text>
              <View style={s.letterLine} />
            </View>
          ))}
        </View>

        {/* Status message */}
        {won && <Text style={s.won}>🎉 You Won! +{word.length * 10} pts</Text>}
        {lost && <Text style={s.lost}>💀 It was: {word}</Text>}

        {/* Keyboard */}
        <View style={s.keyboard}>
          {ALPHA.map((l) => {
            const isGuessed = guessed.has(l);
            const isHit = isGuessed && word.includes(l);
            const isMiss = isGuessed && !word.includes(l);
            return (
              <TouchableOpacity
                key={l}
                style={[s.key, isHit && s.hit, isMiss && s.miss]}
                onPress={() => guess(l)}
                disabled={isGuessed || won || lost}
              >
                <Text
                  style={[s.keyTxt, (isHit || isMiss) && { color: "#fff" }]}
                >
                  {l}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {(won || lost) && (
          <TouchableOpacity style={s.btn} onPress={restart}>
            <Text style={s.btnTxt}>Next Word</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </GameWrapper>
  );
};

const s = StyleSheet.create({
  container: { padding: 16, alignItems: "center", paddingBottom: 30 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  statBox: {
    backgroundColor: "#16213e",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    minWidth: 80,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  statL: { color: "#888", fontSize: 12, fontWeight: "600" },
  statN: { color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 2 },
  figureBox: { alignItems: "center" },
  face: { fontSize: 56 },
  lifeBarBg: {
    width: "100%",
    height: 6,
    backgroundColor: "#16213e",
    borderRadius: 3,
    marginBottom: 20,
    overflow: "hidden",
  },
  lifeBarFill: { height: 6, borderRadius: 3 },
  wordRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    marginBottom: 12,
  },
  letterBox: { alignItems: "center", marginHorizontal: 2 },
  letterTxt: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    minWidth: 20,
    textAlign: "center",
  },
  letterLine: {
    height: 2,
    backgroundColor: "#3498db",
    width: "100%",
    marginTop: 2,
    minWidth: 20,
  },
  won: { color: "#27ae60", fontSize: 18, fontWeight: "800", marginBottom: 10 },
  lost: { color: "#e74c3c", fontSize: 18, fontWeight: "800", marginBottom: 10 },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 7,
    marginTop: 8,
    marginBottom: 16,
  },
  key: {
    width: 36,
    height: 38,
    backgroundColor: "#16213e",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  hit: { backgroundColor: "#27ae60", borderColor: "#27ae60" },
  miss: { backgroundColor: "#c0392b", borderColor: "#c0392b" },
  keyTxt: { color: "#ccc", fontWeight: "700", fontSize: 13 },
  btn: {
    backgroundColor: "#795548",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnTxt: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
