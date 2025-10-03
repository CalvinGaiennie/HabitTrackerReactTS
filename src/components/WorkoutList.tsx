import { useState, useEffect } from "react";
import { getWorkouts, deleteWorkout } from "../services/workouts";
import type { Workout } from "../types/workouts";

function WorkoutList() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workoutId: number) => {
    if (!window.confirm("Delete this workout?")) return;

    try {
      await deleteWorkout(workoutId);
      setWorkouts(workouts.filter((workout) => workout.id !== workoutId));
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert("Failed to delete workout");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

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
        {workouts.map((workout) => (
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkoutList;
