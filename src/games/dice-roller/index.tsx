import React, { useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export const DiceRollerScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [values, setValues] = useState([1, 1]);
  const [diceCount, setCount] = useState(2);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [stats, setStats] = useState<Record<number, number>>({});
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const rolled = Array.from(
        { length: diceCount },
        () => Math.floor(Math.random() * 6) + 1,
      );
      setValues(rolled);
      const sum = rolled.reduce((a, b) => a + b, 0);
      setHistory((h) => [sum, ...h].slice(0, 10));
      setStats((s) => ({ ...s, [sum]: (s[sum] || 0) + 1 }));
      setRolling(false);
    });
  };

  const shake = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-10deg", "0deg", "10deg"],
  });
  const sum = values.reduce((a, b) => a + b, 0);

  return (
    <GameWrapper title="Dice Roller" onBack={onBack}>
      <View style={s.container}>
        <View style={s.countRow}>
          <Text style={s.countLabel}>Dice count:</Text>
          {[1, 2, 3, 4].map((n) => (
            <TouchableOpacity
              key={n}
              style={[s.countBtn, diceCount === n && s.countActive]}
              onPress={() => setCount(n)}
            >
              <Text style={[s.countTxt, diceCount === n && s.countTxtActive]}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Animated.View style={[s.diceArea, { transform: [{ rotate: shake }] }]}>
          {values.slice(0, diceCount).map((v, i) => (
            <View key={i} style={s.die}>
              <Text style={s.dieFace}>{DICE_FACES[v - 1]}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={s.sumBox}>
          <Text style={s.sumLabel}>Total</Text>
          <Text style={s.sumVal}>{sum}</Text>
        </View>

        <TouchableOpacity style={s.rollBtn} onPress={roll} disabled={rolling}>
          <Text style={s.rollTxt}>
            {rolling ? "🎲 Rolling..." : "🎲 Roll!"}
          </Text>
        </TouchableOpacity>

        {history.length > 1 && (
          <View style={s.histBox}>
            <Text style={s.histTitle}>Last rolls</Text>
            <View style={s.histRow}>
              {history.slice(0, 8).map((v, i) => (
                <View key={i} style={[s.histChip, i === 0 && s.histLatest]}>
                  <Text style={s.histVal}>{v}</Text>
                </View>
              ))}
            </View>
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
    padding: 24,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  countLabel: { color: "#888", fontSize: 14, fontWeight: "600" },
  countBtn: {
    width: 38,
    height: 38,
    backgroundColor: "#16213e",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  countActive: { backgroundColor: "#e67e22", borderColor: "#e67e22" },
  countTxt: { color: "#888", fontWeight: "700", fontSize: 16 },
  countTxtActive: { color: "#fff" },
  diceArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginBottom: 16,
  },
  die: {
    width: 90,
    height: 90,
    backgroundColor: "#16213e",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e67e22",
  },
  dieFace: { fontSize: 56 },
  sumBox: {
    backgroundColor: "#16213e",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
    minWidth: 120,
    borderWidth: 2,
    borderColor: "#e67e22",
  },
  sumLabel: { color: "#888", fontSize: 13, fontWeight: "600" },
  sumVal: { color: "#fff", fontSize: 40, fontWeight: "900", marginTop: 2 },
  rollBtn: {
    backgroundColor: "#e67e22",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  rollTxt: { color: "#fff", fontWeight: "900", fontSize: 18 },
  histBox: { alignItems: "center" },
  histTitle: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  histRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  histChip: {
    backgroundColor: "#16213e",
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  histLatest: { borderColor: "#e67e22" },
  histVal: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
