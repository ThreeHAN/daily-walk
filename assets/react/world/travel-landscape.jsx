import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";

const root = createRoot(document.getElementById("travel-landscape"));

function TravelLandscape({ hill, ground, foliage }) {
  return (
    <svg viewBox="0 0 720 200" preserveAspectRatio="none">
      {[0, 360].map((x) => (
        <g key={x} transform={"translate(" + x + " 0)"}>
          <path className="travel-hills" fill={hill} d="M0 82h24V70h22V56h30v14h24v13h25V72h25V50h29v16h23v18h27V72h25V59h23v15h27v8h28v118H0z" />
          <path className="travel-ground" fill={ground} d="M0 128h32v-8h38v10h38v-7h42v8h36v-11h44v8h38v-9h40v9h52v72H0z" />
          <g className="travel-trees">
            <path fill="#70513a" d="M42 110h5v25h-5zM155 103h5v26h-5zM274 110h5v25h-5z" />
            <path fill={foliage} d="M29 112h7V99h5V88h7v11h5v13h7v6H29zM142 105h7V92h5V80h7v12h5v13h7v6h-31zM261 112h7V99h5V88h7v11h5v13h7v6h-31z" />
          </g>
          <path fill={hill} d="M13 163h10v3H13zM95 151h12v3H95zM196 169h10v3h-10zM311 155h12v3h-12z" />
        </g>
      ))}
    </svg>
  );
}

export function renderTravelLandscape(props) {
  flushSync(() => root.render(<TravelLandscape {...props} />));
}
