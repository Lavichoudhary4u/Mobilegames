import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

const COLS = 15,
  ROWS = 20,
  CELL = 18;
type Pos = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

function rand(): Pos {
  return {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS),
  };
}
function eq(a: Pos, b: Pos) {
  return a.x === b.x && a.y === b.y;
}

export const SnakeGameScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [snake, setSnake] = useState<Pos[]>([{ x: 7, y: 10 }]);
  const [food, setFood] = useState<Pos>(rand);
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);
  const dirRef = useRef<Dir>("RIGHT");
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);

  snakeRef.current = snake;
  foodRef.current = food;

  const move = useCallback(() => {
    const head = snakeRef.current[0];
    const d = dirRef.current;
    const nh: Pos = {
      x: d === "LEFT" ? head.x - 1 : d === "RIGHT" ? head.x + 1 : head.x,
      y: d === "UP" ? head.y - 1 : d === "DOWN" ? head.y + 1 : head.y,
    };
    if (nh.x < 0 || nh.x >= COLS || nh.y < 0 || nh.y >= ROWS) {
      setRunning(false);
      setDead(true);
      return;
    }
    if (snakeRef.current.some((s) => eq(s, nh))) {
      setRunning(false);
      setDead(true);
      return;
    }
    const ateFood = eq(nh, foodRef.current);
    const next = ateFood
      ? [nh, ...snakeRef.current]
      : [nh, ...snakeRef.current.slice(0, -1)];
    if (ateFood) {
      setFood(rand());
      setScore((s) => {
        const ns = s + 10;
        if (ns > best) setBest(ns);
        return ns;
      });
    }
    setSnake(next);
  }, [best]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(move, 150);
    return () => clearInterval(id);
  }, [running, move]);

  const start = () => {
    setSnake([{ x: 7, y: 10 }]);
    setFood(rand());
    setDir("RIGHT");
    dirRef.current = "RIGHT";
    setScore(0);
    setDead(false);
    setRunning(true);
  };

  const steer = (d: Dir) => {
    const opp: Record<Dir, Dir> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };
    if (d !== opp[dirRef.current]) {
      dirRef.current = d;
      setDir(d);
    }
  };

  return (
    <GameWrapper title="Snake" onBack={onBack}>
      <View style={s.container}>
        <View style={s.row}>
          <View style={s.sb}>
            <Text style={s.sl}>Score</Text>
            <Text style={s.sn}>{score}</Text>
          </View>
          <View style={s.sb}>
            <Text style={s.sl}>Best</Text>
            <Text style={[s.sn, { color: "#27ae60" }]}>{best}</Text>
          </View>
        </View>

        <View style={[s.board, { width: COLS * CELL, height: ROWS * CELL }]}>
          {/* Food */}
          <View
            style={[
              s.food,
              {
                left: food.x * CELL,
                top: food.y * CELL,
                width: CELL,
                height: CELL,
              },
            ]}
          />
          {/* Snake */}
          {snake.map((seg, i) => (
            <View
              key={i}
              style={[
                s.seg,
                {
                  left: seg.x * CELL,
                  top: seg.y * CELL,
                  width: CELL,
                  height: CELL,
                },
                i === 0 && s.head,
              ]}
            />
          ))}
          {!running && (
            <View style={s.overlay}>
              <Text style={s.overlayTxt}>
                {dead ? "💀 Dead!" : "Press Start"}
              </Text>
              {dead && <Text style={s.overlaySub}>Score: {score}</Text>}
            </View>
          )}
        </View>

        <View style={s.dpad}>
          <TouchableOpacity style={s.dBtn} onPress={() => steer("UP")}>
            <Text style={s.dTxt}>▲</Text>
          </TouchableOpacity>
          <View style={s.dRow}>
            <TouchableOpacity style={s.dBtn} onPress={() => steer("LEFT")}>
              <Text style={s.dTxt}>◄</Text>
            </TouchableOpacity>
            <View style={s.dMiddle} />
            <TouchableOpacity style={s.dBtn} onPress={() => steer("RIGHT")}>
              <Text style={s.dTxt}>►</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={s.dBtn} onPress={() => steer("DOWN")}>
            <Text style={s.dTxt}>▼</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.btn} onPress={start}>
          <Text style={s.btnTxt}>{dead || !running ? "Start" : "Restart"}</Text>
        </TouchableOpacity>
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
  row: { flexDirection: "row", gap: 20, marginBottom: 12 },
  sb: {
    backgroundColor: "#16213e",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    minWidth: 90,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  sl: { color: "#888", fontSize: 12, fontWeight: "600" },
  sn: { color: "#fff", fontSize: 20, fontWeight: "900", marginTop: 2 },
  board: {
    backgroundColor: "#0a0a1a",
    borderWidth: 2,
    borderColor: "#27ae60",
    position: "relative",
    marginBottom: 16,
  },
  seg: { position: "absolute", backgroundColor: "#27ae60", borderRadius: 2 },
  head: { backgroundColor: "#2ecc71", borderRadius: 3 },
  food: { position: "absolute", backgroundColor: "#e74c3c", borderRadius: 50 },
  overlay: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  overlayTxt: { color: "#fff", fontSize: 24, fontWeight: "900" },
  overlaySub: { color: "#aaa", fontSize: 16, marginTop: 4 },
  dpad: { alignItems: "center", gap: 4, marginBottom: 12 },
  dRow: { flexDirection: "row", gap: 4 },
  dBtn: {
    width: 56,
    height: 56,
    backgroundColor: "#16213e",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27ae60",
  },
  dTxt: { color: "#27ae60", fontSize: 22, fontWeight: "900" },
  dMiddle: { width: 56 },
  btn: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnTxt: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
