import { useState, useEffect } from "react";
import { getActiveMetrics } from "../services/metrics";
import { saveDailyLog, getDailyLogs } from "../services/dailyLogs";
import type { Metric } from "../types/Metrics.ts"
import type { DailyLog } from "../types/dailyLogs.ts"
import { useDebounce } from "../hooks/useDebounce";
import { fakeUserSettings } from "../fakeUserSettings";

function HomePage() {
  const [activeMetrics, setActiveMetrics] = useState<Metric[]>([]);
  const [logValues, setLogValues] = useState<Record<number, string>>({});
  const [logs, setLogs] = useState<DailyLog[]>([])

  const debouncedValues = useDebounce(logValues, 1000);
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0"),
  ].join("-")
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

  async function handleSave(log: Omit<DailyLog, "id" | "created_at">) {
    try {
      await saveDailyLog(log);
      const freshLogs = await getDailyLogs(today);
      setLogs(freshLogs);
    } catch (err) {
      console.error("Error saving log:", err)
    }
  }
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getDailyLogs();
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch daily logs:", err);
      }
    };

    fetchLogs();
  }, []);

  //fetch todays logs to prefill inputs
//NEED TO SEPERATE ENDPOINTS
useEffect(() => {
  const fetchTodayLogs = async () => {
    try {
      const data = await getDailyLogs(today); 
      const values: Record<number, string> = {};

      data.forEach(log => {
        if (log.value_text !== null) values[log.metric_id] = log.value_text;
        if (log.value_int !== null) values[log.metric_id] = log.value_int.toString();
        if (log.value_decimal !== null) values[log.metric_id] = log.value_decimal.toString();
        if (log.value_boolean !== null) values[log.metric_id] = log.value_boolean ? "true" : "false";
      });

      setLogValues(values);  
    } catch (err) {
      console.error("Failed to fetch today's logs:", err);
    }
  };

  fetchTodayLogs();
}, [today]);



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


        await handleSave(payload);
        console.log(`Saved log for metric ${metric.name}:`, rawValue)
      }
    };
    saveLogs();
  }, [debouncedValues, activeMetrics]);

  return (
    <div className="container d-flex flex-column align-items-center">
      <h1>Habit Tracker</h1>
      {fakeUserSettings.homePageLayout.map((section) => (
        <div key={section.section} className="mb-4 w-100">
          <h2>{section.section}</h2>
          {section.metricIds.map((metricId) => {
            const metric = activeMetrics.find((m) => m.id === metricId);
            if (!metric) return null;

            const hasLogToday = logs.some(
            (log) => log.metric_id === metric.id && new Date(log.log_date).toISOString().split("T")[0] === today);

            if (!metric) return null;

            return (
              <div key={metric.id} className="mb-3">
                <label className="form-label">{metric.name} {hasLogToday && <span className="badge bg-success ms-2">Today</span>}</label>
                {metric.data_type === "boolean" ? (
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        id={`metric-${metric.id}-yes`}
                        name={`metric-${metric.id}`}
                        value="true"
                        checked={logValues[metric.id] === "true"}
                        onChange={(e) =>
                          setLogValues({
                            ...logValues,
                            [metric.id]: e.target.value,
                          })
                        }
                        className={"form-check-input"}
                      />
                      <label htmlFor={`metric-${metric.id}-yes`} className="form-check-label">
                        Yes
                      </label>
                    </div>
                     <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          id={`metric-${metric.id}-no`}
                          name={`metric-${metric.id}`}   // group radios per metric
                          value="false"
                          checked={logValues[metric.id] === "false"}
                          onChange={(e) =>
                            setLogValues({
                              ...logValues,
                              [metric.id]: e.target.value,
                            })
                          }
                          className="form-check-input"
                        />
                        <label htmlFor={`metric-${metric.id}-no`} className="form-check-label">
                          No
                        </label>
                      </div>
                    </div>
                ) : (
                  <input
                    className="form-control"
                    value={logValues[metric.id] ?? ""}
                    onChange={(e) =>
                      setLogValues({
                        ...logValues,
                        [metric.id]: e.target.value,
                      })
                    }
                    placeholder={`Enter ${metric.data_type}`}
                  />

                )}
              </div>
            )
          })}
          </div>
      ))}
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
            <h3>
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
        ))}
      </div>
    </div>
  );
}

export default HomePage;
