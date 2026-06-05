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

export const NumberGuessScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [target, setTarget] = useState(
    () => Math.floor(Math.random() * 100) + 1,
  );
  const [guess, setGuess] = useState("");
  const [hint, setHint] = useState("");
  const [tries, setTries] = useState(0);
  const [won, setWon] = useState(false);
  const [bestScore, setBest] = useState<number | null>(null);
  const [history, setHistory] = useState<{ val: number; dir: string }[]>([]);

  const handleGuess = () => {
    const n = parseInt(guess, 10);
    if (isNaN(n) || n < 1 || n > 100) {
      setHint("⚠️ Enter a number between 1–100");
      return;
    }
    const t = tries + 1;
    setTries(t);
    if (n === target) {
      setWon(true);
      setHint(`🎉 Got it in ${t} ${t === 1 ? "try" : "tries"}!`);
      if (!bestScore || t < bestScore) setBest(t);
      setHistory((h) => [...h, { val: n, dir: "✅" }]);
    } else {
      const dir = n < target ? "📈 Too low" : "📉 Too high";
      setHint(dir);
      setHistory((h) => [...h, { val: n, dir: n < target ? "↑" : "↓" }]);
    }
    setGuess("");
  };

  const restart = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setTries(0);
    setWon(false);
    setHint("");
    setHistory([]);
  };

  return (
    <GameWrapper title="Number Guess" onBack={onBack}>
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
          {/* Stats row */}
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statL}>Attempts</Text>
              <Text style={s.statN}>{tries}</Text>
            </View>
            <View style={s.statCenter}>
              <Text style={s.bigEmoji}>🔢</Text>
              <Text style={s.range}>1 — 100</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statL}>Best</Text>
              <Text style={[s.statN, { color: "#f39c12" }]}>
                {bestScore ?? "—"}
              </Text>
            </View>
          </View>

          {/* Hint */}
          <View style={s.hintBox}>
            <Text style={s.hintTxt}>
              {hint || "Guess a number between 1 and 100"}
            </Text>
          </View>

          {/* History */}
          {history.length > 0 && (
            <View style={s.historyBox}>
              <Text style={s.historyTitle}>History</Text>
              <View style={s.historyRow}>
                {history.slice(-6).map((h, i) => (
                  <View key={i} style={s.historyChip}>
                    <Text style={s.historyVal}>{h.val}</Text>
                    <Text style={s.historyDir}>{h.dir}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Input + button */}
          {!won ? (
            <View style={s.inputArea}>
              <TextInput
                style={s.input}
                value={guess}
                onChangeText={setGuess}
                keyboardType="number-pad"
                placeholder="Your guess..."
                placeholderTextColor="#555"
                maxLength={3}
                onSubmitEditing={handleGuess}
                returnKeyType="done"
              />
              <TouchableOpacity style={s.btn} onPress={handleGuess}>
                <Text style={s.btnTxt}>Guess!</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[s.btn, { marginTop: 16, paddingHorizontal: 48 }]}
              onPress={restart}
            >
              <Text style={s.btnTxt}>Play Again</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </GameWrapper>
  );
};

const s = StyleSheet.create({
  container: { padding: 20, alignItems: "center", paddingBottom: 40 },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  stat: {
    backgroundColor: "#16213e",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    minWidth: 80,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  statCenter: { alignItems: "center" },
  statL: { color: "#888", fontSize: 12, fontWeight: "600" },
  statN: { color: "#fff", fontSize: 26, fontWeight: "900", marginTop: 2 },
  bigEmoji: { fontSize: 52 },
  range: { color: "#9b59b6", fontSize: 14, fontWeight: "700", marginTop: 2 },
  hintBox: {
    backgroundColor: "#16213e",
    borderRadius: 16,
    padding: 18,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#9b59b6",
    alignItems: "center",
  },
  hintTxt: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  historyBox: { width: "100%", marginBottom: 16 },
  historyTitle: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  historyRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  historyChip: {
    backgroundColor: "#16213e",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  historyVal: { color: "#fff", fontWeight: "800", fontSize: 15 },
  historyDir: { color: "#888", fontSize: 11 },
  inputArea: { width: "100%", gap: 12 },
  input: {
    backgroundColor: "#16213e",
    color: "#fff",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 24,
    textAlign: "center",
    borderWidth: 2,
    borderColor: "#9b59b6",
    fontWeight: "700",
  },
  btn: {
    backgroundColor: "#9b59b6",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  btnTxt: { color: "#fff", fontWeight: "800", fontSize: 17 },
});
