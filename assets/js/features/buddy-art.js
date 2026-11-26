const GEO = {
  square: {
    bx: [11, 45],
    bd: (c) => R(11, 8, 34, 36, c),
    tp: (c) => R(11, 34, 34, 10, c),
    zip: [27, 34, 2, 10],
    st: [
      [11, 37, 34],
      [11, 41, 34],
    ],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [15, 42],
      [32, 42],
    ],
    lw: 9,
    lh: 12,
    hat: [0, 1],
    et: "",
    my: 0,
  },
  circle: {
    bx: [11, 45],
    bd: (c) => '<circle cx="28" cy="26" r="18" fill="' + c + '"/>',
    tp: (c) => '<path d="M11.9 34A18 18 0 0 0 44.1 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 10],
    st: [
      [13.8, 37, 28.4],
      [18.1, 41, 19.8],
    ],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [19, 42],
      [29, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  triangle: {
    bx: [13, 43],
    bd: (c) => '<polygon points="28,10 6,44 50,44" fill="' + c + '"/>',
    tp: (c) => '<polygon points="8.6,40 47.4,40 50,44 6,44" fill="' + c + '"/>',
    zip: [27, 40, 2, 4],
    st: [[7.6, 41.5, 40.8]],
    arm: [
      [7.5, 28],
      [39.5, 28],
    ],
    ls: [
      [14, 43],
      [33, 43],
    ],
    lw: 9,
    lh: 11,
    hat: [2, 0.6],
    et: "translate(2.8 6.4) scale(.9)",
    my: 4.5,
  },
  rectangle: {
    bx: [15, 41],
    bd: (c) => R(15, 6, 26, 40, c),
    tp: (c) => R(15, 34, 26, 12, c),
    zip: [27, 34, 2, 12],
    st: [
      [15, 37, 26],
      [15, 41, 26],
      [15, 45, 26],
    ],
    arm: [
      [5, 20],
      [41, 20],
    ],
    ls: [
      [17, 44],
      [31, 44],
    ],
    lw: 8,
    lh: 10,
    hat: [-2, 0.75],
    et: "",
    my: 0,
  },
  clover: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="21" cy="19" r="10.5" fill="' +
      c +
      '"/><circle cx="35" cy="19" r="10.5" fill="' +
      c +
      '"/><circle cx="21" cy="33" r="10.5" fill="' +
      c +
      '"/><circle cx="35" cy="33" r="10.5" fill="' +
      c +
      '"/><rect x="19" y="17" width="18" height="18" fill="' +
      c +
      '"/>',
    tp: (c) =>
      '<path d="M12.5 34A10.5 10.5 0 0 0 28 41.5A10.5 10.5 0 0 0 43.5 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [17, 42],
      [31, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [1, 0.85],
    et: "",
    my: 0,
  },
  shell: {
    bx: [11, 45],
    bd: (c) =>
      '<path d="M28 8C15 8 8 18 10 30C11.5 38 18 44 28 44C38 44 44.5 38 46 30C48 18 41 8 28 8Z" fill="' +
      c +
      '"/><path d="M28 10V42M20 12L24 42M36 12L32 42" stroke="rgba(255,255,255,.22)" stroke-width="1.4" stroke-linecap="round"/>',
    tp: (c) =>
      '<path d="M11 34C13 40 19 44 28 44C37 44 43 40 45 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 10],
    st: [
      [13.5, 37, 29],
      [17.5, 41, 21],
    ],
    arm: [
      [3, 23],
      [43, 23],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  snowflake: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 33,14 43,12 40,21 47,26 40,31 43,40 33,38 28,46 23,38 13,40 16,31 9,26 16,21 13,12 23,14" fill="' +
      c +
      '"/>',
    tp: (c) =>
      '<polygon points="15,34 41,34 43,40 33,38 28,46 23,38 13,40" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 11],
    st: [[16, 37, 24]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [17, 42],
      [31, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [-1, 0.8],
    et: "",
    my: 0,
  },
  sunburst: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,5 32,12 40,9 40,17 47,20 43,27 47,34 40,37 40,45 32,42 28,48 24,42 16,45 16,37 9,34 13,27 9,20 16,17 16,9 24,12" fill="' +
      c +
      '"/>',
    tp: (c) =>
      '<polygon points="14,34 42,34 40,45 32,42 28,48 24,42 16,45" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 12],
    st: [[16, 37, 24]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [17, 43],
      [31, 43],
    ],
    lw: 8,
    lh: 11,
    hat: [-1, 0.8],
    et: "",
    my: 0,
  },
  acorn: {
    bx: [12, 44],
    bd: (c) =>
      '<path d="M13 21H43C43 35 36 44 28 45C20 44 13 35 13 21Z" fill="' +
      c +
      '"/><path d="M10 18C10 11 18 8 28 8C38 8 46 11 46 18V21H10Z" fill="' +
      dk(c, 0.28) +
      '"/><rect x="26.5" y="4" width="3" height="5" rx="1.2" fill="' +
      dk(c, 0.38) +
      '"/>',
    tp: (c) =>
      '<path d="M14.5 33H41.5C39.5 40 34 44.5 28 45C22 44.5 16.5 40 14.5 33Z" fill="' +
      c +
      '"/>',
    zip: [27, 33, 2, 11],
    st: [
      [16, 36, 24],
      [19, 40, 18],
    ],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [18, 43],
      [30, 43],
    ],
    lw: 8,
    lh: 11,
    hat: [0, 0.88],
    et: "translate(0 2)",
    my: 2,
  },
  starshape: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 34.5,18.5 48,20.5 38,30 40.5,44 28,37.5 15.5,44 18,30 8,20.5 21.5,18.5" fill="' +
      c +
      '"/>',
    tp: (c) =>
      '<polygon points="17.2,34 38.8,34 40.5,44 28,37.5 15.5,44" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 4],
    st: [[17, 36.5, 22]],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [17, 41],
      [31, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [-1, 0.72],
    et: "translate(0 1)",
    my: 1,
  },
  gem: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="18,8 38,8 47,20 28,45 9,20" fill="' +
      c +
      '"/><polygon points="18,8 38,8 34,20 22,20" fill="rgba(255,255,255,.22)"/><polygon points="22,20 34,20 28,45" fill="rgba(255,255,255,.12)"/>',
    tp: (c) => '<polygon points="18.8,33 37.2,33 28,45" fill="' + c + '"/>',
    zip: [27, 33, 2, 11],
    st: [[20.5, 35.5, 15]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.82],
    et: "translate(0 -1)",
    my: -1,
  },
  cloudshape: {
    bx: [11, 45],
    bd: (c) =>
      '<circle cx="17" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="39" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="24" cy="19" r="10.5" fill="' +
      c +
      '"/><circle cx="34" cy="21" r="9.5" fill="' +
      c +
      '"/><rect x="16" y="24" width="24" height="14" rx="6" fill="' +
      c +
      '"/>',
    tp: (c) =>
      '<path d="M10.5 34H45.5A8.5 8.5 0 0 1 37 39H19A8.5 8.5 0 0 1 10.5 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 5],
    st: [[13, 36.5, 30]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 38],
      [30, 38],
    ],
    lw: 8,
    lh: 14,
    hat: [1, 0.85],
    et: "translate(0 1)",
    my: 1,
  },
  duck: {
    bx: [12, 44],
    bd: (c) => '<ellipse cx="28" cy="28" rx="17" ry="16" fill="' + c + '"/>',
    tp: (c) => '<path d="M12.2 34A17 16 0 0 0 43.8 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 10],
    st: [
      [13.9, 37, 28.2],
      [18.1, 41, 19.8],
    ],
    arm: [
      [4, 24],
      [42, 24],
    ],
    ls: [
      [20, 43],
      [32, 43],
    ],
    lw: 3,
    lh: 7,
    hat: [4, 0.8],
    et: "translate(0 -3)",
    my: 0,
  },

  // Distinct Planet-Themed & Planet-As-Buddy Geometries
  rocketbud: {
    bx: [14, 42],
    bd: (c) =>
      '<path d="M28 4C19 13 15 24 15 36H41C41 24 37 13 28 4Z" fill="' +
      c +
      '"/><polygon points="15,30 8,42 15,40" fill="' +
      dk(c, 0.25) +
      '"/><polygon points="41,30 48,42 41,40" fill="' +
      dk(c, 0.25) +
      '"/><rect x="21" y="36" width="14" height="6" rx="2" fill="#555"/>',
    tp: (c) => '<rect x="16" y="31" width="24" height="5" fill="' + c + '"/>',
    zip: [27, 31, 2, 5],
    st: [[16, 33.5, 24]],
    arm: [
      [5, 24],
      [41, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 11,
    hat: [0, 0.7],
    et: "translate(0 1)",
    my: 1,
  },
  craterbud: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="' +
      c +
      '"/><circle cx="21" cy="20" r="3" fill="' +
      dk(c, 0.3) +
      '"/><circle cx="35" cy="28" r="4" fill="' +
      dk(c, 0.3) +
      '"/><circle cx="25" cy="34" r="2.5" fill="' +
      dk(c, 0.3) +
      '"/>',
    tp: (c) => '<path d="M12 34A16 16 0 0 0 44 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  frostorb: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 33,15 45,15 35,22 39,34 28,27 17,34 21,22 11,15 23,15" fill="' +
      c +
      '"/><circle cx="28" cy="23" r="6" fill="#fff" opacity=".5"/>',
    tp: (c) => '<polygon points="17,34 39,34 28,27" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[16, 36, 24]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 41],
      [30, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  solardome: {
    bx: [12, 44],
    bd: (c) =>
      '<path d="M12 28A16 18 0 0 1 44 28V42H12Z" fill="' +
      c +
      '"/><path d="M14 26A14 14 0 0 1 42 26Z" fill="rgba(255,255,255,.45)"/><line x1="28" y1="10" x2="28" y2="42" stroke="' +
      dk(c, 0.4) +
      '" stroke-width="1.2"/>',
    tp: (c) => '<rect x="12" y="34" width="32" height="8" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[12, 37, 32]],
    arm: [
      [3, 24],
      [43, 24],
    ],
    ls: [
      [16, 42],
      [32, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "translate(0 2)",
    my: 2,
  },
  dustcore: {
    bx: [12, 44],
    bd: (c) =>
      '<path d="M13 21H43C43 35 36 44 28 45C20 44 13 35 13 21Z" fill="' +
      c +
      '"/><path d="M14 24Q28 18 42 24" stroke="' +
      dk(c, 0.35) +
      '" stroke-width="2" fill="none"/><path d="M16 30Q28 24 40 30" stroke="' +
      dk(c, 0.35) +
      '" stroke-width="2" fill="none"/>',
    tp: (c) =>
      '<path d="M14.5 33H41.5C39.5 40 34 44.5 28 45C22 44.5 16.5 40 14.5 33Z" fill="' +
      c +
      '"/>',
    zip: [27, 33, 2, 11],
    st: [[16, 36, 24]],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [18, 43],
      [30, 43],
    ],
    lw: 8,
    lh: 11,
    hat: [0, 0.88],
    et: "",
    my: 1,
  },
  phobos: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="24" r="14" fill="' +
      c +
      '"/><circle cx="22" cy="18" r="3.5" fill="#fff3b0"/><circle cx="34" cy="28" r="2.5" fill="#fff3b0"/>',
    tp: (c) => '<path d="M14 32A14 14 0 0 0 42 32Z" fill="' + c + '"/>',
    zip: [27, 32, 2, 8],
    st: [[16, 35, 24]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 41],
      [30, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  marsgem: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="18,8 38,8 47,20 28,45 9,20" fill="' +
      c +
      '"/><polygon points="28,12 36,22 28,40 20,22" fill="rgba(255,255,255,.35)"/>',
    tp: (c) => '<polygon points="18.8,33 37.2,33 28,45" fill="' + c + '"/>',
    zip: [27, 33, 2, 11],
    st: [[20.5, 35.5, 15]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.82],
    et: "translate(0 -1)",
    my: -1,
  },
  aerowing: {
    bx: [13, 43],
    bd: (c) =>
      '<path d="M28 6L46 32H10Z" fill="' +
      c +
      '"/><rect x="23" y="32" width="10" height="10" fill="' +
      dk(c, 0.25) +
      '"/>',
    tp: (c) => '<rect x="18" y="36" width="20" height="6" fill="' + c + '"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [6, 24],
      [42, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 10,
    hat: [0, 0.75],
    et: "",
    my: 1,
  },

  stormeye: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="' +
      c +
      '"/><ellipse cx="28" cy="20" rx="12" ry="3" fill="' +
      dk(c, 0.3) +
      '"/><ellipse cx="28" cy="28" rx="14" ry="3" fill="' +
      dk(c, 0.3) +
      '"/><ellipse cx="28" cy="36" rx="10" ry="2.5" fill="' +
      dk(c, 0.3) +
      '"/>',
    tp: (c) => '<path d="M12 34A16 16 0 0 0 44 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  tidepod: {
    bx: [12, 44],
    bd: (c) =>
      '<path d="M14 16C14 10 20 8 28 8C36 8 42 10 42 16V36C42 42 36 44 28 44C20 44 14 42 14 36Z" fill="' +
      c +
      '"/><circle cx="28" cy="26" r="6" fill="#7fd49a" opacity=".85"/>',
    tp: (c) => '<rect x="14" y="34" width="28" height="10" fill="' + c + '"/>',
    zip: [27, 34, 2, 10],
    st: [[14, 38, 28]],
    arm: [
      [3, 23],
      [43, 23],
    ],
    ls: [
      [17, 44],
      [31, 44],
    ],
    lw: 8,
    lh: 10,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  cryocube: {
    bx: [12, 44],
    bd: (c) =>
      '<rect x="12" y="10" width="32" height="32" rx="4" fill="' +
      c +
      '"/><rect x="16" y="14" width="24" height="24" rx="2" fill="rgba(255,255,255,.45)"/>',
    tp: (c) => '<rect x="12" y="34" width="32" height="8" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[12, 37, 32]],
    arm: [
      [3, 24],
      [43, 24],
    ],
    ls: [
      [16, 42],
      [32, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "translate(0 2)",
    my: 2,
  },
  ionflare: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,4 34,16 46,18 36,27 39,40 28,33 17,40 20,27 10,18 22,16" fill="' +
      c +
      '"/><circle cx="28" cy="25" r="7" fill="#fff" opacity=".6"/>',
    tp: (c) =>
      '<polygon points="17,34 39,34 39,40 28,33 17,40" fill="' + c + '"/>',
    zip: [27, 34, 2, 6],
    st: [[18, 36, 20]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 41],
      [30, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  amberorb: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="' +
      c +
      '"/><path d="M16 22Q28 14 40 22" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><path d="M16 30Q28 22 40 30" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',
    tp: (c) => '<path d="M12 34A16 16 0 0 0 44 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  galilean: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="15" fill="' +
      c +
      '"/><circle cx="18" cy="16" r="3.5" fill="#fff"/><circle cx="38" cy="34" r="3" fill="#fff"/><circle cx="36" cy="16" r="2.5" fill="#fff"/>',
    tp: (c) => '<path d="M13 34A15 15 0 0 0 43 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[15, 37, 26]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  jovian: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="18,8 38,8 47,20 28,45 9,20" fill="' +
      c +
      '"/><ellipse cx="28" cy="24" rx="12" ry="4" fill="rgba(255,255,255,.3)"/>',
    tp: (c) => '<polygon points="18.8,33 37.2,33 28,45" fill="' + c + '"/>',
    zip: [27, 33, 2, 11],
    st: [[20.5, 35.5, 15]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.82],
    et: "translate(0 -1)",
    my: -1,
  },
  stratos: {
    bx: [11, 45],
    bd: (c) =>
      '<rect x="12" y="16" width="32" height="20" rx="10" fill="' +
      c +
      '"/><circle cx="28" cy="26" r="6" fill="#fff" opacity=".5"/>',
    tp: (c) =>
      '<path d="M12 32H44V36A8 8 0 0 1 36 44H20A8 8 0 0 1 12 36Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },

  ringling: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="15" fill="' +
      c +
      '"/><ellipse cx="28" cy="28" rx="24" ry="5.5" transform="rotate(-14 28 28)" fill="none" stroke="#ffe49e" stroke-width="3.2"/>',
    tp: (c) => '<path d="M14 33A15 15 0 0 0 42 33Z" fill="' + c + '"/>',
    zip: [27, 33, 2, 8],
    st: [[16, 36, 24]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [19, 41],
      [29, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  titanwave: {
    bx: [11, 45],
    bd: (c) =>
      '<path d="M28 8C15 8 8 18 10 30C11.5 38 18 44 28 44C38 44 44.5 38 46 30C48 18 41 8 28 8Z" fill="' +
      c +
      '"/><path d="M12 26Q28 20 44 26" stroke="#fff" stroke-width="2.5" fill="none"/><path d="M12 33Q28 27 44 33" stroke="#fff" stroke-width="2.5" fill="none"/>',
    tp: (c) =>
      '<path d="M11 34C13 40 19 44 28 44C37 44 43 40 45 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 10],
    st: [[13.5, 37, 29]],
    arm: [
      [3, 23],
      [43, 23],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  enceladus: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="' +
      c +
      '"/><path d="M28 10V20M24 14L32 16" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<path d="M12 34A16 16 0 0 0 44 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  goldhalo: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="15" fill="' +
      c +
      '"/><circle cx="28" cy="26" r="19" fill="none" stroke="#ffe27a" stroke-width="2.5" stroke-dasharray="4 2"/>',
    tp: (c) => '<path d="M13 34A15 15 0 0 0 43 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[15, 37, 26]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  duskring: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="15" fill="' +
      c +
      '"/><ellipse cx="28" cy="28" rx="22" ry="5" transform="rotate(15 28 28)" fill="none" stroke="#f0c14b" stroke-width="3"/>',
    tp: (c) => '<path d="M13 34A15 15 0 0 0 43 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[15, 37, 26]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  cassini: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 34.5,18.5 48,20.5 38,30 40.5,44 28,37.5 15.5,44 18,30 8,20.5 21.5,18.5" fill="' +
      c +
      '"/><ellipse cx="28" cy="26" rx="20" ry="4.5" fill="none" stroke="#ffe27a" stroke-width="2.5"/>',
    tp: (c) =>
      '<polygon points="17.2,34 38.8,34 40.5,44 28,37.5 15.5,44" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 4],
    st: [[17, 36.5, 22]],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [17, 41],
      [31, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [-1, 0.72],
    et: "",
    my: 1,
  },
  ringgem: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="18,8 38,8 47,20 28,45 9,20" fill="' +
      c +
      '"/><ellipse cx="28" cy="26" rx="22" ry="5" transform="rotate(-10 28 26)" fill="none" stroke="#ffe27a" stroke-width="3"/>',
    tp: (c) => '<polygon points="18.8,33 37.2,33 28,45" fill="' + c + '"/>',
    zip: [27, 33, 2, 11],
    st: [[20.5, 35.5, 15]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.82],
    et: "translate(0 -1)",
    my: -1,
  },
  cloudring: {
    bx: [11, 45],
    bd: (c) =>
      '<circle cx="17" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="39" cy="29" r="9" fill="' +
      c +
      '"/><ellipse cx="28" cy="28" rx="22" ry="5" fill="none" stroke="#ffe27a" stroke-width="3"/>',
    tp: (c) =>
      '<path d="M10.5 34H45.5A8.5 8.5 0 0 1 37 39H19A8.5 8.5 0 0 1 10.5 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 5],
    st: [[13, 36.5, 30]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 38],
      [30, 38],
    ],
    lw: 8,
    lh: 14,
    hat: [1, 0.85],
    et: "",
    my: 1,
  },

  cyanmist: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="' +
      c +
      '"/><path d="M12 20Q28 14 44 20" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="3" stroke-linecap="round"/>',
    tp: (c) => '<path d="M12 34A16 16 0 0 0 44 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  miranda: {
    bx: [11, 45],
    bd: (c) =>
      '<path d="M28 8C15 8 8 18 10 30C11.5 38 18 44 28 44C38 44 44.5 38 46 30C48 18 41 8 28 8Z" fill="' +
      c +
      '"/><polygon points="28,14 33,26 23,26" fill="#fff" opacity=".85"/>',
    tp: (c) =>
      '<path d="M11 34C13 40 19 44 28 44C37 44 43 40 45 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 10],
    st: [[13.5, 37, 29]],
    arm: [
      [3, 23],
      [43, 23],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  glacier: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 40,16 36,40 20,40 16,16" fill="' +
      c +
      '"/><path d="M28 6V40M20 22L36 22" stroke="rgba(255,255,255,.4)" stroke-width="2"/>',
    tp: (c) => '<polygon points="16,34 36,34 36,40 20,40" fill="' + c + '"/>',
    zip: [27, 34, 2, 6],
    st: [[18, 36, 20]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 41],
      [30, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  auroradisk: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="' +
      c +
      '"/><ellipse cx="28" cy="26" rx="20" ry="7" fill="none" stroke="#4cae6a" stroke-width="3" stroke-dasharray="6 3"/>',
    tp: (c) => '<path d="M12 34A16 16 0 0 0 44 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  oberon: {
    bx: [12, 44],
    bd: (c) =>
      '<path d="M13 21H43C43 35 36 44 28 45C20 44 13 35 13 21Z" fill="' +
      c +
      '"/><circle cx="28" cy="26" r="7" fill="#3fa35d"/>',
    tp: (c) =>
      '<path d="M14.5 33H41.5C39.5 40 34 44.5 28 45C22 44.5 16.5 40 14.5 33Z" fill="' +
      c +
      '"/>',
    zip: [27, 33, 2, 11],
    st: [[16, 36, 24]],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [18, 43],
      [30, 43],
    ],
    lw: 8,
    lh: 11,
    hat: [0, 0.88],
    et: "",
    my: 1,
  },
  arielstar: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 34.5,18.5 48,20.5 38,30 40.5,44 28,37.5 15.5,44 18,30 8,20.5 21.5,18.5" fill="' +
      c +
      '"/><circle cx="28" cy="26" r="5" fill="#a8f5ff"/>',
    tp: (c) =>
      '<polygon points="17.2,34 38.8,34 40.5,44 28,37.5 15.5,44" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 4],
    st: [[17, 36.5, 22]],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [17, 41],
      [31, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [-1, 0.72],
    et: "",
    my: 1,
  },
  iceprism: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="18,8 38,8 47,20 28,45 9,20" fill="' +
      c +
      '"/><line x1="28" y1="8" x2="28" y2="45" stroke="#fff" stroke-width="2"/>',
    tp: (c) => '<polygon points="18.8,33 37.2,33 28,45" fill="' + c + '"/>',
    zip: [27, 33, 2, 11],
    st: [[20.5, 35.5, 15]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.82],
    et: "translate(0 -1)",
    my: -1,
  },
  breezepuff: {
    bx: [11, 45],
    bd: (c) =>
      '<circle cx="17" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="39" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="24" cy="19" r="10.5" fill="' +
      c +
      '"/><path d="M14 26Q28 20 42 26" stroke="#fff" stroke-width="2" fill="none"/>',
    tp: (c) =>
      '<path d="M10.5 34H45.5A8.5 8.5 0 0 1 37 39H19A8.5 8.5 0 0 1 10.5 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 5],
    st: [[13, 36.5, 30]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 38],
      [30, 38],
    ],
    lw: 8,
    lh: 14,
    hat: [1, 0.85],
    et: "",
    my: 1,
  },

  triton: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="15" fill="' +
      c +
      '"/><path d="M20 18L28 12L36 18" stroke="#ff8aa8" stroke-width="3" fill="none" stroke-linecap="round"/>',
    tp: (c) => '<path d="M13 34A15 15 0 0 0 43 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[15, 37, 26]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  abyssfin: {
    bx: [11, 45],
    bd: (c) =>
      '<path d="M28 8C15 8 8 18 10 30C11.5 38 18 44 28 44C38 44 44.5 38 46 30C48 18 41 8 28 8Z" fill="' +
      c +
      '"/><path d="M8 20L4 14L10 24Z" fill="#2f5fb3"/><path d="M48 20L52 14L46 24Z" fill="#2f5fb3"/>',
    tp: (c) =>
      '<path d="M11 34C13 40 19 44 28 44C37 44 43 40 45 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 10],
    st: [[13.5, 37, 29]],
    arm: [
      [3, 23],
      [43, 23],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  cometice: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 33,14 43,12 40,21 47,26 40,31 43,40 33,38 28,46 23,38 13,40 16,31 9,26 16,21 13,12 23,14" fill="' +
      c +
      '"/><path d="M28 20L36 32H20Z" fill="#70a8d8"/>',
    tp: (c) =>
      '<polygon points="15,34 41,34 43,40 33,38 28,46 23,38 13,40" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 11],
    st: [[16, 37, 24]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [17, 42],
      [31, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [-1, 0.8],
    et: "",
    my: 0,
  },
  blueflare: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,5 32,12 40,9 40,17 47,20 43,27 47,34 40,37 40,45 32,42 28,48 24,42 16,45 16,37 9,34 13,27 9,20 16,17 16,9 24,12" fill="' +
      c +
      '"/><circle cx="28" cy="26" r="6" fill="#fff3b0"/>',
    tp: (c) =>
      '<polygon points="14,34 42,34 40,45 32,42 28,48 24,42 16,45" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 12],
    st: [[16, 37, 24]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [17, 43],
      [31, 43],
    ],
    lw: 8,
    lh: 11,
    hat: [-1, 0.8],
    et: "",
    my: 0,
  },
  nebula: {
    bx: [11, 45],
    bd: (c) =>
      '<circle cx="17" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="39" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="24" cy="19" r="10.5" fill="' +
      c +
      '"/><circle cx="34" cy="21" r="9.5" fill="' +
      c +
      '"/><path d="M20 20Q28 32 36 20" stroke="#ffb300" stroke-width="2.5" fill="none"/>',
    tp: (c) =>
      '<path d="M10.5 34H45.5A8.5 8.5 0 0 1 37 39H19A8.5 8.5 0 0 1 10.5 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 5],
    st: [[13, 36.5, 30]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 38],
      [30, 38],
    ],
    lw: 8,
    lh: 14,
    hat: [1, 0.85],
    et: "",
    my: 1,
  },
  pulsar: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 34.5,18.5 48,20.5 38,30 40.5,44 28,37.5 15.5,44 18,30 8,20.5 21.5,18.5" fill="' +
      c +
      '"/><line x1="12" y1="26" x2="44" y2="26" stroke="#fff" stroke-width="3"/><line x1="28" y1="10" x2="28" y2="42" stroke="#fff" stroke-width="3"/>',
    tp: (c) =>
      '<polygon points="17.2,34 38.8,34 40.5,44 28,37.5 15.5,44" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 4],
    st: [[17, 36.5, 22]],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [17, 41],
      [31, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [-1, 0.72],
    et: "",
    my: 1,
  },
  sapphire: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="18,8 38,8 47,20 28,45 9,20" fill="' +
      c +
      '"/><circle cx="28" cy="24" r="8" fill="#8ff5ee" opacity=".7"/>',
    tp: (c) => '<polygon points="18.8,33 37.2,33 28,45" fill="' + c + '"/>',
    zip: [27, 33, 2, 11],
    st: [[20.5, 35.5, 15]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.82],
    et: "translate(0 -1)",
    my: -1,
  },
  cosmo: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,4 34,16 47,16 37,25 41,38 28,31 15,38 19,25 9,16 22,16" fill="' +
      c +
      '"/><circle cx="28" cy="23" r="11" fill="#ffb300"/><path d="M22 23L26 27L34 19" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>',
    tp: (c) =>
      '<rect x="18" y="33" width="20" height="7" rx="3" fill="' + c + '"/>',
    zip: [27, 33, 2, 7],
    st: [[19, 36, 18]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 40],
      [30, 40],
    ],
    lw: 8,
    lh: 13,
    hat: [-2, 0.75],
    et: "",
    my: 0,
  },

  earthplanet: {
    bx: [10, 46],
    bd: (c) =>
      '<circle cx="28" cy="26" r="18" fill="#3a95e0"/><path d="M12 20Q18 14 26 22T38 18T42 32Q36 40 24 36T14 28Z" fill="#3aa35d"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<rect x="16" y="36" width="24" height="6" fill="#2b7cd3"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  marsplanet: {
    bx: [10, 46],
    bd: (c) =>
      '<circle cx="28" cy="26" r="18" fill="#d95830"/><circle cx="20" cy="18" r="4" fill="#a83a1a"/><circle cx="36" cy="30" r="5" fill="#a83a1a"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<rect x="16" y="36" width="24" height="6" fill="#b03e1c"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  jupiterplanet: {
    bx: [10, 46],
    bd: (c) =>
      '<circle cx="28" cy="26" r="18" fill="#d98a3c"/><ellipse cx="28" cy="16" rx="14" ry="3" fill="#c2722b"/><ellipse cx="28" cy="24" rx="16" ry="3.5" fill="#f0c684"/><ellipse cx="28" cy="33" rx="12" ry="3" fill="#c2722b"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<rect x="16" y="36" width="24" height="6" fill="#b57228"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  saturnplanet: {
    bx: [10, 46],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="#d9b35a"/><ellipse cx="28" cy="28" rx="25" ry="5.5" transform="rotate(-15 28 28)" fill="none" stroke="#ffe49e" stroke-width="4"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<rect x="16" y="36" width="24" height="6" fill="#c49c48"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  uranusplanet: {
    bx: [10, 46],
    bd: (c) =>
      '<circle cx="28" cy="26" r="18" fill="#46b8cc"/><ellipse cx="28" cy="26" rx="22" ry="5" transform="rotate(75 28 26)" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2.5"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<rect x="16" y="36" width="24" height="6" fill="#3296a8"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  neptuneplanet: {
    bx: [10, 46],
    bd: (c) =>
      '<circle cx="28" cy="26" r="18" fill="#2d5be0"/><path d="M16 20Q28 14 40 20T36 34Q28 40 20 34Z" fill="#193aa8"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<rect x="16" y="36" width="24" height="6" fill="#1d3fbc"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
};
