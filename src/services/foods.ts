import request from "./api";
import type { Food, FoodCreate } from "../types/foods.ts"
export async function getFoods(): Promise<Food[]> {
    return request <Food[]>("/foods/")
}

export async function createFood(data: FoodCreate): Promise<Food> {
    return request<Exercise>("/foods/", {
        method: "POST",
        body: JSON.stringify(data),
    })
}