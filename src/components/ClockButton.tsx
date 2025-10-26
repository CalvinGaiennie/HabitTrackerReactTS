import { useState, useEffect, useMemo } from "react";
import type { Metric } from "../types/Metrics";
import type { ClockData } from "../types/dailyLogs";

interface ClockButtonProps {
  metric: Metric;
  clockData?: ClockData;
  onClockToggle: (
    metricId: number,
    newState: "clocked_in" | "clocked_out"
  ) => void;
}

function ClockButton({ metric, clockData, onClockToggle }: ClockButtonProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState(0);

  // Ensure clockData has proper structure
  const safeClockData = useMemo(() => {
    return clockData &&
      typeof clockData === "object" &&
      "current_state" in clockData
      ? clockData
      : {
          current_state: "clocked_out" as const,
          sessions: [],
          total_duration_minutes: 0,
          last_updated: null,
        };
  }, [clockData]);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate session duration if clocked in
  useEffect(() => {
    if (
      safeClockData.current_state === "clocked_in" &&
      safeClockData.last_updated
    ) {
      const lastUpdate = new Date(safeClockData.last_updated);
      const duration = Math.floor(
        (currentTime.getTime() - lastUpdate.getTime()) / 1000 / 60
      );
      setSessionDuration(duration);
    } else {
      setSessionDuration(0);
    }
  }, [currentTime, safeClockData]);

  // If clockData is malformed (like raw JSON string), don't render
  if (
    typeof clockData === "string" ||
    (clockData && !clockData.current_state)
  ) {
    console.error(`Invalid clockData for metric ${metric.id}:`, clockData);
    return (
      <div className="alert alert-warning">
        <strong>{metric.name}</strong> - Clock data error. Please refresh the
        page.
      </div>
    );
  }

  const handleClick = () => {
    const newState =
      safeClockData.current_state === "clocked_in"
        ? "clocked_out"
        : "clocked_in";
    console.log(
      `Clock button clicked - current state: ${safeClockData.current_state}, new state: ${newState}`
    );
    onClockToggle(metric.id, newState);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const isClockedIn = safeClockData.current_state === "clocked_in";
  const totalDuration = safeClockData.total_duration_minutes || 0;

  return (
    <div className="clock-button-container mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">
          {metric.name}
          {isClockedIn && (
            <span className="badge bg-success ms-2">Clocked In</span>
          )}
        </label>
        <div className="text-muted small">
          Total Today: {formatDuration(totalDuration)}
        </div>
      </div>

      <button
        className={`btn btn-lg w-100 ${
          isClockedIn ? "btn-warning" : "btn-outline-primary"
        }`}
        onClick={handleClick}
        style={{ minHeight: "60px" }}
      >
        <div className="d-flex flex-column align-items-center">
          <div className="fw-bold">
            {isClockedIn ? "Clock Out" : "Clock In"}
          </div>
          {isClockedIn && sessionDuration > 0 && (
            <div className="small">
              Current Session: {formatDuration(sessionDuration)}
            </div>
          )}
        </div>
      </button>

      {safeClockData.sessions && safeClockData.sessions.length > 0 && (
        <div className="mt-2">
          <small className="text-muted">
            Sessions today: {safeClockData.sessions.length}
          </small>
        </div>
      )}
    </div>
  );
}

export default ClockButton;
