import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";

const root = createRoot(document.getElementById("gsvg"));

function Globe({ planet, land, islands }) {
  return (
    <>
      <defs>
        <linearGradient id="gsea" x1="0" y1="0" x2="0" y2="1">
          {planet.sea.map((color, index) => (
            <stop key={index} id={"gs" + index} offset={index === 2 ? 1 : 0} stopColor={color} />
          ))}
        </linearGradient>
        <clipPath id="gcl"><path d="M88 12h64v8h24v8h16v8h12v12h8v16h8v24h8v64h-8v24h-8v16h-8v12h-12v8h-16v8h-24v8H88v-8H64v-8H48v-8H36v-12h-8v-16h-8v-24h-8V88h8V64h8V48h8V36h12v-8h16v-8h24z" /></clipPath>
      </defs>
      <g id="gringb" opacity={planet.ring ? "1" : "0"}>
        <ellipse cx="120" cy="124" rx="142" ry="30" transform="rotate(-14 120 124)" fill="none" stroke="#f2d694" strokeWidth="14" opacity=".55" />
      </g>
      <path id="ghalo" d="M84 4h72v8h24v8h16v8h16v16h8v16h8v24h8v72h-8v24h-8v16h-8v16h-16v8h-16v8h-24v8H84v-8H60v-8H44v-8H28v-16h-8v-16h-8v-24H4V84h8V60h8V44h8V28h16v-8h16v-8h24z" fill={planet.halo} opacity=".22" />
      <rect x="12" y="12" width="216" height="216" fill="#3a95e0" clipPath="url(#gcl)" />
      <g clipPath="url(#gcl)">
        <g id="gland" style={{ pointerEvents: "none" }}><path d={land} fill="#64b96b" /></g>
        <g id="gisl">
          {islands.map((island) => (
            <g key={island.id} className={"isl" + (island.locked ? " lk" : "")} data-id={island.id} opacity={island.opacity}>
              <rect {...island.lower} fill={island.colors[1]} />
              <rect {...island.upper} fill={island.colors[0]} />
            </g>
          ))}
        </g>
      </g>
      <g id="gringf" opacity={planet.ring ? "1" : "0"} style={{ pointerEvents: "none" }}>
        <path d="M-18 148 A142 30 -14 0 0 258 100" fill="none" stroke="#ffe4a3" strokeWidth="12" opacity=".72" />
      </g>
      <g id="gpins">
        {islands.filter((island) => island.pin).map((island) => (
          <g key={island.id} className={"pin" + (island.available ? " av" : "") + (island.current ? " me" : "")}
            data-id={island.id} opacity={island.pin.opacity} transform={island.pin.transform}>
            <g className="pinb">
              <rect x="-10" y="-10" width="20" height="20" fill={island.accent} />
              <rect x="-7" y="-7" width="14" height="14" fill="#fff" />
              <g transform="translate(-6 -6) scale(.5)" dangerouslySetInnerHTML={{ __html: island.pin.icon }} />
            </g>
          </g>
        ))}
      </g>
    </>
  );
}

export function renderGlobe(props) {
  flushSync(() => root.render(<Globe {...props} />));
}
