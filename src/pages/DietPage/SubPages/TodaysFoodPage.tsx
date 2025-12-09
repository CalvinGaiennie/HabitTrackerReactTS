import {useState, useEffect, useRef } from "react";
import fetchFoodEntries from "../../../hooks/fetchFoodEntries";
import type { FoodEntryCreate, FoodEntry } from "../../../types/foodEntries";
import { createFoodEntry } from "../../../services/foodEntries";
import fetchFoods from "../../../hooks/fetchFoods";
import type { Food } from "../../../types/foods";
import BootstrapModal from "../../../components/BootstrapModal";
import AddFoodEntryForm from "../components/AddFoodEntry";

function TodaysFoodPage() {
    const [foodEntries, setFoodEntries] = useState<FoodEntry[] | null>(null)
    const [formData, setFormData] = useState<FoodEntryCreate>({
        food_id: 0,
        food_name: "",
        log_date: new Date().toISOString().split("T")[0],
        quantity: 0,
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
    })
    const [foods, setFoods] = useState<Food[] | null>(null)
    const [showModal, setShowModal] = useState(false)
    
    // const [editingFoodEntry, setEditingFoodEntry] = useState<FoodEntry | null>(null);
      const isSubmitting = useRef(false);
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // SPECIAL CASE: when the <select> for food changes
        if (name === "food_id") {
          const selectedFood = foods?.find(f => f.id === Number(value));
          setFormData(prev => ({
            ...prev,
            food_id: Number(value),
            food_name: selectedFood?.name || "",   // ← NEW: store the name
          }));
          return;
        }

        setFormData((prev) => ({
          ...prev,
          [name]: name === "food_id" || name === "quantity" || name.includes("_g") || name === "calories"
            ? Number(value)
            : value,
        }));
      };
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting.current) return;
      isSubmitting.current = true;

      try {
        await createFoodEntry(formData);
        
        const today = new Date().toISOString().split("T")[0];
        await fetchFoodEntries(setFoodEntries, today);

        setShowModal(false)
        // Reset form
        setFormData({
          food_id: 0,
          food_name: "",
          log_date: new Date().toISOString().split("T")[0],
          quantity: 0,
          calories: 0,
          protein_g: 0,
          carbs_g: 0,
          fat_g: 0,
        });
      } catch (err) {
        console.error("Submit error:", err);
        alert("Failed to save food entry");
      } finally {
        isSubmitting.current = false;
      }
    };

    useEffect(() => {
        fetchFoods(setFoods)
    }, [])

    useEffect(() => {
        fetchFoodEntries(setFoodEntries)
    }, [])

    return (
        <div>
             <div className="d-flex gap-3 mb-3 justify-content-between align-items-center">
              <h3 className="mb-0">Todays Food</h3>
              <button 
                  className="btn btn-primary px-4" 
                  onClick={() => setShowModal(true)}
              >
                  Add Meal
              </button>
            </div>
            <BootstrapModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title={"Add Meal"}
              >
                <AddFoodEntryForm
                  foods={foods}
                  formData={formData}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  onCancel={() => setShowModal(false)}
                />
              </BootstrapModal>
            {foodEntries?.map((entry, index) => (
                <div key={index} className="br-white rounded-lg shadow p-5 border border-gray-200 hover:shadow-md transition">
                    <div className="d-flex flex-row gap-2"> 
                        <p>{entry.log_date}</p>
                        <p>{entry.food_name}</p>
                        <p>Quantity: {entry.quantity}</p>
                    </div>
                    <div className="d-flex flex-row gap-2"> 
                        <p>Protein: {entry.protein_g}</p>
                        <p>Fat: {entry.fat_g}</p>
                        <p>Carbs: {entry.carbs_g}</p>
                    </div>
                    <br></br>
                </div>
            ))}
        </div>
    )
}
export default TodaysFoodPage