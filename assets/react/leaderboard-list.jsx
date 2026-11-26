import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "./icon-text.jsx";

const root = createRoot(document.getElementById("lblist"));
let revision = 0;

function LeaderboardCard({ account, index, sort, icon, iconTextParts, onRemove }) {
  const [armed, setArmed] = useState(false);
  const rank = index + 1;
  const rankText = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "#" + rank;
  const value = sort === "streak" ? "🔥 " + account.streak
    : sort === "town" ? "🌍 " + account.towns
      : sort === "tasks" ? "✅ " + account.tasks
        : account.xp.toLocaleString();
  const label = sort === "streak" ? "day streak"
    : sort === "town" ? "towns helped"
      : sort === "tasks" ? "habits done" : "total XP";

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 2600);
    return () => clearTimeout(timer);
  }, [armed]);

  return (
    <div className={"lb-card" + (account.isMe ? " me" : "") +
      (rank <= 3 ? " top" + rank : "")} style={{ "--i": index }}>
      <div className="lb-rk">{rankText}</div>
      <div className="lb-av" dangerouslySetInnerHTML={{ __html: account.avatar }} />
      <div className="lb-inf">
        <b><IconText text={account.name + (account.isMe ? " (You)" : "")} icon={icon} iconTextParts={iconTextParts} /></b>
        <small><IconText text={"Lv " + account.lv + " " + account.buddy + " · 🔥 " + account.streak + "d · 🪐 " + account.towns + " towns"} icon={icon} iconTextParts={iconTextParts} /></small>
      </div>
      <div className="lb-val">
        <IconText text={value} icon={icon} iconTextParts={iconTextParts} />
        <small>{label}</small>
      </div>
      <button type="button" className={"ubtn delu" + (armed ? " arm" : "")}
        title="Admin: Remove from Leaderboard" style={{ marginLeft: "8px" }}
        onClick={(event) => {
          event.stopPropagation();
          if (armed) onRemove(account);
          else setArmed(true);
        }}>{armed ? "Remove?" : "✕"}</button>
    </div>
  );
}

function LeaderboardList({ accounts, ...props }) {
  return accounts.map((account, index) =>
    <LeaderboardCard key={account.id} account={account} index={index} {...props} />,
  );
}

export function renderLeaderboardList(props) {
  flushSync(() => root.render(<LeaderboardList key={revision++} {...props} />));
}
