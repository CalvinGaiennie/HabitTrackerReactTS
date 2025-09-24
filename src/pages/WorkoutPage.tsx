import WorkoutForm from "../components/WorkoutForm"

function WorkoutPage() {
 return (
    <div className="container d-flex flex-column align-items-center">
      <h1>Workouts</h1>
      <WorkoutForm/>
    </div>
  )
}

export default WorkoutPage