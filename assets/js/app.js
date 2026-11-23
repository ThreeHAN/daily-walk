const DEFAULTS=[
{id:"wake",g:"morning",t:"Wake up on time",s:"Give God the first minutes",tip:"Give God your first thoughts before your phone. Psalm 5:3 talks about bringing your morning to Him and waiting expectantly. Pray something simple like “This day is Yours.” Discipline is a way of showing up for the day God gave you."},
{id:"water",g:"nutrition",t:"Drink water",s:"Stay hydrated",tip:"Let each sip be a quick thank-you to God. Jesus spoke of living water (John 4:14), so pray “Fill me, Lord.” Caring for your body is stewardship (1 Corinthians 6:19–20)."},
{id:"stretch",g:"exercise",t:"Do stretches",s:"Loosen up and breathe",tip:"Stretching is a quiet moment to slow down. Breathe in, pray a line like “The Lord is my shepherd” (Psalm 23), and breathe out worry. Thank Him for a body that moves (Psalm 139:14)."},
{id:"cold",g:"morning",t:"Cold shower",s:"Train self-control",tip:"Doing something hard on purpose is practice in self-control, a fruit of the Spirit (Galatians 5:22–23). Pray “God, give me strength” through the first thirty seconds. Do it as discipline, not to prove yourself. Your worth is already settled in Christ."},
{id:"bfast",g:"nutrition",m:[5,11],t:"Breakfast",s:"Morning · start the day nourished",tip:"Start the day with thanks. Pray before you eat and choose something that fuels you, like protein, fruit, or whole grains. Jesus called Himself the bread of life (John 6:35), so let this meal remind you He is all you need."},
{id:"lunch",g:"nutrition",m:[11,15],t:"Lunch",s:"Midday · pause and refuel",tip:"Pause in the middle of the day to thank God for the morning. Eat slowly and enjoy it, and share a table if you can. Acts 2:46 describes believers eating together with glad and sincere hearts."},
{id:"dinner",g:"nutrition",m:[16,21],t:"Dinner",s:"Evening · end the day with gratitude",tip:"Close the day with gratitude. Give thanks, eat until you are satisfied, and name one blessing from today. Psalm 136:1 reminds us to give thanks to the LORD, for He is good."},
{id:"eat",g:"nutrition",t:"Eat healthy",s:"Fuel your body well",tip:"Your body is a gift, so caring for it is a way of thanking God (1 Corinthians 6:19–20). Pray before you eat and choose food with gratitude, not guilt. 1 Corinthians 10:31 says to do even eating and drinking for His glory."},
{id:"room",g:"cleaning",t:"Clean my room",s:"Make space that’s peaceful",tip:"Order reflects a God of peace (1 Corinthians 14:33). Put on worship music, pray for whoever will walk into this space, and do it “as for the Lord” (Colossians 3:23). A tidy place makes room for rest, prayer, and hospitality."},
{id:"run",g:"exercise",t:"Run / exercise",s:"Strength for serving",tip:"Strength helps you serve others longer (1 Timothy 4:8). Use your run as prayer time: pray for a person on each lap or mile and thank God for a body that moves. The effort teaches perseverance (Hebrews 12:1)."},
{id:"pray",g:"faith",t:"Pray & read Scripture",s:"Start with God",tip:"Even five quiet minutes counts. Read a short passage, ask God what He is saying, and pray for one person by name. Consistency matters more than length."},
{id:"good",g:"faith",t:"Do something good for someone",s:"Small kindness counts",tip:"Galatians 6:10 says to do good to everyone as you have the chance. Jesus said serving others is serving Him (Matthew 25:40), so small kindnesses are real worship."}
];
const K_LEGACY="dailywalk_admin_max:legacy";
const K_USERS="dailywalk_admin_max:users:v3";
const K_CUR="dailywalk_admin_max:cur:v3";
const uKey=id=>"dailywalk_admin_max:u:"+id;
const dkey=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today=()=>dkey(new Date());

function freshState(userName){
 const days={},checks={},jr={},now=new Date();
 const allIds=DEFAULTS.map(d=>d.id);
 for(let i=0;i<365;i++){
  const dt=new Date(now);dt.setDate(dt.getDate()-i);
  const k=dkey(dt);
  days[k]=true;
  if(i>0){
   const dayC={};allIds.forEach(id=>{dayC[id]=true});
   checks[k]=dayC;
  }
  if(i<30)jr[k]="Day "+(365-i)+" of walking faithfully — every planet & town complete!";
 }
 const allNbXp={},allNbSeen={},allNbCel={};
 ["meadow","seaside","snowy","oasis","autumn","starlight","crystal","sky"].forEach(k=>{allNbXp[k]=3000;allNbSeen[k]=12;allNbCel[k]=1});
 ["mars_meadow","mars_seaside","mars_snowy","mars_oasis","mars_autumn","mars_starlight","mars_crystal","mars_sky"].forEach(k=>{allNbXp[k]=3000;allNbSeen[k]=12;allNbCel[k]=1});
 ["jupiter_meadow","jupiter_seaside","jupiter_snowy","jupiter_oasis","jupiter_autumn","jupiter_starlight","jupiter_crystal","jupiter_sky"].forEach(k=>{allNbXp[k]=3000;allNbSeen[k]=12;allNbCel[k]=1});
 ["saturn_meadow","saturn_seaside","saturn_snowy","saturn_oasis","saturn_autumn","saturn_starlight","saturn_crystal","saturn_sky"].forEach(k=>{allNbXp[k]=3000;allNbSeen[k]=12;allNbCel[k]=1});
 ["uranus_meadow","uranus_seaside","uranus_snowy","uranus_oasis","uranus_autumn","uranus_starlight","uranus_crystal","uranus_sky"].forEach(k=>{allNbXp[k]=3000;allNbSeen[k]=12;allNbCel[k]=1});
 ["neptune_meadow","neptune_seaside","neptune_snowy","neptune_oasis","neptune_autumn","neptune_starlight","neptune_crystal","neptune_sky"].forEach(k=>{allNbXp[k]=3000;allNbSeen[k]=12;allNbCel[k]=1});
 const allPets={firefly:1,chick:1,bunny:1,lamb:1,puppy:1,dove:1,kitten:1,turtle:1,owl:1,lion:1,astrobot:1,stardust:1,mooncat:1,cloudwhale:1,ringfox:1,saturnowl:1,iceaxolotl:1,cometpup:1,nebula:1};
 const allSeenK={square:1,circle:1,triangle:1,rectangle:1,clover:1,shell:1,snowflake:1,sunburst:1,acorn:1,starshape:1,gem:1,cloudshape:1,duck:1,rocketbud:1,craterbud:1,frostorb:1,solardome:1,dustcore:1,phobos:1,marsgem:1,aerowing:1,stormeye:1,tidepod:1,cryocube:1,ionflare:1,amberorb:1,galilean:1,jovian:1,stratos:1,ringling:1,titanwave:1,enceladus:1,goldhalo:1,duskring:1,cassini:1,ringgem:1,cloudring:1,cyanmist:1,miranda:1,glacier:1,auroradisk:1,oberon:1,arielstar:1,iceprism:1,breezepuff:1,triton:1,abyssfin:1,cometice:1,blueflare:1,nebula:1,pulsar:1,sapphire:1,cosmo:1,earthplanet:1,marsplanet:1,jupiterplanet:1,saturnplanet:1,uranusplanet:1,neptuneplanet:1};
 const gradList=[
  ["Square", "square", "orange", "tophat", "jacket", "blue"],
  ["Circle", "circle", "blue", "cap", "tee", "green"],
  ["Triangle", "triangle", "green", "cowboy", "stripes", "yellow"],
  ["Rectangle", "rectangle", "purple", "wizard", "jacket", "purple"],
  ["Clover", "clover", "green", "halo", "tee", "green"],
  ["Scallop", "shell", "blue", "phones", "stripes", "blue"],
  ["Crystal", "snowflake", "blue", "beanie", "jacket", "blue"],
  ["Sunburst", "sunburst", "yellow", "crown", "tee", "yellow"],
  ["Acorn", "acorn", "orange", "cowboy", "jacket", "red"],
  ["Starlight", "starshape", "purple", "wizard", "cape", "purple"],
  ["Gem", "gem", "blue", "tophat", "jacket", "blue"],
  ["Sky Puff", "cloudshape", "pink", "party", "tee", "pink"],
  ["Astro Rocket", "rocketbud", "orange", "wizard", "jacket", "red"],
  ["Storm Eye", "stormeye", "yellow", "crown", "jacket", "purple"],
  ["Ringlet", "ringling", "yellow", "halo", "tee", "yellow"],
  ["Cyan Mist", "cyanmist", "blue", "phones", "jacket", "blue"],
  ["Golden Duck", "duck", "yellow", "crown", "jacket", "purple"]
 ];
 const residents=gradList.map((g,idx)=>({
  n:g[0],
  l:{kind:g[1],hat:g[3],topStyle:g[4]==="cape"?"tee":g[4],topColor:g[5],pants:"black",shoes:"white",eyes:"happy",glasses:"shades",mouth:"smile",body:g[2],pet:"none",ex:g[4]==="cape"?{cape:true}:{cheeks:true}},
  born:Date.now()-(365-idx*15)*864e5,
  clicks:80+idx*12,
  tasks:220+idx*15,
  gradAt:Date.now()-(340-idx*15)*864e5
 }));
 return{
  v:3,
  createdAt:Date.now()-365*864e5,
  lastSaved:Date.now(),
  tasks:DEFAULTS.map(d=>({...d})),
  checks,
  days,
  p:{name:userName||"Admin",buddy:"Cosmo Legend",hat:"crown",topStyle:"jacket",topColor:"purple",pants:"black",shoes:"white",eyes:"happy",glasses:"shades",mouth:"smile",body:"yellow",kind:"cosmo",pet:"nebula",ex:{scarf:true,bowtie:true,cape:true,backpack:true,cheeks:true}},
  pets:allPets,
  water:{d:today(),n:8},
  jr,
  xp:99999,
  life:144000,
  aw:{d:today(),k:{}},
  res:residents,
  nb:{planet:"neptune",vplanet:"neptune",cur:"neptune_sky",view:"neptune_sky",xp:allNbXp,seen:allNbSeen,cel:allNbCel,pcel:{earth:1,mars:1,jupiter:1,saturn:1,uranus:1,neptune:1}},
  seenK:allSeenK,
  bs:{born:Date.now()-365*864e5,clicks:999,tasks:4368},
  tseen:12,
  splash:"",
  vday:""
 };
}

function hydrateState(raw){
 const base=freshState("");
 const s=(raw&&typeof raw==="object")?Object.assign(base,raw):base;
 if(!Array.isArray(s.tasks)||!s.tasks.length)s.tasks=DEFAULTS.map(d=>({...d}));
 DEFAULTS.forEach(d=>{const t=s.tasks.find(x=>x.id===d.id);if(t){t.g=d.g;if(d.m)t.m=d.m}else s.tasks.push({...d})});
 s.checks=s.checks&&typeof s.checks==="object"?s.checks:{};
 s.days=s.days&&typeof s.days==="object"?s.days:{};
 s.days[today()]=true;
 s.p=Object.assign(freshState("").p,s.p||{});
 if(s.p.jacket&&s.p.jacket!=="none"){s.p.topStyle="jacket";s.p.topColor=s.p.jacket}
 if(s.p.glasses===true)s.p.glasses="square";
 if(s.p.glasses===false)s.p.glasses="none";
 delete s.p.jacket;
 s.p.ex=s.p.ex&&typeof s.p.ex==="object"?s.p.ex:{};
 if(typeof s.p.pet!=="string")s.p.pet="none";
 s.pets=s.pets&&typeof s.pets==="object"?s.pets:{};
 s.water=s.water&&typeof s.water==="object"?s.water:{d:"",n:0};
 s.jr=s.jr&&typeof s.jr==="object"?s.jr:{};
 s.xp=Number(s.xp)||0;
 s.aw=s.aw&&typeof s.aw==="object"?s.aw:{d:"",k:{}};
 s.aw.k=s.aw.k&&typeof s.aw.k==="object"?s.aw.k:{};
 s.res=Array.isArray(s.res)?s.res:[];
 s.life=Math.max(Number(s.life)||0,s.xp);
 if(!s.nb||typeof s.nb!=="object"){
  s.nb={cur:"meadow",view:"meadow",xp:{meadow:s.life},seen:{},cel:{}};
  if(!s.life)s.nb.seen.meadow=0;
 }
 s.nb.xp=s.nb.xp&&typeof s.nb.xp==="object"?s.nb.xp:{meadow:s.life};
 s.nb.seen=s.nb.seen&&typeof s.nb.seen==="object"?s.nb.seen:{};
 s.nb.cel=s.nb.cel&&typeof s.nb.cel==="object"?s.nb.cel:{};
 s.nb.pcel=s.nb.pcel&&typeof s.nb.pcel==="object"?s.nb.pcel:{};
 if(!s.nb.planet)s.nb.planet="earth";
 if(!s.nb.vplanet)s.nb.vplanet=s.nb.planet;
 s.seenK=s.seenK&&typeof s.seenK==="object"?s.seenK:{};
 if(!s.bs||typeof s.bs!=="object"){
  let tc=0,mn=null;
  Object.keys(s.checks).forEach(d=>{const n=Object.values(s.checks[d]).filter(Boolean).length;if(n){tc+=n;if(!mn||d<mn)mn=d}});
  s.bs={born:mn?Date.parse(mn):Date.now(),clicks:0,tasks:tc};
 }
 s.tseen=Number(s.tseen)||0;
 s.lastSeen=Date.now();
 return s;
}

let USERS=[];
try{const ul=localStorage.getItem(K_USERS);if(ul)USERS=JSON.parse(ul)}catch(e){}
if(!Array.isArray(USERS))USERS=[];
let CUR_UID="";
try{CUR_UID=localStorage.getItem(K_CUR)||""}catch(e){}

let S;
if(!USERS.length){
 CUR_UID="u_"+Date.now();
 let legacy=null;
 try{const r=localStorage.getItem(K_LEGACY);if(r)legacy=JSON.parse(r)}catch(e){}
 S=hydrateState(legacy);
 USERS=[{id:CUR_UID,label:(S.p.name||"Admin"),updated:Date.now(),lv:1,streak:0}];
 try{localStorage.setItem(uKey(CUR_UID),JSON.stringify(S));localStorage.setItem(K_USERS,JSON.stringify(USERS));localStorage.setItem(K_CUR,CUR_UID)}catch(e){}
}else{
 if(!USERS.some(u=>u.id===CUR_UID))CUR_UID=USERS[0].id;
 let loaded=null;
 try{const r=localStorage.getItem(uKey(CUR_UID));if(r)loaded=JSON.parse(r)}catch(e){}
 S=hydrateState(loaded);
 try{localStorage.setItem(K_CUR,CUR_UID)}catch(e){}
}
const G=[{id:"morning",n:"Morning",e:"☀️",c:"#f5a623"},{id:"nutrition",n:"Nutrition",e:"🥗",c:"#4cae6a"},{id:"exercise",n:"Exercise",e:"🏃",c:"#e5624a"},{id:"cleaning",n:"Cleaning",e:"🧹",c:"#4a90d9"},{id:"faith",n:"Faith & Kindness",e:"🙏",c:"#9a6bd6"},{id:"more",n:"My Habits",e:"⭐",c:"#b8863b"}];
const $=id=>document.getElementById(id);
const ICONS={
check:'<rect x="2" y="2" width="20" height="20" rx="6" fill="#3f9d63"/><path d="M7 12.5l3.2 3.2L17 8.8" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
town:'<path d="M2 21V11.5l6-5 6 5V21z" fill="#f0c98a"/><path d="M1 12l7-6 7 6" stroke="#c0504d" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/><rect x="6" y="15" width="4" height="6" fill="#8b5a2b"/><path d="M14 21v-7.5l4-3.5 4 3.5V21z" fill="#cfe3f5"/><path d="M13 14l5-4.5 5 4.5" stroke="#3b6fd4" stroke-width="2.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>',
house:'<path d="M3.5 21V11l8.5-7 8.5 7v10z" fill="#f0c98a"/><path d="M2 12l10-8.5L22 12" stroke="#c0504d" stroke-width="2.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/><rect x="10" y="14" width="4.5" height="7" fill="#8b5a2b"/>',
user:'<circle cx="12" cy="8" r="4.3" fill="#6a8de0"/><path d="M3.5 21.5c0-5 3.8-7.5 8.5-7.5s8.5 2.5 8.5 7.5z" fill="#6a8de0"/>',
people:'<circle cx="8.5" cy="8" r="3.6" fill="#6a8de0"/><path d="M1.5 20c0-4.3 3-6.5 7-6.5s7 2.2 7 6.5z" fill="#6a8de0"/><circle cx="17" cy="9" r="3" fill="#f0a05a"/><path d="M13.5 14.2c1-.4 2-.5 3.5-.5 3.3 0 5.5 1.8 5.5 6.3h-7.3c0-2.4-.7-4.5-1.7-5.8z" fill="#f0a05a"/>',
star:'<path d="M12 2.4l2.9 6.4 7 .7-5.2 4.7 1.5 6.9L12 17.4 5.8 21.1l1.5-6.9L2.1 9.5l7-.7z" fill="#ffc83d" stroke="#e8a100" stroke-width="1.2" stroke-linejoin="round"/>',
flame:'<path d="M12 2c1 4 6.5 6.5 6.5 12.2a6.5 6.5 0 0 1-13 0c0-3.2 1.8-4.8 3-7.2 1 1.6 2 2.2 2.8 2.2C10.6 7.5 10.8 4.6 12 2z" fill="#ff6a1a"/><path d="M12 11.5c.9 2.5 3.6 3.2 3.6 6.2a3.6 3.6 0 0 1-7.2 0c0-1.8 1.3-2.8 2-4.2.5 1 1 1.2 1.6 1.2-.4-1.2-.4-2.2 0-3.2z" fill="#ffc933"/>',
trophy:'<path d="M7 3h10v6a5 5 0 0 1-10 0z" fill="#ffc83d"/><path d="M7 5H3.2c0 4 1.4 5.6 3.8 6M17 5h3.8c0 4-1.4 5.6-3.8 6" stroke="#e8a100" stroke-width="1.8" fill="none"/><rect x="10.5" y="13.5" width="3" height="4" fill="#e8a100"/><rect x="7.5" y="17" width="9" height="3.6" rx="1.2" fill="#e8a100"/>',
grad:'<path d="M12 4L1.5 9 12 14l10.5-5z" fill="#2b2622"/><path d="M6 11.6v4.4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.4l-6 3z" fill="#4a4a5a"/><path d="M21 9.5V15" stroke="#ffc83d" stroke-width="1.6" stroke-linecap="round"/><circle cx="21" cy="16" r="1.3" fill="#ffc83d"/>',
sun:'<circle cx="12" cy="12" r="5" fill="#ffc83d"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="#ff9d2e" stroke-width="2" stroke-linecap="round"/>',
sunrise:'<path d="M2 19h20" stroke="#e8941a" stroke-width="2" stroke-linecap="round"/><path d="M6.5 19a5.5 5.5 0 0 1 11 0z" fill="#ffb347"/><path d="M12 5v3M4.5 9l2 2M19.5 9l-2 2M2.5 14.5H5M19 14.5h2.5" stroke="#e8941a" stroke-width="1.8" stroke-linecap="round"/>',
sunset:'<path d="M2 19h20" stroke="#c9503a" stroke-width="2" stroke-linecap="round"/><path d="M6.5 19a5.5 5.5 0 0 1 11 0z" fill="#ff7a5a"/><path d="M12 8v2.5M5 11l1.8 1.8M19 11l-1.8 1.8" stroke="#c9503a" stroke-width="1.8" stroke-linecap="round"/><path d="M5 22h14" stroke="#e8a090" stroke-width="1.6" stroke-linecap="round"/>',
moon:'<path d="M16 3a9 9 0 1 0 5 15.5A7.5 7.5 0 0 1 16 3z" fill="#f4d675"/><circle cx="17.5" cy="6" r="1" fill="#fff3b0"/>',
salad:'<path d="M3 12h18c0 5-4 8-9 8s-9-3-9-8z" fill="#fff" stroke="#cfd8dc" stroke-width="1.2"/><circle cx="8" cy="9" r="3.6" fill="#4cae6a"/><circle cx="14" cy="8" r="4" fill="#6fcf7f"/><circle cx="17.5" cy="10.5" r="2.4" fill="#e5624a"/>',
runner:'<circle cx="14.5" cy="4.5" r="2.5" fill="#e5624a"/><path d="M13 8.5l-3 4 3.2 2.2-2.2 6M13 8.5l4.2 3 3-1M10 12.5l-4.5 1" stroke="#e5624a" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
broom:'<path d="M19.5 3L11.5 12" stroke="#8b5a2b" stroke-width="2.6" stroke-linecap="round"/><path d="M9 11l4.2 4.2-3.2 5.8H3.5l1.2-5.4z" fill="#f0c14b"/><path d="M6 17l2 2M8.5 14.5l2 2" stroke="#c9972a" stroke-width="1.2"/>',
pray:'<path d="M12 2.8c-2.4 3-4.4 5.4-4.4 8.8v5.4L12 20z" fill="#f6d2ac" stroke="#d9a574" stroke-width="1"/><path d="M12 2.8c2.4 3 4.4 5.4 4.4 8.8v5.4L12 20z" fill="#e8b98c" stroke="#d9a574" stroke-width="1"/><path d="M12 6v14" stroke="#d9a574" stroke-width="1"/><path d="M8.4 13l1.6 1.2M15.6 13L14 14.2" stroke="#d9a574" stroke-width="1" stroke-linecap="round"/><path d="M6.6 17h10.8l1.2 5H5.4z" fill="#6a8de0"/>',
drop:'<path d="M12 2.5C8 8 5.5 11 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 11 16 8 12 2.5z" fill="#4aa8ee"/><path d="M9 15a3 3 0 0 0 2.5 3" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"/>',
chart:'<rect x="3" y="13" width="4.5" height="8" rx="1.2" fill="#6a8de0"/><rect x="9.8" y="8" width="4.5" height="13" rx="1.2" fill="#4cae6a"/><rect x="16.5" y="3" width="4.5" height="18" rx="1.2" fill="#ffb347"/>',
book:'<path d="M12 6c-2-1.5-5-2-9-1.5V19c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V4.5C17 4 14 4.5 12 6z" fill="#fff" stroke="#8b5a2b" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 6v14.5" stroke="#8b5a2b" stroke-width="1.6"/><path d="M5.5 8.5c1.5 0 3 .2 4.5.8M5.5 11.5c1.5 0 3 .2 4.5.8M14 9.3c1.5-.6 3-.8 4.5-.8M14 12.3c1.5-.6 3-.8 4.5-.8" stroke="#cfa66b" stroke-width="1"/>',
shirt:'<path d="M8 3L2.5 6.5 5 10.3l2.5-1.3V21h9V9l2.5 1.3L21.5 6.5 16 3c-.5 1.8-2 2.8-4 2.8S8.5 4.8 8 3z" fill="#4a86d9"/>',
tophat:'<rect x="7" y="3" width="10" height="11" rx="1" fill="#2b2b2b"/><rect x="7" y="10" width="10" height="2.5" fill="#f0c14b"/><rect x="2.5" y="14" width="19" height="3.6" rx="1.6" fill="#2b2b2b"/>',
pants:'<path d="M7 3h10l1.6 18h-5.2L12 11l-1.4 10H5.4z" fill="#3b5fa8"/><path d="M7 6.5h10" stroke="#2c4a88" stroke-width="1.2"/>',
shades:'<rect x="2" y="8" width="8.5" height="6.5" rx="2.6" fill="#222"/><rect x="13.5" y="8" width="8.5" height="6.5" rx="2.6" fill="#222"/><path d="M10.5 10h3M2.5 9L1 7.5M21.5 9L23 7.5" stroke="#222" stroke-width="1.8" stroke-linecap="round"/><rect x="4" y="9.5" width="3" height="1.6" fill="#fff" opacity=".4"/>',
sparkle:'<path d="M11 2l2.3 7.7L21 12l-7.7 2.3L11 22l-2.3-7.7L1 12l7.7-2.3z" fill="#ffd23f"/><path d="M19 3l.9 2.6 2.6.9-2.6.9L19 10l-.9-2.6L15.5 6.5l2.6-.9z" fill="#ffb347"/>',
palette:'<path d="M12 3C6.5 3 2.5 7 2.5 12s4 9 9 9c1.8 0 2.5-1 2-2.2-.6-1.3.3-2.8 1.8-2.8H18c2 0 3.5-1.5 3.5-3.5C21.5 6.5 17.5 3 12 3z" fill="#e8c9a0"/><circle cx="7.5" cy="11" r="1.7" fill="#e5624a"/><circle cx="10.5" cy="7" r="1.7" fill="#ffd23f"/><circle cx="15.5" cy="7.5" r="1.7" fill="#4cae6a"/><circle cx="17.5" cy="12" r="1.7" fill="#4a86d9"/>',
cap:'<path d="M4 15a8 8 0 0 1 16 0z" fill="#2f5fb3"/><path d="M3 15h19c0 1.8-5 3-11 3-4 0-8-1-8-3z" fill="#244a8c"/><circle cx="12" cy="7.2" r="1" fill="#244a8c"/>',
crown:'<path d="M3 18L2.5 7l5 4 4.5-7 4.5 7 5-4L21 18z" fill="#f0c14b" stroke="#d9a21a" stroke-width="1.2" stroke-linejoin="round"/><rect x="3" y="18" width="18" height="2.6" rx="1" fill="#d9a21a"/>',
halo:'<ellipse cx="12" cy="5" rx="7" ry="2.2" fill="none" stroke="#f0c14b" stroke-width="2.2"/><circle cx="12" cy="14" r="7" fill="#ffd9a0"/><circle cx="9.6" cy="13" r="1" fill="#2b2622"/><circle cx="14.4" cy="13" r="1" fill="#2b2622"/><path d="M9.6 16.4q2.4 1.7 4.8 0" stroke="#2b2622" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
party:'<path d="M3 21L8.5 6.5l9 9z" fill="#e5509a"/><path d="M5.8 14l4.6 4.6" stroke="#fff" stroke-width="1.5"/><circle cx="16" cy="5" r="1.5" fill="#ffd23f"/><circle cx="20.5" cy="9.5" r="1.5" fill="#4cae6a"/><circle cx="19" cy="3" r="1" fill="#4a86d9"/><path d="M12 4l1 2M20 13l-2 .5" stroke="#e5509a" stroke-width="1.4" stroke-linecap="round"/>',
cowboy:'<path d="M7 4h10l1 9H6z" fill="#8b5a2b"/><path d="M2 14.5c3-2.2 6-2.4 10-2.4s7 .2 10 2.4c0 2.4-4 4-10 4S2 16.9 2 14.5z" fill="#a0692f"/><rect x="6.4" y="9" width="11.2" height="2" fill="#5a3a1a"/>',
wizard:'<path d="M12 2l7 17H5z" fill="#3a2a8a"/><rect x="2.5" y="18.5" width="19" height="3" rx="1.5" fill="#3a2a8a"/><circle cx="11" cy="10" r="1.2" fill="#f0c14b"/><circle cx="14.2" cy="14.5" r="1" fill="#f0c14b"/>',
phones:'<path d="M4 14v-2a8 8 0 0 1 16 0v2" fill="none" stroke="#333" stroke-width="2.4"/><rect x="2.5" y="13" width="5" height="8" rx="2" fill="#e5509a"/><rect x="16.5" y="13" width="5" height="8" rx="2" fill="#e5509a"/>',
scarf:'<path d="M3.5 6h17v5h-17z" fill="#c94a4a"/><path d="M14 11h5.5v10H14z" fill="#c94a4a"/><path d="M14 17h5.5" stroke="#fff" stroke-width="1.4" opacity=".6"/>',
bow:'<path d="M12 12L2.5 6v12zM12 12l9.5-6v12z" fill="#c94a4a"/><circle cx="12" cy="12" r="2.5" fill="#8f2f2f"/>',
cape:'<path d="M5 3h14l3 18H2z" fill="#7c4dbd"/><circle cx="12" cy="4" r="2.5" fill="#f0c14b"/>',
pack:'<rect x="5" y="6" width="14" height="16" rx="4" fill="#3b6fd4"/><path d="M8.5 6a3.5 3.5 0 0 1 7 0" stroke="#2a54a8" stroke-width="2" fill="none"/><rect x="8" y="14" width="8" height="5" rx="1.5" fill="#2a54a8"/>',
blush:'<circle cx="12" cy="6" r="3.6" fill="#ff8aa8"/><circle cx="18" cy="10.5" r="3.6" fill="#ff8aa8"/><circle cx="15.7" cy="17.5" r="3.6" fill="#ff8aa8"/><circle cx="8.3" cy="17.5" r="3.6" fill="#ff8aa8"/><circle cx="6" cy="10.5" r="3.6" fill="#ff8aa8"/><circle cx="12" cy="12" r="3" fill="#ffd23f"/>',
lock:'<rect x="5" y="10" width="14" height="11" rx="2.6" fill="#8a8f98"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="#8a8f98" stroke-width="2.4" fill="none"/><circle cx="12" cy="15.5" r="1.7" fill="#fff"/>',
heart:'<path d="M12 21C4 15 2 11 2 7.8A5 5 0 0 1 12 6a5 5 0 0 1 10 1.8C22 11 20 15 12 21z" fill="#ff6f8e"/><path d="M6 8.5a3 3 0 0 1 2.5-2" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".7"/>',
chat:'<path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#6a8de0"/><circle cx="8" cy="10.5" r="1.3" fill="#fff"/><circle cx="12" cy="10.5" r="1.3" fill="#fff"/><circle cx="16" cy="10.5" r="1.3" fill="#fff"/>',
cone:'<rect x="2" y="6" width="20" height="7" rx="1.5" fill="#ffb300"/><path d="M6 6L3 13M12 6L9 13M18 6l-3 7M22 8.5L18.5 13" stroke="#2b2b2b" stroke-width="2.2"/><rect x="4" y="13" width="2.4" height="9" fill="#666"/><rect x="17.6" y="13" width="2.4" height="9" fill="#666"/>',
butterfly:'<ellipse cx="7.5" cy="9" rx="5.5" ry="6" fill="#e5509a"/><ellipse cx="16.5" cy="9" rx="5.5" ry="6" fill="#e5509a"/><ellipse cx="8" cy="16" rx="3.5" ry="4" fill="#ff9d5a"/><ellipse cx="16" cy="16" rx="3.5" ry="4" fill="#ff9d5a"/><rect x="11.2" y="4" width="1.6" height="16" rx=".8" fill="#2b2622"/>',
crane:'<path d="M5 21V3.5h2.2V21z" fill="#ffb300"/><path d="M5 4.5h16.5L19.5 8H5z" fill="#ffb300"/><path d="M18.5 8v5.5" stroke="#555" stroke-width="1.4"/><rect x="15.8" y="13.5" width="5.4" height="4.2" fill="#e5624a"/><rect x="2.5" y="21" width="10" height="1.6" fill="#555"/>',
tap:'<path d="M9 21.5c-3 0-5-2-5-5v-3l2.5-1V6.2a1.9 1.9 0 0 1 3.8 0v4.6l1.7-.4a1.7 1.7 0 0 1 2 1.2l.4.1 1.4-.4a1.6 1.6 0 0 1 2 1.3l.3-.1 1.2-.1a1.5 1.5 0 0 1 1.7 1.5v2.1c0 3-2 5.5-5 5.5z" fill="#f2c9a0" stroke="#d9a574" stroke-width="1"/>',
clock:'<circle cx="12" cy="13" r="8" fill="#fff" stroke="#6a8de0" stroke-width="2.2"/><path d="M12 8.5V13l3 2" stroke="#6a8de0" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="10" y="2" width="4" height="2.4" rx="1" fill="#6a8de0"/>',
globe:'<circle cx="12" cy="12" r="10" fill="#4aa8ee"/><path d="M7 5c3 1 3.5 3 2 5s-1 4 1.5 5-1 4-3 4c-3-2-5-5-4-8s1-4 3.5-6z" fill="#4cae6a"/><path d="M15 4c3 .5 6 3.5 6 7-2 .5-3.5-.5-3.5-2.5S14 6 15 4z" fill="#4cae6a"/><path d="M14 15c2-1 4-.5 5 1.5-1.5 2.5-4 3.5-6 3 .8-1.5.5-3.5 1-4.5z" fill="#4cae6a"/><circle cx="8.5" cy="8" r="2" fill="#fff" opacity=".25"/>',
plus:'<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>',
trash:'<path d="M5 7h14l-1.2 13a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" fill="currentColor"/><rect x="3.5" y="4.5" width="17" height="2.5" rx="1.2" fill="currentColor"/><rect x="9" y="2.5" width="6" height="2.5" rx="1" fill="currentColor"/>',
apple:'<path d="M12 7c-2-2-7-1.5-7 4.5 0 4.5 3 9.5 5.5 9.5 1 0 1-.6 1.5-.6s.5.6 1.5.6c2.5 0 5.5-5 5.5-9.5C19 5.5 14 5 12 7z" fill="#e5624a"/><path d="M12 7c0-2 .5-3.5 2.5-4.5" stroke="#6b4423" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M13 5.5c1.5-1.5 4-1 4.5-.5-.5 1.7-2.5 2.2-4.5.5z" fill="#4cae6a"/>',
dumbbell:'<rect x="1.5" y="9" width="3" height="6" rx="1" fill="#555"/><rect x="4.5" y="7" width="3" height="10" rx="1" fill="#e5624a"/><rect x="7.5" y="11" width="9" height="2" fill="#777"/><rect x="16.5" y="7" width="3" height="10" rx="1" fill="#e5624a"/><rect x="19.5" y="9" width="3" height="6" rx="1" fill="#555"/>',
bed:'<rect x="2" y="12" width="20" height="6" rx="1.5" fill="#6a8de0"/><rect x="2" y="7" width="2.5" height="14" rx="1" fill="#8b5a2b"/><rect x="19.5" y="12" width="2.5" height="9" rx="1" fill="#8b5a2b"/><rect x="5.5" y="9" width="6" height="3.5" rx="1.5" fill="#fff"/>',
leaf:'<path d="M20 4C9 4 4 9 4 15c0 2 .6 3.5 1.8 4.6C7.5 21 9 21 11 21c6 0 9-6 9-17z" fill="#4cae6a"/><path d="M5 20C9 14 13 11 17 8" stroke="#2f7d4c" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
pencil:'<path d="M3 21l1.5-5L16 4.5 19.5 8 8 19.5z" fill="#ffc83d"/><path d="M16 4.5l2-2a1.7 1.7 0 0 1 2.4 0l1.1 1.1a1.7 1.7 0 0 1 0 2.4L19.5 8z" fill="#e5509a"/><path d="M3 21l1.5-5 3.5 3.5z" fill="#f2c9a0"/>',
music:'<path d="M9 18V5l11-2v13" stroke="#6a5fd6" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="3" fill="#6a5fd6"/><circle cx="17.5" cy="16" r="3" fill="#6a5fd6"/>',
snow:'<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" stroke="#6ec6ff" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="#bfe8ff"/>',
balloon:'<path d="M12 2a8 8 0 0 0-8 8c0 4.5 4 8 6.5 9.5h3C16 18 20 14.5 20 10a8 8 0 0 0-8-8z" fill="#e5624a"/><path d="M12 2c-3 3-3.5 12 0 17.5M12 2c3 3 3.5 12 0 17.5" stroke="#ffd23f" stroke-width="1.6" fill="none"/><rect x="9.5" y="20" width="5" height="3" rx="1" fill="#8b5a2b"/>',
shapes:'<circle cx="7" cy="7" r="4.5" fill="#4a86d9"/><polygon points="17,2.5 22,11.5 12,11.5" fill="#4cae6a"/><rect x="2.5" y="13" width="9" height="8.5" rx="1.6" fill="#8f63cf"/><ellipse cx="17" cy="17.5" rx="5" ry="4.3" fill="#ffc83d"/><circle cx="15.6" cy="16.4" r=".9" fill="#2b2622"/><circle cx="18.4" cy="16.4" r=".9" fill="#2b2622"/><polygon points="14.8,18.6 19.2,18.6 17,20.2" fill="#ff9d2e"/>'
};
const EMO={"🔥":"flame","⭐":"star","📖":"book","🎓":"grad","🎉":"party","🔒":"lock","🙏":"pray","✅":"check","✨":"sparkle","🎩":"tophat","😎":"shades","🏗":"crane","👤":"user","💧":"drop","🦋":"butterfly","👥":"people","📊":"chart","📈":"chart","👕":"shirt","🏆":"trophy","🏘":"town","☀":"sun","👑":"crown","😇":"halo","🤠":"cowboy","🧙":"wizard","🎧":"phones","🎒":"pack","🧣":"scarf","🌸":"blush","🦸":"cape","🎀":"bow","👆":"tap","🌙":"moon","🏠":"house","🥗":"salad","🏃":"runner","🧹":"broom","🧢":"cap","👖":"pants","🎨":"palette","🚧":"cone","💛":"heart","💬":"chat","⏱":"clock","🌅":"sunrise","🌇":"sunset","🌍":"globe"};
const ICRE=new RegExp("("+Object.keys(EMO).join("|")+")\uFE0F?","gu");
const icoSvg=n=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+(ICONS[n]||ICONS.star)+'</svg>';
function icoSpan(n){const e=document.createElement("span");e.className="ic";e.setAttribute("aria-hidden","true");e.innerHTML=icoSvg(n);return e}
function fixText(t){
 const v=t.nodeValue;if(!v||v.search(ICRE)<0||!t.parentNode)return;
 const f=document.createDocumentFragment();
 v.split(ICRE).forEach((x,i)=>{if(i%2)f.appendChild(icoSpan(EMO[x]));else if(x)f.appendChild(document.createTextNode(x))});
 t.parentNode.replaceChild(f,t);
}
function iconize(root){
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentNode;if(!p)return NodeFilter.FILTER_REJECT;const t=p.nodeName;if(t==="SCRIPT"||t==="STYLE"||t==="TEXTAREA"||t==="OPTION"||t==="text"||t==="TITLE")return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}});
 const list=[];let n;while((n=w.nextNode()))if(n.nodeValue.search(ICRE)>=0)list.push(n);
 list.forEach(fixText);
}
function hydrate(){document.querySelectorAll("[data-i]").forEach(e=>{e.innerHTML=icoSvg(e.dataset.i)})}
const icMO=new MutationObserver(ms=>{ms.forEach(m=>{
 if(m.type==="characterData"){fixText(m.target)}
 else m.addedNodes.forEach(n=>{if(n.nodeType===3)fixText(n);else if(n.nodeType===1&&n.nodeName!=="svg"&&!(n.classList&&n.classList.contains("ic")))iconize(n)})
})});
const GIC={morning:"sunrise",nutrition:"salad",exercise:"runner",cleaning:"broom",faith:"pray",more:"star"};
const DEFIC={wake:"sunrise",cold:"snow",water:"drop",bfast:"apple",lunch:"sun",dinner:"moon",eat:"salad",stretch:"leaf",run:"runner",room:"broom",pray:"pray",good:"heart"};
const HICONS=["runner","dumbbell","drop","salad","apple","broom","bed","book","pray","heart","sun","moon","leaf","pencil","music","star"];
let justAdded=null;
const shut={};
// State hydrated and verified on load
let curStreak=0,newB="",xpGain=0,lvUp=0,justId=null,fullG=null,allDone=false,openedG=null,firstR=true,popTok=null;const prevW={};
function rerun(el,c){el.classList.remove(c);el.getBoundingClientRect();el.classList.add(c)}
const CONF=["#ff8a1f","#f0c14b","#e5509a","#3b6fd4","#3f9d63","#8a56c9"];
function burst(x,y,n,cols){for(let i=0;i<n;i++){const e=document.createElement("span");e.className="cf";const a=Math.random()*6.28,r=40+Math.random()*80;e.style.cssText="left:"+x+"px;top:"+y+"px;background:"+cols[i%cols.length]+";--dx:"+Math.cos(a)*r+"px;--dy:"+(Math.sin(a)*r-30)+"px;--r:"+Math.round(Math.random()*540)+"deg";document.body.appendChild(e);setTimeout(()=>e.remove(),900)}}
function react(){const vs=[...document.querySelectorAll(".pv")].filter(e=>e.getBoundingClientRect().width);vs.forEach(e=>rerun(e,"wig"));const v=vs[0];if(v){const ph=v.parentElement;for(let i=0;i<6;i++){const sp=document.createElement("span");sp.className="spk";sp.textContent="✦";const a=Math.random()*6.28;sp.style.cssText="left:50%;top:50%;color:#f0c14b;--dx:"+Math.cos(a)*55+"px;--dy:"+Math.sin(a)*55+"px";ph.appendChild(sp);setTimeout(()=>sp.remove(),700)}}}
function countTo(el,n){let v=0;const st=Math.max(1,Math.ceil(n/15));el.textContent="0";if(!n)return;const iv=setInterval(()=>{v=Math.min(n,v+st);el.textContent=v;if(v>=n)clearInterval(iv)},40)}
const lbl=t=>(S.p.buddy||"Buddy")+":\n"+t;
const HATS=[["none","None"],["cap","🧢 Cap"],["beanie","Beanie"],["tophat","🎩 Top hat"],["crown","👑 Crown"],["halo","😇 Halo"],["party","🎉 Party"],["cowboy","🤠 Cowboy"],["wizard","🧙 Wizard"],["phones","🎧 Headphones"]];
const COL={blue:"#3b6fd4",green:"#3f9d63",purple:"#8a56c9",red:"#c94a4a",black:"#333333",yellow:"#e8b830",pink:"#e5509a"};
const BODY={orange:"#d97757",yellow:"#e8b830",green:"#4aa56d",blue:"#4a86d9",purple:"#8f63cf",pink:"#e87aa6",gray:"#8a8f98"};
const PANTS={blue:"#3b5fa8",black:"#2b2b2b",khaki:"#b79a5b",green:"#3f7d53"};
const SHOES={white:"#f2f2f2",black:"#222222",red:"#c94a4a",blue:"#3b6fd4"};
const cap=k=>k[0].toUpperCase()+k.slice(1);
const cn=o=>Object.keys(o).map(k=>[k,cap(k),o[k]]);
const cz=o=>[["none","None",""]].concat(cn(o));
const HAT={
cap:'<rect x="11" y="2" width="34" height="8" fill="#2f5fb3"/><rect x="30" y="8" width="22" height="4" fill="#244a8c"/>',
beanie:'<rect x="25" y="0" width="6" height="5" fill="#f0c14b"/><rect x="11" y="4" width="34" height="7" fill="#7c4dbd"/><rect x="11" y="9" width="34" height="3" fill="#5f3a96"/>',
tophat:'<rect x="17" y="0" width="22" height="9" fill="#222"/><rect x="17" y="6" width="22" height="2" fill="#f0c14b"/><rect x="9" y="8" width="38" height="3" fill="#222"/>',
crown:'<polygon points="11,9 11,1 19,5 28,0 37,5 45,1 45,9" fill="#f0c14b"/>',
halo:'<ellipse cx="28" cy="3" rx="13" ry="3.2" fill="none" stroke="#f0c14b" stroke-width="2.4"/>',
party:'<polygon points="28,-4 19,9 37,9" fill="#e5509a"/><rect x="25" y="2" width="6" height="2" fill="#fff"/><rect x="23" y="6" width="10" height="2" fill="#fff"/>',
cowboy:'<rect x="15" y="0" width="26" height="8" fill="#8b5a2b"/><rect x="15" y="5" width="26" height="2" fill="#5a3a1a"/><rect x="5" y="7" width="46" height="3" fill="#8b5a2b"/>',
wizard:'<polygon points="28,-5 18,9 38,9" fill="#3a2a8a"/><rect x="26" y="1" width="3" height="3" fill="#f0c14b"/><rect x="22" y="5" width="2" height="2" fill="#f0c14b"/><rect x="9" y="8" width="38" height="3" fill="#3a2a8a"/>',
phones:'<path d="M12 14 Q12 2 28 2 Q44 2 44 14" fill="none" stroke="#333" stroke-width="3"/><rect x="8" y="13" width="5" height="11" fill="#e5509a"/><rect x="43" y="13" width="5" height="11" fill="#e5509a"/>'};
function dk(h,f){const n=parseInt(h.slice(1),16),m=1-f;return"#"+[n>>16&255,n>>8&255,n&255].map(v=>Math.round(v*m).toString(16).padStart(2,"0")).join("")}
const PLANETS={
earth:{id:"earth",n:"Earth",order:1,icon:"🌍",d:"Our home world of rolling hills, oceans, forests & skies.",sea:["#86d6ff","#3a95e0","#1b5fa8"],halo:"#9fdcff",space:false},
mars:{id:"mars",n:"Mars",order:2,icon:"🔴",d:"The Red Planet — crimson canyons, polar ice caps & domed colonies.",sea:["#ff9c70","#d95830","#7a2312"],halo:"#ff9c70",space:true},
jupiter:{id:"jupiter",n:"Jupiter",order:3,icon:"🟠",d:"The Gas Giant — swirling amber cloud bands & floating sky stations.",sea:["#ffd194","#d98a3c","#7c4318"],halo:"#ffd194",space:true},
saturn:{id:"saturn",n:"Saturn",order:4,icon:"🪐",d:"The Ringed Jewel — golden horizons & luminous ice-ring outposts.",sea:["#ffe8a3","#d9b35a","#7a5e22"],halo:"#ffe8a3",space:true,ring:true},
uranus:{id:"uranus",n:"Uranus",order:5,icon:"🩵",d:"The Ice Giant — serene cyan mists & crystalline orbital domes.",sea:["#a8f5ff","#46b8cc","#195c6e"],halo:"#a8f5ff",space:true},
neptune:{id:"neptune",n:"Neptune",order:6,icon:"🔵",d:"The Deep Blue World — sapphire winds & starlit ocean habitats.",sea:["#7aa8ff","#2d5be0","#10256e"],halo:"#7aa8ff",space:true}
};
const PLANET_LIST=["earth","mars","jupiter","saturn","uranus","neptune"];
const BASE_ECO=["meadow","seaside","snowy","oasis","autumn","starlight","crystal","sky"];

const KINDS={
square:{n:"Square",r:"Starter",c:"#b8863b",body:"orange",pl:"earth"},
circle:{n:"Circle",r:"Common",c:"#7f95ab",body:"blue",pl:"earth"},
triangle:{n:"Triangle",r:"Uncommon",c:"#3f9d63",body:"green",pl:"earth"},
rectangle:{n:"Rectangle",r:"Rare",c:"#6a8de0",body:"purple",pl:"earth"},
clover:{n:"Meadow Clover",r:"Meadow",c:"#4cae6a",body:"green",nb:"meadow",pl:"earth"},
shell:{n:"Seaside Scallop",r:"Seaside",c:"#3a95e0",body:"blue",nb:"seaside",pl:"earth"},
snowflake:{n:"Snowy Crystal",r:"Snowy",c:"#70a8d8",body:"blue",nb:"snowy",pl:"earth"},
sunburst:{n:"Oasis Sunburst",r:"Oasis",c:"#e0a040",body:"yellow",nb:"oasis",pl:"earth"},
acorn:{n:"Autumn Acorn",r:"Autumn",c:"#d9602a",body:"orange",nb:"autumn",pl:"earth"},
starshape:{n:"Starlight Star",r:"Starlight",c:"#8a56c9",body:"purple",nb:"starlight",pl:"earth"},
gem:{n:"Crystal Gem",r:"Crystal",c:"#2aa6a0",body:"blue",nb:"crystal",pl:"earth"},
cloudshape:{n:"Sky Puff",r:"Sky",c:"#5b9bd5",body:"pink",nb:"mars_meadow",pl:"earth"}, earthplanet:{n:"Earth World",r:"Legendary Planet",c:"#3a95e0",body:"blue",nb:"sky",pl:"earth"},
duck:{n:"Duck",r:"Legendary",c:"#ffb300",body:"yellow",pl:"earth"},
// Space Buddies unlocked across Mars, Jupiter, Saturn, Uranus & Neptune ecosystems
rocketbud:{n:"Astro Rocket",r:"Space",c:"#e5624a",body:"orange",nb:"mars_meadow",pl:"mars"},
craterbud:{n:"Crater Hopper",r:"Space",c:"#d95830",body:"orange",nb:"mars_seaside",pl:"mars"},
frostorb:{n:"Polar Probe",r:"Space",c:"#70b8e8",body:"blue",nb:"mars_snowy",pl:"mars"},
solardome:{n:"Helios Dome",r:"Space",c:"#e8a838",body:"yellow",nb:"mars_oasis",pl:"mars"},
dustcore:{n:"Canyon Core",r:"Space",c:"#c95a2a",body:"orange",nb:"mars_autumn",pl:"mars"},
phobos:{n:"Twin Moon",r:"Space",c:"#9a6bd6",body:"purple",nb:"mars_starlight",pl:"mars"},
marsgem:{n:"Red Quartz",r:"Space",c:"#2aa6a0",body:"pink",nb:"mars_crystal",pl:"mars"},
aerowing:{n:"Mars Glider",r:"Space",c:"#5b9bd5",body:"blue",nb:"mars_meadow",pl:"mars"}, marsplanet:{n:"Mars World",r:"Legendary Planet",c:"#d95830",body:"orange",nb:"mars_sky",pl:"mars"},
stormeye:{n:"Storm Eye",r:"Gas Giant",c:"#e08a3c",body:"orange",nb:"jupiter_meadow",pl:"jupiter"},
tidepod:{n:"Europa Pod",r:"Gas Giant",c:"#3a95e0",body:"blue",nb:"jupiter_seaside",pl:"jupiter"},
cryocube:{n:"Cryo Cube",r:"Gas Giant",c:"#70a8d8",body:"blue",nb:"jupiter_snowy",pl:"jupiter"},
ionflare:{n:"Io Flare",r:"Gas Giant",c:"#e8b830",body:"yellow",nb:"jupiter_oasis",pl:"jupiter"},
amberorb:{n:"Amber Eddy",r:"Gas Giant",c:"#d9602a",body:"orange",nb:"jupiter_autumn",pl:"jupiter"},
galilean:{n:"Galilean Star",r:"Gas Giant",c:"#8a56c9",body:"purple",nb:"jupiter_starlight",pl:"jupiter"},
jovian:{n:"Jovian Prism",r:"Gas Giant",c:"#2aa6a0",body:"green",nb:"jupiter_crystal",pl:"jupiter"},
stratos:{n:"Stratos Buoy",r:"Gas Giant",c:"#5b9bd5",body:"pink",nb:"jupiter_meadow",pl:"jupiter"}, jupiterplanet:{n:"Jupiter World",r:"Legendary Planet",c:"#d98a3c",body:"yellow",nb:"jupiter_sky",pl:"jupiter"},
ringling:{n:"Ringlet",r:"Ringed",c:"#e0b040",body:"yellow",nb:"saturn_meadow",pl:"saturn"},
titanwave:{n:"Titan Wave",r:"Ringed",c:"#3a95e0",body:"blue",nb:"saturn_seaside",pl:"saturn"},
enceladus:{n:"Ice Geyser",r:"Ringed",c:"#70b8e8",body:"blue",nb:"saturn_snowy",pl:"saturn"},
goldhalo:{n:"Solar Ring",r:"Ringed",c:"#e8b830",body:"yellow",nb:"saturn_oasis",pl:"saturn"},
duskring:{n:"Amber Ring",r:"Ringed",c:"#d9602a",body:"orange",nb:"saturn_autumn",pl:"saturn"},
cassini:{n:"Cassini Star",r:"Ringed",c:"#8a56c9",body:"purple",nb:"saturn_starlight",pl:"saturn"},
ringgem:{n:"Halo Crystal",r:"Ringed",c:"#2aa6a0",body:"green",nb:"saturn_crystal",pl:"saturn"},
cloudring:{n:"Nimbus Ring",r:"Ringed",c:"#5b9bd5",body:"pink",nb:"saturn_meadow",pl:"saturn"}, saturnplanet:{n:"Saturn World",r:"Legendary Planet",c:"#d9b35a",body:"yellow",nb:"saturn_sky",pl:"saturn"},
cyanmist:{n:"Cyan Mist",r:"Ice Giant",c:"#3cb8cc",body:"blue",nb:"uranus_meadow",pl:"uranus"},
miranda:{n:"Miranda Crest",r:"Ice Giant",c:"#3a95e0",body:"blue",nb:"uranus_seaside",pl:"uranus"},
glacier:{n:"Glacier Core",r:"Ice Giant",c:"#70c8e8",body:"blue",nb:"uranus_snowy",pl:"uranus"},
auroradisk:{n:"Aurora Disk",r:"Ice Giant",c:"#4cae6a",body:"green",nb:"uranus_oasis",pl:"uranus"},
oberon:{n:"Oberon Leaf",r:"Ice Giant",c:"#d9602a",body:"orange",nb:"uranus_autumn",pl:"uranus"},
arielstar:{n:"Ariel Nova",r:"Ice Giant",c:"#8a56c9",body:"purple",nb:"uranus_starlight",pl:"uranus"},
iceprism:{n:"Frost Prism",r:"Ice Giant",c:"#2aa6a0",body:"blue",nb:"uranus_crystal",pl:"uranus"},
breezepuff:{n:"Zephyr Puff",r:"Ice Giant",c:"#5b9bd5",body:"pink",nb:"uranus_meadow",pl:"uranus"}, uranusplanet:{n:"Uranus World",r:"Legendary Planet",c:"#46b8cc",body:"blue",nb:"uranus_sky",pl:"uranus"},
triton:{n:"Triton Crest",r:"Deep Space",c:"#3b6fd4",body:"blue",nb:"neptune_meadow",pl:"neptune"},
abyssfin:{n:"Deep Current",r:"Deep Space",c:"#2f5fb3",body:"blue",nb:"neptune_seaside",pl:"neptune"},
cometice:{n:"Comet Shard",r:"Deep Space",c:"#70a8d8",body:"blue",nb:"neptune_snowy",pl:"neptune"},
blueflare:{n:"Blue Beacon",r:"Deep Space",c:"#4a86d9",body:"yellow",nb:"neptune_oasis",pl:"neptune"},
nebula:{n:"Nebula Drift",r:"Deep Space",c:"#8f63cf",body:"purple",nb:"neptune_autumn",pl:"neptune"},
pulsar:{n:"Pulsar Star",r:"Deep Space",c:"#8a56c9",body:"purple",nb:"neptune_starlight",pl:"neptune"},
sapphire:{n:"Sapphire Core",r:"Deep Space",c:"#2aa6a0",body:"blue",nb:"neptune_crystal",pl:"neptune"},
cosmo:{n:"Cosmo Legend",r:"Deep Space",c:"#ffb300",body:"yellow",nb:"neptune_meadow",pl:"neptune"}, neptuneplanet:{n:"Neptune World",r:"Legendary Planet",c:"#2d5be0",body:"blue",nb:"neptune_sky",pl:"neptune"}
};

const GEO={
square:{bx:[11,45],bd:c=>R(11,8,34,36,c),tp:c=>R(11,34,34,10,c),zip:[27,34,2,10],st:[[11,37,34],[11,41,34]],arm:[[3,22],[43,22]],ls:[[15,42],[32,42]],lw:9,lh:12,hat:[0,1],et:"",my:0},
circle:{bx:[11,45],bd:c=>'<circle cx="28" cy="26" r="18" fill="'+c+'"/>',tp:c=>'<path d="M11.9 34A18 18 0 0 0 44.1 34Z" fill="'+c+'"/>',zip:[27,34,2,10],st:[[13.8,37,28.4],[18.1,41,19.8]],arm:[[3,22],[43,22]],ls:[[19,42],[29,42]],lw:8,lh:12,hat:[0,.85],et:"",my:0},
triangle:{bx:[13,43],bd:c=>'<polygon points="28,10 6,44 50,44" fill="'+c+'"/>',tp:c=>'<polygon points="8.6,40 47.4,40 50,44 6,44" fill="'+c+'"/>',zip:[27,40,2,4],st:[[7.6,41.5,40.8]],arm:[[7.5,28],[39.5,28]],ls:[[14,43],[33,43]],lw:9,lh:11,hat:[2,.6],et:"translate(2.8 6.4) scale(.9)",my:4.5},
rectangle:{bx:[15,41],bd:c=>R(15,6,26,40,c),tp:c=>R(15,34,26,12,c),zip:[27,34,2,12],st:[[15,37,26],[15,41,26],[15,45,26]],arm:[[5,20],[41,20]],ls:[[17,44],[31,44]],lw:8,lh:10,hat:[-2,.75],et:"",my:0},
clover:{bx:[12,44],bd:c=>'<circle cx="21" cy="19" r="10.5" fill="'+c+'"/><circle cx="35" cy="19" r="10.5" fill="'+c+'"/><circle cx="21" cy="33" r="10.5" fill="'+c+'"/><circle cx="35" cy="33" r="10.5" fill="'+c+'"/><rect x="19" y="17" width="18" height="18" fill="'+c+'"/>',tp:c=>'<path d="M12.5 34A10.5 10.5 0 0 0 28 41.5A10.5 10.5 0 0 0 43.5 34Z" fill="'+c+'"/>',zip:[27,34,2,8],st:[[14,37,28]],arm:[[3,22],[43,22]],ls:[[17,42],[31,42]],lw:8,lh:12,hat:[1,.85],et:"",my:0},
shell:{bx:[11,45],bd:c=>'<path d="M28 8C15 8 8 18 10 30C11.5 38 18 44 28 44C38 44 44.5 38 46 30C48 18 41 8 28 8Z" fill="'+c+'"/><path d="M28 10V42M20 12L24 42M36 12L32 42" stroke="rgba(255,255,255,.22)" stroke-width="1.4" stroke-linecap="round"/>',tp:c=>'<path d="M11 34C13 40 19 44 28 44C37 44 43 40 45 34Z" fill="'+c+'"/>',zip:[27,34,2,10],st:[[13.5,37,29],[17.5,41,21]],arm:[[3,23],[43,23]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.85],et:"",my:0},
snowflake:{bx:[12,44],bd:c=>'<polygon points="28,6 33,14 43,12 40,21 47,26 40,31 43,40 33,38 28,46 23,38 13,40 16,31 9,26 16,21 13,12 23,14" fill="'+c+'"/>',tp:c=>'<polygon points="15,34 41,34 43,40 33,38 28,46 23,38 13,40" fill="'+c+'"/>',zip:[27,34,2,11],st:[[16,37,24]],arm:[[3,22],[43,22]],ls:[[17,42],[31,42]],lw:8,lh:12,hat:[-1,.8],et:"",my:0},
sunburst:{bx:[12,44],bd:c=>'<polygon points="28,5 32,12 40,9 40,17 47,20 43,27 47,34 40,37 40,45 32,42 28,48 24,42 16,45 16,37 9,34 13,27 9,20 16,17 16,9 24,12" fill="'+c+'"/>',tp:c=>'<polygon points="14,34 42,34 40,45 32,42 28,48 24,42 16,45" fill="'+c+'"/>',zip:[27,34,2,12],st:[[16,37,24]],arm:[[3,22],[43,22]],ls:[[17,43],[31,43]],lw:8,lh:11,hat:[-1,.8],et:"",my:0},
acorn:{bx:[12,44],bd:c=>'<path d="M13 21H43C43 35 36 44 28 45C20 44 13 35 13 21Z" fill="'+c+'"/><path d="M10 18C10 11 18 8 28 8C38 8 46 11 46 18V21H10Z" fill="'+dk(c,.28)+'"/><rect x="26.5" y="4" width="3" height="5" rx="1.2" fill="'+dk(c,.38)+'"/>',tp:c=>'<path d="M14.5 33H41.5C39.5 40 34 44.5 28 45C22 44.5 16.5 40 14.5 33Z" fill="'+c+'"/>',zip:[27,33,2,11],st:[[16,36,24],[19,40,18]],arm:[[4,23],[42,23]],ls:[[18,43],[30,43]],lw:8,lh:11,hat:[0,.88],et:"translate(0 2)",my:2},
starshape:{bx:[12,44],bd:c=>'<polygon points="28,6 34.5,18.5 48,20.5 38,30 40.5,44 28,37.5 15.5,44 18,30 8,20.5 21.5,18.5" fill="'+c+'"/>',tp:c=>'<polygon points="17.2,34 38.8,34 40.5,44 28,37.5 15.5,44" fill="'+c+'"/>',zip:[27,34,2,4],st:[[17,36.5,22]],arm:[[4,23],[42,23]],ls:[[17,41],[31,41]],lw:8,lh:12,hat:[-1,.72],et:"translate(0 1)",my:1},
gem:{bx:[12,44],bd:c=>'<polygon points="18,8 38,8 47,20 28,45 9,20" fill="'+c+'"/><polygon points="18,8 38,8 34,20 22,20" fill="rgba(255,255,255,.22)"/><polygon points="22,20 34,20 28,45" fill="rgba(255,255,255,.12)"/>',tp:c=>'<polygon points="18.8,33 37.2,33 28,45" fill="'+c+'"/>',zip:[27,33,2,11],st:[[20.5,35.5,15]],arm:[[4,22],[42,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.82],et:"translate(0 -1)",my:-1},
cloudshape:{bx:[11,45],bd:c=>'<circle cx="17" cy="29" r="9" fill="'+c+'"/><circle cx="39" cy="29" r="9" fill="'+c+'"/><circle cx="24" cy="19" r="10.5" fill="'+c+'"/><circle cx="34" cy="21" r="9.5" fill="'+c+'"/><rect x="16" y="24" width="24" height="14" rx="6" fill="'+c+'"/>',tp:c=>'<path d="M10.5 34H45.5A8.5 8.5 0 0 1 37 39H19A8.5 8.5 0 0 1 10.5 34Z" fill="'+c+'"/>',zip:[27,34,2,5],st:[[13,36.5,30]],arm:[[2,24],[44,24]],ls:[[18,38],[30,38]],lw:8,lh:14,hat:[1,.85],et:"translate(0 1)",my:1},
duck:{bx:[12,44],bd:c=>'<ellipse cx="28" cy="28" rx="17" ry="16" fill="'+c+'"/>',tp:c=>'<path d="M12.2 34A17 16 0 0 0 43.8 34Z" fill="'+c+'"/>',zip:[27,34,2,10],st:[[13.9,37,28.2],[18.1,41,19.8]],arm:[[4,24],[42,24]],ls:[[20,43],[32,43]],lw:3,lh:7,hat:[4,.8],et:"translate(0 -3)",my:0},

// Distinct Planet-Themed & Planet-As-Buddy Geometries
rocketbud:{bx:[14,42],bd:c=>'<path d="M28 4C19 13 15 24 15 36H41C41 24 37 13 28 4Z" fill="'+c+'"/><polygon points="15,30 8,42 15,40" fill="'+dk(c,.25)+'"/><polygon points="41,30 48,42 41,40" fill="'+dk(c,.25)+'"/><rect x="21" y="36" width="14" height="6" rx="2" fill="#555"/>',tp:c=>'<rect x="16" y="31" width="24" height="5" fill="'+c+'"/>',zip:[27,31,2,5],st:[[16,33.5,24]],arm:[[5,24],[41,24]],ls:[[18,42],[30,42]],lw:8,lh:11,hat:[0,.7],et:"translate(0 1)",my:1},
craterbud:{bx:[12,44],bd:c=>'<circle cx="28" cy="26" r="16" fill="'+c+'"/><circle cx="21" cy="20" r="3" fill="'+dk(c,.3)+'"/><circle cx="35" cy="28" r="4" fill="'+dk(c,.3)+'"/><circle cx="25" cy="34" r="2.5" fill="'+dk(c,.3)+'"/>',tp:c=>'<path d="M12 34A16 16 0 0 0 44 34Z" fill="'+c+'"/>',zip:[27,34,2,8],st:[[14,37,28]],arm:[[3,22],[43,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
frostorb:{bx:[12,44],bd:c=>'<polygon points="28,6 33,15 45,15 35,22 39,34 28,27 17,34 21,22 11,15 23,15" fill="'+c+'"/><circle cx="28" cy="23" r="6" fill="#fff" opacity=".5"/>',tp:c=>'<polygon points="17,34 39,34 28,27" fill="'+c+'"/>',zip:[27,34,2,8],st:[[16,36,24]],arm:[[4,22],[42,22]],ls:[[18,41],[30,41]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
solardome:{bx:[12,44],bd:c=>'<path d="M12 28A16 18 0 0 1 44 28V42H12Z" fill="'+c+'"/><path d="M14 26A14 14 0 0 1 42 26Z" fill="rgba(255,255,255,.45)"/><line x1="28" y1="10" x2="28" y2="42" stroke="'+dk(c,.4)+'" stroke-width="1.2"/>',tp:c=>'<rect x="12" y="34" width="32" height="8" fill="'+c+'"/>',zip:[27,34,2,8],st:[[12,37,32]],arm:[[3,24],[43,24]],ls:[[16,42],[32,42]],lw:8,lh:12,hat:[0,.85],et:"translate(0 2)",my:2},
dustcore:{bx:[12,44],bd:c=>'<path d="M13 21H43C43 35 36 44 28 45C20 44 13 35 13 21Z" fill="'+c+'"/><path d="M14 24Q28 18 42 24" stroke="'+dk(c,.35)+'" stroke-width="2" fill="none"/><path d="M16 30Q28 24 40 30" stroke="'+dk(c,.35)+'" stroke-width="2" fill="none"/>',tp:c=>'<path d="M14.5 33H41.5C39.5 40 34 44.5 28 45C22 44.5 16.5 40 14.5 33Z" fill="'+c+'"/>',zip:[27,33,2,11],st:[[16,36,24]],arm:[[4,23],[42,23]],ls:[[18,43],[30,43]],lw:8,lh:11,hat:[0,.88],et:"",my:1},
phobos:{bx:[12,44],bd:c=>'<circle cx="28" cy="24" r="14" fill="'+c+'"/><circle cx="22" cy="18" r="3.5" fill="#fff3b0"/><circle cx="34" cy="28" r="2.5" fill="#fff3b0"/>',tp:c=>'<path d="M14 32A14 14 0 0 0 42 32Z" fill="'+c+'"/>',zip:[27,32,2,8],st:[[16,35,24]],arm:[[3,22],[43,22]],ls:[[18,41],[30,41]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
marsgem:{bx:[12,44],bd:c=>'<polygon points="18,8 38,8 47,20 28,45 9,20" fill="'+c+'"/><polygon points="28,12 36,22 28,40 20,22" fill="rgba(255,255,255,.35)"/>',tp:c=>'<polygon points="18.8,33 37.2,33 28,45" fill="'+c+'"/>',zip:[27,33,2,11],st:[[20.5,35.5,15]],arm:[[4,22],[42,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.82],et:"translate(0 -1)",my:-1},
aerowing:{bx:[13,43],bd:c=>'<path d="M28 6L46 32H10Z" fill="'+c+'"/><rect x="23" y="32" width="10" height="10" fill="'+dk(c,.25)+'"/>',tp:c=>'<rect x="18" y="36" width="20" height="6" fill="'+c+'"/>',zip:[27,36,2,6],st:[[18,39,20]],arm:[[6,24],[42,24]],ls:[[18,42],[30,42]],lw:8,lh:10,hat:[0,.75],et:"",my:1},

stormeye:{bx:[12,44],bd:c=>'<circle cx="28" cy="26" r="16" fill="'+c+'"/><ellipse cx="28" cy="20" rx="12" ry="3" fill="'+dk(c,.3)+'"/><ellipse cx="28" cy="28" rx="14" ry="3" fill="'+dk(c,.3)+'"/><ellipse cx="28" cy="36" rx="10" ry="2.5" fill="'+dk(c,.3)+'"/>',tp:c=>'<path d="M12 34A16 16 0 0 0 44 34Z" fill="'+c+'"/>',zip:[27,34,2,8],st:[[14,37,28]],arm:[[3,22],[43,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
tidepod:{bx:[12,44],bd:c=>'<path d="M14 16C14 10 20 8 28 8C36 8 42 10 42 16V36C42 42 36 44 28 44C20 44 14 42 14 36Z" fill="'+c+'"/><circle cx="28" cy="26" r="6" fill="#7fd49a" opacity=".85"/>',tp:c=>'<rect x="14" y="34" width="28" height="10" fill="'+c+'"/>',zip:[27,34,2,10],st:[[14,38,28]],arm:[[3,23],[43,23]],ls:[[17,44],[31,44]],lw:8,lh:10,hat:[0,.85],et:"",my:0},
cryocube:{bx:[12,44],bd:c=>'<rect x="12" y="10" width="32" height="32" rx="4" fill="'+c+'"/><rect x="16" y="14" width="24" height="24" rx="2" fill="rgba(255,255,255,.45)"/>',tp:c=>'<rect x="12" y="34" width="32" height="8" fill="'+c+'"/>',zip:[27,34,2,8],st:[[12,37,32]],arm:[[3,24],[43,24]],ls:[[16,42],[32,42]],lw:8,lh:12,hat:[0,.85],et:"translate(0 2)",my:2},
ionflare:{bx:[12,44],bd:c=>'<polygon points="28,4 34,16 46,18 36,27 39,40 28,33 17,40 20,27 10,18 22,16" fill="'+c+'"/><circle cx="28" cy="25" r="7" fill="#fff" opacity=".6"/>',tp:c=>'<polygon points="17,34 39,34 39,40 28,33 17,40" fill="'+c+'"/>',zip:[27,34,2,6],st:[[18,36,20]],arm:[[3,22],[43,22]],ls:[[18,41],[30,41]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
amberorb:{bx:[12,44],bd:c=>'<circle cx="28" cy="26" r="16" fill="'+c+'"/><path d="M16 22Q28 14 40 22" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><path d="M16 30Q28 22 40 30" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',tp:c=>'<path d="M12 34A16 16 0 0 0 44 34Z" fill="'+c+'"/>',zip:[27,34,2,8],st:[[14,37,28]],arm:[[3,22],[43,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
galilean:{bx:[12,44],bd:c=>'<circle cx="28" cy="26" r="15" fill="'+c+'"/><circle cx="18" cy="16" r="3.5" fill="#fff"/><circle cx="38" cy="34" r="3" fill="#fff"/><circle cx="36" cy="16" r="2.5" fill="#fff"/>',tp:c=>'<path d="M13 34A15 15 0 0 0 43 34Z" fill="'+c+'"/>',zip:[27,34,2,8],st:[[15,37,26]],arm:[[3,22],[43,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
jovian:{bx:[12,44],bd:c=>'<polygon points="18,8 38,8 47,20 28,45 9,20" fill="'+c+'"/><ellipse cx="28" cy="24" rx="12" ry="4" fill="rgba(255,255,255,.3)"/>',tp:c=>'<polygon points="18.8,33 37.2,33 28,45" fill="'+c+'"/>',zip:[27,33,2,11],st:[[20.5,35.5,15]],arm:[[4,22],[42,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.82],et:"translate(0 -1)",my:-1},
stratos:{bx:[11,45],bd:c=>'<rect x="12" y="16" width="32" height="20" rx="10" fill="'+c+'"/><circle cx="28" cy="26" r="6" fill="#fff" opacity=".5"/>',tp:c=>'<path d="M12 32H44V36A8 8 0 0 1 36 44H20A8 8 0 0 1 12 36Z" fill="'+c+'"/>',zip:[27,34,2,8],st:[[14,37,28]],arm:[[2,24],[44,24]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.85],et:"",my:0},

ringling:{bx:[12,44],bd:c=>'<circle cx="28" cy="26" r="15" fill="'+c+'"/><ellipse cx="28" cy="28" rx="24" ry="5.5" transform="rotate(-14 28 28)" fill="none" stroke="#ffe49e" stroke-width="3.2"/>',tp:c=>'<path d="M14 33A15 15 0 0 0 42 33Z" fill="'+c+'"/>',zip:[27,33,2,8],st:[[16,36,24]],arm:[[3,22],[43,22]],ls:[[19,41],[29,41]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
titanwave:{bx:[11,45],bd:c=>'<path d="M28 8C15 8 8 18 10 30C11.5 38 18 44 28 44C38 44 44.5 38 46 30C48 18 41 8 28 8Z" fill="'+c+'"/><path d="M12 26Q28 20 44 26" stroke="#fff" stroke-width="2.5" fill="none"/><path d="M12 33Q28 27 44 33" stroke="#fff" stroke-width="2.5" fill="none"/>',tp:c=>'<path d="M11 34C13 40 19 44 28 44C37 44 43 40 45 34Z" fill="'+c+'"/>',zip:[27,34,2,10],st:[[13.5,37,29]],arm:[[3,23],[43,23]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.85],et:"",my:0},
enceladus:{bx:[12,44],bd:c=>'<circle cx="28" cy="26" r="16" fill="'+c+'"/><path d="M28 10V20M24 14L32 16" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',tp:c=>'<path d="M12 34A16 16 0 0 0 44 34Z" fill="'+c+'"/>',zip:[27,34,2,8],st:[[14,37,28]],arm:[[3,22],[43,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
goldhalo:{bx:[12,44],bd:c=>'<circle cx="28" cy="26" r="15" fill="'+c+'"/><circle cx="28" cy="26" r="19" fill="none" stroke="#ffe27a" stroke-width="2.5" stroke-dasharray="4 2"/>',tp:c=>'<path d="M13 34A15 15 0 0 0 43 34Z" fill="'+c+'"/>',zip:[27,34,2,8],st:[[15,37,26]],arm:[[3,22],[43,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
duskring:{bx:[12,44],bd:c=>'<circle cx="28" cy="26" r="15" fill="'+c+'"/><ellipse cx="28" cy="28" rx="22" ry="5" transform="rotate(15 28 28)" fill="none" stroke="#f0c14b" stroke-width="3"/>',tp:c=>'<path d="M13 34A15 15 0 0 0 43 34Z" fill="'+c+'"/>',zip:[27,34,2,8],st:[[15,37,26]],arm:[[3,22],[43,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
cassini:{bx:[12,44],bd:c=>'<polygon points="28,6 34.5,18.5 48,20.5 38,30 40.5,44 28,37.5 15.5,44 18,30 8,20.5 21.5,18.5" fill="'+c+'"/><ellipse cx="28" cy="26" rx="20" ry="4.5" fill="none" stroke="#ffe27a" stroke-width="2.5"/>',tp:c=>'<polygon points="17.2,34 38.8,34 40.5,44 28,37.5 15.5,44" fill="'+c+'"/>',zip:[27,34,2,4],st:[[17,36.5,22]],arm:[[4,23],[42,23]],ls:[[17,41],[31,41]],lw:8,lh:12,hat:[-1,.72],et:"",my:1},
ringgem:{bx:[12,44],bd:c=>'<polygon points="18,8 38,8 47,20 28,45 9,20" fill="'+c+'"/><ellipse cx="28" cy="26" rx="22" ry="5" transform="rotate(-10 28 26)" fill="none" stroke="#ffe27a" stroke-width="3"/>',tp:c=>'<polygon points="18.8,33 37.2,33 28,45" fill="'+c+'"/>',zip:[27,33,2,11],st:[[20.5,35.5,15]],arm:[[4,22],[42,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.82],et:"translate(0 -1)",my:-1},
cloudring:{bx:[11,45],bd:c=>'<circle cx="17" cy="29" r="9" fill="'+c+'"/><circle cx="39" cy="29" r="9" fill="'+c+'"/><ellipse cx="28" cy="28" rx="22" ry="5" fill="none" stroke="#ffe27a" stroke-width="3"/>',tp:c=>'<path d="M10.5 34H45.5A8.5 8.5 0 0 1 37 39H19A8.5 8.5 0 0 1 10.5 34Z" fill="'+c+'"/>',zip:[27,34,2,5],st:[[13,36.5,30]],arm:[[2,24],[44,24]],ls:[[18,38],[30,38]],lw:8,lh:14,hat:[1,.85],et:"",my:1},

cyanmist:{bx:[12,44],bd:c=>'<circle cx="28" cy="26" r="16" fill="'+c+'"/><path d="M12 20Q28 14 44 20" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="3" stroke-linecap="round"/>',tp:c=>'<path d="M12 34A16 16 0 0 0 44 34Z" fill="'+c+'"/>',zip:[27,34,2,8],st:[[14,37,28]],arm:[[3,22],[43,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
miranda:{bx:[11,45],bd:c=>'<path d="M28 8C15 8 8 18 10 30C11.5 38 18 44 28 44C38 44 44.5 38 46 30C48 18 41 8 28 8Z" fill="'+c+'"/><polygon points="28,14 33,26 23,26" fill="#fff" opacity=".85"/>',tp:c=>'<path d="M11 34C13 40 19 44 28 44C37 44 43 40 45 34Z" fill="'+c+'"/>',zip:[27,34,2,10],st:[[13.5,37,29]],arm:[[3,23],[43,23]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.85],et:"",my:0},
glacier:{bx:[12,44],bd:c=>'<polygon points="28,6 40,16 36,40 20,40 16,16" fill="'+c+'"/><path d="M28 6V40M20 22L36 22" stroke="rgba(255,255,255,.4)" stroke-width="2"/>',tp:c=>'<polygon points="16,34 36,34 36,40 20,40" fill="'+c+'"/>',zip:[27,34,2,6],st:[[18,36,20]],arm:[[3,22],[43,22]],ls:[[18,41],[30,41]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
auroradisk:{bx:[12,44],bd:c=>'<circle cx="28" cy="26" r="16" fill="'+c+'"/><ellipse cx="28" cy="26" rx="20" ry="7" fill="none" stroke="#4cae6a" stroke-width="3" stroke-dasharray="6 3"/>',tp:c=>'<path d="M12 34A16 16 0 0 0 44 34Z" fill="'+c+'"/>',zip:[27,34,2,8],st:[[14,37,28]],arm:[[3,22],[43,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
oberon:{bx:[12,44],bd:c=>'<path d="M13 21H43C43 35 36 44 28 45C20 44 13 35 13 21Z" fill="'+c+'"/><circle cx="28" cy="26" r="7" fill="#3fa35d"/>',tp:c=>'<path d="M14.5 33H41.5C39.5 40 34 44.5 28 45C22 44.5 16.5 40 14.5 33Z" fill="'+c+'"/>',zip:[27,33,2,11],st:[[16,36,24]],arm:[[4,23],[42,23]],ls:[[18,43],[30,43]],lw:8,lh:11,hat:[0,.88],et:"",my:1},
arielstar:{bx:[12,44],bd:c=>'<polygon points="28,6 34.5,18.5 48,20.5 38,30 40.5,44 28,37.5 15.5,44 18,30 8,20.5 21.5,18.5" fill="'+c+'"/><circle cx="28" cy="26" r="5" fill="#a8f5ff"/>',tp:c=>'<polygon points="17.2,34 38.8,34 40.5,44 28,37.5 15.5,44" fill="'+c+'"/>',zip:[27,34,2,4],st:[[17,36.5,22]],arm:[[4,23],[42,23]],ls:[[17,41],[31,41]],lw:8,lh:12,hat:[-1,.72],et:"",my:1},
iceprism:{bx:[12,44],bd:c=>'<polygon points="18,8 38,8 47,20 28,45 9,20" fill="'+c+'"/><line x1="28" y1="8" x2="28" y2="45" stroke="#fff" stroke-width="2"/>',tp:c=>'<polygon points="18.8,33 37.2,33 28,45" fill="'+c+'"/>',zip:[27,33,2,11],st:[[20.5,35.5,15]],arm:[[4,22],[42,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.82],et:"translate(0 -1)",my:-1},
breezepuff:{bx:[11,45],bd:c=>'<circle cx="17" cy="29" r="9" fill="'+c+'"/><circle cx="39" cy="29" r="9" fill="'+c+'"/><circle cx="24" cy="19" r="10.5" fill="'+c+'"/><path d="M14 26Q28 20 42 26" stroke="#fff" stroke-width="2" fill="none"/>',tp:c=>'<path d="M10.5 34H45.5A8.5 8.5 0 0 1 37 39H19A8.5 8.5 0 0 1 10.5 34Z" fill="'+c+'"/>',zip:[27,34,2,5],st:[[13,36.5,30]],arm:[[2,24],[44,24]],ls:[[18,38],[30,38]],lw:8,lh:14,hat:[1,.85],et:"",my:1},

triton:{bx:[12,44],bd:c=>'<circle cx="28" cy="26" r="15" fill="'+c+'"/><path d="M20 18L28 12L36 18" stroke="#ff8aa8" stroke-width="3" fill="none" stroke-linecap="round"/>',tp:c=>'<path d="M13 34A15 15 0 0 0 43 34Z" fill="'+c+'"/>',zip:[27,34,2,8],st:[[15,37,26]],arm:[[3,22],[43,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.8],et:"",my:0},
abyssfin:{bx:[11,45],bd:c=>'<path d="M28 8C15 8 8 18 10 30C11.5 38 18 44 28 44C38 44 44.5 38 46 30C48 18 41 8 28 8Z" fill="'+c+'"/><path d="M8 20L4 14L10 24Z" fill="#2f5fb3"/><path d="M48 20L52 14L46 24Z" fill="#2f5fb3"/>',tp:c=>'<path d="M11 34C13 40 19 44 28 44C37 44 43 40 45 34Z" fill="'+c+'"/>',zip:[27,34,2,10],st:[[13.5,37,29]],arm:[[3,23],[43,23]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.85],et:"",my:0},
cometice:{bx:[12,44],bd:c=>'<polygon points="28,6 33,14 43,12 40,21 47,26 40,31 43,40 33,38 28,46 23,38 13,40 16,31 9,26 16,21 13,12 23,14" fill="'+c+'"/><path d="M28 20L36 32H20Z" fill="#70a8d8"/>',tp:c=>'<polygon points="15,34 41,34 43,40 33,38 28,46 23,38 13,40" fill="'+c+'"/>',zip:[27,34,2,11],st:[[16,37,24]],arm:[[3,22],[43,22]],ls:[[17,42],[31,42]],lw:8,lh:12,hat:[-1,.8],et:"",my:0},
blueflare:{bx:[12,44],bd:c=>'<polygon points="28,5 32,12 40,9 40,17 47,20 43,27 47,34 40,37 40,45 32,42 28,48 24,42 16,45 16,37 9,34 13,27 9,20 16,17 16,9 24,12" fill="'+c+'"/><circle cx="28" cy="26" r="6" fill="#fff3b0"/>',tp:c=>'<polygon points="14,34 42,34 40,45 32,42 28,48 24,42 16,45" fill="'+c+'"/>',zip:[27,34,2,12],st:[[16,37,24]],arm:[[3,22],[43,22]],ls:[[17,43],[31,43]],lw:8,lh:11,hat:[-1,.8],et:"",my:0},
nebula:{bx:[11,45],bd:c=>'<circle cx="17" cy="29" r="9" fill="'+c+'"/><circle cx="39" cy="29" r="9" fill="'+c+'"/><circle cx="24" cy="19" r="10.5" fill="'+c+'"/><circle cx="34" cy="21" r="9.5" fill="'+c+'"/><path d="M20 20Q28 32 36 20" stroke="#ffb300" stroke-width="2.5" fill="none"/>',tp:c=>'<path d="M10.5 34H45.5A8.5 8.5 0 0 1 37 39H19A8.5 8.5 0 0 1 10.5 34Z" fill="'+c+'"/>',zip:[27,34,2,5],st:[[13,36.5,30]],arm:[[2,24],[44,24]],ls:[[18,38],[30,38]],lw:8,lh:14,hat:[1,.85],et:"",my:1},
pulsar:{bx:[12,44],bd:c=>'<polygon points="28,6 34.5,18.5 48,20.5 38,30 40.5,44 28,37.5 15.5,44 18,30 8,20.5 21.5,18.5" fill="'+c+'"/><line x1="12" y1="26" x2="44" y2="26" stroke="#fff" stroke-width="3"/><line x1="28" y1="10" x2="28" y2="42" stroke="#fff" stroke-width="3"/>',tp:c=>'<polygon points="17.2,34 38.8,34 40.5,44 28,37.5 15.5,44" fill="'+c+'"/>',zip:[27,34,2,4],st:[[17,36.5,22]],arm:[[4,23],[42,23]],ls:[[17,41],[31,41]],lw:8,lh:12,hat:[-1,.72],et:"",my:1},
sapphire:{bx:[12,44],bd:c=>'<polygon points="18,8 38,8 47,20 28,45 9,20" fill="'+c+'"/><circle cx="28" cy="24" r="8" fill="#8ff5ee" opacity=".7"/>',tp:c=>'<polygon points="18.8,33 37.2,33 28,45" fill="'+c+'"/>',zip:[27,33,2,11],st:[[20.5,35.5,15]],arm:[[4,22],[42,22]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.82],et:"translate(0 -1)",my:-1},
cosmo:{bx:[12,44],bd:c=>'<polygon points="28,4 34,16 47,16 37,25 41,38 28,31 15,38 19,25 9,16 22,16" fill="'+c+'"/><circle cx="28" cy="23" r="11" fill="#ffb300"/><path d="M22 23L26 27L34 19" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>',tp:c=>'<rect x="18" y="33" width="20" height="7" rx="3" fill="'+c+'"/>',zip:[27,33,2,7],st:[[19,36,18]],arm:[[3,22],[43,22]],ls:[[18,40],[30,40]],lw:8,lh:13,hat:[-2,.75],et:"",my:0},

earthplanet:{bx:[10,46],bd:c=>'<circle cx="28" cy="26" r="18" fill="#3a95e0"/><path d="M12 20Q18 14 26 22T38 18T42 32Q36 40 24 36T14 28Z" fill="#3aa35d"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',tp:c=>'<rect x="16" y="36" width="24" height="6" fill="#2b7cd3"/>',zip:[27,36,2,6],st:[[18,39,20]],arm:[[2,24],[44,24]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.85],et:"",my:0},
marsplanet:{bx:[10,46],bd:c=>'<circle cx="28" cy="26" r="18" fill="#d95830"/><circle cx="20" cy="18" r="4" fill="#a83a1a"/><circle cx="36" cy="30" r="5" fill="#a83a1a"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',tp:c=>'<rect x="16" y="36" width="24" height="6" fill="#b03e1c"/>',zip:[27,36,2,6],st:[[18,39,20]],arm:[[2,24],[44,24]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.85],et:"",my:0},
jupiterplanet:{bx:[10,46],bd:c=>'<circle cx="28" cy="26" r="18" fill="#d98a3c"/><ellipse cx="28" cy="16" rx="14" ry="3" fill="#c2722b"/><ellipse cx="28" cy="24" rx="16" ry="3.5" fill="#f0c684"/><ellipse cx="28" cy="33" rx="12" ry="3" fill="#c2722b"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',tp:c=>'<rect x="16" y="36" width="24" height="6" fill="#b57228"/>',zip:[27,36,2,6],st:[[18,39,20]],arm:[[2,24],[44,24]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.85],et:"",my:0},
saturnplanet:{bx:[10,46],bd:c=>'<circle cx="28" cy="26" r="16" fill="#d9b35a"/><ellipse cx="28" cy="28" rx="25" ry="5.5" transform="rotate(-15 28 28)" fill="none" stroke="#ffe49e" stroke-width="4"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',tp:c=>'<rect x="16" y="36" width="24" height="6" fill="#c49c48"/>',zip:[27,36,2,6],st:[[18,39,20]],arm:[[2,24],[44,24]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.85],et:"",my:0},
uranusplanet:{bx:[10,46],bd:c=>'<circle cx="28" cy="26" r="18" fill="#46b8cc"/><ellipse cx="28" cy="26" rx="22" ry="5" transform="rotate(75 28 26)" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2.5"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',tp:c=>'<rect x="16" y="36" width="24" height="6" fill="#3296a8"/>',zip:[27,36,2,6],st:[[18,39,20]],arm:[[2,24],[44,24]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.85],et:"",my:0},
neptuneplanet:{bx:[10,46],bd:c=>'<circle cx="28" cy="26" r="18" fill="#2d5be0"/><path d="M16 20Q28 14 40 20T36 34Q28 40 20 34Z" fill="#193aa8"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',tp:c=>'<rect x="16" y="36" width="24" height="6" fill="#1d3fbc"/>',zip:[27,36,2,6],st:[[18,39,20]],arm:[[2,24],[44,24]],ls:[[18,42],[30,42]],lw:8,lh:12,hat:[0,.85],et:"",my:0}
};
const PETS=[
{id:"firefly",n:"Firefly",st:1,d:"A glowing evening spark",svg:'<ellipse cx="14" cy="17" rx="5.5" ry="4.5" fill="#ffe27a" opacity=".55"/><ellipse cx="14" cy="16" rx="4.2" ry="3.4" fill="#3b3348"/><ellipse cx="14" cy="17.5" rx="3.5" ry="2.2" fill="#ffd23f"/><ellipse cx="10.2" cy="13" rx="3.2" ry="1.8" transform="rotate(-25 10.2 13)" fill="#dff4ff" opacity=".9"/><ellipse cx="17.8" cy="13" rx="3.2" ry="1.8" transform="rotate(25 17.8 13)" fill="#dff4ff" opacity=".9"/><circle cx="12.6" cy="15" r=".8" fill="#fff"/><circle cx="15.4" cy="15" r=".8" fill="#fff"/>'},
{id:"chick",n:"Little Chick",st:3,d:"Sunny chirping friend",svg:'<circle cx="14" cy="16" r="5.5" fill="#ffd23f"/><path d="M12.5 11Q14 8 15.5 11" fill="#ffb300"/><polygon points="14,16.5 11.8,18 16.2,18" fill="#ff8a1f"/><circle cx="12" cy="15" r=".9" fill="#222"/><circle cx="16" cy="15" r=".9" fill="#222"/><path d="M11 21v1.5M17 21v1.5" stroke="#ff8a1f" stroke-width="1.3" stroke-linecap="round"/>'},
{id:"bunny",n:"Meadow Bunny",st:5,d:"Soft ears & gentle hops",svg:'<ellipse cx="11.2" cy="8.5" rx="1.8" ry="4.8" fill="#f7f2eb" stroke="#d9cfc3" stroke-width=".7"/><ellipse cx="16.8" cy="8.5" rx="1.8" ry="4.8" fill="#f7f2eb" stroke="#d9cfc3" stroke-width=".7"/><ellipse cx="11.2" cy="8.8" rx=".8" ry="3" fill="#ffb8c6"/><ellipse cx="16.8" cy="8.8" rx=".8" ry="3" fill="#ffb8c6"/><circle cx="14" cy="16" r="5.4" fill="#f7f2eb"/><circle cx="12.1" cy="15.2" r=".9" fill="#222"/><circle cx="15.9" cy="15.2" r=".9" fill="#222"/><circle cx="14" cy="17.2" r="1" fill="#ff8aa8"/>'},
{id:"lamb",n:"Woolly Lamb",st:7,d:"Gentle shepherd’s companion",svg:'<circle cx="10.5" cy="13.5" r="3.4" fill="#fff"/><circle cx="17.5" cy="13.5" r="3.4" fill="#fff"/><circle cx="14" cy="12" r="3.8" fill="#fff"/><circle cx="10.5" cy="17.5" r="3.4" fill="#fff"/><circle cx="17.5" cy="17.5" r="3.4" fill="#fff"/><ellipse cx="14" cy="16.5" rx="4.2" ry="3.8" fill="#f2d6be"/><ellipse cx="9" cy="15.5" rx="2" ry="1.2" fill="#e0b899"/><ellipse cx="19" cy="15.5" rx="2" ry="1.2" fill="#e0b899"/><circle cx="12.5" cy="16" r=".9" fill="#222"/><circle cx="15.5" cy="16" r=".9" fill="#222"/><circle cx="14" cy="17.8" r=".8" fill="#d98880"/>'},
{id:"puppy",n:"Loyal Pup",st:10,d:"Tail-wagging trail buddy",svg:'<ellipse cx="9" cy="15" rx="2.2" ry="4.2" transform="rotate(15 9 15)" fill="#8b5a2b"/><ellipse cx="19" cy="15" rx="2.2" ry="4.2" transform="rotate(-15 19 15)" fill="#8b5a2b"/><circle cx="14" cy="16" r="5.5" fill="#d49b63"/><ellipse cx="14" cy="17.8" rx="2.8" ry="2.1" fill="#f6e3cc"/><circle cx="12.1" cy="15" r=".9" fill="#222"/><circle cx="15.9" cy="15" r=".9" fill="#222"/><circle cx="14" cy="17" r="1.1" fill="#222"/>'},
{id:"dove",n:"Peace Dove",st:14,d:"Messenger of calm & hope",svg:'<path d="M5 14Q9 9 13 13" fill="#e8f1fa"/><path d="M23 14Q19 9 15 13" fill="#e8f1fa"/><circle cx="14" cy="15.5" r="5" fill="#fff" stroke="#d8e6f3" stroke-width=".8"/><polygon points="14,16.5 12.2,17.8 15.8,17.8" fill="#f0a830"/><circle cx="12.3" cy="14.8" r=".85" fill="#222"/><circle cx="15.7" cy="14.8" r=".85" fill="#222"/><path d="M15.5 17.6l3.5 1.2M17.2 18.2l1-1.2" stroke="#4cae6a" stroke-width="1.1" stroke-linecap="round"/>'},
{id:"kitten",n:"Cozy Kitten",st:18,d:"Purring pocket friend",svg:'<polygon points="9.2,13.5 10.2,8.2 13.5,12" fill="#f0a05a"/><polygon points="18.8,13.5 17.8,8.2 14.5,12" fill="#f0a05a"/><circle cx="14" cy="16" r="5.4" fill="#f0a05a"/><circle cx="12.1" cy="15.3" r=".9" fill="#222"/><circle cx="15.9" cy="15.3" r=".9" fill="#222"/><polygon points="14,17 13,18 15,18" fill="#ff7a98"/><path d="M8.5 16.5h2.4M8.5 18h2.4M17.1 16.5h2.4M17.1 18h2.4" stroke="#8b5a2b" stroke-width=".8" stroke-linecap="round"/>'},
{id:"turtle",n:"Steady Turtle",st:21,d:"Slow, faithful & persistent",svg:'<path d="M8.5 17.5a5.5 5 0 0 1 11 0z" fill="#3f9d63"/><path d="M11 14.5h6M14 12.5v5" stroke="#2a6e44" stroke-width="1"/><circle cx="20.2" cy="16.5" r="2.3" fill="#7fd49a"/><circle cx="20.9" cy="16" r=".7" fill="#222"/><rect x="9.5" y="17.5" width="2.2" height="2.6" rx="1" fill="#7fd49a"/><rect x="16.3" y="17.5" width="2.2" height="2.6" rx="1" fill="#7fd49a"/>'},
{id:"owl",n:"Wise Owl",st:25,d:"Night-watch scripture reader",svg:'<polygon points="9.5,12 10.5,8.5 13,11.5" fill="#7c5a42"/><polygon points="18.5,12 17.5,8.5 15,11.5" fill="#7c5a42"/><circle cx="14" cy="16" r="5.5" fill="#7c5a42"/><circle cx="11.8" cy="15.2" r="2.1" fill="#fff3b0"/><circle cx="16.2" cy="15.2" r="2.1" fill="#fff3b0"/><circle cx="11.8" cy="15.2" r="1" fill="#222"/><circle cx="16.2" cy="15.2" r="1" fill="#222"/><polygon points="14,16.5 12.8,18.2 15.2,18.2" fill="#f0a830"/>'},
{id:"lion",n:"Lion Cub",st:30,d:"Bold & courageous champion",svg:'<circle cx="14" cy="15.8" r="7.2" fill="#b86228"/><circle cx="14" cy="15.8" r="5.1" fill="#f2b84b"/><circle cx="10.2" cy="11.5" r="1.7" fill="#f2b84b"/><circle cx="17.8" cy="11.5" r="1.7" fill="#f2b84b"/><circle cx="12.2" cy="15.2" r=".9" fill="#222"/><circle cx="15.8" cy="15.2" r=".9" fill="#222"/><polygon points="14,16.6 12.8,17.8 15.2,17.8" fill="#6b3818"/>'},
// Space Pets unlocked by settling space ecosystems
{id:"astrobot",n:"Rover Bot",nb:"mars_meadow",pl:"mars",d:"Beep-boop Mars explorer",svg:'<rect x="8.5" y="12" width="11" height="8" rx="2.5" fill="#e8eef5" stroke="#8a9bb0" stroke-width=".9"/><line x1="14" y1="8.5" x2="14" y2="12" stroke="#8a9bb0" stroke-width="1.3"/><circle cx="14" cy="8" r="1.4" fill="#ff6a1a"/><rect x="10.2" y="14" width="7.6" height="3.2" rx="1.2" fill="#223344"/><circle cx="12.2" cy="15.6" r=".9" fill="#6ee0ff"/><circle cx="15.8" cy="15.6" r=".9" fill="#6ee0ff"/><circle cx="10.5" cy="20.6" r="1.4" fill="#444"/><circle cx="17.5" cy="20.6" r="1.4" fill="#444"/>'},
{id:"stardust",n:"Star Puff",nb:"mars_starlight",pl:"mars",d:"Twinkling cosmic sprite",svg:'<polygon points="14,7.5 16,13 21.5,13.5 17.2,17 18.5,22 14,19 9.5,22 10.8,17 6.5,13.5 12,13" fill="#ffe27a"/><circle cx="12.4" cy="15.2" r=".85" fill="#2b2622"/><circle cx="15.6" cy="15.2" r=".85" fill="#2b2622"/>'},
{id:"mooncat",n:"Astro Kitty",nb:"jupiter_meadow",pl:"jupiter",d:"Space-helmet purring pal",svg:'<circle cx="14" cy="15.5" r="7.4" fill="rgba(180,230,255,.35)" stroke="#9ad8ff" stroke-width="1"/><polygon points="10,13.5 11,9 13.5,12" fill="#f5b06a"/><polygon points="18,13.5 17,9 14.5,12" fill="#f5b06a"/><circle cx="14" cy="16" r="4.6" fill="#f5b06a"/><circle cx="12.4" cy="15.4" r=".8" fill="#222"/><circle cx="15.6" cy="15.4" r=".8" fill="#222"/><polygon points="14,16.8 13.2,17.6 14.8,17.6" fill="#ff7a98"/>'},
{id:"cloudwhale",n:"Sky Whale",nb:"jupiter_sky",pl:"jupiter",d:"Gentle gas-giant glider",svg:'<ellipse cx="14" cy="16" rx="6.5" ry="4.4" fill="#6ab8ff"/><polygon points="6,16 3.5,13.5 4.5,16 3.5,18.5" fill="#4a95e0"/><ellipse cx="14" cy="17.5" rx="4.5" ry="2" fill="#d8f0ff"/><circle cx="17.2" cy="15.2" r=".9" fill="#222"/><path d="M13 11.5q-1-2.5-2.5-2M14 11.5q1-2.5 2.5-2" stroke="#bfe8ff" stroke-width="1" fill="none" stroke-linecap="round"/>'},
{id:"ringfox",n:"Ring Fox",nb:"saturn_meadow",pl:"saturn",d:"Golden-tailed ring runner",svg:'<polygon points="9.2,13.5 10.2,8 13.5,12" fill="#e88a2a"/><polygon points="18.8,13.5 17.8,8 14.5,12" fill="#e88a2a"/><circle cx="14" cy="16" r="5.2" fill="#f09c38"/><ellipse cx="14" cy="17.5" rx="3.4" ry="2.2" fill="#fff5e0"/><circle cx="12.1" cy="15.2" r=".85" fill="#222"/><circle cx="15.9" cy="15.2" r=".85" fill="#222"/><circle cx="14" cy="16.8" r=".9" fill="#222"/>'},
{id:"saturnowl",n:"Halo Owl",nb:"saturn_starlight",pl:"saturn",d:"Stargazer of Saturn’s rings",svg:'<ellipse cx="14" cy="16.5" rx="8.8" ry="2.4" fill="none" stroke="#ffe27a" stroke-width="1.3"/><circle cx="14" cy="15.8" r="5" fill="#8f63cf"/><circle cx="12" cy="15" r="1.8" fill="#fff3b0"/><circle cx="16" cy="15" r="1.8" fill="#fff3b0"/><circle cx="12" cy="15" r=".85" fill="#222"/><circle cx="16" cy="15" r=".85" fill="#222"/><polygon points="14,16.4 13,17.8 15,17.8" fill="#ffd23f"/>'},
{id:"iceaxolotl",n:"Frost Axolotl",nb:"uranus_meadow",pl:"uranus",d:"Smiling cyan crystal swimmer",svg:'<path d="M8 13l-2.2-1.5M7.8 15.5l-2.4 0M8.2 18l-2 1.5M20 13l2.2-1.5M20.2 15.5l2.4 0M19.8 18l2 1.5" stroke="#ff8aa8" stroke-width="1.3" stroke-linecap="round"/><circle cx="14" cy="16" r="5.2" fill="#9bf2ff"/><circle cx="12" cy="15.2" r=".85" fill="#222"/><circle cx="16" cy="15.2" r=".85" fill="#222"/><path d="M12.5 17.3q1.5 1.2 3 0" stroke="#222" stroke-width="1" fill="none" stroke-linecap="round"/>'},
{id:"cometpup",n:"Comet Pup",nb:"neptune_meadow",pl:"neptune",d:"Sapphire space-suit hound",svg:'<circle cx="14" cy="15.5" r="7.4" fill="rgba(160,210,255,.35)" stroke="#8ab8ff" stroke-width="1"/><ellipse cx="9.6" cy="15.5" rx="1.8" ry="3.5" fill="#3b6fd4"/><ellipse cx="18.4" cy="15.5" rx="1.8" ry="3.5" fill="#3b6fd4"/><circle cx="14" cy="16" r="4.6" fill="#7aa8ff"/><circle cx="12.3" cy="15.2" r=".85" fill="#222"/><circle cx="15.7" cy="15.2" r=".85" fill="#222"/><circle cx="14" cy="16.8" r="1" fill="#222"/>'},
{id:"nebula",n:"Nebula Dragon",nb:"neptune_sky",pl:"neptune",d:"Cosmic guardian of the outer rim",svg:'<polygon points="9.5,12 8,7.5 12.2,11" fill="#ffd23f"/><polygon points="18.5,12 20,7.5 15.8,11" fill="#ffd23f"/><circle cx="14" cy="16" r="5.4" fill="#6a5fd6"/><circle cx="12" cy="15.2" r=".95" fill="#ffe27a"/><circle cx="16" cy="15.2" r=".95" fill="#ffe27a"/><path d="M12 17.6q2 1.2 4 0" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round"/>'}
];
const petById=id=>PETS.find(x=>x.id===id);
function petSvg(id,w,h){
 const pt=petById(id);if(!pt)return"";
 return '<svg viewBox="4 5 20 18" width="'+(w||28)+'" height="'+(h||26)+'" aria-hidden="true">'+pt.svg+'</svg>';
}
function isPetUnlocked(pt,best){
 if(!pt)return false;
 if(S.pets&&S.pets[pt.id])return true;
 if(pt.st&&best>=pt.st)return true;
 if(pt.nb&&S.nb&&S.nb.xp&&S.nb.xp[pt.nb]!==undefined)return true;
 return false;
}
function syncPetUnlocks(streak){
 let newly=[];
 const best=Math.max(streak||0,typeof streakBest==="function"?streakBest():0);
 PETS.forEach(pt=>{
  if(!S.pets[pt.id]&&isPetUnlocked(pt,best)){
   S.pets[pt.id]=1;
   newly.push(pt);
  }
 });
 if(newly.length){
  if(!S.p.pet||S.p.pet==="none")S.p.pet=newly[newly.length-1].id;
  save();
  const last=newly[newly.length-1];
  setTimeout(()=>{toast("🐾 Unlocked pet: "+last.n+"! Check Wardrobe → Pets.");burst(innerWidth/2,innerHeight/3,36,CONF)},1300);
 }
}
function headPetLayer(p,k){
 const id=p&&p.pet;
 const pt=petById(id);
 if(!pt)return"";
 // Position pet resting comfortably on top of the buddy's head/hat
 const hatOff=(p.hat&&p.hat!=="none")?-5.5:0;
 const topY=(k==="rectangle"?-6:k==="triangle"?-2:k==="duck"?-3:-4)+hatOff;
 return '<g class="head-pet" transform="translate(16 '+topY+') scale(.86)">'+pt.svg+'</g>';
}
function freshLook(k){return{kind:k,hat:"none",topStyle:"none",topColor:"blue",pants:"none",shoes:"none",eyes:"normal",glasses:"none",mouth:"none",body:KINDS[k].body,pet:"none",ex:{}}}
function layers(pp){
 const p=pp||S.p,k=GEO[p.kind]?p.kind:"square",g=GEO[k],duck=k==="duck";
 const bc=BODY[p.body]||BODY[KINDS[k].body],lm=dk(bc,.22),ts=p.topStyle,tc=COL[p.topColor]||COL.blue,ex=p.ex||{};
 const arm=ts!=="none"?tc:lm,pc=PANTS[p.pants]||(duck?"#ff9d2e":lm),sh=SHOES[p.shoes],b0=g.bx[0],b1=g.bx[1];
 let o="";
 if(ex.cape)o+='<polygon points="'+(b0-3)+',16 '+(b1+3)+',16 '+(b1+9)+',56 '+(b0-9)+',56" fill="#7c4dbd"/>';
 if(ex.backpack)o+='<rect x="'+(b1-4)+'" y="18" width="13" height="22" rx="2" fill="#3b6fd4"/><rect x="'+(b1-1)+'" y="27" width="7" height="7" fill="#2a54a8"/>';
 g.ls.forEach((l,i)=>{const cls=i?"leg-r":"leg-l";
  if(duck)o+='<g class="'+cls+'"><rect x="'+(l[0]+1)+'" y="'+l[1]+'" width="3" height="7" fill="'+pc+'"/><ellipse cx="'+(l[0]+2.5)+'" cy="52" rx="'+(sh?7:6)+'" ry="'+(sh?3:2.5)+'" fill="'+(sh||"#ff9d2e")+'"/></g>';
  else o+='<g class="'+cls+'">'+R(l[0],l[1],g.lw,g.lh,pc)+(sh?R(l[0]-1,l[1]+g.lh-4,g.lw+2,4,sh):"")+'</g>';
 });
 g.arm.forEach((a,i)=>{const cls=i?"arm-r":"arm-l";
  if(duck)o+='<g class="'+cls+'"><ellipse cx="'+(a[0]+5)+'" cy="'+(a[1]+7)+'" rx="5" ry="7" fill="'+arm+'"/></g>';
  else o+='<g class="'+cls+'">'+R(a[0],a[1],10,9,arm)+'</g>';
 });
 o+=g.bd(bc);
 if(duck)o+='<path d="M25 13Q24 7 28 8Q27 10 28 13Z" fill="'+bc+'"/>';
 if(ts!=="none"){
  o+=g.tp(tc);
  if(ts==="jacket")o+=R(g.zip[0],g.zip[1],g.zip[2],g.zip[3],"rgba(0,0,0,.25)");
  if(ts==="stripes")g.st.forEach(t=>{o+=R(t[0],t[1],t[2],2,"rgba(255,255,255,.45)")});
 }
 if(duck)o+='<ellipse cx="28" cy="31" rx="7" ry="3.6" fill="#ff9d2e"/><path d="M21.5 31H34.5" stroke="#d9791a" stroke-width=".8"/>';
 const et=g.et?' transform="'+g.et+'"':'';
 if(ex.cheeks)o+='<g'+et+'><rect x="14" y="28" width="5" height="3" fill="#ff8aa8" opacity=".85"/><rect x="37" y="28" width="5" height="3" fill="#ff8aa8" opacity=".85"/></g>';
 if(!duck&&p.mouth!=="none"){
  const mm=p.mouth==="smile"?'<path d="M24 31 Q28 34.5 32 31" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>':'<ellipse cx="28" cy="32" rx="3" ry="2.4" fill="#111"/>';
  o+='<g transform="translate(0 '+g.my+')">'+mm+'</g>';
 }
 let e='<rect x="19" y="19" width="5" height="8" fill="#111"/><rect x="32" y="19" width="5" height="8" fill="#111"/>';
 if(p.eyes==="round")e='<circle cx="21.5" cy="23" r="3.2" fill="#111"/><circle cx="34.5" cy="23" r="3.2" fill="#111"/>';
 if(p.eyes==="happy")e='<path d="M18.5 25 Q21.5 18.5 24.5 25" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round"/><path d="M31.5 25 Q34.5 18.5 37.5 25" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round"/>';
 if(p.eyes==="wink")e='<rect x="19" y="19" width="5" height="8" fill="#111"/><rect x="31" y="24" width="7" height="2.2" fill="#111"/>';
 let gl="";
 if(p.glasses==="square")gl='<rect x="16.5" y="17" width="10" height="12" fill="none" stroke="#111" stroke-width="1.8"/><rect x="29.5" y="17" width="10" height="12" fill="none" stroke="#111" stroke-width="1.8"/><rect x="26" y="21" width="4" height="1.8" fill="#111"/>';
 if(p.glasses==="round")gl='<circle cx="21.5" cy="23" r="6" fill="none" stroke="#111" stroke-width="1.8"/><circle cx="34.5" cy="23" r="6" fill="none" stroke="#111" stroke-width="1.8"/><rect x="27" y="22" width="2" height="1.8" fill="#111"/>';
 if(p.glasses==="shades")gl='<rect x="16" y="18" width="12" height="9" rx="1" fill="#111"/><rect x="29" y="18" width="12" height="9" rx="1" fill="#111"/><rect x="28" y="20" width="2" height="2" fill="#111"/><rect x="18" y="19" width="4" height="2" fill="rgba(255,255,255,.35)"/>';
 o+='<g'+et+'><g class="eyes">'+e+'</g>'+gl+'</g>';
 if(ex.scarf)o+=R(b0,33,b1-b0,5,"#c94a4a")+R(b1-9,36,6,12,"#c94a4a")+R(b1-9,43,6,2,"rgba(255,255,255,.4)");
 if(ex.bowtie)o+='<polygon points="28,36 20,32 20,40" fill="#c94a4a"/><polygon points="28,36 36,32 36,40" fill="#c94a4a"/><rect x="26" y="34" width="4" height="4" fill="#8f2f2f"/>';
 if(HAT[p.hat])o+='<g transform="translate(28 0) scale('+g.hat[1]+' 1) translate(-28 '+g.hat[0]+')">'+HAT[p.hat]+'</g>';
 o+=headPetLayer(p,k);
 return o;
}
function paint(){const l=layers();$("pal").innerHTML=l;document.querySelectorAll(".pv").forEach(e=>{e.innerHTML=l})}
function streakBest(){
 const ds=Object.keys(S.days).filter(k=>S.days[k]).sort();let best=0,run=0,prev=null;
 ds.forEach(k=>{const t=Date.parse(k);run=(prev!==null&&t-prev===864e5)?run+1:1;if(run>best)best=run;prev=t});
 return best;
}
const LOCKS=[["hat","cowboy","🤠 Cowboy hat",2],["hat","party","🎉 Party hat",2],["ex","backpack","🎒 Backpack",2],["ex","scarf","🧣 Scarf",2],["topStyle","jacket","Jacket",2],["hat","tophat","🎩 Top hat",3],["hat","phones","🎧 Headphones",3],["glasses","shades","😎 Shades",3],["topStyle","stripes","Striped top",3],["ex","cheeks","🌸 Blush",3],["hat","halo","😇 Halo",4],["ex","cape","🦸 Cape",4],["ex","bowtie","🎀 Bow tie",4],["hat","wizard","🧙 Wizard hat",5],["hat","crown","👑 Crown",6]];
const lockLv=(c,k)=>{const e=LOCKS.find(x=>x[0]===c&&x[1]===k);return e?e[3]:0};
const TITLES=["Newcomer","Sprout","Walker","Faithful","Steadfast","Champion","Shepherd","Lightbearer","Overcomer","Legend"];
const LV_START=n=>40*n*(n-1);
function lvOf(xp){let n=1;while(n<10&&xp>=LV_START(n+1))n++;return n}
const ttl=n=>TITLES[Math.min(n,TITLES.length)-1];
function lvInfo(){const n=lvOf(S.xp),a=LV_START(n);if(n>=10)return{n,a,b:a,need:1,into:1,pct:100,max:true};const b=LV_START(n+1);return{n,a,b,need:b-a,into:S.xp-a,pct:(S.xp-a)/(b-a)*100}}
function award(k,amt){if(S.aw.d!==today())S.aw={d:today(),k:{}};if(S.aw.k[k])return 0;S.aw.k[k]=1;S.xp+=amt;S.life=(S.life||0)+amt;S.nb.xp[S.nb.cur]=(S.nb.xp[S.nb.cur]||0)+amt;save();return amt}
function drawHero(){const I=lvInfo();$("lvb").textContent="Lv "+I.n;$("lvt").textContent=ttl(I.n);$("xpn").textContent=I.max?"MAX 🎓":I.into+" / "+I.need+" XP";$("xfill").style.width=I.pct+"%"}
function toast(t){const e=$("toast");e.textContent=t;rerun(e,"show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),2700)}
function floatXP(x,y,t){const e=document.createElement("span");e.className="fxp";e.textContent=t;e.style.left=x+"px";e.style.top=y+"px";document.body.appendChild(e);setTimeout(()=>e.remove(),1000)}
function levelUp(n){
 $("lun").textContent=n;$("lut").textContent=ttl(n);
 const un=LOCKS.filter(x=>x[3]===n).map(x=>x[2]);
 $("luu").textContent=n>=10?"Max level! Open the Town tab to graduate your buddy into town and start a new one.":(un.length?"Unlocked: "+un.join(", "):"Keep going, more rewards are ahead!");
 setTimeout(()=>{$("lu").classList.add("show");burst(innerWidth/2,innerHeight/3,44,CONF)},700);
}
$("lugo").onclick=()=>{$("lu").classList.remove("show");hop()};
$("hero").onclick=()=>$("prof").click();
function chips(el,list,cur,pick,cat){
 el.innerHTML="";const lv=lvOf(S.xp);
 list.forEach(o=>{
  const b=document.createElement("button");b.type="button";
  const need=cat?lockLv(cat,o[0]):0,lk=need>lv;
  b.className="chip"+(o[0]===cur?" on":"")+(lk?" locked":"")+((el.dataset.k+":"+o[0])===popTok?" pop":"");
  if(o[2]){const i=document.createElement("i");i.style.background=o[2];b.appendChild(i)}
  b.append(o[1]);
  if(lk){const sm=document.createElement("small");sm.textContent="🔒 Lv "+need;b.appendChild(sm)}
  b.onclick=()=>{if(lk){toast("🔒 Reach level "+need+" to unlock "+o[1]);rerun(b,"shake");return}popTok=el.dataset.k+":"+o[0];pick(o[0])};
  el.appendChild(b);
 });
}
let wTab="hats";
const TABS=[["buddies","🔷 Buddies"],["hats","🎩 Hats"],["pets","🐾 Pets"],["tops","👕 Tops"],["bottoms","👖 Bottoms"],["face","😎 Face"],["extras","✨ Extras"],["color","🎨 Color"]];
function sec(host,title,list,cur,pick,cat){
 const l=document.createElement("div");l.className="fl";l.textContent=title;
 const c=document.createElement("div");c.className="chips";c.dataset.k=title;l.appendChild(c);host.appendChild(l);chips(c,list,cur,pick,cat);
}
function setP(k,v){S.p[k]=v;save();paint();react();buildWd()}
function buildWd(){
 $("wtabs").dataset.k="tab";chips($("wtabs"),TABS,wTab,v=>{wTab=v;rerun($("wbody"),"fx");buildWd()});
 const h=$("wbody");h.innerHTML="";const p=S.p;
 if(wTab==="buddies"){
  const l=document.createElement("div");l.className="fl";
  l.textContent="Tap any unlocked buddy to equip them instantly!";
  h.appendChild(l);
  if(!window._wdPl)window._wdPl="all";
  const pbar=el("div","ixpbar");
  [["all","✨ All"],["earth","🌍 Earth"],["mars","🔴 Mars"],["jupiter","🟠 Jupiter"],["saturn","🪐 Saturn"],["uranus","🩵 Uranus"],["neptune","🔵 Neptune"]].forEach(([pid,lblTxt])=>{
   const b=el("button","ixpchip"+(window._wdPl===pid?" on":""),lblTxt);b.type="button";
   b.onclick=()=>{window._wdPl=pid;buildWd()};pbar.appendChild(b);
  });
  h.appendChild(pbar);
  const grid=document.createElement("div");grid.className="pgrid";
  const unl=unlockedKinds();
  Object.keys(KINDS).filter(k=>window._wdPl==="all"||(KINDS[k].pl||"earth")===window._wdPl).forEach(k=>{
   const kd=KINDS[k];
   const isUnl=(k==="square"||k==="circle"||k==="triangle"||k==="rectangle"||k==="duck")||unl.has(k);
   const eq=p.kind===k;
   const c=document.createElement("button");c.type="button";
   c.className="pcard"+(eq?" on":"")+(isUnl?"":" lk");
   const pv=document.createElement("div");pv.className="ixp";pv.style.height="60px";pv.style.margin="0 0 4px";
   if(isUnl){
    const lkLook=freshLook(k);
    ['hat','topStyle','topColor','pants','shoes','eyes','glasses','mouth','body','ex'].forEach(fk=>{if(p[fk]!==undefined)lkLook[fk]=p[fk]});
    pv.appendChild(svgOf(lkLook,52,56));
   }else{
    pv.appendChild(el("span","ixq","?"));
   }
   c.appendChild(pv);
   c.appendChild(el("b","",isUnl?kd.n:"???"));
   c.appendChild(el("small","",eq?"Equipped ✓":isUnl?kd.r:("🔒 Settle "+(kd.nb?NB[kd.nb].n:"town"))));
   c.onclick=()=>{
    if(!isUnl){toast("🔒 Settle "+(kd.nb?NB[kd.nb].n:"the ecosystem")+" on the Solar Map to unlock "+kd.n+"!");rerun(c,"shake");return}
    S.p.kind=k;
    if(!BODY[p.body])S.p.body=kd.body;
    save();paint();react();buildWd();toast("Equipped "+kd.n+"!");
   };
   grid.appendChild(c);
  });
  h.appendChild(grid);
 }
 if(wTab==="hats")sec(h,"Hat",HATS,p.hat,v=>setP("hat",v),"hat");
 if(wTab==="tops"){
  sec(h,"Style",[["none","None"],["tee","T-shirt"],["jacket","Jacket"],["stripes","Stripes"]],p.topStyle,v=>setP("topStyle",v),"topStyle");
  if(p.topStyle!=="none")sec(h,"Color",cn(COL),p.topColor,v=>setP("topColor",v));
 }
 if(wTab==="bottoms"){
  sec(h,"Pants",cz(PANTS),p.pants,v=>setP("pants",v));
  sec(h,"Shoes",cz(SHOES),p.shoes,v=>setP("shoes",v));
 }
 if(wTab==="face"){
  sec(h,"Eyes",[["normal","Normal"],["round","Round"],["happy","Happy"],["wink","Wink"]],p.eyes,v=>setP("eyes",v));
  sec(h,"Glasses",[["none","None"],["square","Square"],["round","Round"],["shades","😎 Shades"]],p.glasses,v=>setP("glasses",v),"glasses");
  sec(h,"Mouth",[["none","None"],["smile","Smile"],["open","Open"]],p.mouth,v=>setP("mouth",v));
 }
 if(wTab==="extras"){
  const l=document.createElement("div");l.className="fl";l.textContent="Tap to turn on or off";
  const c=document.createElement("div");c.className="chips";l.appendChild(c);h.appendChild(l);
  const lv=lvOf(S.xp);
  [["scarf","🧣 Scarf"],["bowtie","🎀 Bow tie"],["cape","🦸 Cape"],["backpack","🎒 Backpack"],["cheeks","🌸 Blush"]].forEach(o=>{
   const need=lockLv("ex",o[0]),lk=need>lv;
   const b=document.createElement("button");b.type="button";b.className="chip"+(p.ex&&p.ex[o[0]]?" on":"")+(lk?" locked":"")+(("x:"+o[0])===popTok?" pop":"");b.textContent=o[1];
   if(lk){const sm=document.createElement("small");sm.textContent="🔒 Lv "+need;b.appendChild(sm)}
   b.onclick=()=>{if(lk){toast("🔒 Reach level "+need+" to unlock "+o[1]);rerun(b,"shake");return}popTok="x:"+o[0];S.p.ex=S.p.ex||{};S.p.ex[o[0]]=!S.p.ex[o[0]];save();paint();react();buildWd()};c.appendChild(b);
  });
 }
 if(wTab==="pets"){
  const best=Math.max(curStreak,streakBest());
  const l=document.createElement("div");l.className="fl";
  l.textContent="Best streak: 🔥 "+best+" days · Active pet rests on your buddy’s head & follows in Faith Town!";
  h.appendChild(l);
  const grid=document.createElement("div");grid.className="pgrid";
  const noneBtn=document.createElement("button");noneBtn.type="button";
  noneBtn.className="pcard"+((!p.pet||p.pet==="none")?" on":"");
  noneBtn.innerHTML='<div style="height:34px;display:grid;place-items:center;font-size:20px;color:var(--mute)">∅</div><b>No Pet</b><small>Rest on your own</small>';
  noneBtn.onclick=()=>setP("pet","none");
  grid.appendChild(noneBtn);
  PETS.forEach(pt=>{
   const unl=isPetUnlocked(pt,best);
   if(unl&&!S.pets[pt.id]){S.pets[pt.id]=1;save()}
   const on=p.pet===pt.id;
   const reqTxt=pt.nb?("🔒 Settle "+NB[pt.nb].n):("🔒 "+pt.st+"-day streak");
   const c=document.createElement("button");c.type="button";
   c.className="pcard"+(on?" on":"")+(unl?"":" lk");
   c.innerHTML=petSvg(pt.id,34,32)+'<b>'+pt.n+'</b><small>'+(on?"Equipped ✓":unl?pt.d:reqTxt)+'</small>';
   c.onclick=()=>{
    if(!unl){toast(pt.nb?"🚀 Settle "+NB[pt.nb].n+" on the Solar Map to unlock "+pt.n+"!":"🔥 Reach a "+pt.st+"-day streak to unlock "+pt.n+"!");rerun(c,"shake");return}
    setP("pet",on?"none":pt.id);
   };
   grid.appendChild(c);
  });
  h.appendChild(grid);
 }
 if(wTab==="color")sec(h,"Body color",cn(BODY),p.body,v=>setP("body",v));
 popTok=null;
}
function fillLv(){
 const I=lvInfo(),L=$("lvlist");L.innerHTML="";
 for(let n=1;n<=10;n++){
  const r=document.createElement("div");r.className="lvrow"+(n<I.n?" past":"")+(n===I.n?" cur":"");
  const nb=document.createElement("span");nb.className="lvn";nb.textContent=n;
  const t=document.createElement("div");const b=document.createElement("b");b.textContent=ttl(n);
  const sm=document.createElement("small");const un=LOCKS.filter(x=>x[3]===n).map(x=>x[2]);
  sm.textContent=(n===1?"Start here":LV_START(n)+" XP")+(un.length?" · Unlocks "+un.join(", "):"");
  t.append(b,sm);
  const st=document.createElement("span");st.textContent=n<I.n?"✓":(n===I.n?"⭐":"🔒");
  r.append(nb,t,st);L.appendChild(r);
 }
}
function fillInfo(anim){
 const cur=curStreak,best=Math.max(streakBest(),cur);
 let tot=0;Object.values(S.checks).forEach(o=>{Object.values(o).forEach(v=>{if(v)tot++})});
 const f=(el,n)=>anim?countTo(el,n):(el.textContent=n);f($("s1"),cur);f($("s2"),best);f($("s3"),tot);
 $("pn").value=S.p.name;$("bn").value=S.p.buddy;
 $("pst").textContent=(S.p.buddy||"Buddy")+(cur?" is cheering for your "+cur+"-day streak!":" is ready when you are!");
 renderUsers();
}
function view(v){
 ["menu","wd","lv","info"].forEach(x=>{$("v-"+x).hidden=x!==v});rerun($("v-"+v),"fx");
 if(v==="menu"){
  const I=lvInfo();$("mt").textContent=S.p.buddy||"Buddy";$("mst").textContent="Level "+I.n+" · "+ttl(I.n);
  $("mxt").textContent=I.max?"Max level reached! 🎉":I.into+" / "+I.need+" XP to level "+(I.n+1);
  $("mp1").textContent="🔥 "+curStreak+"-day streak";$("mp2").textContent="⭐ "+S.xp+" XP";$("mp3").textContent="👤 "+(S.p.name||"Friend");$("go-grad").hidden=!maxed();
  const x=$("mxf");x.style.width="0%";requestAnimationFrame(()=>requestAnimationFrame(()=>{x.style.width=I.pct+"%"}));
 }
 if(v==="wd")buildWd();
 if(v==="lv")fillLv();
 if(v==="info")fillInfo(true);
}
$("prof").onclick=()=>{view("menu");$("pm").classList.add("show")};
$("go-bud").onclick=()=>{wTab="buddies";view("wd")};
$("go-wd").onclick=()=>{if(wTab==="buddies")wTab="hats";view("wd")};
$("go-lv").onclick=()=>view("lv");
$("go-info").onclick=()=>view("info");
document.querySelectorAll("[data-back]").forEach(b=>{b.onclick=()=>view("menu")});
$("pdone").onclick=()=>{$("pm").classList.remove("show");hop()};
$("pm").onclick=e=>{if(e.target===$("pm"))$("pm").classList.remove("show")};
$("pn").oninput=()=>{S.p.name=$("pn").value.trim();save();render()};
$("bn").oninput=()=>{S.p.buddy=$("bn").value.trim();save();fillInfo()};
const VERSES=[
{r:"1 Corinthians 10:31",t:"Whether therefore ye eat, or drink, or whatsoever ye do, do all to the glory of God."},
{r:"Colossians 3:23",t:"And whatsoever ye do, do it heartily, as to the Lord, and not unto men;"},
{r:"Philippians 4:13",t:"I can do all things through Christ which strengtheneth me."},
{r:"Proverbs 3:5",t:"Trust in the LORD with all thine heart; and lean not unto thine own understanding."},
{r:"Joshua 1:9",t:"Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest."},
{r:"Psalm 46:1",t:"God is our refuge and strength, a very present help in trouble."},
{r:"Isaiah 40:31",t:"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."},
{r:"Galatians 6:9",t:"And let us not be weary in well doing: for in due season we shall reap, if we faint not."},
{r:"Psalm 23:1",t:"The LORD is my shepherd; I shall not want."},
{r:"Matthew 5:16",t:"Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."},
{r:"Psalm 118:24",t:"This is the day which the LORD hath made; we will rejoice and be glad in it."},
{r:"Jeremiah 29:11",t:"For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end."},
{r:"Matthew 11:28",t:"Come unto me, all ye that labour and are heavy laden, and I will give you rest."},
{r:"Proverbs 16:3",t:"Commit thy works unto the LORD, and thy thoughts shall be established."},
{r:"Psalm 119:105",t:"Thy word is a lamp unto my feet, and a light unto my path."}];
const VS=VERSES.filter(v=>v.t.length<=100);
const NAMES=["Ruth","Caleb","Naomi","Eli","Hannah","Josiah","Lydia","Micah","Esther","Silas","Tabitha","Gideon"];
const DLG=[["Good morning! Did you read today’s verse?","I did! It gave me such peace."],["Your house looks great!","Thanks! God blessed this town."],["I just finished my morning run!","Nice! Strength for serving, right?"],["Want to pray together later?","I’d love that. See you soon!"],["I drank all my water today 💧","Caring for the body God gave us!"],["I cleaned my room this morning.","A tidy home is a peaceful home."],["Have you met our newest neighbor?","Not yet, let’s go say hi!"],["I’m so grateful for good friends.","Me too. Thank you, Lord!"],["How’s your streak going?","Strong! One day at a time. 🔥"],["Cold shower this morning, brr!","Self-control builds character!"]];
const NB={
meadow:{pl:"earth",eco:"meadow",n:"Meadow Valley",d:"Rolling green hills and wildflowers.",bud:"clover",ac:"#4cae6a",sky:["#8fd0ff","#e6f6ff"],hill:"#a9dca0",gr:["#93d684","#5fb56a"],road:"#dccca6",wc:"#6ec6ff",pc:"#5eb5e8",tree:"pine",hc:[["#f3d9a8","#c0504d"],["#cfe3f5","#3b6fd4"],["#e8d4f5","#7c4dbd"],["#d8efd8","#3f9d63"],["#fde3e3","#e5509a"]]},
seaside:{pl:"earth",eco:"seaside",n:"Seaside Harbor",d:"Warm sand, sea breeze and sailboats.",bud:"shell",ac:"#3a95e0",sky:["#6fc3ff","#fff1dc"],hill:"#f1deae",gr:["#f8e9bd","#e8d094"],road:"#d6bd88",wc:"#7fd6ff",pc:"#3fb0e8",tree:"palm",hc:[["#ffffff","#2f86d6"],["#fff4e0","#e5624a"],["#e6f4ff","#1f6fb5"],["#ffffff","#2aa6a0"],["#fff0f0","#e5509a"]]},
snowy:{pl:"earth",eco:"snowy",n:"Snowy Hollow",d:"Cozy cabins under fresh snow.",bud:"snowflake",ac:"#8bbbe0",sky:["#a9c7e8","#f3f8ff"],hill:"#dfeaf5",gr:["#f4f8fd","#d3e2f0"],road:"#c7d5e3",wc:"#d6ecfb",pc:"#cfe6f6",tree:"snowpine",roofStyle:"snow",hc:[["#c98f5a","#f1f6fb"],["#b57b4a","#eef4fa"],["#d9a46c","#f4f8fc"],["#a86f40","#edf3f9"],["#c4864f","#f1f6fb"]]},
oasis:{pl:"earth",eco:"oasis",n:"Sunny Oasis",d:"Golden dunes, palms and a hidden pond.",bud:"sunburst",ac:"#e0a040",sky:["#ffc27a","#fff2d1"],hill:"#efca82",gr:["#f6d894","#e2b566"],road:"#d6b676",wc:"#6ee0e0",pc:"#3fc9c9",tree:"palm",roofStyle:"flat",hc:[["#f0d3a0","#c0793f"],["#e8c48c","#b3672f"],["#f5dcae","#d08a4a"],["#e0b87c","#a95f2b"],["#f2d19a","#c77b3e"]]},
autumn:{pl:"earth",eco:"autumn",n:"Autumn Woods",d:"Crisp air and falling leaves.",bud:"acorn",ac:"#d9602a",sky:["#ffb877","#fff0dc"],hill:"#d9a35a",gr:["#cfa850","#9d7c36"],road:"#c8a878",wc:"#8fd0e8",pc:"#6ab8d8",tree:"autumn",hc:[["#e8c999","#b5472f"],["#f0d6a8","#a8562a"],["#dcbb86","#8f3b22"],["#ecd0a0","#c05a2a"],["#e3c08a","#9d4a2a"]]},
starlight:{pl:"earth",eco:"starlight",n:"Starlight Ridge",d:"Twilight peaks beneath glowing constellations.",bud:"starshape",ac:"#8a56c9",sky:["#342a6e","#8e76c9"],hill:"#564994",gr:["#6859ab","#463b7d"],road:"#b6aad9",wc:"#9bd0ff",pc:"#7ab6f5",tree:"starpine",hc:[["#ede7ff","#6b4dbd"],["#dcd4f7","#4d6fd4"],["#f5e6ff","#9a4dbd"],["#e3ebff","#3b5fa8"],["#f7e4f5","#c9509a"]]},
crystal:{pl:"earth",eco:"crystal",n:"Crystal Caverns",d:"Sparkling geodes and turquoise springs.",bud:"gem",ac:"#2aa6a0",sky:["#4bb8b0","#d8f7f2"],hill:"#74c9c2",gr:["#88dcd4","#49a89f"],road:"#cfe6e3",wc:"#8ff5ee",pc:"#52d9cf",tree:"crystaltree",roofStyle:"flat",hc:[["#e6fbf9","#268f8a"],["#d8f0f7","#3b78b5"],["#ebfaf5","#3f9d7a"],["#e0f4fa","#2a6f9c"],["#f0f7ff","#5a6fd4"]]},
sky:{pl:"earth",eco:"sky",n:"Sky Arch",d:"Sunlit cloud islands floating above the horizon.",bud:"earthplanet",ac:"#5b9bd5",sky:["#68b8ff","#eef8ff"],hill:"#b8e2ff",gr:["#d6efff","#9fd2f7"],road:"#fff5db",wc:"#7fd6ff",pc:"#52b8f5",tree:"cloudtree",hc:[["#ffffff","#4a86d9"],["#fff8e6","#e8941a"],["#eef6ff","#6a5fd6"],["#ffffff","#3fa35d"],["#fff0f6","#e5509a"]]}
};

const SPACE_CFG={
mars:{pre:"Mars",sky:["#2b1018","#c95a38"],hill:"#b5472a",gr:["#d96b43","#9c3a1e"],road:"#e0a888",buds:["rocketbud","craterbud","frostorb","solardome","dustcore","phobos","marsgem","marsplanet"],
 names:["Ares Bio-Dome","Mariner Bay","Olympus Frost","Helios Dunes","Canyon Colony","Phobos Ridge","Red Quartz Cavern","Zephyr Aerostat"],
 descs:["Pressurized biodome meadows on Mars.","Crimson shore beside ancient Martian seas.","Frost-capped polar research outpost.","Solar-powered desert oasis station.","Rust-red canyon winds & astronaut habitats.","Starlit Martian ridge under twin moons.","Glowing red-quartz cavern outpost.","High-altitude Martian sky-dock."]},
jupiter:{pre:"Jupiter",sky:["#241428","#d98a3c"],hill:"#c97732",gr:["#e8a454","#b05d22"],road:"#f0cfa0",buds:["stormeye","tidepod","cryocube","ionflare","amberorb","galilean","jovian","jupiterplanet"],
 names:["Amber Meadow Deck","Europa Tide Station","Cryo Cloud Shelf","Io Solar Atoll","Saffron Gust Woods","Galilean Observatory","Jovian Geode Platform","Great Red Skyport"],
 descs:["Floating biodome garden above Jupiter’s bands.","Oceanic moon-tide research harbor.","Sub-zero ice-crystal cloud station.","Sunlit golden energy collector deck.","Swirling amber-leaf sky arboretum.","Deep-space starlight observatory.","Turquoise crystal energy cavern.","Stratospheric cloud-arch station."]},
saturn:{pre:"Saturn",sky:["#1e1936","#d9b35a"],hill:"#c49c48",gr:["#ebd07a","#a88132"],road:"#f5e6b8",buds:["ringling","titanwave","enceladus","goldhalo","duskring","cassini","ringgem","saturnplanet"],
 names:["Ringview Meadow","Titan Liquid Harbor","Enceladus Geyser Base","Golden Ring Oasis","Amber Horizon Woods","Cassini Star Spire","Halo Crystal Vault","Nimbus Ring Arch"],
 descs:["Greenhouse biodome framed by Saturn’s rings.","Methane-sea harbor on Titan’s coast.","Ice-geyser cryo habitat.","Sun-drenched golden ring oasis.","Warm amber-lit orbital arboretum.","Twilight starlight tower beneath the rings.","Luminous ring-crystal cavern.","Floating cloud-island arch in Saturn’s sky."]},
uranus:{pre:"Uranus",sky:["#11283b","#46b8cc"],hill:"#389cb0",gr:["#7be0ed","#2c8599"],road:"#c8f2f7",buds:["cyanmist","miranda","glacier","auroradisk","oberon","arielstar","iceprism","uranusplanet"],
 names:["Cyan Mist Meadow","Miranda Cliff Harbor","Glacier Dome Hollow","Aurora Ice Oasis","Oberon Twilight Woods","Ariel Starlight Ridge","Frost Prism Caverns","Zephyr Cloud Arch"],
 descs:["Misty turquoise biodome valley.","Ice-cliff harbor overlooking cyan seas.","Sub-zero glacier astronaut station.","Glowing aurora oasis outpost.","Cool amber-lit orbital woods.","Constellation ridge above Uranus.","Sparkling frost-prism cavern.","Floating sky-arch observatory."]},
neptune:{pre:"Neptune",sky:["#0b1438","#2d5be0"],hill:"#2448b8",gr:["#5c8ef2","#1d3c9e"],road:"#bdd4ff",buds:["triton","abyssfin","cometice","blueflare","nebula","pulsar","sapphire","neptuneplanet"],
 names:["Triton Bio-Valley","Sapphire Abyss Harbor","Comet Ice Outpost","Blue Beacon Oasis","Nebula Drift Woods","Pulsar Starlight Spire","Sapphire Geode Cavern","Cosmo Sky Citadel"],
 descs:["Deep-blue biodome valley on Triton.","Sapphire ocean research harbor.","Comet-ice cryo habitat.","Radiant blue-star oasis station.","Violet-amber nebula arboretum.","Twin-star observatory ridge.","Deep sapphire crystal cavern.","The ultimate outer-rim sky citadel."]}
};

["mars","jupiter","saturn","uranus","neptune"].forEach(pl=>{
 const cfg=SPACE_CFG[pl];
 BASE_ECO.forEach((eco,idx)=>{
  const base=NB[eco],id=pl+"_"+eco;
  NB[id]={
   pl,eco,
   n:cfg.names[idx],
   d:cfg.descs[idx],
   bud:cfg.buds[idx],
   ac:base.ac,
   sky:eco==="starlight"?base.sky:cfg.sky,
   hill:cfg.hill,
   gr:eco==="snowy"?base.gr:cfg.gr,
   road:cfg.road,
   wc:base.wc,
   pc:base.pc,
   tree:base.tree,
   roofStyle:base.roofStyle,
   hc:[["#f4f7fb","#e5624a"],["#e6eef8","#3b6fd4"],["#f7f9fc","#ffb300"],["#eaf4f8","#2aa6a0"],["#f3ebfa","#8a56c9"]]
  };
 });
});

const planetNbs=pl=>BASE_ECO.map(e=>pl==="earth"?e:(pl+"_"+e));
const NBK=Object.keys(NB);
NBK.forEach(k=>{if(S.nb.xp&&S.nb.xp[k]!==undefined&&NB[k].bud)S.seenK[NB[k].bud]=1});
let NBC=NB.meadow;
const R=(x,y,w,h,f)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+f+'"/>';
const RW=(x,y,w,h)=>'<rect class="win" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#bfe3ff"/>';
const houseS=i=>{
 // When on a space planet (Mars, Jupiter, Saturn, Uranus, Neptune), render Astronaut Space Habitats & Domed Modules!
 if(NBC.pl&&NBC.pl!=="earth"){
  const c=NBC.hc[i%5];
  let o='<path d="M-17 -12A17 17 0 0 1 17 -12Z" fill="rgba(165,230,255,.38)" stroke="#9ad8ff" stroke-width="1.2"/>';
  o+='<ellipse cx="0" cy="-21" rx="7" ry="3" fill="rgba(255,255,255,.45)"/>';
  o+=R(-18,-12,36,12,c[0])+R(-20,-14,40,3,c[1]);
  o+='<rect x="-5" y="-10" width="10" height="10" rx="4" fill="#3a4a5e" stroke="'+c[1]+'" stroke-width="1.4"/>';
  o+='<circle class="win" cx="-11" cy="-6" r="2.6" fill="#9be8ff"/><circle class="win" cx="11" cy="-6" r="2.6" fill="#9be8ff"/>';
  o+='<line x1="12" y1="-26" x2="12" y2="-36" stroke="#d8e6f3" stroke-width="1.4"/><circle class="tw" cx="12" cy="-37" r="2" fill="#ff6a1a"/>';
  return o;
 }
 const c=NBC.hc[i%5],flat=NBC.roofStyle==="flat",snow=NBC.roofStyle==="snow";
 let o=R(-16,-22,32,22,c[0]);
 if(flat)o+=R(-19,-26,38,5,c[1])+R(-7,-30,14,5,c[1]);
 else{o+='<polygon points="-20,-22 0,-38 20,-22" fill="'+c[1]+'"'+(snow?' stroke="#b9cde0" stroke-width="1"':'')+'/>'+R(8,-36,5,9,"#8a6a4a")+'<circle class="sm" cx="10.5" cy="-39" r="2.2" fill="#fff" style="animation-delay:-'+(i*.7)+'s"/><circle class="sm" cx="10.5" cy="-39" r="2" fill="#fff" style="animation-delay:-'+(i*.7+1.5)+'s"/>'}
 return o+R(-4,-14,8,14,"#6b4423")+RW(-13,-17,6,6)+RW(7,-17,6,6);
};
const tree=(x,y,s)=>{
 const k=NBC.tree;let t="";
 if(k==="pine")t=R(-1.5,-5,3,5,"#6b4423")+'<polygon points="-10,-5 0,-22 10,-5" fill="#2f8f4e"/><polygon points="-7,-16 0,-32 7,-16" fill="#3aa35d"/>';
 if(k==="snowpine")t=R(-1.5,-5,3,5,"#6b4423")+'<polygon points="-10,-5 0,-22 10,-5" fill="#3a7a62"/><polygon points="-7,-16 0,-32 7,-16" fill="#468f74"/><polygon points="-7.5,-12 0,-22 7.5,-12 4.5,-13.5 0,-18 -4.5,-13.5" fill="#fff"/><polygon points="-4.4,-24 0,-32 4.4,-24 2,-25.5 0,-28.5 -2,-25.5" fill="#fff"/>';
 if(k==="palm"){t='<path d="M0 0Q4 -10 -1 -24" stroke="#9b6a3a" stroke-width="3" fill="none" stroke-linecap="round"/><g transform="translate(-1 -24)">';[-170,-130,-90,-50,-10].forEach(a=>{t+='<ellipse cx="9" cy="0" rx="9" ry="3" fill="#3fa35d" transform="rotate('+a+')"/>'});t+='<circle cx="-1.5" cy="2" r="1.6" fill="#7a4a22"/><circle cx="1.5" cy="2" r="1.6" fill="#7a4a22"/></g>'}
 if(k==="autumn")t=R(-1.8,-9,3.6,9,"#6b4423")+'<circle cx="0" cy="-20" r="11" fill="#e8812a"/><circle cx="-6" cy="-15" r="7" fill="#d9602a"/><circle cx="6" cy="-16" r="7" fill="#f0a030"/>';
 if(k==="starpine")t=R(-1.5,-5,3,5,"#4a3a70")+'<polygon points="-10,-5 0,-22 10,-5" fill="#4f428a"/><polygon points="-7,-16 0,-32 7,-16" fill="#6d5bb8"/><circle class="tw" cx="0" cy="-34" r="2.2" fill="#ffe27a"/>';
 if(k==="crystaltree")t='<polygon points="-4,0 0,-26 4,0" fill="#52d9cf"/><polygon points="-9,0 -4,-17 0,0" fill="#8ff5ee"/><polygon points="0,0 5,-19 9,0" fill="#2aa6a0"/>';
 if(k==="cloudtree")t=R(-1.4,-8,2.8,8,"#d9b88c")+'<circle cx="0" cy="-18" r="9" fill="#fff"/><circle cx="-6" cy="-14" r="6" fill="#eef8ff"/><circle cx="6" cy="-14" r="6" fill="#eef8ff"/>';
 return '<g transform="translate('+x+' '+y+') scale('+s+')"><g class="sway" style="animation-delay:-'+((x%7)*.6)+'s">'+t+'</g></g>';
};
const flo=(x,y,c)=>'<g class="sway" style="animation-delay:-'+(x%5)+'s"><line x1="'+x+'" y1="'+y+'" x2="'+x+'" y2="'+(y-7)+'" stroke="#3a8f4e" stroke-width="1"/><circle cx="'+x+'" cy="'+(y-8)+'" r="2.4" fill="'+c+'"/></g>';
function gdn(){
 const id=NBC.eco||Object.keys(NB).find(k=>NB[k]===NBC);
 if(id==="meadow")return '<circle cx="262" cy="214" r="5" fill="#3aa35d"/><circle cx="96" cy="212" r="5" fill="#3aa35d"/>'+flo(268,222,"#e5509a")+flo(256,225,"#f0c14b")+flo(102,223,"#fff")+flo(90,224,"#e5509a")+flo(45,226,"#f0c14b");
 if(id==="seaside")return '<g transform="translate(264 224)"><rect x="-.8" y="-20" width="1.6" height="20" fill="#8b5a2b"/><path d="M-13 -20a13 10 0 0 1 26 0z" fill="#e5624a"/><path d="M-4 -20Q-3 -28 0 -29Q3 -28 4 -20z" fill="#fff"/></g><circle cx="98" cy="224" r="4.5" fill="#fff" stroke="#e5509a" stroke-width="1.6"/><ellipse cx="60" cy="228" rx="3" ry="2" fill="#ffd9e0"/><ellipse cx="232" cy="228" rx="3" ry="2" fill="#fff"/>';
 if(id==="snowy")return '<g transform="translate(264 226)"><circle cy="-6" r="7" fill="#fff" stroke="#c9d8e8"/><circle cy="-16" r="5" fill="#fff" stroke="#c9d8e8"/><circle cy="-23" r="3.6" fill="#fff" stroke="#c9d8e8"/><polygon points="0,-23 6,-22 0,-21.4" fill="#ff8a3c"/><circle cx="-1.3" cy="-24.2" r=".6" fill="#222"/><circle cx="1.3" cy="-24.2" r=".6" fill="#222"/><rect x="-4" y="-19" width="8" height="1.8" fill="#c94a4a"/></g><ellipse cx="98" cy="226" rx="9" ry="3" fill="#fff"/><ellipse cx="40" cy="230" rx="7" ry="2.4" fill="#fff"/>';
 if(id==="oasis")return '<g transform="translate(262 224)">'+R(-2.5,-16,5,16,"#3f9d63")+R(-8,-12,3,6,"#3f9d63")+R(-8,-12,6,3,"#3f9d63")+R(5,-14,3,6,"#3f9d63")+R(2,-14,6,3,"#3f9d63")+'</g><g transform="translate(96 226) scale(.8)">'+R(-2.5,-16,5,16,"#4cae6a")+R(-8,-11,3,6,"#4cae6a")+R(-8,-11,6,3,"#4cae6a")+'</g>';
 if(id==="starlight")return '<circle class="tw" cx="264" cy="220" r="3" fill="#ffe27a"/><circle class="tw" style="animation-delay:-1s" cx="98" cy="222" r="2.5" fill="#b8d8ff"/><polygon points="274,226 276,220 278,226" fill="#ffe27a"/>';
 if(id==="crystal")return '<polygon points="260,226 264,214 268,226" fill="#8ff5ee"/><polygon points="266,226 270,217 274,226" fill="#52d9cf"/><polygon points="94,226 98,215 102,226" fill="#8ff5ee"/>';
 if(id==="sky")return '<ellipse cx="264" cy="224" rx="12" ry="5" fill="#fff"/><ellipse cx="272" cy="222" rx="8" ry="4" fill="#fff"/><ellipse cx="98" cy="225" rx="10" ry="4" fill="#fff"/>';
 return '<ellipse cx="264" cy="224" rx="6" ry="5" fill="#e8812a"/><rect x="263" y="217" width="2" height="3" fill="#4a7a2a"/><ellipse cx="276" cy="228" rx="5" ry="4.2" fill="#f0902a"/><ellipse cx="98" cy="226" rx="6" ry="5" fill="#e8812a"/><ellipse cx="46" cy="230" rx="10" ry="3" fill="#c24a22"/><ellipse cx="238" cy="230" rx="9" ry="3" fill="#d9602a"/>';
}
const BLD=[
{n:"First Home",at:0,x:82,y:150,h:1,d:"Where your journey began.",svg:()=>houseS(0)},
{n:"Garden",at:60,x:0,y:0,cx:345,cy:205,d:"Trees, flowers and little touches that make it home.",svg:()=>tree(345,205,1)+tree(330,214,.8)+tree(14,208,1)+tree(29,215,.75)+gdn()},
{n:"Town Fountain",at:150,x:180,y:200,d:"A gathering place in the town square.",svg:()=>'<ellipse cx="0" cy="-4" rx="18" ry="7" fill="#9fb4c7"/><ellipse class="wtr" cx="0" cy="-5" rx="14" ry="5" fill="'+NBC.wc+'"/><ellipse class="rip" cx="0" cy="-5" rx="14" ry="5"/><ellipse class="rip b" cx="0" cy="-5" rx="14" ry="5"/>'+R(-2,-22,4,17,"#9fb4c7")+'<circle class="dr" cx="-4" cy="-24" r="2" fill="#bfe8ff"/><circle class="dr b" cx="4" cy="-24" r="2" fill="#bfe8ff"/><circle class="dr c" cx="0" cy="-26" r="1.8" fill="#bfe8ff"/><circle class="dr d" cx="-7" cy="-22" r="1.5" fill="#bfe8ff"/>'},
{n:"Second Home",at:270,x:140,y:150,h:1,d:"A new neighbor moves in.",svg:()=>houseS(1)},
{n:"Word Hall",at:420,x:208,y:150,d:"A hall for reading and sharing Scripture.",svg:()=>R(-26,-24,52,24,"#d9b98a")+'<polygon points="-30,-24 0,-42 30,-24" fill="#8b5a2b"/>'+R(-5,-14,10,14,"#6b4423")+'<rect x="-10" y="-35" width="20" height="9" rx="2" fill="#fff"/><g transform="translate(-6 -36.5) scale(.5)"><g class="flt">'+ICONS.book+'</g></g>'},
{n:"Third Home",at:600,x:272,y:150,h:1,d:"The town keeps growing.",svg:()=>houseS(2)},
{n:"Chapel",at:840,x:50,y:196,d:"A place to pray together.",svg:()=>R(-14,-22,28,22,"#f1ece2")+'<polygon points="-18,-22 0,-34 18,-22" fill="#b04a3a"/>'+R(-4,-46,8,13,"#f1ece2")+'<polygon points="-5,-46 0,-56 5,-46" fill="#b04a3a"/>'+R(-.8,-66,1.6,10,"#f0c14b")+R(-3.5,-63,7,1.6,"#f0c14b")+'<path class="bell" d="M-2.5 -35Q-2.5 -42 0 -42Q2.5 -42 2.5 -35Z" fill="#f0c14b"/><circle class="tw" cx="0" cy="-62" r="3.5" fill="#fff3b0"/><path d="M-4 0V-9A4 4 0 0 1 4 -9V0Z" fill="#6b4423"/>'},
{n:"Fourth Home",at:1140,x:305,y:196,h:1,d:"Another family joins the community.",svg:()=>houseS(3)},
{n:"Lily Pond",at:1500,x:112,y:200,d:"A quiet pond for reflection.",svg:()=>'<ellipse cx="0" cy="-4" rx="26" ry="9" fill="'+NBC.pc+'"/><ellipse class="rip" cx="0" cy="-4" rx="24" ry="8"/><ellipse class="rip b" cx="0" cy="-4" rx="24" ry="8"/><ellipse class="lily" cx="-8" cy="-5" rx="5" ry="2" fill="#6fcf7f"/><ellipse class="lily" style="animation-delay:-1.7s" cx="9" cy="-3" rx="4" ry="1.6" fill="#6fcf7f"/><ellipse class="fish" cx="-14" cy="-4" rx="3" ry="1.5" fill="#ff9d42"/><path d="M-12 -6Q0 -18 12 -6" fill="none" stroke="#a0743f" stroke-width="3"/>'},
{n:"Fifth Home",at:1920,x:250,y:196,h:1,d:"Your community is thriving.",svg:()=>houseS(4)},
{n:"Lighthouse of Light",at:2400,x:332,y:148,d:"A beacon so others can find the way.",svg:()=>'<polygon points="-7,0 7,0 5,-46 -5,-46" fill="#fff"/>'+R(-6.4,-14,12.8,5,"#d64545")+R(-5.6,-30,11.2,5,"#d64545")+R(-6,-54,12,8,"#ffe27a")+'<g class="beam"><polygon points="0,-50 72,-60 72,-40" fill="#fff3b0"/><polygon points="0,-50 -72,-60 -72,-40" fill="#fff3b0"/><animateTransform attributeName="transform" type="rotate" from="0 0 -50" to="360 0 -50" dur="8s" repeatCount="indefinite"/></g><circle class="glow" cx="0" cy="-50" r="13" fill="#fff3b0"/><polygon points="-8,-54 0,-64 8,-54" fill="#d64545"/>'},
{n:"Community Hall",at:3000,x:30,y:150,d:"The heart of Faith Town.",svg:()=>R(-22,-26,44,26,"#c9c1b4")+R(-26,-38,10,38,"#b5ad9f")+R(16,-38,10,38,"#b5ad9f")+R(-26,-42,4,4,"#b5ad9f")+R(-20,-42,4,4,"#b5ad9f")+R(16,-42,4,4,"#b5ad9f")+R(22,-42,4,4,"#b5ad9f")+'<path d="M-5 0V-12A5 5 0 0 1 5 -12V0Z" fill="#6b4423"/>'+R(-.5,-58,1,18,"#6b4423")+'<polygon class="flag" points="0.5,-58 12,-54 0.5,-50" fill="#e5509a"/>'}];
const builtN=()=>BLD.filter(b=>nbXp(S.nb.cur)>=b.at).length;
const maxed=()=>lvOf(S.xp)>=10;
const TNAMES=["Camp","Hamlet","Hamlet","Village","Village","Township","Township","Town","Town","Big Town","Big Town","City of Light"];
const rnd=(a,b)=>a+Math.random()*(b-a);
const pk=a=>a[Math.floor(Math.random()*a.length)];
function npcLook(i){const g=(a,k)=>a[(i*k+3)%a.length];return{hat:g(["none","cap","beanie","cowboy","none","phones"],5),topStyle:g(["tee","jacket","stripes","tee"],3),topColor:g(Object.keys(COL),7),pants:g(["blue","black","khaki","green"],3),shoes:g(["white","black","red","blue"],5),eyes:g(["normal","round","happy","wink"],3),glasses:g(["none","none","square","round"],7),mouth:g(["smile","none","open","smile"],5),body:g(Object.keys(BODY),3),ex:i%3===1?{scarf:true}:i%3===2?{cheeks:true}:{}}}
function townCast(){
 const out=[{n:S.p.buddy||"Buddy",p:S.p,k:"me",ref:S.bs}];
 S.res.forEach(r=>out.push({n:r.n,p:r.l,k:"res",ref:r}));
 return out;
}
const vOfDay=()=>VERSES[[...today()].reduce((a,c)=>a+c.charCodeAt(0),0)%VERSES.length];
const TW={on:false,ws:[],raf:0,last:0,next:0,W:0,H:0,conv:null};
function V(){return S.nb.view||S.nb.cur}
function nbXp(id){return S.nb.xp[id]||0}
const MAXAT=BLD[BLD.length-1].at;
const nbDone=id=>nbXp(id)>=MAXAT;
const nbBuilt=id=>BLD.filter(b=>nbXp(id)>=b.at);
const planetDone=pl=>planetNbs(pl).every(k=>nbDone(k));
const worldDone=()=>planetDone(S.nb.planet||"earth");
const solarDone=()=>PLANET_LIST.every(pl=>planetDone(pl));
function planetUnlocked(pl){
 const idx=PLANET_LIST.indexOf(pl);
 if(idx<=0)return true;
 if(S.nb.pcel&&S.nb.pcel[pl])return true;
 return planetDone(PLANET_LIST[idx-1]);
}
function nextPlanet(){
 const curPl=S.nb.planet||"earth";
 const idx=PLANET_LIST.indexOf(curPl);
 return idx>=0&&idx<PLANET_LIST.length-1?PLANET_LIST[idx+1]:null;
}
function nbState(id){
 const pl=NB[id]?NB[id].pl:"earth";
 if(!planetUnlocked(pl))return"locked";
 if(id===S.nb.cur)return nbDone(id)?"done":"cur";
 if(S.nb.xp[id]!==undefined)return nbDone(id)?"done":"visited";
 const anyInPlanet=planetNbs(pl).some(k=>S.nb.xp[k]!==undefined);
 if(!anyInPlanet)return"avail";
 return nbDone(S.nb.cur)?"avail":"locked";
}
function checkNbWin(){
 const c=S.nb.cur,pl=NB[c]?NB[c].pl:"earth";
 if(nbDone(c)&&!S.nb.cel[c]){
  S.nb.cel[c]=1;save();
  const nxPl=nextPlanet();
  if(planetDone(pl)&&nxPl){
   setTimeout(()=>{toast("🚀 "+PLANETS[pl].n+" is 100% complete! "+PLANETS[nxPl].n+" is now unlocked on the Solar Map!");burst(innerWidth/2,innerHeight/3,65,CONF)},1800);
  }else{
   setTimeout(()=>{toast(NB[c].n+" is complete! Open the Solar Map to choose your next ecosystem.");burst(innerWidth/2,innerHeight/3,50,CONF)},1800);
  }
 }
}
const snowF=()=>{let o="";for(let i=0;i<30;i++){const t=5+(i%5);o+='<circle class="snf" cx="'+((i*37)%360)+'" cy="0" r="'+(1+(i%3)*.6)+'" fill="#fff" style="--t:'+t+'s;animation-delay:-'+((i*1.3)%t).toFixed(1)+'s"/>'}return o};
const leafF=()=>{const cs=["#e8812a","#d9602a","#f0a030","#c24a22"];let o="";for(let i=0;i<16;i++){const t=7+(i%5);o+='<ellipse class="lvf" cx="'+((i*47)%360)+'" cy="0" rx="3.2" ry="1.7" fill="'+cs[i%4]+'" style="--t:'+t+'s;animation-delay:-'+((i*1.7)%t).toFixed(1)+'s"/>'}return o};
const BG={
seaside:{back:()=>'<rect y="100" width="360" height="30" fill="#4aa8ee"/><rect y="100" width="360" height="8" fill="#86d6ff" opacity=".6"/><path class="wave" d="M8 114q6-4 12 0t12 0t12 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".75"/><path class="wave b" d="M124 122q6-4 12 0t12 0t12 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".75"/><path class="wave" d="M240 110q6-4 12 0t12 0t12 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".75"/><g transform="translate(70 114)"><g class="boat"><path d="M-9 0h18l-3 5h-12z" fill="#8b5a2b"/><polygon points="0,-15 0,-1 8,-1" fill="#fff"/><polygon points="-1.5,-12 -1.5,-1 -8,-1" fill="#ffd9c0"/></g></g>'},
snowy:{back:()=>'<polygon points="0,128 38,88 62,112 100,70 138,118 188,92 236,122 286,80 330,110 360,96 360,128" fill="#b9cde2"/><polygon points="100,70 91,84 99,81 106,86" fill="#fff"/><polygon points="286,80 277,94 285,91 293,96" fill="#fff"/><polygon points="38,88 31,98 38,96 44,100" fill="#fff"/><polygon points="188,92 181,102 188,100 195,104" fill="#fff"/>',front:snowF},
oasis:{back:()=>'<path d="M0 128Q90 106 180 126T360 118V132H0z" fill="#f4d28e"/><polygon points="52,128 86,92 120,128" fill="#e3b878"/><polygon points="86,92 120,128 100,128" fill="#c99a56"/><polygon points="132,128 158,102 184,128" fill="#e3b878"/><polygon points="158,102 184,128 168,128" fill="#c99a56"/>'},
autumn:{back:()=>{const cs=["#e8812a","#d9602a","#f0a030","#c24a22"];let o='<rect y="118" width="360" height="14" fill="#b88a3a"/>';for(let i=0;i<22;i++)o+='<circle cx="'+(i*17+6)+'" cy="'+(118+(i%3)*2)+'" r="'+(10+(i%4)*2)+'" fill="'+cs[i%4]+'"/>';return o},front:leafF},
starlight:{back:()=>'<polygon points="0,128 50,74 105,128" fill="#43377a"/><polygon points="85,128 155,66 225,128" fill="#4f428a"/><polygon points="200,128 275,72 350,128" fill="#43377a"/><circle class="tw" cx="50" cy="48" r="1.6" fill="#ffe27a"/><circle class="tw" style="animation-delay:-1.2s" cx="155" cy="40" r="1.8" fill="#ffe27a"/><circle class="tw" style="animation-delay:-.6s" cx="240" cy="54" r="1.5" fill="#fff"/>'},
crystal:{back:()=>'<polygon points="18,128 36,76 54,128" fill="#52d9cf" opacity=".75"/><polygon points="44,128 58,92 72,128" fill="#8ff5ee" opacity=".85"/><polygon points="280,128 302,72 324,128" fill="#52d9cf" opacity=".75"/><polygon points="312,128 328,88 344,128" fill="#8ff5ee" opacity=".85"/>'},
sky:{back:()=>'<ellipse cx="70" cy="116" rx="48" ry="14" fill="#fff" opacity=".85"/><ellipse cx="180" cy="112" rx="56" ry="15" fill="#fff" opacity=".9"/><ellipse cx="295" cy="118" rx="46" ry="13" fill="#fff" opacity=".85"/>'}};
const bfHTML=()=>[[70,232,.5],[250,244,.42]].map((b,i)=>'<g transform="translate('+b[0]+' '+b[1]+')"><g class="bfl'+(i?' b2':'')+'"><g transform="scale('+b[2]+')">'+ICONS.butterfly+'</g></g></g>').join("");
function applyBiome(id){
 const c=NB[id],eco=c.eco||id,isSpace=c.pl&&c.pl!=="earth";
 $("sk0").setAttribute("stop-color",c.sky[0]);$("sk1").setAttribute("stop-color",c.sky[1]);
 $("gg0").setAttribute("stop-color",c.gr[0]);$("gg1").setAttribute("stop-color",c.gr[1]);
 $("hillp").setAttribute("fill",c.hill);$("roadp").setAttribute("fill",c.road);
 $("flw").style.display=id==="meadow"?"":"none";
 const bg=BG[eco]||{};$("decB").innerHTML=bg.back?bg.back():"";$("decF").innerHTML=bg.front?bg.front():"";
 $("bfs").innerHTML=(isSpace||eco==="seaside"||eco==="snowy")?"":bfHTML();
 $("scene").dataset.nb=id;
}
function drawScene(animNew){
 const id=V();NBC=NB[id];applyBiome(id);
 const x=nbXp(id),built=BLD.filter(b=>x>=b.at);let g="";
 const seen=S.nb.seen[id]===undefined?built.length:S.nb.seen[id];
 built.forEach((b,i)=>{g+='<g transform="translate('+b.x+' '+b.y+')"><g class="bd'+((animNew&&i>=seen)?" build":"")+'" data-i="'+i+'">'+b.svg()+'</g></g>'});
 const nx=BLD.find(b=>x<b.at);
 if(nx)g+='<g transform="translate('+(nx.cx||nx.x)+' '+((nx.cy||nx.y)-4)+')"><g class="cons"><g transform="translate(-8 -16) scale(.67)">'+ICONS.cone+'</g></g></g>';
 $("bld").innerHTML=g;
}
$("bld").onclick=e=>{const b=e.target.closest(".bd");if(b){const x=BLD[+b.dataset.i];rerun(b,"wob");toast(x.n+": "+x.d)}};
function townInfo(){
 const id=V(),c=NB[id],x=nbXp(id),built=BLD.filter(b=>x>=b.at),n=built.length,nx=BLD.find(b=>x<b.at);
 $("tnm").textContent="Lv "+n;$("tnb").textContent=c.n;$("tlv").textContent=(id===S.nb.cur?"":"Visiting · ")+n+"/"+BLD.length;
 if(nx){const pa=built[n-1].at;$("tbar").style.width=((x-pa)/(nx.at-pa)*100)+"%";$("tnx").textContent="Next: "+nx.n+" · "+(nx.at-x)+" XP"}
 else{$("tbar").style.width="100%";$("tnx").textContent="Complete!"}
 countTo($("tc1"),BLD.filter(b=>b.h&&x>=b.at).length);countTo($("tc2"),townCast().length);countTo($("tc3"),Math.min(x,MAXAT));
 const v=vOfDay();$("vtx").textContent="“"+v.t+"”";$("vref").textContent="— "+v.r;
 $("gcard").hidden=!maxed();
 const home=id===S.nb.cur,fin=home&&nbDone(id);
 $("ncard").hidden=!fin;
 if(fin)$("nct").textContent=worldDone()?"Every neighborhood is complete. Your whole world is built!":"Choose where your community goes next.";
 if(fin&&worldDone()){
  const nxPl=nextPlanet();
  $("nct").textContent=nxPl?("🚀 All of "+PLANETS[c.pl].n+" is complete! Launch to "+PLANETS[nxPl].n+" now!"):("🌌 Every planet in the Solar System is 100% complete!");
 }
 $("homeb").hidden=home;$("hbn").textContent="Return to "+NB[S.nb.cur].n;
 const curPl=c.pl||"earth",plDoneN=planetNbs(curPl).filter(k=>nbDone(k)).length;
 $("wsub").textContent=PLANETS[curPl].icon+" "+PLANETS[curPl].n+": "+plDoneN+"/8 complete · "+PLANET_LIST.filter(p=>planetDone(p)).length+"/"+PLANET_LIST.length+" planets";
 $("tsub").textContent=PLANETS[curPl].icon+" "+PLANETS[curPl].n+" · "+c.d;
}
// Spherical coordinates [lon°, lat°, rx, ry] around the 3D Earth globe
const GP={
meadow:[-22,12,28,20],
seaside:[26,22,22,15],
snowy:[-5,52,24,14],
oasis:[68,-14,25,17],
autumn:[-72,-20,23,15],
starlight:[116,28,24,16],
crystal:[162,-24,25,17],
sky:[-132,16,24,16]
};
const GLB={lon:15,lat:12,vLon:.22,drag:false,moved:false,lx:0,ly:0,raf:0};
let gsel=null;
function gProj(lon,lat){
 const la=(lon+GLB.lon)*Math.PI/180,ph=lat*Math.PI/180,ph0=GLB.lat*Math.PI/180;
 const cp=Math.cos(ph),sp=Math.sin(ph),cp0=Math.cos(ph0),sp0=Math.sin(ph0);
 const x=cp*Math.sin(la),y=cp0*sp-sp0*cp*Math.cos(la),z=sp0*sp+cp0*cp*Math.cos(la);
 return{x:120+108*x,y:120-108*y,z};
}
function gGridSvg(){
 let o="";
 [-60,-30,0,30,60].forEach(lat=>{
  let d="",pen=false;
  for(let lon=-180;lon<=180;lon+=10){
   const p=gProj(lon,lat);
   if(p.z>0){d+=(pen?"L":"M")+p.x.toFixed(1)+" "+p.y.toFixed(1);pen=true}else pen=false;
  }
  if(d)o+='<path d="'+d+'"/>';
 });
 for(let lon=-150;lon<=180;lon+=30){
  let d="",pen=false;
  for(let lat=-85;lat<=85;lat+=10){
   const p=gProj(lon,lat);
   if(p.z>0){d+=(pen?"L":"M")+p.x.toFixed(1)+" "+p.y.toFixed(1);pen=true}else pen=false;
  }
  if(d)o+='<path d="'+d+'"/>';
 }
 return o;
}
function gCloudsSvg(){
 const cs=[[-40,34,24,5.5,.55],[50,-32,28,6.5,.5],[135,18,22,5,.5],[-125,-26,25,6,.45]];
 return cs.map(c=>{
  const p=gProj(c[0],c[1]);if(p.z<=.08)return"";
  const sc=(.55+.45*p.z).toFixed(2);
  return '<ellipse cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" rx="'+(c[2]*sc).toFixed(1)+'" ry="'+(c[3]*sc).toFixed(1)+'" fill="#fff" opacity="'+(c[4]*Math.min(1,p.z*2)).toFixed(2)+'"/>';
 }).join("");
}
function viewPlanet(){return S.nb.vplanet||S.nb.planet||"earth"}
function renderGlobeFrame(){
 const vpl=viewPlanet(),plCfg=PLANETS[vpl]||PLANETS.earth;
 $("gs0").setAttribute("stop-color",plCfg.sea[0]);
 $("gs1").setAttribute("stop-color",plCfg.sea[1]);
 $("gs2").setAttribute("stop-color",plCfg.sea[2]);
 $("ghalo").setAttribute("fill",plCfg.halo);
 $("gringb").setAttribute("opacity",plCfg.ring?"1":"0");
 $("gringf").setAttribute("opacity",plCfg.ring?"1":"0");
 $("ggrid").innerHTML=gGridSvg();
 const pNbs=planetNbs(vpl);
 const vis=pNbs.map(id=>{const eco=NB[id].eco||id,g=GP[eco]||GP.meadow,p=gProj(g[0],g[1]);return{id,g,p}}).sort((a,b)=>a.p.z-b.p.z);
 let isl="",pins="";
 vis.forEach(({id,g,p})=>{
  if(p.z<=.02)return;
  const sc=(.55+.45*p.z),fo=Math.min(1,p.z*3.2).toFixed(2);
  const rx=(g[2]*sc).toFixed(1),ry=(g[3]*sc*(.65+.35*Math.abs(p.z))).toFixed(1);
  const c=NB[id],st=nbState(id),lk=st==="locked"||st==="avail";
  isl+='<g class="isl'+(st==="locked"?" lk":"")+'" data-id="'+id+'" opacity="'+fo+'"><ellipse cx="'+p.x.toFixed(1)+'" cy="'+(p.y+2*sc).toFixed(1)+'" rx="'+(+rx+3*sc).toFixed(1)+'" ry="'+(+ry+3*sc).toFixed(1)+'" fill="#fff" opacity=".35"/><ellipse cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" rx="'+rx+'" ry="'+ry+'" fill="'+c.gr[1]+'"/><ellipse cx="'+p.x.toFixed(1)+'" cy="'+(p.y-2*sc).toFixed(1)+'" rx="'+(+rx*.86).toFixed(1)+'" ry="'+(+ry*.8).toFixed(1)+'" fill="'+c.gr[0]+'"/>';
  const hn=lk?0:BLD.filter(b=>b.h&&nbXp(id)>=b.at).length;
  for(let k=0;k<hn;k++){const hx=p.x-(+rx)*.55+k*((+rx)*.5),hy=p.y+((k%2)?4:-3)*sc;isl+='<g transform="translate('+hx.toFixed(1)+' '+hy.toFixed(1)+') scale('+sc.toFixed(2)+')"><rect x="-3" y="-3" width="6" height="4.5" fill="'+c.hc[k][0]+'"/><polygon points="-4,-3 0,-7 4,-3" fill="'+c.hc[k][1]+'"/></g>'}
  isl+='</g>';
  if(p.z>.12){
   const ic=st==="locked"?"lock":st==="cur"?"house":st==="done"?"check":st==="visited"?"town":"sparkle";
   const ps=(.72+.28*p.z).toFixed(2),po=Math.min(1,(p.z-.12)*4).toFixed(2);
   pins+='<g class="pin'+(st==="avail"?" av":"")+(st==="cur"?" me":"")+'" data-id="'+id+'" opacity="'+po+'" transform="translate('+p.x.toFixed(1)+' '+(p.y-(+ry)-8*sc).toFixed(1)+') scale('+ps+')"><g class="pinb"><circle r="9" fill="#fff" stroke="'+c.ac+'" stroke-width="2.4"/><g transform="translate(-6 -6) scale(.5)">'+ICONS[ic]+'</g></g></g>';
  }
 });
 $("gisl").innerHTML=isl;$("gcld").innerHTML=gCloudsSvg();$("gpins").innerHTML=pins;
}
function globeLoop(){
 if(!$("gl").classList.contains("show")){GLB.raf=0;return}
 if(!GLB.drag){
  GLB.lon=(GLB.lon+GLB.vLon)%360;
  GLB.vLon+=(0.22-GLB.vLon)*0.05;
 }
 renderGlobeFrame();
 GLB.raf=requestAnimationFrame(globeLoop);
}
function startGlobe(){if(!GLB.raf)GLB.raf=requestAnimationFrame(globeLoop)}
function stopGlobe(){if(GLB.raf){cancelAnimationFrame(GLB.raf);GLB.raf=0}}
const gsvEl=$("gsv");
gsvEl.addEventListener("pointerdown",e=>{
 GLB.drag=true;GLB.moved=false;GLB.lx=e.clientX;GLB.ly=e.clientY;GLB.vLon=0;
 if(gsvEl.setPointerCapture)try{gsvEl.setPointerCapture(e.pointerId)}catch(err){}
});
gsvEl.addEventListener("pointermove",e=>{
 if(!GLB.drag)return;
 const dx=e.clientX-GLB.lx,dy=e.clientY-GLB.ly;
 if(Math.hypot(dx,dy)>4)GLB.moved=true;
 GLB.lon=(GLB.lon+dx*.55)%360;
 GLB.lat=Math.max(-55,Math.min(55,GLB.lat+dy*.45));
 GLB.vLon=dx*.35;
 GLB.lx=e.clientX;GLB.ly=e.clientY;
 renderGlobeFrame();
});
["pointerup","pointercancel"].forEach(ev=>gsvEl.addEventListener(ev,()=>{GLB.drag=false}));

function unlockedKinds(){
 const out=new Set(["square","circle","triangle","rectangle","duck"]);
 NBK.forEach(k=>{if(S.nb.xp[k]!==undefined&&NB[k].bud)out.add(NB[k].bud)});
 if(S.nb.xp.meadow!==undefined)out.add("cloudshape");
 if(S.nb.xp.mars_meadow!==undefined)out.add("aerowing");
 if(S.nb.xp.jupiter_meadow!==undefined)out.add("stratos");
 if(S.nb.xp.saturn_meadow!==undefined)out.add("cloudring");
 if(S.nb.xp.uranus_meadow!==undefined)out.add("breezepuff");
 if(S.nb.xp.neptune_meadow!==undefined)out.add("cosmo");
 return out;
}
function worldCard(id){
 const c=NB[id],st=nbState(id),x=nbXp(id),d=document.createElement("div");
 d.className="wc"+(id===S.nb.cur?" cur":"")+(gsel===id?" sel":"");d.id="wc-"+id;
 const sw=document.createElement("div");sw.className="wsw";sw.style.background="linear-gradient(180deg,"+c.sky[0]+","+c.sky[1]+" 55%,"+c.gr[0]+" 55%,"+c.gr[1]+")";
 const inf=document.createElement("div");inf.className="winf";
 const b=document.createElement("b");b.textContent=c.n;
 const sm=document.createElement("small");sm.textContent=c.d;
 const bar=document.createElement("div");bar.className="wbar2";const bi=document.createElement("i");bi.style.width=Math.min(100,x/MAXAT*100)+"%";bi.style.background=c.ac;bar.appendChild(bi);
 const tg=document.createElement("span");tg.className="wtg";
 tg.textContent=id===S.nb.cur?(nbDone(id)?"Your neighborhood · complete":"Your neighborhood"):st==="done"?"Complete":st==="visited"?"Visited":st==="avail"?"Ready to settle":"Locked until "+NB[S.nb.cur].n+" is complete";
 inf.append(b,sm,bar,tg);
 if(c.bud&&KINDS[c.bud]){
  const unl=unlockedKinds().has(c.bud);
  const wb=document.createElement("div");wb.className="wbud"+(unl?"":" lk");
  wb.appendChild(svgOf(freshLook(c.bud),20,22));
  const wt=document.createElement("span");wt.textContent=(unl?"Unlocked buddy: ":"Unlocks buddy: ")+KINDS[c.bud].n;
  wb.appendChild(wt);inf.appendChild(wb);
 }
 d.append(sw,inf);
 const bt=document.createElement("button");bt.type="button";bt.className="wbt";
 if(st==="cur"||st==="done"||st==="visited"){bt.textContent=V()===id?"Viewing":"Visit";bt.disabled=V()===id;bt.onclick=()=>visit(id)}
 else if(st==="avail"){bt.textContent="Settle here";bt.classList.add("go");bt.onclick=()=>{if(bt.classList.contains("arm"))settle(id);else{bt.classList.add("arm");bt.textContent="Tap again";setTimeout(()=>{bt.classList.remove("arm");bt.textContent="Settle here"},2600)}}}
 else{bt.textContent="Locked";bt.disabled=true}
 d.appendChild(bt);return d;
}
function drawWorld(){
 const vpl=viewPlanet(),plCfg=PLANETS[vpl]||PLANETS.earth,pNbs=planetNbs(vpl);
 $("glt").textContent=plCfg.icon+" "+plCfg.n;
 const pb=$("pbar");pb.innerHTML="";
 PLANET_LIST.forEach((pid,idx)=>{
  const pc=PLANETS[pid],unl=planetUnlocked(pid),done=planetDone(pid);
  const b=document.createElement("button");b.type="button";
  b.className="pchip"+(pid===vpl?" on":"")+(unl?"":" lk");
  const dot=document.createElement("i");dot.style.background=pc.sea[1];
  b.append(dot,document.createTextNode(pc.n+(done?" ✓":unl?"":" 🔒")));
  b.onclick=()=>{
   if(!unl){
    const prev=PLANETS[PLANET_LIST[idx-1]];
    toast("🚀 Complete all 8 ecosystems on "+prev.n+" to unlock "+pc.n+"!");
    return;
   }
   S.nb.vplanet=pid;gsel=null;drawWorld();
  };
  pb.appendChild(b);
 });
 renderGlobeFrame();
 const doneCnt=pNbs.filter(k=>nbDone(k)).length;
 $("glh").textContent="Drag "+plCfg.n+" to spin · "+doneCnt+" of 8 ecosystems complete"+(doneCnt===8&&nextPlanet()?" · ready for "+PLANETS[nextPlanet()].n+"!":"");
 const L=$("glist");L.innerHTML="";pNbs.forEach(k=>L.appendChild(worldCard(k)));
}
$("gsvg").onclick=e=>{if(GLB.moved)return;const g=e.target.closest("[data-id]");if(g){gsel=g.dataset.id;drawWorld();const c=$("wc-"+gsel);if(c)c.scrollIntoView({behavior:"smooth",block:"center"})}};
function openWorld(){
 gsel=null;
 const curPl=(NB[V()]&&NB[V()].pl)||S.nb.planet||"earth";
 S.nb.vplanet=curPl;
 const eco=(NB[V()]&&NB[V()].eco)||"meadow";
 const g=GP[eco]||GP.meadow;GLB.lon=-g[0];GLB.lat=g[1];drawWorld();$("gl").classList.add("show");startGlobe();
}
$("wbtn").onclick=openWorld;$("nbtn").onclick=openWorld;
$("glx").onclick=()=>{$("gl").classList.remove("show");stopGlobe()};
$("homeb").onclick=()=>visit(S.nb.cur);
function visit(id){
 S.nb.view=id;
 if(NB[id]&&NB[id].pl)S.nb.vplanet=NB[id].pl;
 save();$("gl").classList.remove("show");stopGlobe();if(PG!=="t")go("t");else townOpen();
}
function settle(id){
 const cur=S.nb.cur,carry=Math.max(0,nbXp(cur)-MAXAT);
 const newPl=(NB[id]&&NB[id].pl)||"earth";
 S.nb.xp[cur]=MAXAT;S.nb.xp[id]=carry;S.nb.cur=id;S.nb.view=id;S.nb.planet=newPl;S.nb.vplanet=newPl;S.nb.seen[id]=0;
 const bud=NB[id]&&NB[id].bud;
 if(bud)S.seenK[bud]=1;
 save();
 syncPetUnlocks(curStreak);
 $("gl").classList.remove("show");stopGlobe();travel(id);
}
function travel(id){
 const c=NB[id],t=$("tv");t.style.background="linear-gradient(180deg,"+c.sky[0]+","+c.sky[1]+")";
 $("tvn").textContent="Welcome to "+c.n;$("tvd").textContent=c.d;
 t.classList.add("show");
 setTimeout(()=>{t.classList.remove("show");if(PG!=="t")go("t");else townOpen();setTimeout(()=>burst(innerWidth/2,innerHeight/3,40,CONF),500)},2600);
}
function sayW(w,txt,ms){w.say.textContent=txt;w.say._on=true;w.talking=true;clearTimeout(w._t);w._t=setTimeout(()=>{w.say._on=false;w.talking=false},ms||4200)}
function pickT(w){w.tx=rnd(24,TW.W-24);w.ty=rnd(TW.H*.7,TW.H*.95)}
let bmData=null,bmSlide="b";
function renderBuddyModal(){
 if(!bmData)return;
 const w=bmData,kd=KINDS[w.p.kind]||KINDS.square,pt=petById(w.p.pet);
 const tabs=$("bslides");
 tabs.hidden=!pt;
 $("bsl-b").classList.toggle("on",bmSlide==="b");
 $("bsl-p").classList.toggle("on",bmSlide==="p");
 const body=$("bbody");body.innerHTML="";
 if(bmSlide==="b"||!pt){
  const card=el("div","bcard");
  const stg=el("div","bstage");
  const lookNoHeadPet=Object.assign({},w.p,{pet:"none"});
  stg.appendChild(svgOf(lookNoHeadPet,76,84));
  card.appendChild(stg);
  card.appendChild(el("h4","",w.n));
  const tags=el("div","stags");tags.style.justifyContent="center";
  const kt=el("span","stag",kd.n+" · "+kd.r);kt.style.background=kd.c;tags.appendChild(kt);
  tags.appendChild(el("span","stag lvt",w.k==="me"?"⭐ Level "+lvOf(S.xp):"🎓 Level 10 Resident"));
  if(pt)tags.appendChild(el("span","stag","🐾 Pet: "+pt.n));
  card.appendChild(tags);
  const meta=el("div","bmeta");
  const addM=(k,v)=>{const d=document.createElement("div");d.append(el("small","",k),el("b","",v));meta.appendChild(d)};
  addM("⏱ Time in Town",fmtDur(Date.now()-(w.ref&&w.ref.born||Date.now())));
  addM("👆 Times Tapped",String(w.ref&&w.ref.clicks||0));
  addM("✅ Tasks Together",String(w.ref&&w.ref.tasks||0));
  addM("🐾 Companion",pt?pt.n:"None");
  card.appendChild(meta);
  const quote=w.k==="me"
   ?("“Hi"+(S.p.name?", "+S.p.name:"")+"! We’re on a 🔥 "+curStreak+"-day streak!”")
   :("“I reached Level 10 and moved into "+NB[V()].n+"! 🎓”");
  card.appendChild(el("div","bquote",quote));
  body.appendChild(card);
 }else{
  const card=el("div","bcard");
  const stg=el("div","bstage");
  stg.innerHTML=petSvg(pt.id,66,60);
  card.appendChild(stg);
  card.appendChild(el("h4","",pt.n));
  const tags=el("div","stags");tags.style.justifyContent="center";
  const stgBadge=el("span","stag","🔥 "+pt.st+"-Day Streak Reward");stgBadge.style.background="#3f9d63";tags.appendChild(stgBadge);
  tags.appendChild(el("span","stag lvt","Partner: "+w.n));
  card.appendChild(tags);
  const meta=el("div","bmeta");
  const addM=(k,v)=>{const d=document.createElement("div");d.append(el("small","",k),el("b","",v));meta.appendChild(d)};
  addM("✨ Trait",pt.d);
  addM("🏆 Unlock Streak",pt.st+(pt.st===1?" day":" days"));
  addM("📍 Favorite Spot","Rests on "+w.n+"’s head");
  addM("🏘 Town Role","Follows "+w.n);
  card.appendChild(meta);
  card.appendChild(el("div","bquote","“"+pt.n+" faithfully walks alongside "+w.n+" every day!”"));
  body.appendChild(card);
 }
}
function openBuddyModal(w,slide){
 bmData=w;
 bmSlide=(slide==="p"&&petById(w.p.pet))?"p":"b";
 renderBuddyModal();
 $("bm").classList.add("show");
}
$("bsl-b").onclick=()=>{bmSlide="b";renderBuddyModal()};
$("bsl-p").onclick=()=>{bmSlide="p";renderBuddyModal()};
$("bdone").onclick=()=>$("bm").classList.remove("show");
$("bm").onclick=e=>{if(e.target===$("bm"))$("bm").classList.remove("show")};

function poke(w){
 clickAnim(w);emo(w,pk(["✨","💛","🙏"]));if(w.ref){w.ref.clicks=(w.ref.clicks||0)+1;save()}let t;
 if(w.k==="me")t="Hi"+(S.p.name?", "+S.p.name:"")+"! "+(curStreak?"🔥 "+curStreak+"-day streak!":"Let’s start a streak today!");
 else if(w.k==="res")t="I reached level 10 and moved into town! 🎓";
 else{const v=pk(VS);t="📖 “"+v.t+"” "+v.r}
 sayW(w,t,4400);
 openBuddyModal(w,"b");
}
function townInit(){
 const sc=$("scene");TW.W=sc.clientWidth;TW.H=sc.clientHeight;TW.conv=null;
 const host=$("walkers");host.innerHTML="";TW.ws=[];
 townCast().forEach(c=>{
  const el=document.createElement("div");el.className="w";
  const fl=document.createElement("div");fl.className="fl";
  const sv=document.createElementNS("http://www.w3.org/2000/svg","svg");
  sv.setAttribute("viewBox","0 -6 56 62");sv.setAttribute("width","30");sv.setAttribute("height","33");sv.setAttribute("class","wk");sv.style.setProperty("--bd",(-Math.random()*5).toFixed(1)+"s");
  // In Faith Town, render active buddy without duplicate head-pet since the pet walks right behind them
  const isSpaceTown=NB[V()]&&NB[V()].pl!=="earth";
  const townLook=c.k==="me"?Object.assign({},c.p,{pet:"none"}):c.p;
  const helm=isSpaceTown?'<circle class="sp-helmet" cx="28" cy="24" r="23" fill="rgba(180,235,255,.18)" stroke="rgba(220,248,255,.75)" stroke-width="1.6"/>':'';
  sv.innerHTML='<g class="bod">'+layers(townLook)+helm+'</g>';
  fl.appendChild(sv);
  const say=document.createElement("div");say.className="say";
  el.append(say,fl);host.appendChild(el);
  const w=Object.assign({},c,{el,fl,say,dir:1,x:rnd(30,TW.W-30),y:rnd(TW.H*.72,TW.H*.94),sp:14+Math.random()*10,pause:Math.random()*2,hold:false});
  pickT(w);TW.ws.push(w);el.onclick=()=>poke(w);
 });
 TW.pet=null;
 const actPet=petById(S.p.pet);
 if(actPet&&TW.ws[0]){
  const me=TW.ws[0];
  const pel=document.createElement("div");pel.className="tpet";
  const pfl=document.createElement("div");pfl.className="pfl";
  pfl.innerHTML=petSvg(actPet.id,24,22);
  pel.appendChild(pfl);
  pel.onclick=e=>{e.stopPropagation();emo(me,"🐾");openBuddyModal(me,"p")};
  host.appendChild(pel);
  TW.pet={el:pel,pfl,dir:1,x:Math.max(16,me.x-18),y:me.y+2,id:actPet.id};
 }
}
function convStep(t){
 const c=TW.conv;if(!c)return;
 const close=Math.hypot(c.a.x-c.b.x,(c.a.y-c.b.y)*2)<48;
 if(c.s===0&&(close||t-c.t0>9)){c.s=1;c.t1=t;c.a.pause=6;c.b.pause=6;emo(c.a,"💬");c.a.fl.style.transform=c.b.x<c.a.x?"scaleX(-1)":"none";c.b.fl.style.transform=c.a.x<c.b.x?"scaleX(-1)":"none";sayW(c.a,c.l[0],3500)}
 else if(c.s===1&&t-c.t1>2.8){c.s=2;c.t2=t;sayW(c.b,c.l[1],3500)}
 else if(c.s===2&&t-c.t2>3.6){c.a.hold=c.b.hold=false;c.a.pause=c.b.pause=.3;pickT(c.a);pickT(c.b);TW.conv=null}
}
function townEvent(t){
 TW.next=t+5+Math.random()*5;
 if(TW.conv)return;
 const ws=TW.ws;
 if(Math.random()<.3||ws.length<2){const w=pk(ws),v=pk(VS);sayW(w,"📖 “"+v.t+"” "+v.r,5200);return}
 const a=pk(ws);let b=pk(ws);while(b===a)b=pk(ws);
 a.hold=b.hold=true;b.pause=9;a.pause=0;a.tx=b.x+(a.x<b.x?-26:26);a.ty=b.y;
 TW.conv={a,b,l:pk(DLG),s:0,t0:t};
}
function clickAnim(w){
 w.pause=1.3;w.el.classList.remove("mv");rerun(w.fl.firstChild.firstChild,"hopw");
 w.el.classList.add("clk");clearTimeout(w._c);w._c=setTimeout(()=>w.el.classList.remove("clk"),950);
 const r=w.el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height*.5,14,CONF);
 const g=document.createElement("span");g.className="ring";g.style.left=w.x+"px";g.style.top=w.y+"px";$("walkers").appendChild(g);setTimeout(()=>g.remove(),800);
}
function dust(x,y){const e=document.createElement("span");e.className="dust";e.style.left=x+"px";e.style.top=y+"px";$("walkers").appendChild(e);setTimeout(()=>e.remove(),650)}
function emo(w,t){const e=document.createElement("span");e.className="emo";e.textContent=t;w.el.appendChild(e);setTimeout(()=>e.remove(),1050)}
function dayShade(){
 const isSpace=NB[V()]&&NB[V()].pl!=="earth";
 if(isSpace){
  $("nightr").setAttribute("opacity","0.12");$("stars").setAttribute("opacity","0.95");
  $("sunG").setAttribute("opacity","0.55");$("moon").setAttribute("opacity","0.85");
  $("scene").classList.remove("night");
  return;
 }
 const d=new Date(),h=d.getHours()+d.getMinutes()/60;let n;
 if(h>=7&&h<18)n=0;else if(h>=5&&h<7)n=(7-h)/2;else if(h>=18&&h<20)n=(h-18)/2;else n=1;
 $("nightr").setAttribute("opacity",(n*.45).toFixed(2));$("stars").setAttribute("opacity",Math.min(1,n*1.5).toFixed(2));
 $("sunG").setAttribute("opacity",(1-n).toFixed(2));$("moon").setAttribute("opacity",n.toFixed(2));
 $("scene").classList.toggle("night",n>.4);
}
function tick(ts){
 if(!TW.on)return;
 const t=ts/1000,dt=Math.min(.06,t-(TW.last||t));TW.last=t;
 TW.ws.forEach(w=>{
  if(w.pause>0){w.pause-=dt;w.el.classList.remove("mv")}
  else{
   const dx=w.tx-w.x,dy=(w.ty-w.y)*1.4,d=Math.hypot(dx,dy);
   if(d<3){w.pause=w.hold?.3:1.2+Math.random()*3.5;if(!w.hold)pickT(w);w.el.classList.remove("mv")}
   else{const st=Math.min(d,w.sp*dt);w.x+=dx/d*st;w.y+=dy/d*st/1.4;w.el.classList.add("mv");if(Math.abs(dx)>.4)w.dir=dx<0?-1:1;w.fl.style.transform=w.dir<0?"scaleX(-1)":"none";w.dd=(w.dd||0)-dt;if(w.dd<=0){w.dd=.26;dust(w.x,w.y)}}
  }
  w.el.style.transform="translate("+w.x.toFixed(1)+"px,"+w.y.toFixed(1)+"px) translate(-50%,-100%) scale("+(.8+.3*(w.y/TW.H)).toFixed(2)+")";
  w.el.style.zIndex=w.talking?999:Math.round(w.y);w.el.classList.toggle("tk",!!w.talking);
  const cn="say"+(w.say._on?" show":"")+(w.x<70?" l":(w.x>TW.W-70?" r":""));
  if(w.say.className!==cn)w.say.className=cn;
 });
 if(TW.pet&&TW.ws[0]){
  const me=TW.ws[0],pt=TW.pet;
  const tx=Math.max(14,Math.min(TW.W-14,me.x-(me.dir||1)*18)),ty=me.y+2;
  const dx=tx-pt.x,dy=ty-pt.y,d=Math.hypot(dx,dy);
  if(d>4){
   const spd=Math.min(34,Math.max(12,d*1.8));
   const st=Math.min(d,spd*dt);
   pt.x+=dx/d*st;pt.y+=dy/d*st;
   pt.el.classList.add("mv");
   if(Math.abs(dx)>1.5)pt.dir=dx<0?-1:1;
  }else{
   pt.el.classList.remove("mv");
   pt.dir=me.dir||1;
  }
  pt.pfl.style.transform=pt.dir<0?"scaleX(-1)":"none";
  pt.el.style.transform="translate("+pt.x.toFixed(1)+"px,"+pt.y.toFixed(1)+"px) translate(-50%,-100%) scale("+(.78+.22*(pt.y/TW.H)).toFixed(2)+")";
  pt.el.style.zIndex=Math.round(pt.y)-1;
 }
 convStep(t);
 if(t>TW.next)townEvent(t);
 TW.raf=requestAnimationFrame(tick);
}
function townStop(){TW.on=false;cancelAnimationFrame(TW.raf)}
function townOpen(){
 townInfo();drawScene(true);townInit();dayShade();
 const id=V(),built=nbBuilt(id).length,seen=S.nb.seen[id]===undefined?built:S.nb.seen[id],nb=built-seen;
 if(nb>0){
  const names=BLD.slice(seen,built).map(b=>b.n);
  setTimeout(()=>{toast(names.length>3?names.length+" new buildings in town!":"New in town: "+names.join(", "));document.querySelectorAll("#bld .bd.build").forEach(el=>{const r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height*.7,14,CONF)})},900);
 }
 if(S.nb.seen[id]!==built){S.nb.seen[id]=built;save()}
 if(S.vday!==today()){S.vday=today();save();const v=vOfDay(),me=TW.ws[0];setTimeout(()=>sayW(me,"📖 “"+v.t+"” "+v.r,7000),1000)}
 TW.on=true;TW.last=0;TW.next=performance.now()/1000+4;cancelAnimationFrame(TW.raf);TW.raf=requestAnimationFrame(tick);
}
$("vcard").onclick=()=>{if(TW.ws[0]){const v=vOfDay();sayW(TW.ws[0],"📖 “"+v.t+"” "+v.r,7000);clickAnim(TW.ws[0])}};
function fmtDur(ms){const m=Math.max(0,Math.floor(ms/6e4)),d=Math.floor(m/1440),h=Math.floor(m%1440/60),mi=m%60;return d+(d===1?" day":" days")+" · "+h+(h===1?" hr":" hrs")+" · "+mi+" min"}
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
function svgOf(look,w,hh){const sv=document.createElementNS("http://www.w3.org/2000/svg","svg");sv.setAttribute("viewBox","0 -6 56 62");sv.setAttribute("width",w);sv.setAttribute("height",hh);sv.innerHTML=layers(look);return sv}
function fillStats(){
 const bl=[{n:S.p.buddy||"Buddy",p:S.p,bs:S.bs,cur:true}].concat(S.res.map(r=>({n:r.n,p:r.l,bs:r,cur:false})));
 const mc=Math.max(...bl.map(b=>b.bs.clicks||0)),mt=Math.max(...bl.map(b=>b.bs.tasks||0));
 const tt=bl.reduce((a,b)=>a+(b.bs.tasks||0),0),tk=bl.reduce((a,b)=>a+(b.bs.clicks||0),0);
 $("ssum").textContent="👥 "+bl.length+(bl.length===1?" buddy":" buddies")+"  ·  ✅ "+tt+" tasks  ·  👆 "+tk+" taps";
 const L=$("slist");L.innerHTML="";
 bl.forEach(b=>{
  const k=KINDS[b.p.kind]||KINDS.square,card=el("div","scard");
  const pv=el("div","spv");pv.appendChild(svgOf(b.p,48,52));
  const inf=el("div","sinf");
  inf.appendChild(el("b","",b.n));
  const tags=el("div","stags");
  const kt=el("span","stag",k.n+" · "+k.r);kt.style.background=k.c;tags.appendChild(kt);
  tags.appendChild(el("span","stag lvt",b.cur?"⭐ Level "+lvOf(S.xp):"🎓 Level 10 resident"));
  if(mc>0&&(b.bs.clicks||0)===mc)tags.appendChild(el("span","stag hot","🔥 Most clicked"));
  if(mt>0&&(b.bs.tasks||0)===mt)tags.appendChild(el("span","stag hot","🏆 Most tasks"));
  inf.appendChild(tags);
  inf.appendChild(el("div","srow","⏱ In town: "+fmtDur(Date.now()-(b.bs.born||Date.now()))));
  inf.appendChild(el("div","srow","👆 Tapped "+(b.bs.clicks||0)+(b.bs.clicks===1?" time":" times")));
  inf.appendChild(el("div","srow","✅ "+(b.bs.tasks||0)+" tasks done together"));
  card.append(pv,inf);L.appendChild(card);
 });
}
$("sbtn").onclick=()=>{fillStats();$("sm").classList.add("show")};
$("sdone").onclick=()=>$("sm").classList.remove("show");
$("sm").onclick=e=>{if(e.target===$("sm"))$("sm").classList.remove("show")};
setInterval(()=>{if($("sm").classList.contains("show"))fillStats()},20000);
const RAR=[["circle",50],["triangle",30],["rectangle",15],["duck",5]];
function chestPool(){
 const pool=[["circle",40],["triangle",25],["rectangle",15]];
 NBK.forEach(k=>{const b=NB[k].bud;if(b&&unlockedKinds().has(b))pool.push([b,22])});
 ["earthplanet","marsplanet","jupiterplanet","saturnplanet","uranusplanet","neptuneplanet"].forEach(pb=>{if(unlockedKinds().has(pb))pool.push([pb,10])});
 pool.push(["duck",6]);
 return pool;
}
function rollKind(){
 const pool=chestPool(),tot=pool.reduce((a,b)=>a+b[1],0);
 let r=Math.random()*tot;
 for(const t of pool){if(r<t[1])return t[0];r-=t[1]}
 return"circle";
}
const CHEST='<svg viewBox="0 0 80 70" width="92" height="80" aria-hidden="true"><rect x="8" y="32" width="64" height="34" rx="4" fill="#8b5a2b"/><rect x="8" y="42" width="64" height="6" fill="#f0c14b"/><rect x="33" y="40" width="14" height="14" rx="2" fill="#f0c14b"/><circle cx="40" cy="46" r="2.2" fill="#6b4423"/><g class="lid"><path d="M8 32Q8 8 40 8Q72 8 72 32Z" fill="#a0692f"/><rect x="34" y="9" width="12" height="23" fill="#f0c14b"/></g></svg>';
function askGrad(){$("cs").className="cs show";csIntro()}
function csIntro(){
 const b=$("csb");b.innerHTML="";const nm=S.p.buddy||"Buddy";
 b.append(el("div","cstitle","🎓 "+nm+" reached Level 10!"));
 const bw=el("div","csbud");bw.appendChild(svgOf(S.p,110,122));b.appendChild(bw);
 b.append(el("p","cssub",nm+" is ready to move into Faith Town. Time to meet your next buddy!"));
 const go=el("button","done","Continue ›");go.type="button";go.onclick=csChests;b.appendChild(go);
 const no=el("button","back","Not yet");no.type="button";no.onclick=()=>{$("cs").className="cs"};b.appendChild(no);
 setTimeout(()=>burst(innerWidth/2,innerHeight/3,36,CONF),300);
}
function csChests(){
 const b=$("csb");b.innerHTML="";const picked={v:false};
 b.append(el("div","cstitle","Pick a chest!"));
 b.append(el("p","cssub","Which buddy will join you next?"));
 const lg=el("div","leg2");
 chestPool().forEach(r=>{const kd=KINDS[r[0]];const c=el("span","stag",kd.n+" · "+kd.r);c.style.background=kd.c;lg.appendChild(c)});
 b.appendChild(lg);
 const row=el("div","crow"),cws=[];
 for(let i=0;i<3;i++){
  const cw=el("div","cw");cw.style.setProperty("--d",(-i*.7)+"s");
  const slot=el("div","slot"),ch=el("button","chest");ch.type="button";ch.innerHTML=CHEST;
  const lt=el("div","light"),lb=el("div","clbl","?");
  cw.append(lt,slot,ch,lb);row.appendChild(cw);cws.push({cw,slot,ch,lb});
  ch.onclick=()=>{if(picked.v)return;picked.v=true;pickChest(i,cws,b)};
 }
 b.appendChild(row);b.appendChild(el("div","cshint","Tap a chest to open it"));
}
function showKind(c,kind,dim){
 const w=el("div","bud"+(dim?" dim":""));w.appendChild(svgOf(freshLook(kind),56,62));c.slot.appendChild(w);
 c.lb.textContent=KINDS[kind].n+" · "+KINDS[kind].r;c.lb.style.color=KINDS[kind].c;
}
function pickChest(i,cws,b){
 const rolls=[rollKind(),rollKind(),rollKind()],kind=rolls[i],c=cws[i],k=KINDS[kind];rolls.forEach(r=>{S.seenK[r]=1});save();
 b.querySelector(".cshint").remove();
 cws.forEach((x,n)=>{if(n!==i)x.cw.classList.add("fade")});
 c.ch.classList.add("shake");
 setTimeout(()=>{
  c.ch.classList.remove("shake");c.cw.classList.add("open");showKind(c,kind,false);
  const cs=$("cs");
  if(kind==="duck"){cs.classList.add("leg","flash");burst(innerWidth/2,innerHeight/2,80,["#ffd23f","#ffb300","#fff3b0","#ff9d2e","#fff"])}
  else burst(innerWidth/2,innerHeight/2,34,[k.c,"#fff","#f0c14b"]);
  const rb=el("div","rar",kind==="duck"?"✨ LEGENDARY! ✨":k.r.toUpperCase()+"!");rb.style.color=k.c;if(kind==="duck")rb.classList.add("gold");
  b.appendChild(rb);
  setTimeout(()=>{cws.forEach((x,n)=>{if(n!==i){x.cw.classList.remove("fade");x.cw.classList.add("open","dimc");showKind(x,rolls[n],true)}})},700);
  setTimeout(()=>{
   const f=el("div","csf");
   f.append(el("p","cssub","Name your new "+k.n+" buddy:"));
   const inp=document.createElement("input");inp.id="csn";inp.maxLength=20;inp.placeholder="Buddy";f.appendChild(inp);
   const go=el("button","done","Welcome, "+k.n+" Buddy! ›");go.type="button";go.onclick=()=>finishCut(kind);f.appendChild(go);
   b.appendChild(f);
  },1500);
 },1000);
}
function finishCut(kind){
 const nm=($("csn").value||"").trim()||"Buddy",look={};
 ["kind","hat","topStyle","topColor","pants","shoes","eyes","glasses","mouth","body","pet"].forEach(k=>{look[k]=S.p[k]});look.ex=Object.assign({},S.p.ex||{});
 S.res.push({n:S.p.buddy||"Buddy",l:look,born:S.bs.born,clicks:S.bs.clicks||0,tasks:S.bs.tasks||0,gradAt:Date.now()});
 Object.assign(S.p,freshLook(kind),{buddy:nm});S.bs={born:Date.now(),clicks:0,tasks:0};S.xp=0;save();
 paint();drawHero();render();
 $("cs").className="cs";
 if(PG!=="t")go("t");else townOpen();
 setTimeout(()=>{toast("🎉 "+nm+" the "+KINDS[kind].n+" is your new buddy! Your old buddy moved into town.");burst(innerWidth/2,innerHeight/3,44,CONF)},700);
}
$("gbtn").onclick=askGrad;
$("go-grad").onclick=()=>{$("pm").classList.remove("show");askGrad()};
let PG="h";
const PG_ORD=["h","t","l"];
setInterval(()=>{if(PG==="t")dayShade()},60000);
function go(p){
 if(p===PG)return;
 const prevIdx=PG_ORD.indexOf(PG),nextIdx=PG_ORD.indexOf(p);
 PG=p;$("fab").hidden=p!=="h";$("pg-h").hidden=p!=="h";$("pg-t").hidden=p!=="t";$("pg-l").hidden=p!=="l";
 document.querySelectorAll(".nv").forEach(b=>b.classList.toggle("on",b.dataset.p===p));
 const el=$("pg-"+p);el.classList.remove("sl","sr");void el.offsetWidth;el.classList.add(nextIdx>=prevIdx?"sr":"sl");
 scrollTo(0,0);
 if(p==="t")townOpen();else townStop();
 if(p==="l")renderLeaderboard();
}
document.querySelectorAll(".nv").forEach(b=>{b.onclick=()=>go(b.dataset.p)});
let sx=0,sy=0,sok=false;
addEventListener("touchstart",e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;sok=!e.target.closest(".modal,.splash,.lvup,.cs,.gl,.tv,.tabs,.lb-tabs,input,select")},{passive:true});
addEventListener("touchend",e=>{if(!sok)return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)>70&&Math.abs(dy)<55){const i=PG_ORD.indexOf(PG);const ni=dx<0?Math.min(PG_ORD.length-1,i+1):Math.max(0,i-1);go(PG_ORD[ni])}},{passive:true});
document.addEventListener("visibilitychange",()=>{if(document.hidden)townStop();else if(PG==="t"){TW.on=true;TW.last=0;cancelAnimationFrame(TW.raf);TW.raf=requestAnimationFrame(tick)}});
addEventListener("resize",()=>{if(PG==="t"){TW.W=$("scene").clientWidth;TW.H=$("scene").clientHeight}});
function tickClock(){
 const d=new Date(),h=d.getHours();
 const e=h<5?"🌙":h<12?"🌅":h<17?"☀️":h<20?"🌇":"🌙",g=h<5?"Good night":h<12?"Good morning":h<17?"Good afternoon":"Good evening";
 $("clock").textContent=e+" "+g+(S.p.name?", "+S.p.name:"")+" · "+d.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});
}
let lastKey=today(),lastCup=-1;
function drawWater(){
 if(S.water.d!==today())S.water={d:today(),n:0};
 const n=S.water.n,box=$("cups");box.innerHTML="";
 for(let i=0;i<8;i++){
  const b=document.createElement("button");b.type="button";b.className="cup"+(i<n?" full":"")+(i===lastCup?" pop":"");b.setAttribute("aria-label","Cup "+(i+1));
  b.appendChild(document.createElement("i"));
  b.onclick=()=>{S.water.n=S.water.n===i+1?i:i+1;lastCup=i;save();drawWater();if(S.water.n===8)waterGoal()};
  box.appendChild(b);
 }
 $("wn").textContent=n+" / 8 cups";
}
function waterGoal(){
 if(shut.nutrition){shut.nutrition=false;render()}
 const cb=document.querySelector('input[data-id="water"]');
 if(cb&&!cb.checked)cb.click();
}
function drawJr(){
 const d=today(),t=S.jr[d]||"";
 $("jt").value=t;$("jst").textContent=t?"Saved today ✓":"";
 const L=$("jl");L.innerHTML="";
 Object.keys(S.jr).sort().reverse().filter(k=>k!==d).slice(0,3).forEach(k=>{
  const r=document.createElement("div");r.className="jrow";
  const b=document.createElement("b");b.textContent=new Date(k+"T12:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric"});
  const sp=document.createElement("span");sp.textContent=S.jr[k];r.append(b,sp);L.appendChild(r);
 });
}
$("jsave").onclick=()=>{
 const v=$("jt").value.trim();
 if(!v){toast("Write a little something first 🙏");return}
 S.jr[today()]=v.slice(0,600);
 const ks=Object.keys(S.jr).sort();while(ks.length>30)delete S.jr[ks.shift()];
 save();const lb=lvOf(S.xp),gn=award("jr",10);drawHero();drawJr();checkNbWin();
 if(gn){const r=$("jsave").getBoundingClientRect();floatXP(r.left+20,r.top-6,"+10 XP");burst(r.left+40,r.top,12,CONF);if(lvOf(S.xp)>lb)levelUp(lvOf(S.xp))}
 else toast("Entry updated ✓");
};
const wkPrev={};
function drawWeek(){
 const box=$("wk7");box.innerHTML="";const tot=S.tasks.length||1;let sum=0;
 for(let k=6;k>=0;k--){
  const dt=new Date();dt.setDate(dt.getDate()-k);const key=dkey(dt),c=S.checks[key]||{};
  const n=S.tasks.filter(t=>c[t.id]).length,pct=Math.round(n/tot*100);sum+=pct;
  const col=document.createElement("div");col.className="wcol"+(k===0?" td":"");
  const bar=document.createElement("div");bar.className="wbar";const f=document.createElement("i");f.style.height=(wkPrev[key]||0)+"%";
  requestAnimationFrame(()=>requestAnimationFrame(()=>{f.style.height=pct+"%"}));wkPrev[key]=pct;bar.appendChild(f);
  const l=document.createElement("span");l.className="wl";l.textContent=dt.toLocaleDateString(undefined,{weekday:"narrow"});
  const pp=document.createElement("span");pp.className="wp";pp.textContent=n;
  col.append(bar,l,pp);box.appendChild(col);
 }
 $("wavg").textContent="avg "+Math.round(sum/7)+"% per day";
}
function mealsNow(){const hr=new Date().getHours()+new Date().getMinutes()/60,c=S.checks[today()]||{};const want=S.tasks.filter(t=>t.m&&hr>=t.m[0]&&hr<t.m[1]&&!c[t.id]).length;if(want!==document.querySelectorAll(".nowb").length)render()}
setInterval(()=>{tickClock();if(today()!==lastKey){lastKey=today();S.days[today()]=true;save();render();drawWater();drawJr()}else mealsNow()},20000);
let hd={g:"more",ic:"star"};
function buildHabit(){
 const gc=G.find(x=>x.id===hd.g).c;
 const pv=$("hprev");pv.style.setProperty("--gc",gc);pv.innerHTML="";
 const hi=document.createElement("span");hi.className="hi";hi.innerHTML=icoSvg(hd.ic);
 const tx=document.createElement("div");const b=document.createElement("b");b.textContent=$("hn").value.trim()||"Your new habit";
 const sm=document.createElement("small");sm.textContent=($("hw").value.trim()||G.find(x=>x.id===hd.g).n);tx.append(b,sm);pv.append(hi,tx);
 const gt=$("hg");gt.innerHTML="";
 G.forEach(g=>{const bt=document.createElement("button");bt.type="button";bt.className="gt"+(g.id===hd.g?" on":"");bt.style.setProperty("--gc",g.c);
  bt.innerHTML=icoSvg(GIC[g.id]);const l=document.createElement("span");l.textContent=g.n;bt.appendChild(l);
  bt.onclick=()=>{hd.g=g.id;buildHabit()};gt.appendChild(bt)});
 const it=$("hi");it.innerHTML="";
 HICONS.forEach(n=>{const bt=document.createElement("button");bt.type="button";bt.className="it"+(n===hd.ic?" on":"");bt.setAttribute("aria-label",n);bt.innerHTML=icoSvg(n);
  bt.onclick=()=>{hd.ic=n;buildHabit()};it.appendChild(bt)});
}
function openHabit(){hd={g:"more",ic:"star"};$("hn").value="";$("hw").value="";buildHabit();$("hm").classList.add("show")}
$("fab").onclick=openHabit;
$("hn").oninput=buildHabit;$("hw").oninput=buildHabit;
$("hm").onclick=e=>{if(e.target===$("hm"))$("hm").classList.remove("show")};
$("hadd").onclick=()=>{
 const v=$("hn").value.trim();
 if(!v){rerun($("hn"),"bad");$("hn").focus();return}
 const id="c"+Date.now();S.tasks.push({id,g:hd.g,ic:hd.ic,t:v,s:$("hw").value.trim()});
 justAdded=id;shut[hd.g]=false;save();$("hm").classList.remove("show");render();
 toast("Habit added!");
 const r=document.querySelector(".newrow");if(r){r.scrollIntoView({behavior:"smooth",block:"center"});const q=r.getBoundingClientRect();burst(q.left+40,q.top+20,18,CONF)}
};
let ixTab="b",ixPl="earth";
function fillIndex(){
 $("ixt-b").classList.toggle("on",ixTab==="b");
 $("ixt-p").classList.toggle("on",ixTab==="p");
 const all=[{n:S.p.buddy||"Buddy",p:S.p}].concat(S.res.map(r=>({n:r.n,p:r.l}))),allKinds=Object.keys(KINDS);
 const unl=unlockedKinds();
 const have=k=>all.filter(b=>(b.p.kind||"square")===k);
 const unlockedB=allKinds.filter(k=>have(k).length>0||(KINDS[k].nb&&unl.has(k))).length;
 const best=Math.max(curStreak,streakBest());
 const unlockedP=PETS.filter(pt=>isPetUnlocked(pt,best)).length;
 $("ixsub").textContent=unlockedB+" of "+allKinds.length+" buddies · "+unlockedP+" of "+PETS.length+" pets";
 const L=$("ixl");L.innerHTML="";
 if(ixTab==="b"){
  const pbar=el("div","ixpbar");pbar.style.gridColumn="1/-1";
  PLANET_LIST.forEach(pid=>{
   const pc=PLANETS[pid],b=el("button","ixpchip"+(ixPl===pid?" on":""),pc.icon+" "+pc.n);b.type="button";
   b.onclick=()=>{ixPl=pid;fillIndex()};pbar.appendChild(b);
  });
  L.appendChild(pbar);
  const kinds=allKinds.filter(k=>(KINDS[k].pl||"earth")===ixPl);
  const plUnlocked=kinds.filter(k=>have(k).length>0||(KINDS[k].nb&&unl.has(k))).length;
  $("ixs").textContent=PLANETS[ixPl].n+": "+plUnlocked+" of "+kinds.length+" buddies unlocked · Total: "+unlockedB+"/"+allKinds.length;
  const bar=$("ixbar");bar.style.width="0%";requestAnimationFrame(()=>requestAnimationFrame(()=>{bar.style.width=(plUnlocked/kinds.length*100)+"%"}));
  const pool=chestPool(),totW=pool.reduce((a,b)=>a+b[1],0);
  kinds.forEach((k,i)=>{
   const hv=have(k),own=hv.length>0,isUnl=unl.has(k),kd=KINDS[k];
   const unlocked=own||(kd.nb&&isUnl);
   const c=el("div","ixc "+(unlocked?"own":"unk")+((k==="duck"||k==="cosmo"||k.endsWith("planet"))&&own?" gold":"")+(i===kinds.length-1&&kinds.length%2===1?" span2":""));c.style.setProperty("--i",i);
   const pv=el("div","ixp");
   if(unlocked){
    pv.appendChild(svgOf(own?hv[hv.length-1].p:freshLook(k),64,72));
   }else{
    pv.appendChild(el("span","ixq","?"));
   }
   c.appendChild(pv);
   if(own&&hv.length>1)c.appendChild(el("span","ixn","x"+hv.length));
   c.appendChild(el("b","",unlocked?kd.n:"???"));
   const tg=el("span","stag",unlocked?kd.r:"Locked");tg.style.background=unlocked?kd.c:"#8a8f98";c.appendChild(tg);
   const wEntry=pool.find(r=>r[0]===k),pct=wEntry?Math.round(wEntry[1]/totW*100):0;
   c.appendChild(el("div","ixo",own?hv.map(b=>b.n).join(", "):kd.nb?(isUnl?"Unlocked via "+NB[kd.nb].n:"Settle "+NB[kd.nb].n+" on "+PLANETS[kd.pl||"earth"].n):(k==="square"?"Your starter buddy":"Reach Level 10 & open chests")));
   if(k!=="square"&&unlocked)c.appendChild(el("div","ixo",pct+"% chance in a chest at level 10"));
   if(unlocked){
    const eq=S.p.kind===k;
    const eb=el("button","ubtn"+(eq?" sec":""),eq?"Equipped ✓":"Equip Buddy");
    eb.type="button";eb.style.marginTop="6px";
    eb.onclick=()=>{S.p.kind=k;if(!BODY[S.p.body])S.p.body=kd.body;save();paint();react();fillIndex();toast("Equipped "+kd.n+"!")};
    c.appendChild(eb);
   }
   L.appendChild(c);
  });
 }else{
  $("ixs").textContent=unlockedP+" of "+PETS.length+" pets unlocked · Streak & Solar System rewards";
  const bar=$("ixbar");bar.style.width="0%";requestAnimationFrame(()=>requestAnimationFrame(()=>{bar.style.width=(unlockedP/PETS.length*100)+"%"}));
  PETS.forEach((pt,i)=>{
   const unlPt=isPetUnlocked(pt,best);
   const eq=S.p.pet===pt.id;
   const c=el("div","ixc "+(unlPt?"own":"unk")+(eq?" gold":"")+(i===PETS.length-1&&PETS.length%2===1?" span2":""));c.style.setProperty("--i",i);
   const pv=el("div","ixp");
   if(unlPt){
    pv.innerHTML=petSvg(pt.id,56,52);
   }else{
    pv.appendChild(el("span","ixq","?"));
   }
   c.appendChild(pv);
   c.appendChild(el("b","",unlPt?pt.n:"???"));
   const badge=eq?"Equipped ✓":unlPt?"Unlocked":pt.nb?(PLANETS[pt.pl].icon+" "+PLANETS[pt.pl].n):(pt.st+"-day streak");
   const tg=el("span","stag",badge);
   tg.style.background=eq?"#3f9d63":unlPt?"var(--acc)":"#8a8f98";
   c.appendChild(tg);
   c.appendChild(el("div","ixo",unlPt?pt.d:pt.nb?("Settle "+NB[pt.nb].n+" on "+PLANETS[pt.pl].n):("Keep a "+pt.st+"-day streak to unlock")));
   L.appendChild(c);
  });
 }
}
$("ixt-b").onclick=()=>{ixTab="b";fillIndex()};
$("ixt-p").onclick=()=>{ixTab="p";fillIndex()};
function openIx(tab){if(tab)ixTab=tab;fillIndex();$("ix").classList.add("show")}
$("ixh").onclick=()=>openIx("b");$("ixbtn").onclick=()=>openIx("b");
$("go-ix").onclick=()=>{$("pm").classList.remove("show");openIx("b")};
$("ixdone").onclick=()=>$("ix").classList.remove("show");
$("ix").onclick=e=>{if(e.target===$("ix"))$("ix").classList.remove("show")};
const FIRE_TIERS=[
 {min:30,cls:"t5",name:"Blue Supernova Flame",cols:["#1b76ff","#45b6ff","#9be8ff","#ffffff"],sparks:["#7be0ff","#ffffff","#3ba8ff","#ffe885"],rate:4,scale:1.18,msg:"30+ days! Your dedication burns with an unstoppable celestial flame!"},
 {min:14,cls:"t4",name:"Royal Phoenix Fire",cols:["#9b38ff","#ff7a1a","#ffd23f","#fff7c2"],sparks:["#ffd23f","#ff9d2e","#e08aff","#ffffff"],rate:3,scale:1.12,msg:"2+ weeks strong! A golden phoenix blaze lights your path!"},
 {min:7,cls:"t3",name:"Roaring Blaze",cols:["#e63917","#ff7b1c","#ffd23f","#fff5b8"],sparks:["#ff8a1f","#ffd23f","#ff4d1a","#fff"],rate:2,scale:1.06,msg:"A full week+ on fire! Keep feeding the flame every day!"},
 {min:3,cls:"t2",name:"Rising Campfire",cols:["#ff5a14","#ff9922","#ffd644","#fff5bd"],sparks:["#ff9e22","#ffd23f","#fff3b0"],rate:1,scale:1.0,msg:"Your flame is growing brighter! Stay consistent today."},
 {min:1,cls:"t1",name:"Warm Spark",cols:["#ff6a1a","#ffa52b","#ffd954","#fff6c4"],sparks:["#ffb23e","#ffd97d"],rate:1,scale:.92,msg:"The fire is lit! Show up each day to make it blaze bigger."},
 {min:0,cls:"cold",name:"Unlit Ember",cols:["#666","#888","#aaa","#ccc"],sparks:[],rate:0,scale:.85,msg:"Finish a habit today to ignite your streak flame!"}
];
const FIRE_ANIM={raf:0,pts:[],t:0};
function stopFireAnim(){if(FIRE_ANIM.raf){cancelAnimationFrame(FIRE_ANIM.raf);FIRE_ANIM.raf=0}}
function startFireAnim(tier){
 stopFireAnim();
 const cv=$("fcan");if(!cv)return;
 const ctx=cv.getContext("2d"),W=cv.width,H=cv.height;
 FIRE_ANIM.pts=[];FIRE_ANIM.t=0;
 const p1=$("fp1"),p2=$("fp2"),p3=$("fp3"),p4=$("fp4");
 if(p1){
  p1.setAttribute("fill",tier.cols[0]);
  p2.setAttribute("fill",tier.cols[1]);
  p3.setAttribute("fill",tier.cols[2]);
  p4.setAttribute("fill",tier.cols[3]);
 }
 $("fsvg").style.width=Math.round(146*tier.scale)+"px";
 $("fsvg").style.height=Math.round(175*tier.scale)+"px";
 function frame(){
  if(!$("sp").classList.contains("show")){FIRE_ANIM.raf=0;return}
  FIRE_ANIM.t+=0.055;
  const t=FIRE_ANIM.t;
  // Morph SVG flame paths organically so the fire dances and licks upward
  if(tier.rate>0&&p1){
   const s=tier.rate;
   const w1=Math.sin(t*2.1)*(3.5+s*1.3),w2=Math.cos(t*2.8)*(3+s*1.2),w3=Math.sin(t*3.6)*(2.5+s);
   const tipY=4-Math.abs(Math.sin(t*2.4))*(2+s*1.5);
   p1.setAttribute("d",`M${(40+w1).toFixed(1)} ${tipY.toFixed(1)}C${(45+w2).toFixed(1)} 24 ${(68+w1*.7).toFixed(1)} 34 68 60C68 81 55 94 40 94C25 94 12 81 12 60C12 47 ${(20-w2*.7).toFixed(1)} 40 25 32C28 42 32 45 35 45C32 30 ${(35+w1*.6).toFixed(1)} 16 ${(40+w1).toFixed(1)} ${tipY.toFixed(1)}Z`);
   p2.setAttribute("d",`M${(40-w2*.9).toFixed(1)} 26C${(44+w3).toFixed(1)} 40 58 47 58 64C58 80 50 90 40 90C30 90 22 80 22 64C22 52 30 46 34 38C36 44 38 44 ${(40-w2*.9).toFixed(1)} 26Z`);
   p3.setAttribute("d",`M${(40+w3*.8).toFixed(1)} 44C43 55 52 60 52 72C52 83 46 89 40 89C34 89 28 83 28 72C28 63 34 58 36 51C38 55 39 55 ${(40+w3*.8).toFixed(1)} 44Z`);
   p4.setAttribute("d",`M${(40-w1*.5).toFixed(1)} 62C42 68 47 71 47 77C47 83 43 87 40 87C37 87 33 83 33 77C33 72 37 69 ${(40-w1*.5).toFixed(1)} 62Z`);
  }
  ctx.clearRect(0,0,W,H);
  // Spawn rising sparks & glowing embers proportional to streak tier
  for(let i=0;i<tier.rate;i++){
   if(Math.random()<.65){
    FIRE_ANIM.pts.push({
     x:W/2+(Math.random()-.5)*(46+tier.rate*12),
     y:H-36-Math.random()*26,
     vx:(Math.random()-.5)*(0.8+tier.rate*.28),
     vy:-(1.1+Math.random()*(1.2+tier.rate*.45)),
     r:1.4+Math.random()*(1.6+tier.rate*.4),
     life:1,
     dec:0.014+Math.random()*.014,
     col:tier.sparks[Math.floor(Math.random()*tier.sparks.length)]||"#ffd23f"
    });
   }
  }
  for(let i=FIRE_ANIM.pts.length-1;i>=0;i--){
   const pt=FIRE_ANIM.pts[i];
   pt.x+=pt.vx+Math.sin(t*2+i)*.35;
   pt.y+=pt.vy;
   pt.life-=pt.dec;
   if(pt.life<=0){FIRE_ANIM.pts.splice(i,1);continue}
   ctx.save();
   ctx.globalAlpha=Math.max(0,pt.life);
   ctx.fillStyle=pt.col;
   ctx.shadowColor=pt.col;
   ctx.shadowBlur=8;
   ctx.beginPath();
   ctx.arc(pt.x,pt.y,pt.r*pt.life,0,Math.PI*2);
   ctx.fill();
   ctx.restore();
  }
  FIRE_ANIM.raf=requestAnimationFrame(frame);
 }
 FIRE_ANIM.raf=requestAnimationFrame(frame);
}
function showSplash(force){
 if(!force&&S.splash===today())return;
 S.splash=today();save();
 const n=curStreak,sp=$("sp");
 const tier=FIRE_TIERS.find(t=>n>=t.min)||FIRE_TIERS[FIRE_TIERS.length-1];
 sp.className="splash "+tier.cls;
 $("ftier").textContent=tier.name;
 $("spm").textContent=tier.msg;
 const w=$("spw");w.innerHTML="";
 for(let k=6;k>=0;k--){
  const dt=new Date();dt.setDate(dt.getDate()-k);
  const key=dkey(dt),ok=!!S.days[key];
  const d=document.createElement("div");d.className="wd"+(ok?" ok":"")+(k===0?" td":"");
  d.style.setProperty("--i",6-k);
  const l=document.createElement("span");l.textContent=dt.toLocaleDateString(undefined,{weekday:"narrow"});
  const c=document.createElement("i");c.textContent=ok?"✓":"";
  d.append(l,c);w.appendChild(d);
 }
 const num=$("spn");num.textContent="0";
 sp.classList.add("show");
 startFireAnim(tier);
 let v=0;const step=Math.max(1,Math.ceil(n/18));
 if(n>0){const iv=setInterval(()=>{v=Math.min(n,v+step);num.textContent=v;if(v>=n)clearInterval(iv)},45)}
}
$("spgo").onclick=()=>{$("sp").classList.remove("show");stopFireAnim()};
$("sp").onclick=e=>{if(e.target===$("sp")){$("sp").classList.remove("show");stopFireAnim()}};
$("sb").onclick=e=>{e.stopPropagation();showSplash(true)};
function updateUserBar(justSaved){
 const u=USERS.find(x=>x.id===CUR_UID);
 const nm=(S.p.name||"").trim()||(u&&u.label)||"Player 1";
 if($("ubname"))$("ubname").textContent=nm+" · "+(S.p.buddy||"Buddy");
 if($("ubstat")){
  $("ubstat").textContent=justSaved?"Saved just now ✓":"Synced ✓";
  clearTimeout($("ubstat")._t);
  $("ubstat")._t=setTimeout(()=>{if($("ubstat"))$("ubstat").textContent="All data saved ✓"},1800);
 }
 if($("syncst"))$("syncst").textContent="Saved "+new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})+" ✓";
}
function save(){
 try{
  S.lastSaved=Date.now();
  localStorage.setItem(uKey(CUR_UID),JSON.stringify(S));
  localStorage.setItem(K_CUR,CUR_UID);
  const idx=USERS.findIndex(x=>x.id===CUR_UID);
  const meta={
   id:CUR_UID,
   label:(S.p.name||"").trim()||(idx>=0?USERS[idx].label:"Player "+(USERS.length+1)),
   updated:S.lastSaved,
   lv:typeof lvOf==="function"?lvOf(S.xp):1,
   buddy:S.p.buddy||"Buddy",
   town:typeof NB!=="undefined"&&NB[S.nb.cur]?NB[S.nb.cur].n:"Meadow Valley"
  };
  if(idx>=0)USERS[idx]=meta;else USERS.push(meta);
  localStorage.setItem(K_USERS,JSON.stringify(USERS));
  updateUserBar(true);
 }catch(e){}
}
function renderUsers(){
 const L=$("ulist");if(!L)return;
 L.innerHTML="";
 USERS.forEach((u,i)=>{
  const row=document.createElement("div");row.className="uitem"+(u.id===CUR_UID?" cur":"");
  const inf=document.createElement("div");inf.className="uinf";
  const b=document.createElement("b");b.textContent=(u.label||("Player "+(i+1)))+(u.id===CUR_UID?" (Active)":"");
  const sm=document.createElement("small");
  sm.textContent="Lv "+(u.lv||1)+" · Buddy: "+(u.buddy||"Buddy")+" · "+(u.town||"Meadow Valley");
  inf.append(b,sm);
  inf.onclick=()=>{if(u.id!==CUR_UID)switchUser(u.id)};
  row.appendChild(inf);
  if(u.id!==CUR_UID){
   const sw=document.createElement("button");sw.type="button";sw.className="ubtn";sw.textContent="Switch";
   sw.onclick=()=>switchUser(u.id);
   row.appendChild(sw);
   if(USERS.length>1){
    const dl=document.createElement("button");dl.type="button";dl.className="ubtn delu";dl.textContent="✕";dl.setAttribute("aria-label","Delete profile");
    dl.onclick=()=>{
     if(dl.classList.contains("arm")){
      USERS=USERS.filter(x=>x.id!==u.id);
      try{localStorage.removeItem(uKey(u.id));localStorage.setItem(K_USERS,JSON.stringify(USERS))}catch(e){}
      renderUsers();toast("Profile removed");
     }else{dl.classList.add("arm");dl.textContent="Delete?";setTimeout(()=>{dl.classList.remove("arm");dl.textContent="✕"},2600)}
    };
    row.appendChild(dl);
   }
  }
  L.appendChild(row);
 });
}
function switchUser(id){
 save();
 let raw=null;
 try{const r=localStorage.getItem(uKey(id));if(r)raw=JSON.parse(r)}catch(e){}
 CUR_UID=id;
 S=hydrateState(raw);
 Object.keys(shut).forEach(k=>delete shut[k]);
 save();
 paint();render();drawWater();drawJr();
 if(PG==="t")townOpen();
 view("info");
 toast("Switched to "+(S.p.name||USERS.find(x=>x.id===id)?.label||"User"));
}
function createNewUser(){
 save();
 const num=USERS.length+1;
 const id="u_"+Date.now();
 CUR_UID=id;
 S=freshState("Player "+num);
 Object.keys(shut).forEach(k=>delete shut[k]);
 save();
 paint();render();drawWater();drawJr();
 if(PG==="t")townOpen();
 view("info");
 toast("Created fresh profile: Player "+num);
 setTimeout(()=>{const inp=$("pn");if(inp){inp.focus();inp.select()}},150);
}
$("ubar").onclick=()=>{view("info");$("pm").classList.add("show")};
$("uadd").onclick=createNewUser;
$("uexp").onclick=()=>{
 save();
 const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),user:USERS.find(x=>x.id===CUR_UID),data:S},null,2)],{type:"application/json"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);
 const slug=((S.p.name||"daily-walk").toLowerCase().replace(/[^a-z0-9]+/g,"-")||"backup");
 a.download=slug+"-"+today()+".json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
 toast("Save file downloaded!");
};

const K_FRIENDS="dailywalk_universal:friends:v1";
let lbSort="xp";
function calcStreakForState(stObj){
 if(!stObj||!stObj.days)return 0;
 let st=0,dt=new Date();
 if(!stObj.days[today()])dt.setDate(dt.getDate()-1);
 while(stObj.days[dkey(dt)]){st++;dt.setDate(dt.getDate()-1)}
 return st;
}
function calcTotalTasksForState(stObj){
 if(!stObj)return 0;
 let tot=0;
 if(stObj.checks)Object.values(stObj.checks).forEach(o=>{if(o&&typeof o==="object")Object.values(o).forEach(v=>{if(v)tot++})});
 return Math.max(tot,Number(stObj.bs&&stObj.bs.tasks)||0);
}
function calcTownsDoneForState(stObj){
 if(!stObj||!stObj.nb||!stObj.nb.xp)return 0;
 return Object.values(stObj.nb.xp).filter(v=>(Number(v)||0)>=MAXAT).length;
}
function gatherUniversalAccounts(){
 const map=new Map();
 // 1. Scan all localStorage keys for any Daily Walk account (Starter, Admin Account, legacy, or any user)
 try{
  for(let i=0;i<localStorage.length;i++){
   const k=localStorage.key(i);
   if(!k)continue;
   if(k.includes(":u:")||k===K_LEGACY){
    const raw=localStorage.getItem(k);
    if(!raw)continue;
    const parsed=JSON.parse(raw);
    if(!parsed||typeof parsed!=="object"||!parsed.p)continue;
    const isMe=(k===uKey(CUR_UID));
    const stObj=isMe?S:parsed;
    const uid=isMe?CUR_UID:k;
    const name=(stObj.p&&stObj.p.name||"").trim()||"Walker";
    const buddy=(stObj.p&&stObj.p.buddy||"Buddy").trim();
    const xp=Math.max(Number(stObj.life)||0,Number(stObj.xp)||0);
    const lv=lvOf(Number(stObj.xp)||0);
    const streak=calcStreakForState(stObj);
    const bestStreak=Math.max(streak,0);
    const towns=calcTownsDoneForState(stObj);
    const tasks=calcTotalTasksForState(stObj);
    const edition=k.startsWith("dailywalk_admin")?"Admin Account":"Starter";
    map.set(uid,{
     id:uid,
     name,
     buddy,
     look:stObj.p,
     xp,
     lv,
     streak,
     towns,
     tasks,
     edition,
     isMe,
     updated:stObj.lastSaved||Date.now()
    });
   }
  }
 }catch(e){}
 // 2. Merge any universally imported Friend Codes
 try{
  const fr=JSON.parse(localStorage.getItem(K_FRIENDS)||"[]");
  if(Array.isArray(fr)){
   fr.forEach(f=>{
    if(f&&f.id&&!map.has(f.id)){
     map.set(f.id,Object.assign({isMe:false,edition:"Friend Code"},f));
    }
   });
  }
 }catch(e){}
 // Ensure current active account is always present & up-to-date
 map.set(CUR_UID,{
  id:CUR_UID,
  name:(S.p.name||"").trim()||"You",
  buddy:(S.p.buddy||"Buddy").trim(),
  look:S.p,
  xp:Math.max(Number(S.life)||0,Number(S.xp)||0),
  lv:lvOf(S.xp),
  streak:curStreak,
  towns:calcTownsDoneForState(S),
  tasks:calcTotalTasksForState(S),
  edition:K_USERS.includes("master")?"Admin Account":"Starter",
  isMe:true,
  updated:Date.now()
 });
 return Array.from(map.values());
}
function renderLeaderboard(){
 const listEl=$("lblist");if(!listEl)return;
 document.querySelectorAll(".lb-tab").forEach(b=>b.classList.toggle("on",b.dataset.lbt===lbSort));
 const all=gatherUniversalAccounts();
 all.sort((a,b)=>{
  if(lbSort==="streak")return(b.streak-a.streak)||(b.xp-a.xp);
  if(lbSort==="town")return(b.towns-a.towns)||(b.xp-a.xp);
  if(lbSort==="tasks")return(b.tasks-a.tasks)||(b.xp-a.xp);
  return(b.xp-a.xp)||(b.streak-a.streak);
 });
 const K_HIDDEN="dailywalk_admin:hidden_ids:v1";
 let hiddenIds=[];
 try{hiddenIds=JSON.parse(localStorage.getItem(K_HIDDEN)||"[]")}catch(e){}
 const filteredAll=all.filter(u=>!hiddenIds.includes(u.id));
 $("lbcnt").textContent=filteredAll.length+(filteredAll.length===1?" Account":" Accounts");
 const myIdx=filteredAll.findIndex(x=>x.isMe);
 const me=filteredAll[myIdx]||filteredAll[0]||all[0];
 $("lbmyrk").textContent=myIdx>=0?("#"+(myIdx+1)):"-";
 $("lbmynm").textContent=me.name+" · "+me.buddy;
 $("lbmyxp").textContent=lbSort==="streak"?("🔥 "+me.streak+"d"):lbSort==="town"?("🪐 "+me.towns+"/48"):lbSort==="tasks"?("✅ "+me.tasks):("⭐ "+me.xp.toLocaleString()+" XP");
 listEl.innerHTML="";
 filteredAll.forEach((u,idx)=>{
  const rank=idx+1;
  const card=document.createElement("div");
  card.className="lb-card"+(u.isMe?" me":"")+(rank===1?" top1":rank===2?" top2":rank===3?" top3":"");
  card.style.setProperty("--i",idx);
  const rk=document.createElement("div");rk.className="lb-rk";
  rk.textContent=rank===1?"🥇":rank===2?"🥈":rank===3?"🥉":"#"+rank;
  const av=document.createElement("div");av.className="lb-av";
  av.appendChild(svgOf(u.look||freshLook("square"),36,40));
  const inf=document.createElement("div");inf.className="lb-inf";
  const b=document.createElement("b");b.textContent=u.name+(u.isMe?" (You)":"");
  const sm=document.createElement("small");
  sm.textContent="Lv "+u.lv+" "+u.buddy+" · 🔥 "+u.streak+"d · 🪐 "+u.towns+" towns";
  inf.append(b,sm);
  const val=document.createElement("div");val.className="lb-val";
  if(lbSort==="streak"){
   val.innerHTML="🔥 "+u.streak+"<small>day streak</small>";
  }else if(lbSort==="town"){
   val.innerHTML="🪐 "+u.towns+"<small>ecosystems</small>";
  }else if(lbSort==="tasks"){
   val.innerHTML="✅ "+u.tasks+"<small>habits done</small>";
  }else{
   val.innerHTML=u.xp.toLocaleString()+"<small>total XP</small>";
  }
  card.append(rk,av,inf,val);
  const rmBtn=document.createElement("button");
  rmBtn.type="button";rmBtn.className="ubtn delu";rmBtn.textContent="✕";
  rmBtn.title="Admin: Remove from Leaderboard";
  rmBtn.style.marginLeft="8px";
  rmBtn.onclick=e=>{
   e.stopPropagation();
   if(rmBtn.classList.contains("arm")){
    hiddenIds.push(u.id);
    try{localStorage.setItem("dailywalk_admin:hidden_ids:v1",JSON.stringify(hiddenIds))}catch(e){}
    renderLeaderboard();
    toast("Removed "+u.name+" from Leaderboard");
   }else{
    rmBtn.classList.add("arm");rmBtn.textContent="Remove?";
    setTimeout(()=>{rmBtn.classList.remove("arm");rmBtn.textContent="✕"},2600);
   }
  };
  card.appendChild(rmBtn);
  listEl.appendChild(card);
 });
}
document.querySelectorAll(".lb-tab").forEach(b=>{
 b.onclick=()=>{lbSort=b.dataset.lbt;renderLeaderboard()};
});
$("lbshare").onclick=()=>{
 const me=gatherUniversalAccounts().find(x=>x.isMe);
 if(!me)return;
 const payload={
  id:"fr_"+(me.name||"walker").toLowerCase().replace(/[^a-z0-9]/g,"")+"_"+me.xp,
  name:me.name,
  buddy:me.buddy,
  look:me.look,
  xp:me.xp,
  lv:me.lv,
  streak:me.streak,
  towns:me.towns,
  tasks:me.tasks
 };
 const code="DW1:"+btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
 if(navigator.clipboard&&navigator.clipboard.writeText){
  navigator.clipboard.writeText(code).then(()=>toast("📋 Friend Code copied! Anyone can paste it on their Leaderboard.")).catch(()=>prompt("Copy your Universal Friend Code:",code));
 }else{
  prompt("Copy your Universal Friend Code:",code);
 }
};
$("lbreset").onclick=()=>{
 try{localStorage.removeItem("dailywalk_admin:hidden_ids:v1");renderLeaderboard();toast("All hidden accounts restored!")}catch(e){}
};
$("lbaddf").onclick=()=>{
 const raw=prompt("Paste a friend's Universal Friend Code (starts with DW1:) to add them to your Leaderboard:");
 if(!raw)return;
 try{
  const clean=raw.trim().replace(/^DW1:/,"");
  const parsed=JSON.parse(decodeURIComponent(escape(atob(clean))));
  if(!parsed||!parsed.name||typeof parsed.xp!=="number")throw new Error("Bad code");
  const fr=JSON.parse(localStorage.getItem(K_FRIENDS)||"[]");
  const idx=fr.findIndex(x=>x.id===parsed.id||x.name===parsed.name);
  if(idx>=0)fr[idx]=parsed;else fr.push(parsed);
  localStorage.setItem(K_FRIENDS,JSON.stringify(fr));
  renderLeaderboard();
  toast("🎉 Added "+parsed.name+" to the Universal Leaderboard!");
 }catch(e){
  toast("❌ Invalid Friend Code — please paste the full DW1:... code");
 }
};
addEventListener("storage",()=>{if(PG==="l")renderLeaderboard()});

$("uimp").onclick=()=>$("ufile").click();
$("ufile").onchange=e=>{
 const f=e.target.files&&e.target.files[0];if(!f)return;
 const rd=new FileReader();
 rd.onload=()=>{
  try{
   const parsed=JSON.parse(rd.result);
   const data=parsed&&parsed.data?parsed.data:parsed;
   if(!data||typeof data!=="object"||!data.tasks)throw new Error("Invalid file");
   S=hydrateState(data);
   save();paint();render();drawWater();drawJr();if(PG==="t")townOpen();view("info");
   toast("Save file restored! ✓");
  }catch(err){toast("Could not read that backup file")}
  $("ufile").value="";
 };
 rd.readAsText(f);
};
let hideT,last="",busy=false;
function hop(){const a=$("pal");a.classList.remove("hop");void a.getBoundingClientRect();a.classList.add("hop");setTimeout(()=>a.classList.remove("hop"),750)}
function say(txt){
 last=txt;const b=$("bubble");
 if(b.classList.contains("show"))b.textContent=lbl(txt);else $("dot").classList.add("on");
}
$("av").onclick=()=>{hop();const b=$("bubble");if(b.classList.contains("show")){b.classList.remove("show")}else{b.textContent=lbl(last||"Hi! Check something off, then tap me to see how to do it for God.");b.classList.add("show");$("dot").classList.remove("on")}};
$("bubble").onclick=()=>{$("bubble").classList.remove("show")};
async function cheer(t,all){
 const end=all?"\n\n🎉 You finished everything today. “Well done, good and faithful servant” (Matthew 25:21).":"";
 if(t.tip){say(t.tip+end);return}
 const fb="You did “"+t.t+"”! Offer it to God in a quick prayer. Whatever you do, do it as for the Lord (Colossians 3:23)."+end;
 say(fb);
 if(busy)return;
 let sample=null;try{sample=await claude.use("sample")}catch(e){}
 if(!sample)return;
 busy=true;
 try{
  const r=await sample("You are a warm, encouraging Christian friend inside a habit app. The user just checked off this habit: “"+t.t+"”. In under 60 words, plain text, explain how they can do or use this habit for God: a short prayer or mindset plus one relevant Bible reference by citation only. Be gracious, not legalistic.",{cache:false});
  if(r&&r.text)say(r.text+end);
 }catch(e){}
 busy=false;
}
function render(){
 const d=today();const c=S.checks[d]||{};let fullEl=null,idx=0;
 $("date").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"});tickClock();
 const L=$("list");L.innerHTML="";
 G.forEach(g=>{
  const ts=S.tasks.filter(t=>(t.g||"more")===g.id);
  if(!ts.length)return;
  const dn=ts.filter(t=>c[t.id]).length;
  const sec=document.createElement("section");sec.className="grp"+(shut[g.id]?" shut":"")+(dn===ts.length?" full":"")+(g.id===fullG?" bounceG":"")+(firstR?" enter":"");sec.style.setProperty("--i",idx++);sec.style.setProperty("--gc",g.c);if(g.id===fullG)fullEl=sec;
  const h=document.createElement("button");h.type="button";h.className="gh";
  const mk=(cl,tx)=>{const e=document.createElement("span");e.className=cl;e.textContent=tx;return e};
  h.append(mk("ge",g.e),mk("gn",g.n),mk("gc",dn===ts.length?"✓ Done":dn+"/"+ts.length),mk("chev","⌄"));
  h.onclick=()=>{shut[g.id]=!shut[g.id];if(!shut[g.id])openedG=g.id;render()};
  const bar=document.createElement("div");bar.className="gbar";const bi=document.createElement("i");bi.style.width=(prevW[g.id]||0)+"%";const nw=dn/ts.length*100;requestAnimationFrame(()=>requestAnimationFrame(()=>{bi.style.width=nw+"%"}));prevW[g.id]=nw;bar.appendChild(bi);
  sec.append(h,bar);
  if(!shut[g.id]){
   const body=document.createElement("div");body.className="gb"+(openedG===g.id?" fx":"");
   ts.forEach(t=>{
    const el=document.createElement("div");el.className="item"+(c[t.id]?" done":"");
    const lb=document.createElement("label");
    const cb=document.createElement("input");cb.type="checkbox";cb.dataset.id=t.id;cb.checked=!!c[t.id];if(t.id===justId)cb.className="just";
    cb.onchange=()=>{
     S.checks[d]=S.checks[d]||{};S.checks[d][t.id]=cb.checked;
     const n=S.tasks.filter(x=>S.checks[d][x.id]).length;
     S.days[d]=n===S.tasks.length;save();
     if(cb.checked){justId=t.id;const gid=t.g||"more";if(S.tasks.filter(x=>(x.g||"more")===gid).every(x=>S.checks[d][x.id]))fullG=gid;allDone=S.days[d];const tb=builtN();const lb=lvOf(S.xp);let gn=award("t:"+t.id,10);if(gn){S.bs.tasks=(S.bs.tasks||0)+1;save()}if(fullG)gn+=award("g:"+gid,15);if(allDone)gn+=award("all",30);xpGain=gn;if(lvOf(S.xp)>lb)lvUp=lvOf(S.xp);if(builtN()>tb)newB=BLD[builtN()-1].n;hop()}
     render();
     if(cb.checked)cheer(t,S.days[d]);
    };
    const tx=document.createElement("span");tx.className="t";tx.textContent=t.t;
    if(t.m){const hr=new Date().getHours()+new Date().getMinutes()/60;if(hr>=t.m[0]&&hr<t.m[1]&&!c[t.id]){const nb=document.createElement("span");nb.className="nowb";nb.textContent="NOW";tx.append(" ",nb)}}
    if(t.s){const sm=document.createElement("small");sm.textContent=t.s;tx.appendChild(sm)}
    const hi=document.createElement("span");hi.className="hi";hi.innerHTML=icoSvg(t.ic||DEFIC[t.id]||GIC[t.g||"more"]);
    lb.append(cb,hi,tx);el.appendChild(lb);
    if(t.id===justAdded)el.classList.add("newrow");
    if(/^c\d+$/.test(String(t.id))){
     el.classList.add("itrow");
     const dl=document.createElement("button");dl.type="button";dl.className="del";dl.setAttribute("aria-label","Remove habit");dl.innerHTML=icoSvg("trash");
     dl.onclick=ev=>{ev.stopPropagation();if(dl.classList.contains("arm")){S.tasks=S.tasks.filter(x=>x.id!==t.id);save();render();toast("Habit removed")}else{dl.classList.add("arm");setTimeout(()=>dl.classList.remove("arm"),2600)}};
     el.appendChild(dl);
    }
    body.appendChild(el);
   });
   sec.appendChild(body);
  }
  L.appendChild(sec);
 });
 const n=S.tasks.filter(t=>c[t.id]).length,tot=S.tasks.length;
 $("fill").style.width=(tot?n/tot*100:0)+"%";
 $("count").textContent=n+" of "+tot+" done";
 let st=0,dt=new Date();
 if(!S.days[today()])dt.setDate(dt.getDate()-1);
 while(S.days[dkey(dt)]){st++;dt.setDate(dt.getDate()-1)}
 $("streak").textContent=st?"🔥 "+st+"-day streak":"";const sbT="🔥"+st;if($("sb").textContent!==sbT){$("sb").textContent=sbT;rerun($("sb"),"pulse")}curStreak=st;syncPetUnlocks(st);
 const jx=document.querySelector("input.just");if(jx){const r=jx.getBoundingClientRect();burst(r.left+13,r.top+13,10,CONF)}
 if(fullG&&fullEl){const r=fullEl.getBoundingClientRect();burst(r.right-50,r.top+22,18,CONF)}
 if(allDone)burst(innerWidth/2,140,36,CONF);
 if(xpGain&&jx){const r=jx.getBoundingClientRect();floatXP(r.left+34,r.top-6,"+"+xpGain+" XP")}
 if(lvUp)levelUp(lvUp);
 if(newB){const nn=newB;setTimeout(()=>toast("🏗️ Your town built: "+nn+"! Check the Town tab."),1600);newB=""}
 xpGain=0;lvUp=0;drawHero();
 drawWeek();checkNbWin();
 justId=null;justAdded=null;fullG=null;allDone=false;openedG=null;firstR=false;
}
$("reset").onclick=()=>{S.checks[today()]={};S.days[today()]=true;save();render()};
save();paint();render();drawWater();drawJr();showSplash();hydrate();iconize(document.body);icMO.observe(document.body,{childList:true,subtree:true,characterData:true});
addEventListener("beforeunload",save);
