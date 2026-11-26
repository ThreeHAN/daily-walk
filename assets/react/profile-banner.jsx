import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "./icon-text.jsx";

const root = createRoot(document.getElementById("profile-banner"));
let revision = 0;

function ProfileBanner({ buddy, subtitle, progress, percent, streak, xp, name, icon, iconTextParts }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    let second;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setWidth(percent));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [percent]);
  const text = (value) => <IconText text={value} icon={icon} iconTextParts={iconTextParts} />;
  return (
    <>
      <h2 id="mt">{text(buddy)}</h2>
      <div className="mst" id="mst">{text(subtitle)}</div>
      <div className="xbar"><i id="mxf" style={{ width: width + "%" }} /></div>
      <div className="xtxt" id="mxt">{text(progress)}</div>
      <div className="pills">
        <span className="pill" id="mp1">{text("🔥 " + streak + "-day streak")}</span>
        <span className="pill" id="mp2">{text("⭐ " + xp + " XP")}</span>
        <span className="pill" id="mp3">{text("👤 " + name)}</span>
      </div>
    </>
  );
}

export function renderProfileBanner(props) {
  flushSync(() => root.render(<ProfileBanner key={revision++} {...props} />));
}
