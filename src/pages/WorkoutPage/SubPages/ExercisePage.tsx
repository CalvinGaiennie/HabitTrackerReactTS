import { useState } from "react";
import ExerciseList from "../../../components/ExerciseList";
import CreateExerciseForm from "../../../components/CreateExerciseForm";

function ExercisePage() {
    const [mode, setMode] = useState<"add" | "view">('add')

    const toggleMode = (() => {
        if (mode == "add" ) {
            setMode("view")
        } else {
            setMode("add")
        }
    })

    return (
        <div>
            <button onClick={toggleMode}>Toggle Mode</button>
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