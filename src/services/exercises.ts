import request from "./api";
import type {
    Exercise,
    ExerciseCreate,
} from "../types/exercises.ts"

export async function getExercises(): Promise<Exercise[]> {
    return request <Exercise[]>("/exercises/")
}

export async function createExercise(data: ExerciseCreate): Promise<Exercise> {
    return request<Exercise>("/exercises/", {
        method: "POST",
        body: JSON.stringify(data),
    });
}
