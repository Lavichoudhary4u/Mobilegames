import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

const QUESTIONS = [
  {
    q: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Meta Language",
      "Home Tool Markup Language",
    ],
    a: 0,
  },
  {
    q: "Which planet is closest to the Sun?",
    options: ["Venus", "Earth", "Mercury", "Mars"],
    a: 2,
  },
  { q: "What is 7 × 8?", options: ["54", "56", "58", "52"], a: 1 },
  {
    q: "Who wrote Romeo and Juliet?",
    options: ["Dickens", "Hemingway", "Shakespeare", "Tolstoy"],
    a: 2,
  },
  {
    q: "What gas do plants absorb?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    a: 2,
  },
  {
    q: "How many sides does a hexagon have?",
    options: ["5", "7", "8", "6"],
    a: 3,
  },
  {
    q: "What is the capital of France?",
    options: ["Berlin", "Rome", "Madrid", "Paris"],
    a: 3,
  },
  {
    q: "What is the largest ocean?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    a: 3,
  },
  {
    q: "In which year did WW2 end?",
    options: ["1943", "1944", "1945", "1946"],
    a: 2,
  },
  {
    q: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    a: 2,
  },
  {
    q: "How many bones are in the human body?",
    options: ["196", "206", "216", "186"],
    a: 1,
  },
  {
    q: "What is the fastest land animal?",
    options: ["Lion", "Leopard", "Cheetah", "Horse"],
    a: 2,
  },
  {
    q: "Which language runs in the browser?",
    options: ["Python", "Java", "C++", "JavaScript"],
    a: 3,
  },
  {
    q: "What is the square root of 144?",
    options: ["11", "13", "14", "12"],
    a: 3,
  },
  {
    q: "How many colors are in a rainbow?",
    options: ["5", "6", "8", "7"],
    a: 3,
  },
];

export const QuizTriviaScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [questions] = useState(() =>
    [...QUESTIONS].sort(() => Math.random() - 0.5),
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.a) setScore((s) => s + 10);
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        setDone(true);
        return;
      }
      setIdx((n) => n + 1);
      setSelected(null);
    }, 1000);
  };

  const restart = () => {
    setIdx(0);
    setScore(0);
    setSelected(null);
    setDone(false);
  };

  if (done)
    return (
      <GameWrapper title="Trivia Quiz" onBack={onBack}>
        <View style={s.container}>
          <Text style={s.bigEmoji}>🏆</Text>
          <Text style={s.finalScore}>
            {score} / {questions.length * 10}
          </Text>
          <Text style={s.finalMsg}>
            {score >= 120
              ? "🔥 Genius!"
              : score >= 80
                ? "👍 Great job!"
                : "💪 Keep practicing!"}
          </Text>
          <TouchableOpacity style={s.btn} onPress={restart}>
            <Text style={s.btnTxt}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </GameWrapper>
    );

  return (
    <GameWrapper title="Trivia Quiz" onBack={onBack}>
      <View style={s.container}>
        <View style={s.topRow}>
          <Text style={s.progress}>
            {idx + 1} / {questions.length}
          </Text>
          <Text style={s.score}>Score: {score}</Text>
        </View>

        <View style={s.progressBar}>
          <View
            style={[
              s.progressFill,
              { width: `${((idx + 1) / questions.length) * 100}%` as any },
            ]}
          />
        </View>

        <View style={s.card}>
          <Text style={s.qText}>{q.q}</Text>
        </View>

        <View style={s.options}>
          {q.options.map((o, i) => {
            let bg = "#16213e";
            if (selected !== null) {
              if (i === q.a) bg = "#1a3a2a";
              else if (i === selected) bg = "#3a1a1a";
            }
            return (
              <TouchableOpacity
                key={i}
                style={[
                  s.opt,
                  { backgroundColor: bg },
                  selected !== null && i === q.a && s.correct,
                  selected === i && i !== q.a && s.wrong,
                ]}
                onPress={() => pick(i)}
              >
                <Text style={s.optTxt}>{o}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </GameWrapper>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e", padding: 20 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progress: { color: "#888", fontSize: 14, fontWeight: "600" },
  score: { color: "#8bc34a", fontSize: 14, fontWeight: "700" },
  progressBar: {
    height: 4,
    backgroundColor: "#16213e",
    borderRadius: 2,
    marginBottom: 24,
  },
  progressFill: { height: 4, backgroundColor: "#8bc34a", borderRadius: 2 },
  card: {
    backgroundColor: "#16213e",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  qText: { color: "#fff", fontSize: 18, fontWeight: "700", lineHeight: 26 },
  options: { gap: 10 },
  opt: {
    backgroundColor: "#16213e",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  correct: { borderColor: "#27ae60" },
  wrong: { borderColor: "#e74c3c" },
  optTxt: { color: "#fff", fontSize: 15, fontWeight: "600" },
  bigEmoji: { fontSize: 80, textAlign: "center", marginBottom: 16 },
  finalScore: {
    color: "#fff",
    fontSize: 52,
    fontWeight: "900",
    textAlign: "center",
  },
  finalMsg: {
    color: "#888",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 28,
  },
  btn: {
    backgroundColor: "#8bc34a",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
    alignSelf: "center",
  },
  btnTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
