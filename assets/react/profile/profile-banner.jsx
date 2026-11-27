import { useEffect, useState } from "react";
import { IconText } from "../shared/icon-text.jsx";
import { LevelTitle } from "../progress/level-title.jsx";

export function ProfileBanner({ buddy, level, title, progress, percent, streak, xp, name, icon, iconTextParts }) {
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
      <div className="mst" id="mst">
        <LevelTitle level={level}>{title}</LevelTitle>
      </div>
      <div className="xbar">
        <i id="mxf" style={{ width: width + "%" }} />
        <span className="profile-level-number">Level {level}</span>
      </div>
      <div className="xtxt" id="mxt">{text(progress)}</div>
      <div className="pills">
        <span className="pill" id="mp1">{text("🔥 " + streak + "-day streak")}</span>
        <span className="pill" id="mp2">{text("⭐ " + xp + " XP")}</span>
        <span className="pill" id="mp3">{text("👤 " + name)}</span>
      </div>
    </>
  );
}
