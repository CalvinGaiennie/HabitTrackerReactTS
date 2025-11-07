function WorkoutViewer() {

    const workout = {
        id: 1,
        user_id: 1,
        started_at: new Date(),
        ended_at: new Date(),
        title: "Test Workout",
        workout_types: ["lifting", "stretching"],
        notes: "hmmm",
        exercises: ['idk','hmmm'],
        is_draft: false,
        deleted_at: "",
    }


      const handleDelete = async (workoutId: number) => {
        if (!window.confirm("Delete this workout?")) return;
    
        try {
          console.log("Attempting to delete workout ID:", workoutId);
          const result = await deleteWorkout(workoutId);
          console.log("Delete result:", result);
          setWorkouts(workouts.filter((workout) => workout.id !== workoutId));
          console.log("Workout removed from list");
        } catch (error) {
          console.error("Error deleting workout:", error);
          alert(`Failed to delete workout: ${error}`);
        }
      };

      
    return (
        <div key={workout.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5 className="mb-0">{workout.title}</h5>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(workout.id)}
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
                            {exercise.sets.map((set, setIndex) => (
                              <div key={setIndex} className="ms-2 small">
                                {set.weight && (
                                  <span className="ms-2">
                                    <strong>Weight:</strong> {set.weight}lbs{"  "}
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
                            ))}
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
)
}
export default WorkoutViewer