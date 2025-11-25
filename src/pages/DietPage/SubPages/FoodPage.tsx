import { useState } from "react";
import FoodList from "../../../components/FoodList";
import CreateFoodForm from "../../../components/CreateFoodForm";

function FoodPage() {
    const [mode, setMode] = useState<"add" | "view">('view')

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMode(e.target.value as "add" | "view");
    };

    return (
        <div>
            <select onChange={handleModeChange} value={mode}>
                <option value="view">View</option>
                <option value="add">Add</option>
            </select>
            {mode === "add" && (
                <CreateFoodForm/>
            )}

            {mode === "view" && (
            <FoodList />
            )}
        </div>
    )
}
export default FoodPage