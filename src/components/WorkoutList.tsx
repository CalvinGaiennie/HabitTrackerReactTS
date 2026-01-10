import { useState, useEffect, useMemo } from "react";
import { deleteWorkout } from "../services/workouts";
import type { Workout } from "../types/workouts";
import fetchWorkouts from "../hooks/fetchWorkouts"
import { useNavigate } from 'react-router-dom';
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "./ConfirmDialog";
import { calculatePRs, isPR, isNewPR, getPRTooltipText } from "../utils/calculatePRs";

function WorkoutList() {
  const { showToast } = useToast();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [confirmDeleteWorkout, setConfirmDeleteWorkout] = useState<number | null>(null);
  const [tooltipState, setTooltipState] = useState<{ visible: boolean; x: number; y: number; text: string }>({
    visible: false,
    x: 0,
    y: 0,
    text: ""
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchWorkouts(setWorkouts);
  }, []);

  // Calculate PRs from all workouts
  const prMap = useMemo(() => calculatePRs(workouts), [workouts]);

  const handleDelete = async (workoutId: number) => {
    setConfirmDeleteWorkout(workoutId);
  };

  const confirmDeleteWorkoutAction = async () => {
    if (confirmDeleteWorkout === null) return;
    try {
      console.log("Attempting to delete workout ID:", confirmDeleteWorkout);
      const result = await deleteWorkout(confirmDeleteWorkout);
      console.log("Delete result:", result);
      setWorkouts(workouts.filter((workout) => workout.id !== confirmDeleteWorkout));
      console.log("Workout removed from list");
      showToast("Workout deleted successfully!", "success");
      setConfirmDeleteWorkout(null);
    } catch (error) {
      console.error("Error deleting workout:", error);
      showToast(`Failed to delete workout: ${error}`, "error");
      setConfirmDeleteWorkout(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (workouts.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>No workouts yet</h4>
        <p className="text-muted">Create your first workout!</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        {[...workouts].sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()).map((workout) => (
          <div key={workout.id} className="col-md-6 mb-3" onClick={()=> navigate(`/WorkoutViewer/${workout.id}`)}>
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5 className="mb-0">{workout.title}</h5>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(workout.id);
                  }}
                >
                  Delete
                </button>
              </div>
              <div className="card-body">
                <div className="mb-2">
                  {workout.workout_types.map((type, index) => (
                    <span key={index} className="badge bg-primary me-1">
                      {type}
                    </span>
                  ))}
                </div>

                <div className="mb-2">
                  <small className="text-muted">
                    {formatDate(workout.started_at)}
                  </small>
                </div>

                {workout.notes && (
                  <div>
                    <strong>Notes:</strong> {workout.notes}
                  </div>
                )}

                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="mt-3">
                    <strong>Exercises:</strong>
                    {workout.exercises.map((exercise, exerciseIndex) => (
                      <div
                        key={exerciseIndex}
                        className="mt-2 p-2 border rounded"
                      >
                        <div className="fw-bold">{exercise.name}</div>
                        {exercise.sets && exercise.sets.length > 0 && (
                          <div className="mt-1">
                            <small className="text-muted">Sets:</small>
                            {exercise.sets.map((set, setIndex) => {
                              const setIsPR = isPR(exercise.name, set.reps, set.weight, prMap);
                              const setIsNewPR = isNewPR(
                                exercise.name, 
                                set.reps, 
                                set.weight, 
                                workout.id,
                                exerciseIndex,
                                setIndex,
                                prMap
                              );
                              const tooltipText = setIsPR 
                                ? getPRTooltipText(exercise.name, set.reps, set.weight, setIsNewPR, prMap)
                                : "";
                              const badgeText = setIsNewPR ? "PR" : "=";
                              
                              return (
                                <div 
                                  key={setIndex} 
                                  className={`ms-2 small ${setIsNewPR ? 'bg-warning bg-opacity-25 rounded px-2 py-1 my-1' : ''}`}
                                >
                                  {set.weight && (
                                    <span className="ms-2">
                                      <strong>Weight:</strong> {set.weight}lbs
                                      {setIsPR && (
                                        <span 
                                          className="badge bg-warning text-dark ms-2" 
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
                                      {"  "}
                                    </span>
                                  )}
                                  {set.reps && <span><strong>Reps: </strong> {set.reps}</span>}
                                  {set.rest_duration && (
                                    <span className="ms-2">
                                      <strong>Rest: </strong> {set.rest_duration}s
                                    </span>
                                  )}
                                  {set.notes && (
                                    <span className="ms-2">
                                      Notes: {set.notes}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {exercise.notes && (
                          <div className="mt-1 small text-muted">
                            Exercise notes: {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
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

export default WorkoutList;
