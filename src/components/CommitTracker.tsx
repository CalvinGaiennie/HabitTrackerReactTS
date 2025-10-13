import { eachDayOfInterval, subDays, format, isSameDay } from "date-fns";
import styles from "./CommitTracker.module.css";
function CommitTracker() {
  type DayStatus = {
    date: Date;
    count: number;
  };
  type Week = DayStatus[];
  const today = new Date();
  const startDate = subDays(today, 364);

  const allDays = eachDayOfInterval({ start: startDate, end: today });

  // TODO: Replace with actual data fetching
  const data: { date: string; count: number }[] = [
  {"date": "2024-10-14", "count": 3},
  {"date": "2024-10-15", "count": 0},
  {"date": "2024-10-16", "count": 5},
  {"date": "2024-10-17", "count": 2},
  {"date": "2024-10-18", "count": 7},
  {"date": "2024-10-19", "count": 0},
  {"date": "2024-10-20", "count": 4},
  {"date": "2024-10-21", "count": 9},
  {"date": "2024-10-22", "count": 1},
  {"date": "2024-10-23", "count": 6},
  {"date": "2024-10-24", "count": 0},
  {"date": "2024-10-25", "count": 3},
  {"date": "2024-10-26", "count": 10},
  {"date": "2024-10-27", "count": 2},
  {"date": "2024-10-28", "count": 0},
  {"date": "2024-10-29", "count": 4},
  {"date": "2024-10-30", "count": 8},
  {"date": "2024-10-31", "count": 5},
  {"date": "2024-11-01", "count": 0},
  {"date": "2024-11-02", "count": 3},
  {"date": "2024-11-03", "count": 6},
  {"date": "2024-11-04", "count": 1},
  {"date": "2024-11-05", "count": 0},
  {"date": "2024-11-06", "count": 7},
  {"date": "2024-11-07", "count": 4},
  {"date": "2024-11-08", "count": 2},
  {"date": "2024-11-09", "count": 0},
  {"date": "2024-11-10", "count": 9},
  {"date": "2024-11-11", "count": 5},
  {"date": "2024-11-12", "count": 3},
  {"date": "2024-11-13", "count": 0},
  {"date": "2024-11-14", "count": 6},
  {"date": "2024-11-15", "count": 1},
  {"date": "2024-11-16", "count": 4},
  {"date": "2024-11-17", "count": 0},
  {"date": "2024-11-18", "count": 8},
  {"date": "2024-11-19", "count": 2},
  {"date": "2024-11-20", "count": 5},
  {"date": "2024-11-21", "count": 0},
  {"date": "2024-11-22", "count": 3},
  {"date": "2024-11-23", "count": 7},
  {"date": "2024-11-24", "count": 0},
  {"date": "2024-11-25", "count": 4},
  {"date": "2024-11-26", "count": 10},
  {"date": "2024-11-27", "count": 2},
  {"date": "2024-11-28", "count": 0},
  {"date": "2024-11-29", "count": 6},
  {"date": "2024-11-30", "count": 3},
  {"date": "2024-12-01", "count": 0},
  {"date": "2024-12-02", "count": 5},
  {"date": "2024-12-03", "count": 8},
  {"date": "2024-12-04", "count": 1},
  {"date": "2024-12-05", "count": 0},
  {"date": "2024-12-06", "count": 4},
  {"date": "2024-12-07", "count": 7},
  {"date": "2024-12-08", "count": 2},
  {"date": "2024-12-09", "count": 0},
  {"date": "2024-12-10", "count": 9},
  {"date": "2024-12-11", "count": 3},
  {"date": "2024-12-12", "count": 0},
  {"date": "2024-12-13", "count": 5},
  {"date": "2024-12-14", "count": 6},
  {"date": "2024-12-15", "count": 1},
  {"date": "2024-12-16", "count": 0},
  {"date": "2024-12-17", "count": 4},
  {"date": "2024-12-18", "count": 8},
  {"date": "2024-12-19", "count": 2},
  {"date": "2024-12-20", "count": 0},
  {"date": "2024-12-21", "count": 7},
  {"date": "2024-12-22", "count": 3},
  {"date": "2024-12-23", "count": 0},
  {"date": "2024-12-24", "count": 5},
  {"date": "2024-12-25", "count": 0},
  {"date": "2024-12-26", "count": 4},
  {"date": "2024-12-27", "count": 9},
  {"date": "2024-12-28", "count": 2},
  {"date": "2024-12-29", "count": 0},
  {"date": "2024-12-30", "count": 6},
  {"date": "2024-12-31", "count": 3},
  {"date": "2025-01-01", "count": 0},
  {"date": "2025-01-02", "count": 5},
  {"date": "2025-01-03", "count": 8},
  {"date": "2025-01-04", "count": 1},
  {"date": "2025-01-05", "count": 0},
  {"date": "2025-01-06", "count": 4},
  {"date": "2025-01-07", "count": 7},
  {"date": "2025-01-08", "count": 2},
  {"date": "2025-01-09", "count": 0},
  {"date": "2025-01-10", "count": 9},
  {"date": "2025-01-11", "count": 3},
  {"date": "2025-01-12", "count": 0},
  {"date": "2025-01-13", "count": 5},
  {"date": "2025-01-14", "count": 6},
  {"date": "2025-01-15", "count": 1},
  {"date": "2025-01-16", "count": 0},
  {"date": "2025-01-17", "count": 4},
  {"date": "2025-01-18", "count": 8},
  {"date": "2025-01-19", "count": 2},
  {"date": "2025-01-20", "count": 0},
  {"date": "2025-01-21", "count": 7},
  {"date": "2025-01-22", "count": 3},
  {"date": "2025-01-23", "count": 0},
  {"date": "2025-01-24", "count": 5},
  {"date": "2025-01-25", "count": 0},
  {"date": "2025-01-26", "count": 4},
  {"date": "2025-01-27", "count": 9},
  {"date": "2025-01-28", "count": 2},
  {"date": "2025-01-29", "count": 0},
  {"date": "2025-01-30", "count": 6},
  {"date": "2025-01-31", "count": 3},
  {"date": "2025-02-01", "count": 0},
  {"date": "2025-02-02", "count": 5},
  {"date": "2025-02-03", "count": 8},
  {"date": "2025-02-04", "count": 1},
  {"date": "2025-02-05", "count": 0},
  {"date": "2025-02-06", "count": 4},
  {"date": "2025-02-07", "count": 7},
  {"date": "2025-02-08", "count": 2},
  {"date": "2025-02-09", "count": 0},
  {"date": "2025-02-10", "count": 9},
  {"date": "2025-02-11", "count": 3},
  {"date": "2025-02-12", "count": 0},
  {"date": "2025-02-13", "count": 5},
  {"date": "2025-02-14", "count": 6},
  {"date": "2025-02-15", "count": 1},
  {"date": "2025-02-16", "count": 0},
  {"date": "2025-02-17", "count": 4},
  {"date": "2025-02-18", "count": 8},
  {"date": "2025-02-19", "count": 2},
  {"date": "2025-02-20", "count": 0},
  {"date": "2025-02-21", "count": 7},
  {"date": "2025-02-22", "count": 3},
  {"date": "2025-02-23", "count": 0},
  {"date": "2025-02-24", "count": 5},
  {"date": "2025-02-25", "count": 0},
  {"date": "2025-02-26", "count": 4},
  {"date": "2025-02-27", "count": 9},
  {"date": "2025-02-28", "count": 2},
  {"date": "2025-03-01", "count": 0},
  {"date": "2025-03-02", "count": 6},
  {"date": "2025-03-03", "count": 3},
  {"date": "2025-03-04", "count": 0},
  {"date": "2025-03-05", "count": 5},
  {"date": "2025-03-06", "count": 8},
  {"date": "2025-03-07", "count": 1},
  {"date": "2025-03-08", "count": 0},
  {"date": "2025-03-09", "count": 4},
  {"date": "2025-03-10", "count": 7},
  {"date": "2025-03-11", "count": 2},
  {"date": "2025-03-12", "count": 0},
  {"date": "2025-03-13", "count": 9},
  {"date": "2025-03-14", "count": 3},
  {"date": "2025-03-15", "count": 0},
  {"date": "2025-03-16", "count": 5},
  {"date": "2025-03-17", "count": 6},
  {"date": "2025-03-18", "count": 1},
  {"date": "2025-03-19", "count": 0},
  {"date": "2025-03-20", "count": 4},
  {"date": "2025-03-21", "count": 8},
  {"date": "2025-03-22", "count": 2},
  {"date": "2025-03-23", "count": 0},
  {"date": "2025-03-24", "count": 7},
  {"date": "2025-03-25", "count": 3},
  {"date": "2025-03-26", "count": 0},
  {"date": "2025-03-27", "count": 5},
  {"date": "2025-03-28", "count": 0},
  {"date": "2025-03-29", "count": 4},
  {"date": "2025-03-30", "count": 9},
  {"date": "2025-03-31", "count": 2},
  {"date": "2025-04-01", "count": 0},
  {"date": "2025-04-02", "count": 6},
  {"date": "2025-04-03", "count": 3},
  {"date": "2025-04-04", "count": 0},
  {"date": "2025-04-05", "count": 5},
  {"date": "2025-04-06", "count": 8},
  {"date": "2025-04-07", "count": 1},
  {"date": "2025-04-08", "count": 0},
  {"date": "2025-04-09", "count": 4},
  {"date": "2025-04-10", "count": 7},
  {"date": "2025-04-11", "count": 2},
  {"date": "2025-04-12", "count": 0},
  {"date": "2025-04-13", "count": 9},
  {"date": "2025-04-14", "count": 3},
  {"date": "2025-04-15", "count": 0},
  {"date": "2025-04-16", "count": 5},
  {"date": "2025-04-17", "count": 6},
  {"date": "2025-04-18", "count": 1},
  {"date": "2025-04-19", "count": 0},
  {"date": "2025-04-20", "count": 4},
  {"date": "2025-04-21", "count": 8},
  {"date": "2025-04-22", "count": 2},
  {"date": "2025-04-23", "count": 0},
  {"date": "2025-04-24", "count": 7},
  {"date": "2025-04-25", "count": 3},
  {"date": "2025-04-26", "count": 0},
  {"date": "2025-04-27", "count": 5},
  {"date": "2025-04-28", "count": 0},
  {"date": "2025-04-29", "count": 4},
  {"date": "2025-04-30", "count": 9},
  {"date": "2025-05-01", "count": 2},
  {"date": "2025-05-02", "count": 0},
  {"date": "2025-05-03", "count": 6},
  {"date": "2025-05-04", "count": 3},
  {"date": "2025-05-05", "count": 0},
  {"date": "2025-05-06", "count": 5},
  {"date": "2025-05-07", "count": 8},
  {"date": "2025-05-08", "count": 1},
  {"date": "2025-05-09", "count": 0},
  {"date": "2025-05-10", "count": 4},
  {"date": "2025-05-11", "count": 7},
  {"date": "2025-05-12", "count": 2},
  {"date": "2025-05-13", "count": 0},
  {"date": "2025-05-14", "count": 9},
  {"date": "2025-05-15", "count": 3},
  {"date": "2025-05-16", "count": 0},
  {"date": "2025-05-17", "count": 5},
  {"date": "2025-05-18", "count": 6},
  {"date": "2025-05-19", "count": 1},
  {"date": "2025-05-20", "count": 0},
  {"date": "2025-05-21", "count": 4},
  {"date": "2025-05-22", "count": 8},
  {"date": "2025-05-23", "count": 2},
  {"date": "2025-05-24", "count": 0},
  {"date": "2025-05-25", "count": 7},
  {"date": "2025-05-26", "count": 3},
  {"date": "2025-05-27", "count": 0},
  {"date": "2025-05-28", "count": 5},
  {"date": "2025-05-29", "count": 0},
  {"date": "2025-05-30", "count": 4},
  {"date": "2025-05-31", "count": 9},
  {"date": "2025-06-01", "count": 2},
  {"date": "2025-06-02", "count": 0},
  {"date": "2025-06-03", "count": 6},
  {"date": "2025-06-04", "count": 3},
  {"date": "2025-06-05", "count": 0},
  {"date": "2025-06-06", "count": 5},
  {"date": "2025-06-07", "count": 8},
  {"date": "2025-06-08", "count": 1},
  {"date": "2025-06-09", "count": 0},
  {"date": "2025-06-10", "count": 4},
  {"date": "2025-06-11", "count": 7},
  {"date": "2025-06-12", "count": 2},
  {"date": "2025-06-13", "count": 0},
  {"date": "2025-06-14", "count": 9},
  {"date": "2025-06-15", "count": 3},
  {"date": "2025-06-16", "count": 0},
  {"date": "2025-06-17", "count": 5},
  {"date": "2025-06-18", "count": 6},
  {"date": "2025-06-19", "count": 1},
  {"date": "2025-06-20", "count": 0},
  {"date": "2025-06-21", "count": 4},
  {"date": "2025-06-22", "count": 8},
  {"date": "2025-06-23", "count": 2},
  {"date": "2025-06-24", "count": 0},
  {"date": "2025-06-25", "count": 7},
  {"date": "2025-06-26", "count": 3},
  {"date": "2025-06-27", "count": 0},
  {"date": "2025-06-28", "count": 5},
  {"date": "2025-06-29", "count": 0},
  {"date": "2025-06-30", "count": 4},
  {"date": "2025-07-01", "count": 9},
  {"date": "2025-07-02", "count": 2},
  {"date": "2025-07-03", "count": 0},
  {"date": "2025-07-04", "count": 6},
  {"date": "2025-07-05", "count": 3},
  {"date": "2025-07-06", "count": 0},
  {"date": "2025-07-07", "count": 5},
  {"date": "2025-07-08", "count": 8},
  {"date": "2025-07-09", "count": 1},
  {"date": "2025-07-10", "count": 0},
  {"date": "2025-07-11", "count": 4},
  {"date": "2025-07-12", "count": 7},
  {"date": "2025-07-13", "count": 2},
  {"date": "2025-07-14", "count": 0},
  {"date": "2025-07-15", "count": 9},
  {"date": "2025-07-16", "count": 3},
  {"date": "2025-07-17", "count": 0},
  {"date": "2025-07-18", "count": 5},
  {"date": "2025-07-19", "count": 6},
  {"date": "2025-07-20", "count": 1},
  {"date": "2025-07-21", "count": 0},
  {"date": "2025-07-22", "count": 4},
  {"date": "2025-07-23", "count": 8},
  {"date": "2025-07-24", "count": 2},
  {"date": "2025-07-25", "count": 0},
  {"date": "2025-07-26", "count": 7},
  {"date": "2025-07-27", "count": 3},
  {"date": "2025-07-28", "count": 0},
  {"date": "2025-07-29", "count": 5},
  {"date": "2025-07-30", "count": 0},
  {"date": "2025-07-31", "count": 4},
  {"date": "2025-08-01", "count": 9},
  {"date": "2025-08-02", "count": 2},
  {"date": "2025-08-03", "count": 0},
  {"date": "2025-08-04", "count": 6},
  {"date": "2025-08-05", "count": 3},
  {"date": "2025-08-06", "count": 0},
  {"date": "2025-08-07", "count": 5},
  {"date": "2025-08-08", "count": 8},
  {"date": "2025-08-09", "count": 1},
  {"date": "2025-08-10", "count": 0},
  {"date": "2025-08-11", "count": 4},
  {"date": "2025-08-12", "count": 7},
  {"date": "2025-08-13", "count": 2},
  {"date": "2025-08-14", "count": 0},
  {"date": "2025-08-15", "count": 9},
  {"date": "2025-08-16", "count": 3},
  {"date": "2025-08-17", "count": 0},
  {"date": "2025-08-18", "count": 5},
  {"date": "2025-08-19", "count": 6},
  {"date": "2025-08-20", "count": 1},
  {"date": "2025-08-21", "count": 0},
  {"date": "2025-08-22", "count": 4},
  {"date": "2025-08-23", "count": 8},
  {"date": "2025-08-24", "count": 2},
  {"date": "2025-08-25", "count": 0},
  {"date": "2025-08-26", "count": 7},
  {"date": "2025-08-27", "count": 3},
  {"date": "2025-08-28", "count": 0},
  {"date": "2025-08-29", "count": 5},
  {"date": "2025-08-30", "count": 0},
  {"date": "2025-08-31", "count": 4},
  {"date": "2025-09-01", "count": 9},
  {"date": "2025-09-02", "count": 2},
  {"date": "2025-09-03", "count": 0},
  {"date": "2025-09-04", "count": 6},
  {"date": "2025-09-05", "count": 3},
  {"date": "2025-09-06", "count": 0},
  {"date": "2025-09-07", "count": 5},
  {"date": "2025-09-08", "count": 8},
  {"date": "2025-09-09", "count": 1},
  {"date": "2025-09-10", "count": 0},
  {"date": "2025-09-11", "count": 4},
  {"date": "2025-09-12", "count": 7},
  {"date": "2025-09-13", "count": 2},
  {"date": "2025-09-14", "count": 0},
  {"date": "2025-09-15", "count": 9},
  {"date": "2025-09-16", "count": 3},
  {"date": "2025-09-17", "count": 0},
  {"date": "2025-09-18", "count": 5},
  {"date": "2025-09-19", "count": 6},
  {"date": "2025-09-20", "count": 1},
  {"date": "2025-09-21", "count": 0},
  {"date": "2025-09-22", "count": 4},
  {"date": "2025-09-23", "count": 8},
  {"date": "2025-09-24", "count": 2},
  {"date": "2025-09-25", "count": 0},
  {"date": "2025-09-26", "count": 7},
  {"date": "2025-09-27", "count": 3},
  {"date": "2025-09-28", "count": 0},
  {"date": "2025-09-29", "count": 5},
  {"date": "2025-09-30", "count": 0},
  {"date": "2025-10-01", "count": 4},
  {"date": "2025-10-02", "count": 9},
  {"date": "2025-10-03", "count": 2},
  {"date": "2025-10-04", "count": 0},
  {"date": "2025-10-05", "count": 6},
  {"date": "2025-10-06", "count": 3},
  {"date": "2025-10-07", "count": 0},
  {"date": "2025-10-08", "count": 5},
  {"date": "2025-10-09", "count": 8},
  {"date": "2025-10-10", "count": 1},
  {"date": "2025-10-11", "count": 0},
  {"date": "2025-10-12", "count": 4},
  {"date": "2025-10-13", "count": 7}
];

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
    const match = data.find((d) => isSameDay(new Date(d.date), day));
    const count = match ? match.count : 0;

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

  return (
    <div>
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
                  title={`${format(day.date, "MMM d, yyyy")}: ${day.count} commits`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default CommitTracker;
