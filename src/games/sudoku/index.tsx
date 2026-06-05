import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

const BASE_PUZZLE = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];
const SOLUTION = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

export const SudokuScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [grid, setGrid] = useState(() => BASE_PUZZLE.map((r) => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState(0);
  const [won, setWon] = useState(false);

  const select = (r: number, c: number) => {
    if (BASE_PUZZLE[r][c] !== 0) return;
    setSelected([r, c]);
  };

  const fill = (val: number) => {
    if (!selected || won) return;
    const [r, c] = selected;
    const next = grid.map((row) => [...row]);
    next[r][c] = val;
    if (val !== SOLUTION[r][c]) setErrors((e) => e + 1);
    setGrid(next);
    const complete = next.every((row, ri) =>
      row.every((cell, ci) => cell === SOLUTION[ri][ci]),
    );
    if (complete) setWon(true);
    setSelected(null);
  };

  const reset = () => {
    setGrid(BASE_PUZZLE.map((r) => [...r]));
    setSelected(null);
    setErrors(0);
    setWon(false);
  };

  return (
    <GameWrapper title="Sudoku" onBack={onBack}>
      <View style={s.container}>
        <View style={s.topRow}>
          <Text style={s.info}>
            Errors: <Text style={{ color: "#e74c3c" }}>{errors}</Text>
          </Text>
          {won && <Text style={s.win}>🎉 Solved!</Text>}
        </View>

        <View style={s.board}>
          {grid.map((row, ri) => (
            <View
              key={ri}
              style={[s.row, ri % 3 === 2 && ri < 8 && s.thickBottom]}
            >
              {row.map((cell, ci) => {
                const isPre = BASE_PUZZLE[ri][ci] !== 0;
                const isSel = selected?.[0] === ri && selected?.[1] === ci;
                const isErr = !isPre && cell !== 0 && cell !== SOLUTION[ri][ci];
                return (
                  <TouchableOpacity
                    key={ci}
                    style={[
                      s.cell,
                      ci % 3 === 2 && ci < 8 && s.thickRight,
                      isSel && s.selCell,
                      isErr && s.errCell,
                    ]}
                    onPress={() => select(ri, ci)}
                  >
                    <Text
                      style={[s.cellTxt, isPre && s.preTxt, isErr && s.errTxt]}
                    >
                      {cell !== 0 ? cell : ""}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <View style={s.numpad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <TouchableOpacity key={n} style={s.numBtn} onPress={() => fill(n)}>
              <Text style={s.numTxt}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.btn} onPress={reset}>
          <Text style={s.btnTxt}>Reset</Text>
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
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  info: { color: "#fff", fontSize: 15, fontWeight: "600" },
  win: { color: "#27ae60", fontSize: 18, fontWeight: "800" },
  board: { borderWidth: 2, borderColor: "#607d8b" },
  row: { flexDirection: "row" },
  thickBottom: { borderBottomWidth: 2, borderBottomColor: "#607d8b" },
  cell: {
    width: 36,
    height: 36,
    borderWidth: 0.5,
    borderColor: "#0f3460",
    justifyContent: "center",
    alignItems: "center",
  },
  thickRight: { borderRightWidth: 2, borderRightColor: "#607d8b" },
  selCell: { backgroundColor: "#1a3a5a" },
  errCell: { backgroundColor: "#3a1a1a" },
  cellTxt: { color: "#00bcd4", fontSize: 16, fontWeight: "600" },
  preTxt: { color: "#fff", fontWeight: "800" },
  errTxt: { color: "#e74c3c" },
  numpad: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  numBtn: {
    width: 44,
    height: 44,
    backgroundColor: "#16213e",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#607d8b",
  },
  numTxt: { color: "#fff", fontSize: 18, fontWeight: "700" },
  btn: {
    marginTop: 14,
    backgroundColor: "#607d8b",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnTxt: { color: "#fff", fontWeight: "800", fontSize: 14 },
});
