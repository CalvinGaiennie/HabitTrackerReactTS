import { useState, useEffect } from "react";
import { getActiveMetrics } from "../services/metrics";
import { saveDailyLog, getDailyLogs } from "../services/dailyLogs";
import { clockIn, clockOut, getClockStatus } from "../services/clock";
import type { Metric } from "../types/Metrics.ts";
import type { DailyLog } from "../types/dailyLogs.ts";
import type { ClockData } from "../types/dailyLogs";
import { useDebounce } from "../hooks/useDebounce";
import fetchSettings from "../hooks/fetchSettings.ts";
import type { UserSettings } from "../types/users";
import fetchLogs from "../hooks/fetchLogs.ts";
import ClockButton from "../components/ClockButton";

// IMPLEMENT auto no for empty days on booleans as an option
function HomePage() {
  const [activeMetrics, setActiveMetrics] = useState<Metric[]>([]);
  const [logValues, setLogValues] = useState<Record<number, string>>({});
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [settings, setSettings] = useState<UserSettings>();
  const [clockData, setClockData] = useState<Record<number, ClockData>>({});

  const debouncedValues = useDebounce(logValues, 1000);
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  async function handleSave(log: Omit<DailyLog, "id" | "created_at">) {
    try {
      await saveDailyLog(log);
      const freshLogs = await getDailyLogs("1");
      setLogs(freshLogs);
    } catch (err) {
      console.error("Error saving log:", err);
    }
  }

  const handleClockToggle = async (
    metricId: number,
    newState: "clocked_in" | "clocked_out"
  ) => {
    try {
      let updatedClockData: ClockData;
      if (newState === "clocked_in") {
        updatedClockData = await clockIn(metricId);
      } else {
        updatedClockData = await clockOut(metricId);
      }
      setClockData((prev) => ({
        ...prev,
        [metricId]: updatedClockData,
      }));
    } catch (error) {
      console.error("Error toggling clock:", error);
    }
  };

  useEffect(() => {
    fetchSettings((fetchedSettings) => {
      console.log("Settings received in HomePage:", fetchedSettings);
      setSettings(fetchedSettings);
    });
  }, []);

  useEffect(() => {
    fetchLogs(setLogs);
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metrics = await getActiveMetrics();
        setActiveMetrics(metrics);

        // Fetch clock data for clock metrics
        const clockMetrics = metrics.filter((m) => m.data_type === "clock");
        const clockDataPromises = clockMetrics.map(async (metric) => {
          try {
            const data = await getClockStatus(metric.id, today);
            return { metricId: metric.id, data };
          } catch (error) {
            console.error(
              `Failed to fetch clock data for metric ${metric.id}:`,
              error
            );
            // If no clock data exists yet, create a default "clocked_out" state
            return {
              metricId: metric.id,
              data: {
                current_state: "clocked_out" as const,
                sessions: [],
                total_duration_minutes: 0,
                last_updated: new Date().toISOString(),
              },
            };
          }
        });

        const clockResults = await Promise.all(clockDataPromises);
        const clockDataMap: Record<number, ClockData> = {};
        clockResults.forEach(({ metricId, data }) => {
          if (data) {
            clockDataMap[metricId] = data;
          }
        });
        setClockData(clockDataMap);
      } catch (err) {
        console.error("Failed to fetch active metrics:", err);
      }
    };

    fetchMetrics();
  }, [today]);

  // Fetch today's logs after metrics are loaded
  useEffect(() => {
    if (activeMetrics.length === 0) return;

    const fetchTodayLogs = async () => {
      try {
        const data = await getDailyLogs("1", undefined, undefined, today);
        const values: Record<number, string> = {};

        data.forEach((log) => {
          // Find the metric to determine its data type
          const metric = activeMetrics.find((m) => m.id === log.metric_id);
          if (!metric) return;

          // Set value based on metric's data type, not what's in the database
          switch (metric.data_type) {
            case "text":
              if (log.value_text !== null)
                values[log.metric_id] = log.value_text;
              break;
            case "int":
              if (log.value_int !== null)
                values[log.metric_id] = log.value_int.toString();
              break;
            case "decimal":
            case "scale":
              if (log.value_decimal !== null)
                values[log.metric_id] = log.value_decimal.toString();
              break;
            case "boolean":
              if (log.value_boolean !== null)
                values[log.metric_id] = log.value_boolean ? "true" : "false";
              break;
          }
        });

        // Preserve existing user input that hasn't been saved yet
        setLogValues((prevValues) => ({
          ...prevValues,
          ...values,
        }));
      } catch (err) {
        console.error("Failed to fetch today's logs:", err);
      }
    };

    fetchTodayLogs();
  }, [activeMetrics, today]);

  // Listen for log saved events from SpecificAdd component
  useEffect(() => {
    const handleLogSaved = async () => {
      try {
        const data = await getDailyLogs();
        setLogs(data);

        // Also refresh today's logs for the form
        const todayData = await getDailyLogs("1", undefined, undefined, today);
        const values: Record<number, string> = {};
        todayData.forEach((log) => {
          // Find the metric to determine its data type
          const metric = activeMetrics.find((m) => m.id === log.metric_id);
          if (!metric) return;

          // Set value based on metric's data type, not what's in the database
          switch (metric.data_type) {
            case "text":
              if (log.value_text !== null)
                values[log.metric_id] = log.value_text;
              break;
            case "int":
              if (log.value_int !== null)
                values[log.metric_id] = log.value_int.toString();
              break;
            case "decimal":
            case "scale":
              if (log.value_decimal !== null)
                values[log.metric_id] = log.value_decimal.toString();
              break;
            case "boolean":
              if (log.value_boolean !== null)
                values[log.metric_id] = log.value_boolean ? "true" : "false";
              break;
          }
        });
        // Preserve existing user input that hasn't been saved yet
        setLogValues((prevValues) => ({
          ...prevValues,
          ...values,
        }));
      } catch (err) {
        console.error("Failed to refresh logs:", err);
      }
    };

    window.addEventListener("logSaved", handleLogSaved);
    return () => window.removeEventListener("logSaved", handleLogSaved);
  }, [activeMetrics, today]);

  useEffect(() => {
    const saveLogs = async () => {
      for (const [metricId, rawValue] of Object.entries(debouncedValues)) {
        const metric = activeMetrics.find((m) => m.id === Number(metricId));
        if (!metric || rawValue === "") continue;

        const payload: Omit<DailyLog, "id" | "created_at"> = {
          user_id: 1,
          metric_id: Number(metricId),
          log_date: today,
          value_int: 0,
          value_boolean: false,
          value_text: "",
          value_decimal: null,
          note: "",
          metric: { id: Number(metricId), name: metric.name },
        };

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
        console.log(`Saved log for metric ${metric.name}:`, rawValue);
      }
    };
    saveLogs();
  }, [debouncedValues, activeMetrics, today]);

  console.log("HomePage render - settings:", settings);
  console.log("HomePage render - activeMetrics:", activeMetrics);

  return (
    <div className="container d-flex flex-column align-items-center">
      <h1>Habit Tracker</h1>
      {!settings && <div>Loading settings...</div>}
      {settings && !settings.homePageLayout && (
        <div>No homePageLayout found</div>
      )}
      {settings?.homePageLayout?.map((section) => (
        <div key={section.section} className="mb-4 w-100">
          <h2>{section.section}</h2>
          <div className="row">
            {section.metricIds.map((metricId: number) => (
              <div key={metricId} className="col-12 col-md-6 col-lg-4 mb-3">
                {(() => {
                  const metric = activeMetrics.find((m) => m.id === metricId);
                  if (!metric) return null;

                  const hasLogToday = logs.some(
                    (log) =>
                      log.metric_id === metric.id &&
                      new Date(log.log_date).toISOString().split("T")[0] ===
                        today
                  );

                  return (
                    <div
                      className="card"
                      style={{ border: "none", boxShadow: "none" }}
                    >
                      <div className="card-body" style={{ padding: "0.5rem" }}>
                        <label className="form-label">
                          {metric.name}{" "}
                          {hasLogToday && (
                            <span className="badge bg-success ms-2">Today</span>
                          )}
                        </label>
                        {metric.data_type === "clock" ? (
                          <ClockButton
                            metric={metric}
                            clockData={clockData[metric.id]}
                            onClockToggle={handleClockToggle}
                          />
                        ) : metric.data_type === "boolean" ? (
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
                              <label
                                htmlFor={`metric-${metric.id}-yes`}
                                className="form-check-label"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                type="radio"
                                id={`metric-${metric.id}-no`}
                                name={`metric-${metric.id}`} // group radios per metric
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
                              <label
                                htmlFor={`metric-${metric.id}-no`}
                                className="form-check-label"
                              >
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
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
