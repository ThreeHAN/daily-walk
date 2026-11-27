import { useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";
import { StreakWeek } from "./streak-week.jsx";

const root = createRoot(document.getElementById("sp"));
let revision = 0;

function StreakOverlay({ tier, days, count, onDone, revision }) {
  const [number, setNumber] = useState(0);
  useLayoutEffect(() => {
    setNumber(0);
    if (!count) return;
    const step = Math.max(1, Math.ceil(count / 18));
    let value = 0;
    const timer = setInterval(() => {
      value = Math.min(count, value + step);
      setNumber(value);
      if (value >= count) clearInterval(timer);
    }, 45);
    return () => clearInterval(timer);
  }, [count, revision]);

  return (
    <div className="spc">
      <div className="fstage">
        <div className="faura" />
        <div className="fring" />
        <canvas id="fcan" width="230" height="210" aria-hidden="true" />
        <svg className="flame" id="fsvg" viewBox="0 0 80 96" width="146" height="175" aria-hidden="true">
          <path id="fp1" d="M36 4h8v12h8v12h8v12h8v40h-8v8h-8v6H28v-6h-8v-8h-8V48h8V32h8v12h8V20h-4V12h4z" fill="#ff6a1a" />
          <path id="fp2" d="M36 26h8v12h8v12h6v30h-6v8H28v-8h-6V56h6V44h8z" fill="#ff9e22" />
          <path id="fp3" d="M36 44h8v12h8v24h-6v8H34v-8h-6V64h8z" fill="#ffd23f" />
          <path id="fp4" d="M37 62h6v8h4v12h-4v5h-6v-5h-4V72h4z" fill="#fff7c2" />
        </svg>
      </div>
      <div className="ftier" id="ftier">{tier.name}</div>
      <div className="num" id="spn">{number}</div>
      <div className="lbl">day streak</div>
      <div className="week" id="spw"><StreakWeek key={revision} days={days} /></div>
      <p id="spm">{tier.msg}</p>
      <button className="done" id="spgo" type="button" onClick={onDone}>Continue</button>
    </div>
  );
}

export function renderStreakOverlay(props) {
  flushSync(() => root.render(<StreakOverlay {...props} revision={++revision} />));
}
