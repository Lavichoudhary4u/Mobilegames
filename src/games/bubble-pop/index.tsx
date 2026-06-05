import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

const { width: SW } = Dimensions.get("window");
const BOARD_W = Math.min(SW - 32, 360);
const COLS = 8;
const CELL = Math.floor(BOARD_W / COLS);

interface Bubble {
  id: number;
  color: string;
  row: number;
  col: number;
  popped: boolean;
}

const COLORS = [
  "#e74c3c",
  "#3498db",
  "#27ae60",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
];

function makeBubbles(): Bubble[] {
  const bubbles: Bubble[] = [];
  let id = 0;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < COLS; col++) {
      bubbles.push({
        id: id++,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        row,
        col,
        popped: false,
      });
    }
  }
  return bubbles;
}

export const BubblePopScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [bubbles, setBubbles] = useState(makeBubbles);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timer, setTimer] = useState(30);
  const [running, setRunning] = useState(false);
  const [combo, setCombo] = useState(0);
  const comboTimer = useRef<NodeJS.Timeout | null>(null);
  const gameTimer = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    setBubbles(makeBubbles());
    setScore(0);
    setTimer(30);
    setCombo(0);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    gameTimer.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setRunning(false);
          clearInterval(gameTimer.current!);
          setScore((s) => {
            if (s > best) setBest(s);
            return s;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(gameTimer.current!);
  }, [running]);

  const pop = useCallback(
    (bubble: Bubble) => {
      if (!running || bubble.popped) return;
      setBubbles((prev) =>
        prev.map((b) => (b.id === bubble.id ? { ...b, popped: true } : b)),
      );
      setCombo((c) => {
        const nc = c + 1;
        if (comboTimer.current) clearTimeout(comboTimer.current);
        comboTimer.current = setTimeout(() => setCombo(0), 1500);
        const pts = nc >= 5 ? 30 : nc >= 3 ? 20 : 10;
        setScore((s) => s + pts);
        return nc;
      });
      // re-add a new bubble after pop
      setTimeout(() => {
        setBubbles((prev) =>
          prev.map((b) =>
            b.id === bubble.id
              ? {
                  ...b,
                  popped: false,
                  color: COLORS[Math.floor(Math.random() * COLORS.length)],
                }
              : b,
          ),
        );
      }, 400);
    },
    [running],
  );

  return (
    <GameWrapper title="Bubble Pop" onBack={onBack}>
      <View style={s.container}>
        <View style={s.statsRow}>
          <View style={s.stat}>
            <Text style={s.sl}>Score</Text>
            <Text style={s.sn}>{score}</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.sl}>Time</Text>
            <Text style={[s.sn, timer <= 5 && { color: "#e74c3c" }]}>
              {timer}s
            </Text>
          </View>
          <View style={s.stat}>
            <Text style={s.sl}>Best</Text>
            <Text style={[s.sn, { color: "#f39c12" }]}>{best}</Text>
          </View>
        </View>

        {combo >= 3 && <Text style={s.combo}>🔥 {combo}x Combo!</Text>}

        <View style={[s.board, { width: BOARD_W }]}>
          {bubbles.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={[
                s.bubble,
                {
                  width: CELL - 6,
                  height: CELL - 6,
                  borderRadius: (CELL - 6) / 2,
                  backgroundColor: b.popped ? "transparent" : b.color,
                  borderColor: b.popped ? "transparent" : b.color,
                },
              ]}
              onPress={() => pop(b)}
              activeOpacity={0.6}
            >
              {!b.popped && <Text style={s.bubbleTxt}>•</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {!running && (
          <View style={s.overlay}>
            {timer === 0 && <Text style={s.endTxt}>Final Score: {score}</Text>}
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
    backgroundColor: "#1a1a2e",
    paddingTop: 12,
  },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 10 },
  stat: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    minWidth: 90,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  sl: { color: "#888", fontSize: 12, fontWeight: "600" },
  sn: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 2 },
  combo: { color: "#f39c12", fontSize: 18, fontWeight: "900", marginBottom: 6 },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#0d1117",
    borderRadius: 12,
    padding: 3,
    gap: 3,
  },
  bubble: {
    justifyContent: "center",
    alignItems: "center",
    margin: 3,
    borderWidth: 2,
  },
  bubbleTxt: { color: "rgba(255,255,255,0.4)", fontSize: 20 },
  overlay: { marginTop: 20, alignItems: "center", gap: 12 },
  endTxt: { color: "#fff", fontSize: 20, fontWeight: "700" },
  btn: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
