import { useState } from "react";
import { createFood } from "../services/foods.ts";
import type { FoodCreate } from "../types/foods.ts";

function CreateFoodForm() {
  const [formData, setFormData] = useState({
    name: "",
    serving_size_amount: 0,
    serving_size_unit: "",
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = new Set([
      "serving_size_amount",
      "calories",
      "protein_g",
      "carbs_g",
      "fat_g",
    ]);
    const nextValue = numericFields.has(name) ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const foodData: FoodCreate = {
        name: formData.name,
        // Convert to number; backend expects numeric type
        serving_size_amount: Number(formData.serving_size_amount),
        serving_size_unit: formData.serving_size_unit,
        calories: Number(formData.calories),
        protein_g: Number(formData.protein_g),
        carbs_g: Number(formData.carbs_g),
        fat_g: Number(formData.fat_g),
      };

      const newFood = await createFood(foodData);
      console.log("Food created:", newFood);

      setFormData({
        name: "",
        serving_size_unit: "",
        serving_size_amount: 0,
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
      });
    } catch (error) {
      console.error("Error creating food:", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="serving_size_unit">
            Serving Size Unit (Example: Grams)
          </label>
          <input
            id="serving_size_unit"
            name="serving_size_unit"
            className="form-control"
            value={formData.serving_size_unit}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="serving_size_amount">
            Serving Size amount (Example: 200)
          </label>
          <input
            id="serving_size_amount"
            name="serving_size_amount"
            type="number"
            step="any"
            className="form-control"
            value={formData.serving_size_amount}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="calories">Calories</label>
          <input
            id="calories"
            name="calories"
            type="number"
            step="any"
            className="form-control"
            value={formData.calories}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="protein_g">Protein</label>
          <input
            id="protein_g"
            name="protein_g"
            type="number"
            step="any"
            className="form-control"
            value={formData.protein_g}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="carbs_g">Carbs</label>
          <input
            id="carbs_g"
            name="carbs_g"
            type="number"
            step="any"
            className="form-control"
            value={formData.carbs_g}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="fat_g">Fat</label>
          <input
            id="fat_g"
            name="fat_g"
            type="number"
            step="any"
            className="form-control"
            value={formData.fat_g}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Food
        </button>
      </form>
    </div>
  );
}
export default CreateFoodForm;
