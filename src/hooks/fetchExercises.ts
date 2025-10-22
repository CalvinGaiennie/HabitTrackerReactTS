import { getExercises } from "../services/exercises";
import type { ExerciseFull } from "../types/exercises";

function fetchExercises(setExercises: (exercises: ExerciseFull[]) => void) {
    const fetchExercises = async () => {
        try {
            const exercises = await getExercises();
            setExercises(exercises)
        } catch (err) {
            console.error("Failed to fetch exercises", err)
        }
    }
    fetchExercises();
}
export default fetchExercises