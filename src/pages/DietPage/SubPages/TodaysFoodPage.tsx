import {useState, useEffect, useRef } from "react";
// import fetchFoodEntries from "../../../hooks/fetchFoodEntries";
import type { FoodEntryCreate } from "../../../types/foodEntries";
import fetchFoods from "../../../hooks/fetchFoods";
import type { Food } from "../../../types/foods";
type Entry = {
    food: string;
    time: string;
    ammount: string;
    protein: string;
    fat: string;
    carbs: string
}

const todaysEntries: Entry[] = [
        {
            food: "Grilled Chicken Breast",
            time: "12:30",
            ammount: "200g",
            protein: "62g",
            fat: "7g",
            carbs: "0g"
        },
        {
            food: "Brown Rice",
            time: "12:30",
            ammount: "1 cup",
            protein: "5g",
            fat: "2g",
            carbs: "45g"
        },
        {
            food: "Broccoli",
            time: "12:30",
            ammount: "150g",
            protein: "4g",
            fat: "0.5g",
            carbs: "10g"
        },
        {
            food: "Oatmeal with Banana",
            time: "08:00",
            ammount: "60g oats + 1 banana",
            protein: "12g",
            fat: "5g",
            carbs: "78g"
        },
        {
            food: "Greek Yogurt",
            time: "16:00",
            ammount: "200g",
            protein: "20g",
            fat: "8g",
            carbs: "9g"
        },
        {
            food: "Salmon",
            time: "19:30",
            ammount: "180g",
            protein: "40g",
            fat: "24g",
            carbs: "0g"
        },
        {
            food: "Protein Bar",
            time: "22:00",
            ammount: "1 bar",
            protein: "20g",
            fat: "9g",
            carbs: "22g"
        }
    ];

function TodaysFoodPage() {
    // const [foodEntries, setFoodEntries] = useState<FoodEntry[] | null>(null)
    const [formData, setFormData] = useState<FoodEntryCreate>({
        food_id: 0,
        log_date: new Date().toISOString().split("T")[0],
        quantity: 0,
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
    })
    const [foods, setFoods] = useState<Food[] | null>(null)
    
    // const [editingFoodEntry, setEditingFoodEntry] = useState<FoodEntry | null>(null);
      const isSubmitting = useRef(false);
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: name === "food_id" || name === "quantity" || name.includes("_g") || name === "calories"
            ? Number(value)
            : value,
        }));
      };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting food entry...");
    
        try {
          // if (editingFoodEntry) {
          //   await updateEntry(editingFoodEntry.id, formData);
          //   alert("Metric updated successfully!");
          //   setEditingFoodEntry(null);
          // } else {
          //   await createFoodEntry(formData);
          //   alert("Metric created successfully!");
          // }
          // fetchFoodEntries(setFoodEntries);
          setFormData({
            food_id: 0,
            log_date: "",
            quantity: 0,
            calories: 0,
            protein_g: 0,
            carbs_g: 0,
            fat_g: 0,
          });
        } catch (err) {
          console.error(err);
          alert("Something went wrong with the metric operation.");
        } finally {
          isSubmitting.current = false;
        }
      };

       useEffect(() => {
            fetchFoods(setFoods)
        }, [])

        useEffect(() => {
            // fetchFoodEntries(setFoodEntries)
        }, [])

    return (
        <div>
            {todaysEntries.map((entry) => (
                <div className="br-white rounded-lg shadow p-5 border border-gray-200 hover:shadow-md transition">
                    <div className="d-flex flex-row gap-2"> 
                        <p>{entry.time}</p>
                        <p>{entry.food}</p>
                        <p>{entry.ammount}</p>
                    </div>
                    <div className="d-flex flex-row gap-2"> 
                        <p>Protein: {entry.protein}</p>
                        <p>Fat: {entry.fat}</p>
                        <p>Carbs: {entry.carbs}</p>
                    </div>
                    <br></br>
                </div>
            ))}
            <h3 className="mt-4">Add Food Entry</h3>
            <form
                onSubmit={handleSubmit}
                className="w-100"
                style={{ maxWidth: "500px" }}
            >
                <div className="mb-3">
                    <label className="form-label">Food:</label>
                    <select
                    name="food_id"
                    className="form-control"
                    value={formData.food_id}
                    onChange={handleChange}
                    >
                      <option value={0}> -- Select a food -- </option>
                      {foods?.map((food) => (
                        <option key={food.id} value={food.id}>
                          {food.name}
                        </option>
                      )) ?? <option>Loading foods...</option>}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity:</label>
                    <input
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                <button
                  type="submit"
                  className="btn btn-secondary ms-2"
                  disabled={isSubmitting.current}
                >
                  Create Entry
                </button>
            </form>
        </div>
    )
}
export default TodaysFoodPage