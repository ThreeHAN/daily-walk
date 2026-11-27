const birds = [
  { y: 45, delay: "-5s", stillX: "65px", body: "#3a6e9a", dark: "#264b70", wing: "#73a9c7" },
  { y: 70, delay: "-37s", stillX: "170px", body: "#ba443a", dark: "#7c282d", wing: "#e0755c", crest: true },
  { y: 86, delay: "-69s", stillX: "270px", body: "#d4a533", dark: "#5b4933", wing: "#f0d26c" },
];

export function TownBirds() {
  return birds.map((bird) => (
    <g key={bird.y} transform={"translate(0 " + bird.y + ")"}>
      <g className="fly" style={{ animationDelay: bird.delay, "--still-x": bird.stillX }}>
        <path d="M7 0H4V-3H0v-3h4v2h4z" fill={bird.dark} />
        {bird.crest && <path d="M19-7v-4h3v2h2v3z" fill={bird.dark} />}
        <path className="bird-body" d="M5-3h4v-2h10v-2h5v2h2v7h-3v3H9V3H5z" fill={bird.body} />
        <path className="bird-belly" d="M9 2h13v3H9z" fill="#e5d7b4" />
        <path d="M26-3h4v2h-4z" fill="#eaa842" />
        <path d="M23-4h2v2h-2z" fill="#101d2c" />
        <g className="flap">
          <path d="M8 1V-3H6v-5H4v-3h5v2h3v2h3v3h2v5z" fill={bird.dark} />
          <path d="M7-8h2v2h3v3h3v2h-4v-2H9v-2H7z" fill={bird.wing} />
        </g>
      </g>
    </g>
  ));
}
