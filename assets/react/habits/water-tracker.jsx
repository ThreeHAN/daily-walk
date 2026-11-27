import { Fragment } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";
import { IconText } from "../shared/icon-text.jsx";

const root = createRoot(document.getElementById("water-card"));
let renderId = 0;

function WaterTracker({ cups, lastCup, onSelect, icon, iconTextParts, revision }) {
  return (
    <>
      <div className="xh">
        <b><IconText text="💧 Water" icon={icon} iconTextParts={iconTextParts} /></b>
        <span id="wn">{cups} / 8 cups</span>
      </div>
      <div className="cups" id="cups">
        <Fragment key={revision}>
          {Array.from({ length: 8 }, (_, index) => (
            <button
              key={index}
              type="button"
              className={"cup" + (index < cups ? " full" : "") + (index === lastCup ? " pop" : "")}
              aria-label={"Cup " + (index + 1)}
              onClick={() => onSelect(index)}
            >
              <i />
            </button>
          ))}
        </Fragment>
      </div>
    </>
  );
}

export function renderWater(props) {
  // Recreate cups on each update to preserve the existing pop animation.
  flushSync(() => root.render(<WaterTracker revision={renderId++} {...props} />));
}
