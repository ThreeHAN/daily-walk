import { useRef } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "../shared/react-root.js";

const root = createRoot(document.getElementById("account-actions"));

function AccountActions({ onCreate, onExport, onRestore }) {
  const file = useRef(null);
  return (
    <>
      <button type="button" className="prim" id="uadd" onClick={onCreate}>+ New User Profile (Fresh Start)</button>
      <button type="button" id="uexp" onClick={onExport}>⬇️ Export Save File</button>
      <button type="button" id="uimp" onClick={() => file.current.click()}>⬆️ Restore Save File</button>
      <input ref={file} type="file" id="ufile" accept=".json,application/json" hidden onChange={onRestore} />
    </>
  );
}

export function renderAccountActions(props) {
  flushSync(() => root.render(<AccountActions {...props} />));
}
