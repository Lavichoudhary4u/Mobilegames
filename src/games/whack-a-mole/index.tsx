import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

const GRID = 9;

export const WhackAMoleScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [moles, setMoles] = useState<boolean[]>(Array(GRID).fill(false));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timer, setTimer] = useState(30);
  const [running, setRunning] = useState(false);
  const [misses, setMisses] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showMole = useCallback(() => {
    setMoles((prev) => {
      const next = Array(GRID).fill(false);
      const count = Math.min(3, Math.floor(score / 10) + 1);
      const used = new Set<number>();
      while (used.size < count) used.add(Math.floor(Math.random() * GRID));
      used.forEach((i) => {
        next[i] = true;
      });
      return next;
    });
  }, [score]);

  const start = () => {
    setScore(0);
    setMisses(0);
    setTimer(30);
    setMoles(Array(GRID).fill(false));
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(showMole, 800);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setRunning(false);
          setMoles(Array(GRID).fill(false));
          clearInterval(intervalRef.current!);
          clearInterval(timerRef.current!);
          setScore((s) => {
            if (s > best) setBest(s);
            return s;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      clearInterval(intervalRef.current!);
      clearInterval(timerRef.current!);
    };
  }, [running]);

  const whack = (i: number) => {
    if (!running || !moles[i]) {
      if (running) setMisses((m) => m + 1);
      return;
    }
    setMoles((prev) => {
      const n = [...prev];
      n[i] = false;
      return n;
    });
    setScore((s) => s + 10);
  };

  return (
    <GameWrapper title="Whack-a-Mole" onBack={onBack}>
      <View style={s.container}>
        <View style={s.row}>
          <View style={s.sb}>
            <Text style={s.sl}>Score</Text>
            <Text style={s.sn}>{score}</Text>
          </View>
          <View style={s.sb}>
            <Text style={s.sl}>Time</Text>
            <Text style={[s.sn, { color: timer <= 5 ? "#e74c3c" : "#fff" }]}>
              {timer}s
            </Text>
          </View>
          <View style={s.sb}>
            <Text style={s.sl}>Best</Text>
            <Text style={[s.sn, { color: "#f39c12" }]}>{best}</Text>
          </View>
        </View>

        <View style={s.grid}>
          {moles.map((m, i) => (
            <TouchableOpacity key={i} style={s.hole} onPress={() => whack(i)}>
              <Text style={s.mole}>{m ? "🐭" : "🕳️"}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!running && (
          <View style={s.endBox}>
            {timer === 0 && (
              <Text style={s.endTxt}>Time is Up! Score: {score}</Text>
            )}
            <TouchableOpacity style={s.btn} onPress={start}>
              <Text style={s.btnTxt}>
                {timer === 0 ? "Play Again" : "Start"}
              </Text>
            </TouchableOpacity>
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
    padding: 20,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 300,
    gap: 10,
    justifyContent: "center",
  },
  hole: {
    width: 88,
    height: 88,
    backgroundColor: "#16213e",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0f3460",
  },
  mole: { fontSize: 44 },
  endBox: { marginTop: 24, alignItems: "center", gap: 14 },
  endTxt: { color: "#fff", fontSize: 18, fontWeight: "700" },
  btn: {
    backgroundColor: "#ff5722",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
