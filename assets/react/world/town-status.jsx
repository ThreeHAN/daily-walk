import { useLayoutEffect, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { createRoot, markReactRoot } from "../shared/react-root.js";
import { IconText } from "../shared/icon-text.jsx";

const root = createRoot(document.getElementById("world-status"));
const statsTarget = markReactRoot(document.getElementById("town-stats"));
let revision = 0;

function TownStatus({ region, town, percent, progress, houses, people, xp, icon, iconTextParts, revision }) {
  const [counts, setCounts] = useState([0, 0, 0]);

  useLayoutEffect(() => {
    const targets = [houses, people, xp];
    const steps = targets.map((value) => Math.max(1, Math.ceil(value / 15)));
    let values = [0, 0, 0];
    setCounts(values);
    if (targets.every((value) => value === 0)) return;
    const timer = setInterval(() => {
      values = values.map((value, index) => Math.min(targets[index], value + steps[index]));
      setCounts(values);
      if (values.every((value, index) => value >= targets[index])) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [houses, people, xp, revision]);

  return (
    <>
      <div className="top">
        <div>
          <h1>Traveler's World</h1>
          <p className="sub" id="tsub">{region}</p>
        </div>
        <span className="tlv" id="tlv">{Math.floor(percent)}% helped</span>
      </div>
      <div className="hero tc">
        <div className="hl">
          <span className="lvb" id="tnm">Town help</span><b id="tnb">{town}</b>
          <span className="xpn" id="tnx">{progress}</span>
        </div>
        <div className="xbar"><i id="tbar" style={{ width: percent + "%" }} /></div>
      </div>
      {createPortal(
        <>
          {["🏠 Houses", "👥 People in town", "⭐ Town XP"].map((label, index) => (
            <div key={label}>
              <b id={"tc" + (index + 1)}>{counts[index]}</b>
              <span><IconText text={label} icon={icon} iconTextParts={iconTextParts} /></span>
            </div>
          ))}
        </>,
        statsTarget,
      )}
    </>
  );
}

export function renderTownStatus(props) {
  flushSync(() => root.render(<TownStatus {...props} revision={++revision} />));
}
