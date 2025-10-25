import { useState, useEffect } from "react";
import { createWorkout } from "../services/workouts";
import { getUserSettings } from "../services/users";
import type { UserSettings } from "../types/users";
import type { Exercise, ExerciseSet } from "../types/workouts";
import type { ExerciseFull } from "../types/exercises"
import fetchExercises from "../hooks/fetchExercises";

interface WorkoutFormProps {
  onWorkoutCreated?: () => void;
}

function WorkoutForm({ onWorkoutCreated }: WorkoutFormProps = {}) {
  const [title, setTitle] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [specificExercises, setSpecificExercises ] = useState<ExerciseFull[]>([])
  useEffect(() => {
    fetchExercises(setSpecificExercises);
  }, []);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Refresh settings when component becomes visible (e.g., after returning from settings)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUserSettings();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const fetchUserSettings = async () => {
    try {
      const user = await getUserSettings(1); // TODO: Get from auth context
      console.log("Fetched user:", user);
      console.log("User settings:", user.settings);
      console.log("Workout types:", user.settings?.workoutTypes);
      setUserSettings(user.settings);
    } catch (error) {
      console.error("Error fetching user settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const addExercise = () => {
    const firstExercise = specificExercises[0];
    const newExercise: Exercise = {
      name: firstExercise?.name ?? "",
      sets: [
        {
          reps: undefined,
          weight: undefined,
          rest_duration: undefined,
          notes: "",
        },
      ],
      notes: "",
    };
    setExercises((prev) => [...prev, newExercise]);
  };

  const updateExercise = (
    exerciseIndex: number,
    field: keyof Exercise,
    value: unknown
  ) => {
    setExercises((prev) =>
      prev.map((exercise, index) =>
        index === exerciseIndex ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const addSet = (exerciseIndex: number) => {
    const newSet: ExerciseSet = {
      reps: undefined,
      weight: undefined,
      rest_duration: undefined,
      notes: "",
    };
    setExercises((prev) =>
      prev.map((exercise, index) =>
        index === exerciseIndex
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise
      )
    );
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    value: unknown
  ) => {
    setExercises((prev) =>
      prev.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, sIndex) =>
                sIndex === setIndex ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      )
    );
  };

  const removeExercise = (exerciseIndex: number) => {
    setExercises((prev) => prev.filter((_, index) => index !== exerciseIndex));
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setExercises((prev) =>
      prev.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.filter((_, sIndex) => sIndex !== setIndex),
            }
          : exercise
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTypes.length === 0) {
      alert("Please select at least one workout type");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      await createWorkout({
        title,
        workout_types: selectedTypes,
        notes: notes || undefined,
        exercises: exercises.length > 0 ? exercises : undefined,
      });
      setSuccessMessage("Workout created successfully!");
      setTitle("");
      setSelectedTypes([]);
      setNotes("");
      setExercises([]);

      // Call the callback if provided
      if (onWorkoutCreated) {
        onWorkoutCreated();
      }
    } catch (error) {
      console.error("Error creating workout:", error);
      alert("Failed to create workout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const workoutTypes = userSettings?.workoutTypes || [];

  const toggleSuperset = (exerciseIndex: number) => {
    return exerciseIndex
  }
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h2 className="text-center mb-0">Create Workout</h2>
            </div>
            <div className="card-body">
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}

              {workoutTypes.length === 0 ? (
                <div className="text-center py-4">
                  <h5>No workout types defined</h5>
                  <p className="text-muted mb-3">
                    You need to create workout types in your settings first.
                  </p>
                  <div className="d-flex gap-2 justify-content-center">
                    <a href="/account" className="btn btn-primary">
                      Go to Settings
                    </a>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={fetchUserSettings}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      <strong>Workout Title</strong>
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g., Morning Workout"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Workout Types</strong>
                    </label>
                    <div className="dropdown">
                      <button
                        className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{ minHeight: "44px" }}
                      >
                        {selectedTypes.length === 0
                          ? "Select workout types..."
                          : selectedTypes.length === 1
                          ? selectedTypes[0]
                          : `${selectedTypes.length} types selected`}
                      </button>
                      {isDropdownOpen && (
                        <ul
                          className="dropdown-menu w-100 show"
                          style={{ display: "block" }}
                        >
                          {workoutTypes.map((type) => (
                            <li key={type}>
                              <div className="dropdown-item-text">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`type-${type}`}
                                    checked={selectedTypes.includes(type)}
                                    onChange={() => handleTypeToggle(type)}
                                  />
                                  <label
                                    className="form-check-label w-100"
                                    htmlFor={`type-${type}`}
                                  >
                                    {type}
                                  </label>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {selectedTypes.length === 0 && (
                      <small className="text-muted">
                        Select at least one workout type
                      </small>
                    )}
                  </div>

                  {/* Exercises Section */}
                  <div className="mb-4">
                    <div className="d-flex flex-column  justify-content-between align-items-left mb-3">
                      <h4>Exercises</h4>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addExercise}
                      >
                        Add Exercise
                      </button>
                    </div>

                    {exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="card mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <h3 className="m-3">Exercise {exerciseIndex + 1}</h3>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm me-3"
                            onClick={() => removeExercise(exerciseIndex)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className=" d-flex justify-content-between align-items-center mx-4">
                          <select
                          className="form-select me-3"
                          value={exercise.name}
                          onChange={(e) => updateExercise(exerciseIndex, "name", e.target.value)}>
                            {specificExercises.map((ex)=> (
                              <option
                              key={ex.id}
                              value={ex.name}
                              >{ex.name}</option>
                            ))}
                          </select>
                          <button className='btn btn-outline-primary' onChange={() => toggleSuperset(exerciseIndex)}>Superset</button>
                        </div>
                        <div className="card-body">
                          {/* Sets */}
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h3>Sets</h3>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => addSet(exerciseIndex)}
                              >
                                Add Set
                              </button>
                            </div>
                            {exercise.sets.map((set, setIndex) => (
                              <div key={setIndex} className="row mb-2">
                                <h4>Set {setIndex + 1}</h4>
                                <div className="col-md-3">
                                  <label className="form-label">Reps</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Reps"
                                    value={set.reps || ""}
                                    onChange={(e) =>
                                      updateSet(
                                        exerciseIndex,
                                        setIndex,
                                        "reps",
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">
                                    Weight (lbs)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    className="form-control"
                                    placeholder="Weight"
                                    value={set.weight || ""}
                                    onChange={(e) =>
                                      updateSet(
                                        exerciseIndex,
                                        setIndex,
                                        "weight",
                                        e.target.value
                                          ? parseFloat(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">
                                    Rest (sec)
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Rest duration"
                                    value={set.rest_duration || ""}
                                    onChange={(e) =>
                                      updateSet(
                                        exerciseIndex,
                                        setIndex,
                                        "rest_duration",
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-md-2">
                                  <label className="form-label">Notes</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Set notes"
                                    value={set.notes || ""}
                                    onChange={(e) =>
                                      updateSet(
                                        exerciseIndex,
                                        setIndex,
                                        "notes",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-md-1 d-flex align-items-end">
                                  <button
                                    type="button"
                                    className="mt-2 btn btn-danger btn-sm"
                                    onClick={() =>
                                      removeSet(exerciseIndex, setIndex)
                                    }
                                    disabled={exercise.sets.length === 1}
                                    title="Remove set"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Exercise Notes */}
                          <div>
                            <label className="form-label">Exercise Notes</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              placeholder="Exercise notes..."
                              value={exercise.notes || ""}
                              onChange={(e) =>
                                updateExercise(
                                  exerciseIndex,
                                  "notes",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">
                      <strong>Workout Notes (Optional)</strong>
                    </label>
                    <textarea
                      id="notes"
                      className="form-control"
                      rows={3}
                      placeholder="Overall workout notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Workout"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutForm;
