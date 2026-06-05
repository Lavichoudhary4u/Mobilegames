import React, { useCallback, useState } from "react";
import {
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

type Grid = number[][];

function emptyGrid(): Grid {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
}

function addRandom(g: Grid): Grid {
  const empty: [number, number][] = [];
  g.forEach((row, r) =>
    row.forEach((v, c) => {
      if (!v) empty.push([r, c]);
    }),
  );
  if (!empty.length) return g;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = g.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideRow(row: number[]): { row: number[]; score: number } {
  const filtered = row.filter((v) => v !== 0);
  let score = 0;
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      score += filtered[i];
      filtered[i + 1] = 0;
    }
  }
  const merged = filtered.filter((v) => v !== 0);
  while (merged.length < 4) merged.push(0);
  return { row: merged, score };
}

function moveGrid(
  g: Grid,
  dir: "left" | "right" | "up" | "down",
): { grid: Grid; score: number } {
  let totalScore = 0;
  let next = g.map((r) => [...r]);
  if (dir === "right")
    next = next.map((r) => {
      const { row, score } = slideRow([...r].reverse());
      totalScore += score;
      return row.reverse();
    });
  if (dir === "left")
    next = next.map((r) => {
      const { row, score } = slideRow(r);
      totalScore += score;
      return row;
    });
  if (dir === "up" || dir === "down") {
    const transposed = next[0].map((_, c) => next.map((r) => r[c]));
    const moved = transposed.map((r) => {
      const arr = dir === "down" ? [...r].reverse() : r;
      const { row, score } = slideRow(arr);
      totalScore += score;
      return dir === "down" ? row.reverse() : row;
    });
    next = next.map((_, r) => moved.map((c) => c[r]));
  }
  return { grid: next, score: totalScore };
}

function gridsEqual(a: Grid, b: Grid) {
  return a.every((row, r) => row.every((v, c) => v === b[r][c]));
}

const TILE_COLORS: Record<number, string> = {
  0: "#1a2a3a",
  2: "#3d5a80",
  4: "#5e8ab4",
  8: "#e9c46a",
  16: "#f4a261",
  32: "#e76f51",
  64: "#d62828",
  128: "#a8dadc",
  256: "#457b9d",
  512: "#1d3557",
  1024: "#f6bd60",
  2048: "#f7c59f",
};

export const Game2048Screen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [grid, setGrid] = useState(() => addRandom(addRandom(emptyGrid())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);

  const move = useCallback(
    (dir: "left" | "right" | "up" | "down") => {
      setGrid((prev) => {
        const { grid: next, score: gained } = moveGrid(prev, dir);
        if (gridsEqual(prev, next)) return prev;
        const withNew = addRandom(next);
        setScore((s) => {
          const ns = s + gained;
          if (ns > best) setBest(ns);
          return ns;
        });
        return withNew;
      });
    },
    [best],
  );

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (_, g) => {
      const { dx, dy } = g;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
      else move(dy > 0 ? "down" : "up");
    },
  });

  const restart = () => {
    setGrid(addRandom(addRandom(emptyGrid())));
    setScore(0);
    setOver(false);
  };

  return (
    <GameWrapper title="2048" onBack={onBack}>
      <View style={s.container}>
        <View style={s.statsRow}>
          <View style={s.stat}>
            <Text style={s.sl}>Score</Text>
            <Text style={s.sn}>{score}</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.sl}>Best</Text>
            <Text style={[s.sn, { color: "#f39c12" }]}>{best}</Text>
          </View>
        </View>

        <View style={s.board} {...panResponder.panHandlers}>
          {grid.map((row, r) => (
            <View key={r} style={s.row}>
              {row.map((val, c) => (
                <View
                  key={c}
                  style={[
                    s.tile,
                    { backgroundColor: TILE_COLORS[val] || "#f7c59f" },
                  ]}
                >
                  <Text
                    style={[
                      s.tileTxt,
                      val >= 1000 && { fontSize: 16 },
                      val >= 100 && val < 1000 && { fontSize: 20 },
                    ]}
                  >
                    {val || ""}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text style={s.swipeTip}>← Swipe to move tiles →</Text>

        <View style={s.arrowPad}>
          <TouchableOpacity style={s.arrowBtn} onPress={() => move("up")}>
            <Text style={s.arrowTxt}>▲</Text>
          </TouchableOpacity>
          <View style={s.arrowRow}>
            <TouchableOpacity style={s.arrowBtn} onPress={() => move("left")}>
              <Text style={s.arrowTxt}>◄</Text>
            </TouchableOpacity>
            <View style={s.arrowMid} />
            <TouchableOpacity style={s.arrowBtn} onPress={() => move("right")}>
              <Text style={s.arrowTxt}>►</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={s.arrowBtn} onPress={() => move("down")}>
            <Text style={s.arrowTxt}>▼</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.btn} onPress={restart}>
          <Text style={s.btnTxt}>New Game</Text>
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
    paddingBottom: 16,
  },
  statsRow: { flexDirection: "row", gap: 16, marginBottom: 12 },
  stat: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    minWidth: 100,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  sl: { color: "#888", fontSize: 12, fontWeight: "600" },
  sn: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 2 },
  board: { backgroundColor: "#0f3460", padding: 8, borderRadius: 12, gap: 6 },
  row: { flexDirection: "row", gap: 6 },
  tile: {
    width: 74,
    height: 74,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  tileTxt: { color: "#fff", fontSize: 26, fontWeight: "900" },
  swipeTip: { color: "#444", fontSize: 12, marginTop: 10, marginBottom: 6 },
  arrowPad: { alignItems: "center", gap: 4, marginBottom: 12 },
  arrowRow: { flexDirection: "row", gap: 4 },
  arrowBtn: {
    width: 50,
    height: 50,
    backgroundColor: "#16213e",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3d5a80",
  },
  arrowTxt: { color: "#3d5a80", fontSize: 20, fontWeight: "900" },
  arrowMid: { width: 50 },
  btn: {
    backgroundColor: "#3d5a80",
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnTxt: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
