// v2 preview: a plain early-2000s personal site over the same data as the live site
// (js/projects.js, js/assets.generated.js, data/shelf.json).
(() => {
  const S = window.SITE, P = window.PROJECTS, O = window.ONGOING || [];
  const view = document.getElementById("view");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const u = (p) => (!p || /^(https?:|data:)/.test(p) ? p || "" : `../${p}`);   // data paths are relative to the site root
  const paras = (t) => [].concat(t || []).filter(Boolean).map((x) => `<p>${esc(x)}</p>`).join("");
  const NAMES = { linkedin: "LinkedIn", github: "GitHub", behance: "Behance", instagram: "Instagram" };
  const nice = (k) => NAMES[k] || k[0].toUpperCase() + k.slice(1);
  const ext = (v) => (/^https?:/.test(v) ? ' target="_blank" rel="noopener"' : "");
  const img = (src, alt = "", lazy = true) => (src ? `<img src="${esc(u(src))}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""} referrerpolicy="no-referrer" />` : "");
  const contacts = () => [["Email", `mailto:${S.email}`], ...Object.entries(S.links).filter(([, v]) => v).map(([k, v]) => [nice(k), v])];
  const facts = (rows) => {
    rows = rows.filter(([, v]) => v);
    return rows.length ? `<table class="facts">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${esc(v)}</td></tr>`).join("")}</table>` : "";
  };

  // ---------- home: one line for work in progress, then the list ----------
  function home() {
    return `
      ${O.map((o) => `<p class="now"><span class="live" aria-hidden="true"></span>Now: <a href="#/now/${o.slug}">${esc(o.title)}</a> <span class="mute">(${esc((o.status || "in progress").toLowerCase())})</span></p>`).join("")}
      <h2 class="label">Work</h2>
      <ul class="list">${P.map((p) => `<li><a class="item" href="#/work/${p.slug}">
        <span class="thumb">${img(p.cover, "")}</span>
        <span><span class="t">${esc(p.title)}</span><span class="s">${esc(p.subtitle)}</span>${p.year ? `<span class="y">${esc(p.year)}</span>` : ""}</span>
      </a></li>`).join("")}</ul>`;
  }

  // ---------- project ----------
  function project(sl) {
    const i = P.findIndex((p) => p.slug === sl);
    if (i < 0) return notFound();
    const p = P[i], next = P[(i + 1) % P.length];
    const links = Object.entries(p.links || {}).filter(([, v]) => v);
    return `
      <p class="back"><a href="#/">« All work</a></p>
      <h1>${esc(p.title)}</h1>
      <p class="sub">${esc(p.subtitle)}</p>
      <div class="thumb cover">${img(p.cover, p.title, false)}</div>
      ${facts([["Year", p.year], ["Team", p.team], ["Guided by", p.guide], ["Duration", p.duration], ["Tools", (p.tools || []).join(", ")]])}
      <div class="reading">${paras(p.summary)}
        ${links.length ? `<p>${links.map(([k, v]) => `<a href="${esc(v)}"${ext(v)}>${esc(nice(k))}</a>`).join(" · ")}</p>` : ""}</div>
      ${p.quote ? `<figure class="quote"><blockquote>“${esc(p.quote.text)}”</blockquote><figcaption>${esc(p.quote.by)}</figcaption></figure>` : ""}
      ${p.slides.length ? `<div class="study">${p.slides.map((s, k) =>
        `<img src="${esc(u(s.src))}" width="${s.w}" height="${s.h}" alt="${esc(p.title)} case study, part ${k + 1}" loading="lazy" />`).join("")}</div>` : ""}
      ${p.story ? story(p) : ""}
      <div class="next"><a href="#/">« All work</a><a href="#/work/${next.slug}">Next: ${esc(next.title)} »</a></div>`;
  }
  function story(p) {
    const g = (k) => p.gallery[k];
    return p.story.map((b) => {
      if (b.images) return `<div class="chap"><div class="figs">${b.images.map(g).filter(Boolean).map((x) =>
        `<figure style="flex:${(x.w / x.h).toFixed(3)}"><span class="thumb">${img(x.src, p.title)}</span></figure>`).join("")}</div>${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ""}</div>`;
      const x = b.image != null && g(b.image);
      return `<div class="chap reading">${b.label ? `<h3>${esc(b.label)}</h3>` : ""}${paras(b.text)}
        ${b.list ? facts(b.list) : ""}${x ? `<figure class="fig"><span class="thumb">${img(x.src, b.caption || p.title)}</span>${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ""}</figure>` : ""}</div>`;
    }).join("");
  }

  // ---------- work in progress ----------
  const figmaEmbed = (url) => `https://embed.figma.com/${url.replace(/^https:\/\/(www\.)?figma\.com\//, "")}${url.includes("?") ? "&" : "?"}embed-host=share`;
  function ongoing(sl) {
    const o = O.find((x) => x.slug === sl);
    if (!o) return notFound();
    return `
      <p class="back"><a href="#/">« All work</a></p>
      <h1>${esc(o.title)}</h1>
      <p class="sub"><span class="live" aria-hidden="true"></span>${esc(o.status || "In progress")}</p>
      <div class="reading">${paras(o.summary)}</div>
      ${o.board ? `<div class="board"><iframe src="${esc(figmaEmbed(o.board))}" title="${esc(o.title)} research board" loading="lazy" allowfullscreen></iframe>
        <figcaption><a href="${esc(o.board)}" target="_blank" rel="noopener">Open the board in Figma</a></figcaption></div>` : ""}`;
  }

  // ---------- about ----------
  let SHELF = { music: [], movies: [], photos: [] };
  const spotify = (url) => {
    const m = String(url || "").match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode|artist)\/([A-Za-z0-9]+)/);
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : "";
  };
  function about() {
    const sect = (title, body) => `<section class="sect"><h2 class="label">${title}</h2>${body}</section>`;
    return `
      <h1 style="margin-bottom:18px">About</h1>
      <div class="about-top">
        ${S.portrait ? `<span class="thumb">${img(S.portrait, `Portrait of ${S.name}`, false)}</span>` : ""}
        <div class="reading">${paras(S.about)}<p class="mute">${esc(S.role)}, ${esc(S.school)}, ${esc(S.location)}</p></div>
      </div>
      ${sect("Toolkit", `<p>${S.skills.map(esc).join(", ")}</p>`)}
      ${(S.certifications || []).length ? sect("Certificates", `<ul class="plain-list">${S.certifications.map((c) =>
        `<li><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.title)}</a> <span class="mute">(${esc(c.issuer)})</span></li>`).join("")}</ul>`) : ""}
      ${SHELF.photos.length ? sect("Photos", `<div class="photos">${SHELF.photos.map((p) =>
        `<figure style="margin:0"><span class="thumb">${img(p.src, p.caption || "Photo by Geo Subash")}</span>${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}</figure>`).join("")}</div>`) : ""}
      ${SHELF.music.length ? sect("On repeat", SHELF.music.map((m) => {
        const e = spotify(m.link);
        return e ? `<div class="spot"><iframe src="${esc(e)}" title="${esc(m.title || "Spotify track")}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>`
          : `<p><a href="${esc(m.link)}" target="_blank" rel="noopener">${esc(m.title || m.link)}</a></p>`;
      }).join("")) : ""}
      ${SHELF.movies.length ? sect("Watching", `<div class="movies">${SHELF.movies.map((v) =>
        `<a href="${esc(v.link || "#")}" target="_blank" rel="noopener"><span class="thumb">${img(v.poster, v.title)}</span>${esc(v.title)}</a>`).join("")}</div>`) : ""}`;
  }
  fetch(`../data/shelf.json?v=${Date.now()}`).then((r) => (r.ok ? r.json() : null)).then((d) => {
    if (!d) return;
    SHELF = { music: d.music || [], movies: d.movies || [], photos: d.photos || [] };
    if (route().name === "about") render(false);
  }).catch(() => {});

  function privacy() {
    return `<h1 style="margin-bottom:18px">Privacy &amp; terms</h1>
      <div class="reading">
        <p>This site has no cookies, analytics, ads or sign-up forms, and it doesn't collect anything about you.</p>
        <p>It's hosted on GitHub Pages, which keeps standard server logs. The music players come from Spotify, the research board from Figma, and movie posters from Apple and Wikipedia; each of those follows its own privacy policy when it loads.</p>
        <p>If you email me, I'll only use your address to reply.</p>
        <p>All projects, images and text here are my own work unless credited. Please ask before reusing them, and credit me if you share them.</p>
      </div>`;
  }
  const notFound = () => `<h1>Page not found</h1><p><a href="#/">Back to the work</a></p>`;

  // ---------- router ----------
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (!parts.length || (parts[0] === "work" && !parts[1])) return { name: "home", html: home() };
    if (parts[0] === "work") return { name: "home", html: project(parts[1]) };
    if (parts[0] === "now" && parts[1]) return { name: "home", html: ongoing(parts[1]) };
    if (parts[0] === "about") return { name: "about", html: about() };
    if (parts[0] === "privacy") return { name: "", html: privacy() };
    return { name: "", html: notFound() };
  }
  function render(top = true) {
    const r = route();
    view.innerHTML = r.html;
    document.querySelectorAll("[data-nav]").forEach((a) => {
      const on = a.dataset.nav === r.name;
      a.classList.toggle("is-active", on);
      on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
    });
    const h = view.querySelector("h1");
    document.title = !h ? `${S.name}, Industrial Design Portfolio` : `${h.textContent} - ${S.name}`;
    if (top) { window.scrollTo(0, 0); view.focus({ preventScroll: true }); }
  }
  addEventListener("hashchange", () => render());

  // ---------- footer ----------
  document.getElementById("links").innerHTML = contacts().map(([k, v]) => `<a href="${esc(v)}"${ext(v)}>${esc(k)}</a>`).join(" · ");
  document.getElementById("copy").innerHTML = `© ${new Date().getFullYear()} ${esc(S.name)} · <a href="#/privacy">Privacy &amp; terms</a>`;

  // "Get in touch" turns into the email address on hover (kept from the live site)
  const cta = document.getElementById("cta"), scr = document.getElementById("scramble");
  cta.href = `mailto:${S.email}`;
  const FROM = "Get in touch", TO = S.email, GLYPHS = "!<>-_\\/[]{}=+*^?#@%&$";
  let target = FROM, sraf = 0;
  function scrambleTo(t) {
    if (t === target) return;
    target = t; cancelAnimationFrame(sraf);
    if (reduce) { scr.textContent = t; return; }
    const from = scr.textContent, len = Math.max(from.length, t.length);
    const qd = Array.from({ length: len }, (_, i) => { const s = Math.floor(Math.random() * 8); return { a: from[i] || "", b: t[i] || "", s, e: s + 6 + Math.floor(Math.random() * 10) + i }; });
    let f = 0;
    const step = () => {
      let done = 0, html = "";
      for (const c of qd) {
        if (f >= c.e) { done++; html += esc(c.b); }
        else if (f >= c.s) html += `<span class="x">${esc(GLYPHS[Math.floor(Math.random() * GLYPHS.length)])}</span>`;
        else html += esc(c.a);
      }
      scr.innerHTML = html;
      if (done < qd.length) { f++; sraf = requestAnimationFrame(step); }
    };
    step();
  }
  cta.addEventListener("pointerenter", () => scrambleTo(TO));
  cta.addEventListener("pointerleave", () => scrambleTo(FROM));
  cta.addEventListener("focus", () => scrambleTo(TO));
  cta.addEventListener("blur", () => scrambleTo(FROM));

  render(false);
})();
