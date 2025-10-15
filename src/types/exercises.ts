export interface Exercise {
    id: number;
    name: string;
    description?: string;
    exercise_type?: string;
    exercise_subtype?: string;
    primary_muscles: string;
    secondary_muscles?: string;
    tags: string;
}

export interface ExerciseCreate {
    user_id: number;
    name: string;
    description?: string;
    exercise_type?: string;
    exercise_subtype?: string;
    primary_muscles: string;
    secondary_muscles?: string;
    tags: string;
}