import { useState } from "react";
import ExerciseList from "../../../components/ExerciseList";
import CreateExerciseForm from "../../../components/CreateExerciseForm";

function ExercisePage() {
    const [mode, setMode] = useState<"add" | "view">('add')

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMode(e.target.value as "add" | "view");
    };

    return (
        <div>
            <div className="d-flex justify-content-end">
                <select onChange={handleModeChange} value={mode}>
                    <option value="view">View</option>
                    <option value="add">Add</option>
                </select>
            </div>
            {mode === "add" && (
                <CreateExerciseForm/>
            )}

            {mode === "view" && (
            <ExerciseList />
            )}
        </div>
    )
}
export default ExercisePage