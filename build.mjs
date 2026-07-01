// Zero-dependency static site generator for the AISA DevRel microsite.
// Reads content.json, emits public/index.html. No npm install needed.
import { readFileSync, writeFileSync } from "node:fs";

const C = JSON.parse(readFileSync(new URL("./content.json", import.meta.url)));

// --- tiny markdown -> html (paragraphs, lists, bold, code, links) ---
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function inline(s) {
  return esc(s)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}
function md(src = "") {
  const blocks = src.trim().split(/\n{2,}/);
  return blocks.map((b) => {
    const lines = b.split("\n");
    if (lines.every((l) => /^\s*[-*]\s+/.test(l)))
      return "<ul>" + lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ""))}</li>`).join("") + "</ul>";
    return `<p>${lines.map(inline).join("<br>")}</p>`;
  }).join("\n");
}

const stat = (s) => `<div class="stat"><div class="stat-v">${inline(s.value)}</div><div class="stat-l">${inline(s.label)}</div><div class="stat-s">${inline(s.sub)}</div></div>`;
const card = (c, i) => `<article class="card"><div class="card-label">${c.n != null ? `<span class="card-n">${c.n}</span>` : ""}${inline(c.label)}</div><h3>${inline(c.title)}</h3><p>${inline(c.detail)}</p></article>`;

function table(rows) {
  if (!rows || !rows.length) return "";
  const [head, ...body] = rows;
  return `<div class="tablewrap"><table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function section(s) {
  const cards = s.cards?.length ? `<div class="cards ${s.cards.length >= 4 ? "cards-4" : "cards-3"}">${s.cards.map(card).join("")}</div>` : "";
  const stats = s.stats?.length ? `<div class="stats">${s.stats.map(stat).join("")}</div>` : "";
  return `<section id="${s.id}" class="sec">
    <div class="sec-head"><span class="kicker">${inline(s.kicker || s.title)}</span><h2>${inline(s.heading || s.title)}</h2></div>
    ${s.body_md ? `<div class="prose">${md(s.body_md)}</div>` : ""}
    ${stats}${cards}${table(s.table)}
  </section>`;
}

function roadmap(releases) {
  if (!releases?.length) return "";
  return `<section id="ladder" class="sec">
    <div class="sec-head"><span class="kicker">Publication ladder</span><h2>The site, shipped in cuts</h2></div>
    <div class="ladder">${releases.map((r) => `<div class="rung"><div class="rung-v">${inline(r.version)}</div><div class="rung-body"><h3>${inline(r.name || "")}</h3><p class="rung-goal">${inline(r.goal || "")}</p><ul>${(r.ships || []).map((x) => `<li>${inline(x)}</li>`).join("")}</ul></div></div>`).join("")}</div>
  </section>`;
}

const navItems = [
  ["setup", "Setup"], ["wedge", "Wedge"], ["honesty", "Field notes"], ["programs", "Initiatives"],
  ["roadmap", "Roadmap"], ["metrics", "Metrics"], ["swot", "SWOT"], ["engagement", "Engagement"], ["ladder", "Publish"],
].filter(([id]) => C.sections.some((s) => s.id === id) || id === "ladder" || id === "roadmap");

const order = C.plan?.section_order?.length ? C.plan.section_order : C.sections.map((s) => s.id);
const orderedSections = order.map((id) => C.sections.find((s) => s.id === id)).filter(Boolean);
// include the roadmap section object if present in sections, else render releases as ladder only
const hero = C.plan?.hero || {};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>AISA · DevRel Strategy</title>
<meta name="description" content="An outside-in Developer Relations strategy for AISA.one — the unified capability + payment layer for AI agents."/>
<meta property="og:title" content="AISA · DevRel Strategy"/>
<meta property="og:description" content="An outside-in DevRel program for AISA.one, the transaction network for the AI agent economy."/>
<meta property="og:type" content="website"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<style>${css()}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="shell">
  <aside class="side">
    <div class="brand"><span class="dot"></span>AIsa <span class="brand-sub">DevRel</span></div>
    <nav>${navItems.map(([id, l]) => `<a href="#${id}">${l}</a>`).join("")}</nav>
    <div class="side-foot">
      <a href="${C.links?.repo || "#"}">GitHub ↗</a>
      <a href="https://aisa.one">aisa.one ↗</a>
    </div>
  </aside>
  <main id="main">
    <header class="hero">
      <span class="kicker">${inline(hero.kicker || "DevRel proposal · v1 · outside-in")}</span>
      <h1>${inline(hero.headline || "A DevRel program for the agent economy.")}</h1>
      <p class="lede">${inline(hero.subhead || "")}</p>
      <div class="hero-ctas">${(hero.ctas || ["Read the strategy", "See the roadmap"]).map((c, i) => `<a class="btn ${i === 0 ? "btn-primary" : ""}" href="#${i === 0 ? "setup" : "roadmap"}">${inline(c)}</a>`).join("")}</div>
      <div class="hero-meta">${(hero.metaline || []).map((m) => `<span>${inline(m)}</span>`).join("")}</div>
      <div class="northstar"><span class="ns-l">North star</span> ${inline(C.plan?.north_star || C.north_star || "")}</div>
    </header>
    ${orderedSections.map(section).join("\n")}
    ${roadmap(C.plan?.site_releases)}
    <footer class="foot">
      <p>${inline(C.footer || "AISA DevRel strategy · outside-in proposal.")}</p>
      <p class="foot-sub">Built by a DevRel leader who shaped the developer program at Cisco Meraki, led DevRel at MetaMask, and brings an ~86k-developer community. Source: <a href="${C.links?.repo || "#"}">GitHub</a>.</p>
    </footer>
  </main>
</div>
<script>
document.querySelectorAll('.side nav a').forEach(a=>a.addEventListener('click',()=>{}));
const secs=[...document.querySelectorAll('section[id], header.hero')];
const links=new Map([...document.querySelectorAll('.side nav a')].map(a=>[a.getAttribute('href').slice(1),a]));
const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.remove('active'));const l=links.get(e.target.id);if(l)l.classList.add('active');}})},{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(s=>obs.observe(s));
</script>
</body>
</html>`;

writeFileSync(new URL("./index.html", import.meta.url), html);
console.log("wrote index.html (" + html.length + " bytes, " + orderedSections.length + " sections)");

function css() {
  return `
:root{
  --bg:#04070e; --bg2:#070b16; --panel:#0b1120; --panel2:#0e1526; --line:rgba(255,255,255,.08);
  --ink:rgba(255,255,255,.92); --mut:rgba(255,255,255,.60); --dim:rgba(255,255,255,.42);
  --acc:#3ce0d0; --acc2:#7c8cff; --warn:#ffb454;
  --mono:'JetBrains Mono',ui-monospace,monospace; --disp:'Space Grotesk',system-ui,sans-serif; --body:'Inter',system-ui,sans-serif;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:radial-gradient(1200px 600px at 80% -10%,rgba(124,140,255,.10),transparent 60%),radial-gradient(900px 500px at -10% 10%,rgba(60,224,208,.08),transparent 55%),var(--bg);color:var(--ink);font-family:var(--body);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.skip{position:absolute;left:-999px}.skip:focus{left:12px;top:12px;background:var(--acc);color:#00120f;padding:8px 12px;border-radius:8px;z-index:99}
.shell{display:grid;grid-template-columns:240px 1fr;max-width:1240px;margin:0 auto}
/* sidebar */
.side{position:sticky;top:0;height:100vh;padding:34px 22px;display:flex;flex-direction:column;gap:22px;border-right:1px solid var(--line)}
.brand{font-family:var(--disp);font-weight:700;letter-spacing:.3px;font-size:19px;display:flex;align-items:center;gap:9px}
.brand-sub{color:var(--acc);font-weight:600}
.dot{width:9px;height:9px;border-radius:50%;background:var(--acc);box-shadow:0 0 14px var(--acc)}
.side nav{display:flex;flex-direction:column;gap:2px;margin-top:6px}
.side nav a{font-size:13.5px;color:var(--mut);padding:7px 10px;border-radius:8px;border-left:2px solid transparent;transition:.15s}
.side nav a:hover{color:var(--ink);background:rgba(255,255,255,.03)}
.side nav a.active{color:var(--acc);border-left-color:var(--acc);background:rgba(60,224,208,.06)}
.side-foot{margin-top:auto;display:flex;flex-direction:column;gap:8px;font-size:12.5px;color:var(--dim)}
.side-foot a:hover{color:var(--acc)}
/* main */
main{padding:0 clamp(24px,5vw,72px) 90px;min-width:0}
.kicker{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--acc)}
.hero{padding:96px 0 60px;border-bottom:1px solid var(--line)}
.hero h1{font-family:var(--disp);font-weight:700;font-size:clamp(34px,5.4vw,60px);line-height:1.04;letter-spacing:-.02em;margin:20px 0 22px;max-width:16ch}
.lede{font-size:clamp(16px,1.5vw,19px);color:var(--mut);max-width:66ch}
.hero-ctas{display:flex;gap:12px;flex-wrap:wrap;margin:30px 0 26px}
.btn{font-size:14px;font-weight:500;padding:11px 18px;border-radius:10px;border:1px solid var(--line);color:var(--ink);transition:.15s}
.btn:hover{border-color:rgba(255,255,255,.28);transform:translateY(-1px)}
.btn-primary{background:linear-gradient(120deg,var(--acc),var(--acc2));color:#00120f;border:none;font-weight:600}
.hero-meta{display:flex;gap:26px;flex-wrap:wrap;font-size:13px;color:var(--dim);font-family:var(--mono)}
.hero-meta span{position:relative}
.northstar{margin-top:26px;font-size:14px;color:var(--mut);background:linear-gradient(90deg,rgba(60,224,208,.08),transparent);border:1px solid var(--line);border-left:2px solid var(--acc);padding:12px 16px;border-radius:10px;max-width:70ch}
.northstar .ns-l{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--acc);margin-right:8px}
/* sections */
.sec{padding:64px 0;border-bottom:1px solid var(--line)}
.sec-head{margin-bottom:22px}
.sec-head h2{font-family:var(--disp);font-weight:600;font-size:clamp(24px,3vw,34px);letter-spacing:-.01em;margin:10px 0 0}
.prose{color:var(--mut);max-width:74ch;font-size:15.5px}
.prose p{margin:0 0 14px}
.prose ul{margin:0 0 14px;padding-left:18px}.prose li{margin:6px 0}
.prose strong{color:var(--ink)}
.prose code,code{font-family:var(--mono);font-size:.88em;background:rgba(124,140,255,.12);color:#cdd4ff;padding:1px 6px;border-radius:5px}
.prose a{color:var(--acc);border-bottom:1px solid rgba(60,224,208,.4)}
/* stats */
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin:26px 0 4px}
.stat{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:14px;padding:20px}
.stat-v{font-family:var(--disp);font-weight:700;font-size:30px;letter-spacing:-.02em;background:linear-gradient(120deg,#fff,var(--acc));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.stat-l{font-size:14px;color:var(--ink);margin-top:6px;font-weight:500}
.stat-s{font-size:12.5px;color:var(--dim);margin-top:3px}
/* cards */
.cards{display:grid;gap:14px;margin-top:26px}
.cards-3{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.cards-4{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.card{background:linear-gradient(180deg,var(--panel),rgba(11,17,32,.6));border:1px solid var(--line);border-radius:14px;padding:22px;transition:.18s}
.card:hover{border-color:rgba(60,224,208,.35);transform:translateY(-2px)}
.card-label{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--acc);display:flex;align-items:center;gap:8px}
.card-n{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:6px;background:rgba(60,224,208,.14);color:var(--acc);font-size:11px}
.card h3{font-family:var(--disp);font-weight:600;font-size:17px;margin:12px 0 8px;color:var(--ink)}
.card p{margin:0;font-size:14px;color:var(--mut)}
/* table */
.tablewrap{margin-top:24px;overflow-x:auto;border:1px solid var(--line);border-radius:14px}
table{width:100%;border-collapse:collapse;font-size:14px;min-width:520px}
th,td{text-align:left;padding:13px 16px;border-bottom:1px solid var(--line)}
th{font-family:var(--mono);font-size:11.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--acc);background:rgba(255,255,255,.02)}
td{color:var(--mut)}tr:last-child td{border-bottom:none}td:first-child{color:var(--ink);font-weight:500}
/* ladder */
.ladder{display:flex;flex-direction:column;gap:0;margin-top:26px}
.rung{display:grid;grid-template-columns:88px 1fr;gap:20px;padding:22px 0;border-top:1px solid var(--line)}
.rung:first-child{border-top:none}
.rung-v{font-family:var(--mono);font-weight:500;color:var(--acc);font-size:15px;padding-top:2px}
.rung-body h3{font-family:var(--disp);font-weight:600;font-size:17px;margin:0 0 4px}
.rung-goal{margin:0 0 10px;color:var(--mut);font-size:14px}
.rung ul{margin:0;padding-left:16px;color:var(--dim);font-size:13.5px;columns:2;column-gap:28px}
.rung li{margin:4px 0}
/* footer */
.foot{padding:48px 0 0;color:var(--dim);font-size:13.5px}
.foot-sub{color:rgba(255,255,255,.32);margin-top:8px;font-size:12.5px}
.foot a{color:var(--acc)}
@media(max-width:860px){
  .shell{grid-template-columns:1fr}
  .side{position:static;height:auto;flex-direction:row;flex-wrap:wrap;align-items:center;border-right:none;border-bottom:1px solid var(--line);padding:16px 20px;gap:12px}
  .side nav{flex-direction:row;flex-wrap:wrap;margin:0}.side-foot{flex-direction:row;margin:0}
  .rung ul{columns:1}
}`;
}
