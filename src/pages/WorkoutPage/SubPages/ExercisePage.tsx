import { useEffect, useState } from "react";
import type { Exercise } from "../../../types/exercises"
import fetchExercises from "../../../hooks/fetchExercises";
import BootstrapModal from "../../../components/BootstrapModal";
import CreateExerciseForm from "../../../components/CreateExerciseForm";
function ExercisePage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchExercises(setExercises)
  }, [])

  return (
    <div className="container">
      <div className="d-flex gap-3 mb-3 justify-content-between align-items-center">
        <h3 className="mb-0">Exercise Library</h3>
        <button 
            className="btn btn-primary px-4" 
            onClick={() => setShowModal(true)}
        >
            Add Exercise
        </button>
      </div>
      <BootstrapModal 
          show={showModal}
          onHide={() => setShowModal(false)}
          title={"Create Exercise"}
        >
           <CreateExerciseForm onSubmit={() => setShowModal(false)}/>
        </BootstrapModal>
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
                    {exercise.tags.map((tag: string, idx: number) => (
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
export default ExercisePage;
