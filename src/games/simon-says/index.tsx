import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

const COLORS = ["#e74c3c", "#27ae60", "#f39c12", "#3498db"];
const NAMES = ["Red", "Green", "Yellow", "Blue"];

export const SimonSaysScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [seq, setSeq] = useState<number[]>([]);
  const [player, setPlayer] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [phase, setPhase] = useState<"watch" | "play" | "idle">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lost, setLost] = useState(false);
  const flashRef = useRef<NodeJS.Timeout | null>(null);

  const flashSeq = (s: number[]) => {
    setPhase("watch");
    let i = 0;
    const step = () => {
      if (i >= s.length) {
        setActive(null);
        setPhase("play");
        return;
      }
      setActive(s[i]);
      i++;
      flashRef.current = setTimeout(() => {
        setActive(null);
        flashRef.current = setTimeout(step, 300);
      }, 600);
    };
    flashRef.current = setTimeout(step, 400);
  };

  const start = () => {
    const first = Math.floor(Math.random() * 4);
    setSeq([first]);
    setPlayer([]);
    setScore(0);
    setLost(false);
    flashSeq([first]);
  };

  const tap = (idx: number) => {
    if (phase !== "play") return;
    const next = [...player, idx];
    const pos = next.length - 1;
    if (next[pos] !== seq[pos]) {
      setLost(true);
      setPhase("idle");
      if (score > best) setBest(score);
      return;
    }
    if (next.length === seq.length) {
      const ns = score + 1;
      setScore(ns);
      const ns2 = [...seq, Math.floor(Math.random() * 4)];
      setSeq(ns2);
      setPlayer([]);
      setTimeout(() => flashSeq(ns2), 600);
    } else {
      setPlayer(next);
    }
  };

  useEffect(
    () => () => {
      if (flashRef.current) clearTimeout(flashRef.current);
    },
    [],
  );

  return (
    <GameWrapper title="Simon Says" onBack={onBack}>
      <View style={s.container}>
        <View style={s.statsRow}>
          <View style={s.sb}>
            <Text style={s.sl}>Round</Text>
            <Text style={s.sn}>{score}</Text>
          </View>
          <View style={s.sb}>
            <Text style={s.sl}>Best</Text>
            <Text style={[s.sn, { color: "#f39c12" }]}>{best}</Text>
          </View>
        </View>

        <View style={s.status}>
          {lost && <Text style={s.statusTxt}>💀 Game Over!</Text>}
          {phase === "watch" && (
            <Text style={s.statusTxt}>👀 Watch carefully...</Text>
          )}
          {phase === "play" && (
            <Text style={s.statusTxt}>
              🎯 Your turn! ({player.length}/{seq.length})
            </Text>
          )}
          {phase === "idle" && !lost && (
            <Text style={s.statusTxt}>Press Start!</Text>
          )}
        </View>

        <View style={s.grid}>
          {COLORS.map((color, i) => (
            <TouchableOpacity
              key={i}
              style={[
                s.pad,
                { backgroundColor: color, opacity: active === i ? 1 : 0.4 },
              ]}
              onPress={() => tap(i)}
              disabled={phase !== "play"}
            >
              <Text style={s.padTxt}>{NAMES[i]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.btn} onPress={start}>
          <Text style={s.btnTxt}>
            {lost || phase === "idle" ? "Start" : "Restart"}
          </Text>
        </TouchableOpacity>
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
  statsRow: { flexDirection: "row", gap: 20, marginBottom: 20 },
  sb: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minWidth: 100,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  sl: { color: "#888", fontSize: 13, fontWeight: "600" },
  sn: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 2 },
  status: { marginBottom: 24 },
  statusTxt: { color: "#fff", fontSize: 18, fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 280,
    gap: 12,
    justifyContent: "center",
    marginBottom: 28,
  },
  pad: {
    width: 128,
    height: 128,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  padTxt: { color: "#fff", fontWeight: "800", fontSize: 15 },
  btn: {
    backgroundColor: "#2196f3",
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
