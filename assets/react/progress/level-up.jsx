import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";
import { IconText } from "../shared/icon-text.jsx";
import { LevelTitle } from "./level-title.jsx";

const root = createRoot(document.getElementById("lu"));
let current;

function LevelUp({ level, title, unlocks, icon, iconTextParts, portrait, onDone }) {
  const message = level >= 10
    ? "Max level! Keep helping towns and exploring the world."
    : unlocks.length
      ? "Unlocked: " + unlocks.join(", ")
      : "Keep going, more rewards are ahead!";
  return (
    <div className="luc">
      <svg className="pv" width="110" height="124" viewBox="0 0 56 64"
        aria-hidden="true" dangerouslySetInnerHTML={{ __html: portrait }} />
      <div className="lut1">LEVEL UP!</div>
      <div className="lun" id="lun">{level}</div>
      <div className="lut2" id="lut"><LevelTitle level={level}>{title}</LevelTitle></div>
      <p id="luu"><IconText text={message} icon={icon} iconTextParts={iconTextParts} /></p>
      <button className="done" id="lugo" type="button" onClick={onDone}>Awesome!</button>
    </div>
  );
}

export function renderLevelUp(props) {
  current = { ...current, ...props };
  flushSync(() => root.render(<LevelUp {...current} />));
}
