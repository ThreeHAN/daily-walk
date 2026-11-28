import { useLayoutEffect } from "react";
import { createPortal, flushSync } from "react-dom";
import { createRoot, markReactRoot } from "../shared/react-root.js";
import { LevelList } from "../progress/level-list.jsx";
import { ProfileBanner } from "./profile-banner.jsx";
import { ProfileInfo } from "./profile-info.jsx";
import { ProfileMenu } from "./profile-menu.jsx";
import { WardrobePanels } from "./wardrobe-panels.jsx";
import { WardrobeTabs } from "./wardrobe-tabs.jsx";

const root = createRoot(document.getElementById("profile-react-shell"));
const targets = Object.fromEntries([
  "profile-header", "profile-banner", "profile-menu", "profile-info", "wbody", "lvlist", "wardrobe-subcategories",
].map((id) => [id, markReactRoot(document.getElementById(id))]));
const state = { view: "menu" };
let bannerRevision = 0;
let infoRevision = 0;

function ProfileShell({ view, onClose, onBackToMenu, banner, menu, info, tabs, panels, levels }) {
  useLayoutEffect(() => {
    ["menu", "wd", "lv", "info"].forEach((name) => {
      document.getElementById("v-" + name).hidden = name !== view;
    });
  }, [view]);
  return (
    <>
      {onClose && createPortal(
        <>
          <button className="back" type="button"
            aria-label={view === "menu" ? "Back from profile" : "Back to profile menu"}
            onClick={view === "menu" ? onClose : onBackToMenu}>‹ Back</button>
        </>,
        targets["profile-header"],
      )}
      {banner && createPortal(<ProfileBanner key={banner.revision} {...banner.props} />, targets["profile-banner"])}
      {menu && createPortal(<ProfileMenu {...menu} />, targets["profile-menu"])}
      {info && createPortal(<ProfileInfo {...info.props} revision={info.revision} />, targets["profile-info"])}
      {tabs && createPortal(<WardrobeTabs {...tabs} />, targets["wardrobe-subcategories"])}
      {panels && createPortal(<WardrobePanels {...panels} />, targets.wbody)}
      {levels && createPortal(<LevelList {...levels} />, targets.lvlist)}
    </>
  );
}

export function renderProfile(update) {
  const next = { ...update };
  if (next.banner) next.banner = { props: next.banner, revision: ++bannerRevision };
  if (next.info) next.info = { props: next.info, revision: ++infoRevision };
  Object.assign(state, next);
  flushSync(() => root.render(<ProfileShell {...state} />));
}
