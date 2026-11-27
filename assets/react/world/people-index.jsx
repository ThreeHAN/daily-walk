import { useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { IconText } from "../shared/icon-text.jsx";

const root = createRoot(document.getElementById("ix"));
let revision = 0;

function PeopleIndex({ people, towns, icon, iconTextParts, onClose }) {
  const [query, setQuery] = useState("");
  const townCount = new Set(people.map((person) => person.town)).size;
  const search = query.trim().toLocaleLowerCase();
  const matches = people.filter((person) =>
    (person.name + " " + person.townName).toLocaleLowerCase().includes(search),
  );
  const summary = people.length
    ? people.length + (people.length === 1 ? " person" : " people") +
      " met in " + townCount + (townCount === 1 ? " town" : " towns")
    : "Tap a person in a town to meet them.";

  return (
    <div className="sheet" role="dialog" aria-label="People index">
      <div className="grab" />
      <h3 className="vt">People Index</h3>
      <div className="ixs" id="ixs">{summary}</div>
      <label className="index-search" htmlFor="ixsearch" hidden={!people.length}>
        Find someone
        <input id="ixsearch" type="search" placeholder="Search by name or town"
          value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p className="index-empty" id="ixempty" hidden={!people.length || matches.length > 0}>
        No people found. Try another name or town.
      </p>
      <div className="ixg" id="ixl">
        {towns.map((town) => {
          const residents = matches.filter((person) => person.town === town.id);
          if (!residents.length) return null;
          return (
            <section className="index-town" key={town.id}>
              <h4><IconText text={town.name} icon={icon} iconTextParts={iconTextParts} /></h4>
              <div className="index-cards">
                {residents.map((person) => (
                  <div className="ixc own" key={person.index}>
                    <div className="ixp buddy-scene pet-eco-meadow"
                      dangerouslySetInnerHTML={{ __html: person.portrait }} />
                    <b><IconText text={person.name} icon={icon} iconTextParts={iconTextParts} /></b>
                    <div className="ixo"><IconText text={"Met in " + town.name} icon={icon} iconTextParts={iconTextParts} /></div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <button className="done" id="ixdone" type="button" onClick={onClose}>Done</button>
    </div>
  );
}

export function renderPeopleIndex(props, reset) {
  if (reset) revision++;
  flushSync(() => root.render(<PeopleIndex key={revision} {...props} />));
}
