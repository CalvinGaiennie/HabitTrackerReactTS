import { useState, useEffect, useMemo } from "react";
import type { Metric } from "../types/Metrics";
import type { DailyLog } from "../types/dailyLogs";
import { getDailyLogs } from "../services/dailyLogs";
import { format } from "date-fns";
import "./Calendar.css";
// from "./CalendarMonth";

interface CalendarMonthProps {
  year?: number;
  month?: number; // 0-11 (0 = January, 11 = December)
  metrics?: Metric[];
  className?: string;
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

function CalendarMonth({ year = new Date().getFullYear(), month = new Date().getMonth(), metrics }: CalendarMonthProps) {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [tooltipState, setTooltipState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
  }>({ visible: false, x: 0, y: 0, content: null });
  const currentYear = year;
  const currentMonth = month;
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
    if (logs.length > 0 && metrics && metrics.length > 0) {
      const result = metrics.filter((metric) => {
        // Check if this metric has any logs with value_boolean or clock data
        return logs.some((log) => {
          if (log.metric_id === metric.id) {
            // Boolean metrics
            if (log.value_boolean !== null) {
              return true;
            }
            // Clock metrics - check if value_text contains clock data
            if (metric.data_type === "clock" && log.value_text) {
              try {
                const clockData = JSON.parse(log.value_text);
                // Show if there are clock sessions or if currently clocked in
                return (
                  (clockData.sessions && clockData.sessions.length > 0) ||
                  clockData.current_state === "clocked_in" ||
                  (clockData.total_duration_minutes && clockData.total_duration_minutes > 0)
                );
              } catch {
                return false;
              }
            }
          }
          return false;
        });
      });
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
        const startDate = new Date(year, month - 1, 1); // Previous month
        const endDate = new Date(year, month + 2, 0); // Next month
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
  }, [year, month, metrics]);

  return (
    <div className="calendar">
      {/* Calendar grid */}
      <h4 className="mb-3 text-center">{monthNames[currentMonth]}</h4>
      {tooltipState.visible && (
        <div
          className="calendar-day-tooltip"
          style={{
            left: `${tooltipState.x}px`,
            top: `${tooltipState.y}px`,
            transform: tooltipState.y < 200 ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
          }}
        >
          {tooltipState.content}
        </div>
      )}
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

                // Get boolean logs with "yes" responses and clock logs with sessions, filtered to only selected metrics
                const yesLogs = dayLogs.filter((log) => {
                  if (!metrics?.some(m => m.id === log.metric_id)) {
                    return false;
                  }
                  // Boolean metrics - show if value is true
                  if (log.value_boolean === true) {
                    return true;
                  }
                  // Clock metrics - show if there are clock sessions
                  const metric = metrics.find(m => m.id === log.metric_id);
                  if (metric?.data_type === "clock" && log.value_text) {
                    try {
                      const clockData = JSON.parse(log.value_text);
                      return (
                        (clockData.sessions && clockData.sessions.length > 0) ||
                        clockData.current_state === "clocked_in" ||
                        (clockData.total_duration_minutes && clockData.total_duration_minutes > 0)
                      );
                    } catch {
                      return false;
                    }
                  }
                  return false;
                });

                // Get all logs for the day (for tooltip) - filtered to selected metrics
                const allDayLogs = dayLogs.filter(
                  (log) => metrics?.some(m => m.id === log.metric_id)
                );

                // Format log value for display
                const formatLogValue = (log: DailyLog): string => {
                  const metric = metrics?.find(m => m.id === log.metric_id);
                  
                  // Clock metrics - parse JSON and format
                  if (metric?.data_type === "clock" && log.value_text) {
                    try {
                      const clockData = JSON.parse(log.value_text);
                      if (clockData.total_duration_minutes > 0) {
                        const hours = Math.floor(clockData.total_duration_minutes / 60);
                        const minutes = clockData.total_duration_minutes % 60;
                        if (hours > 0) {
                          return `${hours}h ${minutes}m`;
                        }
                        return `${minutes}m`;
                      }
                      if (clockData.current_state === "clocked_in") {
                        return "Clocked in";
                      }
                      if (clockData.sessions && clockData.sessions.length > 0) {
                        return `${clockData.sessions.length} session(s)`;
                      }
                      return "No time logged";
                    } catch {
                      return log.value_text;
                    }
                  }
                  
                  if (log.value_boolean !== null) {
                    return log.value_boolean ? "Yes" : "No";
                  }
                  if (log.value_int !== null) {
                    return log.value_int.toString();
                  }
                  if (log.value_decimal !== null) {
                    return log.value_decimal.toString();
                  }
                  if (log.value_text !== null && log.value_text !== "") {
                    return log.value_text;
                  }
                  return "—";
                };

                // Build tooltip content
                const tooltipDate = new Date(dayData.year, dayData.month, dayData.day);
                const tooltipContent = allDayLogs.length > 0 ? (
                  <div className="calendar-day-tooltip-content">
                    <div className="tooltip-header">
                      {format(tooltipDate, "MMMM d, yyyy")}
                    </div>
                    <div className="tooltip-logs">
                      {allDayLogs.map((log, logIdx) => (
                        <div key={logIdx} className="tooltip-log-item">
                          <div className="tooltip-log-metric">
                            <span
                              className="tooltip-log-dot"
                              style={{ backgroundColor: getMetricColor(log.metric_id) }}
                            ></span>
                            <strong>{log.metric.name}</strong>
                          </div>
                          <div className="tooltip-log-value">{formatLogValue(log)}</div>
                          {log.note && log.note.trim() !== "" && (
                            <div className="tooltip-log-note">{log.note}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

                const calculateTooltipPosition = (rect: DOMRect) => {
                  const tooltipWidth = 250; // Approximate tooltip width
                  const tooltipHeight = 200; // Approximate tooltip height
                  const padding = 8;
                  
                  let tooltipX = rect.left + rect.width / 2;
                  let tooltipY = rect.top - padding;
                  
                  // Adjust if tooltip would go off the right edge
                  if (tooltipX + tooltipWidth / 2 > window.innerWidth) {
                    tooltipX = window.innerWidth - tooltipWidth / 2 - padding;
                  }
                  
                  // Adjust if tooltip would go off the left edge
                  if (tooltipX - tooltipWidth / 2 < padding) {
                    tooltipX = tooltipWidth / 2 + padding;
                  }
                  
                  // Adjust if tooltip would go off the top edge (show below instead)
                  if (tooltipY - tooltipHeight < padding) {
                    tooltipY = rect.bottom + padding;
                  }
                  
                  return { x: tooltipX, y: tooltipY };
                };

                const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
                  if (allDayLogs.length > 0 && tooltipContent) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const { x: tooltipX, y: tooltipY } = calculateTooltipPosition(rect);
                    setTooltipState({
                      visible: true,
                      x: tooltipX,
                      y: tooltipY,
                      content: tooltipContent,
                    });
                  }
                };

                const handleMouseLeave = () => {
                  setTooltipState({ visible: false, x: 0, y: 0, content: null });
                };

                const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                  if (allDayLogs.length > 0 && tooltipState.visible) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const { x: tooltipX, y: tooltipY } = calculateTooltipPosition(rect);
                    setTooltipState(prev => ({
                      ...prev,
                      x: tooltipX,
                      y: tooltipY,
                    }));
                  }
                };

                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`calendar-day ${
                      dayData.isCurrentMonth
                        ? "calendar-day-current"
                        : "calendar-day-previous"
                    } ${allDayLogs.length > 0 ? "calendar-day-has-logs" : ""}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
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
                              {(log.metric.initials ?? (log.metric.name?.slice(0,1) || "")).toUpperCase()}
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
