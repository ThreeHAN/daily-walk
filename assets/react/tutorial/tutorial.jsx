import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";

const root = createRoot(document.getElementById("tour"));

function Tutorial({ step, index, total, ready, cardTop, icon, onBack, onNext, onSkip }) {
  return (
    <div className={"tour-card" + (cardTop ? " tour-card-top" : "")}
      role="dialog" aria-labelledby="tour-title" aria-describedby="tour-text">
      <div className="tour-top">
        <span className="tour-step" id="tour-step">{index + 1} of {total}</span>
        <button className="tour-skip" id="tour-skip" type="button" onClick={onSkip}>Skip</button>
      </div>
      <div className="tour-icon" id="tour-icon" aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: icon(step.icon) }} />
      <h2 id="tour-title">{step.title}</h2>
      <p id="tour-text">{ready ? step.after : step.before}</p>
      <div className="tour-actions">
        <button className="ubtn sec" id="tour-back" type="button" hidden={index === 0} onClick={onBack}>Back</button>
        <button className="done" id="tour-next" type="button" disabled={!ready} onClick={onNext}>
          {index === total - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}

export function renderTutorial(props) {
  flushSync(() => root.render(<Tutorial {...props} />));
}
