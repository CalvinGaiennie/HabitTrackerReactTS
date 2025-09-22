import { useState, useEffect } from "react";
import { getActiveMetrics } from "../services/metrics";
import { saveDailyLog, getDailyLogs } from "../services/dailyLogs";
import type { Metric } from "../types/Metrics.ts"
import type { DailyLog } from "../types/dailyLogs.ts"
import { useDebounce } from "../hooks/useDebounce";

function HomePage() {
  const [activeMetrics, setActiveMetrics] = useState<Metric[]>([]);
  const [logValues, setLogValues] = useState<Record<number, string>>({});
  const [logs, setLogs] = useState<DailyLog[]>([])

  const debouncedValues = useDebounce(logValues, 1000);
  const today = new Date().toISOString().split("T")[0];

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

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const data = await getDailyLogs(today);
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch daily logs:", err);
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metrics = await getActiveMetrics();
        setActiveMetrics(metrics); 
      } catch (err) {
        console.error("Failed to fetch active metrics:", err)
      }
    };

  fetchMetrics();
  }, [])

  useEffect(() => {
    const saveLogs = async () => {
      for (const [metricId, rawValue] of Object.entries(debouncedValues)) {
        const metric = activeMetrics.find((m) => m.id === Number(metricId));
        if ( !metric || rawValue === "") continue;

        const payload: any = {
          user_id: 1,
          metric_id: Number(metricId),
          log_date: today,
        }

        switch (metric.data_type) {
          case "int":
            payload.value_int = parseInt(rawValue, 10);
            break;
          case "decimal":
          case "scale":
            payload.value_decimal = parseFloat(rawValue);
            break;
          case "boolean":
            payload.value_boolean =
             rawValue.toLowerCase() === "true" || rawValue === "1";
             break;
          case "text":
            payload.value_text = rawValue;
            break;
        }

        try {
          await saveDailyLog(payload);
          console.log(`Saved log for metric ${metric.name}:`, rawValue);
        } catch (err) {
          console.error(`Failed to save log for metric ${metricId}:`, err);
          }
        }
    };
    saveLogs();
  }, [debouncedValues, activeMetrics]);

  return (
    <div className="container d-flex flex-column align-items-center">
      <h1>Habit Tracker</h1>
      <div>
        {activeMetrics.map((metric) => (
        <div key={metric.id} className="mb-3">
          <label className="form-label">{metric.name}</label>
          {metric.data_type === "boolean" ? (
            <input
              type="checkbox"
              checked={logValues[metric.id] === "true"}
              onChange={(e) =>
                setLogValues({ ...logValues, [metric.id]: e.target.checked.toString() })
              }
          />
          ) : (

            <input
            className="form-control"
            value={logValues[metric.id] ?? ""}
            onChange={(e) =>
              setLogValues({ ...logValues, [metric.id]: e.target.value})
            }
            placeholder={`Enter ${metric.data_type}`}
            />
          )}
          </div>
        ))}
      </div>
      <div>
        <h2>Daily Logs</h2>
        {Object.entries(
          logs.reduce((groups, log) => { 
            const day = new Date(log.log_date).toISOString().split("T")[0];
            if (!groups[day]) groups[day] = [];
            groups[day].push(log);
            return groups;
          }, {} as Record<string, typeof logs>)
        ).map(([day, dayLogs]) => (
          <div key={day} className="mb-4">
            <h3>
              {
                new Date(day).toLocaleDateString("en-US", {
                weekday: "long",   // Sunday
                month: "short",    // Sep
                day: "numeric",    // 21
                year: "2-digit",   // 25
              })}
          </h3>
            {dayLogs.map((log) => (
              <div key={log.id} className="pl-4 mb-3">
                <h4>{log.metric.name}</h4>
                {renderLogValue(log)}
                </div>
            ))}
            </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
