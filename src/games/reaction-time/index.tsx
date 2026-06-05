import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

type Phase = "idle" | "wait" | "tap" | "result" | "toosoon";

export const ReactionTimeScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reaction, setReaction] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [rounds, setRounds] = useState<number[]>([]);
  const startRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRound = () => {
    setPhase("wait");
    setReaction(null);
    const delay = 2000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      setPhase("tap");
      startRef.current = Date.now();
    }, delay);
  };

  const handleTap = () => {
    if (phase === "idle" || phase === "result") {
      startRound();
      return;
    }
    if (phase === "wait") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase("toosoon");
      return;
    }
    if (phase === "tap") {
      const ms = Date.now() - startRef.current;
      setReaction(ms);
      const nr = [...rounds, ms];
      setRounds(nr);
      if (!best || ms < best) setBest(ms);
      setPhase("result");
    }
  };

  const avg =
    rounds.length > 0
      ? Math.round(rounds.reduce((a, b) => a + b, 0) / rounds.length)
      : null;

  const bgColor =
    phase === "wait" ? "#e74c3c" : phase === "tap" ? "#27ae60" : "#16213e";

  return (
    <GameWrapper title="Reaction Time" onBack={onBack}>
      <TouchableOpacity
        style={[s.container, { backgroundColor: bgColor }]}
        onPress={handleTap}
        activeOpacity={1}
      >
        <Text style={s.emoji}>
          {phase === "idle"
            ? "⚡"
            : phase === "wait"
              ? "🔴"
              : phase === "tap"
                ? "🟢"
                : phase === "toosoon"
                  ? "😅"
                  : "✅"}
        </Text>
        <Text style={s.main}>
          {phase === "idle"
            ? "Tap to Start"
            : phase === "wait"
              ? "Wait for GREEN..."
              : phase === "tap"
                ? "TAP NOW!"
                : phase === "toosoon"
                  ? "Too Soon! Tap to retry"
                  : `${reaction}ms`}
        </Text>
        {phase === "result" && <Text style={s.sub}>Tap to go again</Text>}
        {phase === "idle" && (
          <Text style={s.sub}>Test your reaction speed!</Text>
        )}

        <View style={s.statsArea}>
          {best && <Text style={s.stat}>🏆 Best: {best}ms</Text>}
          {avg && (
            <Text style={s.stat}>
              📊 Avg: {avg}ms ({rounds.length} rounds)
            </Text>
          )}
          {reaction && (
            <Text style={s.rating}>
              {reaction < 200
                ? "🔥 Superhuman!"
                : reaction < 250
                  ? "⚡ Excellent!"
                  : reaction < 350
                    ? "👍 Good"
                    : reaction < 500
                      ? "😐 Average"
                      : "🐢 Slow"}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </GameWrapper>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emoji: { fontSize: 80, marginBottom: 16 },
  main: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  sub: { color: "rgba(255,255,255,0.7)", fontSize: 16 },
  statsArea: { position: "absolute", bottom: 48, alignItems: "center", gap: 8 },
  stat: { color: "#fff", fontSize: 15, fontWeight: "600" },
  rating: { color: "#f1c40f", fontSize: 20, fontWeight: "800", marginTop: 4 },
});
