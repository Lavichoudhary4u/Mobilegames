import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { GameWrapper } from "../../shared/components/GameWrapper";

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog",
  "React Native is a great framework for mobile apps",
  "Practice makes perfect in typing speed tests",
  "JavaScript is the language of the web browser",
  "Consistency is the key to mastering any skill",
  "The best way to learn is by building real projects",
  "Mobile apps are changing the way people interact",
  "Every journey begins with a single step forward",
  "Programming is thinking not just typing code",
  "Clean code is simple direct and easy to read",
];

export const TypingSpeedScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [sentence, setSentence] = useState(
    () => SENTENCES[Math.floor(Math.random() * SENTENCES.length)],
  );
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [time, setTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [best, setBest] = useState(0);
  const [accuracy, setAcc] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (started && !done) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, done]);

  const handleChange = (val: string) => {
    if (!started) setStarted(true);
    setInput(val);
    // live accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === sentence[i]) correct++;
    }
    setAcc(val.length > 0 ? Math.round((correct / val.length) * 100) : 100);

    if (val === sentence) {
      if (timerRef.current) clearInterval(timerRef.current);
      const mins = (time + 1) / 60;
      const words = sentence.split(" ").length;
      const calcWpm = Math.round(words / mins);
      setWpm(calcWpm);
      if (calcWpm > best) setBest(calcWpm);
      setDone(true);
    }
  };

  const restart = () => {
    setSentence(SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
    setInput("");
    setStarted(false);
    setDone(false);
    setTime(0);
    setWpm(0);
    setAcc(100);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <GameWrapper title="Typing Speed" onBack={onBack}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={s.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Stats */}
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.sl}>Time</Text>
              <Text style={s.sn}>{time}s</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.sl}>WPM</Text>
              <Text style={[s.sn, { color: "#00bcd4" }]}>
                {done ? wpm : "—"}
              </Text>
            </View>
            <View style={s.stat}>
              <Text style={s.sl}>Best</Text>
              <Text style={[s.sn, { color: "#f39c12" }]}>{best || "—"}</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.sl}>Acc</Text>
              <Text
                style={[s.sn, { color: accuracy < 80 ? "#e74c3c" : "#27ae60" }]}
              >
                {accuracy}%
              </Text>
            </View>
          </View>

          {/* Text to type */}
          <View style={s.textBox}>
            {sentence.split("").map((char, i) => {
              let color = "#555";
              if (i < input.length)
                color = input[i] === char ? "#00bcd4" : "#e74c3c";
              else if (i === input.length) color = "#fff";
              return (
                <Text
                  key={i}
                  style={[s.char, { color }, i === input.length && s.cursor]}
                >
                  {char}
                </Text>
              );
            })}
          </View>

          {/* Progress bar */}
          <View style={s.progressBg}>
            <View
              style={[
                s.progressFill,
                {
                  width:
                    `${Math.min((input.length / sentence.length) * 100, 100)}%` as any,
                },
              ]}
            />
          </View>

          {!done ? (
            <TextInput
              ref={inputRef}
              style={[
                s.input,
                input.length > 0 &&
                  input !== sentence.slice(0, input.length) &&
                  s.inputWrong,
              ]}
              value={input}
              onChangeText={handleChange}
              placeholder="Start typing here..."
              placeholderTextColor="#555"
              autoCorrect={false}
              autoCapitalize="none"
              spellCheck={false}
            />
          ) : (
            <View style={s.result}>
              <Text style={s.wpmBig}>{wpm}</Text>
              <Text style={s.wpmLabel}>WPM</Text>
              <Text style={s.rating}>
                {wpm > 80
                  ? "🔥 Blazing Fast!"
                  : wpm > 60
                    ? "⚡ Fast!"
                    : wpm > 40
                      ? "👍 Good"
                      : "🐢 Keep practicing"}
              </Text>
              <TouchableOpacity style={s.btn} onPress={restart}>
                <Text style={s.btnTxt}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </GameWrapper>
  );
};

const s = StyleSheet.create({
  container: { padding: 16, alignItems: "center", paddingBottom: 40 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 16, width: "100%" },
  stat: {
    flex: 1,
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  sl: { color: "#888", fontSize: 11, fontWeight: "600" },
  sn: { color: "#fff", fontSize: 18, fontWeight: "900", marginTop: 2 },
  textBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#16213e",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#0f3460",
    width: "100%",
  },
  char: { fontSize: 17, fontWeight: "600", lineHeight: 28 },
  cursor: { borderBottomWidth: 2, borderBottomColor: "#00bcd4" },
  progressBg: {
    width: "100%",
    height: 4,
    backgroundColor: "#16213e",
    borderRadius: 2,
    marginBottom: 14,
    overflow: "hidden",
  },
  progressFill: { height: 4, backgroundColor: "#00bcd4", borderRadius: 2 },
  input: {
    backgroundColor: "#16213e",
    color: "#fff",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    borderWidth: 2,
    borderColor: "#00bcd4",
    width: "100%",
    autoCorrect: false,
  } as any,
  inputWrong: { borderColor: "#e74c3c" },
  result: { alignItems: "center", gap: 8, marginTop: 10 },
  wpmBig: { color: "#00bcd4", fontSize: 72, fontWeight: "900", lineHeight: 80 },
  wpmLabel: { color: "#888", fontSize: 18, fontWeight: "600", marginTop: -4 },
  rating: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  btn: {
    backgroundColor: "#00bcd4",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
