import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

const WORDS = [
  "REACT",
  "MOBILE",
  "FLUTTER",
  "JAVASCRIPT",
  "PYTHON",
  "ANDROID",
  "KEYBOARD",
  "NETWORK",
  "DATABASE",
  "FUNCTION",
  "VARIABLE",
  "BOOLEAN",
  "COMPONENT",
  "INTERFACE",
  "TYPESCRIPT",
  "ALGORITHM",
  "FRAMEWORK",
  "DEBUGGING",
  "COMPILER",
  "DEVELOPER",
];

function scramble(w: string): string {
  const a = w.split("");
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  const s = a.join("");
  return s === w ? scramble(w) : s;
}

export const WordScrambleScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [shuffled] = useState(() => [...WORDS].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [sc, setSc] = useState(() => scramble(WORDS[0]));
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [skips, setSkips] = useState(3);
  const [streak, setStreak] = useState(0);

  const current = shuffled[idx % shuffled.length];

  const advance = (skipWord = false) => {
    const ni = (idx + 1) % shuffled.length;
    setIdx(ni);
    setSc(scramble(shuffled[ni]));
    setInput("");
    setStatus("idle");
    if (skipWord) setStreak(0);
  };

  const check = () => {
    if (!input.trim()) return;
    if (input.toUpperCase() === current) {
      setScore((s) => s + 10 + streak * 5);
      setStreak((s) => s + 1);
      setStatus("correct");
      setTimeout(() => advance(), 700);
    } else {
      setStatus("wrong");
      setInput("");
      setTimeout(() => setStatus("idle"), 600);
    }
  };

  const skip = () => {
    if (skips <= 0) return;
    setSkips((s) => s - 1);
    advance(true);
  };

  const borderColor =
    status === "correct"
      ? "#27ae60"
      : status === "wrong"
        ? "#e74c3c"
        : "#1abc9c";

  return (
    <GameWrapper title="Word Scramble" onBack={onBack}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={s.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Stats */}
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statL}>Score</Text>
              <Text style={s.statN}>{score}</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statL}>Streak</Text>
              <Text style={[s.statN, { color: "#f39c12" }]}>{streak}🔥</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statL}>Skips</Text>
              <Text
                style={[s.statN, { color: skips === 0 ? "#e74c3c" : "#fff" }]}
              >
                {skips}
              </Text>
            </View>
          </View>

          {/* Scrambled word card */}
          <View style={[s.card, { borderColor }]}>
            <Text style={s.cardLabel}>Unscramble this word</Text>
            <Text style={[s.scrambled, { color: borderColor }]}>{sc}</Text>
            <Text style={s.letters}>{current.length} letters</Text>
            {status === "correct" && <Text style={s.correct}>✅ Correct!</Text>}
            {status === "wrong" && <Text style={s.wrong}>❌ Try again!</Text>}
          </View>

          {/* Hint dots */}
          <View style={s.dotsRow}>
            {current.split("").map((_, i) => (
              <View
                key={i}
                style={[
                  s.dot,
                  input.length > i && { backgroundColor: "#1abc9c" },
                ]}
              />
            ))}
          </View>

          {/* Input */}
          <TextInput
            style={[s.input, { borderColor }]}
            value={input}
            onChangeText={(t) => setInput(t.toUpperCase())}
            placeholder="Type your answer..."
            placeholderTextColor="#555"
            autoCapitalize="characters"
            autoCorrect={false}
            onSubmitEditing={check}
            returnKeyType="done"
          />

          {/* Buttons */}
          <View style={s.btnRow}>
            <TouchableOpacity style={s.submitBtn} onPress={check}>
              <Text style={s.btnTxt}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.skipBtn, skips === 0 && s.disabled]}
              onPress={skip}
              disabled={skips === 0}
            >
              <Text style={s.btnTxt}>Skip ({skips})</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GameWrapper>
  );
};

const s = StyleSheet.create({
  container: { padding: 20, alignItems: "center", paddingBottom: 40 },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  stat: {
    flex: 1,
    backgroundColor: "#16213e",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  statL: { color: "#888", fontSize: 12, fontWeight: "600" },
  statN: { color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 2 },
  card: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    width: "100%",
    borderWidth: 2,
    marginBottom: 16,
  },
  cardLabel: { color: "#888", fontSize: 13, marginBottom: 12 },
  scrambled: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 8,
    marginBottom: 8,
  },
  letters: { color: "#666", fontSize: 13 },
  correct: { color: "#27ae60", fontWeight: "800", fontSize: 16, marginTop: 8 },
  wrong: { color: "#e74c3c", fontWeight: "800", fontSize: 16, marginTop: 8 },
  dotsRow: { flexDirection: "row", gap: 6, marginBottom: 16 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16213e",
    borderWidth: 1,
    borderColor: "#1abc9c",
  },
  input: {
    backgroundColor: "#16213e",
    color: "#fff",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 20,
    borderWidth: 2,
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 16,
  },
  btnRow: { flexDirection: "row", gap: 12, width: "100%" },
  submitBtn: {
    flex: 1,
    backgroundColor: "#1abc9c",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  skipBtn: {
    flex: 1,
    backgroundColor: "#e74c3c",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  btnTxt: { color: "#fff", fontWeight: "800", fontSize: 15 },
  disabled: { opacity: 0.35 },
});
