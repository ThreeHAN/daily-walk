const shut = {};
// State hydrated and verified on load
let curStreak = 0,
  popTok = null;
function rerun(el, c) {
  el.classList.remove(c);
  el.getBoundingClientRect();
  el.classList.add(c);
}
const CONF = ["#ff8a1f", "#f0c14b", "#e5509a", "#3b6fd4", "#3f9d63", "#8a56c9"];
function burst(x, y, n, cols) {
  for (let i = 0; i < n; i++) {
    const e = document.createElement("span");
    e.className = "cf";
    const a = Math.random() * 6.28,
      r = 40 + Math.random() * 80;
    e.style.cssText =
      "left:" +
      x +
      "px;top:" +
      y +
      "px;background:" +
      cols[i % cols.length] +
      ";--dx:" +
      Math.cos(a) * r +
      "px;--dy:" +
      (Math.sin(a) * r - 30) +
      "px;--r:" +
      Math.round(Math.random() * 540) +
      "deg";
    document.body.appendChild(e);
    setTimeout(() => e.remove(), 900);
  }
}
function react() {
  const vs = [...document.querySelectorAll(".pv")].filter(
    (e) => e.getBoundingClientRect().width,
  );
  vs.forEach((e) => rerun(e, "wig"));
  const v = vs[0];
  if (v) {
    const ph = v.parentElement;
    for (let i = 0; i < 6; i++) {
      const sp = document.createElement("span");
      sp.className = "spk";
      sp.textContent = "✦";
      const a = Math.random() * 6.28;
      sp.style.cssText =
        "left:50%;top:50%;color:#f0c14b;--dx:" +
        Math.cos(a) * 55 +
        "px;--dy:" +
        Math.sin(a) * 55 +
        "px";
      ph.appendChild(sp);
      setTimeout(() => sp.remove(), 700);
    }
  }
}
function countTo(el, n) {
  let v = 0;
  const st = Math.max(1, Math.ceil(n / 15));
  el.textContent = "0";
  if (!n) return;
  const iv = setInterval(() => {
    v = Math.min(n, v + st);
    el.textContent = v;
    if (v >= n) clearInterval(iv);
  }, 40);
}
const lbl = (t) => (S.p.buddy || "Buddy") + ":\n" + t;
