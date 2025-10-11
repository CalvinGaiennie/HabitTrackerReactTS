import { eachDayOfInterval, subDays, format, isSameDay } from 'date-fns';

function CommitTracker() {
    type DayStatus = {
        date: Date,
        count: number
    }
    type Week = DayStatus[]
    const today = new Date();
    const startDate = subDays(today, 364);

    const allDays = eachDayOfInterval({ start: startDate, end: today });

    const weeks: Week[] = [];
    let week: DayStatus[] = [];

    allDays.forEach((day, index) => {
        const match = data.find(d => isSameDay(new Date(d.date), day));
        const count = match ? match.count : 0;

        week.push({ date: day, count });

        if (week.length === 7 || allDays.length - 1) {
            weeks.push(week);
            week = [];
        }
    })

    return (
        <div className="grid">
      {weeks.map((week, i) => (
        <div className="week" key={i}>
          {week.map((day, j) => (
            <div
              key={j}
              className="day"
              style={{ backgroundColor: getColor(day.count) }}
              title={`${format(day.date, 'MMM d, yyyy')}: ${day.count} commits`}
            />
          ))}
        </div>
      ))}
    </div>
    )
}
export default CommitTracker