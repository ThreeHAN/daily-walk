import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";

const root = createRoot(document.getElementById("leaderboard-actions"));

function LeaderboardActions({ onShare, onAdd, onRestore }) {
  return (
    <>
      <div className="lb-bar">
        <button type="button" className="prim" id="lbshare" onClick={onShare}>📤 Copy My Friend Code</button>
        <button type="button" id="lbaddf" onClick={onAdd}>➕ Add Friend Code</button>
      </div>
      <button type="button" className="ubtn sec" id="lbreset"
        style={{ width: "100%", marginTop: 8 }} onClick={onRestore}>
        🔄 Restore All Hidden Accounts
      </button>
    </>
  );
}

export function renderLeaderboardActions(props) {
  flushSync(() => root.render(<LeaderboardActions {...props} />));
}
