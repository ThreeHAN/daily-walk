import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";
import { IconText } from "../shared/icon-text.jsx";

const root = createRoot(document.getElementById("glist"));

function WorldTownList({ towns, onTravel, icon, iconTextParts }) {
  const text = (value) => <IconText text={value} icon={icon} iconTextParts={iconTextParts} />;
  return towns.map((town) => (
    <div key={town.id} id={"wc-" + town.id}
      className={"wc" + (town.current ? " cur" : "") + (town.selected ? " sel" : "")}>
      <div className="wsw" style={{ background: town.background }} />
      <div className="winf">
        <b>{text(town.name)}</b>
        <small>{text(town.description)}</small>
        <div className="wbar2"><i style={{ width: town.percent + "%", background: town.color }} /></div>
        <span className="wtg">{text(town.status)}</span>
        <div className="wbud">{text(town.reward)}</div>
      </div>
      <button type="button" className={"wbt" + (town.canTravel ? " go" : "")}
        disabled={!town.canTravel} onClick={() => onTravel(town.id)}>
        {town.current ? "Here now" : town.canTravel ? "Travel here" : "Locked"}
      </button>
    </div>
  ));
}

export function renderWorldTownList(props) {
  flushSync(() => root.render(<WorldTownList {...props} />));
}
