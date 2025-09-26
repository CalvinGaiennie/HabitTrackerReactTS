// import { useDebounce } from "../hooks/useDebounce";

function WorkoutForm() {
  return (
    <div className="container d-flex flex-column align-items-center">
      <div className="d-flex flex-row">
        <div>
          <h2>Title</h2>
          <input />
        </div>
        <div>
          <h2>Workout Type</h2>
          <select>
            <option>a</option>
            <option>b</option>
          </select>
        </div>
      </div>
      <div>sets and shit</div>
      <div>sets and shit</div>
      <div>sets and shit</div>
      <div>sets and shit</div>
      <div>sets and shit</div>
      <div>
        <h2>Notes</h2>
        <input />
      </div>
    </div>
  );
}

export default WorkoutForm;
