import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";

const roots = {
  levelUp: createRoot(document.getElementById("lut")),
};

export function LevelTitle({ level, id, children }) {
  return (
    <b id={id} className="level-title" data-level={level}>
      <img src={`assets/svg/level-titles/level-${level}.svg`} alt="" aria-hidden="true" />
      <span className="level-title-label">{children}</span>
    </b>
  );
}

export function renderLevelTitle(place, level, title) {
  flushSync(() => roots[place].render(
    <>
      <LevelTitle level={level}>{title}</LevelTitle>
    </>
  ));
}
