import { useState, useEffect } from "react";
import type { Metric } from "../types/Metrics.ts";
import type { DailyLog } from "../types/dailyLogs.ts";
import { getActiveMetrics } from "../services/metrics";
import { saveDailyLog, getDailyLogs } from "../services/dailyLogs";

function SpecificAdd() {
  const [metrics, setMetrics] = useState<Metric[]>();
  const [selectedMetricId, setSelectedMetricId] = useState<
    number | undefined
  >();
  const [logValues, setLogValues] = useState<{ [key: string]: string }>({});
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [existingLog, setExistingLog] = useState<DailyLog | null>(null);

  const selectedMetric = metrics?.find((met) => met.id === selectedMetricId);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMetricId(Number(e.target.value));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  // Fetch log when date or metric changes
  useEffect(() => {
    if (!selectedDate || !selectedMetricId || !selectedMetric) {
      setExistingLog(null);
      setLogValues({});
      return;
    }
    const fetchLog = async () => {
      const logs = await getDailyLogs(selectedDate, "1"); // Replace with actual user ID
      console.log("Fetched logs:", logs); // Debug: Check returned logs
      const log = logs.find((l) => l.metric_id === selectedMetricId);
      setExistingLog(log || null);
      if (log) {
        console.log("Selected log:", log); // Debug: Check matched log
        let value: string = "";
        switch (selectedMetric.data_type) {
          case "boolean":
            value = String(log.value_boolean);
            break;
          case "text":
            value = log.value_text || "";
            break;
          case "decimal":
            value = log.value_decimal || "";
            break;
          case "int":
            value = log.value_int?.toString() || "";
            break;
        }
        console.log("Setting logValues:", {
          [log.metric_id.toString()]: value,
        }); // Debug: Check logValues
        setLogValues({ [log.metric_id.toString()]: value });
      } else {
        setLogValues({});
      }
    };
    fetchLog();
  }, [selectedDate, selectedMetricId, selectedMetric]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMetric || !selectedMetricId || !selectedDate) return;

    const inputValue = logValues[selectedMetric.id.toString()];
    let valueBoolean: boolean = false;
    let valueText: string = "";
    let valueDecimal: string = "0";
    let valueInt: number = 0;

    switch (selectedMetric.data_type) {
      case "boolean":
        valueBoolean = inputValue === "true";
        break;
      case "text":
        valueText = inputValue || "";
        break;
      case "decimal":
        valueDecimal = inputValue || "0";
        break;
      case "int":
        valueInt = inputValue ? parseInt(inputValue, 10) : 0;
        break;
    }

    const logData: Omit<DailyLog, "id" | "created_at"> = {
      metric_id: selectedMetricId,
      user_id: 1, // Replace with actual user ID
      log_date: new Date(selectedDate),
      value_int: valueInt,
      value_boolean: valueBoolean,
      value_text: valueText,
      value_decimal: valueDecimal,
      note: "",
      metric: { id: selectedMetricId, name: selectedMetric.name },
    };

    await saveDailyLog(logData);
    setLogValues({});
    setSelectedMetricId(undefined);
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  function renderLogInput() {
    if (!selectedMetric || !selectedMetricId) return null;
    if (selectedMetric.data_type === "boolean") {
      return (
        <div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              id={`metric-${selectedMetric.id}-yes`}
              name={`metric-${selectedMetric.id}`}
              value="true"
              checked={logValues[selectedMetric.id.toString()] === "true"}
              onChange={(e) =>
                setLogValues({
                  ...logValues,
                  [selectedMetric.id.toString()]: e.target.value,
                })
              }
              className="form-check-input"
            />
            <label
              htmlFor={`metric-${selectedMetric.id}-yes`}
              className="form-check-label"
            >
              Yes
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              id={`metric-${selectedMetric.id}-no`}
              name={`metric-${selectedMetric.id}`}
              value="false"
              checked={logValues[selectedMetric.id.toString()] === "false"}
              onChange={(e) =>
                setLogValues({
                  ...logValues,
                  [selectedMetric.id.toString()]: e.target.value,
                })
              }
              className="form-check-input"
            />
            <label
              htmlFor={`metric-${selectedMetric.id}-no`}
              className="form-check-label"
            >
              No
            </label>
          </div>
        </div>
      );
    } else if (selectedMetric.data_type === "text") {
      return (
        <input
          className="form-control"
          value={logValues[selectedMetric.id.toString()] ?? ""}
          onChange={(e) =>
            setLogValues({
              ...logValues,
              [selectedMetric.id.toString()]: e.target.value,
            })
          }
          placeholder="Enter text"
        />
      );
    } else if (selectedMetric.data_type === "decimal") {
      return (
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={logValues[selectedMetric.id.toString()] ?? ""}
          onChange={(e) =>
            setLogValues({
              ...logValues,
              [selectedMetric.id.toString()]: e.target.value,
            })
          }
          placeholder="Enter a number"
        />
      );
    } else if (selectedMetric.data_type === "int") {
      return (
        <input
          type="number"
          step="1"
          className="form-control"
          value={logValues[selectedMetric.id.toString()] ?? ""}
          onChange={(e) =>
            setLogValues({
              ...logValues,
              [selectedMetric.id.toString()]: e.target.value,
            })
          }
          placeholder="Enter a whole number"
        />
      );
    }
    return null;
  }

  useEffect(() => {
    const fetchMetrics = async () => {
      const allMetrics = await getActiveMetrics();
      setMetrics(allMetrics);
    };
    fetchMetrics();
  }, []);

  return (
    <div>
      <h2>Add Log</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date-select">Date</label>
          <input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="metric-select">Metric</label>
          <select
            id="metric-select"
            value={selectedMetricId ?? ""}
            onChange={handleSelectChange}
            className="form-control"
          >
            <option value="">Select a metric</option>
            {metrics?.map((metric) => (
              <option key={metric.name} value={metric.id}>
                {metric.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="value-input">Value</label>
          {renderLogInput()}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selectedMetric || !selectedDate}
        >
          {existingLog ? "Update Log" : "Save Log"}
        </button>
      </form>
    </div>
  );
}

export default SpecificAdd;
