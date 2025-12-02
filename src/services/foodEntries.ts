import request from "./api";
import type { FoodEntry, FoodEntryCreate } from "../types/foodEntries.ts";

export async function getFoodEntries(
  start_date?: string,
  end_date?: string,
  log_date?: string,
  food_id?: number
): Promise<FoodEntry[]> {
  let url = "/food_entries";
  const params = new URLSearchParams();
  if (start_date) params.append("start_date", start_date);
  if (end_date) params.append("end_date", end_date);
  if (log_date) params.append("log_date", log_date);
  if (typeof food_id === "number") params.append("food_id", String(food_id));
  if (params.toString()) url += `?${params.toString()}`;
  return request<FoodEntry[]>(url);
}

export async function createFoodEntry(
  data: FoodEntryCreate
): Promise<FoodEntry> {
  return request<FoodEntry>("/food_entries/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
