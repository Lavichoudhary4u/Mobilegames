import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface GameWrapperProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

export const GameWrapper: React.FC<GameWrapperProps> = ({
  title,
  onBack,
  children,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#16213e",
    borderBottomWidth: 1,
    borderBottomColor: "#0f3460",
  },
  backBtn: {
    backgroundColor: "#0f3460",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  backText: { color: "#e94560", fontWeight: "700", fontSize: 14 },
  title: { color: "#fff", fontSize: 18, fontWeight: "800" },
  placeholder: { width: 70 },
  content: { flex: 1 },
});
