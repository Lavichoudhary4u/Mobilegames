import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@game_progress";

export const saveToLocalStorage = async (
  key: string,
  data: any,
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(`${STORAGE_KEY}_${key}`, jsonValue);
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

export const getFromLocalStorage = async (key: string): Promise<any | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${STORAGE_KEY}_${key}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error reading from local storage:", error);
    return null;
  }
};

export const clearLocalStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${STORAGE_KEY}_${key}`);
  } catch (error) {
    console.error("Error clearing local storage:", error);
  }
};
