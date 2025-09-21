// import { useEffect } from "react";
import type { MetricCreate } from "../types/Metrics.ts";
// import { createMetric } from "../services/metrics.ts";

function HomePage() {
  // const form: MetricCreate = {
  //   user_id: 1,
  //   name: "test metric",
  //   is_required: false,
  //   notes_on: false,
  //   data_type: "text",
  //   active: true,
  // };

  // useEffect(() => {
  //   createMetric(form)
  // }, []);

  return (
    <div className="container d-flex flex-column align-items-center">
      <h1>Habit Tracker</h1>
    </div>
  );
}

export default HomePage;
