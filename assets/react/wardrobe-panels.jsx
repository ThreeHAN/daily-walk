import { Fragment } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "./icon-text.jsx";

const root = createRoot(document.getElementById("wbody"));

function ChoiceSection({ title, options, value, popping, onSelect }) {
  return (
    <div className="fl">
      {title}
      <div className="chips" data-k={title}>
        {options.map(([id, label, color]) => (
          <button key={id} type="button"
            className={"chip" + (id === value ? " on" : "") + (id === popping ? " pop" : "")}
            aria-pressed={id === value} onClick={() => onSelect(id)}>
            {color && <i style={{ background: color }} />}{label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CardGrid({ cards, text }) {
  return (
    <div className="pgrid">
      {cards.map((item) => (
        <button type="button" key={item.id}
          className={"pcard" + (item.selected ? " on" : "") + (item.locked ? " lk" : "")}
          disabled={item.locked && !item.selected} aria-pressed={item.selected}
          onClick={item.onSelect}>
          <b>{text(item.name)}</b><small>{text(item.description)}</small>
        </button>
      ))}
    </div>
  );
}

function ClothingBlocks({ blocks, text }) {
  return blocks.map((block, index) => {
    if (block.type === "note") return <div key={index} className="fl">{text(block.text)}</div>;
    if (block.type === "heading") return <h4 key={index}>{text(block.title)}</h4>;
    if (block.type === "choice") return <ChoiceSection key={index} {...block.section} />;
    if (block.type === "grid") return <CardGrid key={index} cards={block.cards} text={text} />;
    if (block.type === "group") return (
      <section key={block.title} className="wardrobe-gear-group">
        <h4>{text(block.title)}</h4>
        <ClothingBlocks blocks={block.blocks} text={text} />
      </section>
    );
    throw new Error("Unknown wardrobe block: " + block.type);
  });
}

function WardrobePanels({ tab, sections, glasses, gear, blocks, pets, best, icon, iconTextParts, onPet }) {
  const text = (value) => <IconText text={value} icon={icon} iconTextParts={iconTextParts} />;
  if (tab === "gear" || tab === "tops" || tab === "bottoms")
    return <ClothingBlocks blocks={blocks} text={text} />;
  if (tab === "warrior" || tab === "extras") {
    return (
      <>
        <div className="fl">{tab === "warrior"
          ? "Earn XP from habits to unlock warrior gear. Tap an equipped item to take it off."
          : "Tap to turn on or off"}</div>
        <CardGrid cards={gear} text={text} />
        {sections.map((section) => <ChoiceSection key={section.title} {...section} />)}
      </>
    );
  }
  if (tab === "pets") {
    return (
      <>
        <div className="fl">{text("Best streak: 🔥 " + best +
          " days · Your active pet sits beside your traveler and follows them in town!")}</div>
        <div className="pgrid">
          <button type="button" className={"pcard" + (pets.noneSelected ? " on" : "")}
            onClick={() => onPet(null)}>
            <div style={{ height: 34, display: "grid", placeItems: "center", fontSize: 20, color: "var(--mute)" }}>∅</div>
            <b>No Pet</b><small>Rest on your own</small>
          </button>
          {pets.items.map((pet) => (
            <button type="button" key={pet.id}
              className={"pcard" + (pet.selected ? " on" : "") + (pet.unlocked ? "" : " lk")}
              onClick={(event) => onPet(pet, event.currentTarget)}>
              <span dangerouslySetInnerHTML={{ __html: pet.art }} />
              <b>{text(pet.name)}</b><small>{text(pet.description)}</small>
            </button>
          ))}
        </div>
      </>
    );
  }
  return (
    <>
      {tab === "person" && <div className="fl">Hats and glasses can cover hair or eyes.</div>}
      {sections.map((section, index) => (
        <Fragment key={section.title}>
          {index === 1 && tab === "face" && (
            <>
              <h4>Glasses</h4>
              <CardGrid cards={glasses} text={text} />
            </>
          )}
          <ChoiceSection {...section} />
        </Fragment>
      ))}
    </>
  );
}

export function renderWardrobePanels(props) {
  flushSync(() => root.render(<WardrobePanels {...props} />));
}
