export interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: "puzzle" | "arcade" | "card" | "word" | "number";
}
