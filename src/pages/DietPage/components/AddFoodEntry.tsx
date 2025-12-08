import { useRef } from "react";
import type { Food } from "../../../types/foods";
import type { FoodEntryCreate } from "../../../types/foodEntries";

interface AddFoodEntryFormProps {
  foods: Food[] | null;
  formData: FoodEntryCreate;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel?: () => void;
}

function AddFoodEntryForm({
  foods,
  formData,
  onChange,
  onSubmit,
  onCancel,
}: AddFoodEntryFormProps) {
  const isSubmitting = useRef(false);

  const handleSubmitInternal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    try {
      await onSubmit(e);
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmitInternal} className="w-100" style={{ maxWidth: "500px" }}>
      <div className="mb-3">
        <label className="form-label">Food:</label>
        <select
          name="food_id"
          className="form-select"
          value={formData.food_id}
          onChange={onChange}
          required
        >
          <option value={0}>-- Select a food --</option>
          {foods?.map((food) => (
            <option key={food.id} value={food.id}>
              {food.name}
            </option>
          ))}
          {!foods && <option>Loading foods...</option>}
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label">Quantity:</label>
        <input
          name="quantity"
          value={formData.quantity || ""}
          onChange={onChange}
          className="form-control"
          type="number"
          min="0"
          step="0.1"
          placeholder="e.g. 1, 0.5, 150"
          required
        />
      </div>

      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting.current}
        >
          {isSubmitting.current ? "Saving..." : "Add Entry"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
export default AddFoodEntryForm