import request from "./api";
import type { Workout, WorkoutCreate} from "../types/workouts.ts"

export async function getWorkouts(): Promise<Workout[]> {
    return request<Workout[]>("/workouts/");
}

export async function createWorkout(data: WorkoutCreate): Promise<Workout> {
    return request<Workout("/workouts", {
        method: "Post",
        body: JSON.stringify(data),
    })
}

export async function updateWorkout(workoutId: number): Promise<Workout> {
    return request<Workout>(`/workouts`, {
        method: "PATCH",
    })
}
