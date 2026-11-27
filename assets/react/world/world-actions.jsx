import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";

const root = createRoot(document.getElementById("world-actions"));

function Action({ id, iconName, color, title, description, onClick, icon, hidden }) {
  return (
    <button className="card2" id={id} type="button" hidden={hidden} onClick={onClick}>
      <span className={"ci " + color}>
        <i className="ic" data-i={iconName} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon(iconName) }} />
      </span>
      <div><b id={id === "homeb" ? "hbn" : undefined}>{title}</b><span id={id === "wbtn" ? "wsub" : id === "ixbtn" ? "ixsub" : undefined}>{description}</span></div>
      <em className="arr">›</em>
    </button>
  );
}

function WorldActions({ helped, total, people, onWorld, onHome, onIndex, onStats, icon }) {
  return (
    <>
      <Action id="wbtn" iconName="globe" color="g3" title="World map"
        description={helped + " / " + total + " towns helped"} onClick={onWorld} icon={icon} />
      <Action id="homeb" iconName="house" color="g2" title="Return home"
        description="You are visiting another neighborhood" onClick={onHome} icon={icon} hidden />
      <Action id="ixbtn" iconName="book" color="g2" title="People index"
        description={people + (people === 1 ? " person met" : " people met")} onClick={onIndex} icon={icon} />
      <Action id="sbtn" iconName="chart" color="g1" title="Buddy stats"
        description="Time in town, taps & tasks for every buddy" onClick={onStats} icon={icon} />
    </>
  );
}

export function renderWorldActions(props) {
  flushSync(() => root.render(<WorldActions {...props} />));
}
