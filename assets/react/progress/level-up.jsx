import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "../shared/icon-text.jsx";
import { renderLevelTitle } from "./level-title.jsx";

const numberRoot = createRoot(document.getElementById("lun"));
const messageRoot = createRoot(document.getElementById("luu"));

export function renderLevelUp({ level, title, unlocks, icon, iconTextParts }) {
  const message = level >= 10
    ? "Max level! Keep helping towns and exploring the world."
    : unlocks.length
      ? "Unlocked: " + unlocks.join(", ")
      : "Keep going, more rewards are ahead!";
  flushSync(() => {
    numberRoot.render(level);
    messageRoot.render(<IconText text={message} icon={icon} iconTextParts={iconTextParts} />);
  });
  renderLevelTitle("levelUp", level, title);
}
