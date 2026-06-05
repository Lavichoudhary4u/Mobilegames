import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

function makeQuestion(level: number) {
  const ops = level < 2 ? ["+", "-"] : ["+", "-", "×", "÷"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  const max = level < 2 ? 20 : 50;
  if (op === "+") {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * max) + 10;
    b = Math.floor(Math.random() * a) + 1;
    answer = a - b;
  } else if (op === "×") {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    answer = a * b;
  } else {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * a) + 1;
    a = a * b;
    answer = a / b;
  }

  const wrong = new Set<number>();
  while (wrong.size < 3) {
    wrong.add(answer + (Math.floor(Math.random() * 10) - 5));
  }
  wrong.delete(answer);
  const opts = [...Array.from(wrong).slice(0, 3), answer].sort(
    () => Math.random() - 0.5,
  );
  return { question: `${a} ${op} ${b}`, answer, opts };
}

export const MathQuizScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [timer, setTimer] = useState(10);
  const [q, setQ] = useState(() => makeQuestion(1));
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);

  const next = useCallback(() => {
    setQ(makeQuestion(level));
    setTimer(10);
    setFlash(null);
  }, [level]);

  useEffect(() => {
    if (timer <= 0) {
      setStreak(0);
      next();
      return;
    }
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, next]);

  const pick = (val: number) => {
    if (flash) return;
    if (val === q.answer) {
      const ns = score + 10 + timer * 2;
      const nst = streak + 1;
      setScore(ns);
      setStreak(nst);
      if (ns > best) setBest(ns);
      if (nst > 0 && nst % 5 === 0) setLevel((l) => Math.min(l + 1, 3));
      setFlash("correct");
    } else {
      setStreak(0);
      setFlash("wrong");
    }
    setTimeout(next, 600);
  };

  return (
    <GameWrapper title="Math Quiz" onBack={onBack}>
      <View style={s.container}>
        <View style={s.topRow}>
          <View style={s.statBox}>
            <Text style={s.statL}>Score</Text>
            <Text style={s.statN}>{score}</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statL}>Streak</Text>
            <Text style={[s.statN, { color: "#f39c12" }]}>{streak}🔥</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statL}>Best</Text>
            <Text style={[s.statN, { color: "#27ae60" }]}>{best}</Text>
          </View>
        </View>

        <View
          style={[
            s.timerBar,
            {
              width: `${(timer / 10) * 100}%` as any,
              backgroundColor: timer <= 3 ? "#e74c3c" : "#f39c12",
            },
          ]}
        />

        <View
          style={[
            s.card,
            flash === "correct" && s.correct,
            flash === "wrong" && s.wrong,
          ]}
        >
          <Text style={s.lv}>Level {level}</Text>
          <Text style={s.qText}>{q.question} = ?</Text>
          <Text style={s.timerText}>{timer}s</Text>
        </View>

        <View style={s.opts}>
          {q.opts.map((o, i) => (
            <TouchableOpacity key={i} style={s.opt} onPress={() => pick(o)}>
              <Text style={s.optText}>{o}</Text>
            </TouchableOpacity>
          ))}
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
    padding: 20,
  },
  topRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statBox: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    minWidth: 90,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  statL: { color: "#888", fontSize: 12, fontWeight: "600" },
  statN: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 2 },
  timerBar: {
    height: 4,
    borderRadius: 2,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 28,
    width: "100%",
    borderWidth: 2,
    borderColor: "#0f3460",
  },
  correct: { borderColor: "#27ae60", backgroundColor: "#1a3a2a" },
  wrong: { borderColor: "#e74c3c", backgroundColor: "#3a1a1a" },
  lv: { color: "#888", fontSize: 13, marginBottom: 8 },
  qText: { color: "#fff", fontSize: 40, fontWeight: "900" },
  timerText: {
    color: "#f39c12",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  opts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  opt: {
    backgroundColor: "#16213e",
    borderRadius: 14,
    width: 120,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f39c12",
  },
  optText: { color: "#fff", fontSize: 24, fontWeight: "800" },
});
