import { useEffect, useState } from "react";
import { getExercises } from "../services/exercises"
import type { Exercise } from "../types/exercises"

function ExerciseList() {
    const [exercises, setExercises] = useState<Exercise[]>([])

    useEffect(() => {
       const fetchExercises = async () => {
           try {
            const newExercises = await getExercises();
            setExercises(newExercises)
            } catch {
                console.error("Error fetching exercises")
            }
       } 
       fetchExercises();
    }, [])

    return (
        <div>
            <h1>Exercise List</h1>
            {exercises.map((exercise) => (
            <p>{exercise.name}</p>
            )
        )}
        </div>
    )
}
export default ExerciseList