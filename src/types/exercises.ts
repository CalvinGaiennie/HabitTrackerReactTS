export interface ExerciseFull {
  id: number;
  name: string;
  description?: string;
  exercise_type?: string;
  exercise_subtype?: string;
  primary_muscles: string[];
  secondary_muscles?: string[];
  tags?: string[];
  equipment?: string;
  equipment_modifiers?: string[];
  injury_pain?: string;
}

export type Exercise = ExerciseFull;

export interface ExerciseCreate {
  user_id: number;
  name: string;
  description?: string;
  exercise_type?: string;
  exercise_subtype?: string;
  primary_muscles: string[];
  secondary_muscles?: string[];
  tags?: string[];
  equipment?: string;
  equipment_modifiers?: string[];
  injury_pain?: string;
}
