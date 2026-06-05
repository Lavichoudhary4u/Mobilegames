import React, { useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

export const CoinFlipScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [choice, setChoice] = useState<"heads" | "tails" | null>(null);
  const [score, setScore] = useState({ wins: 0, losses: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStr, setBest] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [history, setHistory] = useState<
    { choice: string; result: string; win: boolean }[]
  >([]);
  const spinAnim = useRef(new Animated.Value(0)).current;

  const flip = (picked: "heads" | "tails") => {
    if (flipping) return;
    setChoice(picked);
    setFlipping(true);
    spinAnim.setValue(0);

    Animated.sequence([
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const outcome: "heads" | "tails" =
        Math.random() < 0.5 ? "heads" : "tails";
      const won = outcome === picked;
      setResult(outcome);
      setFlipping(false);
      const ns = won ? streak + 1 : 0;
      setStreak(ns);
      if (ns > bestStr) setBest(ns);
      setScore((s) =>
        won ? { ...s, wins: s.wins + 1 } : { ...s, losses: s.losses + 1 },
      );
      setHistory((h) =>
        [{ choice: picked, result: outcome, win: won }, ...h].slice(0, 6),
      );
    });
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "90deg", "0deg"],
  });

  return (
    <GameWrapper title="Coin Flip" onBack={onBack}>
      <View style={s.container}>
        <View style={s.statsRow}>
          <View style={s.stat}>
            <Text style={s.sl}>Wins</Text>
            <Text style={[s.sn, { color: "#27ae60" }]}>{score.wins}</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.sl}>Streak 🔥</Text>
            <Text style={[s.sn, { color: "#f39c12" }]}>{streak}</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.sl}>Losses</Text>
            <Text style={[s.sn, { color: "#e74c3c" }]}>{score.losses}</Text>
          </View>
        </View>

        <Animated.View style={[s.coin, { transform: [{ rotateY: spin }] }]}>
          <Text style={s.coinEmoji}>
            {result === null ? "🪙" : result === "heads" ? "👑" : "🦅"}
          </Text>
          <Text style={s.coinLabel}>{result ?? "COIN"}</Text>
        </Animated.View>

        {result && choice && (
          <Text style={[s.verdict, result === choice ? s.win : s.lose]}>
            {result === choice ? "🎉 You Win!" : "💀 You Lose!"}
          </Text>
        )}

        <Text style={s.prompt}>Pick a side:</Text>
        <View style={s.btnRow}>
          <TouchableOpacity
            style={[s.choiceBtn, s.headsBtn]}
            onPress={() => flip("heads")}
            disabled={flipping}
          >
            <Text style={s.choiceEmoji}>👑</Text>
            <Text style={s.choiceTxt}>HEADS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.choiceBtn, s.tailsBtn]}
            onPress={() => flip("tails")}
            disabled={flipping}
          >
            <Text style={s.choiceEmoji}>🦅</Text>
            <Text style={s.choiceTxt}>TAILS</Text>
          </TouchableOpacity>
        </View>

        {history.length > 0 && (
          <View style={s.histBox}>
            <Text style={s.histTitle}>Recent flips</Text>
            <View style={s.histRow}>
              {history.map((h, i) => (
                <View
                  key={i}
                  style={[s.histChip, h.win ? s.histWin : s.histLose]}
                >
                  <Text style={s.histTxt}>
                    {h.result === "heads" ? "👑" : "🦅"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </GameWrapper>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a2e",
    padding: 24,
  },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 28 },
  stat: {
    backgroundColor: "#16213e",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    minWidth: 90,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  sl: { color: "#888", fontSize: 12, fontWeight: "600" },
  sn: { color: "#fff", fontSize: 26, fontWeight: "900", marginTop: 2 },
  coin: {
    width: 140,
    height: 140,
    backgroundColor: "#16213e",
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "#f39c12",
  },
  coinEmoji: { fontSize: 60 },
  coinLabel: {
    color: "#f39c12",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
    textTransform: "uppercase",
  },
  verdict: { fontSize: 24, fontWeight: "900", marginBottom: 16 },
  win: { color: "#27ae60" },
  lose: { color: "#e74c3c" },
  prompt: { color: "#888", fontSize: 15, fontWeight: "600", marginBottom: 14 },
  btnRow: { flexDirection: "row", gap: 16, marginBottom: 24 },
  choiceBtn: {
    width: 130,
    height: 90,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  headsBtn: { backgroundColor: "#1a2a1a", borderColor: "#27ae60" },
  tailsBtn: { backgroundColor: "#1a1a2a", borderColor: "#3498db" },
  choiceEmoji: { fontSize: 32 },
  choiceTxt: { color: "#fff", fontWeight: "800", fontSize: 14, marginTop: 4 },
  histBox: { alignItems: "center" },
  histTitle: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  histRow: { flexDirection: "row", gap: 8 },
  histChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  histWin: { backgroundColor: "#1a3a2a" },
  histLose: { backgroundColor: "#3a1a1a" },
  histTxt: { fontSize: 18 },
});
