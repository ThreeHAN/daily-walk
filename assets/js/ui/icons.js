const $ = (id) => document.getElementById(id);
const ICONS = {
  check:
    '<rect x="2" y="2" width="20" height="20" rx="6" fill="#3f9d63"/><path d="M7 12.5l3.2 3.2L17 8.8" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  town: '<path d="M2 21V11.5l6-5 6 5V21z" fill="#f0c98a"/><path d="M1 12l7-6 7 6" stroke="#c0504d" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/><rect x="6" y="15" width="4" height="6" fill="#8b5a2b"/><path d="M14 21v-7.5l4-3.5 4 3.5V21z" fill="#cfe3f5"/><path d="M13 14l5-4.5 5 4.5" stroke="#3b6fd4" stroke-width="2.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>',
  house:
    '<path d="M3.5 21V11l8.5-7 8.5 7v10z" fill="#f0c98a"/><path d="M2 12l10-8.5L22 12" stroke="#c0504d" stroke-width="2.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/><rect x="10" y="14" width="4.5" height="7" fill="#8b5a2b"/>',
  user: '<circle cx="12" cy="8" r="4.3" fill="#6a8de0"/><path d="M3.5 21.5c0-5 3.8-7.5 8.5-7.5s8.5 2.5 8.5 7.5z" fill="#6a8de0"/>',
  people:
    '<circle cx="8.5" cy="8" r="3.6" fill="#6a8de0"/><path d="M1.5 20c0-4.3 3-6.5 7-6.5s7 2.2 7 6.5z" fill="#6a8de0"/><circle cx="17" cy="9" r="3" fill="#f0a05a"/><path d="M13.5 14.2c1-.4 2-.5 3.5-.5 3.3 0 5.5 1.8 5.5 6.3h-7.3c0-2.4-.7-4.5-1.7-5.8z" fill="#f0a05a"/>',
  star: '<path d="M12 2.4l2.9 6.4 7 .7-5.2 4.7 1.5 6.9L12 17.4 5.8 21.1l1.5-6.9L2.1 9.5l7-.7z" fill="#ffc83d" stroke="#e8a100" stroke-width="1.2" stroke-linejoin="round"/>',
  flame:
    '<path d="M12 2c1 4 6.5 6.5 6.5 12.2a6.5 6.5 0 0 1-13 0c0-3.2 1.8-4.8 3-7.2 1 1.6 2 2.2 2.8 2.2C10.6 7.5 10.8 4.6 12 2z" fill="#ff6a1a"/><path d="M12 11.5c.9 2.5 3.6 3.2 3.6 6.2a3.6 3.6 0 0 1-7.2 0c0-1.8 1.3-2.8 2-4.2.5 1 1 1.2 1.6 1.2-.4-1.2-.4-2.2 0-3.2z" fill="#ffc933"/>',
  trophy:
    '<path d="M7 3h10v6a5 5 0 0 1-10 0z" fill="#ffc83d"/><path d="M7 5H3.2c0 4 1.4 5.6 3.8 6M17 5h3.8c0 4-1.4 5.6-3.8 6" stroke="#e8a100" stroke-width="1.8" fill="none"/><rect x="10.5" y="13.5" width="3" height="4" fill="#e8a100"/><rect x="7.5" y="17" width="9" height="3.6" rx="1.2" fill="#e8a100"/>',
  grad: '<path d="M12 4L1.5 9 12 14l10.5-5z" fill="#2b2622"/><path d="M6 11.6v4.4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.4l-6 3z" fill="#4a4a5a"/><path d="M21 9.5V15" stroke="#ffc83d" stroke-width="1.6" stroke-linecap="round"/><circle cx="21" cy="16" r="1.3" fill="#ffc83d"/>',
  sun: '<circle cx="12" cy="12" r="5" fill="#ffc83d"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="#ff9d2e" stroke-width="2" stroke-linecap="round"/>',
  sunrise:
    '<path d="M2 19h20" stroke="#e8941a" stroke-width="2" stroke-linecap="round"/><path d="M6.5 19a5.5 5.5 0 0 1 11 0z" fill="#ffb347"/><path d="M12 5v3M4.5 9l2 2M19.5 9l-2 2M2.5 14.5H5M19 14.5h2.5" stroke="#e8941a" stroke-width="1.8" stroke-linecap="round"/>',
  sunset:
    '<path d="M2 19h20" stroke="#c9503a" stroke-width="2" stroke-linecap="round"/><path d="M6.5 19a5.5 5.5 0 0 1 11 0z" fill="#ff7a5a"/><path d="M12 8v2.5M5 11l1.8 1.8M19 11l-1.8 1.8" stroke="#c9503a" stroke-width="1.8" stroke-linecap="round"/><path d="M5 22h14" stroke="#e8a090" stroke-width="1.6" stroke-linecap="round"/>',
  moon: '<path d="M16 3a9 9 0 1 0 5 15.5A7.5 7.5 0 0 1 16 3z" fill="#f4d675"/><circle cx="17.5" cy="6" r="1" fill="#fff3b0"/>',
  salad:
    '<path d="M3 12h18c0 5-4 8-9 8s-9-3-9-8z" fill="#fff" stroke="#cfd8dc" stroke-width="1.2"/><circle cx="8" cy="9" r="3.6" fill="#4cae6a"/><circle cx="14" cy="8" r="4" fill="#6fcf7f"/><circle cx="17.5" cy="10.5" r="2.4" fill="#e5624a"/>',
  runner:
    '<circle cx="14.5" cy="4.5" r="2.5" fill="#e5624a"/><path d="M13 8.5l-3 4 3.2 2.2-2.2 6M13 8.5l4.2 3 3-1M10 12.5l-4.5 1" stroke="#e5624a" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  broom:
    '<path d="M19.5 3L11.5 12" stroke="#8b5a2b" stroke-width="2.6" stroke-linecap="round"/><path d="M9 11l4.2 4.2-3.2 5.8H3.5l1.2-5.4z" fill="#f0c14b"/><path d="M6 17l2 2M8.5 14.5l2 2" stroke="#c9972a" stroke-width="1.2"/>',
  pray: '<path d="M12 2.8c-2.4 3-4.4 5.4-4.4 8.8v5.4L12 20z" fill="#f6d2ac" stroke="#d9a574" stroke-width="1"/><path d="M12 2.8c2.4 3 4.4 5.4 4.4 8.8v5.4L12 20z" fill="#e8b98c" stroke="#d9a574" stroke-width="1"/><path d="M12 6v14" stroke="#d9a574" stroke-width="1"/><path d="M8.4 13l1.6 1.2M15.6 13L14 14.2" stroke="#d9a574" stroke-width="1" stroke-linecap="round"/><path d="M6.6 17h10.8l1.2 5H5.4z" fill="#6a8de0"/>',
  drop: '<path d="M12 2.5C8 8 5.5 11 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 11 16 8 12 2.5z" fill="#4aa8ee"/><path d="M9 15a3 3 0 0 0 2.5 3" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"/>',
  chart:
    '<rect x="3" y="13" width="4.5" height="8" rx="1.2" fill="#6a8de0"/><rect x="9.8" y="8" width="4.5" height="13" rx="1.2" fill="#4cae6a"/><rect x="16.5" y="3" width="4.5" height="18" rx="1.2" fill="#ffb347"/>',
  book: '<path d="M12 6c-2-1.5-5-2-9-1.5V19c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V4.5C17 4 14 4.5 12 6z" fill="#fff" stroke="#8b5a2b" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 6v14.5" stroke="#8b5a2b" stroke-width="1.6"/><path d="M5.5 8.5c1.5 0 3 .2 4.5.8M5.5 11.5c1.5 0 3 .2 4.5.8M14 9.3c1.5-.6 3-.8 4.5-.8M14 12.3c1.5-.6 3-.8 4.5-.8" stroke="#cfa66b" stroke-width="1"/>',
  shirt:
    '<path d="M8 3L2.5 6.5 5 10.3l2.5-1.3V21h9V9l2.5 1.3L21.5 6.5 16 3c-.5 1.8-2 2.8-4 2.8S8.5 4.8 8 3z" fill="#4a86d9"/>',
  tophat:
    '<rect x="7" y="3" width="10" height="11" rx="1" fill="#2b2b2b"/><rect x="7" y="10" width="10" height="2.5" fill="#f0c14b"/><rect x="2.5" y="14" width="19" height="3.6" rx="1.6" fill="#2b2b2b"/>',
  pants:
    '<path d="M7 3h10l1.6 18h-5.2L12 11l-1.4 10H5.4z" fill="#3b5fa8"/><path d="M7 6.5h10" stroke="#2c4a88" stroke-width="1.2"/>',
  shades:
    '<rect x="2" y="8" width="8.5" height="6.5" rx="2.6" fill="#222"/><rect x="13.5" y="8" width="8.5" height="6.5" rx="2.6" fill="#222"/><path d="M10.5 10h3M2.5 9L1 7.5M21.5 9L23 7.5" stroke="#222" stroke-width="1.8" stroke-linecap="round"/><rect x="4" y="9.5" width="3" height="1.6" fill="#fff" opacity=".4"/>',
  sparkle:
    '<path d="M11 2l2.3 7.7L21 12l-7.7 2.3L11 22l-2.3-7.7L1 12l7.7-2.3z" fill="#ffd23f"/><path d="M19 3l.9 2.6 2.6.9-2.6.9L19 10l-.9-2.6L15.5 6.5l2.6-.9z" fill="#ffb347"/>',
  palette:
    '<path d="M12 3C6.5 3 2.5 7 2.5 12s4 9 9 9c1.8 0 2.5-1 2-2.2-.6-1.3.3-2.8 1.8-2.8H18c2 0 3.5-1.5 3.5-3.5C21.5 6.5 17.5 3 12 3z" fill="#e8c9a0"/><circle cx="7.5" cy="11" r="1.7" fill="#e5624a"/><circle cx="10.5" cy="7" r="1.7" fill="#ffd23f"/><circle cx="15.5" cy="7.5" r="1.7" fill="#4cae6a"/><circle cx="17.5" cy="12" r="1.7" fill="#4a86d9"/>',
  cap: '<path d="M4 15a8 8 0 0 1 16 0z" fill="#2f5fb3"/><path d="M3 15h19c0 1.8-5 3-11 3-4 0-8-1-8-3z" fill="#244a8c"/><circle cx="12" cy="7.2" r="1" fill="#244a8c"/>',
  crown:
    '<path d="M3 18L2.5 7l5 4 4.5-7 4.5 7 5-4L21 18z" fill="#f0c14b" stroke="#d9a21a" stroke-width="1.2" stroke-linejoin="round"/><rect x="3" y="18" width="18" height="2.6" rx="1" fill="#d9a21a"/>',
  halo: '<ellipse cx="12" cy="5" rx="7" ry="2.2" fill="none" stroke="#f0c14b" stroke-width="2.2"/><circle cx="12" cy="14" r="7" fill="#ffd9a0"/><circle cx="9.6" cy="13" r="1" fill="#2b2622"/><circle cx="14.4" cy="13" r="1" fill="#2b2622"/><path d="M9.6 16.4q2.4 1.7 4.8 0" stroke="#2b2622" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
  party:
    '<path d="M3 21L8.5 6.5l9 9z" fill="#e5509a"/><path d="M5.8 14l4.6 4.6" stroke="#fff" stroke-width="1.5"/><circle cx="16" cy="5" r="1.5" fill="#ffd23f"/><circle cx="20.5" cy="9.5" r="1.5" fill="#4cae6a"/><circle cx="19" cy="3" r="1" fill="#4a86d9"/><path d="M12 4l1 2M20 13l-2 .5" stroke="#e5509a" stroke-width="1.4" stroke-linecap="round"/>',
  cowboy:
    '<path d="M7 4h10l1 9H6z" fill="#8b5a2b"/><path d="M2 14.5c3-2.2 6-2.4 10-2.4s7 .2 10 2.4c0 2.4-4 4-10 4S2 16.9 2 14.5z" fill="#a0692f"/><rect x="6.4" y="9" width="11.2" height="2" fill="#5a3a1a"/>',
  wizard:
    '<path d="M12 2l7 17H5z" fill="#3a2a8a"/><rect x="2.5" y="18.5" width="19" height="3" rx="1.5" fill="#3a2a8a"/><circle cx="11" cy="10" r="1.2" fill="#f0c14b"/><circle cx="14.2" cy="14.5" r="1" fill="#f0c14b"/>',
  phones:
    '<path d="M4 14v-2a8 8 0 0 1 16 0v2" fill="none" stroke="#333" stroke-width="2.4"/><rect x="2.5" y="13" width="5" height="8" rx="2" fill="#e5509a"/><rect x="16.5" y="13" width="5" height="8" rx="2" fill="#e5509a"/>',
  scarf:
    '<path d="M3.5 6h17v5h-17z" fill="#c94a4a"/><path d="M14 11h5.5v10H14z" fill="#c94a4a"/><path d="M14 17h5.5" stroke="#fff" stroke-width="1.4" opacity=".6"/>',
  bow: '<path d="M12 12L2.5 6v12zM12 12l9.5-6v12z" fill="#c94a4a"/><circle cx="12" cy="12" r="2.5" fill="#8f2f2f"/>',
  cape: '<path d="M5 3h14l3 18H2z" fill="#7c4dbd"/><circle cx="12" cy="4" r="2.5" fill="#f0c14b"/>',
  pack: '<rect x="5" y="6" width="14" height="16" rx="4" fill="#3b6fd4"/><path d="M8.5 6a3.5 3.5 0 0 1 7 0" stroke="#2a54a8" stroke-width="2" fill="none"/><rect x="8" y="14" width="8" height="5" rx="1.5" fill="#2a54a8"/>',
  blush:
    '<circle cx="12" cy="6" r="3.6" fill="#ff8aa8"/><circle cx="18" cy="10.5" r="3.6" fill="#ff8aa8"/><circle cx="15.7" cy="17.5" r="3.6" fill="#ff8aa8"/><circle cx="8.3" cy="17.5" r="3.6" fill="#ff8aa8"/><circle cx="6" cy="10.5" r="3.6" fill="#ff8aa8"/><circle cx="12" cy="12" r="3" fill="#ffd23f"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2.6" fill="#8a8f98"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="#8a8f98" stroke-width="2.4" fill="none"/><circle cx="12" cy="15.5" r="1.7" fill="#fff"/>',
  heart:
    '<path d="M12 21C4 15 2 11 2 7.8A5 5 0 0 1 12 6a5 5 0 0 1 10 1.8C22 11 20 15 12 21z" fill="#ff6f8e"/><path d="M6 8.5a3 3 0 0 1 2.5-2" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".7"/>',
  chat: '<path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#6a8de0"/><circle cx="8" cy="10.5" r="1.3" fill="#fff"/><circle cx="12" cy="10.5" r="1.3" fill="#fff"/><circle cx="16" cy="10.5" r="1.3" fill="#fff"/>',
  cone: '<rect x="2" y="6" width="20" height="7" rx="1.5" fill="#ffb300"/><path d="M6 6L3 13M12 6L9 13M18 6l-3 7M22 8.5L18.5 13" stroke="#2b2b2b" stroke-width="2.2"/><rect x="4" y="13" width="2.4" height="9" fill="#666"/><rect x="17.6" y="13" width="2.4" height="9" fill="#666"/>',
  butterfly:
    '<ellipse cx="7.5" cy="9" rx="5.5" ry="6" fill="#e5509a"/><ellipse cx="16.5" cy="9" rx="5.5" ry="6" fill="#e5509a"/><ellipse cx="8" cy="16" rx="3.5" ry="4" fill="#ff9d5a"/><ellipse cx="16" cy="16" rx="3.5" ry="4" fill="#ff9d5a"/><rect x="11.2" y="4" width="1.6" height="16" rx=".8" fill="#2b2622"/>',
  crane:
    '<path d="M5 21V3.5h2.2V21z" fill="#ffb300"/><path d="M5 4.5h16.5L19.5 8H5z" fill="#ffb300"/><path d="M18.5 8v5.5" stroke="#555" stroke-width="1.4"/><rect x="15.8" y="13.5" width="5.4" height="4.2" fill="#e5624a"/><rect x="2.5" y="21" width="10" height="1.6" fill="#555"/>',
  tap: '<path d="M9 21.5c-3 0-5-2-5-5v-3l2.5-1V6.2a1.9 1.9 0 0 1 3.8 0v4.6l1.7-.4a1.7 1.7 0 0 1 2 1.2l.4.1 1.4-.4a1.6 1.6 0 0 1 2 1.3l.3-.1 1.2-.1a1.5 1.5 0 0 1 1.7 1.5v2.1c0 3-2 5.5-5 5.5z" fill="#f2c9a0" stroke="#d9a574" stroke-width="1"/>',
  clock:
    '<circle cx="12" cy="13" r="8" fill="#fff" stroke="#6a8de0" stroke-width="2.2"/><path d="M12 8.5V13l3 2" stroke="#6a8de0" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="10" y="2" width="4" height="2.4" rx="1" fill="#6a8de0"/>',
  globe:
    '<circle cx="12" cy="12" r="10" fill="#4aa8ee"/><path d="M7 5c3 1 3.5 3 2 5s-1 4 1.5 5-1 4-3 4c-3-2-5-5-4-8s1-4 3.5-6z" fill="#4cae6a"/><path d="M15 4c3 .5 6 3.5 6 7-2 .5-3.5-.5-3.5-2.5S14 6 15 4z" fill="#4cae6a"/><path d="M14 15c2-1 4-.5 5 1.5-1.5 2.5-4 3.5-6 3 .8-1.5.5-3.5 1-4.5z" fill="#4cae6a"/><circle cx="8.5" cy="8" r="2" fill="#fff" opacity=".25"/>',
  plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>',
  trash:
    '<path d="M5 7h14l-1.2 13a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" fill="currentColor"/><rect x="3.5" y="4.5" width="17" height="2.5" rx="1.2" fill="currentColor"/><rect x="9" y="2.5" width="6" height="2.5" rx="1" fill="currentColor"/>',
  apple:
    '<path d="M12 7c-2-2-7-1.5-7 4.5 0 4.5 3 9.5 5.5 9.5 1 0 1-.6 1.5-.6s.5.6 1.5.6c2.5 0 5.5-5 5.5-9.5C19 5.5 14 5 12 7z" fill="#e5624a"/><path d="M12 7c0-2 .5-3.5 2.5-4.5" stroke="#6b4423" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M13 5.5c1.5-1.5 4-1 4.5-.5-.5 1.7-2.5 2.2-4.5.5z" fill="#4cae6a"/>',
  dumbbell:
    '<rect x="1.5" y="9" width="3" height="6" rx="1" fill="#555"/><rect x="4.5" y="7" width="3" height="10" rx="1" fill="#e5624a"/><rect x="7.5" y="11" width="9" height="2" fill="#777"/><rect x="16.5" y="7" width="3" height="10" rx="1" fill="#e5624a"/><rect x="19.5" y="9" width="3" height="6" rx="1" fill="#555"/>',
  bed: '<rect x="2" y="12" width="20" height="6" rx="1.5" fill="#6a8de0"/><rect x="2" y="7" width="2.5" height="14" rx="1" fill="#8b5a2b"/><rect x="19.5" y="12" width="2.5" height="9" rx="1" fill="#8b5a2b"/><rect x="5.5" y="9" width="6" height="3.5" rx="1.5" fill="#fff"/>',
  leaf: '<path d="M20 4C9 4 4 9 4 15c0 2 .6 3.5 1.8 4.6C7.5 21 9 21 11 21c6 0 9-6 9-17z" fill="#4cae6a"/><path d="M5 20C9 14 13 11 17 8" stroke="#2f7d4c" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  pencil:
    '<path d="M3 21l1.5-5L16 4.5 19.5 8 8 19.5z" fill="#ffc83d"/><path d="M16 4.5l2-2a1.7 1.7 0 0 1 2.4 0l1.1 1.1a1.7 1.7 0 0 1 0 2.4L19.5 8z" fill="#e5509a"/><path d="M3 21l1.5-5 3.5 3.5z" fill="#f2c9a0"/>',
  music:
    '<path d="M9 18V5l11-2v13" stroke="#6a5fd6" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="3" fill="#6a5fd6"/><circle cx="17.5" cy="16" r="3" fill="#6a5fd6"/>',
  snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" stroke="#6ec6ff" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="#bfe8ff"/>',
  balloon:
    '<path d="M12 2a8 8 0 0 0-8 8c0 4.5 4 8 6.5 9.5h3C16 18 20 14.5 20 10a8 8 0 0 0-8-8z" fill="#e5624a"/><path d="M12 2c-3 3-3.5 12 0 17.5M12 2c3 3 3.5 12 0 17.5" stroke="#ffd23f" stroke-width="1.6" fill="none"/><rect x="9.5" y="20" width="5" height="3" rx="1" fill="#8b5a2b"/>',
  shapes:
    '<circle cx="7" cy="7" r="4.5" fill="#4a86d9"/><polygon points="17,2.5 22,11.5 12,11.5" fill="#4cae6a"/><rect x="2.5" y="13" width="9" height="8.5" rx="1.6" fill="#8f63cf"/><ellipse cx="17" cy="17.5" rx="5" ry="4.3" fill="#ffc83d"/><circle cx="15.6" cy="16.4" r=".9" fill="#2b2622"/><circle cx="18.4" cy="16.4" r=".9" fill="#2b2622"/><polygon points="14.8,18.6 19.2,18.6 17,20.2" fill="#ff9d2e"/>',
};
const EMO = {
  "🔥": "flame",
  "⭐": "star",
  "📖": "book",
  "🎓": "grad",
  "🎉": "party",
  "🔒": "lock",
  "🙏": "pray",
  "✅": "check",
  "✨": "sparkle",
  "🎩": "tophat",
  "😎": "shades",
  "🏗": "crane",
  "👤": "user",
  "💧": "drop",
  "🦋": "butterfly",
  "👥": "people",
  "📊": "chart",
  "📈": "chart",
  "👕": "shirt",
  "🏆": "trophy",
  "🏘": "town",
  "☀": "sun",
  "👑": "crown",
  "😇": "halo",
  "🤠": "cowboy",
  "🧙": "wizard",
  "🎧": "phones",
  "🎒": "pack",
  "🧣": "scarf",
  "🌸": "blush",
  "🦸": "cape",
  "🎀": "bow",
  "👆": "tap",
  "🌙": "moon",
  "🏠": "house",
  "🥗": "salad",
  "🏃": "runner",
  "🧹": "broom",
  "🧢": "cap",
  "👖": "pants",
  "🎨": "palette",
  "🚧": "cone",
  "💛": "heart",
  "💬": "chat",
  "⏱": "clock",
  "🌅": "sunrise",
  "🌇": "sunset",
  "🌍": "globe",
};
const ICRE = new RegExp("(" + Object.keys(EMO).join("|") + ")\uFE0F?", "gu");
const icoSvg = (n) =>
  '<svg viewBox="0 0 24 24" aria-hidden="true">' +
  (ICONS[n] || ICONS.star) +
  "</svg>";
function icoSpan(n) {
  const e = document.createElement("span");
  e.className = "ic";
  e.setAttribute("aria-hidden", "true");
  e.innerHTML = icoSvg(n);
  return e;
}
function fixText(t) {
  const v = t.nodeValue;
  if (!v || v.search(ICRE) < 0 || !t.parentNode) return;
  const f = document.createDocumentFragment();
  v.split(ICRE).forEach((x, i) => {
    if (i % 2) f.appendChild(icoSpan(EMO[x]));
    else if (x) f.appendChild(document.createTextNode(x));
  });
  t.parentNode.replaceChild(f, t);
}
function iconize(root) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const p = n.parentNode;
      if (!p) return NodeFilter.FILTER_REJECT;
      const t = p.nodeName;
      if (
        t === "SCRIPT" ||
        t === "STYLE" ||
        t === "TEXTAREA" ||
        t === "OPTION" ||
        t === "text" ||
        t === "TITLE"
      )
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const list = [];
  let n;
  while ((n = w.nextNode())) if (n.nodeValue.search(ICRE) >= 0) list.push(n);
  list.forEach(fixText);
}
function hydrate() {
  document.querySelectorAll("[data-i]").forEach((e) => {
    e.innerHTML = icoSvg(e.dataset.i);
  });
}
const icMO = new MutationObserver((ms) => {
  ms.forEach((m) => {
    if (m.type === "characterData") {
      fixText(m.target);
    } else
      m.addedNodes.forEach((n) => {
        if (n.nodeType === 3) fixText(n);
        else if (
          n.nodeType === 1 &&
          n.nodeName !== "svg" &&
          !(n.classList && n.classList.contains("ic"))
        )
          iconize(n);
      });
  });
});
const GIC = {
  morning: "sunrise",
  nutrition: "salad",
  exercise: "runner",
  cleaning: "broom",
  faith: "pray",
  more: "star",
};
const DEFIC = {
  wake: "sunrise",
  cold: "snow",
  water: "drop",
  bfast: "apple",
  lunch: "sun",
  dinner: "moon",
  eat: "salad",
  stretch: "leaf",
  run: "runner",
  room: "broom",
  pray: "pray",
  good: "heart",
};
const HICONS = [
  "runner",
  "dumbbell",
  "drop",
  "salad",
  "apple",
  "broom",
  "bed",
  "book",
  "pray",
  "heart",
  "sun",
  "moon",
  "leaf",
  "pencil",
  "music",
  "star",
];
