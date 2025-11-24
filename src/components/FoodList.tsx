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
                <p>{JSON.stringify(food)}</p>
            ))}
        </div>
    )
}
export default FoodList