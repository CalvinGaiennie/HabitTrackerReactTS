import { getFoodEntries } from "../services/foodEntries.ts";
import type { FoodEntry } from "../types/foodEntries.ts";

export default function fetchFoodEntries(
  setLogs: (logs: FoodEntry[]) => void,
  startDate?: string,
  endDate?: string,
  logDate?: string,
  food_id?: number
) {
  const fetchFoodEntries = async () => {
    try {
      // user_id is inferred from auth token on the server; it's not needed here
      const data = await getFoodEntries(startDate, endDate, logDate, food_id);
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch food entries:", err);
    }
  };
  fetchFoodEntries();
}
