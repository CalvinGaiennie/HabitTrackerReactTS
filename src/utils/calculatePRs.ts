import type { Workout } from "../types/workouts";

interface PRInfo {
  weight: number;
  previousPRWeight: number | null; // Previous PR weight before this one was set (null if this is the first PR ever)
  firstAchievedDate: string; // workout.started_at when PR was first achieved
  firstAchievedWorkoutId: number; // workout.id when PR was first achieved
  firstAchievedExerciseIndex: number; // exercise index when PR was first achieved
  firstAchievedSetIndex: number; // set index when PR was first achieved
}

interface SetPRStatus {
  wasPRWhenDone: boolean; // Was this set a PR when it was performed?
  wasNewPRWhenDone: boolean; // Was this set a new PR when it was performed?
  isCurrentPR: boolean; // Is this set still the current PR?
  prWeightAtTime: number | null; // What was the PR weight when this set was done (null if no PR existed)
}

// Map key: `${workoutId}-${exerciseIndex}-${setIndex}`
type SetPRStatusMap = Map<string, SetPRStatus>;

/**
 * Calculates Personal Records (PRs) from workout history.
 * Returns a Map structure: exerciseName -> repCount -> PRInfo (weight and first achieved date)
 * Also tracks historical PR status for each set.
 * 
 * @param workouts - Array of all workouts to analyze (should be sorted by date, oldest first)
 * @returns Object containing prMap and setPRStatusMap
 */
export function calculatePRs(workouts: Workout[]): {
  prMap: Map<string, Map<number, PRInfo>>;
  setPRStatusMap: SetPRStatusMap;
} {
  const prMap = new Map<string, Map<number, PRInfo>>();
  const setPRStatusMap: SetPRStatusMap = new Map();

  // Sort workouts by date (oldest first) to track when PRs were first achieved
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
  );

  // First pass: calculate current PRs
  for (const workout of sortedWorkouts) {
    if (!workout.exercises) continue;

    workout.exercises.forEach((exercise, exerciseIndex) => {
      if (!exercise.sets || exercise.sets.length === 0) return;

      if (!prMap.has(exercise.name)) {
        prMap.set(exercise.name, new Map<number, PRInfo>());
      }

      const exercisePRs = prMap.get(exercise.name)!;

      exercise.sets.forEach((set, setIndex) => {
        if (set.reps === undefined || set.reps === null || set.weight === undefined || set.weight === null) {
          return;
        }

        const currentPR = exercisePRs.get(set.reps);
        
        if (currentPR === undefined || set.weight > currentPR.weight) {
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

  // Second pass: determine PR status for each set at the time it was performed
  // Track PRs as we go chronologically
  const historicalPRs = new Map<string, Map<number, number>>(); // exerciseName -> repCount -> weight

  for (const workout of sortedWorkouts) {
    if (!workout.exercises) continue;

    workout.exercises.forEach((exercise, exerciseIndex) => {
      if (!exercise.sets || exercise.sets.length === 0) return;

      if (!historicalPRs.has(exercise.name)) {
        historicalPRs.set(exercise.name, new Map<number, number>());
      }

      const exerciseHistoricalPRs = historicalPRs.get(exercise.name)!;

      exercise.sets.forEach((set, setIndex) => {
        if (set.reps === undefined || set.reps === null || set.weight === undefined || set.weight === null) {
          return;
        }

        const setKey = `${workout.id}-${exerciseIndex}-${setIndex}`;
        const prWeightAtTime = exerciseHistoricalPRs.get(set.reps) ?? null;
        const wasPRWhenDone = prWeightAtTime === null || set.weight >= prWeightAtTime;
        const wasNewPRWhenDone = prWeightAtTime === null || set.weight > prWeightAtTime;

        // Check if this is still the current PR
        const currentPRInfo = prMap.get(exercise.name)?.get(set.reps);
        const isCurrentPR = currentPRInfo !== undefined && 
                           currentPRInfo.weight === set.weight &&
                           currentPRInfo.firstAchievedWorkoutId === workout.id &&
                           currentPRInfo.firstAchievedExerciseIndex === exerciseIndex &&
                           currentPRInfo.firstAchievedSetIndex === setIndex;

        setPRStatusMap.set(setKey, {
          wasPRWhenDone,
          wasNewPRWhenDone,
          isCurrentPR,
          prWeightAtTime
        });

        // Update historical PR if this set set a new PR
        if (wasNewPRWhenDone) {
          exerciseHistoricalPRs.set(set.reps, set.weight);
        }
      });
    });
  }

  return { prMap, setPRStatusMap };
}

/**
 * Checks if a set was ever a Personal Record
 * 
 * @param exerciseName - Name of the exercise
 * @param reps - Number of reps
 * @param weight - Weight used
 * @param workoutId - ID of the workout
 * @param exerciseIndex - Index of the exercise in the workout
 * @param setIndex - Index of the set in the exercise
 * @param setPRStatusMap - Set PR status map from calculatePRs
 * @returns true if this set was ever a PR
 */
export function isPR(
  exerciseName: string,
  reps: number | undefined,
  weight: number | undefined,
  workoutId: number,
  exerciseIndex: number,
  setIndex: number,
  setPRStatusMap: SetPRStatusMap
): boolean {
  // Must have both reps and weight to be a PR
  if (reps === undefined || reps === null || weight === undefined || weight === null) {
    return false;
  }

  const setKey = `${workoutId}-${exerciseIndex}-${setIndex}`;
  const setStatus = setPRStatusMap.get(setKey);
  
  return setStatus !== undefined && setStatus.wasPRWhenDone;
}

/**
 * Checks if a set is a new PR (first time achieving this weight for this rep count)
 * 
 * @param workoutId - ID of the current workout
 * @param exerciseIndex - Index of the exercise in the workout
 * @param setIndex - Index of the set in the exercise
 * @param setPRStatusMap - Set PR status map from calculatePRs
 * @returns true if this set was a new PR when it was performed
 */
export function isNewPR(
  workoutId: number,
  exerciseIndex: number,
  setIndex: number,
  setPRStatusMap: SetPRStatusMap
): boolean {
  const setKey = `${workoutId}-${exerciseIndex}-${setIndex}`;
  const setStatus = setPRStatusMap.get(setKey);
  
  return setStatus !== undefined && setStatus.wasNewPRWhenDone;
}

/**
 * Gets the tooltip text for a PR badge
 * 
 * @param exerciseName - Name of the exercise
 * @param reps - Number of reps
 * @param weight - Weight used
 * @param workoutId - ID of the workout
 * @param exerciseIndex - Index of the exercise in the workout
 * @param setIndex - Index of the set in the exercise
 * @param prMap - PR map from calculatePRs
 * @param setPRStatusMap - Set PR status map from calculatePRs
 * @returns Formatted tooltip text
 */
export function getPRTooltipText(
  exerciseName: string,
  reps: number | undefined,
  weight: number | undefined,
  workoutId: number,
  exerciseIndex: number,
  setIndex: number,
  prMap: Map<string, Map<number, PRInfo>>,
  setPRStatusMap: SetPRStatusMap
): string {
  if (reps === undefined || reps === null || weight === undefined || weight === null) {
    return "";
  }

  const setKey = `${workoutId}-${exerciseIndex}-${setIndex}`;
  const setStatus = setPRStatusMap.get(setKey);

  if (!setStatus || !setStatus.wasPRWhenDone) {
    return "";
  }

  let statusText = "";
  if (setStatus.isCurrentPR) {
    statusText = "this is your current PR";
  } else if (setStatus.wasNewPRWhenDone) {
    // Was a new PR when done, but is no longer current
    statusText = "when you did this workout this was a new PR";
  } else {
    // Matched an existing PR when done
    statusText = "when you hit this it matched your PR";
  }

  return `${exerciseName} ${weight}x${reps}, ${statusText}`;
}
