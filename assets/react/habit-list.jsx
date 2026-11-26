import { useLayoutEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("list"));
let renderId = 0;

function IconText({ text, icon, iconTextParts }) {
  return iconTextParts(String(text)).map((part, index) =>
    part.icon
      ? <span key={index} className="ic" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon(part.icon) }} />
      : part.text,
  );
}

function HabitRow({ task, checks, effects, icon, iconTextParts, defaultIcons, groupIcons, onCheck, onRemove }) {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const isNow = task.m && hour >= task.m[0] && hour < task.m[1] && !checks[task.id];
  const custom = /^c\d+$/.test(String(task.id));

  function remove(event) {
    event.stopPropagation();
    const button = event.currentTarget;
    if (button.classList.contains("arm")) {
      onRemove(task);
    } else {
      button.classList.add("arm");
      setTimeout(() => button.classList.remove("arm"), 2600);
    }
  }

  return (
    <div className={"item" + (checks[task.id] ? " done" : "") +
      (task.id === effects.addedHabitId ? " newrow" : "") + (custom ? " itrow" : "")}>
      <label>
        <input type="checkbox" data-id={task.id} checked={!!checks[task.id]}
          className={task.id === effects.completedHabitId ? "just" : undefined}
          onChange={(event) => onCheck(task, event.target.checked)} />
        <span className="hi" dangerouslySetInnerHTML={{ __html: icon(task.ic || defaultIcons[task.id] || groupIcons[task.g || "more"]) }} />
        <span className="t"><IconText text={task.t} icon={icon} iconTextParts={iconTextParts} />{isNow && <> <span className="nowb">NOW</span></>}{task.s && <small><IconText text={task.s} icon={icon} iconTextParts={iconTextParts} /></small>}</span>
      </label>
      {custom && <button type="button" className="del" aria-label="Remove habit"
        dangerouslySetInnerHTML={{ __html: icon("trash") }} onClick={remove} />}
    </div>
  );
}

function HabitGroup({ group, tasks, checks, effects, closed, firstRender, index, previousWidths, onToggle, ...rowProps }) {
  const bar = useRef(null);
  const completed = tasks.filter((task) => checks[task.id]).length;
  const width = (completed / tasks.length) * 100;
  const previousWidth = previousWidths[group.id] || 0;

  useLayoutEffect(() => {
    const element = bar.current;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      element.style.width = width + "%";
    }));
    previousWidths[group.id] = width;
  }, []);

  return (
    <section className={"grp" + (closed ? " shut" : "") +
      (completed === tasks.length ? " full" : "") +
      (group.id === effects.completedGroupId ? " bounceG" : "") +
      (firstRender ? " enter" : "")} style={{ "--i": index, "--gc": group.c }}>
      <button type="button" className="gh" onClick={() => onToggle(group.id)}>
        <span className="ge" aria-hidden="true" dangerouslySetInnerHTML={{ __html: rowProps.icon(group.e) }} />
        <span className="gn"><IconText text={group.n} icon={rowProps.icon} iconTextParts={rowProps.iconTextParts} /></span>
        <span className="gc">{completed === tasks.length ? "✓ Done" : completed + "/" + tasks.length}</span>
        <span className="chev">⌄</span>
      </button>
      <div className="gbar"><i ref={bar} style={{ width: previousWidth + "%" }} /></div>
      {!closed && <div className={"gb" + (effects.openedGroupId === group.id ? " fx" : "")}>
        {tasks.map((task) => <HabitRow key={task.id} task={task} checks={checks} effects={effects} {...rowProps} />)}
      </div>}
    </section>
  );
}

function HabitList({ groups, tasks, checks, closedGroups, effects, firstRender, previousWidths, onToggle, ...rowProps }) {
  let index = 0;
  return groups.map((group) => {
    const groupTasks = tasks.filter((task) => (task.g || "more") === group.id);
    if (!groupTasks.length) return null;
    return <HabitGroup key={group.id} group={group} tasks={groupTasks} checks={checks}
      closed={!!closedGroups[group.id]} effects={effects} firstRender={firstRender}
      index={index++} previousWidths={previousWidths} onToggle={onToggle} {...rowProps} />;
  });
}

export function render(props) {
  // The legacy renderer replaced the list each time, restarting its visual effects.
  flushSync(() => root.render(<HabitList key={renderId++} {...props} />));
  return document.querySelector("#list .bounceG");
}
