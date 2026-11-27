import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("spw"));
let revision = 0;

function StreakWeek({ days }) {
  return days.map((day, index) => (
    <div key={day.key} className={"wd" + (day.completed ? " ok" : "") + (day.today ? " td" : "")}
      style={{ "--i": index }}>
      <span>{day.label}</span><i>{day.completed ? "✓" : ""}</i>
    </div>
  ));
}

export function renderStreakWeek(props) {
  flushSync(() => root.render(<StreakWeek key={revision++} {...props} />));
}
