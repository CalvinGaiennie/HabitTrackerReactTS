import { getWorkouts } from "../services/workouts";
import type { Workout } from "../types/workouts";

function fetchWorkouts(setWorkouts: (workouts: Workout[]) => void) {
    const fetchWorkouts = async () => {
        try {
            const data = await getWorkouts();
            setWorkouts(data);
        } catch (error) {
            console.error("Error fetching workouts:", error);
        }
    }
    fetchWorkouts();
}
export default fetchWorkouts