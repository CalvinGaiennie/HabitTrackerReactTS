import { useState, useEffect, useMemo } from "react";
import type { Metric } from "../types/Metrics";
import type { DailyLog } from "../types/dailyLogs";
import { getDailyLogs } from "../services/dailyLogs";
import "./Calendar.css";
// from "./CalendarMonth";

interface CalendarMonthProps {
  year?: number;
  month?: number; // 0-11 (0 = January, 11 = December)
  metrics?: Metric[];
  className?: string;
  numberOfMonths: number;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

function CalendarMonth({ metrics }: CalendarMonthProps) {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  // Get the first day of the month and how many days it has
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Get the number of days in the previous month for padding
  const daysInPreviousMonth = new Date(currentYear, currentMonth, 0).getDate();

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

  const booleanMetrics = useMemo(() => {
    // console.log("Calculating boolean metrics:", { logsLength: logs.length, metricsLength: metrics.length });
    if (logs.length > 0 && metrics && metrics.length > 0) {
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

  const metricsWithColors = booleanMetrics?.map((metric, index) => ({
    ...metric,
    color: metricColors[index % metricColors.length],
  }));

  const getMetricColor = (metricId: number) => {
    const metric = metricsWithColors?.find((m) => m.id === metricId);
    return metric?.color || "#000000";
  };

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
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    fetchLogs();
  }, [currentYear, currentMonth, metrics]);

  return (
    <div className="calendar">
      {/* Calendar grid */}
      <h4 className="mb-3 text-center">{monthNames[currentMonth]}</h4>
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

                // Get logs for any visible day (current month, previous month, or next month)
                let dayLogs = [];
                if (dayData.isCurrentMonth) {
                  dayLogs = getLogsForDay(dayData.day);
                } else if (dayData.isPreviousMonth) {
                  // For previous month days, check the previous month
                  const prevMonth = dayData.month;
                  const prevYear = dayData.year;
                  dayLogs = logs.filter((log) => {
                    const [yearStr, monthStr, dayStr] = log.log_date.split("-");
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
                    const [yearStr, monthStr, dayStr] = log.log_date.split("-");
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
                              backgroundColor: getMetricColor(log.metric_id),
                            }}
                          >
                            <p style={{ fontSize: '0.5rem'}}>
                              {log.metric.initials.toUpperCase()}
                            </p>
                          </div>
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
  );
}
export default CalendarMonth;
