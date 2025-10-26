export interface ExerciseSet {
  reps?: number;
  weight?: number;
  rest_duration?: number; // in seconds
  notes?: string;
}

export interface Exercise {
  name: string;
  sets: ExerciseSet[];
  notes?: string;
}

export interface Workout {
  id: number;
  user_id: number;
  started_at: string;
  ended_at?: string;
  title: string;
  workout_types: string[];
  notes?: string;
  exercises?: Exercise[];
  is_draft?: boolean;
  deleted_at?: string;
}

export interface WorkoutCreate {
  title: string;
  workout_types: string[];
  notes?: string;
  exercises?: Exercise[];
}

export interface WorkoutUpdate {
  title?: string;
  workout_types?: string[];
  notes?: string;
  exercises?: Exercise[];
  ended_at?: string;
}
