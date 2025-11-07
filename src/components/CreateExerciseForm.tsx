import { useState } from "react";
import type { ExerciseCreate } from "../types/exercises";
import { createExercise } from "../services/exercises";
import { useUserId } from "../hooks/useAuth";

// Helper function to convert comma-separated string to array
const stringToArray = (str: string): string[] => {
  return str
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

function CreateExerciseForm() {
  const userId = useUserId(); // Get current user ID
  // Use strings for easier form input handling
  const [formData, setFormData] = useState({
    user_id: userId,
    name: "",
    description: "",
    exercise_type: "",
    exercise_subtype: "",
    primary_muscles: "",
    secondary_muscles: "",
    tags: "",
    equipment: "",
    equipment_modifiers: "",
    injury_pain: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name == "") {
      return
    };
    try {
      // Convert comma-separated strings to arrays
      const exerciseData: ExerciseCreate = {
        user_id: formData.user_id,
        name: formData.name,
        description: formData.description || undefined,
        exercise_type: formData.exercise_type || undefined,
        exercise_subtype: formData.exercise_subtype || undefined,
        primary_muscles: stringToArray(formData.primary_muscles),
        secondary_muscles: formData.secondary_muscles
          ? stringToArray(formData.secondary_muscles)
          : undefined,
        tags: formData.tags ? stringToArray(formData.tags) : undefined,
        equipment: formData.equipment || undefined,
        equipment_modifiers: formData.equipment_modifiers
          ? stringToArray(formData.equipment_modifiers)
          : undefined,
        injury_pain: formData.injury_pain || undefined,
      };

      const newExercise = await createExercise(exerciseData);
      console.log("Exercise created:", newExercise);

      // Reset form
      setFormData({
        user_id: userId,
        name: "",
        description: "",
        exercise_type: "",
        exercise_subtype: "",
        primary_muscles: "",
        secondary_muscles: "",
        tags: "",
        equipment: "",
        equipment_modifiers: "",
        injury_pain: "",
      });
    } catch (error) {
      console.error("Error creating exercise:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Create an Exercise</h2>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exercise_type" className="form-label">
            Exercise Type
          </label>
          <input
            type="text"
            className="form-control"
            id="exercise_type"
            name="exercise_type"
            value={formData.exercise_type}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exercise_subtype" className="form-label">
            Exercise Sub Type
          </label>
          <input
            type="text"
            className="form-control"
            id="exercise_subtype"
            name="exercise_subtype"
            value={formData.exercise_subtype}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="primary_muscles" className="form-label">
            Primary Muscles <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="primary_muscles"
            name="primary_muscles"
            value={formData.primary_muscles}
            onChange={handleChange}
            placeholder="e.g. Chest, Triceps"
            required
          />
          <small className="form-text text-muted">
            Comma-separated list of muscles
          </small>
        </div>
        <div className="mb-3">
          <label htmlFor="secondary_muscles" className="form-label">
            Secondary Muscles
          </label>
          <input
            type="text"
            className="form-control"
            id="secondary_muscles"
            name="secondary_muscles"
            value={formData.secondary_muscles}
            onChange={handleChange}
            placeholder="e.g. Shoulders, Core"
          />
          <small className="form-text text-muted">
            Comma-separated list of muscles
          </small>
        </div>
        <div className="mb-3">
          <label htmlFor="equipment" className="form-label">
            Equipment
          </label>
          <input
            type="text"
            className="form-control"
            id="equipment"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            placeholder="e.g. Barbell, Dumbbell, Bodyweight"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="equipment_modifiers" className="form-label">
            Equipment Modifiers
          </label>
          <input
            type="text"
            className="form-control"
            id="equipment_modifiers"
            name="equipment_modifiers"
            value={formData.equipment_modifiers}
            onChange={handleChange}
            placeholder="e.g. Incline, Decline, Resistance Band"
          />
          <small className="form-text text-muted">Comma-separated list</small>
        </div>
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">
            Tags
          </label>
          <input
            type="text"
            className="form-control"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. Push, Compound, Strength"
          />
          <small className="form-text text-muted">Comma-separated tags</small>
        </div>
        <div className="mb-3">
          <label htmlFor="injury_pain" className="form-label">
            Injury/Pain Notes
          </label>
          <textarea
            className="form-control"
            id="injury_pain"
            name="injury_pain"
            value={formData.injury_pain}
            onChange={handleChange}
            placeholder="Any injury or pain considerations"
            rows={2}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Exercise
        </button>
      </form>
    </div>
  );
}

export default CreateExerciseForm;
