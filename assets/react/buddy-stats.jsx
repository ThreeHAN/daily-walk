import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "./icon-text.jsx";

const root = createRoot(document.getElementById("buddy-stats"));

function BuddyStats({ buddies, level, icon, iconTextParts }) {
  const mostClicks = Math.max(...buddies.map((buddy) => buddy.stats.clicks || 0));
  const mostTasks = Math.max(...buddies.map((buddy) => buddy.stats.tasks || 0));
  const totalTasks = buddies.reduce((total, buddy) => total + (buddy.stats.tasks || 0), 0);
  const totalClicks = buddies.reduce((total, buddy) => total + (buddy.stats.clicks || 0), 0);
  const text = (value) => <IconText text={value} icon={icon} iconTextParts={iconTextParts} />;

  return (
    <>
      <div className="tsum" id="ssum">
        {text("👥 " + buddies.length + (buddies.length === 1 ? " buddy" : " buddies") +
          "  ·  ✅ " + totalTasks + " tasks  ·  👆 " + totalClicks + " taps")}
      </div>
      <div id="slist">
        {buddies.map((buddy, index) => (
          <div className="scard" key={index}>
            <div className="spv" dangerouslySetInnerHTML={{ __html: buddy.portrait }} />
            <div className="sinf">
              <b>{text(buddy.name)}</b>
              <div className="stags">
                <span className="stag" style={{ background: buddy.kind.c }}>
                  {text(buddy.kind.n + " · " + buddy.kind.r)}
                </span>
                <span className="stag lvt">
                  {text(buddy.current ? "⭐ Level " + level : "🎓 Level 10 resident")}
                </span>
                {mostClicks > 0 && (buddy.stats.clicks || 0) === mostClicks &&
                  <span className="stag hot">{text("🔥 Most clicked")}</span>}
                {mostTasks > 0 && (buddy.stats.tasks || 0) === mostTasks &&
                  <span className="stag hot">{text("🏆 Most tasks")}</span>}
              </div>
              <div className="srow">{text("⏱ In town: " + buddy.duration)}</div>
              <div className="srow">{text("👆 Tapped " + (buddy.stats.clicks || 0) +
                (buddy.stats.clicks === 1 ? " time" : " times"))}</div>
              <div className="srow">{text("✅ " + (buddy.stats.tasks || 0) + " tasks done together")}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function renderBuddyStats(props) {
  flushSync(() => root.render(<BuddyStats {...props} />));
}
