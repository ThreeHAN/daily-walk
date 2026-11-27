import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "../shared/icon-text.jsx";

const root = createRoot(document.getElementById("profile-info"));
let revision = 0;

function ProfileInfo({ name, buddy, streak, best, total, animate, onName, onBuddy, icon, iconTextParts, revision }) {
  const nameInput = useRef(null);
  const buddyInput = useRef(null);
  const [values, setValues] = useState([0, 0, 0]);

  useLayoutEffect(() => {
    nameInput.current.value = name;
    buddyInput.current.value = buddy;
    const targets = [streak, best, total];
    if (!animate) {
      setValues(targets);
      return;
    }
    let current = [0, 0, 0];
    setValues(current);
    if (targets.every((value) => value === 0)) return;
    const interval = setInterval(() => {
      current = current.map((value, index) =>
        Math.min(targets[index], value + Math.max(1, Math.ceil(targets[index] / 15))),
      );
      setValues(current);
      if (current.every((value, index) => value === targets[index])) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [revision]);

  const text = (value) => <IconText text={value} icon={icon} iconTextParts={iconTextParts} />;
  return (
    <>
      <div className="sub vs" id="pst">{text((buddy || "Buddy") + (streak
        ? " is cheering for your " + streak + "-day streak!"
        : " is ready when you are!"))}</div>
      <label className="fl">Your name
        <input ref={nameInput} id="pn" maxLength={20} placeholder="What should I call you?"
          defaultValue={name} onInput={(event) => onName(event.currentTarget.value)} />
      </label>
      <label className="fl">Name your traveler
        <input ref={buddyInput} id="bn" maxLength={20} placeholder="Traveler"
          defaultValue={buddy} onInput={(event) => onBuddy(event.currentTarget.value)} />
      </label>
      <div className="stats">
        <div><b id="s1">{values[0]}</b><span>{text("🔥 Current streak")}</span></div>
        <div><b id="s2">{values[1]}</b><span>{text("🏆 Best streak")}</span></div>
        <div><b id="s3">{values[2]}</b><span>{text("✅ Total check-offs")}</span></div>
      </div>
    </>
  );
}

export function renderProfileInfo(props) {
  flushSync(() => root.render(<ProfileInfo {...props} revision={++revision} />));
}
