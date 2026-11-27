import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";
import { IconText } from "../shared/icon-text.jsx";

const root = createRoot(document.getElementById("dashboard-heading"));

function DashboardHeading({ now, name, icon, iconTextParts }) {
  const hour = now.getHours();
  const greeting = hour < 5 ? "Good night" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const clock = greeting + (name ? ", " + name : "") +
    " · " + now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <>
      <h1>Daily Walk</h1>
      <p className="sub" id="date">{date}</p>
      <p className="clock" id="clock"><IconText text={clock} icon={icon} iconTextParts={iconTextParts} /></p>
    </>
  );
}

export function renderDashboardHeading(props) {
  flushSync(() => root.render(<DashboardHeading {...props} />));
}
