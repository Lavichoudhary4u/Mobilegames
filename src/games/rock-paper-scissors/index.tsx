import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

const CHOICES = ["✊", "✋", "✌️"] as const;
type Choice = (typeof CHOICES)[number];

const NAMES: Record<Choice, string> = {
  "✊": "Rock",
  "✋": "Paper",
  "✌️": "Scissors",
};

function getResult(p: Choice, c: Choice) {
  if (p === c) return "draw";
  if (
    (p === "✊" && c === "✌️") ||
    (p === "✋" && c === "✊") ||
    (p === "✌️" && c === "✋")
  )
    return "win";
  return "lose";
}

export const RockPaperScissorsScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [scores, setScores] = useState({ wins: 0, losses: 0, draws: 0 });
  const [playerPick, setPlayer] = useState<Choice | null>(null);
  const [cpuPick, setCpu] = useState<Choice | null>(null);
  const [result, setResult] = useState("");

  const play = (pick: Choice) => {
    const cpu = CHOICES[Math.floor(Math.random() * 3)];
    const res = getResult(pick, cpu);
    setPlayer(pick);
    setCpu(cpu);
    if (res === "win") {
      setResult("🎉 You Win!");
      setScores((s) => ({ ...s, wins: s.wins + 1 }));
    }
    if (res === "lose") {
      setResult("💀 You Lose!");
      setScores((s) => ({ ...s, losses: s.losses + 1 }));
    }
    if (res === "draw") {
      setResult("🤝 Draw!");
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
    }
  };

  return (
    <GameWrapper title="Rock Paper Scissors" onBack={onBack}>
      <View style={s.container}>
        <View style={s.scoreRow}>
          <View style={s.scoreBox}>
            <Text style={s.sl}>Wins</Text>
            <Text style={[s.sn, { color: "#27ae60" }]}>{scores.wins}</Text>
          </View>
          <View style={s.scoreBox}>
            <Text style={s.sl}>Draws</Text>
            <Text style={[s.sn, { color: "#f39c12" }]}>{scores.draws}</Text>
          </View>
          <View style={s.scoreBox}>
            <Text style={s.sl}>Losses</Text>
            <Text style={[s.sn, { color: "#e74c3c" }]}>{scores.losses}</Text>
          </View>
        </View>

        <View style={s.arena}>
          <View style={s.side}>
            <Text style={s.label}>You</Text>
            <Text style={s.choice}>{playerPick ?? "❓"}</Text>
          </View>
          <Text style={s.vs}>VS</Text>
          <View style={s.side}>
            <Text style={s.label}>CPU</Text>
            <Text style={s.choice}>{cpuPick ?? "❓"}</Text>
          </View>
        </View>

        {result ? (
          <Text style={s.result}>{result}</Text>
        ) : (
          <Text style={s.result}>Pick your move!</Text>
        )}

        <View style={s.choices}>
          {CHOICES.map((c) => (
            <TouchableOpacity
              key={c}
              style={s.choiceBtn}
              onPress={() => play(c)}
            >
              <Text style={s.choiceEmoji}>{c}</Text>
              <Text style={s.choiceName}>{NAMES[c]}</Text>
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
  scoreRow: { flexDirection: "row", gap: 12, marginBottom: 28 },
  scoreBox: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    minWidth: 80,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  sl: { color: "#888", fontSize: 12, fontWeight: "600" },
  sn: { fontSize: 26, fontWeight: "900", marginTop: 2 },
  arena: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },
  side: { alignItems: "center" },
  label: { color: "#888", fontSize: 13, fontWeight: "600", marginBottom: 6 },
  choice: { fontSize: 64 },
  vs: { color: "#e94560", fontSize: 22, fontWeight: "900" },
  result: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 28 },
  choices: { flexDirection: "row", gap: 16 },
  choiceBtn: {
    backgroundColor: "#16213e",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e67e22",
  },
  choiceEmoji: { fontSize: 40 },
  choiceName: { color: "#aaa", fontSize: 12, fontWeight: "600", marginTop: 4 },
});
