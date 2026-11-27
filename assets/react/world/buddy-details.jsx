import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";
import { IconText } from "../shared/icon-text.jsx";

let root;

function BuddyDetails({ walker, pet, showPet, portrait, townName, level, streak, profileName, duration, icon, iconTextParts }) {
  const isTraveler = walker.k === "me";
  const text = (value) => <IconText text={value} icon={icon} iconTextParts={iconTextParts} />;
  let badges;
  let details;
  let quote;

  if (showPet) {
    badges = [
      isTraveler ? "🔥 " + pet.st + "-Day Streak Reward" : "🐾 Town companion",
      "Partner: " + walker.n,
    ];
    details = [["✨ Trait", pet.d]];
    if (isTraveler) {
      details.push(["🏆 Unlock Streak", pet.st + (pet.st === 1 ? " day" : " days")]);
      details.push(["📍 Favorite Spot", "Beside " + walker.n]);
    }
    details.push(["🏘 Town Role", "Follows " + walker.n]);
    quote = "“" + pet.n + " faithfully walks alongside " + walker.n + " every day!”";
  } else {
    badges = [
      isTraveler ? "Traveler" : "Person met",
      isTraveler ? "⭐ Level " + level : "📍 " + townName,
    ];
    if (pet) badges.push("🐾 Pet: " + pet.n);
    details = [];
    if (walker.ref) {
      details.push(["⏱ Time together", duration]);
      details.push(["👆 Times Tapped", String(walker.ref.clicks || 0)]);
      details.push(["✅ Tasks Together", String(walker.ref.tasks || 0)]);
    }
    details.push(["🐾 Companion", pet ? pet.n : "None"]);
    quote = isTraveler
      ? "“Hi" + (profileName ? ", " + profileName : "") + "! We’re on a 🔥 " + streak + "-day streak!”"
      : "“Welcome to " + townName + "! It’s nice to meet you.”";
  }

  return (
    <div className="bcard">
      <div className="bstage" dangerouslySetInnerHTML={{ __html: portrait }} />
      <h4>{text(showPet ? pet.n : walker.n)}</h4>
      <div className="stags" style={{ justifyContent: "center" }}>
        {badges.map((badge, index) => (
          <span key={index} className={"stag" + (index === 1 ? " lvt" : "")}
            style={index === 0 ? { background: "#3f9d63" } : undefined}>{text(badge)}</span>
        ))}
      </div>
      <div className="bmeta">
        {details.map(([label, value]) => (
          <div key={label}><small>{text(label)}</small><b>{text(value)}</b></div>
        ))}
      </div>
      <div className="bquote">{text(quote)}</div>
    </div>
  );
}

export function renderBuddyDetails(props) {
  root ||= createRoot(document.getElementById("bbody"));
  flushSync(() => root.render(<BuddyDetails {...props} />));
}
