import { useEffect, useState } from "react";
import { getExercises } from "../services/exercises";
import type { Exercise } from "../types/exercises";

function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const newExercises = await getExercises();
        setExercises(newExercises);
      } catch {
        console.error("Error fetching exercises");
      }
    };
    fetchExercises();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Exercise Library</h2>
      <div className="row">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="col-md-6 col-lg-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{exercise.name}</h5>
                {exercise.description && (
                  <p className="card-text text-muted">{exercise.description}</p>
                )}
                {exercise.primary_muscles &&
                  exercise.primary_muscles.length > 0 && (
                    <p className="mb-1">
                      <strong>Primary:</strong>{" "}
                      {exercise.primary_muscles.join(", ")}
                    </p>
                  )}
                {exercise.secondary_muscles &&
                  exercise.secondary_muscles.length > 0 && (
                    <p className="mb-1">
                      <strong>Secondary:</strong>{" "}
                      {exercise.secondary_muscles.join(", ")}
                    </p>
                  )}
                {exercise.equipment && (
                  <p className="mb-1">
                    <strong>Equipment:</strong> {exercise.equipment}
                  </p>
                )}
                {exercise.tags && exercise.tags.length > 0 && (
                  <p className="mb-0">
                    {exercise.tags.map((tag, idx) => (
                      <span key={idx} className="badge bg-secondary me-1">
                        {tag}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {exercises.length === 0 && (
        <p className="text-muted">
          No exercises found. Create your first exercise above!
        </p>
      )}
    </div>
  );
}
export default ExerciseList;
