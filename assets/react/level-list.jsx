import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "./icon-text.jsx";

const root = createRoot(document.getElementById("lvlist"));

function LevelList({ levels, currentLevel, icon, iconTextParts }) {
  const text = (value) => <IconText text={value} icon={icon} iconTextParts={iconTextParts} />;
  return levels.map((level) => (
    <div key={level.number} className={"lvrow" +
      (level.number < currentLevel ? " past" : "") +
      (level.number === currentLevel ? " cur" : "")}>
      <span className="lvn">{level.number}</span>
      <div>
        <b>{text(level.title)}</b>
        <small>{text((level.number === 1 ? "Start here" : level.start + " XP") +
          (level.unlocks.length ? " · Unlocks " + level.unlocks.join(", ") : ""))}</small>
      </div>
      <span>{text(level.number < currentLevel ? "✓" : level.number === currentLevel ? "⭐" : "🔒")}</span>
    </div>
  ));
}

export function renderLevelList(props) {
  flushSync(() => root.render(<LevelList {...props} />));
}
