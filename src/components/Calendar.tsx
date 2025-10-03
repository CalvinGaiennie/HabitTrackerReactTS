import React from "react";
import "./Calendar.css";

interface CalendarProps {
  year?: number;
  month?: number; // 0-11 (0 = January, 11 = December)
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
  className = "",
}) => {
  // Get the first day of the month and how many days it has
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Get the number of days in the previous month for padding
  const daysInPreviousMonth = new Date(year, month, 0).getDate();

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar grid
  const calendarDays = [];

  // Add previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPreviousMonth - i,
      isCurrentMonth: false,
      isPreviousMonth: true,
    });
  }

  // Add current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isPreviousMonth: false,
    });
  }

  // Add next month days to fill remaining cells (35 total for 5 weeks)
  const remainingCells = 35 - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isPreviousMonth: false,
    });
  }

  return (
    <div className={`calendar ${className}`}>
      {/* Header with month and year */}
      <div className="calendar-header text-center mb-3">
        <h4 className="mb-0">
          {monthNames[month]} {year}
        </h4>
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid">
        {/* Day names header */}
        <div className="calendar-weekdays d-flex">
          {dayNames.map((dayName) => (
            <div key={dayName} className="calendar-weekday text-center fw-bold">
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="calendar-days">
          {Array.from({ length: 5 }, (_, weekIndex) => (
            <div key={weekIndex} className="calendar-week d-flex">
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const dayData = calendarDays[weekIndex * 7 + dayIndex];

                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`calendar-day ${
                      dayData.isCurrentMonth
                        ? "calendar-day-current"
                        : "calendar-day-previous"
                    }`}
                  >
                    {dayData.day}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
