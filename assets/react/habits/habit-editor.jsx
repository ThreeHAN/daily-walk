import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "../shared/icon-text.jsx";

const root = createRoot(document.getElementById("hm"));
let revision = 0;

function HabitEditor({ groups, groupIcons, icons, icon, iconTextParts, onAdd, rerun }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState("more");
  const [selectedIcon, setSelectedIcon] = useState("star");
  const nameInput = useRef(null);
  const selectedGroup = groups.find((item) => item.id === group);

  function addHabit() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      rerun(nameInput.current, "bad");
      nameInput.current.focus();
      return;
    }
    onAdd({
      name: trimmedName,
      description: description.trim(),
      group,
      icon: selectedIcon,
    });
  }

  return (
    <div className="sheet" role="dialog" aria-label="New habit">
      <div className="grab" />
      <h3 className="vt">New habit</h3>
      <div className="hprev" id="hprev" style={{ "--gc": selectedGroup.c }}>
        <span className="hi" dangerouslySetInnerHTML={{ __html: icon(selectedIcon) }} />
        <div>
          <b><IconText text={name.trim() || "Your new habit"} icon={icon} iconTextParts={iconTextParts} /></b>
          <small><IconText text={description.trim() || selectedGroup.n} icon={icon} iconTextParts={iconTextParts} /></small>
        </div>
      </div>
      <label className="fl">
        What do you want to do?
        <input id="hn" ref={nameInput} maxLength={40} placeholder="e.g. Read 10 pages"
          value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <div className="fl">
        Group
        <div className="gtiles" id="hg">
          {groups.map((item) => (
            <button type="button" className={"gt" + (item.id === group ? " on" : "")}
              style={{ "--gc": item.c }} key={item.id} onClick={() => setGroup(item.id)}>
              <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: icon(groupIcons[item.id]) }} />
              <span><IconText text={item.n} icon={icon} iconTextParts={iconTextParts} /></span>
            </button>
          ))}
        </div>
      </div>
      <div className="fl">
        Pick an icon
        <div className="itiles" id="hi">
          {icons.map((name) => (
            <button type="button" className={"it" + (name === selectedIcon ? " on" : "")}
              aria-label={name} key={name} onClick={() => setSelectedIcon(name)}
              dangerouslySetInnerHTML={{ __html: icon(name) }} />
          ))}
        </div>
      </div>
      <label className="fl">
        Why it matters (optional)
        <input id="hw" maxLength={50} placeholder="e.g. Fill my mind with good things"
          value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <button className="done" id="hadd" type="button" onClick={addHabit}>Add habit</button>
    </div>
  );
}

export function renderHabitEditor(props) {
  flushSync(() => root.render(<HabitEditor key={revision++} {...props} />));
}
