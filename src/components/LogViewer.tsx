import { useState } from "react";
import type { DailyLog } from "../types/dailyLogs.ts";

interface LogViewerProps {
  logs: DailyLog[];
}

function LogViewer({ logs }: LogViewerProps) {
  // Get unique dates from logs
  const availableDates = Array.from(
    new Set(
      logs.map((log) => new Date(log.log_date).toISOString().split("T")[0])
    )
  ).sort((a, b) => (a < b ? 1 : -1)); // Sort newest first

  const [selectedDate, setSelectedDate] = useState<string>(
    availableDates[0] || new Date().toISOString().split("T")[0]
  );

  // Filter logs by selected date
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.log_date).toISOString().split("T")[0];
    return logDate === selectedDate;
  });
  function renderLogValue(log: DailyLog) {
    if (log.value_text !== null && log.value_text !== undefined) {
      return log.value_text;
    }
    if (log.value_boolean !== null && log.value_boolean !== undefined) {
      return log.value_boolean ? "Yes" : "No";
    }
    if (log.value_decimal !== null && log.value_decimal !== undefined) {
      return log.value_decimal.toString();
    }
    if (log.value_int !== null && log.value_int !== undefined) {
      return log.value_int.toString();
    }
    return "—"; // fallback if none set
  }

  return (
    <div>
      <h2>Daily Logs</h2>
      <div className="mb-3">
        <label htmlFor="date-filter" className="form-label">
          Select Date:
        </label>
        <select
          id="date-filter"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="form-select"
        >
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {(() => {
                const [y, m, d] = date.split("-").map(Number);
                const displayDate = new Date(y, m - 1, d);
                return displayDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "2-digit",
                });
              })()}
            </option>
          ))}
        </select>
      </div>
      {filteredLogs.length > 0 ? (
        <div className="mb-4">
          <h3 style={{ textDecoration: "underline" }}>
            {(() => {
              const [y, m, d] = selectedDate.split("-").map(Number);
              const displayDate = new Date(y, m - 1, d);
              return displayDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "2-digit",
              });
            })()}
          </h3>
          {filteredLogs.map((log) => (
            <div key={log.id} className="pl-4 mb-3">
              <h4>{log.metric.name}</h4>
              {renderLogValue(log)}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">No logs found for {selectedDate}</p>
      )}
    </div>
  );
}

export default LogViewer;
