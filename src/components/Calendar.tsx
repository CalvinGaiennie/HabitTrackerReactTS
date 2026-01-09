import { useState, useEffect, useMemo } from "react";
import type { Metric } from "../types/Metrics";
import "./Calendar.css";
import CalendarMonth from "./CalendarMonth";
import type { DailyLog } from "../types/dailyLogs";
import { getDailyLogs } from "../services/dailyLogs";
import fetchSettings from "../hooks/fetchSettings";
import type { UserSettings } from "../types/users";
import { useUserId } from "../hooks/useAuth";

interface CalendarProps {
  year?: number;
  month?: number; // 0-11 (0 = January, 11 = December)
  metrics?: Metric[];
  className?: string;
}

function Calendar({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
  metrics = [],
  className = "",
}: CalendarProps) {
  const userId = useUserId();
  const [currentYear, setCurrentYear] = useState(year);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [allLogs, setAllLogs] = useState<DailyLog[]>([]);
  const [selectedMetricIds, setSelectedMetricIds] = useState<Set<number>>(new Set());
  const [settings, setSettings] = useState<UserSettings>();

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

  // const goToToday = () => {
  //   const today = new Date();
  //   setCurrentYear(today.getFullYear());
  //   setCurrentMonth(today.getMonth());
  // };

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

  // Get boolean and clock metrics for legend
  const booleanMetrics = useMemo(() => {
    if (allLogs.length > 0 && metrics.length > 0) {
      const result = metrics.filter((metric) => {
        // Check if this metric has any logs with value_boolean or clock data
        return allLogs.some((log) => {
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
  }, [allLogs, metrics]);

  // Assign colors to metrics
  const metricsWithColors = booleanMetrics.map((metric, index) => ({
    ...metric,
    color: metricColors[index % metricColors.length],
  }));

  // Fetch settings
  useEffect(() => {
    if (userId) {
      fetchSettings((fetchedSettings) => {
        setSettings(fetchedSettings);
      }, userId);
    }
  }, [userId]);

  // Initialize selectedMetricIds with metrics from homePageLayout when booleanMetrics are available
  useEffect(() => {
    if (booleanMetrics.length > 0 && settings?.homePageLayout && selectedMetricIds.size === 0) {
      // Extract all metricIds from all sections in homePageLayout
      const homepageMetricIds = new Set<number>();
      settings.homePageLayout.forEach((section) => {
        section.metricIds.forEach((metricId) => {
          // Only add if it's a boolean metric that exists
          if (booleanMetrics.some(m => m.id === metricId)) {
            homepageMetricIds.add(metricId);
          }
        });
      });
      
      if (homepageMetricIds.size > 0) {
        setSelectedMetricIds(homepageMetricIds);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booleanMetrics, settings]);

  // Toggle metric selection
  const toggleMetricSelection = (metricId: number) => {
    setSelectedMetricIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(metricId)) {
        newSet.delete(metricId);
      } else {
        newSet.add(metricId);
      }
      return newSet;
    });
  };

  // Filter metrics to only include selected ones
  const selectedMetrics = useMemo(() => {
    return metrics.filter(m => selectedMetricIds.has(m.id));
  }, [metrics, selectedMetricIds]);

  const deriveInitials = (name: string): string => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";
    return (first + second).toUpperCase();
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

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const allNewLogs = await getDailyLogs();
        setAllLogs(allNewLogs);
      } catch (error) {
        console.error("Failed to fetch logs.", error);
      }
    };
    fetchLogs();
  }, []);


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
      </div>

      {/* Content container for legend and calendar */}
      <div className="calendar-content">
        {/* Legend */}
        <div className="calendar-legend">
          <h5 className="legend-title">Metrics</h5>
          <div className="legend-items">
            {metricsWithColors.map((metric) => {
              const isSelected = selectedMetricIds.has(metric.id);
              return (
                <div 
                  key={metric.id} 
                  className="legend-item"
                  style={{ 
                    cursor: "pointer",
                    opacity: isSelected ? 1 : 0.5,
                    userSelect: "none"
                  }}
                  onClick={() => toggleMetricSelection(metric.id)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleMetricSelection(metric.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ marginRight: "8px", cursor: "pointer" }}
                  />
                  <div
                    className="legend-dot"
                    style={{ backgroundColor: metric.color }}
                  ></div>
                  <span className="legend-label">
                    {metric.name}({(metric.initials ?? deriveInitials(metric.name)).toUpperCase()})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <CalendarMonth
          year={currentYear}
          month={currentMonth}
          metrics={selectedMetrics}
        />
      </div>
    </div>
  );
}

export default Calendar;
