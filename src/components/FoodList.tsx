import { useState, useEffect } from "react"
import fetchFoods from "../hooks/fetchFoods"
import type { Food } from "../types/foods"
function FoodList() {
    const [foods, setFoods] = useState<Food[] | null>(null)

    useEffect(() => {
        fetchFoods(setFoods)
    }, [])

    return (
        <div>
            food list
            {foods?.map((food) => (
                <div>
                    <h3>{food.name}</h3>
                    <p>Calories: {food.calories}</p>
                    <p>Protein: {food.protein_g}</p>
                    <p>Carbs: {food.carbs_g}</p>
                    <p>Fat: {food.fat_g}</p>
                    <p>{JSON.stringify(food)}</p>
                </div>
            ))}
        </div>
    )
}

export default FoodList