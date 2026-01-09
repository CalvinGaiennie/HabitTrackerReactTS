import { eachDayOfInterval, subDays, format } from "date-fns";
import { useState, useEffect } from "react";
import { getDailyLogs } from "../services/dailyLogs";
import type { DailyLog } from "../types/dailyLogs";
import type { Metric } from "../types/Metrics";
import fetchSettings from "../hooks/fetchSettings";
import type { UserSettings } from "../types/users";
import { useUserId } from "../hooks/useAuth";
import styles from "./CommitTracker.module.css";

interface CommitTrackerProps {
  metrics?: Metric[];
}

function CommitTracker({ metrics = [] }: CommitTrackerProps) {
  type DayStatus = {
    date: Date;
    count: number;
  };
  type Week = DayStatus[];
  
  const today = new Date();
  const startDate = subDays(today, 364);
  const allDays = eachDayOfInterval({ start: startDate, end: today });
  
  const userId = useUserId();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetricIds, setSelectedMetricIds] = useState<Set<number>>(new Set());
  const [settings, setSettings] = useState<UserSettings>();

  // Fetch logs for the past year (365 days)
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const startDateStr = format(startDate, "yyyy-MM-dd");
        // Add 1 day to end date to make it inclusive (matching Swift logic)
        const endDatePlusOne = new Date(today);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
        const endDateStr = format(endDatePlusOne, "yyyy-MM-dd");
        const fetchedLogs = await getDailyLogs(undefined, startDateStr, endDateStr);
        setLogs(fetchedLogs);
      } catch (error) {
        console.error("Failed to fetch logs for commit tracker:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Fetch settings
  useEffect(() => {
    if (userId) {
      fetchSettings((fetchedSettings) => {
        setSettings(fetchedSettings);
      }, userId);
    }
  }, [userId]);

  // Initialize selectedMetricIds with metrics from homePageLayout when metrics are available
  useEffect(() => {
    if (metrics.length > 0 && settings?.homePageLayout && selectedMetricIds.size === 0) {
      // Extract all metricIds from all sections in homePageLayout
      const homepageMetricIds = new Set<number>();
      settings.homePageLayout.forEach((section) => {
        section.metricIds.forEach((metricId) => {
          // Only add if the metric exists
          if (metrics.some(m => m.id === metricId)) {
            homepageMetricIds.add(metricId);
          }
        });
      });
      
      if (homepageMetricIds.size > 0) {
        setSelectedMetricIds(homepageMetricIds);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics, settings]);

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

  // Count logs per day (only for selected metrics)
  const getLogCountForDate = (date: Date): number => {
    const dateStr = format(date, "yyyy-MM-dd");
    return logs.filter(log => 
      log.log_date === dateStr && 
      (selectedMetricIds.size === 0 || selectedMetricIds.has(log.metric_id))
    ).length;
  };

  // Build data array from actual logs
  const data: { date: string; count: number }[] = allDays.map(day => ({
    date: format(day, "yyyy-MM-dd"),
    count: getLogCountForDate(day)
  }));

  const weeks: Week[] = [];
  let week: DayStatus[] = [];

  const getColor = (count: number): string => {
    if (count === 0) return "#ebedf0";
    if (count < 3) return "#9be9a8";
    if (count < 6) return "#40c463";
    if (count < 9) return "#30a14e";
    return "#216e39";
  };

  allDays.forEach((day, index) => {
    // Use the data array directly since it's built in the same order as allDays
    const count = data[index]?.count || 0;

    week.push({ date: day, count });

    if (week.length === 7 || index === allDays.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  // Calculate month labels
  const monthLabels: { month: string; weekSpan: number }[] = [];
  let currentMonth = "";
  let weekCount = 0;

  weeks.forEach((week, index) => {
    const weekStartDate = week[0].date;
    const month = format(weekStartDate, "MMM"); // e.g., "Jan", "Feb"

    if (month !== currentMonth) {
      if (currentMonth !== "") {
        monthLabels.push({ month: currentMonth, weekSpan: weekCount });
        weekCount = 0;
      }
      currentMonth = month;
    }
    weekCount += 1;

    // Handle the last week
    if (index === weeks.length - 1) {
      monthLabels.push({ month: currentMonth, weekSpan: weekCount });
    }
  });

  if (loading) {
    return (
      <div className="card shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
        <div className="card-body p-4 text-center">
          <p>Loading commit tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
      <div className="card-body p-4">
        <h5 className="text-center mb-3 fw-semibold">Commit Tracker</h5>
        
        {/* Metric Selection */}
        {metrics.length > 0 && (
          <div className="mb-4 p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <h6 className="mb-2 fw-semibold" style={{ fontSize: "0.875rem" }}>Select Metrics:</h6>
            <div className="d-flex flex-wrap gap-3">
              {metrics.map((metric) => {
                const isSelected = selectedMetricIds.has(metric.id);
                return (
                  <div
                    key={metric.id}
                    className="d-flex align-items-center"
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
                      style={{ marginRight: "6px", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.875rem" }}>{metric.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Month Labels */}
        <div className={styles.monthLabels}>
          {monthLabels.map((label, i) => (
            <div
              key={i}
              className={styles.monthLabel}
              style={{ flex: `0 0 ${label.weekSpan * (12 + 4)}px` }} // 12px square + 4px gap
            >
              {label.month}
            </div>
          ))}
        </div>
        <div style={{ display: "flex" }}>
          {/* Day-of-Week Labels */}
          <div className={styles.dayLabels}>
            <div style={{ height: "12px" }}></div> {/* Spacer for alignment */}
            <div style={{ height: "12px" }}>Mon</div>
            <div style={{ height: "12px" }}></div>
            <div style={{ height: "12px" }}>Wed</div>
            <div style={{ height: "12px" }}></div>
            <div style={{ height: "12px" }}>Fri</div>
            <div style={{ height: "12px" }}></div>
          </div>
          {/* Grid */}
          <div className={styles.grid}>
            {weeks.map((week, i) => (
              <div className={styles.week} key={i}>
                {week.map((day, j) => (
                  <div
                    key={j}
                    className={styles.day}
                    style={{ backgroundColor: getColor(day.count) }}
                    title={`${format(day.date, "MMM d, yyyy")}: ${day.count} log${day.count !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div className="d-flex justify-content-center gap-4 mt-3" style={{ fontSize: "0.875rem" }}>
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: "12px", height: "12px", backgroundColor: "#ebedf0", borderRadius: "2px" }}></div>
            <span className="text-muted">Less</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: "12px", height: "12px", backgroundColor: "#9be9a8", borderRadius: "2px" }}></div>
            <div style={{ width: "12px", height: "12px", backgroundColor: "#40c463", borderRadius: "2px" }}></div>
            <div style={{ width: "12px", height: "12px", backgroundColor: "#30a14e", borderRadius: "2px" }}></div>
            <div style={{ width: "12px", height: "12px", backgroundColor: "#216e39", borderRadius: "2px" }}></div>
            <span className="text-muted">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CommitTracker;
