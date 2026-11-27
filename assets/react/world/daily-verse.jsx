import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";
import { IconText } from "../shared/icon-text.jsx";

const root = createRoot(document.getElementById("daily-verse"));

function DailyVerse({ verse, onShow, icon, iconTextParts }) {
  return (
    <button className="vcard" id="vcard" type="button" onClick={onShow}>
      <div className="vh"><IconText text="📖 Verse of the day" icon={icon} iconTextParts={iconTextParts} /></div>
      <p id="vtx">“{verse.t}”</p>
      <b id="vref">— {verse.r}</b>
    </button>
  );
}

export function renderDailyVerse(props) {
  flushSync(() => root.render(<DailyVerse {...props} />));
}
