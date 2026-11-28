export function WardrobeTabs({ tabs, selected, onSelect }) {
  return (
    <div className="chips tabs wardrobe-subcategories" role="group" aria-label="Wardrobe categories">
      {tabs.map(([id, label]) => (
        <button key={id} type="button" className={"chip" + (id === selected ? " on" : "")}
          aria-pressed={id === selected} onClick={() => onSelect(id)}>{label}</button>
      ))}
    </div>
  );
}
