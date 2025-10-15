// import { useState } from "react"; 
// import type { ExerciseCreate } from "../types/exercises"

function CreateExerciseForm() {
    // const [exercise, setExercise] = useState<ExerciseCreate | null>(null)

    return (
        <div>
            <h1>Create an Exercise</h1>
            <form>
                <div>
                    <label>Name:</label>
                    <input/>
                </div>
                <div>
                    <label>Description:</label>
                    <input/>
                </div>
                <div>
                    <label>Exercise Type</label>
                    <input/>
                </div>
                <div>
                    <label>Exercise Sub Type</label>
                    <input/>
                </div>
                <div>
                    <label>Primary Muscle or Muscle Group</label>
                    <input/>
                </div>
                <div>
                    <label>Secondary Muscle or Muscle Group</label>
                    <input/>
                </div>
                <div>
                    <label>Tags</label>
                    <input/>
                </div>
                <button>Create Exercise</button>
            </form>
        </div>
    )
}
export default CreateExerciseForm