import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "./icon-text.jsx";

const root = createRoot(document.getElementById("progress-summary"));

function ProgressSummary({ completed, total, percent, streak, icon, iconTextParts }) {
  return (
    <>
      <div className="bar"><i id="fill" style={{ width: percent + "%" }} /></div>
      <div className="stat">
        <span id="count">{completed} of {total} done</span>
        <span id="streak">
          {streak > 0 && <IconText text={"🔥 " + streak + "-day streak"} icon={icon} iconTextParts={iconTextParts} />}
        </span>
      </div>
    </>
  );
}

export function renderProgressSummary(props) {
  flushSync(() => root.render(<ProgressSummary {...props} />));
}
