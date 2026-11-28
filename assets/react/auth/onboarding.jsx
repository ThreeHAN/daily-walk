import { useRef, useState } from "react";
import { IconText } from "../shared/icon-text.jsx";
import { DeleteConfirmation } from "../shared/delete-confirmation.jsx";

const fields = [
  ["gender", "Gender"],
  ["skin", "Skin color"],
  ["hair", "Hair type"],
  ["hairColor", "Hair color"],
  ["eyeColor", "Eye color"],
];

export function AvatarSetup({ name, appearance, options, renderAvatar, onNameChange, onChange, onNext, onBack }) {
  const [nameError, setNameError] = useState("");
  const nameInput = useRef(null);

  function continueSetup() {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Enter your name to continue.");
      nameInput.current.focus();
      return;
    }
    setNameError("");
    onNext(trimmed);
  }

  return (
    <>
      <p>Make your traveler your own. You can change their appearance later.</p>
      <label className="onboarding-name">Your name
        <input ref={nameInput} value={name} maxLength={20} required aria-invalid={!!nameError}
          aria-describedby={nameError ? "onboarding-name-error" : undefined}
          onChange={(event) => { setNameError(""); onNameChange(event.target.value); }} />
      </label>
      {nameError && <p className="auth-error" id="onboarding-name-error" role="alert">{nameError}</p>}
      <div className="onboarding-avatar">
        <svg viewBox="0 0 56 64" aria-label="Traveler preview" role="img"
          dangerouslySetInnerHTML={{ __html: renderAvatar(appearance) }} />
      </div>
      <div className="onboarding-fields">
        {fields.map(([key, label]) => (
          <label key={key}>{label}
            <select value={appearance[key]} onChange={(event) => onChange(key, event.target.value)}>
              {key === "gender" && <option value="unspecified">Not specified</option>}
              {options[key].map(([value, name]) => <option key={value} value={value}>{name}</option>)}
            </select>
          </label>
        ))}
      </div>
      <button type="button" className="ubtn sec" onClick={onBack}>Back</button>
      <button type="button" className="ubtn" onClick={continueSetup}>Continue</button>
    </>
  );
}

export function HabitSetup({ habits, groups, customGroups, removedGroups, storageError,
  icons, defaultIcons, groupIcons, icon, iconTextParts, onChange, onNext, onBack }) {
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const nameInput = useRef(null);

  function edit(task) {
    setError("");
    setConfirmDelete(null);
    setCreatingGroup(false);
    setForm({
      original: task,
      name: task.t,
      description: task.s || "",
      group: task.g || "more",
      icon: task.ic || defaultIcons[task.id] || "star",
    });
  }

  function add() {
    setError("");
    setConfirmDelete(null);
    setCreatingGroup(false);
    setForm({ original: null, name: "", description: "",
      group: groups.some((group) => group.id === "more") ? "more" : groups[0].id, icon: "star" });
  }

  function save(event) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setError("Enter a habit name.");
      nameInput.current.focus();
      return;
    }
    let task;
    if (form.original) {
      task = { ...form.original, t: name, s: form.description.trim(), g: form.group,
        ic: form.icon, editedDuringSetup: true };
      if (name !== form.original.t) {
        delete task.tip;
        delete task.m;
      }
    } else {
      let id = Date.now();
      while (habits.some((item) => item.id === "c" + id)) id++;
      task = { id: "c" + id, t: name, s: form.description.trim(), g: form.group, ic: form.icon };
    }
    const next = form.original
      ? habits.map((item) => item.id === task.id ? task : item)
      : [...habits, task];
    if (onChange(next)) setForm(null);
  }

  function createGroup() {
    const name = groupName.trim();
    if (!name) {
      setError("Enter a group name.");
      return;
    }
    if (groups.some((group) => group.n.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setError("A group with that name already exists.");
      return;
    }
    let id = Date.now();
    while (groups.some((group) => group.id === "g" + id)) id++;
    const group = { id: "g" + id, n: name, e: "star", c: "#b8863b" };
    if (onChange(habits, [...customGroups, group])) {
      if (form) setForm({ ...form, group: group.id });
      setCreatingGroup(false);
      setGroupName("");
      setError("");
    }
  }

  const confirmation = confirmDelete && <DeleteConfirmation target={confirmDelete} storageError={storageError}
    onCancel={() => setConfirmDelete(null)} onConfirm={() => {
      if (confirmDelete.type === "habit") {
        if (onChange(habits.filter((task) => task.id !== confirmDelete.id))) {
          setConfirmDelete(null);
          setForm(null);
        }
      } else {
        const isCustom = customGroups.some((group) => group.id === confirmDelete.id);
        if (onChange(habits.filter((task) => (task.g || "more") !== confirmDelete.id),
          customGroups.filter((group) => group.id !== confirmDelete.id),
          isCustom ? removedGroups : [...removedGroups, confirmDelete.id])) setConfirmDelete(null);
      }
    }} />;

  if (!form && creatingGroup) {
    return <form className="onboarding-habit-form" onSubmit={(event) => { event.preventDefault(); createGroup(); }}
      aria-label="New group">
      <h3>New group</h3>
      <label>Group name
        <input autoFocus maxLength={40} value={groupName} onChange={(event) => setGroupName(event.target.value)} />
      </label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button type="button" className="ubtn sec" onClick={() => { setCreatingGroup(false); setError(""); }}>Cancel group</button>
      <button type="submit" className="ubtn">Create group</button>
    </form>;
  }

  if (form) {
    const availableIcons = icons.includes(form.icon) ? icons : [form.icon, ...icons];
    return (
      <><form className="onboarding-habit-form" onSubmit={(event) => {
        if (creatingGroup) {
          event.preventDefault();
          createGroup();
        } else save(event);
      }} aria-label={form.original ? "Edit habit" : "New habit"}>
        <h3>{form.original ? "Edit habit" : "New habit"}</h3>
        <label>Habit name
          <input ref={nameInput} autoFocus maxLength={40} value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label>Why it matters (optional)
          <input maxLength={50} value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </label>
        <fieldset>
          <legend>Group</legend>
          <div className="gtiles">
            {groups.map((group) => (
              <button type="button" className={"gt" + (group.id === form.group ? " on" : "")}
                style={{ "--gc": group.c }} key={group.id} aria-pressed={group.id === form.group}
                onClick={() => setForm({ ...form, group: group.id })}>
                <span aria-hidden="true" style={{ display: "contents" }}
                  dangerouslySetInnerHTML={{ __html: icon(groupIcons[group.id] || group.e) }} />
                <span>{group.n}</span>
              </button>
            ))}
          </div>
          {creatingGroup ? <div>
            <label>Group name
              <input maxLength={40} value={groupName} onChange={(event) => setGroupName(event.target.value)} />
            </label>
            <button type="button" className="ubtn sec" onClick={() => { setCreatingGroup(false); setError(""); }}>Cancel group</button>
            <button type="button" className="ubtn sec" onClick={createGroup}>Create group</button>
          </div> : <button type="button" className="ubtn sec" onClick={() => { setGroupName(""); setCreatingGroup(true); }}>New group</button>}
        </fieldset>
        <fieldset>
          <legend>Pick an icon</legend>
          <div className="itiles">
            {availableIcons.map((name) => (
              <button type="button" className={"it" + (name === form.icon ? " on" : "")}
                aria-label={name} aria-pressed={name === form.icon} key={name}
                onClick={() => setForm({ ...form, icon: name })}
                dangerouslySetInnerHTML={{ __html: icon(name) }} />
            ))}
          </div>
        </fieldset>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button type="button" className="ubtn sec" onClick={() => setForm(null)}>Cancel</button>
        <button type="submit" className="ubtn">{form.original ? "Save habit" : "Add habit"}</button>
        {form.original && <button type="button" className="ubtn sec" onClick={() =>
          setConfirmDelete({ type: "habit", id: form.original.id, name: form.original.t })}>Delete habit</button>}
      </form>{confirmation}</>
    );
  }

  return (
    <>
      <p>Review your habits, change them, or add your own. You can check them off after setup.</p>
      <div className="onboarding-habit-list">
        {groups.map((group) => {
          const items = habits.filter((task) => (task.g || "more") === group.id);
          return (
            <section className="grp" key={group.id} aria-label={group.n} style={{ "--gc": group.c }}>
              <div className="gh">
                <span className="ge" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon(group.e) }} />
                <h3 className="gn"><IconText text={group.n} icon={icon} iconTextParts={iconTextParts} /></h3>
                <button type="button" className="ubtn sec" aria-label={"Delete group " + group.n}
                  disabled={groups.length === 1} title={groups.length === 1 ? "Keep at least one group" : undefined}
                  onClick={() => setConfirmDelete({ type: "group", id: group.id, name: group.n })}>Delete</button>
              </div>
              <div className="gbar" aria-hidden="true" />
              <div className="gb">
                {items.map((task) => (
                  <div className="item onboarding-habit" key={task.id}>
                    <span className="onboarding-habit-checkbox" aria-hidden="true" />
                    <span className="hi" aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: icon(task.ic || defaultIcons[task.id] || groupIcons[task.g || "more"]) }} />
                    <span className="t"><IconText text={task.t} icon={icon} iconTextParts={iconTextParts} />
                      {task.s && <small><IconText text={task.s} icon={icon} iconTextParts={iconTextParts} /></small>}
                    </span>
                    <button type="button" className="ubtn sec" aria-label={"Edit " + task.t}
                      onClick={() => edit(task)}>Edit</button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <button type="button" className="ubtn sec" onClick={add}>Add a habit</button>
      <button type="button" className="ubtn sec" onClick={() => { setGroupName(""); setError(""); setCreatingGroup(true); }}>Add new group</button>
      {groups.length === 1 && <p>Keep at least one group for your habits.</p>}
      <div className="onboarding-habit-navigation">
        <button type="button" className="ubtn sec" onClick={onBack}>Back</button>
        <button type="button" className="ubtn" onClick={onNext}>Continue</button>
      </div>
      {confirmation}
    </>
  );
}
