import request from "./api";
import type { Workout, WorkoutCreate } from "../types/workouts.ts";

export async function getWorkouts(): Promise<Workout[]> {
  return request<Workout[]>("/workouts/");
}

export async function createWorkout(data: WorkoutCreate): Promise<Workout> {
  return request<Workout>("/workouts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateWorkout(
  workoutId: number,
  data: Partial<WorkoutCreate>
): Promise<Workout> {
  return request<Workout>(`/workouts/${workoutId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
