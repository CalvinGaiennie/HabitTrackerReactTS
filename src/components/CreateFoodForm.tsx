import { useState } from "react";
import { createFood } from "../services/foods.ts"
import type { FoodCreate } from "../types/foods.ts"

function CreateFoodForm() {
    const [formData, setFormData] = useState({
        name: "",
        serving_size_ammount: "",
        serving_size_unit: "",
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
    })

    const handleChange = (
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const foodData: FoodCreate = {
                name: formData.name,
                serving_size_ammount: formData.serving_size_ammount,
                serving_size_unit: formData.serving_size_unit,
                calories: formData.calories,
                protein_g: formData.protein_g,
                carbs_g: formData.carbs_g,
                fat_g: formData.fat_g,
            };

            const newFood = await createFood(foodData);
            console.log("Food created:", newFood)

            setFormData({
                name: "",
                serving_size_unit: "",
                serving_size_ammount: "",
                calories: 0,
                protein_g: 0,
                carbs_g: 0,
                fat_g: 0,
            })
        } catch (error) {
            console.error("Error creatign exercise:", error)
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name">
                        Name
                    </label>
                    <input 
                    id="name"
                    className="form-control" value={formData.name}
                    onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="serving_size_unit">
                        Serving Size Unit (Example: Grams)
                    </label>
                    <input 
                    id="serving_size_unit"
                    className="form-control" value={formData.serving_size_unit}
                    onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="serving_size_ammount">
                        Serving Size Ammount (Example: 200)
                    </label>
                    <input 
                    id="serving_size_ammount"
                    className="form-control" value={formData.serving_size_ammount}
                    onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="calories">
                        Calories
                    </label>
                    <input 
                    id="calories"
                    className="form-control" value={formData.calories}
                    onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="protein">
                        Protein
                    </label>
                    <input 
                    id="protein"
                    className="form-control" value={formData.protein_g}
                    onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="carbs">
                        Carbs
                    </label>
                    <input 
                    id="carbs"
                    className="form-control" value={formData.carbs_g}
                    onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="fat">
                        Fat
                    </label>
                    <input 
                    id="fat"
                    className="form-control" value={formData.fat_g}
                    onChange={handleChange}/>
                </div>
                <button type="submit" className="btn btn-primary">Create Food</button>
            </form>
        </div>
    )
}
export default CreateFoodForm