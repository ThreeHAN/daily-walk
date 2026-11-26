import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "./icon-text.jsx";
import { LevelTitle } from "./level-title.jsx";

const root = createRoot(document.getElementById("hero"));

function LevelHero({ level, title, into, need, percent, max, icon, iconTextParts }) {
  return (
    <>
      <div className="hl">
        <span className="lvb" id="lvb">Lv {level}</span>
        <LevelTitle id="lvt" level={level}>{title}</LevelTitle>
        <span className="xpn" id="xpn">
          {max
            ? <IconText text="MAX 🎓" icon={icon} iconTextParts={iconTextParts} />
            : `${into} / ${need} XP`}
        </span>
      </div>
      <div className="xbar"><i id="xfill" style={{ width: percent + "%" }} /></div>
    </>
  );
}

export function renderLevelHero(props) {
  flushSync(() => root.render(<LevelHero {...props} />));
}
