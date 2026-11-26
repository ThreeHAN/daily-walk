import { useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "./icon-text.jsx";

const root = createRoot(document.getElementById("journal"));
let revision = 0;

function Journal({ entry, entries, day, onSave, icon, iconTextParts, revision, preserveDraft }) {
  const [draft, setDraft] = useState(entry);

  useLayoutEffect(() => {
    if (!preserveDraft) setDraft(entry);
  }, [entry, revision, preserveDraft]);

  const previousEntries = Object.keys(entries)
    .sort()
    .reverse()
    .filter((key) => key !== day)
    .slice(0, 3);

  return (
    <>
      <div className="xh">
        <b><IconText text="🙏 Gratitude & prayer journal" icon={icon} iconTextParts={iconTextParts} /></b>
        <span id="jst">{entry ? "Saved today ✓" : ""}</span>
      </div>
      <textarea
        id="jt"
        rows="3"
        maxLength={600}
        placeholder="What are you thankful for today? Anything on your heart?"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <button className="done" id="jsave" type="button" onClick={() => onSave(draft)}>
        Save today’s entry (+10 XP)
      </button>
      <div id="jl">
        {previousEntries.map((key) => (
          <div className="jrow" key={key}>
            <b>{new Date(key + "T12:00:00").toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}</b>
            <span><IconText text={entries[key]} icon={icon} iconTextParts={iconTextParts} /></span>
          </div>
        ))}
      </div>
    </>
  );
}

export function renderJournal(props) {
  flushSync(() => root.render(<Journal {...props} revision={++revision} />));
}
