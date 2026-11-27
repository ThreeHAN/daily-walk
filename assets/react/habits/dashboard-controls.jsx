import { createPortal, flushSync } from "react-dom";
import { createRoot, markReactRoot } from "../shared/react-root.js";

const root = createRoot(document.getElementById("dashboard-controls"));
const resetTarget = markReactRoot(document.getElementById("reset-control"));
const addTarget = markReactRoot(document.getElementById("add-habit-control"));

function DashboardControls({ portrait, pet, currentPage, onIndex, onProfile, onReset, onAdd, icon }) {
  return (
    <>
      <button id="ixh" className="pbtn" type="button" aria-label="People index" onClick={onIndex}>
        <i className="ic" data-i="book" dangerouslySetInnerHTML={{ __html: icon("book") }} />
      </button>
      <button id="prof" className="pbtn profile-avatar" type="button" aria-label="Profile" onClick={onProfile}>
        <svg id="profile-buddy" viewBox="0 -8 56 70" aria-hidden="true" dangerouslySetInnerHTML={{ __html: portrait }} />
        <span className="profile-pet" id="profile-avatar-pet" aria-hidden="true">
          {pet && <img src={pet.art + "?v=pixel-pets-1"} alt="" />}
        </span>
      </button>
      {createPortal(<button className="reset" id="reset" onClick={onReset}>Uncheck everything</button>, resetTarget)}
      {createPortal(
        <button className="fab" id="fab" type="button" aria-label="Add a new habit"
          hidden={currentPage !== "h"} onClick={onAdd}>
          <i className="ic" data-i="plus" dangerouslySetInnerHTML={{ __html: icon("plus") }} /><span>New habit</span>
        </button>,
        addTarget,
      )}
    </>
  );
}

export function renderDashboardControls(props) {
  flushSync(() => root.render(<DashboardControls {...props} />));
}
