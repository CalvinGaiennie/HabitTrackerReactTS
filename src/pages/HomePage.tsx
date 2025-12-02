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
import { useUserId } from "../hooks/useAuth";
import ChartRenderer from "../components/ChartRenderer.tsx";
import type { ChartConfig, BooleanStats } from "../types/chartConfig";
import DatePicker from "../components/DatePicker.tsx";

function HomePage() {
  const userId = useUserId();
  const [activeMetrics, setActiveMetrics] = useState<Metric[]>([]);
  const [logValues, setLogValues] = useState<Record<number, string>>({});
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [settings, setSettings] = useState<UserSettings>();
  const [clockData, setClockData] = useState<Record<number, ClockData>>({});
  const [homeCharts, setHomeCharts] = useState<
    { chartConfig: ChartConfig; booleanStats?: BooleanStats | null }[]
  >([]);
  // Analytics-like date controls for homepage charts
  const defaultEnd = new Date();
  const defaultStart = new Date();
  defaultStart.setDate(defaultEnd.getDate() - 365);
  const [chartStartDate, setChartStartDate] = useState<Date>(defaultStart);
  const [chartEndDate, setChartEndDate] = useState<Date>(defaultEnd);

  const debouncedValues = useDebounce(logValues, 1000);
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  // Save log
  async function handleSave(log: Omit<DailyLog, "id" | "created_at">) {
    try {
      await saveDailyLog(log);
      const freshLogs = await getDailyLogs(userId?.toString());
      setLogs(freshLogs);
    } catch (err) {
      console.error("Error saving log:", err);
    }
  }

  // Clock toggle
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

  // Fetch settings
  useEffect(() => {
    fetchSettings((fetchedSettings) => {
      console.log("Settings received in HomePage:", fetchedSettings);
      setSettings(fetchedSettings);
    }, userId);
  }, [userId]);

  // Fetch logs
  useEffect(() => {
    fetchLogs(setLogs, undefined, undefined, undefined, userId);
  }, [userId]);

  // Fetch metrics + clock data
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metrics = await getActiveMetrics();
        setActiveMetrics(metrics);

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
          if (data) clockDataMap[metricId] = data;
        });
        setClockData(clockDataMap);
      } catch (err) {
        console.error("Failed to fetch active metrics:", err);
      }
    };

    fetchMetrics();
  }, [today]);

  // Fetch today's logs
  useEffect(() => {
    if (activeMetrics.length === 0) return;

    const fetchTodayLogs = async () => {
      try {
        const data = await getDailyLogs(
          userId?.toString(),
          undefined,
          undefined,
          today
        );
        const values: Record<number, string> = {};

        data.forEach((log) => {
          const metric = activeMetrics.find((m) => m.id === log.metric_id);
          if (!metric) return;

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

        setLogValues((prev) => ({ ...prev, ...values }));
      } catch (err) {
        console.error("Failed to fetch today's logs:", err);
      }
    };

    fetchTodayLogs();
  }, [activeMetrics, today]);

  // Save debounced values
  useEffect(() => {
    const saveLogs = async () => {
      for (const [metricId, rawValue] of Object.entries(debouncedValues)) {
        const metric = activeMetrics.find((m) => m.id === Number(metricId));
        if (!metric || rawValue === "") continue;

        const payload: Omit<DailyLog, "id" | "created_at"> = {
          user_id: userId,
          metric_id: Number(metricId),
          log_date: today,
          value_int: 0,
          value_boolean: false,
          value_text: "",
          value_decimal: null,
          note: "",
          deleted_at: null,
          metric: {
            id: Number(metricId),
            name: metric.name,
            initials: metric.initials,
          },
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
  }, [debouncedValues, activeMetrics, today, userId]);

  // Log saved event
  useEffect(() => {
    const handleLogSaved = async () => {
      try {
        const data = await getDailyLogs();
        setLogs(data);

        const todayData = await getDailyLogs(
          userId?.toString(),
          undefined,
          undefined,
          today
        );
        const values: Record<number, string> = {};
        todayData.forEach((log) => {
          const metric = activeMetrics.find((m) => m.id === log.metric_id);
          if (!metric) return;

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
        setLogValues((prev) => ({ ...prev, ...values }));
      } catch (err) {
        console.error("Failed to refresh logs:", err);
      }
    };

    window.addEventListener("logSaved", handleLogSaved);
    return () => window.removeEventListener("logSaved", handleLogSaved);
  }, [activeMetrics, today]);

  // Build Home Page Analytics charts from settings
  useEffect(() => {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
    const oneDayMs = 24 * 60 * 60 * 1000;

    const formatDate = (d: Date) => {
      return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-");
    };

    const addOneDay = (d: Date) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return next;
    };

    const buildCharts = async () => {
      try {
        if (!settings?.homePageAnalytics || activeMetrics.length === 0) {
          setHomeCharts([]);
          return;
        }

        const endDate = chartEndDate;
        const startDate = chartStartDate;

        const startDateStr = formatDate(startDate);
        const endDatePlusOneStr = formatDate(addOneDay(endDate));

        // Fetch all logs once for the window; we'll slice per metric
        const allWindowLogs = await getDailyLogs(
          userId?.toString(),
          startDateStr,
          endDatePlusOneStr
        );

        const results: {
          chartConfig: ChartConfig;
          booleanStats?: BooleanStats | null;
        }[] = [];

        for (const def of settings.homePageAnalytics) {
          const metric = activeMetrics.find((m) => m.id === def.metricId);
          if (!metric) {
            continue;
          }

          const metricLogs = allWindowLogs.filter(
            (l) => l.metric_id === def.metricId
          );

          if (metric.data_type === "boolean") {
            const startMid = new Date(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate()
            );
            const endMid = new Date(
              endDate.getFullYear(),
              endDate.getMonth(),
              endDate.getDate()
            );
            const totalDays =
              Math.ceil((endMid.getTime() - startMid.getTime()) / oneDayMs) + 1;
            const yesDays = metricLogs.filter(
              (l) => l.value_boolean === true
            ).length;
            const noDays = Math.max(0, totalDays - yesDays);
            const percentage =
              totalDays > 0 ? Math.round((yesDays / totalDays) * 100) : 0;

            const data = [
              {
                name: "Yes",
                value: yesDays,
                createdAt: "",
                metricId: def.metricId,
              },
              {
                name: "No",
                value: noDays,
                createdAt: "",
                metricId: def.metricId,
              },
            ];

            const defaultType = def.type || "pie";
            const chartConfig: ChartConfig =
              defaultType === "bar"
                ? { type: "bar", data }
                : { type: "pie", data, COLORS };

            results.push({
              chartConfig,
              booleanStats: {
                totalDays,
                yesDays,
                noDays,
                percentage,
              },
            });
          } else {
            // Build time-series or categorical data points
            const points = metricLogs
              .map((log) => {
                const [y, m, d] = log.log_date.split("-").map(Number);
                const dateObj = new Date(y, m - 1, d);
                const label = dateObj.toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "2-digit",
                });

                const value =
                  metric.data_type === "int"
                    ? log.value_int ?? 0
                    : metric.data_type === "decimal" ||
                      metric.data_type === "scale"
                    ? log.value_decimal ?? 0
                    : 0;

                return {
                  name: label,
                  value,
                  createdAt: log.log_date,
                  metricId: log.metric_id,
                };
              })
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              );

            // Choose sensible default if type not set
            const resolvedType = def.type
              ? def.type
              : metric.data_type === "decimal" || metric.data_type === "scale"
              ? "line"
              : "bar";

            let chartConfig: ChartConfig;
            if (resolvedType === "line") {
              chartConfig = {
                type: "line",
                data: points,
                metric:
                  metric.name && metric.unit
                    ? { name: metric.name, unit: metric.unit }
                    : undefined,
              };
            } else if (resolvedType === "bar") {
              chartConfig = { type: "bar", data: points };
            } else if (resolvedType === "pie") {
              chartConfig = { type: "pie", data: points, COLORS };
            } else {
              chartConfig = { type: "bar", data: points };
            }

            results.push({ chartConfig, booleanStats: null });
          }
        }

        setHomeCharts(results);
      } catch (e) {
        console.error("Failed building home page charts:", e);
        setHomeCharts([]);
      }
    };

    buildCharts();
  }, [
    settings?.homePageAnalytics,
    activeMetrics,
    userId,
    chartStartDate,
    chartEndDate,
  ]);

  return (
    <div className="container d-flex flex-column align-items-center">
      {!settings && <div>Loading settings...</div>}
      {settings && !settings.homePageLayout && (
        <div>No homePageLayout found</div>
      )}

      {settings?.homePageLayout?.map((section) => (
        <div key={section.section} className="mb-4 p-5 w-100 border">
          <h2>{section.section}</h2>
          <div className="row">
            {section.metricIds.map((metricId) => {
              const metric = activeMetrics.find((m) => m.id === metricId);
              if (!metric) return null;

              const hasLogToday = logs.some((log) => {
                const [year, month, day] = log.log_date.split("-").map(Number);
                const logDate = new Date(year, month - 1, day);
                return (
                  log.metric_id === metric.id &&
                  logDate.toISOString().split("T")[0] === today
                );
              });

              return (
                <div key={metricId} className="col-12 col-md-6 col-lg-4 mb-3">
                  <div
                    className="card"
                    style={{ border: "none", boxShadow: "none" }}
                  >
                    <div className={`card-body rounded ${hasLogToday ? "" : "bg-danger-subtle"}`} style={{ padding: "0.5rem" }}>
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
                              className="form-check-input"
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
                              name={`metric-${metric.id}`}
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
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {homeCharts.map((c, idx) => {
        const def = settings?.homePageAnalytics?.[idx];
        const metric = activeMetrics.find((m) => m.id === (def?.metricId ?? 0));
        const chartName =
          (def?.type
            ? `${def.type[0].toUpperCase()}${def.type.slice(1)} `
            : "") + "Chart";
        const metricLabel = metric?.name || `Metric ${def?.metricId ?? ""}`;

        return (
          <div key={idx} className="w-100 mb-3">
            {/* Date controls for homepage analytics (mirrors Analytics page) */}
            {settings?.homePageAnalytics &&
              settings.homePageAnalytics.length > 0 && (
                <div className="w-100 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex gap-4">
                        <DatePicker
                          title="Start Date"
                          setTargetDate={setChartStartDate}
                          targetDate={chartStartDate}
                        />
                        <DatePicker
                          title="End Date"
                          setTargetDate={setChartEndDate}
                          targetDate={chartEndDate}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            <div className="card">
              <div className="card-header">
                <h3 className="mb-0">
                  {metricLabel} {metric?.unit ? `(${metric.unit})` : ""} -{" "}
                  {chartName}
                </h3>
              </div>
              <div className="card-body">
                <ChartRenderer
                  config={c.chartConfig}
                  booleanStats={c.booleanStats}
                />
                <div className="text-muted small mt-2">
                  {chartStartDate.toLocaleDateString()} -{" "}
                  {chartEndDate.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HomePage;
