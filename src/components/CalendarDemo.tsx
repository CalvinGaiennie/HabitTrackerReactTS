import React, { useState } from "react";
import Calendar from "./Calendar";

const CalendarDemo: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={goToPreviousMonth}
                >
                  ← Previous
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={goToToday}
                >
                  Today
                </button>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={goToNextMonth}
                >
                  Next →
                </button>
              </div>
            </div>
            <div className="card-body">
              <Calendar year={currentYear} month={currentMonth} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarDemo;
