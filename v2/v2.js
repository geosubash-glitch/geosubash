// v2 preview: early-web layout over the same data as the live site
// (js/projects.js, js/assets.generated.js, data/shelf.json).
(() => {
  const S = window.SITE, P = window.PROJECTS, O = window.ONGOING || [];
  const view = document.getElementById("view");
  const wipe = document.getElementById("wipe");
  const addr = document.getElementById("addr");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const u = (p) => (!p || /^(https?:|data:)/.test(p) ? p || "" : `../${p}`);   // data paths are relative to the site root
  const paras = (t) => [].concat(t || []).filter(Boolean).map((x) => `<p>${esc(x)}</p>`).join("");
  const NAMES = { linkedin: "LinkedIn", github: "GitHub", behance: "Behance", instagram: "Instagram" };
  const nice = (k) => NAMES[k] || k[0].toUpperCase() + k.slice(1);
  const img = (src, alt = "", extra = "") => src ? `<img src="${esc(u(src))}" alt="${esc(alt)}" loading="lazy" referrerpolicy="no-referrer" ${extra} />` : "";
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // a barcode drawn from the text itself, so it is the same every time
  function barcode(text, bars = 46) {
    let h = 7, out = "";
    for (let i = 0; i < bars; i++) {
      h = (h * 31 + text.charCodeAt(i % text.length)) % 997;
      out += `<i style="width:${1 + (h % 3)}px;margin-right:${1 + ((h >> 2) % 3)}px"></i>`;
    }
    return `<div class="barcode" aria-hidden="true">${out}</div>`;
  }

  // ---------- home: masthead + ticker + now + contents ----------
  function home() {
    const [first, ...rest] = S.name.toUpperCase().split(" ");
    const news = [
      ...O.map((o) => `now: ${o.title}, ${o.status || "in progress"}`),
      ...P.filter((p) => p.year).map((p) => `${p.title} (${p.year})`),
      ...P.filter((p) => !p.year).map((p) => p.title),
      ...S.skills,
    ];
    const run = news.map((n) => `<span>${esc(n)}</span>`).join("");
    return `
      <section class="mast">
        <h1><span class="ln"><span>${esc(first)}</span></span><span class="ln"><span>${esc(rest.join(" "))}<span class="dot">.</span></span></span></h1>
        <div class="idcard">
          <dl>
            <dt>discipline</dt><dd>${esc(S.role)}</dd>
            <dt>studying</dt><dd>${esc(S.school)}</dd>
            <dt>based</dt><dd>${esc(S.location)}</dd>
            <dt>works</dt><dd>${pad(P.length)}</dd>
          </dl>
          ${barcode(S.name)}<span class="px">c:/geosubash · 001</span>
        </div>
      </section>
      <div class="ticker" aria-hidden="true"><div class="ticker-track">${run}${run}</div></div>
      ${O.map((o) => `
      <a class="now win" href="#/now/${o.slug}" style="display:block;color:inherit;text-decoration:none">
        <div class="win-bar peri"><span>now.htm</span><span><i class="pulse"></i>${esc(o.status || "in progress")}</span></div>
        <div class="win-body">
          <div><span class="kicker">${esc(o.category || "ongoing")}</span>
            <div class="title">${esc(o.title)}</div>
            <p class="dek">${esc(o.subtitle)}</p></div>
          <span class="more">check it out →</span>
        </div>
      </a>`).join("")}
      <div class="contents-head"><h2>Contents</h2><span class="px">${pad(P.length)} works</span></div>
      ${contents(P)}`;
  }

  // alternating layout: a big entry, then a row of small ones, then a big one flipped…
  function contents(list) {
    let out = "", i = 0, flip = false;
    while (i < list.length) {
      out += feat(list[i], P.indexOf(list[i]), flip); i++; flip = !flip;
      if (list.length - i === 1) continue;   // a lone leftover gets a big entry, not a stretched row
      const row = list.slice(i, i + 3); i += row.length;
      out += `<div class="row">${row.map((p) => rowItem(p, P.indexOf(p))).join("")}</div>`;
    }
    return out;
  }
  const byline = (p) => [p.year, p.team, p.guide && `guided by ${p.guide}`].filter(Boolean).join(" · ");
  function feat(p, i, flip) {
    return `<a class="feat${flip ? " flip" : ""}" href="#/work/${p.slug}">
      <span class="num">${pad(i + 1)}</span>
      <span class="text"><span class="kicker">${esc(p.category)}</span>
        <h3 class="title">${esc(p.title)}</h3>
        <p class="dek">${esc(p.subtitle)}</p>
        ${byline(p) ? `<div class="byline">${esc(byline(p))}</div>` : ""}</span>
      <span class="media">${img(p.cover, p.title)}</span>
    </a>`;
  }
  function rowItem(p, i) {
    return `<a class="row-item" href="#/work/${p.slug}" data-cover="${esc(u(p.cover))}">
      <span class="rnum">${pad(i + 1)}</span>
      <span class="kicker" style="margin-left:8px">${esc(p.category)}</span>
      <h3 class="rtitle">${esc(p.title)}</h3>
      <p class="dek">${esc(p.subtitle)}</p>
      <div class="thumb">${img(p.cover, p.title)}</div>
    </a>`;
  }

  // ---------- work: filterable contents ----------
  let filter = "all";
  function work() {
    const tags = ["all", ...new Set(P.flatMap((p) => p.tags.map((t) => t.toLowerCase())))];
    const list = filter === "all" ? P : P.filter((p) => p.tags.map((t) => t.toLowerCase()).includes(filter));
    return `
      <div class="bar"><span>work</span><span>${pad(list.length)} of ${pad(P.length)}</span></div>
      <div class="filters">${tags.map((t) => `<button data-filter="${esc(t)}" class="${t === filter ? "is-active" : ""}">${esc(t)}</button>`).join("")}</div>
      <div class="row" style="border-bottom:0">${list.map((p) => rowItem(p, P.indexOf(p))).join("")}</div>`;
  }

  // ---------- project: a magazine spread ----------
  function project(sl) {
    const i = P.findIndex((p) => p.slug === sl);
    if (i < 0) return notFound();
    const p = P[i], next = P[(i + 1) % P.length];
    const credits = [["year", p.year], ["team", p.team], ["guided by", p.guide], ["duration", p.duration], ["tools", (p.tools || []).join(", ")]].filter(([, v]) => v);
    const links = Object.entries(p.links || {}).filter(([, v]) => v);
    return `
      <div class="bar"><span>${esc(p.category)} · no. ${pad(i + 1)}</span><span>${esc(p.tags.join(" / ").toLowerCase())}</span></div>
      <section class="spread">
        <div>
          <span class="kicker">no. ${pad(i + 1)}</span>
          <h1>${esc(p.title)}</h1>
          <div class="credits">${credits.map(([k, v]) => `${k}: <b>${esc(v)}</b>`).join("<br>")}</div>
          ${[].concat(p.summary || []).filter(Boolean).map((t) => `<p class="intro">${esc(t)}</p>`).join("")}
          ${links.length ? `<div class="links">${links.map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(nice(k))} ↗</a>`).join("")}</div>` : ""}
        </div>
        <figure class="figure">
          <div class="frame-img">${img(p.cover, p.title) || ""}</div>
          <figcaption class="cap">fig. 01 · ${esc(p.title.toLowerCase())}</figcaption>
        </figure>
      </section>
      ${p.quote ? `<figure class="pull"><blockquote>“${esc(p.quote.text)}”</blockquote><figcaption>${esc(p.quote.by)}</figcaption></figure>` : ""}
      ${p.slides.length ? `
      <section class="study">
        <div class="bar peri"><span>full case study</span><span>${p.slides.length} parts · scroll</span></div>
        <div class="slides">${p.slides.map((s, k) => `<img src="${esc(u(s.src))}" width="${s.w}" height="${s.h}" alt="${esc(p.title)} case study, part ${k + 1}" ${k ? 'loading="lazy"' : ""} />`).join("")}</div>
      </section>` : ""}
      ${p.story ? story(p) : ""}
      <a class="folio" href="#/work/${next.slug}">
        <span class="px">${pad(i + 1)} / ${pad(P.length)} · c:/geosubash/work/${esc(p.slug)}</span>
        <span><span class="px">next →</span><br><span class="nxt">${esc(next.title)}</span></span>
      </a>`;
  }

  function story(p) {
    const g = (k) => p.gallery[k];
    const spec = (rows) => rows ? `<dl class="spec">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : "";
    return `<section class="story">${p.story.map((b, n) => {
      if (b.images) return `<div class="jrow">${b.images.map(g).filter(Boolean).map((x, j) =>
        `<figure style="flex-grow:${(x.w / x.h).toFixed(3)}">${img(x.src, p.title)}<figcaption class="cap">fig. ${pad(n + j + 2)}${b.caption && j === 0 ? " · " + esc(b.caption.toLowerCase()) : ""}</figcaption></figure>`).join("")}</div>`;
      const side = b.image != null && g(b.image) ? `<figure style="margin:0">${img(g(b.image).src, p.title)}<figcaption class="cap">${esc((b.caption || "").toLowerCase())}</figcaption></figure>` : `<div class="k">${esc(b.label || "")}</div>`;
      return `<div class="chap">${side}<div>${b.image != null ? `<div class="k">${esc(b.label || "")}</div>` : ""}${paras(b.text)}${spec(b.list)}</div></div>`;
    }).join("")}</section>`;
  }

  // ---------- ongoing work ----------
  const figmaEmbed = (url) => `https://embed.figma.com/${url.replace(/^https:\/\/(www\.)?figma\.com\//, "")}${url.includes("?") ? "&" : "?"}embed-host=share`;
  function ongoing(sl) {
    const o = O.find((x) => x.slug === sl);
    if (!o) return notFound();
    const credits = [["status", o.status], ["year", o.year], ["team", o.team], ["guided by", o.guide]].filter(([, v]) => v);
    return `
      <div class="bar peri"><span><i class="pulse"></i>${esc(o.status || "in progress")}</span><span>${esc(o.category || "")}</span></div>
      <section class="spread">
        <div>
          <span class="kicker">now</span>
          <h1>${esc(o.title)}</h1>
          <div class="credits">${credits.map(([k, v]) => `${k}: <b>${esc(v)}</b>`).join("<br>")}</div>
          ${[].concat(o.summary || []).map((t) => `<p class="intro">${esc(t)}</p>`).join("")}
        </div>
        <div class="win dotted"><div class="win-bar"><span>notes</span><span>research.board</span></div>
          <div class="win-body"><p style="margin:0">${esc(o.subtitle)}. The board below is live from FigJam, so it updates as the research does.</p>
          ${o.board ? `<p style="margin:10px 0 0"><a href="${esc(o.board)}" target="_blank" rel="noopener">Open the board in Figma ↗</a></p>` : ""}</div></div>
      </section>
      ${o.board ? `<section class="board"><div class="bar"><span>research board</span><span>drag and zoom inside</span></div>
        <iframe src="${esc(figmaEmbed(o.board))}" title="${esc(o.title)} research board" loading="lazy" allowfullscreen></iframe></section>` : ""}
      <a class="folio" href="#/"><span class="px">c:/geosubash/now/${esc(o.slug)}</span><span><span class="px">back to</span><br><span class="nxt">Contents</span></span></a>`;
  }

  // ---------- about: a personal page ----------
  let SHELF = { music: [], movies: [], photos: [] };
  const spotify = (url) => {
    const m = String(url || "").match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode|artist)\/([A-Za-z0-9]+)/);
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : "";
  };
  const win = (name, num, body, cls = "") => `<div class="win ${cls}"><div class="win-bar"><span>${name}</span><span>${num}</span></div><div class="win-body">${body}</div></div>`;
  function about() {
    const links = [["Email", `mailto:${S.email}`], ...Object.entries(S.links).filter(([, v]) => v).map(([k, v]) => [nice(k), v])];
    const mods = [];
    mods.push(win("toolkit.txt", "01", `<div class="chips">${S.skills.map((s) => `<span>${esc(s)}</span>`).join("")}</div>`));
    if ((S.certifications || []).length) mods.push(win("certificates.txt", "02", `<ul class="certs">${S.certifications.map((c) =>
      `<li><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.title)}</a><span class="px">${esc(c.issuer.toLowerCase())}</span></li>`).join("")}</ul>`));
    if (SHELF.music.length) mods.push(win("audio", "03", SHELF.music.map((m) => {
      const e = spotify(m.link);
      return e ? `<div class="spot"><iframe src="${esc(e)}" title="${esc(m.title || "Spotify track")}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>`
        : `<p><a href="${esc(m.link)}" target="_blank" rel="noopener">${esc(m.title || m.link)}</a></p>`;
    }).join("")));
    if (SHELF.movies.length) mods.push(win("video", "04", `<div class="movies">${SHELF.movies.map((v) =>
      `<a href="${esc(v.link || "#")}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${img(v.poster, v.title)}<b>${esc(v.title)}</b>${v.year ? `<span class="px">${esc(v.year)}</span>` : ""}</a>`).join("")}</div>`));
    if (SHELF.photos.length) mods.push(win("photos", "05", `<div class="photos">${SHELF.photos.map((p, k) =>
      `<figure>${img(p.src, p.caption || "")}<figcaption>dscf_${pad(k + 1)}${p.caption ? " · " + esc(p.caption.toLowerCase()) : ""}</figcaption></figure>`).join("")}</div>`, "wide"));
    return `
      <div class="bar"><span>about me</span><span>${esc(S.school.toLowerCase())}</span></div>
      <section class="aboutme">
        <h1>About me</h1>
        <div class="me">
          <div class="left">
            ${S.portrait ? `${img(S.portrait, `Portrait of ${S.name}`)}<div class="cap">${esc(S.name.toLowerCase())}</div>` : ""}
            <h3>Links:</h3>
            <ul>${links.map(([k, v]) => `<li><a href="${esc(v)}" ${v.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${esc(k)}</a></li>`).join("")}</ul>
          </div>
          <div class="right">
            ${paras(S.about)}
            <div class="mods">${mods.join("")}</div>
          </div>
        </div>
      </section>`;
  }
  fetch(`../data/shelf.json?v=${Date.now()}`).then((r) => (r.ok ? r.json() : null)).then((d) => {
    if (!d) return;
    SHELF = { music: d.music || [], movies: d.movies || [], photos: d.photos || [] };
    if (route().name === "about") render(false);
  }).catch(() => {});

  function privacy() {
    return `<div class="bar"><span>privacy & terms</span><span>updated 2026</span></div>
      <section class="plain">
        <h1>Privacy & terms</h1>
        <h2>Privacy</h2>
        <p>This site has no cookies, analytics, ads or sign-up forms, and it doesn't collect anything about you.</p>
        <p>It's hosted on GitHub Pages, which keeps standard server logs. Fonts load from Google Fonts. The music players come from Spotify, the research board from Figma, and movie posters from Apple and Wikipedia; each of those follows its own privacy policy when it loads.</p>
        <p>If you email me, I'll only use your address to reply.</p>
        <h2>Terms</h2>
        <p>All projects, images and text here are my own work unless credited. Please ask before reusing them, and credit me if you share them.</p>
      </section>`;
  }
  const notFound = () => `<section class="plain"><h1>404</h1><p>Not found. <a href="#/">Back to the contents</a>.</p></section>`;

  // ---------- router ----------
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (!parts.length) return { name: "home", path: "index", html: home() };
    if (parts[0] === "work" && parts[1]) return { name: "work", path: `work/${parts[1]}`, html: project(parts[1]) };
    if (parts[0] === "work") return { name: "work", path: "work", html: work() };
    if (parts[0] === "now" && parts[1]) return { name: "", path: `now/${parts[1]}`, html: ongoing(parts[1]) };
    if (parts[0] === "about") return { name: "about", path: "about", html: about() };
    if (parts[0] === "privacy") return { name: "", path: "privacy", html: privacy() };
    return { name: "", path: "404", html: notFound() };
  }
  function render(animate) {
    const r = route();
    view.innerHTML = r.html;
    view.classList.remove("enter");
    if (animate) { void view.offsetWidth; view.classList.add("enter"); }
    addr.textContent = `C:/geosubash/${r.path}`;
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === r.name));
    const h = view.querySelector("h1");
    document.title = r.name === "home" || !h ? `${S.name}, Industrial Design Portfolio` : `${h.textContent} · ${S.name}`;
    window.scrollTo(0, 0);
    preview.classList.remove("on");
  }
  window.addEventListener("hashchange", () => {
    if (location.hash === "#contact") return;
    if (reduce) return render(false);
    wipe.className = "wipe in";
    setTimeout(() => { render(true); wipe.className = "wipe out"; }, 380);
  });
  document.getElementById("tab-contact").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("contact").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });
  view.addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter]");
    if (!b) return;
    filter = b.dataset.filter;
    render(false);
  });

  // ---------- cursor-follow preview on small entries ----------
  const preview = document.getElementById("preview"), pimg = preview.querySelector("img");
  let mx = 0, my = 0, px = 0, py = 0, raf = 0;
  const loop = () => { px += (mx - px) * .16; py += (my - py) * .16; preview.style.transform = `translate(${px + 18}px, ${py + 18}px)`; raf = requestAnimationFrame(loop); };
  view.addEventListener("mouseover", (e) => {
    const a = e.target.closest(".row-item");
    if (!a || !a.dataset.cover || a.querySelector(".thumb img")) return;   // only where the row has no thumbnail of its own
    pimg.src = a.dataset.cover; preview.classList.add("on");
  });
  view.addEventListener("mouseout", (e) => { const a = e.target.closest(".row-item"); if (a && !a.contains(e.relatedTarget)) preview.classList.remove("on"); });
  addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; if (!raf) { px = mx; py = my; loop(); } });

  // ---------- footer: links, status bar, the scramble ----------
  const cta = document.getElementById("cta"), scr = document.getElementById("scramble");
  cta.href = `mailto:${S.email}`;
  document.getElementById("foot-links").innerHTML = [["Email", `mailto:${S.email}`], ...Object.entries(S.links).filter(([, v]) => v).map(([k, v]) => [nice(k), v])]
    .map(([k, v]) => `<li><a href="${esc(v)}" ${v.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${esc(k)}</a></li>`).join("");
  const updated = new Date(document.lastModified);
  document.getElementById("status-right").innerHTML =
    `© ${updated.getFullYear()} ${esc(S.name.toLowerCase())} · <a href="#/privacy">privacy & terms</a>${isNaN(updated) ? "" : ` · updated ${pad(updated.getDate())}/${pad(updated.getMonth() + 1)}/${updated.getFullYear()}`}`;

  const FROM = "Get in touch", TO = S.email, GLYPHS = "!<>-_\\/[]{}=+*^?#@%&$";
  let target = FROM, sraf = 0;
  function scrambleTo(t) {
    if (t === target) return;
    target = t; cancelAnimationFrame(sraf);
    if (reduce) { scr.textContent = t; return; }
    const from = scr.textContent, len = Math.max(from.length, t.length);
    const q = Array.from({ length: len }, (_, i) => { const s = Math.floor(Math.random() * 12); return { a: from[i] || "", b: t[i] || "", s, e: s + 10 + Math.floor(Math.random() * 18) + i }; });
    let f = 0;
    const step = () => {
      let done = 0, html = "";
      for (const c of q) {
        if (f >= c.e) { done++; html += esc(c.b); }
        else if (f >= c.s) html += `<span class="x">${esc(GLYPHS[Math.floor(Math.random() * GLYPHS.length)])}</span>`;
        else html += esc(c.a);
      }
      scr.innerHTML = html;
      if (done < q.length) { f++; sraf = requestAnimationFrame(step); }
    };
    step();
  }
  cta.addEventListener("pointerenter", () => scrambleTo(TO));
  cta.addEventListener("pointerleave", () => scrambleTo(FROM));
  cta.addEventListener("focus", () => scrambleTo(TO));
  cta.addEventListener("blur", () => scrambleTo(FROM));
  cta.addEventListener("click", (e) => { if (matchMedia("(hover: none)").matches && target !== TO) { e.preventDefault(); scrambleTo(TO); } });

  render(!reduce);
})();
