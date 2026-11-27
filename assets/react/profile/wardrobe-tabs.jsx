import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "../shared/icon-text.jsx";

const root = createRoot(document.getElementById("wtabs"));
let revision = 0;

function WardrobeTabs({ tabs, selected, popping, onSelect, icon, iconTextParts }) {
  return tabs.map(([id, label]) => (
    <button key={id} type="button"
      className={"chip" + (id === selected ? " on" : "") + (id === popping ? " pop" : "")}
      aria-pressed={id === selected} onClick={() => onSelect(id)}>
      <IconText text={label} icon={icon} iconTextParts={iconTextParts} />
    </button>
  ));
}

export function renderWardrobeTabs(props) {
  flushSync(() => root.render(<WardrobeTabs key={revision++} {...props} />));
}
