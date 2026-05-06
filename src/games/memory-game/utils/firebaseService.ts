import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from "../../../shared/services/storageService";
import { GameLevel, PlayerProgress } from "../types";

const COLLECTION_NAME = "memoryGameProgress";
const LOCAL_STORAGE_KEY = "memory_game_progress";

export const savePlayerProgress = async (
  userId: string | null,
  playerName: string,
  level: GameLevel,
  score: number,
  completed: boolean,
): Promise<void> => {
  // If no userId (not logged in), save locally
  if (!userId) {
    return saveProgressLocally(playerName, level, score, completed);
  }

  // If userId exists, try to save to Firebase
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentData = docSnap.data() as PlayerProgress;
      const levelScoreKey = `${level}BestScore` as keyof PlayerProgress;
      const levelCompletedKey = `${level}Completed` as keyof PlayerProgress;

      const updates: any = {
        totalGamesPlayed: currentData.totalGamesPlayed + 1,
        lastPlayed: new Date(),
      };

      if (score > (currentData[levelScoreKey] as number)) {
        updates[levelScoreKey] = score;
      }

      if (completed) {
        updates[levelCompletedKey] = true;
      }

      await updateDoc(docRef, updates);
    } else {
      const newProgress: PlayerProgress = {
        userId,
        playerName,
        easyBestScore: level === "easy" ? score : 0,
        mediumBestScore: level === "medium" ? score : 0,
        hardBestScore: level === "hard" ? score : 0,
        easyCompleted: level === "easy" && completed,
        mediumCompleted: level === "medium" && completed,
        hardCompleted: level === "hard" && completed,
        totalGamesPlayed: 1,
        lastPlayed: new Date(),
      };

      await setDoc(docRef, newProgress);
    }
  } catch (error) {
    console.error(
      "Error saving to Firebase, falling back to local storage:",
      error,
    );
    // If Firebase fails, save locally as backup
    return saveProgressLocally(playerName, level, score, completed);
  }
};

const saveProgressLocally = async (
  playerName: string,
  level: GameLevel,
  score: number,
  completed: boolean,
): Promise<void> => {
  try {
    const existingData = await getFromLocalStorage(LOCAL_STORAGE_KEY);

    if (existingData) {
      const levelScoreKey = `${level}BestScore`;
      const levelCompletedKey = `${level}Completed`;

      const updates = {
        ...existingData,
        totalGamesPlayed: existingData.totalGamesPlayed + 1,
        lastPlayed: new Date().toISOString(),
      };

      if (score > existingData[levelScoreKey]) {
        updates[levelScoreKey] = score;
      }

      if (completed) {
        updates[levelCompletedKey] = true;
      }

      await saveToLocalStorage(LOCAL_STORAGE_KEY, updates);
    } else {
      const newProgress = {
        playerName,
        easyBestScore: level === "easy" ? score : 0,
        mediumBestScore: level === "medium" ? score : 0,
        hardBestScore: level === "hard" ? score : 0,
        easyCompleted: level === "easy" && completed,
        mediumCompleted: level === "medium" && completed,
        hardCompleted: level === "hard" && completed,
        totalGamesPlayed: 1,
        lastPlayed: new Date().toISOString(),
      };

      await saveToLocalStorage(LOCAL_STORAGE_KEY, newProgress);
    }
  } catch (error) {
    console.error("Error saving locally:", error);
  }
};

export const getPlayerProgress = async (
  userId: string | null,
): Promise<PlayerProgress | null> => {
  // If no userId, get from local storage
  if (!userId) {
    return getFromLocalStorage(LOCAL_STORAGE_KEY);
  }

  // If userId exists, try to get from Firebase
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as PlayerProgress;
    }
    return null;
  } catch (error) {
    console.error("Error getting from Firebase, trying local storage:", error);
    // If Firebase fails, try local storage
    return getFromLocalStorage(LOCAL_STORAGE_KEY);
  }
};
