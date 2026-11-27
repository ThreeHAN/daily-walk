import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";
import { IconText } from "../shared/icon-text.jsx";

const root = createRoot(document.getElementById("ubar"));

function ProfileStatus({ name, status, icon, iconTextParts }) {
  return (
    <>
      <span className="ubl">
        <i className="ubdot" />
        <span id="ubname"><IconText text={name} icon={icon} iconTextParts={iconTextParts} /></span>
      </span>
      <span className="ubr" id="ubstat" role="status" aria-live="polite">
        <IconText text={status} icon={icon} iconTextParts={iconTextParts} />
      </span>
    </>
  );
}

export function renderProfileStatus(props) {
  flushSync(() => root.render(<ProfileStatus {...props} />));
}
