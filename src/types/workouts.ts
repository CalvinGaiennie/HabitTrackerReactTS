export interface Workout {
    id: number;
    user_id: number;
    started_at: string;
    ended_at: string;
    title: string;
    workout_type: string;
    notes: string;

}

export interface WorkoutCreate {
    user_id: number;
    title: string;
    workout_type: string;
    notes: string;
}