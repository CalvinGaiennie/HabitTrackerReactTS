import React, { useState, useEffect, useMemo } from "react";
import type { Metric } from "../types/Metrics";
import type { DailyLog } from "../types/dailyLogs";
import { getDailyLogs } from "../services/dailyLogs";
import "./Calendar.css";

interface CalendarProps {
  year?: number;
  month?: number; // 0-11 (0 = January, 11 = December)
  metrics?: Metric[];
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
  metrics = [],
  className = "",
}) => {
  // console.log("Calendar component rendering with:", { year, month, metricsLength: metrics.length });
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [currentYear, setCurrentYear] = useState(year);
  const [currentMonth, setCurrentMonth] = useState(month);

  // Navigation functions
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Fetch logs for the current month
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Fetch logs for a wider range to include previous and next month days
        const startDate = new Date(currentYear, currentMonth - 1, 1); // Previous month
        const endDate = new Date(currentYear, currentMonth + 2, 0); // Next month
        const logsData = await getDailyLogs();

        // Filter logs for the expanded range
        const monthLogs = logsData.filter((log) => {
          const [yearStr, monthStr, dayStr] = log.log_date.split("-");
          const logDate = new Date(
            parseInt(yearStr),
            parseInt(monthStr) - 1,
            parseInt(dayStr)
          );
          return logDate >= startDate && logDate <= endDate;
        });

        setLogs(monthLogs);
        // console.log("=== CALENDAR DEBUG ===");
        // console.log("Year:", year, "Month:", month);
        // console.log("Start date:", startDate);
        // console.log("End date:", endDate);
        // console.log("All logs for month:", monthLogs.length);
        // console.log("Metrics prop:", metrics?.length || 0);

        // Debug: Show sample log structure
        // if (monthLogs.length > 0) {
        //   console.log("Sample log structure:", monthLogs[0]);
        //   console.log("Sample log metric:", monthLogs[0]?.metric);
        //   console.log(
        //     "All metric data types:",
        //     monthLogs.map((log) => ({
        //       id: log.id,
        //       metricName: log.metric.name,
        //       dataType: log.metric.data_type,
        //       booleanValue: log.boolean_value,
        //       numericValue: log.numeric_value,
        //       textValue: log.text_value,
        //     }))
        //   );
        // }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    fetchLogs();
  }, [currentYear, currentMonth, JSON.stringify(metrics)]);

  // Get logs for a specific day
  const getLogsForDay = (
    day: number,
    targetMonth?: number,
    targetYear?: number
  ) => {
    const actualMonth = targetMonth !== undefined ? targetMonth : currentMonth;
    const actualYear = targetYear !== undefined ? targetYear : currentYear;

    // Debug: Check if logs are available
    // if (day <= 3) {
    //   console.log(`getLogsForDay called for day ${day}, logs.length: ${logs.length}`);
    // }

    const filteredLogs = logs.filter((log) => {
      // Parse date as local date to avoid timezone issues
      const [yearStr, monthStr, dayStr] = log.log_date.split("-");
      const logDate = new Date(
        parseInt(yearStr),
        parseInt(monthStr) - 1,
        parseInt(dayStr)
      );
      const matches =
        logDate.getDate() === day &&
        logDate.getMonth() === actualMonth &&
        logDate.getFullYear() === actualYear;

      // Debug for first few days
      // if (day <= 3) {
      //   console.log(`Checking ${actualYear}-${actualMonth + 1}-${day}:`, {
      //     logDate: log.log_date,
      //     parsedDate: logDate,
      //     targetDate: targetDate,
      //     dayMatch: logDate.getDate() === day,
      //     monthMatch: logDate.getMonth() === actualMonth,
      //     yearMatch: logDate.getFullYear() === actualYear,
      //     matches,
      //   });
      // }

      return matches;
    });

    return filteredLogs;
  };

  // Get the first day of the month and how many days it has
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Get the number of days in the previous month for padding
  const daysInPreviousMonth = new Date(currentYear, currentMonth, 0).getDate();

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

  // Colors for metrics
  const metricColors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#8DD1E1",
    "#FF6B6B",
    "#4ECDC4",
  ];

  // Get boolean metrics for legend - check if any logs have value_boolean
  const booleanMetrics = useMemo(() => {
    // console.log("Calculating boolean metrics:", { logsLength: logs.length, metricsLength: metrics.length });
    if (logs.length > 0 && metrics.length > 0) {
      const result = metrics.filter((metric) => {
        // Check if this metric has any logs with value_boolean
        return logs.some(
          (log) => log.metric_id === metric.id && log.value_boolean !== null
        );
      });
      // console.log("Boolean metrics result:", result.length);
      return result;
    }
    return [];
  }, [logs, metrics]);

  // Assign colors to metrics
  const metricsWithColors = booleanMetrics.map((metric, index) => ({
    ...metric,
    color: metricColors[index % metricColors.length],
  }));

  // Get color for a metric
  const getMetricColor = (metricId: number) => {
    const metric = metricsWithColors.find((m) => m.id === metricId);
    return metric?.color || "#000000";
  };

  // Generate calendar grid
  const calendarDays: Array<{
    day: number;
    isCurrentMonth: boolean;
    isPreviousMonth: boolean;
    month: number;
    year: number;
  }> = [];

  // Add previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPreviousMonth - i,
      isCurrentMonth: false,
      isPreviousMonth: true,
      month: currentMonth === 0 ? 11 : currentMonth - 1,
      year: currentMonth === 0 ? currentYear - 1 : currentYear,
    });
  }

  // Add current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isPreviousMonth: false,
      month: currentMonth,
      year: currentYear,
    });
  }

  // Add next month days to fill remaining cells (35 total for 5 weeks)
  const remainingCells = 35 - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isPreviousMonth: false,
      month: currentMonth === 11 ? 0 : currentMonth + 1,
      year: currentMonth === 11 ? currentYear + 1 : currentYear,
    });
  }

  return (
    <div className={`calendar-with-legend ${className}`}>
      {/* Header with month and year */}
      <div className="calendar-header text-center mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={goToPreviousMonth}
            title="Previous month"
          >
            ←
          </button>
          <h4 className="mb-0">
            {monthNames[currentMonth]} {currentYear}
          </h4>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={goToNextMonth}
            title="Next month"
          >
            →
          </button>
        </div>
        <div className="mt-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={goToToday}
            title="Go to current month"
          >
            Today
          </button>
        </div>
      </div>

      {/* Content container for legend and calendar */}
      <div className="calendar-content">
        {/* Legend */}
        <div className="calendar-legend">
          <h5 className="legend-title">Metrics</h5>
          <div className="legend-items">
            {metricsWithColors.map((metric) => (
              <div key={metric.id} className="legend-item">
                <div
                  className="legend-dot"
                  style={{ backgroundColor: metric.color }}
                ></div>
                <span className="legend-label">{metric.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="calendar">
          {/* Calendar grid */}
          <div className="calendar-grid">
            {/* Day names header */}
            <div className="calendar-weekdays d-flex">
              {dayNames.map((dayName) => (
                <div
                  key={dayName}
                  className="calendar-weekday text-center fw-bold"
                >
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

                    // Get logs for any visible day (current month, previous month, or next month)
                    let dayLogs = [];
                    if (dayData.isCurrentMonth) {
                      dayLogs = getLogsForDay(dayData.day);
                    } else if (dayData.isPreviousMonth) {
                      // For previous month days, check the previous month
                      const prevMonth = dayData.month;
                      const prevYear = dayData.year;
                      dayLogs = logs.filter((log) => {
                        const [yearStr, monthStr, dayStr] =
                          log.log_date.split("-");
                        const logDate = new Date(
                          parseInt(yearStr),
                          parseInt(monthStr) - 1,
                          parseInt(dayStr)
                        );
                        return (
                          logDate.getDate() === dayData.day &&
                          logDate.getMonth() === prevMonth &&
                          logDate.getFullYear() === prevYear
                        );
                      });
                    } else {
                      // For next month days, check the next month
                      const nextMonth = dayData.month;
                      const nextYear = dayData.year;
                      dayLogs = logs.filter((log) => {
                        const [yearStr, monthStr, dayStr] =
                          log.log_date.split("-");
                        const logDate = new Date(
                          parseInt(yearStr),
                          parseInt(monthStr) - 1,
                          parseInt(dayStr)
                        );
                        return (
                          logDate.getDate() === dayData.day &&
                          logDate.getMonth() === nextMonth &&
                          logDate.getFullYear() === nextYear
                        );
                      });
                    }

                    // Get boolean logs with "yes" responses
                    const yesLogs = dayLogs.filter(
                      (log) => log.value_boolean === true
                    );

                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`calendar-day ${
                          dayData.isCurrentMonth
                            ? "calendar-day-current"
                            : "calendar-day-previous"
                        }`}
                      >
                        <div className="calendar-day-number">{dayData.day}</div>
                        {yesLogs.length > 0 && (
                          <div className="calendar-day-indicators">
                            {yesLogs.map((log, logIndex) => (
                              <div
                                key={logIndex}
                                className="calendar-day-indicator"
                                style={{
                                  backgroundColor: getMetricColor(
                                    log.metric_id
                                  ),
                                }}
                              ></div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
