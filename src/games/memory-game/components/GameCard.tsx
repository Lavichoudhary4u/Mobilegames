import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Card } from "../types";

interface GameCardProps {
  card: Card;
  onPress: (id: number) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ card, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        (card.isFlipped || card.isMatched) && styles.cardFlipped,
        card.isMatched && styles.cardMatched,
      ]}
      onPress={() => onPress(card.id)}
      disabled={card.isFlipped || card.isMatched}
    >
      <Text style={styles.cardText}>
        {card.isFlipped || card.isMatched ? card.value : "?"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 70,
    height: 70,
    margin: 5,
    backgroundColor: "#3498db",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardFlipped: {
    backgroundColor: "#fff",
  },
  cardMatched: {
    backgroundColor: "#2ecc71",
  },
  cardText: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
