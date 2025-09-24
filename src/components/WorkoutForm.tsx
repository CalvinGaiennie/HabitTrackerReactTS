import { useState, useEffect } from "react";
// import { useDebounce } from "../hooks/useDebounce";
import type { Workout } from "../types/workouts.ts"

function WorkoutForm() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    // const [sets, setSets] = useState<Sets[]>([]);

    const now = new Date();
    const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0"),].join("-")


    return <div className="container d-flex flex-column align-items-center">
        <div className="d-flex flex-row">
            <div>
                <h2>Title</h2>
                <input/>
            </div>
            <div>
                <h2>Workout Type</h2>
                <select>
                    <option>a</option>
                    <option>b</option>
                </select>
            </div>
        </div>
        <div>sets and shit</div>
        <div>sets and shit</div>
        <div>sets and shit</div>
        <div>sets and shit</div>
        <div>sets and shit</div>
        <div><h2>Notes</h2><input/></div>
    </div>
}

export default WorkoutForm;