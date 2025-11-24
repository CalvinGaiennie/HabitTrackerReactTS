import { getFoods } from "../services/foods.ts";
import type { Food } from "../types/foods.ts";

export default function fetchFoods(
  setLogs: (logs: Food[]) => void
) {
  const fetchFoods = async () => {
    try {
      const data = await getFoods();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch daily logs:", err);
    }
  };
  fetchFoods();
}
