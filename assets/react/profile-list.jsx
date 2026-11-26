import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "./icon-text.jsx";

const root = createRoot(document.getElementById("ulist"));
let revision = 0;

function ProfileRow({ user, index, active, canDelete, icon, iconTextParts, onSwitch, onDelete }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 2600);
    return () => clearTimeout(timer);
  }, [armed]);

  return (
    <div className={"uitem" + (active ? " cur" : "")}>
      <div className="uinf" onClick={() => { if (!active) onSwitch(user.id); }}>
        <b><IconText text={(user.label || "Player " + (index + 1)) + (active ? " (Active)" : "")}
          icon={icon} iconTextParts={iconTextParts} /></b>
        <small><IconText text={"Lv " + (user.lv || 1) + " · Buddy: " + (user.buddy || "Buddy") + " · " + (user.town || "Meadow Valley")}
          icon={icon} iconTextParts={iconTextParts} /></small>
      </div>
      {!active && <>
        <button type="button" className="ubtn" onClick={() => onSwitch(user.id)}>Switch</button>
        {canDelete && <button type="button" className={"ubtn delu" + (armed ? " arm" : "")}
          aria-label="Delete profile" onClick={() => {
            if (armed) onDelete(user.id);
            else setArmed(true);
          }}>{armed ? "Delete?" : "✕"}</button>}
      </>}
    </div>
  );
}

function ProfileList({ users, currentId, ...props }) {
  return users.map((user, index) =>
    <ProfileRow key={user.id} user={user} index={index} active={user.id === currentId}
      canDelete={users.length > 1} {...props} />,
  );
}

export function renderProfileList(props) {
  flushSync(() => root.render(<ProfileList key={revision++} {...props} />));
}
