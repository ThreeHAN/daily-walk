import { IconText } from "../shared/icon-text.jsx";

export function WardrobeTabs({ tabs, selected, popping, onSelect, icon, iconTextParts }) {
  return tabs.map(([id, label]) => (
    <button key={id} type="button"
      className={"chip" + (id === selected ? " on" : "") + (id === popping ? " pop" : "")}
      aria-pressed={id === selected} onClick={() => onSelect(id)}>
      <IconText text={label} icon={icon} iconTextParts={iconTextParts} />
    </button>
  ));
}
