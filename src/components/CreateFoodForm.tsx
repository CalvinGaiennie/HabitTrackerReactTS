import { useState } from "react";
import { createFood } from "../services/foods.ts";
import type { FoodCreate } from "../types/foods.ts";

interface CreateFoodFormProps {
  onSubmit?: () => void;   // Callback to invoke after successful create (e.g., close modal)
}

function CreateFoodForm({onSubmit}: CreateFoodFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    serving_size_amount: 100,
    serving_size_unit: "g",
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
  });

  const allowedUnits = ["g", "ml", "piece", "cup", "tbsp", "tsp"] as const;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // simple client-side validation to avoid server 500s
      if (!allowedUnits.some((u) => u === formData.serving_size_unit)) {
        throw new Error(
          "Serving size unit must be one of: g, ml, piece, cup, tbsp, tsp"
        );
      }
      if (
        Number(formData.serving_size_amount) <= 0 ||
        Number(formData.calories) < 0 ||
        Number(formData.protein_g) < 0 ||
        Number(formData.carbs_g) < 0 ||
        Number(formData.fat_g) < 0
      ) {
        throw new Error(
          "Amounts must be non-negative, and serving size amount must be > 0"
        );
      }

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

      onSubmit?.();
      
      setFormData({
        name: "",
        serving_size_unit: "g",
        serving_size_amount: 100,
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
          <label htmlFor="serving_size_unit">Serving Size Unit</label>
          <select
            id="serving_size_unit"
            name="serving_size_unit"
            className="form-control"
            value={formData.serving_size_unit}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                serving_size_unit: e.target.value,
              }))
            }
          >
            {allowedUnits.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
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
            min={0.0000001}
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
            min={0}
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
            min={0}
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
            min={0}
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
            min={0}
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
