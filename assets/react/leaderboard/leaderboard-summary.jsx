import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "../shared/icon-text.jsx";

const root = createRoot(document.getElementById("leaderboard-summary"));
const tabs = [
  ["xp", "⭐ Total XP"],
  ["streak", "🔥 Streak"],
  ["town", "🌍 Towns helped"],
  ["tasks", "✅ Check-offs"],
];

function LeaderboardSummary({ count, rank, name, value, sort, onSort, icon, iconTextParts }) {
  const text = (value) => <IconText text={value} icon={icon} iconTextParts={iconTextParts} />;
  return (
    <>
      <div className="top">
        <div><h1>Leaderboard</h1><p className="sub" id="lbsub">Universal rankings across every account</p></div>
        <span className="tlv" id="lbcnt">{count} {count === 1 ? "Account" : "Accounts"}</span>
      </div>
      <div className="lb-hero">
        <div className="hl">
          <span className="lvb" id="lbmyrk">{rank}</span><b id="lbmynm">{text(name)}</b>
          <span className="xpn" id="lbmyxp">{text(value)}</span>
        </div>
        <div id="lbmydet" style={{ fontSize: "12.5px", opacity: 0.92, marginTop: 6 }}>
          Every profile on this device &amp; imported friend codes appear automatically!
        </div>
      </div>
      <div className="lb-tabs">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" className={"lb-tab" + (sort === id ? " on" : "")}
            data-lbt={id} aria-pressed={sort === id} onClick={() => onSort(id)}>{text(label)}</button>
        ))}
      </div>
    </>
  );
}

export function renderLeaderboardSummary(props) {
  flushSync(() => root.render(<LeaderboardSummary {...props} />));
}
