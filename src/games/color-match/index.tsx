import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

const COLORS = [
  { name: "Red", hex: "#e74c3c" },
  { name: "Blue", hex: "#3498db" },
  { name: "Green", hex: "#27ae60" },
  { name: "Yellow", hex: "#f1c40f" },
  { name: "Purple", hex: "#9b59b6" },
  { name: "Orange", hex: "#e67e22" },
];

function makeRound() {
  const shown = COLORS[Math.floor(Math.random() * COLORS.length)];
  const textFor = COLORS[Math.floor(Math.random() * COLORS.length)];
  const match = Math.random() > 0.5;
  const displayColor = match
    ? shown
    : COLORS.filter((c) => c !== textFor)[Math.floor(Math.random() * 5)];
  return {
    shownName: shown.name,
    textColor: textFor.hex,
    displayColorHex: displayColor.hex,
    match: shown.hex === displayColor.hex,
  };
}

export const ColorMatchScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [round, setRound] = useState(() => makeRound());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timer, setTimer] = useState(5);
  const [streak, setStreak] = useState(0);
  const [flash, setFlash] = useState<null | "correct" | "wrong">(null);

  const next = useCallback(() => {
    setRound(makeRound());
    setTimer(5);
    setFlash(null);
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setStreak(0);
      if (score > best) setBest(score);
      next();
      return;
    }
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, next]);

  const answer = (yes: boolean) => {
    if (flash) return;
    const correct = yes === round.match;
    if (correct) {
      const ns = score + 10 + timer * 3;
      setScore(ns);
      setStreak((s) => s + 1);
      if (ns > best) setBest(ns);
      setFlash("correct");
    } else {
      setStreak(0);
      setFlash("wrong");
    }
    setTimeout(next, 500);
  };

  return (
    <GameWrapper title="Color Match" onBack={onBack}>
      <View style={s.container}>
        <View style={s.row}>
          <View style={s.sb}>
            <Text style={s.sl}>Score</Text>
            <Text style={s.sn}>{score}</Text>
          </View>
          <View style={s.sb}>
            <Text style={s.sl}>Streak</Text>
            <Text style={[s.sn, { color: "#f39c12" }]}>{streak}🔥</Text>
          </View>
          <View style={s.sb}>
            <Text style={s.sl}>Best</Text>
            <Text style={[s.sn, { color: "#27ae60" }]}>{best}</Text>
          </View>
        </View>

        <View
          style={[
            s.card,
            flash === "correct" && s.cCorrect,
            flash === "wrong" && s.cWrong,
          ]}
        >
          <Text style={s.instruction}>
            Does the color of the word match its name?
          </Text>
          <Text style={[s.word, { color: round.displayColorHex }]}>
            {round.shownName}
          </Text>
          <View style={[s.timer, { width: `${(timer / 5) * 100}%` as any }]} />
        </View>

        <View style={s.btnRow}>
          <TouchableOpacity style={[s.btn, s.yes]} onPress={() => answer(true)}>
            <Text style={s.btnTxt}>✅ YES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btn, s.no]} onPress={() => answer(false)}>
            <Text style={s.btnTxt}>❌ NO</Text>
          </TouchableOpacity>
        </View>
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
  row: { flexDirection: "row", gap: 12, marginBottom: 24 },
  sb: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    minWidth: 90,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  sl: { color: "#888", fontSize: 12, fontWeight: "600" },
  sn: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 2 },
  card: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: "100%",
    marginBottom: 28,
    borderWidth: 2,
    borderColor: "#e91e63",
    overflow: "hidden",
  },
  cCorrect: { borderColor: "#27ae60", backgroundColor: "#1a3a2a" },
  cWrong: { borderColor: "#e74c3c", backgroundColor: "#3a1a1a" },
  instruction: {
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
  },
  word: { fontSize: 52, fontWeight: "900" },
  timer: {
    height: 4,
    backgroundColor: "#e91e63",
    borderRadius: 2,
    alignSelf: "flex-start",
    marginTop: 20,
  },
  btnRow: { flexDirection: "row", gap: 16 },
  btn: { flex: 1, paddingVertical: 20, borderRadius: 16, alignItems: "center" },
  yes: { backgroundColor: "#27ae60" },
  no: { backgroundColor: "#e74c3c" },
  btnTxt: { color: "#fff", fontSize: 18, fontWeight: "800" },
});
