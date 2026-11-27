import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

const roots = [
  "profile-avatar-pet",
  "profile-banner-pet",
  "profile-wardrobe-pet",
  "profile-info-pet",
].map((id) => createRoot(document.getElementById(id)));

export function renderProfilePets(pet) {
  const image = pet ? <img src={pet.art + "?v=pixel-pets-1"} alt="" /> : null;
  flushSync(() => roots.forEach((root) => root.render(image)));
}
