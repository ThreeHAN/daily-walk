const fields = [
  ["gender", "Gender"],
  ["skin", "Skin color"],
  ["hair", "Hair type"],
  ["hairColor", "Hair color"],
  ["eyeColor", "Eye color"],
];

export function AvatarSetup({ appearance, options, renderAvatar, onChange, onNext, onBack }) {
  return (
    <>
      <p>Make your traveler your own. You can change their appearance later.</p>
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
      <button type="button" className="ubtn" onClick={onNext}>Continue</button>
    </>
  );
}
