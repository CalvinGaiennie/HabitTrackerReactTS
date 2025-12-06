// Current week: Monday 00:00 to Sunday 23:59
export const getCurrentWeekRange = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Find Monday of this week
  const monday = new Date(now);
  const diffToMonday = day === 0 ? -6 : 1 - day; // If Sunday → go back 6 days
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  // Sunday is 6 days after Monday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    start: [
      monday.getFullYear(),
      String(monday.getMonth() + 1).padStart(2, "0"),
      String(monday.getDate()).padStart(2, "0"),
    ].join("-"),
    end: [
      sunday.getFullYear(),
      String(sunday.getMonth() + 1).padStart(2, "0"),
      String(sunday.getDate()).padStart(2, "0"),
    ].join("-"),
  };
};