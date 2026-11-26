import { createPortal, flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("cups"));
const count = document.getElementById("wn");
let renderId = 0;

function WaterTracker({ cups, lastCup, onSelect }) {
  return (
    <>
      {createPortal(`${cups} / 8 cups`, count)}
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
    </>
  );
}

export function renderWater(props) {
  // Recreate cups on each update to preserve the existing pop animation.
  flushSync(() => root.render(<WaterTracker key={renderId++} {...props} />));
}
