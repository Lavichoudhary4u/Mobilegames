import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface WelcomeScreenProps {
  onFinish: () => void;
}

const FUNNY_QUOTES = [
  "Get ready to lose track of time! 🎮",
  "Warning: Highly addictive games ahead! ⚠️",
  "Your brain is about to get a workout! 💪",
  "Time to show off your gaming skills! 🏆",
  "Let's turn boredom into fun! 🎉",
  "Ready to challenge yourself? 🚀",
  "Games loading... Awesomeness incoming! ✨",
  "Prepare for epic gaming moments! 🎯",
  "Your next adventure starts now! 🌟",
  "Let the games begin! 🎊",
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  const [quote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * FUNNY_QUOTES.length);
    return FUNNY_QUOTES[randomIndex];
  });

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>🎮 Game Hub</Text>
        <Text style={styles.quote}>{quote}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3e50",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  quote: {
    fontSize: 20,
    color: "#ecf0f1",
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: 20,
  },
});
