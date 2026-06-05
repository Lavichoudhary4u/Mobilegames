import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface WelcomeScreenProps {
  onFinish: () => void;
}

const FUNNY_QUOTES = [
  "Get ready to lose track of time! 🎮",
  "Warning: Highly addictive games ahead! ⚠️",
  "Your brain is about to get a workout! 💪",
  "Time to show off those gaming skills! 🏆",
  "15 games, infinite fun. Let's go! 🚀",
  "Challenge yourself. Beat your own records! 🎯",
  "Level up your boredom... right now! ✨",
  "Prepare for epic gaming moments! 🌟",
  "Your next high score starts now! 🎊",
  "Let the games begin! 🔥",
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  const quote = useRef(
    FUNNY_QUOTES[Math.floor(Math.random() * FUNNY_QUOTES.length)],
  ).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(onFinish);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.logo}>🎮</Text>
        <Text style={styles.title}>Game Hub</Text>
        <Text style={styles.quote}>{quote}</Text>
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { alignItems: "center", paddingHorizontal: 32 },
  logo: { fontSize: 80, marginBottom: 12 },
  title: {
    fontSize: 44,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 2,
    marginBottom: 20,
  },
  quote: {
    fontSize: 18,
    color: "#aaa",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 26,
  },
  dotsRow: { flexDirection: "row", gap: 8, marginTop: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#e94560" },
});
