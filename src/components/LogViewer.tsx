import type { DailyLog } from "../types/dailyLogs.ts"

interface LogViewerProps {
    logs: DailyLog[]
}

function LogViewer({logs }: LogViewerProps) {
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
            {Object.entries(
                  logs.reduce((groups, log) => { 
                    const day = new Date(log.log_date).toISOString().split("T")[0];
                    if (!groups[day]) groups[day] = [];
                    groups[day].push(log);
                    return groups;
                  }, {} as Record<string, DailyLog[]>)
                ).sort(([a], [b]) => (a < b ? 1 : -1))
                 .map(([day, dayLogs]) => (
        
                  <div key={day} className="mb-4">
                    <h3 style={{ textDecoration: "underline" }}>
                      {(() => {
                        const [y, m, d] = day.split("-").map(Number);
                        const displayDate = new Date(y, m - 1, d); // local midnight, no UTC shift
                        return displayDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                          year: "2-digit",
                        });
                      })()}
                    </h3>
                    {dayLogs.map((log) => (
                      <div key={log.id} className="pl-4 mb-3">
                        <h4>{log.metric.name}</h4>
                        {renderLogValue(log)}
                        </div>
                    ))}
                    </div>
                ))}</div>
    )
}

export default LogViewer