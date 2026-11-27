export function StreakWeek({ days }) {
  return days.map((day, index) => (
    <div key={day.key} className={"wd" + (day.completed ? " ok" : "") + (day.today ? " td" : "")}
      style={{ "--i": index }}>
      <span>{day.label}</span><i>{day.completed ? "✓" : ""}</i>
    </div>
  ));
}
