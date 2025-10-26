import request from "./api";
import type {
  Workout,
  WorkoutCreate,
  WorkoutUpdate,
} from "../types/workouts.ts";

export async function getWorkouts(): Promise<Workout[]> {
  return request<Workout[]>("/workouts/");
}

export async function getWorkout(workoutId: number): Promise<Workout> {
  return request<Workout>(`/workouts/${workoutId}`);
}

export async function createWorkout(data: WorkoutCreate): Promise<Workout> {
  return request<Workout>("/workouts/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateWorkout(
  workoutId: number,
  data: WorkoutUpdate
): Promise<Workout> {
  return request<Workout>(`/workouts/${workoutId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteWorkout(
  workoutId: number
): Promise<{ message: string }> {
  return request<{ message: string }>(`/workouts/${workoutId}`, {
    method: "DELETE",
  });
}

// Draft functions
export async function getDraft(): Promise<Workout> {
  return request<Workout>("/workouts/draft");
}

export async function saveDraft(data: WorkoutCreate): Promise<Workout> {
  return request<Workout>("/workouts/draft", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
