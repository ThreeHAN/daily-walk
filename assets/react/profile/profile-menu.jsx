const cards = [
  ["go-wd", "g1", "wardrobe", "Wardrobe & traveler", "Change your appearance, clothes, pets and town gear"],
  ["go-lv", "g2", "star", "Levels & rewards", "See your progress and what you can unlock"],
  ["go-info", "g3", "profile-card", "My info", "Your name, traveler’s name & streak stats"],
  ["go-ix", "g1", "book", "People index", "People you have met on your journey"],
  ["go-tour", "g3", "tour-map", "Show app tour", "Replay the quick interactive guide"],
  ["go-grad", "g2", "grad", "Graduate to town", "Max level! Move your buddy into town & start a new one"],
];

export function ProfileMenu({ icon, actions }) {
  return cards.map(([id, color, iconName, title, description]) => (
    <button className="card2" id={id} type="button" key={id} hidden={id === "go-grad"}
      onClick={actions[id]}>
      <span className={"ci " + color}>
        <i className="ic" data-i={iconName} dangerouslySetInnerHTML={{ __html: icon(iconName) }} />
      </span>
      <div><b>{title}</b><span>{description}</span></div>
      <em className="arr">›</em>
    </button>
  ));
}
