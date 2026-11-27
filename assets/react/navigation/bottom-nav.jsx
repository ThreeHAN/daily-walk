import { useLayoutEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";

const root = createRoot(document.getElementById("nav"));
const pages = [
  { id: "h", label: "Habits", icon: "check" },
  { id: "t", label: "World", icon: "globe" },
  { id: "l", label: "Ranks", icon: "trophy" },
];

function NavigationButton({ page, current, onNavigate, icon }) {
  const button = useRef(null);
  useLayoutEffect(() => {
    // Keep the guided tour's temporary classes when selection changes.
    button.current.classList.toggle("on", current);
  }, [current]);
  return (
    <button ref={button} className="nv" data-p={page.id} type="button"
      aria-current={current ? "page" : undefined} onClick={() => onNavigate(page.id)}>
      <i data-i={page.icon} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon(page.icon) }} />
      {page.label}
    </button>
  );
}

function BottomNav({ currentPage, onNavigate, icon }) {
  return pages.map((page) => (
    <NavigationButton key={page.id} page={page} current={page.id === currentPage}
      onNavigate={onNavigate} icon={icon} />
  ));
}

export function renderBottomNav(props) {
  flushSync(() => root.render(<BottomNav {...props} />));
}
