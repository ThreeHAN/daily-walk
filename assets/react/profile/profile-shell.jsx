import { useLayoutEffect } from "react";
import { createPortal, flushSync } from "react-dom";
import { createRoot, markReactRoot } from "../shared/react-root.js";
import { LevelList } from "../progress/level-list.jsx";
import { LevelTitle } from "../progress/level-title.jsx";
import { ProfileBanner } from "./profile-banner.jsx";
import { ProfileInfo } from "./profile-info.jsx";
import { ProfileMenu } from "./profile-menu.jsx";
import { WardrobePanels } from "./wardrobe-panels.jsx";
import { WardrobeTabs } from "./wardrobe-tabs.jsx";

const root = createRoot(document.getElementById("profile-react-shell"));
const targets = Object.fromEntries([
  "profile-banner", "profile-menu", "profile-info", "wtabs", "wbody", "lvlist", "wardrobe-level",
].map((id) => [id, markReactRoot(document.getElementById(id))]));
const state = { view: "menu" };
let bannerRevision = 0;
let tabsRevision = 0;
let infoRevision = 0;

function ProfileShell({ view, banner, menu, info, tabs, panels, levels, wardrobeLevel }) {
  useLayoutEffect(() => {
    ["menu", "wd", "lv", "info"].forEach((name) => {
      document.getElementById("v-" + name).hidden = name !== view;
    });
  }, [view]);
  return (
    <>
      {banner && createPortal(<ProfileBanner key={banner.revision} {...banner.props} />, targets["profile-banner"])}
      {menu && createPortal(<ProfileMenu {...menu} />, targets["profile-menu"])}
      {info && createPortal(<ProfileInfo {...info.props} revision={info.revision} />, targets["profile-info"])}
      {tabs && createPortal(<WardrobeTabs key={tabs.revision} {...tabs.props} />, targets.wtabs)}
      {panels && createPortal(<WardrobePanels {...panels} />, targets.wbody)}
      {levels && createPortal(<LevelList {...levels} />, targets.lvlist)}
      {wardrobeLevel && createPortal(
        <><span className="wardrobe-level-number">Lv {wardrobeLevel.level}</span>
          <LevelTitle level={wardrobeLevel.level}>{wardrobeLevel.title}</LevelTitle></>,
        targets["wardrobe-level"],
      )}
    </>
  );
}

export function renderProfile(update) {
  const next = { ...update };
  if (next.banner) next.banner = { props: next.banner, revision: ++bannerRevision };
  if (next.info) next.info = { props: next.info, revision: ++infoRevision };
  if (next.tabs) next.tabs = { props: next.tabs, revision: ++tabsRevision };
  Object.assign(state, next);
  flushSync(() => root.render(<ProfileShell {...state} />));
}
