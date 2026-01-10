import type { Workout } from "../types/workouts";

interface PRInfo {
  weight: number;
  previousPRWeight: number | null; // Previous PR weight before this one was set (null if this is the first PR ever)
  firstAchievedDate: string; // workout.started_at when PR was first achieved
  firstAchievedWorkoutId: number; // workout.id when PR was first achieved
  firstAchievedExerciseIndex: number; // exercise index when PR was first achieved
  firstAchievedSetIndex: number; // set index when PR was first achieved
}

/**
 * Calculates Personal Records (PRs) from workout history.
 * Returns a Map structure: exerciseName -> repCount -> PRInfo (weight and first achieved date)
 * 
 * @param workouts - Array of all workouts to analyze (should be sorted by date, oldest first)
 * @returns Map<exerciseName, Map<repCount, PRInfo>>
 */
export function calculatePRs(workouts: Workout[]): Map<string, Map<number, PRInfo>> {
  const prMap = new Map<string, Map<number, PRInfo>>();

  // Sort workouts by date (oldest first) to track when PRs were first achieved
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
  );

  // Iterate through all workouts
  for (const workout of sortedWorkouts) {
    if (!workout.exercises) continue;

    // Iterate through all exercises in the workout
    workout.exercises.forEach((exercise, exerciseIndex) => {
      if (!exercise.sets || exercise.sets.length === 0) return;

      // Initialize exercise map if it doesn't exist
      if (!prMap.has(exercise.name)) {
        prMap.set(exercise.name, new Map<number, PRInfo>());
      }

      const exercisePRs = prMap.get(exercise.name)!;

      // Iterate through all sets in the exercise
      exercise.sets.forEach((set, setIndex) => {
        // Skip sets without reps or weight (bodyweight exercises, timed sets, etc.)
        if (set.reps === undefined || set.reps === null || set.weight === undefined || set.weight === null) {
          return;
        }

        const currentPR = exercisePRs.get(set.reps);
        
        // Update PR if this weight is greater than current max for this rep count
        if (currentPR === undefined || set.weight > currentPR.weight) {
          // Store previous PR weight before updating
          const previousWeight = currentPR?.weight ?? null;
          
          exercisePRs.set(set.reps, {
            weight: set.weight,
            previousPRWeight: previousWeight,
            firstAchievedDate: workout.started_at,
            firstAchievedWorkoutId: workout.id,
            firstAchievedExerciseIndex: exerciseIndex,
            firstAchievedSetIndex: setIndex
          });
        }
      });
    });
  }

  return prMap;
}

/**
 * Checks if a set is a Personal Record
 * 
 * @param exerciseName - Name of the exercise
 * @param reps - Number of reps
 * @param weight - Weight used
 * @param prMap - PR map from calculatePRs
 * @returns true if this set matches the PR for this exercise and rep count
 */
export function isPR(
  exerciseName: string,
  reps: number | undefined,
  weight: number | undefined,
  prMap: Map<string, Map<number, PRInfo>>
): boolean {
  // Must have both reps and weight to be a PR
  if (reps === undefined || reps === null || weight === undefined || weight === null) {
    return false;
  }

  const exercisePRs = prMap.get(exerciseName);
  if (!exercisePRs) {
    return false;
  }

  const prInfo = exercisePRs.get(reps);
  return prInfo !== undefined && weight === prInfo.weight;
}

/**
 * Checks if a set is a new PR (first time achieving this weight for this rep count)
 * 
 * @param exerciseName - Name of the exercise
 * @param reps - Number of reps
 * @param weight - Weight used
 * @param workoutId - ID of the current workout
 * @param exerciseIndex - Index of the exercise in the workout
 * @param setIndex - Index of the set in the exercise
 * @param prMap - PR map from calculatePRs
 * @returns true if this set is a PR AND it's the first time achieving it (matches the exact set that first achieved it)
 */
export function isNewPR(
  exerciseName: string,
  reps: number | undefined,
  weight: number | undefined,
  workoutId: number,
  exerciseIndex: number,
  setIndex: number,
  prMap: Map<string, Map<number, PRInfo>>
): boolean {
  // Must be a PR first
  if (!isPR(exerciseName, reps, weight, prMap)) {
    return false;
  }

  const exercisePRs = prMap.get(exerciseName);
  if (!exercisePRs) {
    return false;
  }

  const prInfo = exercisePRs.get(reps!);
  if (!prInfo) {
    return false;
  }

  // Check if this exact set (workout, exercise, set) matches the first one that achieved the PR
  return (
    prInfo.firstAchievedWorkoutId === workoutId &&
    prInfo.firstAchievedExerciseIndex === exerciseIndex &&
    prInfo.firstAchievedSetIndex === setIndex
  );
}

/**
 * Gets the tooltip text for a PR badge
 * 
 * @param exerciseName - Name of the exercise
 * @param reps - Number of reps
 * @param weight - Weight used
 * @param isNewPR - Whether this is a new PR (first time achieving) or matching PR
 * @param prMap - PR map from calculatePRs
 * @returns Formatted tooltip text
 */
export function getPRTooltipText(
  exerciseName: string,
  reps: number | undefined,
  weight: number | undefined,
  isNewPR: boolean,
  prMap: Map<string, Map<number, PRInfo>>
): string {
  if (reps === undefined || reps === null || weight === undefined || weight === null) {
    return "";
  }

  const exercisePRs = prMap.get(exerciseName);
  if (!exercisePRs) {
    return "";
  }

  const prInfo = exercisePRs.get(reps);
  if (!prInfo) {
    return "";
  }

  const prLabel = isNewPR ? "PR" : "Matching PR";
  const previousPRText = prInfo.previousPRWeight !== null
    ? `, your previous PR was ${prInfo.previousPRWeight}x${reps}`
    : "";

  return `${prLabel}: ${exerciseName} ${weight}x${reps}${previousPRText}`;
}
