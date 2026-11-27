import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "../shared/icon-text.jsx";

const root = createRoot(document.getElementById("week"));
let revision = 0;

function localDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function WeeklyChart({ tasks, checks, now, previousWidths, icon, iconTextParts }) {
  let sum = 0;
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - index));
    const key = localDateKey(date);
    const completed = tasks.filter((task) => checks[key]?.[task.id]).length;
    const percent = Math.round((completed / (tasks.length || 1)) * 100);
    sum += percent;
    return {
      key,
      completed,
      percent,
      label: date.toLocaleDateString(undefined, { weekday: "narrow" }),
      today: index === 6,
    };
  });

  return (
    <>
      <div className="xh">
        <b><IconText text="📈 This week" icon={icon} iconTextParts={iconTextParts} /></b>
        <span id="wavg">avg {Math.round(sum / 7)}% per day</span>
      </div>
      <div className="wk7">
        {days.map((day) => {
          const previous = previousWidths[day.key] || 0;
          previousWidths[day.key] = day.percent;
          return (
            <div className={"wcol" + (day.today ? " td" : "")} key={day.key}>
              <div className="wbar">
                <i
                  style={{ height: previous + "%" }}
                  ref={(element) => {
                    if (!element) return;
                    requestAnimationFrame(() =>
                      requestAnimationFrame(() => {
                        element.style.height = day.percent + "%";
                      }),
                    );
                  }}
                />
              </div>
              <span className="wl">{day.label}</span>
              <span className="wp">{day.completed}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function renderWeeklyChart(props) {
  flushSync(() =>
    root.render(<WeeklyChart key={revision++} {...props} />),
  );
}
