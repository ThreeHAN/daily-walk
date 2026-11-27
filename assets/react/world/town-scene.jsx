import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";
import { TownBirds } from "./town-birds.jsx";

const root = createRoot(document.getElementById("tsvg"));
let current = { shade: { night: 0, stars: 0, sun: 1, moon: 0 } };

function TownScene({ biome, back, front, butterflies, buildings, sleep, buildingRevision, shade, onBuilding }) {
  return (
    <>
      <defs>
        <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1">
          <stop id="sk0" offset=".5" stopColor={biome.sky[0]} />
          <stop id="sk1" offset=".5" stopColor={biome.sky[1]} />
        </linearGradient>
        <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
          <stop id="gg0" offset=".5" stopColor={biome.gr[0]} />
          <stop id="gg1" offset=".5" stopColor={biome.gr[1]} />
        </linearGradient>
      </defs>
      <rect width="360" height="300" fill="url(#sk)" />
      <g id="stars" opacity={shade.stars} fill="#fff">
        <path d="M20 20h4v4h-4zM48 60h4v4h-4zM76 16h4v4h-4zM110 44h4v4h-4zM140 14h4v4h-4zM168 70h4v4h-4zM196 28h4v4h-4zM226 56h4v4h-4zM252 16h4v4h-4zM270 80h4v4h-4zM30 92h4v4h-4zM90 86h4v4h-4zM330 70h4v4h-4zM344 20h4v4h-4z" />
      </g>
      <g id="moon" opacity={shade.moon}>
        <path d="M298 26h12v4h5v5h-5v12h-5v5h-9v-5h-5V31h7z" fill="#f4f1d6" />
      </g>
      <g id="sunG" opacity={shade.sun}>
        <path d="M300 10h10v7h-10zM300 63h10v7h-10zM275 35h7v10h-7zM328 35h7v10h-7zM284 20h6v6h-6zM320 20h6v6h-6zM284 54h6v6h-6zM320 54h6v6h-6z" fill="#ffe27a" />
        <path d="M294 23h22v5h6v24h-6v5h-22v-5h-6V28h6z" fill="#ffe27a" />
      </g>
      <g className="cl" fill="#fff" opacity=".9"><path d="M34 38h12v-8h16v-6h20v6h14v8h9v8H34z" /></g>
      <g className="cl b" fill="#fff" opacity=".85"><path d="M188 61h10v-6h12v-6h18v6h14v6h8v8h-62z" /></g>
      <path id="hillp" d="M0 126V110h20v-8h20v-8h30v8h24v8h24v10h26v-8h20v-8h30v-8h28v8h24v8h22v8h30v-8h25v-6h23v10h14v184H0z" fill={biome.hill} />
      <rect y="128" width="360" height="172" fill="url(#gg)" />
      <path id="roadp" d="M0 232h40v-4h52v-4h176v4h52v4h40v42h-40v-4h-52v-4H92v4H40v4H0z" fill={biome.road} />
      <g id="flw" fill="#fff" style={{ display: biome.flowers ? "" : "none" }}>
        <path d="M38 282h5v5h-5zM118 290h5v5h-5zM208 286h5v5h-5zM298 289h5v5h-5zM164 222h4v4h-4z" />
      </g>
      <g id="decB" dangerouslySetInnerHTML={{ __html: back }} />
      <g id="bld" key={buildingRevision} onClick={onBuilding} dangerouslySetInnerHTML={{ __html: buildings }} />
      <g id="town-birds" aria-hidden="true"><TownBirds /></g>
      <g id="bfs" dangerouslySetInnerHTML={{ __html: butterflies }} />
      <g id="decF" dangerouslySetInnerHTML={{ __html: front }} />
      <rect id="nightr" width="360" height="300" fill="#0a1a40" opacity={shade.night} style={{ pointerEvents: "none" }} />
      <g id="sleep-indicators" dangerouslySetInnerHTML={{ __html: sleep }} />
    </>
  );
}

export function renderTownScene(props) {
  current = { ...current, ...props };
  flushSync(() => root.render(<TownScene {...current} />));
}
