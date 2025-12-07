export interface FoodEntry {
  id: number;
  food_id: number;
  food_name: string;
  log_date: string;
  quantity: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface FoodEntryCreate {
  food_id: number;
  food_name: string;
  log_date: string;
  quantity: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}