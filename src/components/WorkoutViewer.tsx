import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkout, getWorkouts, deleteWorkout } from "../services/workouts";
import type { Workout } from "../types/workouts";
import { calculatePRs, isPR, isNewPR, getPRTooltipText } from "../utils/calculatePRs";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "./ConfirmDialog";

function WorkoutViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteWorkout, setConfirmDeleteWorkout] = useState<number | null>(null);
  const [tooltipState, setTooltipState] = useState<{ visible: boolean; x: number; y: number; text: string }>({
    visible: false,
    x: 0,
    y: 0,
    text: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Workout ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const workoutId = parseInt(id, 10);
        
        // Fetch both the single workout and all workouts for PR calculation
        const [workoutData, allWorkoutsData] = await Promise.all([
          getWorkout(workoutId),
          getWorkouts()
        ]);
        
        setWorkout(workoutData);
        setAllWorkouts(allWorkoutsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching workout:", err);
        setError("Failed to load workout");
        showToast("Failed to load workout", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, showToast]);

  // Calculate PRs from all workouts
  const { prMap, setPRStatusMap } = useMemo(() => calculatePRs(allWorkouts), [allWorkouts]);

  const handleDelete = async (workoutId: number) => {
    setConfirmDeleteWorkout(workoutId);
  };

  const confirmDeleteWorkoutAction = async () => {
    if (confirmDeleteWorkout === null || !workout) return;
    try {
      await deleteWorkout(confirmDeleteWorkout);
      showToast("Workout deleted successfully!", "success");
      navigate("/Workout");
    } catch (error) {
      console.error("Error deleting workout:", error);
      showToast(`Failed to delete workout: ${error}`, "error");
      setConfirmDeleteWorkout(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div>Loading workout...</div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="container text-center py-5">
        <div className="text-danger">{error || "Workout not found"}</div>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/Workout")}>
          Back to Workout History
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-3">
        <button className="btn btn-secondary" onClick={() => navigate("/Workout")}>
          ← Back to Workout History
        </button>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{workout.title}</h4>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate(`/Workout?edit=${workout.id}`)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(workout.id)}
            >
              Delete
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="mb-3">
            {workout.workout_types.map((type, index) => (
              <span key={index} className="badge bg-primary me-1">
                {type}
              </span>
            ))}
          </div>

          <div className="mb-3">
            <small className="text-muted">
              <strong>Started:</strong> {formatDate(workout.started_at)} at {formatTime(workout.started_at)}
            </small>
            {workout.ended_at && (
              <small className="text-muted ms-3">
                <strong>Ended:</strong> {formatDate(workout.ended_at)} at {formatTime(workout.ended_at)}
              </small>
            )}
          </div>

          {workout.notes && (
            <div className="mb-3">
              <strong>Notes:</strong> {workout.notes}
            </div>
          )}

          {workout.exercises && workout.exercises.length > 0 && (
            <div className="mt-4">
              <h5>Exercises</h5>
              {workout.exercises.map((exercise, exerciseIndex) => (
                <div
                  key={exerciseIndex}
                  className="mt-3 p-3 border rounded"
                >
                  <div className="fw-bold fs-5 mb-2">{exercise.name}</div>
                  {exercise.sets && exercise.sets.length > 0 && (
                    <div className="mt-1">
                      <small className="text-muted">Sets:</small>
                      {exercise.sets.map((set, setIndex) => {
                        const setIsPR = isPR(
                          exercise.name, 
                          set.reps, 
                          set.weight, 
                          workout.id,
                          exerciseIndex,
                          setIndex,
                          setPRStatusMap
                        );
                        const setIsNewPR = isNewPR(
                          workout.id,
                          exerciseIndex,
                          setIndex,
                          setPRStatusMap
                        );
                        const tooltipText = setIsPR 
                          ? getPRTooltipText(
                              exercise.name, 
                              set.reps, 
                              set.weight, 
                              workout.id,
                              exerciseIndex,
                              setIndex,
                              prMap,
                              setPRStatusMap
                            )
                          : "";
                        const setKey = `${workout.id}-${exerciseIndex}-${setIndex}`;
                        const setStatus = setPRStatusMap.get(setKey);
                        
                        // Determine badge text and color
                        let badgeText = "";
                        let badgeColorClass = "";
                        
                        if (setStatus) {
                          if (setStatus.isCurrentPR) {
                            // Current PR: gold color
                            badgeColorClass = "bg-warning text-dark";
                            badgeText = setStatus.wasNewPRWhenDone ? "PR" : "=";
                          } else if (setStatus.wasPRWhenDone) {
                            // Previous PR: medium gray color
                            badgeColorClass = "bg-secondary bg-opacity-75 text-white";
                            badgeText = setStatus.wasNewPRWhenDone ? "PR" : "=";
                          }
                        }
                        
                        // Only highlight row if it's a CURRENT new PR
                        const shouldHighlightRow = setStatus?.isCurrentPR && setStatus?.wasNewPRWhenDone;
                        
                        return (
                          <div 
                            key={setIndex} 
                            className={`ms-2 small ${shouldHighlightRow ? 'bg-warning bg-opacity-25 rounded px-2 py-1 my-1' : ''}`}
                          >
                            {set.weight && (
                              <span className="ms-2">
                                <strong>Weight:</strong> {set.weight}lbs
                                {setIsPR && badgeText && (
                                  <span 
                                    className={`badge ${badgeColorClass} ms-2`} 
                                    style={{ cursor: 'help' }}
                                    onMouseEnter={(e) => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setTooltipState({
                                        visible: true,
                                        x: rect.left + rect.width / 2,
                                        y: rect.top - 8,
                                        text: tooltipText
                                      });
                                    }}
                                    onMouseLeave={() => {
                                      setTooltipState({ visible: false, x: 0, y: 0, text: "" });
                                    }}
                                  >
                                    {badgeText}
                                  </span>
                                )}
                              </span>
                            )}
                            {set.reps && (
                              <span className="ms-2">
                                <strong>Reps:</strong> {set.reps}
                              </span>
                            )}
                            {set.rest_duration && (
                              <span className="ms-2">
                                <strong>Rest:</strong> {set.rest_duration}s
                              </span>
                            )}
                            {set.notes && (
                              <span className="ms-2">
                                <strong>Notes:</strong> {set.notes}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {exercise.notes && (
                    <div className="mt-2 small text-muted">
                      <strong>Exercise notes:</strong> {exercise.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        show={confirmDeleteWorkout !== null}
        title="Delete Workout"
        message="Are you sure you want to delete this workout? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDeleteWorkoutAction}
        onCancel={() => setConfirmDeleteWorkout(null)}
      />
      {tooltipState.visible && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltipState.x}px`,
            top: `${tooltipState.y}px`,
            transform: 'translate(-50%, -100%)',
            backgroundColor: '#212529',
            color: 'white',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            zIndex: 10000,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {tooltipState.text}
        </div>
      )}
    </div>
  );
}

export default WorkoutViewer;