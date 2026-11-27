export function LevelTitle({ level, id, children }) {
  return (
    <b id={id} className="level-title" data-level={level}>
      <img src={`assets/svg/level-titles/level-${level}.svg`} alt="" aria-hidden="true" />
      <span className="level-title-label">{children}</span>
    </b>
  );
}
