import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

type Cell = "X" | "O" | null;

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: Cell[]): Cell {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  }
  return null;
}

export const TicTacToeScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const handlePress = (i: number) => {
    if (board[i] || winner) return;
    const next = board.slice();
    next[i] = isX ? "X" : "O";
    const w = checkWinner(next);
    if (w) setScores((s) => ({ ...s, [w]: s[w as "X" | "O"] + 1 }));
    setBoard(next);
    setIsX(!isX);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsX(true);
  };

  return (
    <GameWrapper title="Tic Tac Toe" onBack={onBack}>
      <View style={s.container}>
        <View style={s.scoreRow}>
          <View style={[s.scoreBox, { borderColor: "#e94560" }]}>
            <Text style={s.scoreLabel}>❌ Player X</Text>
            <Text style={s.scoreNum}>{scores.X}</Text>
          </View>
          <View style={[s.scoreBox, { borderColor: "#3498db" }]}>
            <Text style={s.scoreLabel}>⭕ Player O</Text>
            <Text style={s.scoreNum}>{scores.O}</Text>
          </View>
        </View>

        <Text style={s.status}>
          {winner
            ? `🎉 Player ${winner} wins!`
            : isDraw
              ? "It's a draw!"
              : `Player ${isX ? "X" : "O"}'s turn`}
        </Text>

        <View style={s.board}>
          {board.map((cell, i) => (
            <TouchableOpacity
              key={i}
              style={s.cell}
              onPress={() => handlePress(i)}
            >
              <Text
                style={[
                  s.cellText,
                  { color: cell === "X" ? "#e94560" : "#3498db" },
                ]}
              >
                {cell === "X" ? "❌" : cell === "O" ? "⭕" : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.btn} onPress={reset}>
          <Text style={s.btnText}>New Round</Text>
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
    padding: 20,
  },
  scoreRow: { flexDirection: "row", gap: 16, marginBottom: 24 },
  scoreBox: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    minWidth: 110,
  },
  scoreLabel: { color: "#aaa", fontSize: 13, fontWeight: "600" },
  scoreNum: { color: "#fff", fontSize: 32, fontWeight: "900", marginTop: 4 },
  status: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 24 },
  board: { flexDirection: "row", flexWrap: "wrap", width: 270 },
  cell: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: "#0f3460",
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: { fontSize: 36 },
  btn: {
    marginTop: 28,
    backgroundColor: "#e94560",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
