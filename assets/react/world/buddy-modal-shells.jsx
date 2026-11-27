import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";
import { IconText } from "../shared/icon-text.jsx";

const buddyRoot = createRoot(document.getElementById("bm"));
const statsRoot = createRoot(document.getElementById("sm"));

function BuddyShell({ hasPet, slide, onBuddy, onPet, onDone, icon, iconTextParts }) {
  return (
    <div className="sheet" role="dialog" aria-label="Buddy details">
      <div className="grab" />
      <div className="bslides" id="bslides" hidden={!hasPet}>
        <button type="button" className={"bsl" + (slide === "b" ? " on" : "")} id="bsl-b" onClick={onBuddy}>
          <IconText text="👤 Buddy Info" icon={icon} iconTextParts={iconTextParts} />
        </button>
        <button type="button" className={"bsl" + (slide === "p" ? " on" : "")} id="bsl-p" onClick={onPet}>
          <IconText text="🐾 Pet Info" icon={icon} iconTextParts={iconTextParts} />
        </button>
      </div>
      <div id="bbody" />
      <button className="done" id="bdone" type="button" onClick={onDone}>Done</button>
    </div>
  );
}

function StatsShell({ onDone, icon, iconTextParts }) {
  return (
    <div className="sheet" role="dialog" aria-label="Buddy stats">
      <div className="grab" />
      <h3 className="vt"><IconText text="📊 Buddy stats" icon={icon} iconTextParts={iconTextParts} /></h3>
      <div id="buddy-stats" />
      <button className="done" id="sdone" type="button" onClick={onDone}>Done</button>
    </div>
  );
}

export function renderBuddyShell(props) {
  flushSync(() => buddyRoot.render(<BuddyShell {...props} />));
}

export function renderBuddyStatsShell(props) {
  flushSync(() => statsRoot.render(<StatsShell {...props} />));
}
